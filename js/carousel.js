/* Carousel geser: tombol, progress bar, dan panah kiri/kanan saat track difokuskan. */
(function (EM) {
  'use strict';

  function buildCard(person) {
    const card = document.createElement('article');
    card.className = 'person';
    const img = document.createElement('img');
    img.src = person.image; img.alt = person.alt; img.loading = 'lazy'; img.decoding = 'async';
    img.width = 500; img.height = 600;
    const body = document.createElement('div');
    const year = document.createElement('p'); year.className = 'person__year'; year.textContent = String(person.year);
    const name = document.createElement('h3'); name.textContent = person.name;
    const text = document.createElement('p'); text.textContent = person.finding;
    const tag = document.createElement('p'); tag.className = 'person__tag'; tag.textContent = person.link;
    body.append(year, name, text, tag);
    card.append(img, body);
    return card;
  }

  function initCarousel() {
    const root = document.querySelector('[data-carousel]');
    if (!root) throw new Error('Carousel tidak ditemukan.');
    const track = root.querySelector('[data-carousel-track]');
    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');
    const fill = root.querySelector('[data-carousel-progress]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    EM.data.SCIENTISTS.forEach(function (p) { track.appendChild(buildCard(p)); });

    function step() {
      const first = track.firstElementChild;
      if (!first) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function update() {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = max > 0 ? track.scrollLeft / max : 1;
      const visibleShare = track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1;
      fill.style.transform = 'scaleX(' + (visibleShare + (1 - visibleShare) * ratio).toFixed(3) + ')';
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= max - 1;
    }

    function scrollByStep(direction) {
      track.scrollBy({ left: direction * step(), behavior: reduce.matches ? 'auto' : 'smooth' });
    }

    let ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    prev.addEventListener('click', function () { scrollByStep(-1); });
    next.addEventListener('click', function () { scrollByStep(1); });
    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); scrollByStep(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); scrollByStep(-1); }
    });
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
    update();
  }

  EM.initCarousel = initCarousel;
})((window.EM = window.EM || {}));
