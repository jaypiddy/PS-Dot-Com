/* =====================================================================
   PS · CRAFT LAYER  —  ps-spice.js
   Additive interaction layer for the Power Shifter "Two Voices" pages.
   Pairs with ps-spice.css. All modules target existing class names so
   the layer ports into digital.html / studios.html unchanged.
   ===================================================================== */
(function(){
  'use strict';
  var FINE = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var REDUCE = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var body = document.body;

  /* ---- state ------------------------------------------------------- */
  var MODS = [
    ['magnetic','Magnetic CTAs',     'Primary buttons lean toward the pointer, then snap home.'],
    ['reveal',  'Magenta-wipe media','Frames unveil under a magenta swipe — the link-swipe DNA, on imagery.'],
    ['kinetic', 'Kinetic Two-Voices','The serif voice line grows and draws a magenta underline on entry.'],
    ['index',   'Editorial index',   'Outlined section numerals give the scroll a spine.'],
    ['rules',   'Drawn hairlines',   'House rules draw on; every paper→ink flip gets a magenta seam.'],
    ['skew',    'Scroll inertia',    'Media drifts against scroll velocity for weight. (subtle)']
  ];
  var DEFAULT = {master:true,mods:{magnetic:true,reveal:true,kinetic:true,index:true,rules:true,skew:true}};
  var state;
  try{ state = JSON.parse(localStorage.getItem('psSpiceState')) || null; }catch(e){ state = null; }
  if(!state){ state = JSON.parse(JSON.stringify(DEFAULT)); }
  // backfill any new modules
  MODS.forEach(function(m){ if(!(m[0] in state.mods)) state.mods[m[0]] = true; });
  function save(){ try{ localStorage.setItem('psSpiceState', JSON.stringify(state)); }catch(e){} }

  /* Review mode (body[data-spice-review]) renders the control panel and swaps
     Cloudflare Stream embeds for posters so the sandbox stays fast. Production
     pages omit the attribute: all modules ship ON, no panel, real <iframe>s. */
  var REVIEW = document.body.hasAttribute('data-spice-review');
  if(!REVIEW){ state = {master:true, mods:{}}; MODS.forEach(function(m){ state.mods[m[0]] = true; }); }

  function apply(){
    body.classList.toggle('spice-on', state.master);
    MODS.forEach(function(m){
      body.classList.toggle('sp-'+m[0], !!(state.master && state.mods[m[0]]));
    });
  }

  /* ================================================================
     SECTION HOSTS — numerals, ink detection, magenta seam edges
     ================================================================ */
  function luminance(rgb){
    var m = (rgb||'').match(/\d+\.?\d*/g); if(!m) return 1;
    var r=+m[0]/255,g=+m[1]/255,b=+m[2]/255,a=(m[3]===undefined?1:+m[3]);
    if(a<0.5) return 1; // transparent → treat as paper
    return 0.2126*r+0.7152*g+0.0722*b;
  }
  function buildHosts(){
    var secs = [].slice.call(document.querySelectorAll('body > section'));
    var n = 0;
    secs.forEach(function(sec, i){
      sec.classList.add('sp-host');
      var dark = luminance(getComputedStyle(sec).backgroundColor) < 0.4;
      // class-based fallbacks for known ink sections
      if(/\b(validator-band|reel-hero|proof-bar)\b/.test(sec.className) ||
         (sec.classList.contains('work'))) dark = true;
      if(dark) sec.classList.add('on-ink');
      // magenta seam on ink-flip sections (skip the first hero)
      if(dark && i>0){
        var edge = document.createElement('span'); edge.className='sp-edge';
        sec.insertBefore(edge, sec.firstChild);
      }
      // editorial numeral — skip the hero (i===0); number the rest
      if(i>0){
        n++;
        var idx = document.createElement('span');
        idx.className='sp-idx'; idx.setAttribute('aria-hidden','true');
        idx.textContent = (n<10?'0':'')+n;
        sec.insertBefore(idx, sec.firstChild);
      }
    });
  }

  /* ================================================================
     IN-VIEW OBSERVER — adds .sp-in (CSS reacts only when module on)
     ================================================================ */
  function buildObserver(){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('sp-in'); io.unobserve(e.target); }
      });
    },{threshold:0.16, rootMargin:'0px 0px -8% 0px'});
    var sel = '.sp-host, .frame, .wframe, .rule, em.voice, .voice.mag, .sp-band-rule, .quote-banner';
    document.querySelectorAll(sel).forEach(function(el){ io.observe(el); });
  }

  /* ================================================================
     STREAM PLACEHOLDER — keep the review sandbox fast & hang-free
     ================================================================ */
  function neutralizeStream(){
    function block(label, showPlay){
      var d = document.createElement('div'); d.className='sp-stream';
      d.innerHTML = '<div class="sp-play">'+(showPlay?'<b>\u25B6</b>':'')+'<span>'+label+'</span></div>';
      return d;
    }
    var reel = document.querySelector('iframe.reel-video');
    if(reel && reel.parentNode){ reel.parentNode.replaceChild(block('Showreel', false), reel); }
    document.querySelectorAll('.video-frame iframe').forEach(function(f){
      if(f.parentNode) f.parentNode.replaceChild(block('Watch', true), f);
    });
  }

  /* ================================================================
     MAGNETIC CTAs  (always bound; acts only when sp-magnetic on)
     ================================================================ */
  function buildMagnetic(){
    if(!FINE || REDUCE) return;
    document.querySelectorAll('.btn').forEach(function(btn){
      var r=null;
      btn.addEventListener('mouseenter', function(){ r=btn.getBoundingClientRect(); });
      btn.addEventListener('mousemove', function(e){
        if(!body.classList.contains('sp-magnetic') || !r) return;
        var dx=(e.clientX-(r.left+r.width/2))*0.28;
        var dy=(e.clientY-(r.top+r.height/2))*0.4;
        dx=Math.max(-12,Math.min(12,dx)); dy=Math.max(-8,Math.min(8,dy));
        btn.style.transform='translate('+dx+'px,'+dy+'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform=''; });
    });
  }

  /* ================================================================
     SCROLL INERTIA  (sets --sp-shift; CSS applies when sp-skew on)
     ================================================================ */
  function buildSkew(){
    if(REDUCE) return;
    var last=window.scrollY, shift=0, target=0, raf=null;
    function onScroll(){
      if(!body.classList.contains('sp-skew')){ last=window.scrollY; return; }
      var y=window.scrollY, v=y-last; last=y;
      target=Math.max(-9,Math.min(9, -v*0.4));
      if(!raf) raf=requestAnimationFrame(tick);
    }
    function tick(){
      shift+=(target-shift)*0.18; target*=0.86;
      document.documentElement.style.setProperty('--sp-shift', shift.toFixed(2)+'px');
      if(Math.abs(shift)>0.05 || Math.abs(target)>0.05){ raf=requestAnimationFrame(tick); }
      else { document.documentElement.style.setProperty('--sp-shift','0px'); raf=null; }
    }
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* ================================================================
     CONTROL PANEL
     ================================================================ */
  function buildPanel(){
    var launch = document.createElement('button');
    launch.className='ps-launch'; launch.setAttribute('aria-label','Open Craft Layer controls');
    launch.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/></svg>';

    var panel = document.createElement('aside');
    panel.className='ps-panel'; panel.setAttribute('aria-label','Craft Layer controls');
    var rows = MODS.map(function(m){
      return '<label class="ps-mod" data-mod="'+m[0]+'">'+
        '<span class="ps-mc"><span class="ps-mn">'+m[1]+'</span>'+
        '<span class="ps-md">'+m[2]+'</span></span>'+
        '<input type="checkbox" class="ps-sw" data-mod="'+m[0]+'"></label>';
    }).join('');
    panel.innerHTML =
      '<div class="ps-phead"><span class="ps-ey">Craft Layer</span>'+
        '<button class="ps-x" aria-label="Collapse">\u2715</button></div>'+
      '<div class="ps-master"><div><span class="ps-mt">Spice</span>'+
        '<span class="ps-ms">Toggle the layer to compare against the shipped page.</span></div>'+
        '<input type="checkbox" class="ps-sw" id="ps-master"></div>'+
      '<div class="ps-mods">'+rows+'</div>'+
      '<div class="ps-foot">Ships as <code>ps-spice.css</code> + <code>ps-spice.js</code> — drop in, add <code>class="spice-on"</code>. No brand tokens overridden.</div>';

    document.body.appendChild(launch); document.body.appendChild(panel);

    var master = panel.querySelector('#ps-master');
    var modSws = [].slice.call(panel.querySelectorAll('.ps-mods .ps-sw'));
    function sync(){
      master.checked = state.master;
      modSws.forEach(function(sw){
        var k=sw.dataset.mod; sw.checked=state.mods[k]; sw.disabled=!state.master;
        sw.closest('.ps-mod').classList.toggle('off', !state.master || !state.mods[k]);
      });
    }
    master.addEventListener('change', function(){ state.master=master.checked; save(); apply(); sync(); });
    modSws.forEach(function(sw){
      sw.addEventListener('change', function(){ state.mods[sw.dataset.mod]=sw.checked; save(); apply(); sync(); });
    });
    function open(o){ panel.hidden=!o; launch.hidden=o; try{localStorage.setItem('psSpicePanel',o?'1':'0');}catch(e){} }
    launch.addEventListener('click', function(){ open(true); });
    panel.querySelector('.ps-x').addEventListener('click', function(){ open(false); });
    var wasOpen; try{ wasOpen=localStorage.getItem('psSpicePanel'); }catch(e){}
    open(wasOpen==='1');   // default collapsed
    sync();
  }

  /* ================================================================
     REVEAL SAFETY NET
     The pages reveal headlines (.rise) and blocks (.reveal/.proof-row)
     via IntersectionObserver. Some embedded/preview environments don't
     fire IO reliably, leaving content stuck in its pre-animation state.
     This reveals by direct geometry on load + scroll — idempotent with
     the page's own observer, so it's a no-op in a normal browser tab.
     ================================================================ */
  function revealSafety(){
    var inEls  = [].slice.call(document.querySelectorAll('.rise, .reveal, .proof-row'));
    var spEls  = [].slice.call(document.querySelectorAll('.sp-host, .frame, .wframe, em.voice, .voice.mag, .rule, .sp-band-rule, .quote-banner'));
    function check(){
      var vh = window.innerHeight || 800;
      inEls = inEls.filter(function(el){
        if(el.getBoundingClientRect().top < vh*0.9){ el.classList.add('in'); if(el.classList.contains('proof-row')) el.classList.add('go'); return false; }
        return true;
      });
      spEls = spEls.filter(function(el){
        if(el.getBoundingClientRect().top < vh*0.92){ el.classList.add('sp-in'); return false; }
        return true;
      });
      if(!inEls.length && !spEls.length) window.removeEventListener('scroll', check);
    }
    check();
    window.addEventListener('scroll', check, {passive:true});
    setTimeout(check, 400); setTimeout(check, 1400);
  }

  /* ================================================================
     BAND DIVIDER — a hairline between the two engine "expression"
     modules (the one-two punch), per design review.
     ================================================================ */
  function buildBandRules(){
    var mods = [].slice.call(document.querySelectorAll('.engine.how-band'));
    for(var k=0;k<mods.length-1;k++){
      var a=mods[k], b=mods[k+1];
      if(a.nextElementSibling===b){
        var d=document.createElement('div');
        d.className='sp-band-rule sp-host';
        d.innerHTML='<div class="wrap"><span class="sp-br-line"></span></div>';
        a.parentNode.insertBefore(d, b);
      }
    }
  }

  /* ================================================================
     TESTIMONIAL WORD CASCADE — split .quote-t into words so they rise
     in reading order (top-left first) when the banner enters view.
     ================================================================ */
  function buildQuotes(){
    document.querySelectorAll('.quote-t').forEach(function(q){
      if(q.querySelector('.qw')) return;
      var parts = q.textContent.split(/(\s+)/);
      q.textContent = '';
      var i = 0;
      parts.forEach(function(part){
        if(!part) return;
        if(/^\s+$/.test(part)){ q.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement('span'); s.className = 'qw';
        s.style.setProperty('--qi', i++); s.textContent = part;
        q.appendChild(s);
      });
      var sec = q.closest('.quote-banner');
      if(sec) sec.style.setProperty('--qcount', i);
    });
  }

  /* ---- boot -------------------------------------------------------- */
  function boot(){
    if(REVIEW) neutralizeStream();
    buildBandRules();
    buildQuotes();
    buildHosts();
    buildObserver();
    buildMagnetic();
    buildSkew();
    if(REVIEW) buildPanel();
    revealSafety();
    apply();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* =====================================================================
   HEADER COLOR FLIP  (QA 2026-07)
   One shared IntersectionObserver replaces the per-page scroll-band math
   (offsetTop arithmetic + a magic +40px probe) that drifted across
   breakpoints. The observer's intersection region is the header's own
   strip: a dark section under the header → paper nav; otherwise ink.
   Dark set = union of every page's old list; missing selectors are
   simply not observed, so one implementation serves all 96 pages.
   ===================================================================== */
(function(){
  'use strict';
  function boot(){
    var nav = document.getElementById('nav');
    var header = document.querySelector('header');
    if(!nav || !header) return;
    // Dark bands are DETECTED by computed background, not named: the same class
    // is ink on one page and paper on another (.engine on /digital vs the
    // homepage), which is exactly how the old hardcoded lists drifted.
    function isDark(el){
      var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(getComputedStyle(el).backgroundColor);
      if(!m) return false;
      if(m[4] !== undefined && parseFloat(m[4]) < 0.5) return false; // (semi)transparent → inherits paper
      return (0.2126*m[1] + 0.7152*m[2] + 0.0722*m[3]) / 255 < 0.35;
    }
    var darks = Array.prototype.filter.call(
      document.querySelectorAll('section, footer, .cs-screening, .cs-ep'), isDark);
    if(!darks.length) return;
    var io = null;
    // The observer is only the TRIGGER; the truth is read from live geometry
    // every time. (A stateful per-entry map went stale when the page loaded in
    // a hidden tab — IO delivery is suspended there and entries coalesce.)
    function headerH(){ return Math.max(1, Math.round(header.getBoundingClientRect().height)); }
    function apply(){
      var h = headerH(), inDark = false;
      for(var i = 0; i < darks.length; i++){
        var r = darks[i].getBoundingClientRect();
        if(r.bottom > 0 && r.top < h){ inDark = true; break; }
      }
      nav.style.color = inDark ? 'var(--paper)' : 'var(--ink)';
      header.classList.toggle('on-light', !inDark);
    }
    function build(){
      if(io) io.disconnect();
      // Shrink the observer's root box to the top header-strip of the viewport.
      var bottomInset = -Math.max(1, window.innerHeight - headerH());
      io = new IntersectionObserver(apply, { rootMargin: '0px 0px ' + bottomInset + 'px 0px' });
      darks.forEach(function(el){ io.observe(el); });
      apply();
    }
    build();
    var rT = null;
    window.addEventListener('resize', function(){ clearTimeout(rT); rT = setTimeout(build, 150); });
    document.addEventListener('visibilitychange', function(){ if(!document.hidden) build(); });
    // Belt-and-braces: IO callbacks ride on rendering frames, which Chrome
    // suspends for occluded windows — and boot can run before first layout
    // (zero rects → "no dark band" → wrong state that nothing corrects until
    // a frame). A timestamp-throttled scroll fallback + a load re-check keep
    // the header honest in every environment; apply() is ~5 rect reads.
    var sLast = 0, sTrail = null;
    window.addEventListener('scroll', function(){
      var now = Date.now();
      if(now - sLast > 120){ sLast = now; apply(); }
      clearTimeout(sTrail); sTrail = setTimeout(apply, 160);
    }, {passive:true});
    window.addEventListener('load', apply);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
