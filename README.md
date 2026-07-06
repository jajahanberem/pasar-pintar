# 🛒 Toko Ayi Toys & ATK - Aplikasi Kasir Pintar

Aplikasi Kasir Modern dengan Etalase Belanja Online untuk **Toko Ayi Toys & ATK** di Cicalengka, Jawa Barat.

## 📋 Fitur Utama

### 1. 🛍️ ETALASE KASIR
- **Scanner & Pencarian Cepat**: Cari produk berdasarkan nama atau scan barcode
- **Filter Kategori**: Filter produk berdasarkan kategori yang tersedia
- **Etalase Produk**: Tampilan grid produk yang menarik dengan harga dan stok
- **Keranjang Belanja**: Kelola items yang akan dibeli dengan mudah
- **Struk Pembayaran**: Preview nota kasir dengan perhitungan otomatis
- **Metode Pembayaran**: Tunai, QRIS, atau Transfer
- **Diskon/Potongan**: Tambahkan diskon untuk setiap transaksi
- **Cetak & Unduh**: Cetak nota atau unduh sebagai gambar

### 2. ➕ DAFTAR BARANG BARU
- **Manajemen Kategori**: Buat kategori/grup jualan baru
- **Registrasi Produk**: 
  - Kode Barcode Unik
  - Nama Lengkap Produk
  - Harga Modal Beli
  - Harga Jual Eceran
  - Harga Grosir
  - Stok Awal
- Data otomatis tersimpan di database lokal

### 3. 📦 STOK GUDANG TOKO
- **Daftar Inventori**: Lihat semua produk yang terdaftar
- **Informasi Lengkap**: Kategori, Kode Barcode, Nama Produk, Sisa Stok
- **Manajemen Stok**: Hapus produk yang tidak diperlukan

### 4. 📈 LAPORAN UNTUNG
- **Ringkasan Penjualan**: Total Omzet Pendapatan dan Total Untung Bersih
- **Daftar Transaksi**: Laporan detail setiap transaksi yang dilakukan
- **Perhitungan Otomatis**: Keuntungan bersih per transaksi
- **Data Terpersisten**: Semua data transaksi tersimpan secara permanen

## 🚀 Cara Menggunakan

### Instalasi & Development

1. **Clone Repository atau Download ZIP**
   ```bash
   # Jika menggunakan git
   git clone https://github.com/jajahanberem/pasar-pintar.git
   cd pasar-pintar
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   # atau gunakan npm/yarn
   # npm install
   # yarn install
   ```

3. **Jalankan Development Server**
   ```bash
   pnpm dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`

### Deployment ke Vercel

**Cara Termudah: Menggunakan CLI**
```bash
# Install Vercel CLI jika belum
npm i -g vercel

# Deploy
vercel
```

**Atau langsung di Vercel Dashboard:**
1. Buka https://vercel.com
2. Login dengan akun GitHub Anda
3. Klik "Add New" → "Project"
4. Pilih repository `pasar-pintar`
5. Klik "Deploy"

## 📊 Fitur Data Management

### Local Storage
- Semua data (produk, kategori, transaksi) disimpan di **localStorage browser**
- Data persisten selama tidak menghapus cache browser
- Tidak memerlukan backend atau database server

### Backup Data
Untuk backup data:
1. Buka Console Browser (F12)
2. Jalankan:
   ```javascript
   const data = localStorage.getItem('pasar-pintar-data');
   console.log(JSON.parse(data));
   ```
3. Copy dan simpan data tersebut

### Restore Data
```javascript
// Di Console
const data = {/* paste data dari backup */};
localStorage.setItem('pasar-pintar-data', JSON.stringify(data));
```

## 🎯 Workflow Kasir

1. **Setup Awal**
   - Buat kategori produk (ATK, Mainan, Sembako, dll)
   - Daftar semua barang dengan harga modal dan jual

2. **Transaksi Harian**
   - Cari/scan produk dari etalase
   - Tambahkan ke keranjang
   - Atur metode pembayaran & diskon
   - Cetak atau simpan struk
   - Transaksi otomatis tercatat di laporan

3. **Monitoring**
   - Lihat stok barang di gudang
   - Pantau laporan omzet dan keuntungan

## 💡 Tips & Trik

- **Barcode Scanner**: Jika HP punya fitur scan barcode, gunakan untuk input cepat
- **Kategori Terstruktur**: Buat kategori yang jelas untuk pencarian mudah
- **Harga Kompetitif**: Perhatikan margin keuntungan saat set harga jual
- **Backup Berkala**: Backup data secara rutin untuk keamanan

## 🔧 Technical Stack

- **Framework**: Next.js 16 (React)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Storage**: Browser localStorage
- **Deployment**: Vercel

## 📱 Responsive Design

Aplikasi ini fully responsive dan dapat diakses dari:
- 💻 Desktop/Laptop
- 📱 Tablet
- 📞 Mobile Phone

## 📞 Support

Untuk pertanyaan atau bug report, bisa:
1. Buat issue di GitHub
2. Hubungi pemilik toko
3. Cek dokumentasi di repository

## 📄 License

Dibuat khusus untuk Toko Ayi Toys & ATK

---

**Dibuat dengan ❤️ menggunakan v0 & Vercel**
