/* Titik masuk. Tiap fitur dimulai terpisah: satu yang gagal tidak mematikan halaman. */
(function (EM) {
  'use strict';

  function safeInit(name, fn) {
    try {
      return fn();
    } catch (err) {
      console.error('[EM] "' + name + '" gagal dimulai:', err);
      return null;
    }
  }

  function start() {
    safeInit('validasi data', EM.data.validate);
    const scenes = safeInit('navigasi bagian', EM.initScenes);
    // Kelas "js" mengaktifkan animasi masuk, jadi hanya dipasang jika navigasi benar-benar jalan.
    if (scenes) document.documentElement.classList.add('js');
    safeInit('layar penuh', EM.initFullscreen);
    safeInit('animasi gelombang', EM.initWave);
    safeInit('spektrum', EM.initSpectrum);
    safeInit('carousel', EM.initCarousel);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})((window.EM = window.EM || {}));
