/* Simulator EDFAT — kamera virtual di atas foto asli.
   Koordinat semua kotak dinormalisasi 0..1 terhadap lebar/tinggi foto.
   Semua foto 3:2 dan bingkai kamera juga 3:2, jadi lebar & tinggi bingkai = w. */

const F_MIN = 24, F_MAX = 200;

// Kesan tiap tinggi kamera, sama untuk semua event.
const TINGGI = {
  low:  { label: 'Rendah',       efek: 'Kamera di bawah mata subjek → subjek terlihat besar, kuat, dominan.' },
  eye:  { label: 'Sejajar mata', efek: 'Kamera setinggi mata subjek → terasa netral, akrab, natural.' },
  high: { label: 'Tinggi',       efek: 'Kamera di atas subjek → subjek terlihat kecil, pola dan situasi sekitarnya ikut terbaca.' },
};

/* Data per event. E.wajib: [label, kotak, ambang frac, saran kalau gagal].
   F.sisi: batas tepi bingkai depan (kiri = x1 maks, kanan = x2 min). */
const EVENTS = {
  pacu: {
    nama: 'Pacu Jalur',
    judul: 'Festival Pacu Jalur 2026',
    ket: 'Lomba perahu panjang di sungai, ribuan penonton di tepian.',
    kredit: 'Foto: Vamos Shott · Festival Pacu Jalur, Kuantan Singingi, Agustus 2026',
    sampul: 'pacu_entire',
    E: {
      img: 'pacu_entire', start: { cx: .5, cy: .55, f: 70 },
      misi: 'Tunjukkan skala festivalnya: tepian yang penuh penonton, orang-orang di sungai, dan jalur yang sedang berpacu harus masuk satu frame.',
      wajib: [
        ['Tepian penuh penonton & tenda', [0, .36, .6, .68], .85, 'Tepian yang penuh penonton itu bukti besarnya festival ini, jangan sampai terpotong.'],
        ['Jalur yang sedang berpacu', [.86, .68, 1, .74], .8, 'Jalurnya ada di kanan. Tanpa jalur, orang nggak tahu ini lomba apa.'],
        ['Penonton di dalam sungai', [.27, .82, .6, .98], .8, 'Penonton yang turun ke sungai itu khas Pacu Jalur, masukkan juga.'],
      ],
      ok: 'Sekali lihat orang langsung paham: lomba perahu di sungai, ditonton ribuan orang. Pembuka yang kuat.',
    },
    D: {
      img: 'pacu_detail', start: { cx: .5, cy: .5, f: 24 },
      misi: 'Cari SATU detail yang bercerita (peci pemimpin, logo di dayung, ikat kepala, ukiran jalur, atau tangan memegang tongkat) lalu zoom sampai detail itu memenuhi frame.',
      target: [
        ['Peci & wajah pemimpin', [.60, .18, .68, .32]],
        ['Logo di bilah dayung', [.675, .62, .73, .75]],
        ['Ikat kepala kuning', [.43, .53, .52, .62]],
        ['Ukiran lambung jalur', [.30, .76, .50, .86]],
        ['Tangan memegang tongkat', [.575, .44, .61, .52]],
      ],
    },
    F: {
      img: 'pacu_frame', start: { cx: .47, cy: .45, f: 60 }, tipe: 'sepertiga',
      misi: 'Foto menara “Festival Pacu Jalur” di jembatan dari balik benda di depan kamera. Bingkai blur di samping dan bawah harus ikut, dan menaranya taruh di garis sepertiga.',
      subj: ['Menara festival', [.43, .24, .50, .60]],
      bingkai: [['Bingkai kiri', [0, 0, .08, 1]], ['Bingkai kanan', [.93, 0, 1, 1]], ['Bingkai bawah', [0, .87, 1, 1]]],
      sisi: { kiri: .08, kanan: .94 }, labelSisi: 'Bingkai blur di kiri atau kanan',
      bawah: .9, labelBawah: 'Bingkai blur di bawah',
      ok: 'Benda di depan kamera membingkai menara, jadi fotonya terasa seperti “mengintip” festival. Menara di garis sepertiga bikin komposisinya lebih hidup.',
    },
    A: {
      tinggi: {
        low:  { img: 'pacu_angle_low',  subj: [.57, .29, .81, .79] },
        eye:  { img: 'pacu_angle_eye',  subj: [.02, .45, .98, .78] },
        high: { img: 'pacu_angle_high', subj: [.34, .26, .70, .70] },
      },
      brief: {
        low:  'Bikin tukang onjai di haluan terlihat GAGAH, seperti pemimpin pasukan.',
        eye:  'Tunjukkan kekompakan awak jalur secara NATURAL, sejajar dengan mereka.',
        high: 'Tunjukkan POLA dayung dan awak jalur, dilihat dari atas jembatan.',
      },
    },
    T: {
      n: 10, img: i => 'pacu_time_' + i, area: [.25, .3, .75, .7],
      misi: 'Foto beruntun ini diputar seperti kejadian asli. Perhatikan tukang onjai di haluan, lalu tekan jepret tepat di momen paling dramatis.',
      skor: [25, 25, 30, 60, 45, 65, 85, 100, 75, 35],
      note: [
        'Tukang onjai masih menari di haluan. Menarik, tapi puncaknya belum datang.',
        'Masih menari. Perhatikan polanya dulu.',
        'Badannya membungkuk. Sesuatu akan terjadi.',
        'Gerakan tarinya paling lebar. Bagus, tapi tunggu, ada yang lebih dramatis.',
        'Dia mulai goyah di ujung haluan.',
        'Hampir! Dia terduduk di ujung jalur, belum menyentuh air.',
        'Dia sedang jatuh ke sungai. Kuat, tinggal sepersekian detik lagi.',
        'Ini puncaknya: tubuhnya menghantam air, cipratan meledak, pendayung tetap mendayung.',
        'Cipratannya paling besar, tapi orangnya sudah tertutup air.',
        'Terlambat. Yang tersisa cuma cipratan.',
      ],
    },
  },

};

