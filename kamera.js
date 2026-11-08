/* Simulator EDFAT · kamera pilihan + layar kamera (HUD) ala Sony / Canon / Nikon.
   Tampilan disederhanakan untuk latihan: meniru susunan info yang umum di layar kamera,
   bukan tampilan resmi pabrikan. Dimuat SETELAH app.js (pakai S, MISI, drawCrop, foto, imgNow, dst). */
(() => {
  // f = rentang lensa asli (mm), a = bukaan terlebar di ujung lebar → ujung tele
  const L = {
    sonyFF: { nama: 'FE 24-240mm F3.5-6.3 OSS', f: [24, 240], a: [3.5, 6.3] },
    sonyC: { nama: 'E 18-135mm F3.5-5.6 OSS', f: [18, 135], a: [3.5, 5.6] },
    canonFF: { nama: 'RF 24-240mm F4-6.3 IS USM', f: [24, 240], a: [4, 6.3] },
    canonC: { nama: 'RF-S 18-150mm F3.5-6.3 IS STM', f: [18, 150], a: [3.5, 6.3] },
    nikonFF: { nama: 'NIKKOR Z 24-200mm f/4-6.3 VR', f: [24, 200], a: [4, 6.3] },
    nikonC: { nama: 'NIKKOR Z DX 18-140mm f/3.5-6.3 VR', f: [18, 140], a: [3.5, 6.3] },
  };
  const KAMERA = {
    sony: {
      nama: 'Sony', seri: [
        { id: 'a6700', nama: 'α6700', sensor: 'APS-C', crop: 1.5, mp: 26, fps: 11, lensa: L.sonyC, ket: 'APS-C ringkas, favorit konten dan olahraga hobi.' },
        { id: 'a7iv', nama: 'α7 IV', sensor: 'Full frame', crop: 1, mp: 33, fps: 10, lensa: L.sonyFF, ket: 'Full frame serba bisa, banyak dipakai fotografer event.' },
        { id: 'a7cii', nama: 'α7C II', sensor: 'Full frame', crop: 1, mp: 33, fps: 10, lensa: L.sonyFF, ket: 'Full frame bodi kecil untuk liputan jalan.' },
        { id: 'a7rv', nama: 'α7R V', sensor: 'Full frame', crop: 1, mp: 61, fps: 10, lensa: L.sonyFF, ket: 'Resolusi sangat tinggi, leluasa di-crop.' },
        { id: 'a9iii', nama: 'α9 III', sensor: 'Full frame', crop: 1, mp: 24.6, fps: 120, lensa: L.sonyFF, ket: 'Global shutter untuk olahraga super cepat.' },
        { id: 'a1ii', nama: 'α1 II', sensor: 'Full frame', crop: 1, mp: 50.1, fps: 30, lensa: L.sonyFF, ket: 'Flagship: resolusi tinggi sekaligus cepat.' },
      ],
    },
    canon: {
      nama: 'Canon', seri: [
        { id: 'r7', nama: 'EOS R7', sensor: 'APS-C', crop: 1.6, mp: 32.5, fps: 30, lensa: L.canonC, ket: 'APS-C cepat, jangkauan tele lebih jauh.' },
        { id: 'r6ii', nama: 'EOS R6 Mark II', sensor: 'Full frame', crop: 1, mp: 24.2, fps: 40, lensa: L.canonFF, ket: 'Full frame andalan event dan pernikahan.' },
        { id: 'r5ii', nama: 'EOS R5 Mark II', sensor: 'Full frame', crop: 1, mp: 45, fps: 30, lensa: L.canonFF, ket: 'Resolusi tinggi untuk pro serba bisa.' },
        { id: 'r3', nama: 'EOS R3', sensor: 'Full frame', crop: 1, mp: 24.1, fps: 30, lensa: L.canonFF, ket: 'Bodi olahraga dan jurnalistik.' },
        { id: 'r1', nama: 'EOS R1', sensor: 'Full frame', crop: 1, mp: 24.2, fps: 40, lensa: L.canonFF, ket: 'Flagship olahraga Canon.' },
      ],
    },
    nikon: {
      nama: 'Nikon', seri: [
        { id: 'z50ii', nama: 'Z50II', sensor: 'APS-C (DX)', crop: 1.5, mp: 20.9, fps: 30, lensa: L.nikonC, ket: 'DX ringan, cocok untuk mulai serius.' },
        { id: 'z5ii', nama: 'Z5II', sensor: 'Full frame', crop: 1, mp: 24.5, fps: 30, lensa: L.nikonFF, ket: 'Full frame paling terjangkau di seri Z.' },
        { id: 'zf', nama: 'Zf', sensor: 'Full frame', crop: 1, mp: 24.5, fps: 30, lensa: L.nikonFF, ket: 'Bodi retro dengan dial fisik.' },
        { id: 'z6iii', nama: 'Z6III', sensor: 'Full frame', crop: 1, mp: 24.5, fps: 60, lensa: L.nikonFF, ket: 'Full frame serba bisa yang cepat.' },
        { id: 'z8', nama: 'Z8', sensor: 'Full frame', crop: 1, mp: 45.7, fps: 120, lensa: L.nikonFF, ket: 'Isi Z9 dalam bodi lebih kecil.' },
        { id: 'z9', nama: 'Z9', sensor: 'Full frame', crop: 1, mp: 45.7, fps: 120, lensa: L.nikonFF, ket: 'Flagship olahraga dan satwa liar.' },
      ],
    },
  };
  const UMUM = { id: 'umum', nama: 'Kamera umum', sensor: 'Full frame', crop: 1, mp: 24, fps: 10, lensa: { nama: 'Zoom 24-200mm', f: [24, 200], a: [4, 6.3] } };
  const cari = id => {
    for (const [m, k] of Object.entries(KAMERA)) { const s = k.seri.find(x => x.id === id); if (s) return { m, ...s }; }
    return null;
  };

  // kecepatan rana per teknik: makin cepat untuk subjek yang bergerak
  const RANA = { E: 500, D: 1000, F: 640, A: 800, T: 2000 };
  // daftar nilai per 1/3 stop, seperti dial kamera
  const RANA_L = [30, 40, 50, 60, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000];
  const BUKAAN = [2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22];
  const ISO = [100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600];
  const SCENE = 4000; // terang adegan (siang berawan): pas bila ISO/100 · 4000 = N² · t
  const E = { t: 500, N: 4, iso: 'auto' }; // setelan kamera yang bisa diubah

  let pilihan = null, layar = false, merekTab = 'sony', sesudahPilih = null;
  try {
    pilihan = cari(localStorage.getItem('edfat_kamera')) || (localStorage.getItem('edfat_kamera') === 'umum' ? { m: 'umum', ...UMUM } : null);
    layar = localStorage.getItem('edfat_layar') !== '0' && !!pilihan;
  } catch (e) { /* tanpa storage */ }
  let sisa = 0;
  const K = () => pilihan || { m: 'umum', ...UMUM };

  /* ---------- nilai eksposur ---------- */
  function lensaKini() {
    const k = K(), l = k.lensa;
    const asli = S.f / k.crop; // S.f = setara full frame
    const t = clamp(Math.log(asli / l.f[0]) / Math.log(l.f[1] / l.f[0]), 0, 1);
    const n = l.a[0] * Math.pow(l.a[1] / l.a[0], t);
    const N = BUKAAN.find(b => b >= n - .05) || 8;
    return { asli: Math.round(asli), N };
  }
  const dekat = (list, v) => list.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a);
  function eksposur() {
    const min = lensaKini().N;
    if (E.N < min) E.N = min; // lensa bukaan variabel: zoom → bukaan terlebar menyempit
    const t = E.t, N = E.N;
    const isoPas = 100 * N * N * t / SCENE;
    const iso = E.iso === 'auto' ? dekat(ISO, clamp(isoPas, 100, 12800)) : E.iso;
    const d = Math.log2(iso / isoPas); // + = terlalu terang, − = terlalu gelap (stop)
    return { t, N, iso, auto: E.iso === 'auto', d };
  }
  // seberapa bergerak subjek tiap teknik (lebar blur relatif pada 1/100 detik)
  const GERAK = { E: .0008, D: .002, F: .0012, A: .0025, T: .008 };
  function efek() {
    if ($('misi').hidden) return null;
    const e = eksposur(), k = MISI[S.i].k;
    const gerak = Math.max(0, GERAK[k] * (100 / e.t) / S.w - .004);
    // goyang tangan: aturan 1/focal, stabilizer menolong ±1 stop
    const batas = S.f / 2, goyang = e.t < batas ? .004 * (batas / e.t) / S.w * .3 : 0;
    return { d: e.d, iso: e.iso, gerak: Math.min(gerak, .1), goyang: Math.min(goyang, .08) };
  }
  let tekstur = null;
  function noiseTile() {
    if (tekstur) return tekstur;
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), im = g.createImageData(128, 128);
    for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0);
    return (tekstur = c);
  }
  // terang-gelap + bintik ISO di atas gambar yang sudah digambar
  function terapkan(ctx, W, H, fx) {
    ctx.save();
    const d = clamp(fx.d, -5, 5);
    if (d < -.05) { ctx.fillStyle = `rgba(0,0,0,${1 - Math.pow(2, d)})`; ctx.fillRect(0, 0, W, H); }
    else if (d > .05) {
      // 'lighter' menambah: tiap salinan = ×2 terang
      let sisaD = d;
      ctx.globalCompositeOperation = 'lighter';
      while (sisaD > .05) { ctx.globalAlpha = Math.min(1, Math.pow(2, Math.min(sisaD, 1)) - 1); ctx.drawImage(ctx.canvas, 0, 0); sisaD -= 1; }
    }
    ctx.restore();
    const n = Math.log2(fx.iso / 800);
    if (n > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(.32, n * .07);
      ctx.globalCompositeOperation = 'overlay';
      const p = ctx.createPattern(noiseTile(), 'repeat');
      const sk = Math.max(1, W / 900);
      ctx.scale(sk, sk);
      ctx.fillStyle = p; ctx.fillRect(0, 0, W / sk, H / sk);
      ctx.restore();
    }
  }
  function nilaiEksp() {
    const e = eksposur(), fx = efek() || { gerak: 0, goyang: 0 }, k = MISI[S.i].k;
    const masalah = [];
    if (e.d <= -1) masalah.push(`terlalu gelap ${(-e.d).toFixed(1)} stop: naikkan ISO, lebarkan bukaan (angka F kecil), atau perlambat rana`);
    else if (e.d >= 1) masalah.push(`terlalu terang ${e.d.toFixed(1)} stop: turunkan ISO, sempitkan bukaan (angka F besar), atau percepat rana`);
    if (fx.gerak > .008) masalah.push(`subjek blur karena rana 1/${e.t} terlalu lambat untuk gerakan${k === 'T' ? '. Untuk olahraga pakai 1/1000 atau lebih cepat' : ''}`);
    if (fx.goyang > .006) masalah.push(`foto goyang: rana 1/${e.t} terlalu lambat untuk lensa ${Math.round(S.f)} mm (patokan: rana minimal 1/focal, di sini ±1/${Math.round(S.f)})`);
    if (e.iso >= 6400 && Math.abs(e.d) < 1) masalah.push(`ISO ${e.iso} membuat foto berbintik (noise). Kalau cahaya cukup, turunkan ISO`);
    return { e, masalah };
  }
  function infoEksp() {
    const { e, masalah } = nilaiEksp();
    const el = $('ekspInfo');
    el.className = 'eksp-info ' + (masalah.length ? 'warn' : 'ok');
    el.textContent = masalah.length ? masalah[0].replace(/^./, c => c.toUpperCase()) : `Exposure pas${e.auto ? ` (ISO auto ${e.iso})` : ''}`;
  }
  function saran() {
    const { e, masalah } = nilaiEksp();
    const set = `1/${e.t} · ${fmtN(e.N)} · ISO ${e.iso}`;
    return masalah.length
      ? { ok: false, html: `<b>Setelan ${set}</b>: ${masalah.join('; ')}.` }
      : { ok: true, html: `<b>Setelan ${set}</b>: exposure pas, foto tajam.` };
  }
  function setelPas() {
    const k = MISI[S.i].k;
    E.t = RANA[k] || 500; E.N = lensaKini().N; E.iso = 'auto';
  }
  function geserDial(d, arah) {
    if (d === 't') E.t = RANA_L[clamp(RANA_L.indexOf(E.t) + arah, 0, RANA_L.length - 1)];
    else if (d === 'N') { const i = BUKAAN.indexOf(E.N); E.N = BUKAAN[clamp(i + arah, 0, BUKAAN.length - 1)]; }
    else {
      const lst = ['auto', ...ISO];
      if (E.iso === 'auto' && arah > 0) E.iso = eksposur().iso; // dari auto: mulai dari nilai auto sekarang
      else if (E.iso === 100 && arah < 0) E.iso = 'auto';
      else E.iso = lst[clamp(lst.indexOf(E.iso) + arah, 0, lst.length - 1)];
    }
    eksposur();
    window.render();
  }
  function dialUI() {
    const e = eksposur();
    $('dT').textContent = '1/' + e.t;
    $('dN').textContent = fmtN(e.N);
    $('dIso').textContent = e.auto ? `AUTO ${e.iso}` : e.iso;
    infoEksp();
  }
  const fmtN = N => {
    const m = K().m;
    return m === 'nikon' ? 'F' + (N % 1 ? N.toFixed(1) : N) : 'F' + N.toFixed(1);
  };
  const fmtSisa = n => K().m === 'nikon' ? (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n) : n;

  /* ---------- HUD ---------- */
  const hud = () => $('hud');
  function bangunHud() {
    const k = K(), m = k.m;
    hud().dataset.m = m;
    const afMode = MISI[S.i].k === 'T' ? { sony: 'AF-C', canon: 'SERVO', nikon: 'AF-C', umum: 'AF-C' }[m] : { sony: 'AF-S', canon: 'ONE SHOT', nikon: 'AF-S', umum: 'AF-S' }[m];
    const drive = MISI[S.i].k === 'T' ? { sony: 'Hi+', canon: 'H+', nikon: 'CH', umum: 'Burst' }[m] : { sony: '▭', canon: '▭', nikon: 'S', umum: 'S' }[m];
    const evSkala = m === 'nikon' ? ['+', '0', '−'] : m === 'sony' ? ['−5', '0', '+5'] : ['−3', '0', '+3'];
    hud().innerHTML = `
      <div class="h-top">
        <span class="h-mode">M</span>
        <span class="h-txt">${afMode}</span>
        <span class="h-txt">${drive}</span>
        <span class="h-txt h-is" title="Stabilizer">((·))</span>
        <span class="h-sp"></span>
        <span class="h-txt h-kartu"><i class="ik-kartu"></i><b id="hSisa"></b></span>
        <span class="h-txt">RAW</span>
        <span class="h-bat"><i></i><i></i><i></i>${m === 'sony' ? '<em>100%</em>' : ''}</span>
      </div>
      <div class="h-peta" id="hPeta"><canvas id="peta" width="160" height="107"></canvas></div>
      <div class="h-af" id="hAf"><b></b><b></b><b></b><b></b></div>
      <div class="h-level" id="hLevel"><i class="h-lv-l"></i><i class="h-lv-c"></i><i class="h-lv-r"></i></div>
      <div class="h-zoom" id="hZoom"><b id="hZoomMm"></b><span class="h-zbar"><small>W</small><span><i id="hZoomI"></i></span><small>T</small></span></div>
      <div class="h-hist"><canvas id="hist" width="96" height="40"></canvas></div>
      <div class="h-bot">
        <span class="h-fokus" id="hFokus">●</span>
        <span class="h-val" id="hSS"></span>
        <span class="h-val" id="hN"></span>
        <span class="h-ev"><span class="h-ev-lbl"><small>${evSkala[0]}</small><small>${evSkala[1]}</small><small>${evSkala[2]}</small></span><span class="h-ev-bar"><i id="hEv"></i></span></span>
        <span class="h-val" id="hIso"></span>
        <span class="h-val h-mm" id="hMm"></span>
      </div>`;
  }

  let afT = 0, zoomT = 0, last = null, afState = '', rafL = 0;
  function render() {
    // kamera APS-C: tulis focal asli + setara full frame di slider dan bingkai
    const k = K();
    if (k.crop > 1) {
      const t = `${lensaKini().asli} mm`;
      $('zoomOut').textContent = t;
      $('zoomOut').title = `≈ ${Math.round(S.f)} mm setara full frame`;
      $('vfChip').textContent = `${t} (≈${Math.round(S.f)})` + (S.rot ? ` · ${S.rot}°` : '');
    } else $('zoomOut').title = '';
    if (!$('misi').hidden) dialUI();
    if (!layar || $('misi').hidden) return;
    const gerak = last && (Math.abs(last.cx - S.cx) > 1e-4 || Math.abs(last.cy - S.cy) > 1e-4 || last.rot !== S.rot);
    const zoom = last && Math.abs(last.f - S.f) > .05;
    if (gerak || zoom) cariFokus();
    if (zoom) tampilZoom();
    last = { cx: S.cx, cy: S.cy, f: S.f, rot: S.rot, img: imgNow() };
    cancelAnimationFrame(rafL);
    rafL = requestAnimationFrame(gambar);
  }
  function cariFokus() {
    setAf('cari');
    clearTimeout(afT);
    // AF-C (Time) terus mengikuti subjek tanpa bunyi, seperti kamera asli
    afT = setTimeout(() => { setAf('kunci'); if (MISI[S.i].k !== 'T') bip(); }, 320);
  }
  function setAf(s) {
    afState = s;
    const a = $('hAf'); if (!a) return;
    a.className = 'h-af ' + s;
    $('hFokus').classList.toggle('on', s === 'kunci');
  }
  function tampilZoom() {
    const z = $('hZoom'); if (!z) return;
    z.classList.add('on');
    clearTimeout(zoomT);
    zoomT = setTimeout(() => z.classList.remove('on'), 900);
  }

  function gambar() {
    const st = $('stage'), c = $('layar');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(st.clientWidth * dpr), H = Math.round(st.clientHeight * dpr);
    if (!W || !H) return;
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const ctx = c.getContext('2d');
    const hint = st.classList.contains('hint') && S.hintList;
    drawCrop(ctx, W, H, hint ? (cx, nw, nh, s) => {
      cx.lineWidth = 2 * dpr / s;
      cx.setLineDash([8 * dpr / s, 6 * dpr / s]);
      cx.strokeStyle = '#F8D74E';
      cx.fillStyle = 'rgba(248,215,78,.12)';
      cx.font = `700 ${12 * dpr / s}px Manrope, sans-serif`;
      for (const [n, b] of S.hintList) {
        const x = (b[0] - S.cx) * nw, y = (b[1] - S.cy) * nh, w = (b[2] - b[0]) * nw, h = (b[3] - b[1]) * nh;
        cx.fillRect(x, y, w, h); cx.strokeRect(x, y, w, h);
        cx.fillStyle = '#F8D74E'; cx.fillText(n, x + 4 * dpr / s, y - 6 * dpr / s); cx.fillStyle = 'rgba(248,215,78,.12)';
      }
    } : null);
    // garis 1/3
    if (!st.classList.contains('nogrid')) {
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = Math.max(1, dpr);
      ctx.beginPath();
      for (const p of [1 / 3, 2 / 3]) { ctx.moveTo(W * p, 0); ctx.lineTo(W * p, H); ctx.moveTo(0, H * p); ctx.lineTo(W, H * p); }
      ctx.stroke();
    }
    isiHud(c);
    drawPeta($('peta'));
  }

  function isiHud(c) {
    if (!$('hSS')) return;
    const k = K(), e = eksposur(), l = lensaKini(), m = k.m;
    $('hSS').textContent = '1/' + e.t;
    $('hN').textContent = fmtN(e.N);
    $('hIso').textContent = (e.auto ? 'ISO AUTO ' : 'ISO ') + e.iso;
    $('hMm').textContent = k.crop > 1 ? `${l.asli}mm` : `${Math.round(S.f)}mm`;
    $('hZoomMm').innerHTML = k.crop > 1 ? `${l.asli} mm <small>≈ ${Math.round(S.f)} mm FF</small>` : `${Math.round(S.f)} mm`;
    $('hZoomI').style.left = (fToV(S.f)) + '%';
    if (!sisa) sisa = Math.floor(128000 / (k.mp * 1.25));
    $('hSisa').textContent = fmtSisa(sisa);
    // level: tampil di Angle atau saat kamera dimiringkan
    const lv = $('hLevel');
    lv.hidden = MISI[S.i].k !== 'A' && !S.rot;
    lv.classList.toggle('datar', !S.rot);
    lv.style.setProperty('--rot', (-S.rot) + 'deg');
    // histogram + meter (terang bingkai dibanding seluruh foto)
    const h = histo(c);
    const ev = clamp(e.d + Math.log2(h.mean / (h.meanFoto || .4)) * .8, -3, 3);
    const arah = m === 'nikon' ? -1 : 1;
    $('hEv').style.left = (50 + arah * ev / 3 * 50) + '%';
  }

  const kecil = document.createElement('canvas');
  const meanCache = {};
  function luma(ctx, w, h) {
    const d = ctx.getImageData(0, 0, w, h).data, bins = new Array(32).fill(0);
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) {
      const y = (.2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]) / 255;
      sum += y; bins[Math.min(31, y * 32 | 0)]++;
    }
    return { mean: sum / (d.length / 4), bins };
  }
  function histo(c) {
    kecil.width = 64; kecil.height = Math.max(1, Math.round(64 * c.height / c.width));
    const x = kecil.getContext('2d', { willReadFrequently: true });
    x.drawImage(c, 0, 0, kecil.width, kecil.height);
    let r;
    try { r = luma(x, kecil.width, kecil.height); } catch (e) { return { mean: .4, meanFoto: .4 }; }
    const n = imgNow(), im = foto(n);
    if (meanCache[n] == null && im.naturalWidth) {
      kecil.width = 64; kecil.height = Math.round(64 / rasioNow());
      x.drawImage(im, 0, 0, kecil.width, kecil.height);
      try { meanCache[n] = luma(x, kecil.width, kecil.height).mean; } catch (e) { meanCache[n] = .4; }
    }
    const hc = $('hist'), g = hc.getContext('2d'), mx = Math.max(...r.bins) || 1;
    g.clearRect(0, 0, hc.width, hc.height);
    g.fillStyle = 'rgba(255,255,255,.85)';
    r.bins.forEach((v, i) => { const hh = v / mx * hc.height; g.fillRect(i * 3, hc.height - hh, 2.6, hh); });
    return { mean: r.mean, meanFoto: meanCache[n] };
  }

  // peta kecil: seluruh foto + posisi bingkai kamera
  function drawPeta(cv) {
    if (!cv) return;
    const im = foto(imgNow()), r = rasioNow();
    const W = cv.width, H = Math.round(W / r);
    if (cv.height !== H) cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#0d1d1e'; g.fillRect(0, 0, W, H);
    if (im.naturalWidth) g.drawImage(im, 0, 0, W, H);
    g.fillStyle = 'rgba(10,24,25,.45)'; g.fillRect(0, 0, W, H);
    g.save();
    g.translate(S.cx * W, S.cy * H); g.rotate(S.rot * Math.PI / 180);
    const w = S.w * W, h = S.w * H;
    if (im.naturalWidth) {
      g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip();
      g.rotate(-S.rot * Math.PI / 180); g.translate(-S.cx * W, -S.cy * H);
      g.drawImage(im, 0, 0, W, H);
      g.restore(); g.save();
      g.translate(S.cx * W, S.cy * H); g.rotate(S.rot * Math.PI / 180);
    }
    g.strokeStyle = '#fff'; g.lineWidth = Math.max(1.5, W / 120);
    g.strokeRect(-w / 2, -h / 2, w, h);
    g.restore();
  }

  /* ---------- bunyi fokus (bip bip) ---------- */
  function bip() {
    if (!layar || $('misi').hidden) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const n = K().m === 'nikon' ? 1 : 2;
      for (let i = 0; i < n; i++) {
        const t0 = actx.currentTime + i * .09, o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = 2700;
        g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.05, t0 + .005);
        g.gain.exponentialRampToValueAtTime(.0001, t0 + .06);
        o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + .07);
      }
    } catch (e) { /* tanpa suara */ }
  }

  /* ---------- mode tampilan ---------- */
  function setLayar(on, simpan = true) {
    layar = on;
    $('stage').classList.toggle('layar', on);
    $('tampilSeg').querySelectorAll('button').forEach(b => b.classList.toggle('on', (b.dataset.t === 'layar') === on));
    document.querySelector('.drag-pill').textContent = on ? 'Seret untuk mengarahkan kamera' : 'Seret foto untuk menggeser kamera';
    if (simpan) try { localStorage.setItem('edfat_layar', on ? '1' : '0'); } catch (e) { /* tanpa storage */ }
    if (on) { bangunHud(); last = null; setAf('kunci'); }
    if (!$('misi').hidden) window.render();
  }

  /* ---------- pemilih kamera ---------- */
  function renderPilih() {
    const pid = pilihan && pilihan.id;
    $('kpTab').innerHTML = Object.entries(KAMERA).map(([k, v]) =>
      `<button role="tab" aria-selected="${merekTab === k}" class="${merekTab === k ? 'on' : ''}" data-merek="${k}" data-kp="${k}">${v.nama}</button>`).join('');
    $('kpList').innerHTML = KAMERA[merekTab].seri.map(s => `
      <button class="kp-item ${pid === s.id ? 'on' : ''}" data-kam="${s.id}" data-merek="${merekTab}">
        <span class="kp-nama">${KAMERA[merekTab].nama} <b>${s.nama}</b></span>
        <span class="kp-badge">${s.sensor}</span>
        <span class="kp-spek">${s.mp} MP · hingga ${s.fps} fps</span>
        <span class="kp-ket">${s.ket}</span>
      </button>`).join('');
  }
  function buka(lalu) {
    sesudahPilih = lalu || null;
    if (pilihan && KAMERA[pilihan.m]) merekTab = pilihan.m;
    renderPilih();
    $('kamPilih').hidden = false;
    setTimeout(() => { const b = $('kpTab').querySelector('.on'); b && b.focus(); }, 30);
  }
  function tutup() {
    $('kamPilih').hidden = true;
    const f = sesudahPilih; sesudahPilih = null;
    if (f) f();
  }
  function pilih(id) {
    pilihan = id === 'umum' ? { m: 'umum', ...UMUM } : cari(id);
    sisa = 0;
    try { localStorage.setItem('edfat_kamera', id); } catch (e) { /* tanpa storage */ }
    renderChip();
    setLayar(id !== 'umum');
    tutup();
  }
  function renderChip() {
    const k = pilihan;
    const teks = k ? (k.m === 'umum' ? 'Kamera umum' : `${KAMERA[k.m].nama} ${k.nama}`) : 'Pilih kamera';
    $('kamChip').innerHTML = `<i class="ik-kam"></i>${teks}`;
    $('kamChip').title = k ? `${teks} · lensa ${k.lensa.nama}` : 'Pilih kamera';
    const h = $('kamHome');
    if (h) h.innerHTML = k
      ? `<i class="ik-kam"></i><span><b>${teks}</b><small>${k.sensor} · lensa ${k.lensa.nama}</small></span><em>Ganti</em>`
      : `<i class="ik-kam"></i><span><b>Pilih kameramu</b><small>Sony, Canon, atau Nikon</small></span><em>Pilih</em>`;
  }

  function init() {
    $('tampilSeg').addEventListener('click', e => {
      const b = e.target.closest('[data-t]'); if (!b) return;
      if (b.dataset.t === 'layar' && !pilihan) return buka(() => setLayar(true));
      setLayar(b.dataset.t === 'layar');
    });
    $('kamChip').addEventListener('click', () => buka());
    $('ctlEksp').addEventListener('click', e => {
      const b = e.target.closest('[data-arah]');
      if (b) return geserDial(b.closest('[data-d]').dataset.d, +b.dataset.arah);
      if (e.target.closest('#ekspReset')) { setelPas(); window.render(); }
    });
    $('kamHome').addEventListener('click', () => buka());
    $('kamPilih').addEventListener('click', e => {
      const t = e.target.closest('[data-kp]');
      if (t) { merekTab = t.dataset.kp; renderPilih(); return; }
      const b = e.target.closest('[data-kam]');
      if (b) return pilih(b.dataset.kam);
      if (e.target.closest('#kpLewati')) return pilih('umum');
      if (e.target.closest('#kpTutup') || e.target === $('kamPilih')) tutup();
    });
    document.addEventListener('keydown', e => {
      if (!$('kamPilih').hidden && e.key === 'Escape') { e.stopImmediatePropagation(); tutup(); }
    }, true);
    window.addEventListener('resize', () => { if (layar && !$('misi').hidden) render(); });
    renderChip();
    setLayar(layar, false);
  }

  window.Kam = {
    punya: () => !!pilihan,
    layar: () => layar,
    buka, render, drawPeta,
    mulai() { setelPas(); if (layar) { bangunHud(); last = null; setAf('kunci'); } },
    efek, terapkan, saran,
    jepret() {
      if (sisa > 0) sisa--;
      const k = $('hud') && $('hud').querySelector('.h-kartu');
      if (k) { k.classList.remove('tulis'); void k.offsetWidth; k.classList.add('tulis'); }
    },
  };
  init();
})();
