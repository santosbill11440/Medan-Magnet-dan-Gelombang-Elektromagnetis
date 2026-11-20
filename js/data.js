/* Model data: satu sumber kebenaran untuk spektrum dan tokoh.
   Panjang gelombang disimpan dalam meter (SI). Batas bawah termasuk, batas atas tidak. */
(function (EM) {
  'use strict';

  const SPECTRUM = Object.freeze([
    { id: 'radio', name: 'Gelombang radio', minM: 1, maxM: Infinity, rangeLabel: 'lebih dari 1 m',
      examples: 'Siaran radio, TV, dan komunikasi.', ionizing: false },
    { id: 'microwave', name: 'Gelombang mikro', minM: 1e-3, maxM: 1, rangeLabel: '1 mm sampai 1 m',
      examples: 'Wi-Fi, oven microwave, dan radar.', ionizing: false },
    { id: 'infrared', name: 'Inframerah', minM: 7e-7, maxM: 1e-3, rangeLabel: '700 nm sampai 1 mm',
      examples: 'Remote TV dan kamera termal.', ionizing: false },
    { id: 'visible', name: 'Cahaya tampak', minM: 4e-7, maxM: 7e-7, rangeLabel: '400 sampai 700 nm',
      examples: 'Satu-satunya bagian yang bisa dilihat mata manusia.',
      note: 'Cahaya tampak hanya irisan sangat sempit dari seluruh spektrum. Ada banyak "cahaya" di sekitar kita yang tidak terlihat.', ionizing: false },
    { id: 'ultraviolet', name: 'Ultraviolet', minM: 1e-8, maxM: 4e-7, rangeLabel: '10 sampai 400 nm',
      examples: 'Sterilisasi, dan penyebab kulit terbakar.', ionizing: true,
      note: 'UV kuat termasuk radiasi pengion.' },
    { id: 'xray', name: 'Sinar-X', minM: 1e-11, maxM: 1e-8, rangeLabel: '0,01 sampai 10 nm',
      examples: 'Rontgen dan pemeriksaan keamanan bandara.', ionizing: true,
      note: 'Radiasi pengion: energinya cukup untuk merusak molekul.' },
    { id: 'gamma', name: 'Sinar gamma', minM: 0, maxM: 1e-11, rangeLabel: 'kurang dari 0,01 nm',
      examples: 'Terapi kanker dan kedokteran nuklir.', ionizing: true,
      note: 'Radiasi pengion: energinya cukup untuk merusak molekul.' }
  ]);

  const SCIENTISTS = Object.freeze([
    { id: 'orsted', name: 'Hans Christian Ørsted', year: 1820, image: 'assets/img/tokoh-orsted.jpg',
      alt: 'Potret Hans Christian Ørsted',
      finding: 'Menemukan bahwa arus listrik menghasilkan medan magnet. Arahnya ditentukan dengan aturan tangan kanan.',
      link: 'Arus → magnet' },
    { id: 'faraday', name: 'Michael Faraday', year: 1831, image: 'assets/img/tokoh-faraday.jpg',
      alt: 'Potret Michael Faraday',
      finding: 'Menunjukkan bahwa perubahan fluks magnet menimbulkan GGL. Hukum Lenz menambahkan bahwa arus induksi melawan penyebabnya.',
      link: 'Magnet berubah → listrik' },
    { id: 'maxwell', name: 'James Clerk Maxwell', year: 1865, image: 'assets/img/tokoh-maxwell.jpg',
      alt: 'Potret James Clerk Maxwell',
      finding: 'Menyatukan listrik dan magnet dalam empat persamaan, lalu menunjukkan bahwa keduanya merambat sebagai gelombang berkecepatan c.',
      link: 'Semuanya menyatu' },
    { id: 'hertz', name: 'Heinrich Hertz', year: 1887, image: 'assets/img/tokoh-hertz.jpg',
      alt: 'Potret Heinrich Hertz',
      finding: 'Membuktikan lewat percobaan bahwa gelombang elektromagnetik benar-benar ada.',
      link: 'Bukti gelombang EM' }
  ]);

  /* Dipanggil saat start: data yang salah harus gagal keras, bukan menghasilkan tampilan keliru. */
  function validate() {
    SPECTRUM.forEach(function (band, i) {
      if (!(band.minM < band.maxM)) {
        throw new Error('Spektrum "' + band.id + '": batas bawah harus lebih kecil dari batas atas.');
      }
      const next = SPECTRUM[i + 1];
      if (next && next.maxM !== band.minM) {
        throw new Error('Spektrum "' + band.id + '" dan "' + next.id + '" tidak bersambung.');
      }
    });
    if (SPECTRUM[SPECTRUM.length - 1].minM !== 0) {
      throw new Error('Pita terakhir harus berakhir di 0 m.');
    }
    const ids = new Set(SCIENTISTS.map(function (s) { return s.id; }));
    if (ids.size !== SCIENTISTS.length) throw new Error('ID tokoh harus unik.');
  }

  function bandForWavelength(meters) {
    if (!(meters > 0) || !Number.isFinite(meters)) {
      throw new RangeError('Panjang gelombang harus bilangan positif.');
    }
    const found = SPECTRUM.find(function (b) { return meters >= b.minM && meters < b.maxM; });
    if (!found) throw new Error('Tidak ada pita untuk ' + meters + ' m.'); // tak terjangkau jika data valid
    return found;
  }

  EM.data = Object.freeze({ SPECTRUM: SPECTRUM, SCIENTISTS: SCIENTISTS, validate: validate, bandForWavelength: bandForWavelength });
})((window.EM = window.EM || {}));
