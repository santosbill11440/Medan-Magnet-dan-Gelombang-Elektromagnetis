# Elektromagnetisme: dari arus listrik sampai cahaya

Situs satu halaman untuk tugas kelompok Fisika Dasar (Sains Data). Kelompok: **Medan Magnet dan Gelombang Elektromagnetik**, anggota Putra Izhar Gumilar (2674110039) dan Athifah Syahzinan (2074110056). Tanpa framework dan tanpa langkah build: HTML, CSS, dan JavaScript biasa.

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Font (Playfair Display dan Inter) dimuat dari Google Fonts, jadi perlu internet. Tanpa internet, tampilan memakai Georgia dan font sistem.

## Kontrol

| Tombol | Fungsi |
| --- | --- |
| `↓` / `PageDown` / `Spasi` | Bagian berikutnya |
| `↑` / `PageUp` / `Shift+Spasi` | Bagian sebelumnya |
| `Home` / `End` | Bagian pertama / terakhir |
| `F` atau tombol "Layar penuh" | Masuk atau keluar layar penuh (`Esc` untuk keluar) |
| `←` / `→` pada carousel | Geser penemuan |

Kalau satu bagian lebih tinggi dari layar (misalnya di laptop yang pendek), `↓` men-scroll dulu sampai ujung bagian itu, baru pindah. Tombol layar penuh disembunyikan otomatis di browser yang tidak mendukungnya (misalnya iPhone).

## Deploy ke GitHub Pages

```bash
git init
git add .
git commit -m "Situs elektromagnetisme"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

Lalu di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Workflow di `.github/workflows/pages.yml` akan men-deploy setiap push ke `main`. Kalau GitHub memberi peringatan versi action usang, naikkan nomor versi di file itu.

## Struktur

```
index.html          Semua konten (9 bagian)
css/tokens.css      Design tokens: warna, tipografi, jarak, gerak
css/base.css        Reset dan gaya dasar
css/layout.css      Tata letak dan komponen
js/data.js          Data spektrum dan tokoh, plus validasinya
js/physics.js       Konstanta, parsing input, format angka
js/scenes.js        Navigasi bagian dan keyboard
js/fullscreen.js    Layar penuh
js/wave.js          Animasi gelombang EM (canvas)
js/spectrum.js      Spektrum interaktif dan kalkulator
js/carousel.js      Carousel penemuan
js/main.js          Titik masuk
assets/img/         Foto (sudah diubah jadi duotone navy-krem)
docs/               Catatan desain dan hasil review kode
```

## Mengubah isi

- **Teks bagian**: edit `index.html`.
- **Spektrum atau tokoh**: edit `js/data.js`. `validate()` akan melempar error di console kalau rentang panjang gelombang tidak bersambung.
- **Warna dan font**: edit `css/tokens.css`.

## Catatan

- Foto berasal dari Wikimedia Commons dan sumber lain; lihat `CREDITS.md`. Lisensi tiap foto perlu dicek sebelum situs dipublikasikan.
- Situs memakai Content-Security-Policy lewat tag `<meta>`. Kalau menambah skrip atau gaya dari domain lain, perbarui CSP di `index.html`.
