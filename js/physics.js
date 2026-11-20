/* Konstanta, parsing input, dan format angka (locale Indonesia). */
(function (EM) {
  'use strict';

  const C = 299792458;            // m/s
  const PLANCK = 6.62607015e-34;  // J·s
  const JOULE_PER_EV = 1.602176634e-19;
  const UNIT_FACTORS = Object.freeze({ Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9, THz: 1e12 });
  const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;
  const SUPERSCRIPT = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '' };

  /* Kesalahan input pengguna: satu-satunya jenis yang boleh ditampilkan apa adanya di UI. */
  class InputError extends Error {
    constructor(message) { super(message); this.name = 'InputError'; }
  }

  function parseFrequency(raw, unit) {
    const factor = UNIT_FACTORS[unit];
    if (factor === undefined) throw new InputError('Satuan frekuensi tidak dikenal.');
    const text = String(raw).trim().replace(',', '.');
    if (text === '') throw new InputError('Isi frekuensinya dulu, misalnya 2,4.');
    if (!NUMBER_PATTERN.test(text)) throw new InputError('Frekuensi harus berupa angka, misalnya 2,4 atau 5e14.');
    const value = Number(text) * factor;
    if (!Number.isFinite(value) || value <= 0) throw new InputError('Frekuensi harus lebih besar dari 0 dan tidak terlalu besar.');
    return value;
  }

  const wavelengthFromFrequency = function (hz) { return C / hz; };
  const photonEnergyEV = function (hz) { return (PLANCK * hz) / JOULE_PER_EV; };

  const plain = new Intl.NumberFormat('id-ID', { maximumSignificantDigits: 3 });
  const mantissa = new Intl.NumberFormat('id-ID', { maximumSignificantDigits: 3 });

  function scientific(value) {
    const parts = value.toExponential(2).split('e');
    const exp = String(Number(parts[1]));
    const sup = exp.split('').map(function (ch) { return SUPERSCRIPT[ch] === undefined ? ch : SUPERSCRIPT[ch]; }).join('');
    return mantissa.format(Number(parts[0])) + ' × 10' + sup;
  }

  const LENGTH_UNITS = Object.freeze([
    { size: 1e3, label: 'km' }, { size: 1, label: 'm' }, { size: 1e-2, label: 'cm' }, { size: 1e-3, label: 'mm' },
    { size: 1e-6, label: 'µm' }, { size: 1e-9, label: 'nm' }, { size: 1e-12, label: 'pm' }, { size: 1e-15, label: 'fm' }
  ]);

  function formatWavelength(meters) {
    const unit = LENGTH_UNITS.find(function (u) { return meters >= u.size; }) || LENGTH_UNITS[LENGTH_UNITS.length - 1];
    return plain.format(meters / unit.size) + ' ' + unit.label;
  }

  function formatEnergy(ev) {
    if (ev >= 1e6 || ev < 0.01) return scientific(ev) + ' eV';
    return plain.format(ev) + ' eV';
  }

  EM.physics = Object.freeze({
    C: C, InputError: InputError, parseFrequency: parseFrequency,
    wavelengthFromFrequency: wavelengthFromFrequency, photonEnergyEV: photonEnergyEV,
    formatWavelength: formatWavelength, formatEnergy: formatEnergy
  });
})((window.EM = window.EM || {}));
