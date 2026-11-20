/* Navigasi antar bagian: panah atas/bawah, tombol, titik, dan sinkron URL. */
(function (EM) {
  'use strict';

  const TYPING = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';
  const INTERACTIVE = 'button, a[href], summary, [role="button"]';
  const pad2 = function (n) { return String(n).padStart(2, '0'); };

  function initScenes() {
    const scenes = Array.from(document.querySelectorAll('.scene'));
    if (scenes.length === 0) throw new Error('Tidak ada elemen .scene di halaman.');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const counter = document.getElementById('scene-counter');
    const prevBtn = document.getElementById('scene-prev');
    const nextBtn = document.getElementById('scene-next');
    const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
    const total = scenes.length;
    let current = 0;
    let locked = false;
    let unlockTimer = 0;

    /* Titik navigasi dibuat dari daftar scene, jadi tidak perlu dipelihara dua kali. */
    const dots = document.createElement('nav');
    dots.className = 'scene-dots';
    dots.setAttribute('aria-label', 'Pindah bagian');
    scenes.forEach(function (scene, i) {
      const a = document.createElement('a');
      a.href = '#' + scene.id;
      a.setAttribute('aria-label', 'Bagian ' + (i + 1) + ': ' + (scene.dataset.title || scene.id));
      dots.appendChild(a);
    });
    document.body.appendChild(dots);
    const dotLinks = Array.from(dots.children);

    function render() {
      counter.textContent = pad2(current + 1) + ' / ' + pad2(total);
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === total - 1;
      dotLinks.forEach(function (a, i) { a.setAttribute('aria-current', String(i === current)); });
      navLinks.forEach(function (a) {
        a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + scenes[current].id));
      });
    }

    function syncUrl() {
      try {
        history.replaceState(null, '', '#' + scenes[current].id);
      } catch (err) {
        // Sinkron URL hanya pelengkap; sebagian browser menolaknya untuk file://.
        console.info('[EM] URL tidak disinkronkan:', err.name);
      }
    }

    function setCurrent(i) {
      current = i;
      render();
      syncUrl();
    }

    function unlock() { locked = false; window.clearTimeout(unlockTimer); }

    function goTo(index) {
      const target = Math.max(0, Math.min(total - 1, index));
      locked = true;
      setCurrent(target);
      scenes[target].scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(unlock, reduce.matches ? 50 : 900); // cadangan jika 'scrollend' tidak ada
      if ('onscrollend' in window) window.addEventListener('scrollend', unlock, { once: true });
    }

    /* Bagian aktif = yang menyentuh garis tengah layar. Berlaku juga untuk bagian yang lebih tinggi dari layar. */
    const middleObserver = new IntersectionObserver(function (entries) {
      if (locked) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(scenes.indexOf(entry.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    /* Animasi masuk: sekali saja per bagian, supaya konten tidak pernah tersembunyi lagi. */
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    scenes.forEach(function (scene) { middleObserver.observe(scene); revealObserver.observe(scene); });

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    function sceneOverflowsViewport(scene) {
      return scene.getBoundingClientRect().bottom > window.innerHeight + 8;
    }

    document.addEventListener('keydown', function (event) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof Element && target.closest(TYPING)) return;

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          // Bagian yang lebih tinggi dari layar: biarkan scroll bawaan sampai ujungnya.
          if (sceneOverflowsViewport(scenes[current])) return;
          event.preventDefault();
          goTo(current + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          if (scenes[current].getBoundingClientRect().top < -8) return;
          event.preventDefault();
          goTo(current - 1);
          break;
        case ' ':
          if (target instanceof Element && target.closest(INTERACTIVE)) return;
          event.preventDefault();
          goTo(event.shiftKey ? current - 1 : current + 1);
          break;
        case 'Home':
          event.preventDefault(); goTo(0); break;
        case 'End':
          event.preventDefault(); goTo(total - 1); break;
        default:
          break;
      }
    });

    const hash = window.location.hash.slice(1);
    const startIndex = scenes.findIndex(function (s) { return s.id === hash; });
    setCurrent(startIndex >= 0 ? startIndex : 0);
    return { goTo: goTo, count: total };
  }

  EM.initScenes = initScenes;
})((window.EM = window.EM || {}));