const MISI = [
  {
    k: 'E', nama: 'Entire', judul: 'Foto pembuka',
    def: 'Foto lebar yang menunjukkan peristiwa secara utuh: di mana, ada apa, dan suasananya seperti apa. Biasanya jadi foto pertama dalam cerita.',
    tip: 'Pakai lensa lebar (16–35 mm) atau mundur. Cari elemen yang menjelaskan lokasi: papan nama, logo, penonton.',
    ex: 'Contoh: seluruh arena + penonton + papan nama.',
    pelajaran: '<b>Entire</b> menjawab “di mana dan ada apa”. Selalu ambil satu foto lebar sebelum mendekat.',
    nilai(s, d) {
      const r = rect(s);
      const lebar = s.w >= .8 ? 1 : s.w >= .6 ? .5 : 0;
      const n = d.wajib.length, tiap = Math.floor(65 / n);
      const cek = d.wajib.map(([label, b, thr], i) => item(label, frac(b, r) >= thr, tiap + (i === 0 ? 65 - tiap * n : 0)));
      const gagal = d.wajib.find((w, i) => !cek[i].ok);
      return {
        items: [...cek, item('Cukup lebar (lensa ≤ 30 mm)', lebar, 35, lebar ? undefined : 5)],
        saran: !lebar ? 'Bingkaimu masih sempit. Foto Entire harus memperlihatkan lokasi dan suasananya, bukan cuma satu bagian. Geser slider lensa ke kiri.'
          : gagal ? gagal[3] : d.ok,
      };
    },
  },
  {
    k: 'D', nama: 'Detail', judul: 'Bagian kecil yang bercerita',
    def: 'Foto dekat pada satu bagian penting: tangan, alat, ekspresi, atau benda kecil yang memperkuat cerita dan sering terlewat kalau cuma dilihat sekilas.',
    tip: 'Pakai lensa panjang (70–200 mm) atau mendekat. Satu detail saja per foto, buang yang lain dari frame.',
    ex: 'Contoh: dayung, ikat kepala, tangan, sepatu.',
    pelajaran: '<b>Detail</b> itu satu benda, satu fokus. Kalau masih ada tiga hal di frame, berarti belum detail.',
    nilai(s, d) {
      const r = rect(s);
      let best = null, fill = 0;
      for (const [n, b] of d.target) {
        if (frac(b, r) < .9) continue;
        const fl = area(b) / (s.w * s.w);
        if (fl > fill) { fill = fl; best = n; }
      }
      const panjang = s.f >= 70;
      const penuh = fill >= .25 ? 1 : fill >= .12 ? .5 : 0;
      return {
        items: [
          item('Ada satu detail utuh di frame' + (best ? ` (${best.toLowerCase()})` : ''), !!best, 30),
          item('Lensa cukup panjang (≥ 70 mm)', panjang, 30),
          item('Detail memenuhi frame', penuh, 40),
        ],
        saran: !best ? 'Belum ada detail yang utuh di dalam bingkai. Nyalakan “Petunjuk” kalau bingung mau ambil apa.'
          : !panjang || !penuh ? `Kamu sudah nemu ${best.toLowerCase()}, tapi masih kejauhan. Zoom lagi sampai detailnya jadi “pemeran utama”.`
          : `${best} jadi pemeran utama. Detail seperti ini yang bikin cerita terasa hidup.`,
      };
    },
  },
  {
    k: 'F', nama: 'Frame', judul: 'Bingkai di depan subjek',
    def: 'Memakai elemen di depan kamera (jaring, tiang, pintu, daun, orang) sebagai bingkai alami, supaya mata penonton langsung diarahkan ke subjek dan foto terasa punya kedalaman.',
    tip: 'Biarkan elemen depan menyentuh pinggir frame. Bingkainya boleh blur, subjeknya yang harus tajam.',
    ex: 'Contoh: memotret lewat jaring, pagar, atau celah tenda.',
    pelajaran: '<b>Frame</b> bukan sekadar “ada benda di depan”. Elemen depan harus mengarahkan mata ke subjek.',
    nilai(s, d) {
      const r = rect(s), sub = d.subj[1];
      const utuh = frac(sub, r) >= .95;
      const sisi = (d.sisi.kiri != null && r.x1 <= d.sisi.kiri) || (d.sisi.kanan != null && r.x2 >= d.sisi.kanan);
      const bawah = r.y2 >= d.bawah;
      let ke4, lbl4, saran4;
      if (d.tipe === 'sepertiga') {
        const pos = ((sub[0] + sub[2]) / 2 - r.x1) / s.w;
        ke4 = (pos >= .25 && pos <= .44) || (pos >= .56 && pos <= .75);
        lbl4 = `${d.subj[0]} di garis sepertiga`;
        saran4 = `Bingkainya sudah dapat. Sekarang geser supaya ${d.subj[0].toLowerCase()} jatuh di garis 1/3 (nyalakan “Garis 1/3”), jangan pas di tengah.`;
      } else {
        ke4 = (sub[3] - sub[1]) / s.w >= .6;
        lbl4 = 'Subjek tetap dominan';
        saran4 = 'Bingkainya sudah dapat, tapi subjek jadi kecil. Zoom sedikit supaya dia tetap pusat perhatian.';
      }
      return {
        items: [
          item(`${d.subj[0]} utuh di frame`, utuh, 30),
          item(d.labelSisi, sisi, 25),
          item(d.labelBawah, bawah, 25),
          item(lbl4, ke4, 20),
        ],
        saran: !utuh ? `${d.subj[0]} terpotong. Bingkai boleh di pinggir, tapi subjek harus utuh.`
          : !sisi || !bawah ? 'Geser atau lebarkan kamera sampai benda di depan ikut masuk di pinggir frame, itu “bingkai” alaminya.'
          : !ke4 ? saran4 : d.ok,
      };
    },
  },
  {
    k: 'A', nama: 'Angle', judul: 'Sudut pandang kamera',
    def: 'Posisi kamera terhadap subjek: rendah (low angle), sejajar mata (eye level), atau tinggi (high angle). Kemiringan kamera (dutch angle) juga termasuk. Tiap sudut memberi kesan yang berbeda.',
    tip: 'Sebelum motret, tanya dulu: subjek ini mau terlihat kuat, akrab, atau kecil di tengah situasinya? Lalu pilih tinggi kamera.',
    ex: 'Contoh: jongkok (low), berdiri (eye), dari jembatan atau tribun (high).',
    pelajaran: '<b>Angle</b> mengubah makna. Rendah = kuat, sejajar = akrab, tinggi = kecil/pola. Miring sedikit = dinamis, kebanyakan = pusing.',
    nilai(s, d) {
      const a = TINGGI[s.tinggi], mau = TINGGI[s.brief], r = rect(s);
      const pas = s.tinggi === s.brief;
      const utuh = frac(d.tinggi[s.tinggi].subj, r) >= .85;
      const miring = Math.abs(s.rot) <= 15;
      return {
        items: [
          item(`Posisi kamera sesuai misi (${mau.label.toLowerCase()})`, pas, 60),
          item('Subjek utuh di frame', utuh, 25),
          item('Kemiringan wajar (≤ 15°)', miring, 15),
        ],
        saran: !pas ? `Posisi “${a.label}” memberi kesan: ${a.efek.split('→ ')[1]} Misinya butuh posisi ${mau.label.toLowerCase()}.`
          : !utuh ? 'Sudutnya sudah benar, tapi subjeknya terpotong.'
          : !miring ? 'Sudutnya benar, tapi kemiringannya berlebihan. Dutch angle cukup 5–15° biar dinamis, bukan bikin pusing.'
          : `Pas. ${mau.efek}`,
      };
    },
  },
  {
    k: 'T', nama: 'Time', judul: 'Momen yang tepat',
    def: 'Soal waktu: kapan kamu menekan tombol (momen puncak) dan berapa lama rana terbuka (beku atau blur). Di olahraga, satu detik bisa berisi 5–10 momen berbeda.',
    tip: 'Antisipasi: perhatikan polanya dulu, lalu tekan sedikit SEBELUM puncaknya. Fotografer olahraga biasanya pakai burst + 1/1000 detik atau lebih cepat.',
    ex: 'Contoh: cipratan air, bola tepat kena raket, senyum paling lebar.',
    pelajaran: '<b>Time</b> itu antisipasi. Momen puncak cuma sepersekian detik, jadi baca polanya dan pakai burst.',
    nilai(s, d) {
      const r = rect(s), sk = d.skor[s.frame - 1];
      const puncak = sk >= 80 ? 1 : sk >= 50 ? .5 : 0;
      const utuh = frac(d.area, r) >= .85;
      return {
        items: [
          item(`Momen puncak (frame ${s.frame}/${d.n})`, puncak, 60, Math.round(sk * .6)),
          item('Subjek utuh di frame', utuh, 20),
          item('Dijepret saat diputar, seperti di lapangan', s.shotPlaying, 20),
        ],
        saran: d.note[s.frame - 1] + (s.shotPlaying ? '' : ' Coba juga saat diputar, karena di lapangan waktu nggak bisa dimundurin.'),
      };
    },
  },
];

