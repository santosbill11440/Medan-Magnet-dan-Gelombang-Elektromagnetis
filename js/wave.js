/* Animasi gelombang EM di canvas: E vertikal, B pada bidang miring (proyeksi oblik). */
(function (EM) {
  'use strict';

  function initWave() {
    const canvas = document.getElementById('wave-canvas');
    const toggle = document.getElementById('wave-toggle');
    if (!canvas || !toggle) throw new Error('Elemen animasi gelombang tidak ditemukan.');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D tidak tersedia di browser ini.');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const css = getComputedStyle(document.documentElement);
    const colorE = css.getPropertyValue('--c-text').trim() || '#efeadb';
    const colorB = css.getPropertyValue('--c-accent').trim() || '#8fa3cc';
    const font = css.getPropertyValue('--f-body').trim() || 'sans-serif';

    let width = 0, height = 0, phase = 0, frame = 0, last = 0;
    let visible = false;
    let paused = reduce.matches;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const padX = 36, x0 = padX, x1 = width - padX;
      const cy = height * 0.5;
      const amp = Math.min(height * 0.3, 110);
      const k = (2 * Math.PI) / (Math.max(width, 320) * 0.4);
      const skewX = -0.55, skewY = -0.42;

      // sumbu rambat
      ctx.strokeStyle = colorE; ctx.fillStyle = colorE; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.moveTo(x0 - 12, cy); ctx.lineTo(x1 + 10, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1 + 14, cy); ctx.lineTo(x1 + 4, cy - 5); ctx.lineTo(x1 + 4, cy + 5); ctx.closePath(); ctx.fill();

      // B: digambar lebih dulu supaya E berada di depan
      drawWave(colorB, function (x, s) { return [x + skewX * amp * 0.95 * s, cy + skewY * amp * 0.95 * s]; });
      drawWave(colorE, function (x, s) { return [x, cy - amp * s]; });

      ctx.globalAlpha = 1;
      ctx.font = '600 15px ' + font;
      ctx.fillStyle = colorE; ctx.fillText('E', x0 + 4, cy - amp - 14);
      ctx.fillStyle = colorB; ctx.fillText('B', x0 - 10, cy + amp * 0.5);
      ctx.fillStyle = colorE; ctx.font = '13px ' + font; ctx.textAlign = 'right';
      ctx.fillText('arah rambat (c) →', x1, height - 10); ctx.textAlign = 'left';

      function drawWave(color, project) {
        ctx.strokeStyle = color; ctx.globalAlpha = 0.4; ctx.lineWidth = 1;
        for (let x = x0; x <= x1; x += 14) {
          const p = project(x, Math.sin(k * (x - x0) - phase));
          ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(p[0], p[1]); ctx.stroke();
        }
        ctx.globalAlpha = 1; ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = x0; x <= x1; x += 2) {
          const p = project(x, Math.sin(k * (x - x0) - phase));
          if (x === x0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
        }
        ctx.stroke();
      }
    }

    function tick(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      phase += dt * 2.2;
      draw();
      frame = window.requestAnimationFrame(tick);
    }

    function sync() {
      const shouldRun = visible && !paused && !document.hidden;
      if (shouldRun && !frame) { last = 0; frame = window.requestAnimationFrame(tick); }
      if (!shouldRun && frame) { window.cancelAnimationFrame(frame); frame = 0; }
    }

    function renderToggle() {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Putar animasi' : 'Jeda animasi';
    }

    toggle.addEventListener('click', function () { paused = !paused; renderToggle(); sync(); });
    reduce.addEventListener('change', function (e) { paused = e.matches; renderToggle(); sync(); });
    document.addEventListener('visibilitychange', sync);
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }, { threshold: 0.1 }).observe(canvas);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);

    renderToggle();
    resize();
  }

  EM.initWave = initWave;
})((window.EM = window.EM || {}));
