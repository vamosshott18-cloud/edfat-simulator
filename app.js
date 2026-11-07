/* Simulator EDFAT — kamera virtual di atas foto asli.
   Koordinat semua kotak dinormalisasi 0..1 terhadap lebar/tinggi foto.
   Semua foto 3:2 dan bingkai kamera juga 3:2, jadi lebar & tinggi bingkai = w. */

const F_MIN = 24, F_MAX = 200, W_MIN = F_MIN / F_MAX;

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
    alt: {
      pacu_entire: 'Sungai lebar dengan ribuan penonton di tepian, orang-orang di dalam air, dan jalur di kejauhan',
      pacu_detail: 'Awak jalur berikat kepala kuning mendayung, pemimpin berbaju oranye berdiri di tengah',
      pacu_frame: 'Jembatan gantung dan menara festival, dibingkai benda blur di depan kamera',
      pacu_angle_low: 'Tukang onjai berdiri di haluan jalur, difoto dari dekat permukaan air',
      pacu_angle_eye: 'Awak jalur Rimbo Sakti mendayung, difoto dari samping setinggi mereka',
      pacu_angle_high: 'Awak jalur berseragam oranye dan biru, difoto dari atas jembatan',
      time: 'tukang onjai di haluan jalur',
    },
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
    k: 'E', inti: 'Tunjukkan di mana dan ada apa, dengan satu foto lebar.', nama: 'Entire', judul: 'Foto pembuka',
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
    k: 'D', inti: 'Dekati satu benda kecil yang ikut bercerita.', nama: 'Detail', judul: 'Bagian kecil yang bercerita',
    def: 'Foto dekat pada satu bagian penting: tangan, alat, ekspresi, atau benda kecil yang memperkuat cerita dan sering terlewat kalau cuma dilihat sekilas.',
    tip: 'Pakai lensa panjang (70–200 mm) atau mendekat. Satu detail saja per foto, buang yang lain dari frame.',
    ex: 'Contoh: dayung, ikat kepala, tangan, sepatu.',
    pelajaran: '<b>Detail</b> itu satu benda, satu fokus. Kalau masih ada tiga hal di frame, berarti belum detail.',
    nilai(s, d) {
      const r = rect(s);
      // rasio = seberapa penuh detail mengisi frame dibanding yang dibutuhkan.
      // Detail yang sangat kecil tidak mungkin mengisi 25% frame di 200 mm, jadi ambangnya ikut turun.
      let best = null, rasio = 0;
      for (const [n, kotak] of d.target) {
        if (frac(kotak, r) < .9) continue;
        const butuh = Math.min(.25, .8 * area(kotak) / W_MIN ** 2);
        const rs = area(kotak) / (s.w * s.w) / butuh;
        if (rs > rasio) { rasio = rs; best = n; }
      }
      const panjang = s.f >= 70;
      const penuh = rasio >= 1 ? 1 : rasio >= .5 ? .5 : 0;
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
    k: 'F', inti: 'Bingkai subjek dengan benda di depan kamera.', nama: 'Frame', judul: 'Bingkai di depan subjek',
    def: 'Memakai elemen di depan kamera (jaring, tiang, pintu, daun, orang) sebagai bingkai alami, supaya mata penonton langsung diarahkan ke subjek dan foto terasa punya kedalaman.',
    tip: 'Biarkan elemen depan menyentuh pinggir frame. Bingkainya boleh blur, subjeknya yang harus tajam.',
    ex: 'Contoh: memotret lewat jaring, pagar, atau celah tenda.',
    pelajaran: '<b>Frame</b> bukan sekadar “ada benda di depan”. Elemen depan harus mengarahkan mata ke subjek.',
    nilai(s, d) {
      const r = rect(s), sub = d.subj[1];
      const utuh = frac(sub, r) >= .95;
      if (d.tipe === 'ai') {
        const kena = d.bingkai.filter(([, b]) => frac(b, r) >= .3).length;
        const bingkai = kena >= 2 || (kena && d.bingkai.length === 1) ? 1 : kena ? .5 : 0;
        const dominan = Math.max(sub[2] - sub[0], sub[3] - sub[1]) / s.w >= .4;
        return {
          items: [
            item(`${d.subj[0]} utuh di frame`, utuh, 35),
            item('Elemen depan ikut membingkai', bingkai, 40),
            item('Subjek tetap dominan', dominan, 25),
          ],
          saran: !utuh ? `${d.subj[0]} terpotong. Bingkai boleh di pinggir, tapi subjek harus utuh.`
            : bingkai < 1 ? `Masukkan ${d.bingkai.map(b => b[0].toLowerCase()).join(' / ')} di pinggir frame, itu bingkai alaminya. Nyalakan “Petunjuk” untuk lihat posisinya.`
            : !dominan ? 'Bingkainya dapat, tapi subjek jadi kecil. Zoom sedikit supaya dia tetap pusat perhatian.'
            : 'Elemen depan membingkai subjek dan menuntun mata langsung ke dia. Foto jadi terasa berlapis.',
        };
      }
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
    k: 'A', inti: 'Pilih posisi kamera: dari bawah, sejajar, atau dari atas.', nama: 'Angle', judul: 'Sudut pandang kamera',
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
          : d.alasan ? `Betul! ${d.alasan}` : `Pas. ${mau.efek}`,
      };
    },
  },
  {
    k: 'T', inti: 'Tekan tombol tepat di momen puncak.', nama: 'Time', judul: 'Momen yang tepat',
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
const HASIL = {};        // hasil jepretan disimpan per event, supaya pindah event tidak menghapus
let evDasar = S.ev;      // event bawaan beranda (bukan 'kamu')
let timer = null, dragged = false, dizoom = false; // dipakai untuk animasi petunjuk
const ev = () => EVENTS[S.ev];
const dat = () => ev()[MISI[S.i].k];
try { const e = localStorage.getItem('edfat_ev'); if (EVENTS[e]) S.ev = evDasar = e; } catch (err) { /* tanpa storage */ }
// Progres disimpan per event di perangkat (foto upload 'kamu' tidak disimpan).
function muatHasil(e) {
  try {
    const h = JSON.parse(localStorage.getItem('edfat_hasil_' + e));
    if (Array.isArray(h) && h.length === MISI.length) return h;
  } catch (err) { /* data rusak / tanpa storage */ }
  return Array(MISI.length).fill(null);
}
function simpanHasil() {
  if (EVENTS[S.ev].aktif) return;
  try { localStorage.setItem('edfat_hasil_' + S.ev, JSON.stringify(S.hasil)); } catch (err) { /* penuh / tanpa storage */ }
}
function mulaiUlang() {
  if (!confirm('Hapus semua skor dan jepretan untuk event ini, lalu mulai dari E lagi?')) return;
  S.hasil = HASIL[S.ev] = Array(MISI.length).fill(null);
  try { localStorage.removeItem('edfat_hasil_' + S.ev); } catch (err) { /* tanpa storage */ }
  renderBeranda();
  renderSteps('home');
}
S.hasil = HASIL[S.ev] = muatHasil(S.ev);

/* ---------- gambar ---------- */
const CACHE = {}, URLS = {}; // URLS: foto upload (object URL) per nama
function foto(name) {
  if (!CACHE[name]) {
    const im = new Image();
    im.src = URLS[name] || `img/${name}.jpg`;
    im.onload = () => { if (!$('misi').hidden) render(); };
    CACHE[name] = im;
  }
  return CACHE[name];
}
function rasioNow() {
  const im = foto(imgNow());
  return im.naturalWidth ? im.naturalWidth / im.naturalHeight : 1.5;
}
// Event 'kamu' hanya punya sebagian huruf (sesuai hasil analisis AI).
const bisa = i => !ev().aktif || ev().aktif.includes(MISI[i].k);
function berikut(i) {
  for (let j = i + 1; j < MISI.length; j++) if (bisa(j)) return j;
  return -1;
}
// Foto besar baru diunduh saat huruf itu dibuka (beranda cukup pakai thumbnail).
function preloadHuruf(k) {
  const e = ev(), d = e[k];
  if (k === 'A') Object.values(d.tinggi).forEach(t => foto(t.img));
  else if (k === 'T') for (let n = 1; n <= d.n; n++) foto(d.img(n));
  else foto(d.img);
}
function preload() {
  if (ev().aktif) MISI.forEach(m => preloadHuruf(m.k)); // foto upload sudah ada di perangkat
}
function imgNow() {
  const k = MISI[S.i].k, d = dat();
  if (k === 'A') return d.tinggi[S.tinggi].img;
  if (k === 'T') return d.img(S.frame);
  return d.img;
}

/* ---------- view ---------- */
function show(id) {
  if (id === 'home' && S.ev !== evDasar) { S.ev = evDasar; S.hasil = HASIL[evDasar]; renderEvent(); }
  if (id === 'home') renderBeranda();
  for (const v of ['home', 'misi', 'hasil', 'analisis', 'pelajaran']) $(v).hidden = v !== id;
  // mode fokus: selama pelajaran (termasuk kamera di dalamnya) menu atas disembunyikan
  document.body.classList.toggle('fokus', id === 'pelajaran' || (id === 'misi' && !!S.les));
  if (id === 'misi' && S.les) $('misiLes').innerHTML = `<button class="les-x" data-go="home" aria-label="Tutup pelajaran">✕</button>
    <div class="les-bar">${barHtml(3)}</div><span class="les-huruf">${MISI[S.les.i].k}</span>`;
  $('misiLes').hidden = !(id === 'misi' && S.les);
  window.scrollTo({ top: 0 });
  renderSteps(id);
}
function renderSteps(view) {
  // Event bawaan: huruf membuka pelajaran (sama dengan jalur di beranda).
  // Foto upload tidak punya pelajaran, jadi langsung ke kamera.
  const pintu = ev().aktif ? 'data-go' : 'data-les';
  const kini = view === 'pelajaran' && S.les ? S.les.i : view === 'misi' ? S.i : -1;
  $('steps').innerHTML = MISI.map((m, i) =>
    `<button class="step ${kini === i ? 'on' : ''} ${S.hasil[i] ? 'done' : ''}" ${pintu}="${i}"
      aria-label="${m.nama}${S.hasil[i] ? `, selesai skor ${S.hasil[i].skor}` : ''}"${bisa(i) ? '' : ' disabled'}>${m.k}</button>`
  ).join('') + `<button class="step end ${view === 'hasil' ? 'on' : ''}" data-go="hasil">Hasil</button>`;
}

function mulai(i, les = false) {
  stopPlay();
  if (bisa(i)) preloadHuruf(MISI[i].k);
  if (!les) S.les = null;
  else if (S.les) S.les.layar = 3;
  if (!bisa(i)) { const j = berikut(i); if (j < 0) return tampilHasil(); i = j; }
  S.i = i;
  const m = MISI[i], d = dat();
  const st = d.start || { cx: .5, cy: .5, f: 24 };
  S.cx = st.cx; S.cy = st.cy; setF(st.f); S.rot = 0;
  $('rot').value = 0;
  if (m.k === 'A') {
    const h = Object.keys(TINGGI);
    S.brief = d.tebak || h[Math.floor(Math.random() * h.length)];
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
  $('gantiBrief').hidden = m.k !== 'A' || !!d.tebak;
  $('diagram').hidden = m.k !== 'A';
  $('dragTip').classList.toggle('off', dragged);
  document.querySelector('.ctl.lensa').classList.toggle('ajak', !dizoom && 'EDF'.includes(m.k));
  renderMisiText();
  renderHints();
  show('misi');
  render();
  let sudah = false;
  try { sudah = localStorage.getItem('edfat_panduan') === '1'; } catch (err) { /* tanpa storage */ }
  if (!sudah) bukaPanduan();
}
function bukaPanduan() {
  stopPlay();
  $('panduan').hidden = false;
  setTimeout(() => $('tutupPanduan').focus(), 50);
}
function tutupPanduan() {
  $('panduan').hidden = true;
  try { localStorage.setItem('edfat_panduan', '1'); } catch (err) { /* tanpa storage */ }
  if (MISI[S.i].k === 'T' && !$('misi').hidden) startPlay();
}
function renderMisiText() {
  const m = MISI[S.i];
  const d = dat();
  $('pMisi').textContent = $('pMisiM').textContent = m.k === 'A' && !d.tebak ? d.brief[S.brief] : d.misi;
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
  const r = rasioNow();
  $('stage').style.setProperty('--r', r);
  const lcd = $('lcd'), lh = Math.round(lcd.width / r);
  if (lcd.height !== lh) lcd.height = lh;
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
  $('shutter').classList.toggle('siap', skor >= 85);
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
  if (!$('modal').hidden || $('misi').hidden || !foto(imgNow()).naturalWidth) return;
  S.shotPlaying = S.playing;
  stopPlay();
  bunyi();
  const fl = $('flash');
  fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');

  const c = document.createElement('canvas'), r = rasioNow();
  c.width = r >= 1 ? 960 : 720; c.height = Math.round(c.width / r); // cukup tajam, tetap muat di penyimpanan
  drawCrop(c.getContext('2d'), c.width, c.height);
  const m = MISI[S.i];
  const res = m.nilai(S, dat());
  const skor = res.items.reduce((a, b) => a + b.pts, 0);
  S.hasil[S.i] = { img: c.toDataURL('image/jpeg', .8), skor, k: m.k, nama: m.nama };
  simpanHasil();

  $('mFoto').src = S.hasil[S.i].img;
  $('mHuruf').textContent = `${m.k} · ${m.nama}`;
  $('mJudul').textContent = skor >= 85 ? 'Mantap, lulus!' : skor >= 60 ? 'Lumayan, hampir!' : 'Belum kena';
  $('mSkor').textContent = skor;
  $('mCek').innerHTML = res.items.map(cekLi).join('');
  $('mSaran').textContent = res.saran;
  const nx = berikut(S.i);
  $('lanjut').textContent = S.les ? 'Lanjut' : nx >= 0 ? `Lanjut ke ${MISI[nx].k}` : 'Lihat cerita fotomu';
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
  const n = MISI.filter((m, i) => bisa(i)).length;
  return Math.round(S.hasil.reduce((a, h) => a + (h ? h.skor : 0), 0) / n);
}
function tampilHasil() {
  stopPlay();
  const tot = totalSkor();
  const jml = S.hasil.filter(Boolean).length, n = MISI.filter((m, i) => bisa(i)).length;
  $('hSkor').textContent = tot;
  $('hJudul').textContent = jml < n ? 'Ceritanya belum lengkap'
    : tot >= 85 ? 'Siap liputan!' : tot >= 65 ? 'Sudah bercerita, tinggal dipoles' : 'Ayo latihan lagi';
  $('hLead').textContent = jml < n
    ? `Kamu baru menjepret ${jml} dari ${n} huruf. Lengkapi dulu supaya ceritanya utuh.`
    : n < MISI.length ? `Semua teknik yang bisa dilatih dari fotomu sudah kamu jepret.`
    : 'Lima foto ini kalau disusun jadi satu cerita: suasana, detail, bingkai, sudut, dan momen puncaknya.';
  $('story').innerHTML = MISI.map((m, i) => {
    const h = S.hasil[i];
    return h
      ? `<figure class="shot ${m.k}" style="margin:0"><img src="${h.img}" alt="Foto ${m.nama}"><span class="tag"><b>${m.k}</b>${m.nama}</span><span class="nil">${h.skor}</span></figure>`
      : bisa(i) ? `<button class="shot ${m.k} kosong" data-go="${i}">${m.k} · ${m.nama} belum dijepret</button>`
      : `<div class="shot ${m.k} kosong">${m.k} · ${m.nama} tidak bisa dilatih dari foto ini</div>`;
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
function sudahZoom() {
  if (dizoom) return;
  dizoom = true;
  document.querySelector('.ctl.lensa').classList.remove('ajak');
}
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
    if (pts.size === 2 && pinch0) { sudahZoom(); setF(f0 * jarak() / pinch0); }
    render();
  });
  const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch0 = 0; if (!pts.size) st.classList.remove('drag'); };
  st.addEventListener('pointerup', up);
  st.addEventListener('pointercancel', up);
  st.addEventListener('lostpointercapture', up);
  st.addEventListener('wheel', e => { e.preventDefault(); sudahZoom(); setF(S.f * Math.exp(-e.deltaY * .0015)); render(); }, { passive: false });
  function jarak() { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; }
}

function renderEvent() {
  const daftar = Object.entries(EVENTS).filter(([, e]) => !e.aktif);
  const satu = daftar.length < 2;
  $('evPick').hidden = satu;
  document.querySelector('.ev-lbl').hidden = satu;
  $('evPick').innerHTML = daftar.map(([k, e]) =>
    `<button class="ev ${S.ev === k ? 'on' : ''}" data-ev="${k}" aria-pressed="${S.ev === k}">
      <img src="img/thumb/${e.sampul}.jpg" alt=""><span><b>${e.nama}</b><small>${e.ket}</small></span></button>`
  ).join('');
  $('demoFoto').style.backgroundImage = `url(${srcThumb(ev().sampul)})`;
  $('kredit').textContent = ev().kredit + '.';
  renderBeranda();
}

/* ---------- beranda: jalur belajar + progres ---------- */
function gambarHuruf(k) {
  const d = ev()[k];
  if (k === 'A') return d.tinggi.low.img;
  if (k === 'T') return d.img(d.skor.indexOf(Math.max(...d.skor)) + 1);
  return d.img;
}
const srcGambar = n => URLS[n] || `img/${n}.jpg`;
const srcThumb = n => URLS[n] || `img/thumb/${n}.jpg`;
function altGambar(n) {
  const a = ev().alt || {}, t = /_(\d+)$/.exec(n);
  if (a[n]) return a[n];
  if (/time_/.test(n) && t) return `Foto beruntun ke-${t[1]}: ${a.time || 'satu momen'}`;
  return analisis && /^u_/.test(n) ? (analisis.isi || 'Foto referensimu') : 'Foto latihan';
}
function renderBeranda() {
  const h = S.hasil, selesai = h.filter(Boolean).length;
  const next = MISI.findIndex((m, i) => !h[i]);
  $('jalur').innerHTML = MISI.map((m, i) => {
    const r = h[i];
    const status = r ? `<span class="st ok">Selesai · skor ${r.skor}</span>`
      : i === next ? '<span class="st now">Langkah berikutnya</span>' : '<span class="st">Belum dicoba</span>';
    return `<li class="lk ${r ? 'done' : ''} ${i === next ? 'next' : ''}">
      <span class="lk-huruf">${m.k}</span>
      <article class="lk-kartu">
        ${i === next ? `<span class="mulai-sini" aria-hidden="true">${selesai ? 'Lanjut di sini' : 'Mulai di sini'}</span>` : ''}
        <img src="${srcThumb(gambarHuruf(m.k))}" alt="${esc(altGambar(gambarHuruf(m.k)))}" loading="lazy" width="480" height="320">
        <div class="lk-isi">
          <p class="eyebrow">Langkah ${i + 1} · ${m.nama}</p>
          <h3>${m.judul}</h3>
          <p class="lk-inti">${m.inti}</p>
          <details>
            <summary>Pelajari dulu</summary>
            <p>${m.def}</p>
            <p class="lk-tip"><b>Tips:</b> ${m.tip}</p>
            <p class="lk-ex">${m.ex}</p>
          </details>
          <div class="lk-aksi">
            <button class="btn ${i === next ? 'primary denyut' : 'ghost'} kecil-btn" data-les="${i}">${r ? 'Ulangi' : 'Mulai'} pelajaran ${m.k}</button>
            ${status}
          </div>
        </div>
      </article>
    </li>`;
  }).join('');
  const pct = selesai / MISI.length;
  const rata = selesai ? Math.round(h.reduce((a, r) => a + (r ? r.skor : 0), 0) / selesai) : 0;
  $('progres').innerHTML = `
    <div class="cincin" style="--p:${pct}"><span><b>${selesai}</b>/5</span></div>
    <div class="progres-teks">
      <p class="eyebrow">Progres belajarmu</p>
      <h3>${selesai === 0 ? 'Belum mulai' : selesai < 5 ? `${selesai} teknik selesai` : 'Kelima teknik selesai!'}</h3>
      <p>${selesai ? `Rata-rata skor ${rata}.` : 'Mulai dari E. Butuh sekitar 10 menit untuk kelimanya.'}</p>
    </div>
    ${next >= 0
      ? `<button class="btn primary lebar denyut" data-les="${next}">${selesai ? 'Lanjut' : 'Mulai'}: ${MISI[next].k} · ${MISI[next].nama}</button>`
      : '<button class="btn primary lebar" data-go="hasil">Lihat cerita fotomu</button>'}
    <a class="link" href="#cara">Cara pakai simulator</a>
    ${selesai ? '<button class="link pudar" id="mulaiUlang">Mulai ulang dari awal</button>' : ''}`;
  const cta = next >= 0
    ? `<button class="btn primary lebar denyut" data-les="${next}">${selesai ? 'Lanjut' : 'Mulai'}: ${MISI[next].k} · ${MISI[next].nama}</button>`
    : '<button class="btn primary lebar" data-go="hasil">Lihat cerita fotomu</button>';
  $('ctaHp').innerHTML = `<span class="cta-prog">${selesai}/5</span>${cta}`;
}
function pilihEvent(k) {
  if (k === S.ev) return;
  S.ev = k;
  S.hasil = HASIL[k] = HASIL[k] || muatHasil(k);
  if (!EVENTS[k].aktif) {
    evDasar = k;
    try { localStorage.setItem('edfat_ev', k); } catch (err) { /* tanpa storage */ }
  }
  renderEvent();
  renderSteps('home');
}

function initUI() {
  document.addEventListener('click', e => {
    const p = e.target.closest('[data-ev]');
    if (p) { pilihEvent(p.dataset.ev); return; }
    const g = e.target.closest('[data-go]');
    if (!g) return;
    const v = g.dataset.go;
    $('modal').hidden = true;
    if (v === 'home') { stopPlay(); show('home'); }
    else if (v === 'analisis') show('analisis');
    else if (v === 'hasil') tampilHasil();
    else mulai(+v);
  });

  $('zoom').addEventListener('input', e => { sudahZoom(); setF(vToF(+e.target.value)); render(); });
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
  $('lewati').addEventListener('click', () => S.les ? (stopPlay(), keRangkuman())
    : berikut(S.i) >= 0 ? mulai(berikut(S.i)) : tampilHasil());
  $('ulang').addEventListener('click', () => {
    $('modal').hidden = true;
    if (MISI[S.i].k === 'T') startPlay();
  });
  $('lanjut').addEventListener('click', () => {
    $('modal').hidden = true;
    if (S.les) return keRangkuman();
    berikut(S.i) >= 0 ? mulai(berikut(S.i)) : tampilHasil();
  });
  $('unduh').addEventListener('click', unduh);
  document.addEventListener('click', e => { if (e.target.closest('#mulaiUlang')) mulaiUlang(); });
  $('bukaPanduan').addEventListener('click', bukaPanduan);
  $('tutupPanduan').addEventListener('click', tutupPanduan);

  document.addEventListener('keydown', e => {
    if (!$('panduan').hidden) { if (e.key === 'Escape') tutupPanduan(); return; }
    if (!$('pelajaran').hidden) {
      if (e.key === 'Enter' && !$('lesLanjut').disabled && !e.target.matches('button')) lesLanjut();
      if (e.key === 'Escape') show('home');
      return;
    }
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

/* ---------- foto referensi kamu (analisis AI) ---------- */
// URL web app Apps Script "EDFAT Analisis" (server/Code.gs). Kosong = fitur AI belum aktif.
const AI_URL = 'https://script.google.com/macros/s/AKfycbyZsOcgk_gvLKa_k981ug_FBKirwVd7ktbFEvDAqLULgZNr9KxDILBSU_n89hNtd8b5/exec';
const MAKS_UNGGAH = 10;
let unggahan = [];   // [{nama, url, ai, rasio}]
let analisis = null; // jawaban AI yang sudah dirapikan
let tugas = 0;       // upload terbaru; jawaban dari upload lama diabaikan

async function siapkanFoto(file, sisiAI) {
  const bmp = await createImageBitmap(file);
  const ubah = sisi => {
    const k = Math.min(1, sisi / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    return c;
  };
  const tampil = ubah(1800);
  const blob = await new Promise(r => tampil.toBlob(r, 'image/jpeg', .9));
  return {
    nama: file.name,
    url: URL.createObjectURL(blob),
    ai: ubah(sisiAI).toDataURL('image/jpeg', .8).split(',')[1],
    rasio: bmp.width / bmp.height,
  };
}

async function unggah(files) {
  files = [...files].filter(f => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .slice(0, MAKS_UNGGAH);
  if (!files.length) return;
  const id = ++tugas;
  stopPlay();
  show('analisis');
  tampilAnalisis('muat', files.length);
  const baru = [];
  try {
    for (const f of files) baru.push(await siapkanFoto(f, files.length > 1 ? 768 : 1280));
  } catch (err) {
    if (id === tugas) tampilAnalisis('galat', 'Foto ini tidak bisa dibuka browser. Coba simpan ulang sebagai JPG lalu upload lagi.');
    return;
  }
  if (id !== tugas) return;
  // object URL lama tetap hidup selama latihan sebelumnya masih bisa dibuka; buang yang bukan milik latihan aktif
  unggahan.filter(u => !Object.values(URLS).includes(u.url)).forEach(u => URL.revokeObjectURL(u.url));
  unggahan = baru;
  $('aFoto').src = unggahan[0].url;
  if (!AI_URL) return tampilAnalisis('galat', 'Fitur analisis AI belum diaktifkan di simulator ini.');
  try {
    const res = await fetch(AI_URL, { method: 'POST', body: JSON.stringify({ foto: unggahan.map(u => u.ai) }) });
    const data = await res.json();
    if (id !== tugas) return;
    if (!data.ok) throw new Error(data.pesan || 'AI gagal membaca foto.');
    terimaAnalisis(data.hasil);
  } catch (err) {
    if (id === tugas) tampilAnalisis('galat', err.message === 'Failed to fetch' ? 'Koneksi ke AI terputus. Cek internet lalu coba lagi.' : err.message);
  }
}

// box_2d Gemini = [ymin, xmin, ymax, xmax] skala 0–1000 → [x1, y1, x2, y2] 0–1
function kotak(o) {
  const b = o && o.box_2d;
  if (!Array.isArray(b) || b.length !== 4 || b.some(v => typeof v !== 'number')) return null;
  const [y1, x1, y2, x2] = b.map(v => clamp(v / 1000, 0, 1));
  const k = [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)];
  return k[2] - k[0] > .005 && k[3] - k[1] > .005 ? k : null;
}
const daftarKotak = (arr, maks) => (arr || []).map(o => [o.label || 'Objek', kotak(o)]).filter(x => x[1]).slice(0, maks);

function terimaAnalisis(a) {
  const n = unggahan.length;
  const utama = clamp(Math.round(a.utama || 0), 0, n - 1);
  const subj = kotak(a.subjek) || [.3, .3, .7, .7];
  const subjNama = (a.subjek && a.subjek.label) || 'Subjek';
  const konteks = daftarKotak(a.konteks, 4).filter(([, b]) => area(b) < .6).slice(0, 3); // kotak seluas foto = tidak berguna
  const detail = daftarKotak(a.detail, 5).filter(([, b]) => area(b) > .0003);
  const bingkai = daftarKotak(a.bingkai, 4);
  const latih = a.latihan || {};
  const ok = k => !!(latih[k] && latih[k].bisa);
  const misi = (k, cadangan) => (latih[k] && latih[k].misi) || cadangan;

  // daftarkan foto upload sebagai gambar: u_utama + u_1..u_n (frame burst)
  const daftar = n > 1 ? unggahan.map((u, i) => ['u_' + (i + 1), u.url]) : [];
  daftar.push(['u_utama', unggahan[utama].url]);
  for (const [nama, url] of daftar) { URLS[nama] = url; delete CACHE[nama]; }

  const aktif = ['A'];
  if (ok('E') || konteks.length) aktif.push('E');
  if (detail.length) aktif.push('D');
  if (bingkai.length) aktif.push('F');
  if (n > 1) aktif.push('T');

  const cx = (subj[0] + subj[2]) / 2, cy = (subj[1] + subj[3]) / 2;
  const besar = Math.max(subj[2] - subj[0], subj[3] - subj[1]);
  const fDekat = F_MIN / clamp(besar * 1.25, .3, 1);
  const fRapat = F_MIN / clamp(besar * 1.02, .25, .9); // F mulai rapat di subjek, bingkai di luar frame
  const skor = (a.waktu && a.waktu.skor && a.waktu.skor.length === n)
    ? a.waktu.skor.map(v => clamp(Math.round(v), 0, 100))
    : unggahan.map((u, i) => Math.max(10, 100 - 25 * Math.abs(i - utama)));
  const catatan = (a.waktu && a.waktu.catatan && a.waktu.catatan.length === n)
    ? a.waktu.catatan : unggahan.map((u, i) => i === utama ? 'Ini momen puncaknya.' : 'Belum momen puncaknya.');
  const pad = (b, p) => [clamp(b[0] - p, 0, 1), clamp(b[1] - p, 0, 1), clamp(b[2] + p, 0, 1), clamp(b[3] + p, 0, 1)];

  EVENTS.kamu = {
    nama: 'Foto kamu', judul: 'Foto referensiku', ket: '',
    kredit: 'Foto referensi milik pengguna, dibaca AI (Gemini)',
    sampul: 'u_utama', aktif,
    E: {
      img: 'u_utama', start: { cx, cy, f: Math.max(fDekat, 60) },
      misi: misi('E', 'Mundur (zoom out) sampai subjek dan suasana sekitarnya masuk semua.'),
      wajib: [
        [subjNama, subj, .9, `Jangan potong ${subjNama.toLowerCase()}, dia pusat ceritanya.`],
        ...konteks.map(([l, b]) => [l, b, .8, `${l} menjelaskan suasananya, masukkan juga ke frame.`]),
      ],
      ok: 'Subjek dan suasananya masuk semua. Begitu cara foto Entire bercerita.',
    },
    D: {
      img: 'u_utama', start: { cx: .5, cy: .5, f: 24 },
      misi: misi('D', 'Cari satu detail kecil yang bercerita lalu zoom sampai detail itu memenuhi frame.'),
      target: detail,
    },
    F: {
      img: 'u_utama', start: { cx, cy, f: fRapat }, tipe: 'ai',
      misi: misi('F', 'Lebarkan bingkai sampai elemen di depan kamera ikut membingkai subjek.'),
      subj: [subjNama, subj], bingkai,
    },
    A: {
      tinggi: { low: { img: 'u_utama', subj }, eye: { img: 'u_utama', subj }, high: { img: 'u_utama', subj } },
      tebak: a.sudut in TINGGI ? a.sudut : 'eye', alasan: a.sudut_alasan || '', brief: {},
      misi: 'Foto ini diambil dari posisi kamera mana? Pilih jawabanmu di “Posisi kamera”, bingkai subjeknya, lalu jepret.',
    },
    T: {
      n: Math.max(n, 1), img: i => (n > 1 ? 'u_' + i : 'u_utama'), area: pad(subj, .03),
      misi: misi('T', 'Foto beruntunmu diputar seperti kejadian asli. Tekan jepret tepat di momen puncaknya.'),
      skor, note: catatan,
    },
  };
  analisis = { ...a, utama, subj, subjNama, konteks, detail, bingkai, aktif,
    saran: aktif.includes(a.saran) ? a.saran : (aktif.includes(a.teknik) ? a.teknik : aktif[0]) };
  $('aFoto').src = unggahan[utama].url;
  tampilAnalisis('hasil');
}

function tampilAnalisis(mode, info) {
  const p = $('aPanel');
  $('aKotak').innerHTML = '';
  $('aStrip').innerHTML = '';
  if (mode === 'muat') {
    p.innerHTML = `<div class="a-muat"><span class="putar"></span>
      <p class="eyebrow">Sedang membaca</p><h2>AI lagi melihat fotomu…</h2>
      <p class="def">${info > 1 ? `${info} foto beruntun` : '1 foto'} sedang dicocokkan dengan teori EDFAT. Biasanya 10–60 detik, foto beruntun lebih lama.</p></div>`;
    return;
  }
  if (mode === 'galat') {
    p.innerHTML = `<p class="eyebrow">Belum berhasil</p><h2>Fotonya belum terbaca</h2>
      <p class="def">${esc(info)}</p>
      <div class="a-cta"><label class="btn primary" for="unggah">Pilih foto lain</label>
      <button class="btn ghost" data-go="home">Kembali</button></div>`;
    return;
  }
  const a = analisis, nm = k => MISI.find(m => m.k === k).nama;
  const warna = { subjek: 'var(--teal)', konteks: 'var(--cyan)', detail: 'var(--yellow)', bingkai: '#E58A6B' };
  const kotakHtml = (jenis, label, b) =>
    `<span class="ak ${jenis}" style="--c:${warna[jenis]};left:${b[0] * 100}%;top:${b[1] * 100}%;width:${(b[2] - b[0]) * 100}%;height:${(b[3] - b[1]) * 100}%"><em>${esc(label)}</em></span>`;
  $('aKotak').innerHTML = [
    ...a.konteks.map(([l, b]) => kotakHtml('konteks', l, b)),
    ...a.bingkai.map(([l, b]) => kotakHtml('bingkai', l, b)),
    ...a.detail.map(([l, b]) => kotakHtml('detail', l, b)),
    kotakHtml('subjek', a.subjNama, a.subj),
  ].join('');
  if (unggahan.length > 1) {
    $('aStrip').innerHTML = unggahan.map((u, i) =>
      `<img src="${u.url}" alt="Frame ${i + 1}" class="${i === a.utama ? 'puncak' : ''}" title="Frame ${i + 1}: ${esc((EVENTS.kamu.T.note[i] || ''))}">`).join('');
  }
  const baris = MISI.map(m => {
    const on = a.aktif.includes(m.k), saran = m.k === a.saran;
    const teks = m.k === 'A' ? `Tebak sudut kameranya (${TINGGI[EVENTS.kamu.A.tebak].label.toLowerCase()}?) lalu bingkai subjeknya.`
      : m.k === 'T' && unggahan.length < 2 ? 'Butuh 2–10 foto beruntun (burst). Upload ulang beberapa foto sekaligus.'
      : on ? EVENTS.kamu[m.k].misi : 'Foto ini tidak punya bahan untuk latihan ini.';
    return `<li class="${on ? '' : 'mati'} ${saran ? 'saran' : ''}">
      <span class="huruf kecil">${m.k}</span>
      <div><b>${m.nama}${saran ? ' <i>disarankan</i>' : ''}</b><small>${esc(teks)}</small></div>
      ${on ? `<button class="chip" data-latih="${m.k}">Latih</button>` : ''}</li>`;
  }).join('');
  $('aPanel').innerHTML = `
    <p class="eyebrow">Teknik paling kuat di foto ini</p>
    <div class="p-head"><span class="huruf">${a.teknik}</span>
      <div><h2>${nm(a.teknik)}</h2><p class="def">${esc(a.isi || '')}</p></div></div>
    <p class="a-alasan">${esc(a.alasan || '')}</p>
    ${(a.ciri || []).length ? `<ul class="ciri">${a.ciri.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
    <p class="tip">Sudut kamera: <b>${TINGGI[EVENTS.kamu.A.tebak].label}</b>${a.miring ? ' + miring (dutch angle)' : ''}. ${esc(a.sudut_alasan || '')}</p>
    <div class="a-latih"><p class="eyebrow">Latihan dari fotomu</p><ul>${baris}</ul></div>
    <div class="a-cta">
      <button class="btn primary" data-latih="${a.saran}">Latih ${nm(a.saran)} sekarang</button>
      <label class="btn ghost" for="unggah">Foto lain</label>
    </div>
    <p class="kecil">Kotak berwarna di foto = yang dibaca AI: <span style="color:var(--teal-dk)">subjek</span>, konteks, detail, bingkai. AI bisa salah, anggap ini pendapat kedua.</p>`;
}

function latihFotoKamu(k) {
  S.ev = 'kamu';
  S.hasil = HASIL.kamu = Array(MISI.length).fill(null);
  preload();
  mulai(MISI.findIndex(m => m.k === k));
}

function esc(t) {
  return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function initKamu() {
  $('unggah').addEventListener('change', e => { unggah(e.target.files); e.target.value = ''; });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-latih]');
    if (b) latihFotoKamu(b.dataset.latih);
  });
  // seret foto ke halaman
  document.addEventListener('dragover', e => { if ([...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  document.addEventListener('drop', e => {
    if (!e.dataTransfer.files.length) return;
    e.preventDefault();
    unggah(e.dataTransfer.files);
  });
}

/* ---------- pelajaran per huruf (satu ide per layar) ----------
   Layar: 0 kenali → 1 tebak → 2 kenapa → 3 coba (kamera) → 4 rangkuman. */
const LAYAR = ['Kenali', 'Tebak', 'Kenapa', 'Coba', 'Rangkuman'];
const KENAL = {
  E: 'Ini foto <b>Entire</b>. Sekali lihat, kamu langsung tahu peristiwanya di mana dan seramai apa. Kotak kuning menandai elemen yang bikin foto ini bercerita.',
  D: 'Ini foto <b>Detail</b>. Kamera mendekat ke satu benda kecil sampai benda itu jadi pemeran utama. Benda lain dibuang dari frame.',
  F: 'Ini foto <b>Frame</b>. Ada benda di depan kamera (kotak kuning) yang membingkai subjek, jadi mata langsung tertuju ke dalam.',
  A: 'Tiga foto ini beda <b>posisi kamera</b>. Posisi kamera mengubah kesan subjek: terlihat kuat, akrab, atau kecil di tengah situasinya.',
  T: 'Ini foto beruntun dari <b>satu momen</b>, diambil dalam waktu kurang dari dua detik. Cuma satu frame yang paling dramatis.',
};
const SOAL = {
  E: 'Mana yang termasuk foto Entire?',
  D: 'Mana yang termasuk foto Detail?',
  F: 'Mana yang memakai teknik Frame?',
  A: 'Foto mana yang diambil dari posisi tinggi (high angle)?',
  T: 'Frame mana yang paling pas disebut momen puncak?',
};
const BENAR = {
  E: 'Betul! Foto ini memperlihatkan lokasi dan suasana secara utuh.',
  D: 'Betul! Satu benda kecil memenuhi frame, tanpa gangguan lain.',
  F: 'Betul! Benda di depan kamera membingkai subjek di dalamnya.',
  A: 'Betul! Kamera di atas subjek, jadi pola dan situasinya terbaca.',
  T: 'Betul! Ini titik paling dramatis dari seluruh rangkaian.',
};
const CIRI = {
  E: [['Lensa lebar', '16–35 mm, atau mundur beberapa langkah.'], ['Ada konteks', 'Lokasi, keramaian, papan nama, cuaca.'], ['Foto pembuka', 'Biasanya jadi foto pertama dalam cerita.']],
  D: [['Satu fokus', 'Satu benda saja, yang lain dibuang dari frame.'], ['Dekat', 'Lensa panjang (70–200 mm) atau mendekat.'], ['Ikut bercerita', 'Pilih benda yang menjelaskan peristiwa: alat, tangan, ekspresi.']],
  F: [['Ada elemen depan', 'Pintu, jaring, daun, orang, atau benda blur.'], ['Di pinggir frame', 'Elemen depan menyentuh tepi, bukan menutupi tengah.'], ['Subjek tetap jelas', 'Bingkai boleh blur, subjek harus utuh.']],
  A: [['Rendah = kuat', 'Kamera di bawah mata subjek, dia terlihat gagah.'], ['Sejajar = akrab', 'Setinggi mata subjek, terasa natural.'], ['Tinggi = pola', 'Dari atas, subjek kecil dan situasinya terbaca.']],
  T: [['Antisipasi', 'Baca polanya, tekan sedikit sebelum puncak.'], ['Pakai burst', 'Foto beruntun memberi banyak pilihan frame.'], ['Rana cepat', '1/1000 detik atau lebih cepat untuk membekukan aksi.']],
};
const URUT = { E: [1, 0, 2], D: [0, 2, 1], F: [2, 0, 1], A: [1, 2, 0], T: [2, 1, 0] }; // posisi jawaban diacak tetap

// kotak dilebarkan jadi rasio foto (lebar = tinggi dalam koordinat ternormalisasi)
function potong(b, pad = 1.25) {
  const w = clamp(Math.max(b[2] - b[0], b[3] - b[1]) * pad, .12, 1);
  const x = clamp((b[0] + b[2]) / 2 - w / 2, 0, 1 - w), y = clamp((b[1] + b[3]) / 2 - w / 2, 0, 1 - w);
  return [x, y, x + w, y + w];
}
// kecil = boleh pakai thumbnail (foto utuh tampil kecil); potongan selalu pakai foto besar
function gambarHtml(img, kotak, kelas = '', label = '') {
  const alt = esc(label || (kotak ? `Potongan dekat: ${altGambar(img)}` : altGambar(img)));
  if (!kotak) return `<div class="lf ${kelas}" role="img" aria-label="${alt}" style="background-image:url(${kelas.includes('kecil') ? srcThumb(img) : srcGambar(img)})"></div>`;
  const w = kotak[2] - kotak[0];
  const px = w >= 1 ? 0 : kotak[0] / (1 - w) * 100, py = w >= 1 ? 0 : kotak[1] / (1 - w) * 100;
  return `<div class="lf ${kelas}" role="img" aria-label="${alt}" style="background-image:url(${srcGambar(img)});background-size:${100 / w}% auto;background-position:${px}% ${py}%"></div>`;
}
const tandai = list => list.map(([l, b]) =>
  `<span class="ak${b[0] > .6 ? ' kanan' : ''}" style="--c:var(--yellow);left:${b[0] * 100}%;top:${b[1] * 100}%;width:${(b[2] - b[0]) * 100}%;height:${(b[3] - b[1]) * 100}%"><em>${esc(l)}</em></span>`).join('');

function opsiTebak(k) {
  const e = ev(), T = e.T, puncak = T.skor.indexOf(Math.max(...T.skor)) + 1;
  const dCrop = i => potong((e.D.target[i] || e.D.target[0])[1]);
  const o = {
    E: [
      { img: e.E.img, benar: true },
      { img: e.D.img, kotak: dCrop(0), why: 'Ini foto Detail: terlalu dekat, lokasi dan suasananya nggak kelihatan.' },
      { img: T.img(puncak), kotak: potong(T.area, 1.05), why: 'Ini foto momen (Time). Fokusnya aksi, bukan suasana tempatnya.' },
    ],
    D: [
      { img: e.D.img, kotak: dCrop(1), benar: true },
      { img: e.E.img, why: 'Ini foto Entire: banyak hal di frame, belum ada satu fokus.' },
      { img: e.A.tinggi.eye.img, why: 'Masih banyak orang dan benda di frame. Detail itu satu benda saja.' },
    ],
    F: [
      { img: e.F.img, benar: true },
      { img: e.A.tinggi.eye.img, why: 'Tidak ada benda di depan kamera yang membingkai subjek.' },
      { img: e.D.img, kotak: dCrop(0), why: 'Ini Detail: dekat ke satu benda, tanpa bingkai di depan.' },
    ],
    A: [
      { img: e.A.tinggi.high.img, benar: true },
      { img: e.A.tinggi.low.img, why: 'Ini dari posisi rendah: subjek terlihat besar dan gagah.' },
      { img: e.A.tinggi.eye.img, why: 'Ini sejajar mata: terasa natural, bukan dari atas.' },
    ],
    T: [
      { img: T.img(puncak), benar: true },
      { img: T.img(1), why: `Terlalu cepat. ${T.note[0]}` },
      { img: T.img(puncak > 3 ? puncak - 3 : T.n), why: `Belum pas. ${T.note[(puncak > 3 ? puncak - 3 : T.n) - 1]}` },
    ],
  }[k];
  return URUT[k].map(n => o[n]);
}

function mulaiPelajaran(i) {
  stopPlay();
  preloadHuruf(MISI[i].k);
  $('modal').hidden = true;
  S.les = { i, layar: 0, pilih: -1, benar: false };
  tampilLayar();
}
function tampilLayar() {
  const L = S.les, m = MISI[L.i], k = m.k, e = ev();
  $('lesHuruf').textContent = k;
  $('lesBar').innerHTML = barHtml(L.layar === 4 ? 5 : L.layar);
  $('lesUmpan').className = 'les-umpan';
  $('lesUmpan').innerHTML = '';
  const btn = $('lesLanjut');
  btn.disabled = false;
  btn.textContent = 'Lanjut';
  let html = `<p class="eyebrow">${m.nama} · ${LAYAR[L.layar]}</p>`;

  if (L.layar === 0) {
    let vis;
    if (k === 'A') vis = `<div class="lf-tiga">${['low', 'eye', 'high'].map(h =>
      `<figure>${gambarHtml(e.A.tinggi[h].img, null, 'kecil')}<figcaption>${TINGGI[h].label}</figcaption></figure>`).join('')}</div>`;
    else if (k === 'T') vis = `<div class="lf-strip">${Array.from({ length: e.T.n }, (x, j) => gambarHtml(e.T.img(j + 1), null, 'kecil')).join('')}</div>`;
    else if (k === 'D') vis = `<div class="lf-bingkai">${gambarHtml(e.D.img, potong(e.D.target[0][1]))}</div>
      <p class="les-cap">Hasil zoom ke <b>${esc(e.D.target[0][0].toLowerCase())}</b> dari foto event.</p>`;
    else {
      const list = k === 'E' ? e.E.wajib.map(w => [w[0], w[1]]) : e.F.bingkai;
      vis = `<div class="lf-bingkai">${gambarHtml(e[k].img)}<div class="a-kotak">${tandai(list)}</div></div>`;
    }
    html += `<h2>${m.judul}</h2>${vis}<p class="les-teks">${KENAL[k]}</p>`;
  } else if (L.layar === 1) {
    const opsi = opsiTebak(k);
    L.opsi = opsi;
    html += `<h2>${SOAL[k]}</h2><div class="les-opsi">${opsi.map((o, j) =>
      `<button class="opsi ${L.pilih === j ? (o.benar ? 'benar' : 'salah') : ''}" data-opsi="${j}" ${L.benar ? 'disabled' : ''}
        aria-label="Pilihan ${'ABC'[j]}: ${esc(o.kotak ? `potongan dekat dari ${altGambar(o.img)}` : altGambar(o.img))}">
        ${gambarHtml(o.img, o.kotak, o.kotak ? '' : 'kecil')}<span class="opsi-no" aria-hidden="true">${'ABC'[j]}</span></button>`).join('')}</div>`;
    btn.disabled = !L.benar;
    if (!L.benar) html = html.replace('class="les-opsi"', 'class="les-opsi ajak"');
    btn.textContent = L.benar ? 'Lanjut' : 'Pilih satu foto';
    if (L.pilih >= 0) umpan(L.opsi[L.pilih].benar ? BENAR[k] : `Belum tepat. ${L.opsi[L.pilih].why} Coba lagi.`, L.opsi[L.pilih].benar);
  } else if (L.layar === 2) {
    html += `<h2>Ciri foto ${m.nama}</h2><p class="les-teks">${m.def}</p>
      <ol class="les-ciri">${CIRI[k].map(([j, t], n) => `<li><b>${n + 1}</b><div><strong>${j}</strong><span>${t}</span></div></li>`).join('')}</ol>`;
  } else if (L.layar === 3) {
    html += `<h2>Sekarang giliranmu</h2>
      <div class="les-misi"><p class="eyebrow">Misi</p><p>${esc(k === 'A' && !dat0(k).tebak ? 'Posisi kamera akan dipilihkan acak. Ikuti misinya.' : dat0(k).misi)}</p></div>
      <p class="les-teks">Kamu akan memegang kamera virtual. Seret foto untuk menggeser bingkai, geser <b>Lensa</b> untuk zoom, lalu tekan tombol bulat untuk jepret.</p>`;
    btn.textContent = 'Buka kamera';
  } else {
    const r = S.hasil[L.i], nx = L.i < MISI.length - 1 ? L.i + 1 : -1;
    html += r
      ? `<h2>${r.skor >= 85 ? 'Mantap, kamu lulus!' : r.skor >= 60 ? 'Lumayan, hampir!' : 'Belum kena, tapi sudah belajar.'}</h2>
        <div class="les-hasil"><img src="${r.img}" alt="Jepretanmu"><div class="cincin" style="--p:${r.skor / 100}"><span><b>${r.skor}</b></span></div></div>`
      : `<h2>Kamera dilewati</h2><p class="les-teks">Kamu bisa kembali mencoba kapan saja dari beranda.</p>`;
    html += `<p class="les-teks">${m.pelajaran}</p>
      <button class="link" id="lesUlang">Coba kamera lagi</button>`;
    btn.textContent = nx >= 0 ? `Lanjut ke ${MISI[nx].k} · ${MISI[nx].nama}` : 'Lihat cerita fotomu';
  }
  $('lesIsi').innerHTML = html;
  btn.classList.toggle('denyut', !btn.disabled);
  show('pelajaran');
}
const dat0 = k => ev()[k];
const barHtml = layar => LAYAR.map((n, j) => `<i class="${j < layar ? 'isi' : j === layar ? 'kini' : ''}" title="${n}"></i>`).join('');
function umpan(teks, ok) {
  $('lesUmpan').className = 'les-umpan ' + (ok ? 'ok' : 'salah');
  $('lesUmpan').textContent = teks;
}
function lesLanjut() {
  const L = S.les;
  if (!L) return;
  if (L.layar === 1 && !L.benar) return;
  if (L.layar === 3) return mulai(L.i, true);
  if (L.layar === 4) {
    const nx = L.i < MISI.length - 1 ? L.i + 1 : -1;
    S.les = null;
    return nx >= 0 ? mulaiPelajaran(nx) : tampilHasil();
  }
  L.layar++;
  tampilLayar();
}
function keRangkuman() {
  $('modal').hidden = true;
  S.les.layar = 4;
  tampilLayar();
}
function initPelajaran() {
  $('lesLanjut').addEventListener('click', lesLanjut);
  $('lesIsi').addEventListener('click', e => {
    const o = e.target.closest('[data-opsi]');
    if (o && !S.les.benar) {
      S.les.pilih = +o.dataset.opsi;
      S.les.benar = !!S.les.opsi[S.les.pilih].benar;
      if (S.les.benar) bunyiBenar();
      tampilLayar();
    }
    if (e.target.closest('#lesUlang')) mulai(S.les.i, true);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-les]');
    if (b) mulaiPelajaran(+b.dataset.les);
  });
}
function bunyiBenar() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    [660, 880].forEach((f, n) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = f; g.gain.setValueAtTime(.12, actx.currentTime + n * .09);
      g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + n * .09 + .25);
      o.connect(g).connect(actx.destination); o.start(actx.currentTime + n * .09); o.stop(actx.currentTime + n * .09 + .26);
    });
  } catch (err) { /* tanpa suara */ }
}

initUI();
initKamu();
initPelajaran();
renderEvent();
initStage();
show('home');
