/* Layar penuh: tombol di header dan tombol F. Disembunyikan jika browser tidak mendukung (mis. iPhone). */
(function (EM) {
  'use strict';

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.hidden = true; }, 4000);
  }

  function initFullscreen() {
    const root = document.documentElement;
    const button = document.getElementById('fs-toggle');
    const label = document.getElementById('fs-label');
    if (!button || !label) throw new Error('Tombol layar penuh tidak ditemukan.');

    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    const enabled = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    if (!request || !exit || !enabled) return false; // tombol tetap tersembunyi

    const isActive = function () { return Boolean(document.fullscreenElement || document.webkitFullscreenElement); };

    function render() {
      const active = isActive();
      button.setAttribute('aria-pressed', String(active));
      label.textContent = active ? 'Keluar layar penuh' : 'Layar penuh';
      root.classList.toggle('is-fullscreen', active);
    }

    async function toggle() {
      try {
        if (isActive()) await exit.call(document);
        else await request.call(root);
      } catch (err) {
        console.warn('[EM] layar penuh ditolak:', err);
        showToast('Browser menolak layar penuh. Coba tekan F11 sebagai gantinya.');
      }
    }

    button.hidden = false;
    button.addEventListener('click', toggle);
    document.addEventListener('fullscreenchange', render);
    document.addEventListener('webkitfullscreenchange', render);
    document.addEventListener('keydown', function (event) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key !== 'f' && event.key !== 'F') return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      toggle();
    });
    render();
    return true;
  }

  EM.initFullscreen = initFullscreen;
})((window.EM = window.EM || {}));