/* ---------- util ---------- */
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const area = b => (b[2] - b[0]) * (b[3] - b[1]);
function rect(s) { return { x1: s.cx - s.w / 2, y1: s.cy - s.w / 2, x2: s.cx + s.w / 2, y2: s.cy + s.w / 2 }; }
function frac(b, r) {
  const ix = Math.max(0, Math.min(b[2], r.x2) - Math.max(b[0], r.x1));
  const iy = Math.max(0, Math.min(b[3], r.y2) - Math.max(b[1], r.y1));
  return (ix * iy) / area(b);
}
// ok: true/false atau 1 / .5 / 0. pts = poin kalau tidak penuh (opsional).
function item(label, ok, max, pts) {
  const v = ok === true ? 1 : ok === false ? 0 : ok;
  return { label, ok: v, max, pts: pts ?? Math.round(max * v) };
}
const fToV = f => 100 * Math.log(f / F_MIN) / Math.log(F_MAX / F_MIN);
const vToF = v => F_MIN * Math.pow(F_MAX / F_MIN, v / 100);

/* ---------- state ---------- */
const S = {
  ev: 'pacu', i: 0, cx: .5, cy: .5, f: 50, w: .48, rot: 0,
  tinggi: 'eye', brief: 'low',
  frame: 1, playing: false, fps: 3, hold: 0, shotPlaying: false,
  hasil: Array(MISI.length).fill(null),
};
let timer = null, dragged = false;
const ev = () => EVENTS[S.ev];
const dat = () => ev()[MISI[S.i].k];
try { const e = localStorage.getItem('edfat_ev'); if (EVENTS[e]) S.ev = e; } catch (err) { /* tanpa storage */ }

