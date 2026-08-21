/**
 * ps-images — upload proxy for Cloudflare Images and Stream.
 *
 * Exists so the Cloudflare API token stays on Cloudflare. Without this, the
 * token has to sit in a chat window, a laptop shell, or a repo, and a token
 * scoped to Images: Edit can overwrite every asset on the site.
 *
 *   POST /upload         multipart file=<image>   -> { id, urls, variants }
 *   POST /upload/video   multipart file=<video>   -> { uid, playback }
 *   GET  /health                                  -> { ok, images, stream }
 *
 * Every request needs `X-Upload-Key: <UPLOAD_KEY>`. That is a real secret,
 * unlike ps-concierge's CLIENT_TOKEN, which is published in page source.
 *
 * Response shape is built around the one thing the pipeline actually consumes:
 * `id`. fetch_notion.py reads image URLs off the Notion row, and those URLs are
 * derived from this id plus a variant name — so one upload yields the masthead,
 * the listing thumbnail and the social card, each correctly cropped, instead of
 * the same 16:9 file being reused for a 1.91:1 slot.
 */

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body, null, 2) + "\n", {
    status,
    headers: { ...JSON_HEADERS, ...extra },
  });
}

/**
 * Length-independent comparison. `a === b` on secrets leaks length and
 * position through timing; over the public internet that is mostly theoretical,
 * but this costs nothing.
 */
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

/** Rate limiter binding, absent in local dev. Fails open, as ps-concierge does. */
async function allowed(limiter, key) {
  if (!limiter) return true;
  try {
    const { success } = await limiter.limit({ key });
    return success;
  } catch {
    return true;
  }
}

function cfApi(env, path) {
  return `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}${path}`;
}

function variantUrls(env, id) {
  const hash = env.CF_IMAGES_HASH;
  if (!hash) return {};
  const names = (env.IMAGE_VARIANTS || "public")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const out = {};
  for (const v of names) out[v] = `https://imagedelivery.net/${hash}/${id}/${v}`;
  return out;
}

/** Config problems should surface as a clear 500, not a confusing 4xx from Cloudflare. */
function missingConfig(env, needStream = false) {
  const missing = [];
  if (!env.UPLOAD_KEY) missing.push("UPLOAD_KEY (secret)");
  if (!env.CF_IMAGES_TOKEN) missing.push("CF_IMAGES_TOKEN (secret)");
  if (!env.CF_ACCOUNT_ID) missing.push("CF_ACCOUNT_ID (var)");
  if (!needStream && !env.CF_IMAGES_HASH) missing.push("CF_IMAGES_HASH (var)");
  return missing;
}

async function readFile(request, env, maxBytes) {
  const ct = request.headers.get("Content-Type") || "";
  if (!ct.includes("multipart/form-data")) {
    return { error: "send multipart/form-data with a `file` field" };
  }
  let form;
  try {
    form = await request.formData();
  } catch {
    return { error: "could not parse the multipart body" };
  }
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return { error: "no `file` field in the form data" };
  }
  if (maxBytes && file.size > maxBytes) {
    return {
      error: `file is ${file.size} bytes, over the ${maxBytes} limit`,
      bytes: file.size,
      limit: maxBytes,
    };
  }
  return { file, meta: form.get("metadata") };
}

async function handleImage(request, env) {
  const max = parseInt(env.MAX_IMAGE_BYTES || "10485760", 10);
  const got = await readFile(request, env, max);
  if (got.error) return json(got, 400);

  const body = new FormData();
  body.append("file", got.file, got.file.name || "upload");
  // Notion and the site both treat these as public assets.
  body.append("requireSignedURLs", "false");
  if (got.meta) body.append("metadata", got.meta);

  const res = await fetch(cfApi(env, "/images/v1"), {
    method: "POST",
    headers: { Authorization: `Bearer ${env.CF_IMAGES_TOKEN}` },
    body,
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    return json({ error: "cloudflare returned a non-JSON response", status: res.status }, 502);
  }
  if (!res.ok || !payload.success) {
    // Pass Cloudflare's own errors through — they name the actual problem
    // (bad token scope, unsupported format) far better than a generic message.
    return json({ error: "cloudflare rejected the upload", cloudflare: payload.errors || payload }, res.status || 502);
  }

  const id = payload.result?.id;
  return json({
    id,
    urls: variantUrls(env, id),
    filename: payload.result?.filename,
    uploaded: payload.result?.uploaded,
    // Paste this into the Notion row's Cloudflare Image ID field.
    note: "put `id` in Notion; fetch_notion.py derives the URLs from it",
  });
}

async function handleVideo(request, env) {
  // Stream accepts a direct POST for modest files; anything large should use a
  // tus upload instead. 200 MB is a deliberately conservative ceiling here.
  const got = await readFile(request, env, 200 * 1024 * 1024);
  if (got.error) return json(got, 400);

  const body = new FormData();
  body.append("file", got.file, got.file.name || "upload");

  const res = await fetch(cfApi(env, "/stream"), {
    method: "POST",
    headers: { Authorization: `Bearer ${env.CF_IMAGES_TOKEN}` },
    body,
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    return json({ error: "cloudflare returned a non-JSON response", status: res.status }, 502);
  }
  if (!res.ok || !payload.success) {
    return json({ error: "cloudflare rejected the upload", cloudflare: payload.errors || payload }, res.status || 502);
  }

  const uid = payload.result?.uid;
  return json({
    uid,
    playback: payload.result?.playback,
    // The site plays Stream through a plain <video> with MP4 download enabled,
    // per the case-study pattern — not the Stream embed player.
    mp4: `https://customer-${env.CF_STREAM_CUSTOMER || "xv1aafyshr3tbknu"}.cloudflarestream.com/${uid}/downloads/default.mp4`,
    note: "MP4 download must be enabled on the video before that URL resolves",
  });
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname.replace(/\/+$/, "");

    if (path.endsWith("/health")) {
      return json({
        ok: true,
        images: Boolean(env.CF_IMAGES_TOKEN && env.CF_ACCOUNT_ID),
        hash: Boolean(env.CF_IMAGES_HASH),
        auth: Boolean(env.UPLOAD_KEY),
        variants: (env.IMAGE_VARIANTS || "").split(",").filter(Boolean),
      });
    }

    if (request.method !== "POST") {
      return json({ error: "method not allowed" }, 405, { Allow: "POST" });
    }

    const missing = missingConfig(env, path.endsWith("/video"));
    if (missing.length) {
      return json({ error: "worker is not configured", missing }, 500);
    }

    // No CORS headers anywhere in this Worker, and that is deliberate: nothing
    // in a browser should ever call it. A missing Access-Control-Allow-Origin
    // is the enforcement.
    if (!safeEqual(request.headers.get("X-Upload-Key") || "", env.UPLOAD_KEY)) {
      return json({ error: "bad or missing X-Upload-Key" }, 401);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!(await allowed(env.UPLOAD_LIMITER, ip + ":upload"))) {
      return json({ error: "rate_limited" }, 429);
    }

    if (path.endsWith("/upload/video")) return handleVideo(request, env);
    if (path.endsWith("/upload")) return handleImage(request, env);

    return json({ error: "not found", routes: ["/upload", "/upload/video", "/health"] }, 404);
  },
};
