# 🏪 Warung Catat

Aplikasi web pencatatan pesanan harian & utang makanan di warung nasi. Dibuat untuk pemilik warung yang biasa mencatat utang pelanggan langganan secara manual di buku, dan ingin rekap otomatis + bisa langsung kirim tagihan lewat WhatsApp.

🔗 **Live:** [warung-catat.vercel.app](https://warung-catat.vercel.app)

---

## ✨ Fitur

### Untuk Pemilik Warung
- Daftar & buat warung sendiri (nama warung bisa diubah kapan saja).
- Catat pesanan pelanggan: item, jumlah, harga, status **Lunas** / **Belum Lunas**.
- Rekap harian: jumlah pesanan & total utang hari ini.
- Daftar utang berjalan per pelanggan (agregat, bukan per transaksi).
- Edit & hapus catatan transaksi.
- Tandai lunas satu transaksi, atau tandai lunas semua transaksi milik satu pelanggan sekaligus.
- **Multi-pemilik**: satu warung bisa dikelola lebih dari satu pemilik (tambah pemilik lain lewat email).
- **QR Warung**: buat QR unik untuk warung, dipakai pelanggan (pengutang) untuk mendaftar/bergabung. QR bisa di-regenerate kapan saja (QR lama otomatis nonaktif).
- Kirim rincian utang / rekap semua utang ke WhatsApp pelanggan, lengkap dengan lampiran PDF.

### Untuk Pengutang (Pelanggan)
- Mendaftar **wajib lewat scan QR** dari pemilik warung — tidak bisa daftar sembarangan tanpa undangan.
- Lihat riwayat pesanan & total utang yang belum lunas.
- **Multi-warung**: satu akun bisa punya utang di lebih dari satu warung berbeda. Kalau sudah login dan scan QR warung lain, otomatis bergabung tanpa perlu bikin akun baru — tinggal pilih warung aktif lewat dropdown di dashboard.
- Data antar warung terpisah — tidak tercampur satu sama lain, dan tidak bisa melihat data pengutang lain.

### Umum
- Tanggal transaksi ditampilkan lengkap dengan **nama hari** (mis. *Jumat, 04-09-2026*), baik di dashboard, PDF, maupun pesan WhatsApp.
- Export PDF rincian satu transaksi maupun rekap semua transaksi belum lunas milik satu pelanggan.
- Tampilan mobile-first, satu file HTML (tanpa build step).

---

## 🧱 Teknologi

| Bagian | Teknologi |
|---|---|
| Autentikasi & Database | [Firebase](https://firebase.google.com/) (Authentication + Firestore) |
| Generate PDF | [jsPDF](https://github.com/parallax/jsPDF) |
| Generate QR Code | [qrcodejs](https://github.com/davidshimjs/qrcodejs) |
| Kirim tagihan | WhatsApp Click-to-Chat (`wa.me`) |
| Hosting | [Vercel](https://vercel.com/) |
| Frontend | HTML + CSS + Vanilla JS (1 file, tanpa framework/build tool) |

---

## 🗂️ Struktur Data (Firestore)

| Collection | Keterangan |
|---|---|
| `pengguna` | Profil akun (nama, email, no. WhatsApp, role: `pemberi`/`pengutang`) |
| `warung` | Data warung (nama warung, pembuat) |
| `anggotaWarung` | Relasi antara `pengguna` ↔ `warung` (role & status keanggotaan per warung, ID dok: `{warungId}_{uid}`) |
| `qrWarung` | Token QR aktif/nonaktif per warung, dipakai untuk verifikasi pendaftaran pengutang |
| `transaksi` | Catatan pesanan/utang: pengutang, item, jumlah, harga, status, tanggal, jam, siapa yang mencatat |

Satu warung bisa punya banyak pemilik, dan satu pengutang bisa terhubung ke banyak warung — semua diatur lewat collection `anggotaWarung`.

---

## 🔒 Keamanan

Semua akses data diatur lewat **Firestore Security Rules** (file `firestore.rules` di repo ini), dengan aturan utama:
- Pengutang **wajib** melalui QR aktif milik pemilik warung untuk bisa terhubung ke warung tersebut — tidak bisa didaftarkan sembarangan.
- Pengutang hanya bisa membaca transaksi miliknya sendiri.
- Hanya pemilik warung (`role: pemberi` yang aktif di `anggotaWarung`) yang boleh mencatat, mengedit, menghapus, atau menandai lunas transaksi.
- Field kritikal (`warungId`, `dibuatOleh`, `dibuatOleh` pada transaksi, dsb.) dikunci agar tidak bisa diubah lewat update biasa.

Pastikan `firestore.rules` selalu di-publish ke Firebase Console **sebelum** deploy versi terbaru `index.html`, karena beberapa fitur (mis. multi-warung) bergantung pada rule terbaru.

---

## 🚀 Deploy Sendiri

1. Buat project Firebase baru → aktifkan **Authentication (Email/Password)** dan **Firestore Database**.
2. Copy isi `firestore.rules` ke Firebase Console → Firestore → Rules → **Publish**.
3. Ganti konfigurasi `firebaseConfig` di dalam `index.html` dengan konfigurasi project Firebase kamu sendiri.
4. Deploy `index.html` ke Vercel (atau hosting statis apa pun).

---

## 📄 Lisensi

Proyek pribadi — silakan dimodifikasi sesuai kebutuhan.

---

<p align="center"><sub>Warung Catat · Powered by Amos'rcpdroid</sub></p>