/* ---------- gambar ---------- */
const CACHE = {};
function foto(name) {
  if (!CACHE[name]) { const im = new Image(); im.src = `img/${name}.jpg`; im.onload = () => drawLCD(); CACHE[name] = im; }
  return CACHE[name];
}
function preload() {
  const e = ev();
  [e.E.img, e.D.img, e.F.img].forEach(foto);
  Object.values(e.A.tinggi).forEach(t => foto(t.img));
  for (let n = 1; n <= e.T.n; n++) foto(e.T.img(n));
}
function imgNow() {
  const k = MISI[S.i].k, d = dat();
  if (k === 'A') return d.tinggi[S.tinggi].img;
  if (k === 'T') return d.img(S.frame);
  return d.img;
}

/* ---------- view ---------- */
function show(id) {
  for (const v of ['home', 'misi', 'hasil']) $(v).hidden = v !== id;
  window.scrollTo({ top: 0 });
  renderSteps(id);
}
function renderSteps(view) {
  $('steps').innerHTML = MISI.map((m, i) =>
    `<button class="step ${view === 'misi' && S.i === i ? 'on' : ''} ${S.hasil[i] ? 'done' : ''}" data-go="${i}" title="${m.nama}">${m.k}</button>`
  ).join('') + `<button class="step end ${view === 'hasil' ? 'on' : ''}" data-go="hasil">Hasil</button>`;
}

