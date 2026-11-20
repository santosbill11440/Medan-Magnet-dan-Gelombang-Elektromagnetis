/* Spektrum interaktif + kalkulator c = λf. Teks dari data dipasang lewat textContent (bukan innerHTML). */
(function (EM) {
  'use strict';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function initSpectrum() {
    const bar = document.getElementById('spectrum-bar');
    const form = document.getElementById('freq-form');
    if (!bar || !form) throw new Error('Elemen spektrum tidak ditemukan.');

    const ui = {
      title: document.getElementById('h-detail'), range: document.getElementById('detail-range'),
      examples: document.getElementById('detail-examples'), note: document.getElementById('detail-note'),
      input: document.getElementById('freq-input'), unit: document.getElementById('freq-unit'),
      error: document.getElementById('calc-error'), lambda: document.getElementById('res-lambda'),
      energy: document.getElementById('res-energy'), band: document.getElementById('res-band')
    };
    const { SPECTRUM, bandForWavelength } = EM.data;
    const { InputError, parseFrequency, wavelengthFromFrequency, photonEnergyEV, formatWavelength, formatEnergy } = EM.physics;
    const buttons = new Map();

    SPECTRUM.forEach(function (band) {
      const b = el('button', 'band');
      b.type = 'button';
      b.dataset.band = band.id;
      b.setAttribute('aria-pressed', 'false');
      b.append(el('span', 'band__swatch'), el('span', 'band__name', band.name), el('span', 'band__range', band.rangeLabel));
      b.addEventListener('click', function () { select(band.id); });
      bar.appendChild(b);
      buttons.set(band.id, b);
    });

    function select(id) {
      const band = SPECTRUM.find(function (x) { return x.id === id; });
      if (!band) throw new Error('Pita tidak dikenal: ' + id);
      buttons.forEach(function (b, key) { b.setAttribute('aria-pressed', String(key === id)); });
      ui.title.textContent = band.name;
      ui.range.textContent = 'Panjang gelombang: ' + band.rangeLabel;
      ui.examples.textContent = band.examples;
      ui.note.hidden = !band.note;
      ui.note.textContent = band.note || '';
    }

    function showError(message) {
      ui.error.textContent = message;
      ui.input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function calculate() {
      const hz = parseFrequency(ui.input.value, ui.unit.value); // dapat melempar InputError
      const meters = wavelengthFromFrequency(hz);
      const band = bandForWavelength(meters);
      ui.lambda.textContent = formatWavelength(meters);
      ui.energy.textContent = formatEnergy(photonEnergyEV(hz));
      ui.band.textContent = band.name;
      select(band.id);
    }

    function run() {
      try {
        calculate();
        showError('');
      } catch (err) {
        if (!(err instanceof InputError)) throw err; // bug sungguhan jangan disamarkan sebagai salah ketik
        showError(err.message);
        ui.lambda.textContent = ui.energy.textContent = ui.band.textContent = '–';
      }
    }

    form.addEventListener('submit', function (event) { event.preventDefault(); run(); });
    ui.unit.addEventListener('change', run);
    form.querySelectorAll('[data-freq]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        ui.input.value = chip.dataset.freq;
        ui.unit.value = chip.dataset.unit;
        run();
      });
    });

    run(); // nilai awal 2,4 GHz
  }

  EM.initSpectrum = initSpectrum;
})((window.EM = window.EM || {}));
