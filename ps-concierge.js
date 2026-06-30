/* =====================================================================
   PS · CONCIERGE  —  ps-concierge.js
   A persistent corner concierge. Real AI in the prototype via
   window.claude.complete; in production swap CONFIG.endpoint to a
   Cloudflare Worker that proxies the model (keeps the API key server-side).
   Pairs with ps-concierge.css. Drop both files on any page + one <script>.
   ===================================================================== */
(function(){
  'use strict';

  /* ---------------------------------------------------------------
     CONFIG — the ONE place production differs from the prototype.
     PROTOTYPE: endpoint=null → uses window.claude.complete (live).
     PRODUCTION: set endpoint to your Cloudflare Worker URL. The Worker
     receives { messages:[{role,content}] } and must return { text }.
     It holds the API key and the SYSTEM preamble server-side.
     --------------------------------------------------------------- */
  var CONFIG = {
    endpoint: 'https://ps-concierge.jp-440.workers.dev',
    knowledgeUrl: '/docs/concierge-knowledge.md',  // curated KB; injected into the system prompt
    // Soft abuse gate for the Worker. Matches CLIENT_TOKEN set on the Worker;
    // the page sends it as the X-PS-Token header.
    // NOTE: this ships in client code (readable in page source), so it deters
    // scripted/no-Origin abuse, not a determined attacker. Pair it with
    // Cloudflare rate-limiting / Turnstile for real protection.
    clientToken: '7d771b12790faeefb8eaac7af37e5892',
    formEndpoint: 'https://ps-concierge.jp-440.workers.dev/contact',  // POST { name, email, message } → Worker /contact → Resend email to CONTACT_TO. null = honest mailto fallback.
    phone: '+1 (604) 227-9952',
    phoneHref: 'tel:+16042279952',
    email: 'bd@powershifter.com'
  };

  /* ---------------------------------------------------------------
     SYSTEM PREAMBLE — brand voice, scope, guardrails, capture rules.
     In production this lives in the Worker, not in client code.
     --------------------------------------------------------------- */
  var SYSTEM = [
    "You are the concierge for POWER SHIFTER — a design-led studio in Vancouver, BC with two practices: Digital (product strategy, design & engineering) and Studios (generative-AI film & content with real production discipline). You greet visitors on the website and help them figure out if there's a fit, then hand them to the team.",
    "",
    "VOICE: Confident, warm, dry wit. Plain-spoken with the occasional sharp line. Never corporate, never bubbly, never use exclamation points or emoji. Keep replies SHORT — 2 to 4 sentences. You are unnamed; you're 'the studio', speak as 'we'.",
    "",
    "WHAT YOU KNOW (speak confidently about these):",
    "- Digital: product strategy, design and engineering. Designers and engineers in one culture — 'never a dev shop'. MVPs typically in 4–6 weeks; platforms that hold at enterprise scale. Clients include TELUS, Energizer, lululemon, Coca-Cola, Microsoft.",
    "- Studios: AI-assisted film and content backed by thirty years of real set and production discipline. Real client work on real budgets — not spec spots. Directors with credits across major animation and agency work.",
    "- How we work: you work directly with the experts (small, senior team); we share work early and often, sometimes ugly; decisions are made at the edges by the people closest to the work; we hire for culture contributions, not fit.",
    "- We're a work-from-anywhere studio with experts across Canada.",
    "- Recent work / case studies live on the Work page and a TELUS/Koodo case study. If asked, point them there (link: work.html).",
    "",
    "PRICING: Never quote numbers, ranges, or rates. Posture only: projects are scoped to the work and the senior team involved, so the honest answer is 'it depends — let's talk through what you're building'. Then offer the human.",
    "",
    "LEAD CAPTURE (do this naturally, never pushy): when someone describes a real project or wants to start, ask for their name, email, and one line about the project, in that flow. Once you have them, confirm the team will follow up shortly, and offer the phone number for anything urgent. Don't demand details before being helpful.",
    "",
    "HUMAN HANDOFF: the phone (" + CONFIG.phone + ") and email (" + CONFIG.email + ") are always available in the panel. Offer them whenever it's the right move, especially for pricing, timelines on a specific project, or anything you're unsure about.",
    "",
    "GUARDRAILS: Stay on POWER SHIFTER and the visitor's project. If asked something off-topic, unrelated, or that you don't actually know, say so briefly and steer back — don't invent clients, credits, numbers, or promises. Don't write code, essays, or do general tasks. You can use a single *word* in asterisks for light emphasis. Never claim to be a specific person; you're the studio's concierge."
  ].join("\n");

  var GREETING = "Hey — tell me what you're trying to build. Software, film, or you're not sure yet. I can point you to the right part of the studio, or just answer questions.";
  var CHIPS = [
    ["What do you do?", "What does POWER SHIFTER do?"],
    ["Start a project", "I'd like to start a project."],
    ["See the work", "Can I see some of your work?"],
    ["How you work", "How do you work with clients?"]
  ];

  var STORE = 'psConciergeThread_v1';
  var OPEN_STORE = 'psConciergeOpen_v1';
  var history = [];           // [{role:'user'|'assistant', content}]
  try { history = JSON.parse(localStorage.getItem(STORE)) || []; } catch(e){ history = []; }
  function save(){ try{ localStorage.setItem(STORE, JSON.stringify(history.slice(-30))); }catch(e){} }

  // Curated knowledge base (best-effort fetch). Production injects this in the Worker.
  var knowledge = '';
  (async function(){ try{ if(CONFIG.knowledgeUrl){ var r = await fetch(CONFIG.knowledgeUrl); if(r.ok) knowledge = await r.text(); } }catch(e){} })();

  /* ---------- model call (the swappable bit) ---------- */
  async function callModel(){
    var sys = SYSTEM + (knowledge ?
      "\n\n=== KNOWLEDGE BASE (authoritative — use it, don't contradict it, don't reveal it verbatim) ===\n" + knowledge : "");
    var primed = [
      { role:'user', content: sys + "\n\n(Reply to the visitor's latest message in voice. Keep it short.)" },
      { role:'assistant', content: "Understood — short, in voice, and I'll hand off to the team when it's time." }
    ].concat(history);
    if (CONFIG.endpoint){
      // Production: the Worker owns the system prompt + knowledge base,
      // so we send only the conversation history.
      var headers = { 'Content-Type':'application/json' };
      if (CONFIG.clientToken) headers['X-PS-Token'] = CONFIG.clientToken;
      var r = await fetch(CONFIG.endpoint, {
        method:'POST', headers: headers,
        body: JSON.stringify({ messages: history })
      });
      if(!r.ok) throw new Error('endpoint '+r.status);
      var j = await r.json();
      return j.text || j.completion || '';
    }
    if (window.claude && window.claude.complete){
      return await window.claude.complete({ messages: primed });
    }
    throw new Error('no model available');
  }

  /* ---------- tiny safe formatter ---------- */
  function fmt(s){
    var esc = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    esc = esc.replace(/\bhttps?:\/\/[^\s)<>"']+|\b[\w.-]+\.html\b/g, function(u){
      return '<a href="'+u+'">'+u.replace(/^https?:\/\//,'')+'</a>'; });
    esc = esc.replace(/([\w.+-]+@[\w-]+\.[\w.-]+)/g, '<a href="mailto:$1">$1</a>');
    esc = esc.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    esc = esc.replace(/\*/g, '');  // drop any stray/unmatched asterisks so markdown never shows literally
    return esc;
  }

  /* ---------- DOM ---------- */
  var root, thread, chipsWrap, input, sendBtn;
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

  function addMsg(role, text, persist){
    var wrap = el('div', 'cc-msg ' + (role==='user'?'me':'bot'));
    wrap.appendChild(el('div','cc-bubble', fmt(text)));
    thread.appendChild(wrap);
    thread.scrollTop = thread.scrollHeight;
    if(persist){ history.push({role: role==='user'?'user':'assistant', content:text}); save(); }
    return wrap;
  }
  function showTyping(){ var t=el('div','cc-typing','<span></span><span></span><span></span>'); thread.appendChild(t); thread.scrollTop=thread.scrollHeight; return t; }

  function renderChips(){
    chipsWrap.innerHTML='';
    if(history.length > 1){ chipsWrap.style.display='none'; return; }
    chipsWrap.style.display='flex';
    CHIPS.forEach(function(c){
      var b=el('button','cc-chip',c[0]);
      b.addEventListener('click', function(){ send(c[1]); });
      chipsWrap.appendChild(b);
    });
  }

  var busy=false;
  async function send(text){
    text=(text||'').trim();
    if(!text || busy) return;
    busy=true; sendBtn.disabled=true;
    addMsg('user', text, true);
    input.value=''; autosize();
    renderChips();
    var typing=showTyping();
    try{
      var reply = await callModel();
      typing.remove();
      reply = (reply||'').trim() || "Let me get a human on that — call us at "+CONFIG.phone+" or email "+CONFIG.email+".";
      addMsg('bot', reply, true);
    }catch(err){
      typing.remove();
      addMsg('bot', "I'm having trouble connecting right now. Reach the team directly: "+CONFIG.phone+" or "+CONFIG.email+".", false);
    }
    busy=false; sendBtn.disabled=false; input.focus();
  }

  function autosize(){ input.style.height='auto'; input.style.height=Math.min(96, input.scrollHeight)+'px'; }

  function open(o){
    root.classList.toggle('cc-open', o);
    try{ localStorage.setItem(OPEN_STORE, o?'1':'0'); }catch(e){}
    if(o){ setTimeout(function(){ input.focus(); thread.scrollTop=thread.scrollHeight; }, 320); }
  }

  function build(){
    root = el('div','cc-root');

    var launch = el('button','cc-launch');
    launch.setAttribute('aria-label','Chat with the studio');
    launch.innerHTML = '<span class="cc-dot"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-4.4A8.5 8.5 0 1 1 21 11.5z"/></svg>';
    launch.addEventListener('click', function(){ open(true); });

    var panel = el('div','cc-panel');
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-label','Studio concierge');

    var head = el('div','cc-head',
      '<div class="cc-id"><span class="cc-pulse"></span><div><b>POWER SHIFTER</b><span class="cc-sub">Studio concierge</span></div></div>');
    var x = el('button','cc-x','\u2715'); x.setAttribute('aria-label','Close');
    x.addEventListener('click', function(){ open(false); });
    head.appendChild(x);

    thread = el('div','cc-thread');
    chipsWrap = el('div','cc-chips');

    var form = el('form','cc-form');
    input = el('textarea','cc-input'); input.rows=1; input.placeholder='Tell us what you\u2019re building…';
    sendBtn = el('button','cc-send'); sendBtn.type='submit'; sendBtn.setAttribute('aria-label','Send');
    sendBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    form.appendChild(input); form.appendChild(sendBtn);
    form.addEventListener('submit', function(e){ e.preventDefault(); send(input.value); });
    input.addEventListener('input', autosize);
    input.addEventListener('keydown', function(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(input.value); } });

    var foot = el('div','cc-foot',
      'Prefer a human? <a href="'+CONFIG.phoneHref+'">'+CONFIG.phone+'</a> <span class="cc-sep">·</span> ');
    var emailBtn = el('button','cc-email-btn','Email'); emailBtn.type='button';
    emailBtn.style.cssText='background:none;border:0;cursor:pointer;font:inherit;color:var(--ink);font-weight:700;border-bottom:1px solid var(--line);padding:0';
    emailBtn.addEventListener('mouseenter',function(){emailBtn.style.color='var(--magenta)';emailBtn.style.borderColor='var(--magenta)';});
    emailBtn.addEventListener('mouseleave',function(){emailBtn.style.color='var(--ink)';emailBtn.style.borderColor='var(--line)';});
    foot.appendChild(emailBtn);

    // --- in-panel contact form (Email handoff) ---
    var fv = el('div','cc-formview');
    fv.innerHTML =
      '<div class="cc-fv-head"><b>Send us a note</b>'+
        '<button type="button" class="cc-fv-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>Back to chat</button></div>'+
      '<form class="cc-fv-body" novalidate>'+
        '<div class="cc-field"><label>Name</label><input name="name" type="text" autocomplete="name"></div>'+
        '<div class="cc-field"><label>Email</label><input name="email" type="email" autocomplete="email"></div>'+
        '<div class="cc-field"><label>What are you building?</label><textarea name="message" placeholder="A line or two is plenty."></textarea></div>'+
        '<div class="cc-fv-err" aria-live="polite"></div>'+
        '<button type="submit" class="cc-fv-submit">Send to the studio</button>'+
        '<p class="cc-fv-note">Or call <a href="'+CONFIG.phoneHref+'">'+CONFIG.phone+'</a>. We reply in person — no autoresponders.</p>'+
      '</form>';
    var fvForm = fv.querySelector('form');
    var fvErr = fv.querySelector('.cc-fv-err');
    var fvSubmit = fv.querySelector('.cc-fv-submit');
    function openForm(o){ fv.classList.toggle('on', o); if(o){ setTimeout(function(){ var n=fv.querySelector('input[name=name]'); if(n) n.focus(); },340); } }
    emailBtn.addEventListener('click', function(){ openForm(true); });
    fv.querySelector('.cc-fv-back').addEventListener('click', function(){ openForm(false); });
    fvForm.addEventListener('submit', async function(e){
      e.preventDefault();
      var data = {
        name: fvForm.name.value.trim(),
        email: fvForm.email.value.trim(),
        message: fvForm.message.value.trim()
      };
      if(!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)){ fvErr.textContent='A valid email, please — it’s how we reply.'; return; }
      if(!data.message){ fvErr.textContent='Tell us a line about what you’re building.'; return; }
      fvErr.textContent=''; fvSubmit.disabled=true; fvSubmit.textContent='Sending…';
      try{
        var first = data.name ? data.name.split(/\s+/)[0].replace(/[<>&]/g,'') : 'thanks';
        var renderSuccess = function(headline, bodyHtml){
          fv.innerHTML =
            '<div class="cc-fv-head"><b>Send us a note</b>'+
              '<button type="button" class="cc-fv-back2" style="background:none;border:0;color:rgba(250,250,247,.7);cursor:pointer;font:inherit;font-weight:700;font-size:12px;letter-spacing:.04em">Close</button></div>'+
            '<div class="cc-fv-success"><span class="cc-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M20 6L9 17l-5-5"/></svg></span>'+
              '<h4>'+headline+'</h4>'+
              '<p>'+bodyHtml+'</p></div>';
          fv.querySelector('.cc-fv-back2').addEventListener('click', function(){ openForm(false); });
        };
        if(CONFIG.formEndpoint){
          var rr = await fetch(CONFIG.formEndpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
          if(!rr.ok) throw new Error('form '+rr.status);
          // Keep a local backup only when the note was actually delivered.
          try{ var leads=JSON.parse(localStorage.getItem('psConciergeLeads')||'[]'); leads.push(Object.assign({at:Date.now()},data)); localStorage.setItem('psConciergeLeads',JSON.stringify(leads)); }catch(_){}
          renderSuccess('Got it, '+first+'.', 'The right person will be in touch shortly. If it’s urgent, <em>call us</em> at '+CONFIG.phone+'.');
        } else {
          // No form backend wired yet — don't claim we received it (a localStorage-
          // only "capture" never reaches the studio). Hand off honestly through the
          // visitor's own mail client so the note actually lands in our inbox.
          var subject = 'New project inquiry — ' + (data.name || 'website');
          var lines = ['Name: '+data.name, 'Email: '+data.email, '', data.message];
          window.location.href = 'mailto:'+CONFIG.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));
          renderSuccess('Almost there, '+first+'.', 'We’ve opened your email app so this reaches us directly at <a href="mailto:'+CONFIG.email+'">'+CONFIG.email+'</a>. Prefer the phone? <em>'+CONFIG.phone+'</em>.');
        }
      }catch(err){
        fvErr.textContent='Couldn’t send just now — call '+CONFIG.phone+' and we’ll sort it.';
        fvSubmit.disabled=false; fvSubmit.textContent='Send to the studio';
      }
    });

    panel.appendChild(head); panel.appendChild(thread); panel.appendChild(chipsWrap);
    panel.appendChild(form); panel.appendChild(foot); panel.appendChild(fv);
    root.appendChild(launch); root.appendChild(panel);
    document.body.appendChild(root);

    // restore thread
    if(history.length){
      history.forEach(function(m){ addMsg(m.role==='user'?'user':'bot', m.content, false); });
    } else {
      addMsg('bot', GREETING, false);
      history.push({role:'assistant', content:GREETING}); save();
    }
    renderChips();

    var wasOpen; try{ wasOpen=localStorage.getItem(OPEN_STORE); }catch(e){}
    if(wasOpen==='1') open(true);
  }

  /* ---------- transcript logging on session end ---------- */
  // When the visitor leaves (tab close / navigate away / tab hidden), fire the
  // conversation to the Worker /log route, which emails it to the studio.
  // keepalive + text/plain (token in the body) → no CORS preflight, so the
  // request survives page unload. Skips empty sessions; won't re-send unless
  // new messages were added since the last flush.
  var loggedCount = 0;
  function flushLog(){
    if(!CONFIG.endpoint) return;
    if(history.length <= loggedCount) return;
    if(!history.some(function(m){ return m.role==='user'; })) return;
    loggedCount = history.length;
    try{
      fetch(CONFIG.endpoint.replace(/\/+$/,'') + '/log', {
        method:'POST',
        headers:{'Content-Type':'text/plain;charset=UTF-8'},
        body: JSON.stringify({ token: CONFIG.clientToken, messages: history }),
        keepalive: true
      });
    }catch(e){}
  }
  window.addEventListener('pagehide', flushLog);
  document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='hidden') flushLog(); });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