function mulai(i) {
  stopPlay();
  S.i = i;
  const m = MISI[i], d = dat();
  const st = d.start || { cx: .5, cy: .5, f: 24 };
  S.cx = st.cx; S.cy = st.cy; setF(st.f); S.rot = 0;
  $('rot').value = 0;
  if (m.k === 'A') {
    const h = Object.keys(TINGGI);
    S.brief = h[Math.floor(Math.random() * h.length)];
    const lain = h.filter(x => x !== S.brief);
    S.tinggi = lain[Math.floor(Math.random() * lain.length)];
  }
  if (m.k === 'T') { S.frame = 1; S.hold = 0; $('scrub').max = d.n; $('scrub').value = 1; startPlay(); }

  $('pHuruf').textContent = m.k;
  $('pNama').textContent = m.nama;
  $('pJudul').textContent = m.judul;
  $('pDef').textContent = m.def;
  $('pTip').textContent = m.tip;
  $('ctlRot').hidden = m.k !== 'A';
  $('ctlTinggi').hidden = m.k !== 'A';
  $('ctlWaktu').hidden = m.k !== 'T';
  $('gantiBrief').hidden = m.k !== 'A';
  $('diagram').hidden = m.k !== 'A';
  $('dragTip').classList.toggle('off', dragged);
  renderMisiText();
  renderHints();
  show('misi');
  render();
}
function renderMisiText() {
  const m = MISI[S.i];
  const d = dat();
  $('pMisi').textContent = $('pMisiM').textContent = m.k === 'A' ? d.brief[S.brief] : d.misi;
  $('pHurufM').textContent = m.k;
  if (m.k === 'A') {
    $('tinggiSeg').innerHTML = Object.entries(TINGGI).map(([k, a]) =>
      `<button data-h="${k}" class="${S.tinggi === k ? 'on' : ''}">${a.label}</button>`).join('');
    $('diagram').innerHTML = diagram(S.tinggi);
  }
}
function renderHints() {
  const k = MISI[S.i].k, d = dat();
  const list = {
    E: () => d.wajib.map(w => [w[0], w[1]]),
    D: () => d.target,
    F: () => [d.subj, ...d.bingkai],
    A: () => [['Subjek', d.tinggi[S.tinggi].subj]],
    T: () => [['Area gerak', d.area]],
  }[k]();
  $('hints').innerHTML = list.map(([n, b]) =>
    `<span style="left:${b[0] * 100}%;top:${b[1] * 100}%;width:${(b[2] - b[0]) * 100}%;height:${(b[3] - b[1]) * 100}%"><em>${n}</em></span>`
  ).join('');
}

function setF(f) {
  S.f = clamp(f, F_MIN, F_MAX);
  S.w = F_MIN / S.f;
  $('zoom').value = fToV(S.f);
  clampPos();
}
function clampPos() {
  S.cx = clamp(S.cx, S.w / 2, 1 - S.w / 2);
  S.cy = clamp(S.cy, S.w / 2, 1 - S.w / 2);
}

let rafId = 0;
function render() {
  const fotoEl = $('foto'), want = foto(imgNow()).src;
  if (fotoEl.src !== want) fotoEl.src = want;
  const vf = $('vf');
  vf.style.left = (S.cx - S.w / 2) * 100 + '%';
  vf.style.top = (S.cy - S.w / 2) * 100 + '%';
  vf.style.width = S.w * 100 + '%';
  vf.style.height = S.w * 100 + '%';
  vf.style.transform = S.rot ? `rotate(${S.rot}deg)` : '';
  const mm = Math.round(S.f) + ' mm';
  $('vfChip').textContent = mm + (S.rot ? ` · ${S.rot}°` : '');
  $('zoomOut').textContent = mm;
  $('rotOut').textContent = S.rot + '°';
  $('frameOut').textContent = S.frame + '/' + ev().T.n;

  S.shotPlaying = S.playing;
  const res = MISI[S.i].nilai(S, dat());
  $('cek').innerHTML = res.items.map(cekLi).join('');
  const skor = res.items.reduce((a, b) => a + b.pts, 0);
  const sl = $('skorLive');
  sl.textContent = skor;
  sl.classList.toggle('hi', skor >= 85);
  sl.title = 'Perkiraan skor kalau dijepret sekarang';

  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(drawLCD);
}
function cekLi(it) {
  return `<li class="${it.ok === 1 ? 'ok' : it.ok > 0 ? 'half' : ''}">${it.label}</li>`;
}

/* ---------- kamera ---------- */
function drawCrop(ctx, W, H) {
  const im = foto(imgNow());
  ctx.fillStyle = '#0d1d1e';
  ctx.fillRect(0, 0, W, H);
  if (!im.complete || !im.naturalWidth) return;
  const nw = im.naturalWidth, nh = im.naturalHeight;
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-S.rot * Math.PI / 180);
  const s = W / (S.w * nw);
  ctx.scale(s, s);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(im, -S.cx * nw, -S.cy * nh, nw, nh);
  ctx.restore();
}
function drawLCD() {
  const c = $('lcd');
  if (!c.offsetParent) return;
  drawCrop(c.getContext('2d'), c.width, c.height);
  const m = MISI[S.i];
  $('lcdInfo').textContent = `${Math.round(S.f)} mm` + (S.rot ? `  ·  miring ${S.rot}°` : '') +
    (m.k === 'T' ? `  ·  frame ${S.frame}/${ev().T.n}` : '') + (m.k === 'A' ? `  ·  ${TINGGI[S.tinggi].label}` : '');
}

