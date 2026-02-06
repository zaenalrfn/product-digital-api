# Product Digital Store API 🛒

**Product Digital Store** adalah backend API yang dibangun menggunakan framework **AdonisJS 6**. Aplikasi ini dirancang untuk menangani penjualan produk digital (e-book, course, aset desain, dll) dengan sistem pembayaran otomatis melalui gateway **Midtrans**.

Aplikasi ini mencakup fitur manajemen produk, order, integrasi pembayaran, dan pengiriman aset digital otomatis via email setelah pembayaran sukses.

---

## ✨ Fitur Unggulan

- 🔐 **Authentication**: Registrasi dan Login aman menggunakan token API (AdonisJS Auth).
- 📦 **Manajemen Produk Digital**: CRUD data produk (judul, harga, file download).
- 🛒 **Order & Checkout**: Sistem pemesanan yang terintegrasi Payment Gateway Midtrans.
- 💳 **Integrasi Midtrans**: Pembayaran otomatis (Snap) dengan verifikasi Webhook real-time.
- 📧 **Pengiriman Otomatis**: Link download dikirim otomatis ke email pembeli setelah status `paid`.
- 🚀 **High Performance**: Dibangun di atas Node.js & AdonisJS yang cepat dan efisien.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [AdonisJS 6](https://adonisjs.com/) (TypeScript)
- **Database**: MySQL
- **ORM**: Lucid ORM
- **Payment Gateway**: Midtrans (Snap API)
- **Mail Engine**: Adonis Mail & Edge Template
- **Validator**: VineJS

---

## ⚙️ Persyaratan Sistem

Pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (Versi 20.x atau terbaru)
- [MySQL](https://www.mysql.com/) Database
- [NPM](https://www.npmjs.com/)

---

## 🚀 Cara Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda:

### 1. Clone Repository

```bash
git clone https://github.com/username/product-digital-store.git
cd productdigitalstore
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env` dan sesuaikan dengan konfigurasi Anda:

```bash
cp .env.example .env
```

Update variabel berikut di file `.env`:

```ini
PORT=3333
app_key= # Generate otomatis nanti
DB_USER=root
DB_PASSWORD=password_db_anda
DB_DATABASE=nama_database

# Konfigurasi Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx
MIDTRANS_IS_PRODUCTION=false

# Konfigurasi SMTP Email (Gmail/Mailtrap)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=username_smtp
SMTP_PASSWORD=password_smtp
```

### 4. Generate App Key

```bash
node ace generate:key
```

### 5. Jalankan Migrasi & Seeder

Buat tabel database dan isi data awal (dummy products & user):

```bash
node ace migration:run
node ace db:seed
```

### 6. Jalankan Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3333`.

---

## 📖 Dokumentasi API

Anda dapat menguji endpoint API menggunakan Postman atau tools sejenis.

### Endpoint Utama:

| Method | Endpoint                | Deskripsi                 | Auth? |
| :----- | :---------------------- | :------------------------ | :---- |
| `POST` | `/api/register`         | Mendaftar user baru       | No    |
| `POST` | `/api/login`            | Login & mendapatkan token | No    |
| `GET`  | `/api/produk-digitals`  | List semua produk         | Yes   |
| `POST` | `/api/checkout`         | Membuat order baru        | Yes   |
| `POST` | `/api/midtrans/webhook` | URL Callback Midtrans     | No    |

> **Catatan**: Untuk endpoint yang membutuhkan Auth, sertakan header `Authorization: Bearer <token>` yang didapat dari login.

---

## 🧪 Testing Alur Order

1.  **Login** user (gunakan user seeder: `test@example.com` / `password123`).
2.  **Pilih Produk** dari list produk digital.
3.  Lakukan **Checkout** untuk mendapatkan token pembayaran Midtrans.
4.  Lakukan pembayaran di simulator Midtrans.
5.  Cek status order di database (akan berubah jadi `paid`).
6.  Cek email (Mailtrap/Console) untuk melihat link download yang dikirim.

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat **Pull Request** atau laporkan isu di halaman Issues.

---

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
