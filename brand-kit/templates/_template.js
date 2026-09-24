/* ==========================================================================
   TAB brand templates: tiny shared runtime (no dependencies)

   Content can be injected three ways, all through the same API:
     1. The editor (editor.html) calls window.TAB.* inside a same-origin iframe.
     2. URL hash JSON, read on load and on hashchange:
          social-quote.html#{"quote":"...","variant":"navy"}
          social-photo-veil.html#{"headline":"...","photo":"../photos/03-owner.jpg","focus":[40,50]}
        Reserved keys: variant, photo, focus ([x,y] in % or "x% y%"), fields ({...}).
        Every other key is treated as a data-field name.
     3. The batch renderer (tools/render.mjs) calls TAB.apply(job) then TAB.ready().

   Template markup contract:
     <main class="artboard" data-template="id" data-variant="..." style="width:Wpx;height:Hpx">
     [data-field="name"]  editable text. Optional attributes:
         data-label="Headline"  data-max="60"  data-multiline  data-optional
     [data-fit="MINPX"]   shrink font-size (down to MINPX) until the element, or its
                          closest [data-fit-box], no longer overflows.
     img[data-photo]      swappable photo; object-position is the focus point.
     img[data-logo]       logo with a PNG fallback while SVG exports are missing.
     [data-bind-href="mailto:{email}"]  attribute templating from field values.
     <script type="application/json" id="tab-meta">  name, size, motif, variants, rules.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var artboard = doc.querySelector('.artboard');
  if (!artboard) { console.warn('[TAB] no .artboard found'); return; }

  var meta = {};
  try { var m = doc.getElementById('tab-meta'); if (m) meta = JSON.parse(m.textContent); }
  catch (e) { console.warn('[TAB] invalid #tab-meta JSON', e); }

  var RESERVED = { template: 1, variant: 1, photo: 1, focus: 1, fields: 1, scale: 1, out: 1 };
  var listeners = [];
  var values = {};

  /* ---------------- fields ---------------- */
  function fieldEls() { return Array.prototype.slice.call(artboard.querySelectorAll('[data-field]')); }
  function fieldMap() {
    var map = {};
    fieldEls().forEach(function (el) { (map[el.dataset.field] = map[el.dataset.field] || []).push(el); });
    return map;
  }
  // Reads text with <br> / block children as line breaks. Works for hidden nodes too
  // (innerText does not), and collapses source-formatting whitespace like the browser does.
  function readEl(el) {
    var out = '';
    (function walk(node) {
      node.childNodes.forEach(function (c) {
        if (c.nodeType === 3) out += c.nodeValue.replace(/[ \t\r\n]+/g, ' ');
        else if (c.nodeName === 'BR') out += '\n';
        else if (c.nodeType === 1) {
          if (/^(DIV|P)$/.test(c.nodeName) && out && out.slice(-1) !== '\n') out += '\n';
          walk(c);
        }
      });
    })(el);
    return out.replace(/ /g, ' ').replace(/ *\n */g, '\n').replace(/^\s+|\s+$/g, '');
  }
  function writeEl(el, value) {
    el.textContent = '';
    String(value).split('\n').forEach(function (line, i) {
      if (i) el.appendChild(doc.createElement('br'));
      el.appendChild(doc.createTextNode(line));
    });
  }
  function describeFields() {
    var map = fieldMap();
    return Object.keys(map).map(function (name) {
      var el = map[name][0];
      return {
        name: name,
        label: el.dataset.label || name,
        max: el.dataset.max ? parseInt(el.dataset.max, 10) : null,
        multiline: el.hasAttribute('data-multiline'),
        optional: el.hasAttribute('data-optional'),
        help: el.dataset.help || '',
        value: values[name] != null ? values[name] : readEl(el)
      };
    });
  }
  function setField(name, value, opts) {
    opts = opts || {};
    var els = fieldMap()[name];
    if (!els) return false;
    value = value == null ? '' : String(value);
    if (!els[0].hasAttribute('data-multiline')) value = value.replace(/\s*\n\s*/g, ' ');
    values[name] = value;
    els.forEach(function (el) {
      if (!(opts.fromEl === el)) writeEl(el, value);
      if (value.trim() === '' && el.hasAttribute('data-optional')) el.setAttribute('data-empty', '');
      else el.removeAttribute('data-empty');
    });
    updateBindings();
    scheduleFit();
    if (!opts.silent) emit({ type: 'field', name: name, value: value });
    return true;
  }

  /* --------------- attribute bindings --------------- */
  var FILTERS = {
    tel: function (v) { return v.replace(/[^\d+]/g, ''); },
    url: function (v) { return v.replace(/^https?:\/\//i, '').replace(/\/$/, ''); },
    trim: function (v) { return v.trim(); }
  };
  function updateBindings() {
    artboard.querySelectorAll('[data-bind-href]').forEach(function (el) {
      var tpl = el.getAttribute('data-bind-href');
      el.setAttribute('href', tpl.replace(/\{(\w+)(?:\|(\w+))?\}/g, function (_, k, f) {
        var v = values[k] != null ? values[k] : '';
        return FILTERS[f] ? FILTERS[f](v) : v.trim();
      }));
    });
  }

  /* ---------------- photos ---------------- */
  // While final picks are being produced, fall back to candidates/ so templates still render.
  function photoFallbacks(src) {
    var m = /^(.*\/photos\/)(\d\d-[\w-]+?)\.jpe?g$/i.exec(src || '');
    if (!m) return [];
    return [m[1] + 'candidates/' + m[2] + '--nano-banana-pro.jpg', m[1] + 'candidates/' + m[2] + '--seedream-5-pro.jpg'];
  }
  function wirePhoto(img) {
    if (img.__tabWired) return;
    img.__tabWired = true;
    function onError() {
      var queue = img.__tabQueue;
      if (!queue) queue = img.__tabQueue = photoFallbacks(img.getAttribute('data-requested') || img.getAttribute('src'));
      var next = queue.shift();
      if (next) { console.warn('[TAB] photo fallback:', next); img.src = next; }
      else { img.setAttribute('data-failed', ''); console.warn('[TAB] photo failed:', img.getAttribute('data-requested') || img.src); }
    }
    img.addEventListener('error', onError);
    // the error may have fired before this script ran
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) onError();
  }
  function photoEls(slot) {
    return Array.prototype.slice.call(artboard.querySelectorAll(slot ? 'img[data-photo="' + slot + '"]' : 'img[data-photo]'));
  }
  function setPhoto(src, slot) {
    var imgs = photoEls(slot || 'main');
    if (!imgs.length) imgs = photoEls();
    imgs.forEach(function (img) {
      img.__tabQueue = null;
      img.removeAttribute('data-failed');
      img.setAttribute('data-requested', src);
      img.src = src;
    });
    emit({ type: 'photo', src: src });
  }
  function parseFocus(f) {
    if (Array.isArray(f)) return { x: +f[0], y: +f[1] };
    if (typeof f === 'string') { var p = f.match(/-?[\d.]+/g) || []; return { x: +(p[0] || 50), y: +(p[1] || 50) }; }
    if (f && typeof f === 'object') return { x: +f.x, y: +f.y };
    return { x: 50, y: 50 };
  }
  function getFocus(slot) {
    var img = photoEls(slot || 'main')[0] || photoEls()[0];
    if (!img) return null;
    var pos = img.style.objectPosition || getComputedStyle(img).objectPosition || '50% 50%';
    return parseFocus(pos);
  }
  function setFocus(x, y, slot) {
    if (typeof x !== 'number') { var p = parseFocus(x); x = p.x; y = p.y; }
    x = Math.max(0, Math.min(100, x)); y = Math.max(0, Math.min(100, y));
    (photoEls(slot || 'main').length ? photoEls(slot || 'main') : photoEls()).forEach(function (img) {
      img.style.objectPosition = x + '% ' + y + '%';
    });
    emit({ type: 'focus', x: x, y: y });
  }
  function getPhoto(slot) {
    var img = photoEls(slot || 'main')[0] || photoEls()[0];
    return img ? (img.getAttribute('data-requested') || img.getAttribute('src')) : null;
  }

  /* ---------------- logos ---------------- */
  var LOGO_PNG = '../../assets/logo/tab-logo-color.png';
  function wireLogo(img) {
    if (img.__tabLogo) return;
    img.__tabLogo = true;
    var kind = img.getAttribute('data-logo') || 'color';
    function fallback() {
      if (img.getAttribute('src') === LOGO_PNG) return;
      console.warn('[TAB] logo missing, using PNG fallback:', img.getAttribute('src'));
      if (/white/.test(kind)) img.classList.add('knockout');
      if (/icon/.test(kind) && img.parentElement) img.parentElement.classList.add('icon-crop');
      img.src = LOGO_PNG;
    }
    img.addEventListener('error', fallback);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fallback();
  }

  /* ---------------- variants ---------------- */
  function variants() { return meta.variants || null; }
  function setVariant(v) {
    var list = variants();
    if (list && !Object.prototype.hasOwnProperty.call(list, v)) { console.warn('[TAB] unknown variant', v); return false; }
    artboard.setAttribute('data-variant', v);
    scheduleFit();
    emit({ type: 'variant', variant: v });
    return true;
  }

  /* ---------------- auto-fit ---------------- */
  // Scroll sizes miss content that spills out of the top/left (e.g. bottom-anchored flex columns),
  // so also compare every child's box with the container's box.
  function overflows(box) {
    if (box.scrollHeight > box.clientHeight + 1 || box.scrollWidth > box.clientWidth + 1) return true;
    var r = box.getBoundingClientRect();
    for (var i = 0; i < box.children.length; i++) {
      var c = box.children[i].getBoundingClientRect();
      if (!c.width && !c.height) continue;
      if (c.top < r.top - 1 || c.bottom > r.bottom + 1 || c.left < r.left - 1 || c.right > r.right + 1) return true;
    }
    return false;
  }
  function fitEl(el) {
    if (el.offsetParent === null) return;
    var min = parseFloat(el.getAttribute('data-fit')) || 12;
    var box = el.closest('[data-fit-box]') || el;
    el.style.fontSize = '';
    var size = parseFloat(getComputedStyle(el).fontSize);
    var guard = 120;
    while (overflows(box) && size > min && guard--) {
      size = Math.max(min, size - Math.max(1, size * 0.03));
      el.style.fontSize = size + 'px';
    }
    if (overflows(box)) el.setAttribute('data-overflow', ''); else el.removeAttribute('data-overflow');
  }
  function fitAll() {
    // largest boxes first so nested fits settle
    artboard.querySelectorAll('[data-fit]').forEach(fitEl);
  }
  var fitTimer = null;
  function scheduleFit() {
    if (fitTimer) cancelAnimationFrame(fitTimer);
    fitTimer = requestAnimationFrame(function () { fitTimer = null; fitAll(); emit({ type: 'fit' }); });
  }
  function overflowing() {
    return Array.prototype.slice.call(artboard.querySelectorAll('[data-overflow]')).map(function (el) {
      if (el.dataset.field) return el.dataset.field;
      var inner = el.querySelector('[data-field]');
      return inner ? inner.dataset.field : '?';
    });
  }

  /* ---------------- state in / out ---------------- */
  function get() {
    var fields = {};
    describeFields().forEach(function (f) { fields[f.name] = f.value; });
    var out = { template: artboard.dataset.template, fields: fields };
    if (artboard.dataset.variant) out.variant = artboard.dataset.variant;
    var p = getPhoto(); if (p) { out.photo = p; out.focus = [getFocus().x, getFocus().y]; }
    return out;
  }
  function apply(data) {
    if (!data || typeof data !== 'object') return;
    if (data.variant) setVariant(data.variant);
    if (data.photo) setPhoto(data.photo);
    if (data.focus != null) setFocus(data.focus);
    var f = {};
    Object.keys(data.fields || {}).forEach(function (k) { f[k] = data.fields[k]; });
    Object.keys(data).forEach(function (k) { if (!RESERVED[k]) f[k] = data[k]; });
    Object.keys(f).forEach(function (k) { if (!setField(k, f[k], { silent: true })) console.warn('[TAB] unknown field', k); });
    emit({ type: 'apply' });
  }
  function readHash() {
    var h = location.hash.replace(/^#/, '');
    if (!h) return null;
    try { h = decodeURIComponent(h); } catch (e) { /* already decoded */ }
    try { return JSON.parse(h); } catch (e) { console.warn('[TAB] URL hash is not JSON:', h.slice(0, 80)); return null; }
  }

  /* ---------------- readiness (fonts + images + fit) ---------------- */
  var FONT_PROBES = ['600 20px Montserrat', '700 20px Montserrat', '800 20px Montserrat',
    '400 20px "Open Sans"', '600 20px "Open Sans"', '700 20px "Open Sans"', '800 20px "Open Sans"',
    'italic 400 20px "IBM Plex Sans"', '400 20px "IBM Plex Sans"'];
  function fontReport() {
    var fams = { 'Montserrat': false, 'Open Sans': false, 'IBM Plex Sans': false };
    doc.fonts.forEach(function (f) {
      var fam = f.family.replace(/["']/g, '');
      if (fam in fams && f.status === 'loaded') fams[fam] = true;
    });
    return fams;
  }
  function imagesSettled() {
    return Array.prototype.every.call(doc.images, function (img) { return img.complete; });
  }
  function waitImages() {
    return new Promise(function (resolve) {
      var tries = 0;
      (function check() {
        if (imagesSettled() || tries++ > 150) return resolve();
        setTimeout(check, 100);
      })();
    });
  }
  function ready() {
    var loads = FONT_PROBES.map(function (f) { return doc.fonts.load(f).catch(function () {}); });
    return Promise.all(loads)
      .then(function () { return doc.fonts.ready; })
      .then(waitImages)
      .then(function () {
        return Promise.all(Array.prototype.map.call(doc.images, function (img) {
          return img.decode && img.naturalWidth ? img.decode().catch(function () {}) : null;
        }));
      })
      .then(function () { fitAll(); return doc.fonts.ready; })
      .then(function () {
        return {
          fonts: fontReport(),
          failedImages: Array.prototype.filter.call(doc.images, function (i) { return i.getAttribute('src') && !i.naturalWidth; }).map(function (i) { return i.getAttribute('src'); }),
          overflow: overflowing()
        };
      });
  }

  /* ---------------- editing (enabled only by the editor) ---------------- */
  var editing = false;
  function enableEditing(on) {
    editing = on !== false;
    artboard.classList.toggle('tab-editing', editing);
    fieldEls().forEach(function (el) {
      if (editing) {
        el.contentEditable = 'plaintext-only';
        if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true';
        el.spellcheck = true;
      } else {
        el.removeAttribute('contenteditable');
      }
    });
  }
  artboard.addEventListener('input', function (e) {
    var el = e.target.closest && e.target.closest('[data-field]');
    if (!el || !editing) return;
    setField(el.dataset.field, readEl(el), { fromEl: el });
  });
  artboard.addEventListener('keydown', function (e) {
    var el = e.target.closest && e.target.closest('[data-field]');
    if (el && editing && e.key === 'Enter' && !el.hasAttribute('data-multiline')) { e.preventDefault(); el.blur(); }
  });
  artboard.addEventListener('paste', function (e) {
    var el = e.target.closest && e.target.closest('[data-field]');
    if (!el || !editing) return;
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData('text/plain');
    doc.execCommand('insertText', false, text);
  });
  artboard.addEventListener('focusout', function (e) {
    var el = e.target.closest && e.target.closest('[data-field]');
    if (el && editing) writeEl(el, values[el.dataset.field] != null ? values[el.dataset.field] : readEl(el));
  });

  /* ---------------- events ---------------- */
  function emit(evt) { listeners.forEach(function (fn) { try { fn(evt); } catch (e) { console.error(e); } }); }
  function onChange(fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; }

  /* ---------------- boot ---------------- */
  if (window.self !== window.top) doc.documentElement.classList.add('tab-embedded');
  artboard.querySelectorAll('img[data-photo]').forEach(wirePhoto);
  artboard.querySelectorAll('img[data-logo]').forEach(wireLogo);
  fieldEls().forEach(function (el) { values[el.dataset.field] = readEl(el); });
  updateBindings();
  apply(readHash());
  window.addEventListener('hashchange', function () { apply(readHash()); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(scheduleFit);
  window.addEventListener('load', scheduleFit);

  window.TAB = {
    version: '1.0.0',
    meta: meta,
    artboard: artboard,
    size: function () { return { width: artboard.offsetWidth, height: artboard.offsetHeight }; },
    fields: describeFields,
    setField: setField,
    getPhoto: getPhoto, setPhoto: setPhoto,
    getFocus: getFocus, setFocus: setFocus,
    hasPhoto: function () { return photoEls().length > 0; },
    variants: variants, setVariant: setVariant,
    getVariant: function () { return artboard.dataset.variant || null; },
    get: get, apply: apply,
    fit: fitAll, overflowing: overflowing,
    ready: ready, fontReport: fontReport,
    enableEditing: enableEditing,
    onChange: onChange
  };
})();