function jepret() {
  if (!$('modal').hidden || $('misi').hidden) return;
  S.shotPlaying = S.playing;
  stopPlay();
  bunyi();
  const fl = $('flash');
  fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');

  const c = document.createElement('canvas');
  c.width = 1200; c.height = 800;
  drawCrop(c.getContext('2d'), c.width, c.height);
  const m = MISI[S.i];
  const res = m.nilai(S, dat());
  const skor = res.items.reduce((a, b) => a + b.pts, 0);
  S.hasil[S.i] = { img: c.toDataURL('image/jpeg', .86), skor, k: m.k, nama: m.nama };

  $('mFoto').src = S.hasil[S.i].img;
  $('mHuruf').textContent = `${m.k} · ${m.nama}`;
  $('mJudul').textContent = skor >= 85 ? 'Mantap, lulus!' : skor >= 60 ? 'Lumayan, hampir!' : 'Belum kena';
  $('mSkor').textContent = skor;
  $('mCek').innerHTML = res.items.map(cekLi).join('');
  $('mSaran').textContent = res.saran;
  $('lanjut').textContent = S.i < MISI.length - 1 ? `Lanjut ke ${MISI[S.i + 1].k}` : 'Lihat cerita fotomu';
  $('modal').hidden = false;
  renderSteps('misi');
  setTimeout(() => $('lanjut').focus(), 50);
}

let actx = null;
function bunyi() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const klik = (t, dur, gain) => {
      const len = Math.floor(actx.sampleRate * dur);
      const buf = actx.createBuffer(1, len, actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = actx.createBufferSource(), g = actx.createGain(), hp = actx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 1800;
      g.gain.value = gain;
      src.buffer = buf; src.connect(hp).connect(g).connect(actx.destination);
      src.start(actx.currentTime + t);
    };
    klik(0, .035, .5); klik(.07, .05, .35);
  } catch (e) { /* tanpa suara pun tetap jalan */ }
}

/* ---------- time (burst) ---------- */
function startPlay() {
  stopPlay();
  S.playing = true;
  $('play').textContent = '⏸ Jeda';
  timer = setInterval(() => {
    if (S.hold > 0) { S.hold--; return; }
    if (S.frame >= ev().T.n) { S.frame = 1; S.hold = 2; } else S.frame++;
    $('scrub').value = S.frame;
    render();
  }, 1000 / S.fps);
}
function stopPlay() {
  clearInterval(timer); timer = null;
  S.playing = false;
  $('play').textContent = '▶ Putar';
}

/* ---------- diagram angle ---------- */
function diagram(h) {
  const camY = { low: 92, eye: 38, high: 10 }[h];
  const a = TINGGI[h];
  return `<svg viewBox="0 0 320 130" role="img" aria-label="Posisi kamera ${a.label}">
    <line x1="10" y1="108" x2="310" y2="108" stroke="#DCEAEA" stroke-width="2"/>
    <line x1="74" y1="${camY + 6}" x2="232" y2="62" stroke="#11B3B1" stroke-width="2" stroke-dasharray="5 5"/>
    <g fill="none" stroke="#102A2C" stroke-width="3" stroke-linecap="round">
      <circle cx="240" cy="36" r="9" fill="#E7FDFD"/>
      <line x1="240" y1="45" x2="240" y2="78"/>
      <line x1="240" y1="54" x2="226" y2="66"/><line x1="240" y1="54" x2="256" y2="64"/>
      <line x1="240" y1="78" x2="230" y2="106"/><line x1="240" y1="78" x2="252" y2="106"/>
    </g>
    <g transform="translate(46 ${camY})">
      <rect x="0" y="0" width="28" height="18" rx="4" fill="#102A2C"/>
      <rect x="6" y="-4" width="10" height="5" rx="1.5" fill="#102A2C"/>
      <circle cx="18" cy="9" r="6" fill="#5FE5E9" stroke="#102A2C" stroke-width="2"/>
    </g>
    <text x="10" y="126" font-size="11" font-weight="700" fill="#0B6B6A" font-family="Manrope, sans-serif">${a.label.toUpperCase()}</text>
    <text x="310" y="126" font-size="11" fill="#4A6265" text-anchor="end" font-family="Manrope, sans-serif">subjek</text>
  </svg><p class="tip" style="margin-top:6px">${a.efek}</p>`;
}

