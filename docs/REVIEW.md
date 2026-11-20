# Hasil review kode

Dicek terhadap keamanan, performa, ketepatan, dan penanganan error.

## Keamanan
- Semua teks dari data dipasang lewat `textContent`/`createElement`, tidak ada `innerHTML`.
- CSP lewat `<meta>`: skrip dan gaya hanya dari asal sendiri, tanpa `unsafe-inline`. Karena itu tidak ada atribut `style=` di HTML; gaya dinamis lewat CSSOM.
- Tidak ada request jaringan dari skrip.

## Ketepatan
- `data.validate()` memastikan rentang spektrum bersambung dan berurutan, dan dijalankan saat start.
- Kalkulator diuji: 100 MHz → 3 m (radio), 2,4 GHz → 12,5 cm (gelombang mikro), 540 THz → 555 nm (cahaya tampak), 3×10¹⁸ Hz → 99,9 pm (sinar-X).
- Input kosong, bukan angka, atau ≤ 0 menghasilkan pesan yang menjelaskan cara memperbaikinya.

## Penanganan error
- `InputError` dipisahkan dari bug: hanya kesalahan input yang ditampilkan ke pengguna, error lain dilempar ulang.
- Tiap fitur dimulai lewat `safeInit`, jadi satu fitur yang gagal tidak mematikan halaman.
- Layar penuh ditolak browser → pesan singkat, bukan error diam-diam.
- Sinkron URL gagal di sebagian browser untuk `file://` → dicatat di console sebagai info, karena hanya pelengkap.

## Performa
- Animasi canvas berhenti saat tidak terlihat, tab tersembunyi, atau dijeda.
- Foto dikecilkan (total sekitar 1 MB), `loading="lazy"` untuk yang di bawah layar.

## Yang belum bisa diverifikasi di sini
- Tampilan font Playfair Display dan Inter (sandbox tanpa internet, jadi diuji dengan font cadangan).
- Layar penuh di Safari/iOS.
- Lisensi foto (lihat `CREDITS.md`).
