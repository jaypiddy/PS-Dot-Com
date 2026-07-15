/* PS · The Signal — newsletter signup.
 *
 * The field shipped as a design placeholder: a bare <input> + <button
 * type="button"> in a <div>, with no <form>, no handler and no endpoint. It
 * accepted an address and silently did nothing — worse than an error, because
 * the visitor believed they'd subscribed (QA 2026-07-14, JP). This wires it to
 * the concierge Worker's POST /subscribe, which holds the Campaign Monitor API
 * key server-side and forwards to the list.
 *
 * Class-based, not id-based: two pages (article.html's placeholder body, and
 * design-sprint-day-four.html) carry a second in-body .signal block alongside
 * the footer .news one, so a page can have more than one form.
 *
 * The markup is now a real <form>, so Enter submits and the browser's own email
 * validation runs first. This file intercepts submit, posts JSON, and reports
 * the outcome inline — the whole point being that a signup either confirms or
 * says why, and never fails silently again.
 *
 * Endpoint + token mirror ps-concierge.js CONFIG (same Worker, same soft
 * shared-token gate). The token ships in client code by design — a speed-bump
 * against scripted abuse, not a secret. The Worker's per-IP rate limit is the
 * real protection, and the CM key never leaves the Worker.
 */
(function () {
  var ENDPOINT = 'https://ps-concierge.jp-440.workers.dev/subscribe';
  var TOKEN = '7d771b12790faeefb8eaac7af37e5892';
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  var forms = document.querySelectorAll('form.js-signal');
  if (!forms.length) return;

  Array.prototype.forEach.call(forms, function (form) {
    var input = form.querySelector('input[type=email]');
    var hp = form.querySelector('input[name=company]');
    var btn = form.querySelector('button');
    // Each form owns the status line that follows it inside the same block.
    var msg = form.parentElement && form.parentElement.querySelector('.signal-msg');
    var busy = false;

    function say(text, isErr) {
      if (!msg) return;
      msg.textContent = text;
      msg.classList.toggle('is-err', !!isErr);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;

      var email = (input.value || '').trim();
      if (!EMAIL_RE.test(email)) {
        say('That email doesn’t look right.', true);
        input.focus();
        return;
      }

      busy = true;
      btn.disabled = true;
      say('Signing you up…');

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-PS-Token': TOKEN },
        body: JSON.stringify({ email: email, company: hp ? hp.value : '' })
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (d) {
            return { status: r.status, ok: r.ok, data: d };
          });
        })
        .then(function (res) {
          if (res.ok && res.data.ok) {
            form.reset();
            say('You’re on the list. Watch for The Signal.');
          } else if (res.status === 429) {
            say('One moment — try that again shortly.', true);
          } else if (res.data.error === 'invalid email') {
            say('That email doesn’t look right.', true);
          } else {
            say('Couldn’t sign you up just now — email jp@powershifter.com and we’ll add you.', true);
          }
        })
        .catch(function () {
          say('Couldn’t sign you up just now — email jp@powershifter.com and we’ll add you.', true);
        })
        .then(function () {
          busy = false;
          btn.disabled = false;
        });
    });
  });
})();