/* ---------- hasil ---------- */
function totalSkor() {
  return Math.round(S.hasil.reduce((a, h) => a + (h ? h.skor : 0), 0) / MISI.length);
}
function tampilHasil() {
  stopPlay();
  const tot = totalSkor();
  const jml = S.hasil.filter(Boolean).length;
  $('hSkor').textContent = tot;
  $('hJudul').textContent = jml < MISI.length ? 'Ceritanya belum lengkap'
    : tot >= 85 ? 'Siap liputan!' : tot >= 65 ? 'Sudah bercerita, tinggal dipoles' : 'Ayo latihan lagi';
  $('hLead').textContent = jml < MISI.length
    ? `Kamu baru menjepret ${jml} dari 5 huruf. Lengkapi dulu supaya ceritanya utuh.`
    : 'Lima foto ini kalau disusun jadi satu cerita: suasana, detail, bingkai, sudut, dan momen puncaknya.';
  $('story').innerHTML = MISI.map((m, i) => {
    const h = S.hasil[i];
    return h
      ? `<figure class="shot ${m.k}" style="margin:0"><img src="${h.img}" alt="Foto ${m.nama}"><span class="tag"><b>${m.k}</b>${m.nama}</span><span class="nil">${h.skor}</span></figure>`
      : `<button class="shot ${m.k} kosong" data-go="${i}">${m.k} · ${m.nama} belum dijepret</button>`;
  }).join('');
  const lemah = S.hasil.map((h, i) => [h ? h.skor : -1, i]).sort((a, b) => a[0] - b[0])[0];
  $('hTips').innerHTML = MISI.map((m, i) =>
    `<li${i === lemah[1] ? ' style="color:var(--ink)"' : ''}>${m.pelajaran}${i === lemah[1] ? ' <em>(paling perlu dilatih)</em>' : ''}</li>`
  ).join('');
  $('unduh').disabled = !jml;
  show('hasil');
}

async function unduh() {
  try { await document.fonts.ready; } catch (e) { /* abaikan */ }
  const W = 1600, M = 60, G = 20, topH = 150;
  const smW = (W - 2 * M - 3 * G) / 4, smH = smW * 2 / 3;
  const H = M + topH + 2 * smH + G + 90;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#F6FAFA'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#0B6B6A'; x.font = '700 22px Manrope, sans-serif';
  x.fillText('CERITA FOTOKU · EDFAT', M, M + 26);
  x.fillStyle = '#102A2C'; x.font = '64px "DM Serif Display", Georgia, serif';
  x.fillText(ev().judul, M, M + 100);
  x.textAlign = 'right'; x.fillStyle = '#0B6B6A'; x.font = '800 72px Manrope, sans-serif';
  x.fillText(totalSkor(), W - M, M + 100);
  x.textAlign = 'left';

  const load = src => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = src; });
  const slot = [[M, M + topH, 2 * smW + G, 2 * smH + G]];
  for (let i = 0; i < 4; i++) slot.push([M + (2 + i % 2) * (smW + G), M + topH + Math.floor(i / 2) * (smH + G), smW, smH]);
  for (let i = 0; i < MISI.length; i++) {
    const [sx, sy, sw, sh] = slot[i], h = S.hasil[i];
    x.save();
    roundRect(x, sx, sy, sw, sh, 18); x.clip();
    x.fillStyle = '#0d1d1e'; x.fillRect(sx, sy, sw, sh);
    const im = h && await load(h.img);
    if (im) {
      const s = Math.max(sw / im.width, sh / im.height);
      x.drawImage(im, sx + (sw - im.width * s) / 2, sy + (sh - im.height * s) / 2, im.width * s, im.height * s);
    }
    x.restore();
    x.fillStyle = 'rgba(255,255,255,.94)'; roundRect(x, sx + 12, sy + 12, 170, 40, 10); x.fill();
    x.fillStyle = '#11B3B1'; roundRect(x, sx + 16, sy + 16, 32, 32, 8); x.fill();
    x.fillStyle = '#102A2C'; x.font = '22px "DM Serif Display", serif'; x.textAlign = 'center';
    x.fillText(MISI[i].k, sx + 32, sy + 40);
    x.textAlign = 'left'; x.font = '700 17px Manrope, sans-serif';
    x.fillText(MISI[i].nama + (h ? ` · ${h.skor}` : ''), sx + 58, sy + 39);
  }
  x.fillStyle = '#4A6265'; x.font = '500 18px Manrope, sans-serif';
  x.fillText(ev().kredit + ' · dibuat di Simulator EDFAT', M, H - 36);

  const a = document.createElement('a');
  a.download = 'cerita-edfat.png';
  a.href = c.toDataURL('image/png');
  a.click();
}
function roundRect(x, X, Y, W, H, r) {
  x.beginPath();
  x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r);
  x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath();
}

/* ---------- input ---------- */
function initStage() {
  const st = $('stage');
  const pts = new Map();
  let pinch0 = 0, f0 = 0;
  st.addEventListener('pointerdown', e => {
    if (e.isPrimary) pts.clear(); // jari/mouse pertama: buang sisa pointer yang hilang
    try { st.setPointerCapture(e.pointerId); } catch (err) { /* pointer sintetis */ }
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    st.classList.add('drag');
    if (pts.size === 2) { pinch0 = jarak(); f0 = S.f; }
  });
  st.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    const p = pts.get(e.pointerId), b = st.getBoundingClientRect();
    if (pts.size === 1) {
      S.cx += (e.clientX - p.x) / b.width;
      S.cy += (e.clientY - p.y) / b.height;
      clampPos();
      if (!dragged) { dragged = true; $('dragTip').classList.add('off'); }
    }
    p.x = e.clientX; p.y = e.clientY;
    if (pts.size === 2 && pinch0) setF(f0 * jarak() / pinch0);
    render();
  });
  const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch0 = 0; if (!pts.size) st.classList.remove('drag'); };
  st.addEventListener('pointerup', up);
  st.addEventListener('pointercancel', up);
  st.addEventListener('lostpointercapture', up);
  st.addEventListener('wheel', e => { e.preventDefault(); setF(S.f * Math.exp(-e.deltaY * .0015)); render(); }, { passive: false });
  function jarak() { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; }
}

