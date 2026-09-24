/* ==========================================================================
   TAB Brand Studio controller.
   Loads a template into a same-origin iframe and drives it through window.TAB
   (see _template.js). Nothing here knows template internals: inputs are generated
   from [data-field] nodes, styles from the template's declared variants.
   ========================================================================== */
(function () {
  'use strict';

  // Pinned + integrity-checked. Injected into the template iframe on first export.
  var HTML_TO_IMAGE = {
    src: 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.js',
    integrity: 'sha384-Tha/42qsYmpYmQ07pX+nJzkKumO0BzKJxK/uzVc7xyBQxVCUgQBhQIG8L7vXK+9C'
  };

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    grid: $('template-grid'), fields: $('fields'), variants: $('variants'), secVariant: $('sec-variant'),
    secPhoto: $('sec-photo'), photoGrid: $('photo-grid'), fx: $('focus-x'), fy: $('focus-y'), fxOut: $('focus-x-out'), fyOut: $('focus-y-out'),
    frame: $('frame'), wrap: $('frame-wrap'), preview: $('preview'), loading: $('loading'),
    size: $('size-label'), zoom: $('zoom-label'), title: $('doc-title'), openRaw: $('open-raw'),
    download: $('download-png'), share: $('share-link'), copySig: $('copy-signature'),
    status: $('check-status'), issues: $('check-issues'), rules: $('check-rules'), toast: $('toast'), warning: $('server-warning')
  };

  var S = {
    catalog: null, id: null, win: null, TAB: null, meta: {}, defaults: null,
    uploaded: null, fontCSS: null, unsubscribe: null, inputs: {}, loadToken: 0
  };

  /* ---------------- utilities ---------------- */
  function debounce(fn, ms) { var t; return function () { var a = arguments; clearTimeout(t); t = setTimeout(function () { fn.apply(null, a); }, ms); }; }
  var toastTimer;
  function toast(msg, isError) {
    el.toast.textContent = msg;
    el.toast.classList.toggle('is-error', !!isError);
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.hidden = true; }, isError ? 7000 : 3500);
  }
  function parseHash() {
    var h = location.hash.replace(/^#/, '');
    if (!h) return null;
    try { h = decodeURIComponent(h); } catch (e) { /* noop */ }
    try { return JSON.parse(h); } catch (e) { return null; }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
    return Promise.resolve(legacyCopy(text));
  }
  function legacyCopy(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }
  function showServerWarning() { el.warning.hidden = false; }

  /* ---------------- boot ---------------- */
  function init() {
    if (location.protocol === 'file:') showServerWarning();
    fetch('catalog.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (catalog) {
        S.catalog = catalog;
        renderTemplateGrid();
        var fromHash = parseHash();
        var ids = catalog.templates.map(function (t) { return t.id; });
        var id = fromHash && ids.indexOf(fromHash.template) >= 0 ? fromHash.template : ids[0];
        if (fromHash && fromHash.template) $('picker').open = false;
        loadTemplate(id, fromHash);
      })
      .catch(function (e) { console.error(e); showServerWarning(); el.title.textContent = 'Could not load catalog.json'; });

    new ResizeObserver(fit).observe(el.preview);
    el.download.addEventListener('click', downloadPng);
    el.share.addEventListener('click', copyShareLink);
    el.copySig.addEventListener('click', copySignature);
    $('reset-content').addEventListener('click', resetContent);
    $('focus-reset').addEventListener('click', function () { setFocus(50, 50); });
    el.fx.addEventListener('input', function () { setFocus(+el.fx.value, +el.fy.value); });
    el.fy.addEventListener('input', function () { setFocus(+el.fx.value, +el.fy.value); });
  }

  /* ---------------- template picker ---------------- */
  function renderTemplateGrid() {
    el.grid.innerHTML = '';
    S.catalog.templates.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tpl-card'; b.dataset.id = t.id; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<div class="tpl-thumb"><img alt="" loading="lazy" src="../exports/' + esc(t.id) + '.png"></div>' +
        '<div class="tpl-name">' + esc(t.name) + '</div><div class="tpl-size">' + t.size[0] + '×' + t.size[1] + ' · ' + esc(t.use) + '</div>';
      b.querySelector('img').addEventListener('error', function () { this.parentNode.innerHTML = '<span>' + t.size[0] + '×' + t.size[1] + '</span>'; });
      b.title = t.name + ' · ' + t.size[0] + '×' + t.size[1] + ' · ' + t.use;
      b.addEventListener('click', function () { if (t.id !== S.id) loadTemplate(t.id, null); $('picker').open = false; });
      el.grid.appendChild(b);
    });
  }

  /* ---------------- load a template into the iframe ---------------- */
  function loadTemplate(id, initial) {
    var token = ++S.loadToken;
    S.id = id;
    if (S.unsubscribe) { try { S.unsubscribe(); } catch (e) { /* old frame gone */ } S.unsubscribe = null; }
    S.TAB = null; S.win = null;
    el.loading.hidden = false;
    Array.prototype.forEach.call(el.grid.children, function (c) { c.setAttribute('aria-pressed', String(c.dataset.id === id)); });
    var t = S.catalog.templates.filter(function (x) { return x.id === id; })[0];
    $('picker-current').innerHTML = '<span class="tpl-thumb"><img alt="" src="../exports/' + esc(id) + '.png"></span>' +
      '<span class="picker-text"><span class="tpl-name">' + esc(t.name) + '</span><span class="tpl-size">' + t.size[0] + '×' + t.size[1] + ' · ' + esc(t.use) + '</span></span>' +
      '<span class="picker-toggle" aria-hidden="true"></span>';

    el.frame.onload = function () {
      if (token !== S.loadToken) return;
      var win, TAB;
      try { win = el.frame.contentWindow; TAB = win.TAB; } catch (e) { showServerWarning(); el.loading.hidden = true; return; }
      if (!TAB) { toast('This template did not load its runtime (_template.js).', true); el.loading.hidden = true; return; }
      S.win = win; S.TAB = TAB; S.meta = TAB.meta || {};
      S.defaults = TAB.get();
      if (initial) TAB.apply(initial);
      TAB.enableEditing(true);

      var size = TAB.size();
      el.frame.style.width = size.width + 'px';
      el.frame.style.height = size.height + 'px';
      el.frame.width = size.width; el.frame.height = size.height;

      renderVariants(); renderFields(); renderPhotos();
      var isSig = S.meta.export === 'signature';
      el.copySig.hidden = !isSig;
      el.download.className = 'btn ' + (isSig ? 'btn--secondary' : 'btn--primary');
      el.copySig.className = 'btn btn--primary';
      el.title.textContent = (S.meta.name || id) + ' · ' + size.width + '×' + size.height + ' px';
      el.size.textContent = size.width + ' × ' + size.height + ' px';
      document.title = (S.meta.name || id) + ' · TAB Brand Studio';

      S.unsubscribe = TAB.onChange(onTemplateChange);
      fit();
      TAB.ready().then(function (report) {
        if (token !== S.loadToken) return;
        el.loading.hidden = true;
        var missing = Object.keys(report.fonts).filter(function (k) { return !report.fonts[k]; });
        if (missing.length) toast('Brand fonts did not load (' + missing.join(', ') + '). Check your internet connection before exporting.', true);
        runChecks(); syncHash();
      });
    };
    el.frame.src = id + '.html';
  }

  /* ---------------- scale-to-fit preview ---------------- */
  function fit() {
    if (!S.TAB) return;
    var size = S.TAB.size();
    var pad = 64;
    var availW = el.preview.clientWidth - pad, availH = el.preview.clientHeight - pad;
    var s = Math.min(availW / size.width, availH / size.height, 1);
    if (!(s > 0)) s = 0.1;
    el.frame.style.transform = 'scale(' + s + ')';
    el.wrap.style.width = Math.round(size.width * s) + 'px';
    el.wrap.style.height = Math.round(size.height * s) + 'px';
    el.zoom.textContent = Math.round(s * 100) + '%';
  }

  /* ---------------- variants (the only color choice there is) ---------------- */
  function renderVariants() {
    var v = S.TAB.variants();
    var keys = v ? Object.keys(v) : [];
    el.secVariant.hidden = keys.length < 2;
    el.variants.innerHTML = '';
    var current = S.TAB.getVariant();
    keys.forEach(function (k) {
      var lab = document.createElement('label');
      lab.innerHTML = '<input type="radio" name="variant" value="' + esc(k) + '"' + (k === current ? ' checked' : '') + '><span>' + esc(v[k]) + '</span>';
      lab.querySelector('input').addEventListener('change', function () { S.TAB.setVariant(k); });
      el.variants.appendChild(lab);
    });
  }

  /* ---------------- fields ---------------- */
  function renderFields() {
    el.fields.innerHTML = '';
    S.inputs = {};
    S.TAB.fields().forEach(function (f) {
      var id = 'f-' + f.name;
      var wrap = document.createElement('div');
      wrap.className = 'field';
      var control = f.multiline ? document.createElement('textarea') : document.createElement('input');
      if (!f.multiline) control.type = 'text';
      else control.rows = Math.min(4, Math.max(2, Math.ceil((f.max || 80) / 45)));
      control.className = 'input'; control.id = id; control.value = f.value; control.spellcheck = true;
      control.setAttribute('aria-describedby', id + '-count' + (f.help ? ' ' + id + '-help' : ''));
      wrap.innerHTML = '<div class="field-head"><label for="' + id + '">' + esc(f.label) + (f.optional ? ' <span class="helper" style="font-weight:600">optional</span>' : '') + '</label>' +
        '<span class="counter" id="' + id + '-count"></span></div>';
      wrap.appendChild(control);
      if (f.help) { var p = document.createElement('p'); p.className = 'helper'; p.id = id + '-help'; p.textContent = f.help; p.style.marginTop = '0'; wrap.appendChild(p); }
      control.addEventListener('input', function () { S.TAB.setField(f.name, control.value); updateCounter(f.name); });
      el.fields.appendChild(wrap);
      S.inputs[f.name] = { control: control, counter: wrap.querySelector('.counter'), max: f.max, label: f.label };
      updateCounter(f.name);
    });
  }
  function updateCounter(name) {
    var i = S.inputs[name]; if (!i) return;
    var len = [...i.control.value].length;
    var over = i.max && len > i.max;
    i.counter.textContent = i.max ? len + ' / ' + i.max : len + '';
    i.counter.classList.toggle('is-over', !!over);
    i.control.classList.toggle('is-over', !!over);
    i.control.setAttribute('aria-invalid', over ? 'true' : 'false');
  }
  function onTemplateChange(evt) {
    if (evt.type === 'field' && S.inputs[evt.name]) {
      var c = S.inputs[evt.name].control;
      if (document.activeElement !== c && c.value !== evt.value) c.value = evt.value;
      updateCounter(evt.name);
    }
    if (evt.type === 'variant') {
      Array.prototype.forEach.call(el.variants.querySelectorAll('input'), function (r) { r.checked = r.value === evt.variant; });
    }
    if (evt.type === 'focus') { el.fx.value = evt.x; el.fy.value = evt.y; el.fxOut.textContent = Math.round(evt.x) + '%'; el.fyOut.textContent = Math.round(evt.y) + '%'; }
    scheduleChecks();
    syncHashSoon();
  }
  function resetContent() {
    if (!S.defaults) return;
    S.TAB.apply({ fields: S.defaults.fields });
    Object.keys(S.inputs).forEach(function (n) { S.inputs[n].control.value = S.defaults.fields[n] || ''; updateCounter(n); });
    toast('Text reset to the template sample.');
  }

  /* ---------------- photos ---------------- */
  function photoKey(src) { var m = /(\d\d-[\w-]+?)(?:--[\w-]+)?\.jpe?g$/i.exec(src || ''); return m ? m[1] : null; }
  function renderPhotos() {
    var has = S.TAB.hasPhoto();
    el.secPhoto.hidden = !has;
    if (!has) return;
    var recommended = S.meta.photos || [];
    var list = S.catalog.photos.slice().sort(function (a, b) {
      var ia = recommended.indexOf(a.id), ib = recommended.indexOf(b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    var current = S.TAB.getPhoto();
    el.photoGrid.innerHTML = '';
    list.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'photo-tile'; b.title = p.label + ' (' + p.aspect + ')'; b.dataset.photoId = p.id;
      b.setAttribute('aria-label', p.label);
      b.setAttribute('aria-pressed', String(photoKey(current) === p.id));
      b.innerHTML = '<img alt="" loading="lazy" src="' + esc(p.src) + '">' + (recommended.indexOf(p.id) >= 0 ? '<span class="tag">Suggested</span>' : '');
      b.querySelector('img').addEventListener('error', function () {
        var alt = p.src.replace(/\/photos\/([\w-]+)\.jpg$/, '/photos/candidates/$1--nano-banana-pro.jpg');
        if (this.src.indexOf('candidates') < 0) this.src = alt;
      });
      b.addEventListener('click', function () { pickPhoto(p); });
      el.photoGrid.appendChild(b);
    });
    if (S.uploaded) {
      var u = document.createElement('button');
      u.type = 'button'; u.className = 'photo-tile'; u.dataset.photoId = '__upload'; u.setAttribute('aria-label', 'Your uploaded photo');
      u.setAttribute('aria-pressed', String(current === S.uploaded));
      u.innerHTML = '<img alt="" src="' + S.uploaded + '"><span class="tag">Yours</span>';
      u.addEventListener('click', function () { S.TAB.setPhoto(S.uploaded); setFocus(50, 50); markPhoto(); });
      el.photoGrid.appendChild(u);
    }
    var up = document.createElement('label');
    up.className = 'photo-tile upload';
    up.innerHTML = '<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload your own photo">Upload your own<small>JPG or PNG</small>';
    up.querySelector('input').addEventListener('change', onUpload);
    el.photoGrid.appendChild(up);

    var f = S.TAB.getFocus() || { x: 50, y: 50 };
    el.fx.value = f.x; el.fy.value = f.y; el.fxOut.textContent = Math.round(f.x) + '%'; el.fyOut.textContent = Math.round(f.y) + '%';
  }
  function markPhoto() {
    var current = S.TAB.getPhoto();
    Array.prototype.forEach.call(el.photoGrid.querySelectorAll('button.photo-tile'), function (b) {
      var id = b.dataset.photoId;
      b.setAttribute('aria-pressed', String(id === '__upload' ? current === S.uploaded : photoKey(current) === id));
    });
  }
  function pickPhoto(p) {
    S.TAB.setPhoto(p.src);
    // the template's own crop if it's the photo it was designed with, else the photo's suggested focus
    if (S.defaults && photoKey(S.defaults.photo) === p.id && S.defaults.focus) setFocus(S.defaults.focus[0], S.defaults.focus[1]);
    else setFocus(p.focus[0], p.focus[1]);
    markPhoto();
  }
  function onUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) { toast('Please choose a JPG or PNG photo.', true); return; }
    var reader = new FileReader();
    reader.onload = function () {
      // downscale very large photos so previews and exports stay fast
      var img = new Image();
      img.onload = function () {
        var max = 2600, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
        var src = reader.result;
        if (k < 1) {
          var c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          src = c.toDataURL('image/jpeg', 0.9);
        }
        S.uploaded = src;
        S.TAB.setPhoto(src); setFocus(50, 50);
        renderPhotos();
        toast('Photo added. Use the focus sliders to keep faces clear of text.');
      };
      img.onerror = function () { toast('That file could not be read as an image.', true); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }
  function setFocus(x, y) {
    if (!S.TAB) return;
    S.TAB.setFocus(x, y);
    el.fx.value = x; el.fy.value = y;
    el.fxOut.textContent = Math.round(x) + '%'; el.fyOut.textContent = Math.round(y) + '%';
  }

  /* ---------------- brand check ---------------- */
  var scheduleChecks = debounce(runChecks, 150);
  var CAPS_OK = /^(eyebrow|badge|kicker)$/;
  // Extended_Pictographic includes ©, ® and ™, which are legitimate (StratPro®): exclude them.
  var EMOJI = /(?![\u00A9\u00AE\u2122])\p{Extended_Pictographic}/u;
  function runChecks() {
    if (!S.TAB) return;
    var issues = [];
    var fields = S.TAB.fields();
    var byName = {};
    fields.forEach(function (f) {
      byName[f.name] = f;
      var v = f.value || '', len = [...v].length;
      if (f.max && len > f.max) issues.push(['error', f.label, len + ' of ' + f.max + ' characters. Shorten it so it stays legible.']);
      if (/\[[^\]]*\]/.test(v)) issues.push(['warn', f.label, 'Replace the [bracketed] placeholder with real content.']);
      if (EMOJI.test(v)) issues.push(['error', f.label, 'Remove the emoji: emoji are not part of the TAB brand.']);
      if (/!\s*!/.test(v) || (v.match(/!/g) || []).length > 1) issues.push(['warn', f.label, 'Avoid exclamation chains; let the content carry the optimism.']);
      var letters = v.replace(/[^A-Za-z]/g, '');
      if (!CAPS_OK.test(f.name) && letters.length > 8 && v === v.toUpperCase() && /\s/.test(v.trim())) issues.push(['warn', f.label, 'Use sentence case. Capitals are only for eyebrows and badges.']);
      if (!f.optional && !v.trim()) issues.push(['warn', f.label, 'This field is empty.']);
    });
    S.TAB.overflowing().forEach(function (name) {
      var f = byName[name];
      issues.push(['error', f ? f.label : name, 'Doesn\'t fit even at the smallest allowed size. Shorten the text.']);
    });
    var photo = S.TAB.hasPhoto() ? S.TAB.getPhoto() : null;
    if (photo && /^data:/.test(photo)) issues.push(['info', 'Your photo', 'Use real people in real working settings, and only images you have the rights to. No flat illustrations as the only image.']);
    if (S.id === 'social-stat' && byName.source && !byName.source.value.trim()) issues.push(['warn', 'Source line', 'Add where this number comes from. Stats need a real, checkable source.']);
    if (S.id === 'email-signature' && byName.logo_url && /example\.com/.test(byName.logo_url.value)) issues.push(['warn', 'Hosted logo URL', 'Still points to example.com. Host tab-logo-color-600.png and paste its https URL.']);

    el.issues.innerHTML = '';
    issues.forEach(function (i) {
      var li = document.createElement('li'); li.className = i[0];
      li.innerHTML = '<b>' + esc(i[1]) + '</b>' + esc(i[2]);
      el.issues.appendChild(li);
    });
    var blocking = issues.filter(function (i) { return i[0] !== 'info'; }).length;
    el.status.textContent = blocking ? blocking + (blocking === 1 ? ' thing to fix before publishing' : ' things to fix before publishing') : 'Looks on-brand. Ready to export.';
    el.status.classList.toggle('has-issues', blocking > 0);

    el.rules.innerHTML = '';
    (S.meta.rules || []).forEach(function (r) { var li = document.createElement('li'); li.textContent = r; el.rules.appendChild(li); });
  }

  /* ---------------- share links (content lives in the URL hash) ---------------- */
  function currentState() {
    var cur = S.TAB.get();
    var out = { template: S.id };
    if (cur.variant && (!S.defaults || cur.variant !== S.defaults.variant)) out.variant = cur.variant;
    var changed = {};
    Object.keys(cur.fields).forEach(function (k) { if (!S.defaults || cur.fields[k] !== S.defaults.fields[k]) changed[k] = cur.fields[k]; });
    if (Object.keys(changed).length) out.fields = changed;
    if (cur.photo && !/^data:/.test(cur.photo)) {
      if (!S.defaults || cur.photo !== S.defaults.photo) out.photo = cur.photo;
      if (!S.defaults || String(cur.focus) !== String(S.defaults.focus)) out.focus = cur.focus;
    }
    return out;
  }
  function stateHash() { return '#' + encodeURIComponent(JSON.stringify(currentState())); }
  function syncHash() {
    if (!S.TAB) return;
    var h = stateHash();
    history.replaceState(null, '', h);
    var raw = currentState(); delete raw.template;
    el.openRaw.href = S.id + '.html' + (Object.keys(raw).length ? '#' + encodeURIComponent(JSON.stringify(raw)) : '');
  }
  var syncHashSoon = debounce(syncHash, 300);
  function copyShareLink() {
    if (!S.TAB) return;
    syncHash();
    var url = location.href.split('#')[0] + stateHash();
    var hasUpload = /^data:/.test(S.TAB.getPhoto() || '');
    copyText(url).then(function (ok) {
      if (ok) toast(hasUpload ? 'Link copied. Uploaded photos stay on this computer and are not part of the link.' : 'Share link copied. It opens this template with your content.');
      else toast('Copy blocked by the browser. The link is in the address bar.', true);
    });
  }

  /* ---------------- signature copy (runs in this window: it holds the user gesture) ---------------- */
  function copySignature() {
    var api = S.win && S.win.TABSignature;
    if (!api) return;
    var html = api.html(), text = api.text();
    var done = function (ok) { toast(ok ? 'Signature copied. Paste it into Gmail or Outlook signature settings.' : 'Copy was blocked. Open the template and use its Copy button.', !ok); };
    if (navigator.clipboard && window.ClipboardItem && window.isSecureContext) {
      navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })])
        .then(function () { done(true); }, function () { done(richCopy(html)); });
    } else done(richCopy(html));
  }
  function richCopy(html) {
    var box = document.createElement('div'); box.contentEditable = 'true'; box.style.cssText = 'position:fixed;left:-9999px;top:0';
    box.innerHTML = html; document.body.appendChild(box);
    var r = document.createRange(); r.selectNodeContents(box);
    var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    sel.removeAllRanges(); box.remove(); return ok;
  }

  /* ---------------- PNG export (html-to-image inside the template iframe) ---------------- */
  function ensureHtmlToImage(win) {
    if (win.htmlToImage) return Promise.resolve(win.htmlToImage);
    return new Promise(function (resolve, reject) {
      var s = win.document.createElement('script');
      s.src = HTML_TO_IMAGE.src; s.integrity = HTML_TO_IMAGE.integrity; s.crossOrigin = 'anonymous';
      s.onload = function () { resolve(win.htmlToImage); };
      s.onerror = function () { reject(new Error('could not load html-to-image from cdn.jsdelivr.net')); };
      win.document.head.appendChild(s);
    });
  }
  // html-to-image does not follow our nested @import chain (styles.css -> tokens/fonts.css -> Google Fonts),
  // so build the @font-face CSS ourselves: Latin subsets only, woff2 inlined as data URLs. Cached per session.
  function googleFontHrefs(doc) {
    var out = [];
    (function walk(sheets) {
      Array.prototype.forEach.call(sheets, function (sheet) {
        var rules; try { rules = sheet.cssRules; } catch (e) { return; }
        Array.prototype.forEach.call(rules || [], function (r) {
          if (r.type === CSSRule.IMPORT_RULE) {
            if (/fonts\.googleapis\.com/.test(r.href)) out.push(r.href);
            else if (r.styleSheet) walk([r.styleSheet]);
          }
        });
      });
    })(doc.styleSheets);
    Array.prototype.forEach.call(doc.querySelectorAll('link[rel=stylesheet][href*="fonts.googleapis.com"]'), function (l) { out.push(l.href); });
    return out;
  }
  function toDataURL(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); }).then(function (b) {
      return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = rej; fr.readAsDataURL(b); });
    });
  }
  function fontEmbedCSS(doc) {
    if (S.fontCSS) return Promise.resolve(S.fontCSS);
    var hrefs = googleFontHrefs(doc);
    if (!hrefs.length) return Promise.resolve(undefined);
    return Promise.all(hrefs.map(function (h) { return fetch(h).then(function (r) { return r.text(); }); })).then(function (texts) {
      var blocks = [];
      texts.join('\n').replace(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g, function (_, subset, block) { if (subset === 'latin') blocks.push(block); return _; });
      return Promise.all(blocks.map(function (block) {
        var m = /url\(([^)]+)\)/.exec(block);
        if (!m) return block;
        return toDataURL(m[1].replace(/["']/g, '')).then(function (data) { return block.replace(m[0], 'url(' + data + ')'); });
      }));
    }).then(function (blocks) { S.fontCSS = blocks.join('\n'); return S.fontCSS; })
      .catch(function (e) { console.warn('[studio] font embedding fallback:', e); return undefined; });
  }
  function downloadPng() {
    if (!S.TAB || !S.win) return;
    var win = S.win, TAB = S.TAB, node = TAB.artboard, btn = el.download;
    btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Preparing PNG…';
    if (win.document.activeElement && win.document.activeElement.blur) win.document.activeElement.blur();
    var size = TAB.size();
    Promise.all([ensureHtmlToImage(win), fontEmbedCSS(win.document), TAB.ready()])
      .then(function (r) {
        node.classList.add('tab-exporting');
        return r[0].toPng(node, { width: size.width, height: size.height, pixelRatio: 1, fontEmbedCSS: r[1], cacheBust: false });
      })
      .then(function (dataUrl) {
        var v = TAB.getVariant();
        var a = document.createElement('a');
        a.href = dataUrl; a.download = 'tab-' + S.id + (v ? '-' + v : '') + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        toast('PNG downloaded at ' + size.width + '×' + size.height + ' px.');
      })
      .catch(function (e) { console.error(e); toast('Export failed: ' + (e && e.message ? e.message : e) + '. Try again, or use tools/render.mjs.', true); })
      .then(function () { node.classList.remove('tab-exporting'); btn.removeAttribute('aria-busy'); btn.textContent = 'Download PNG'; });
  }

  init();
  window.TABStudio = { state: S, load: loadTemplate, download: downloadPng };
})();
