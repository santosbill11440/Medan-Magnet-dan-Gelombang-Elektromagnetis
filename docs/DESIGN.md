# Catatan desain

## Hierarki halaman

Urutan section mengikuti wireframe landing page yang dijadikan referensi, dengan isi diganti agar sesuai materi.

| Wireframe | Di situs ini | Tujuan |
| --- | --- | --- |
| Nav bar | Header: logo, 6 tautan, tombol Layar penuh | Loncat ke bagian mana pun |
| Hero (badge, judul, 2 tombol, gambar) | `#beranda`: label mata kuliah, judul, "Mulai dari awal" dan "Hitung panjang gelombang", foto aurora | Menyampaikan alur dalam satu kalimat |
| Partners | Strip empat ilmuwan beserta tahunnya | Menunjukkan dari mana alur ini berasal |
| Features (4 kartu) | `#topik`: kemagnetan, arus, Lorentz, induksi | Empat ide dasar, satu rumus kunci tiap kartu |
| Why us (4 kartu) | `#maxwell`: empat persamaan + arus pergeseran | Kenapa semuanya menyatu |
| (tambahan) | `#gelombang`, `#spektrum` | Visual dan alat hitung |
| Why us (kartu ikon) | `#sains-data`: 6 kartu | Kenapa ini penting untuk jurusan |
| Review (carousel) | `#jejak`: carousel penemuan | Bukti sosial diganti jejak penemuan |
| FAQ | `#faq`: 6 pertanyaan, akordeon | Mengurangi bingung |
| CTA | `#penutup`: kesimpulan 7 langkah | Dorongan terakhir |
| Footer | Footer di bagian terakhir | Tautan dan kredit |

Tidak ada kutipan "ulasan pengguna" karena memang tidak ada pengguna yang bisa dikutip.

## Sistem desain

- **Warna**: navy dan krem dari PPT, ditambah biru baja untuk aksen. Warna pelangi hanya dipakai pada data spektrum, tidak pada tombol.
- **Tipografi**: Playfair Display untuk judul (serif kontras tinggi, mengikuti nuansa template astronomi), Inter untuk teks, font matematika terpisah untuk rumus.
- **Gerak**: animasi masuk sekali per bagian, animasi gelombang bisa dijeda, dan semua gerak mati bila `prefers-reduced-motion` aktif.
- **Aturan anti-slop yang dipakai**: tanpa glassmorphism, tanpa gradien pada tombol, tanpa pil di sekeliling teks statis, ikon hanya yang punya fungsi.
- **Teks**: tombol diawali kata kerja ("Mulai dari awal", "Hitung"), pesan error menyebut masalah dan cara memperbaikinya.

## Referensi

- Wireframe landing page: urutan dan peran tiap section.
- Template presentasi astronomi: latar gelap, judul serif besar.
- Video situs "Kamui": satu layar per bagian, nav di atas, carousel dengan progress bar.