function renderEvent() {
  const satu = Object.keys(EVENTS).length < 2;
  $('evPick').hidden = satu;
  document.querySelector('.ev-lbl').hidden = satu;
  $('evPick').innerHTML = Object.entries(EVENTS).map(([k, e]) =>
    `<button class="ev ${S.ev === k ? 'on' : ''}" data-ev="${k}" aria-pressed="${S.ev === k}">
      <img src="img/${e.sampul}.jpg" alt=""><span><b>${e.nama}</b><small>${e.ket}</small></span></button>`
  ).join('');
  $('demoFoto').style.backgroundImage = `url(img/${ev().sampul}.jpg)`;
  $('kredit').textContent = ev().kredit + '.';
}
function pilihEvent(k) {
  if (k === S.ev) return;
  S.ev = k;
  S.hasil = Array(MISI.length).fill(null);
  try { localStorage.setItem('edfat_ev', k); } catch (err) { /* tanpa storage */ }
  preload();
  renderEvent();
  renderSteps('home');
}

function initUI() {
  $('teoriCards').innerHTML = MISI.map(m =>
    `<article class="card"><span class="huruf">${m.k}</span><h3>${m.nama}</h3><p>${m.def}</p><p class="ex">${m.ex}</p></article>`
  ).join('');

  document.addEventListener('click', e => {
    const p = e.target.closest('[data-ev]');
    if (p) { pilihEvent(p.dataset.ev); return; }
    const g = e.target.closest('[data-go]');
    if (!g) return;
    const v = g.dataset.go;
    $('modal').hidden = true;
    if (v === 'home') { stopPlay(); show('home'); }
    else if (v === 'hasil') tampilHasil();
    else mulai(+v);
  });

  $('zoom').addEventListener('input', e => { setF(vToF(+e.target.value)); render(); });
  $('rot').addEventListener('input', e => { S.rot = +e.target.value; render(); });
  $('tinggiSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-h]'); if (!b) return;
    S.tinggi = b.dataset.h; renderMisiText(); renderHints(); render();
  });
  $('gantiBrief').addEventListener('click', () => {
    const h = Object.keys(TINGGI);
    S.brief = h[(h.indexOf(S.brief) + 1) % h.length];
    renderMisiText(); render();
  });
  $('play').addEventListener('click', () => S.playing ? stopPlay() : startPlay());
  $('speedSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-fps]'); if (!b) return;
    S.fps = +b.dataset.fps;
    $('speedSeg').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    if (S.playing) startPlay();
  });
  $('scrub').addEventListener('input', e => { stopPlay(); S.frame = +e.target.value; render(); });
  $('tgGrid').addEventListener('change', e => $('stage').classList.toggle('nogrid', !e.target.checked));
  $('tgHint').addEventListener('change', e => $('stage').classList.toggle('hint', e.target.checked));
  $('shutter').addEventListener('click', jepret);
  $('lewati').addEventListener('click', () => S.i < MISI.length - 1 ? mulai(S.i + 1) : tampilHasil());
  $('ulang').addEventListener('click', () => {
    $('modal').hidden = true;
    if (MISI[S.i].k === 'T') startPlay();
  });
  $('lanjut').addEventListener('click', () => {
    $('modal').hidden = true;
    S.i < MISI.length - 1 ? mulai(S.i + 1) : tampilHasil();
  });
  $('unduh').addEventListener('click', unduh);

  document.addEventListener('keydown', e => {
    if ($('misi').hidden || e.target.matches('input, textarea')) return;
    if (!$('modal').hidden) { if (e.key === 'Escape') $('ulang').click(); return; }
    const step = .02;
    if (e.key === ' ') { e.preventDefault(); jepret(); return; }
    if (e.key === 'ArrowLeft') S.cx -= step;
    else if (e.key === 'ArrowRight') S.cx += step;
    else if (e.key === 'ArrowUp') S.cy -= step;
    else if (e.key === 'ArrowDown') S.cy += step;
    else if (e.key === '+' || e.key === '=') setF(S.f * 1.1);
    else if (e.key === '-') setF(S.f / 1.1);
    else return;
    e.preventDefault(); clampPos(); render();
  });
  window.addEventListener('resize', () => { if (!$('misi').hidden) drawLCD(); });
}

preload();
initUI();
renderEvent();
initStage();
show('home');
