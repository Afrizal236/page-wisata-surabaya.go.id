# surabaya.go.id — Frontend

Website resmi Kota Surabaya versi 2.0. Dibangun menggunakan **Next.js** dengan arsitektur modern dan tampilan responsif untuk memberikan informasi publik seputar berita, wisata, media, agenda, dan layanan kota kepada warga dan wisatawan.

---

## Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Prasyarat](#prasyarat)
- [Instalasi & Menjalankan Lokal](#instalasi--menjalankan-lokal)
- [Environment Variables](#environment-variables)
- [Script yang Tersedia](#script-yang-tersedia)
- [Deployment dengan Docker](#deployment-dengan-docker)
- [Arsitektur API](#arsitektur-api)
- [Halaman & Routing](#halaman--routing)
- [Komponen Utama](#komponen-utama)

---

## Gambaran Umum

Proyek ini adalah aplikasi **Frontend** untuk situs resmi Pemerintah Kota Surabaya (`surabaya.go.id`). Menggunakan pola **Backend-for-Frontend (BFF)** melalui Next.js API Routes untuk memproxikan data dari backend internal sebelum dikirim ke sisi klien.

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Berita** | Menampilkan, mencari, dan membaca artikel berita dengan kategori |
| **Wisata** | Informasi destinasi wisata, hotel, dan kuliner di Surabaya |
| **Media** | Galeri foto, video, dan podcast |
| **Agenda / Event** | Daftar agenda dan kegiatan kota |
| **Infografis** | Tampilan data visual berupa infografik |
| **Pencarian** | Pencarian konten di seluruh situs |
| **Aksesibilitas** | Fitur aksesibilitas untuk pengguna disabilitas |
| **Share Konten** | Fitur berbagi konten ke media sosial |
| **PDF Viewer** | Pembaca dokumen PDF terintegrasi |

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | [Next.js 13](https://nextjs.org/) (Pages Router) |
| **Language** | TypeScript 4.6 |
| **UI Library** | [Material UI (MUI) v5](https://mui.com/) + Emotion |
| **Data Fetching** | [TanStack React Query v4](https://tanstack.com/query) |
| **HTTP Client** | [Axios 0.27](https://axios-http.com/) |
| **Date Utility** | Day.js + date-fns |
| **Form** | Formik |
| **Carousel** | React Slick |
| **Video Player** | React Player |
| **PDF Viewer** | React PDF Viewer + pdfjs-dist |
| **Social Share** | React Share |
| **Linting** | ESLint |
| **Containerization** | Docker + Docker Compose |

---

## Struktur Proyek

```
frontend/
├── components/         # Komponen UI yang dapat digunakan ulang
│   ├── header.tsx
│   ├── footer.tsx
│   ├── layout.tsx
│   ├── home.section1.tsx ... home.section7.tsx
│   ├── carousel.*.tsx  # Berbagai jenis carousel
│   ├── news.*.tsx      # Komponen berita
│   ├── media.*.tsx     # Komponen media (foto, video, podcast)
│   ├── wisata.tsx
│   ├── destination.tsx
│   ├── hotel.tsx
│   ├── culinary.tsx
│   ├── infografis.*.tsx
│   ├── search.tsx
│   ├── pagination.tsx
│   └── accessibility.tsx
│
├── contexts/           # React Context Providers
├── data/               # Data statis / mock data
├── hooks/              # Custom React Hooks
│
├── pages/              # Halaman Next.js (file-based routing)
│   ├── index.tsx       # Halaman utama
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # Custom document
│   ├── berita/         # Halaman berita
│   ├── agenda/         # Halaman agenda/event
│   ├── wisata/         # Halaman wisata
│   ├── infografis/     # Halaman infografis
│   ├── photos/         # Galeri foto
│   ├── videos/         # Galeri video
│   ├── podcasts/       # Galeri podcast
│   └── api/data/       # API Routes (BFF Proxy)
│       ├── news.tsx
│       ├── agenda.tsx
│       ├── menu.tsx
│       └── webdisplay.tsx
│
├── public/             # Aset statis (gambar, ikon, dll.)
├── styles/             # CSS global
├── types/              # Definisi TypeScript (interface & type)
│
├── utils/              # Utilitas dan helper
│   ├── axios.config.tsx     # Konfigurasi Axios
│   ├── activeClassName.tsx
│   ├── truncate.tsx
│   ├── duration.tsx
│   └── services/            # Fungsi pemanggil API
│       ├── news.tsx
│       ├── agenda.tsx
│       ├── home.tsx
│       ├── destination.ts
│       ├── hotel.ts
│       ├── culinary.ts
│       ├── event.ts
│       ├── menu.tsx
│       ├── webdisplay.tsx
│       └── ...
│
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── tsconfig.json
├── server.js           # Custom Node.js server
└── headers.js          # Konfigurasi HTTP Security Headers
```

---

## Prasyarat

Pastikan perangkat Anda telah menginstal:

- [Node.js](https://nodejs.org/) >= **18.x**
- [Yarn](https://yarnpkg.com/) (direkomendasikan) atau npm
- [Docker](https://www.docker.com/) (opsional, untuk deployment)

---

## Instalasi & Menjalankan Lokal

### 1. Clone Repository

```bash
git clone <url-repository>
cd tourism/frontend
```

### 2. Install Dependensi

```bash
# Menggunakan Yarn (direkomendasikan)
yarn install

# Atau menggunakan npm
npm install
```

### 3. Buat File Environment

Salin file `.env` dan sesuaikan konfigurasi:

```bash
cp .env .env.local
```

Lalu isi nilai variabel sesuai kebutuhan (lihat bagian [Environment Variables](#environment-variables)).

### 4. Jalankan Development Server

```bash
yarn dev
# atau
npm run dev
```

Aplikasi akan berjalan di **[http://localhost:3000](http://localhost:3000)**

---

## Environment Variables

Buat file `.env.local` (development) atau `.env.production` (production) di folder `frontend/` dengan isi berikut:

```env
# URL API utama backend Surabaya
API_URL=http://surabaya.go.id/api/

# URL API WebDisplay
API_URL_WEBDISPLAY=https://webdisplay.surabaya.go.id/api/

# Base URL untuk gambar publik
NEXT_PUBLIC_IMG=https://surabaya.go.id

# URL internal backend (digunakan di server-side / API Routes)
BASE_API_URL=http://<internal-ip>:<port>/api/v1/

# Signature keamanan untuk header request
SIGNATURE=<your-signature-hash>

# ID kota Surabaya
SBY_ID=1

# Slug untuk identifikasi domain
SURABAYA_SLUG=surabaya.go.id
```

> **Catatan:** Variabel yang diawali `NEXT_PUBLIC_` akan tersedia di sisi klien (browser). Variabel lainnya hanya tersedia di server.

---

## Script yang Tersedia

```bash
# Menjalankan server development (hot-reload)
yarn dev

# Membuat build production
yarn build

# Menjalankan server production (setelah build)
yarn start

# Menjalankan linter (ESLint)
yarn lint
```

---

## Deployment dengan Docker

Proyek ini sudah dilengkapi dengan `Dockerfile` multi-stage dan `docker-compose.yml`.

### Build & Jalankan dengan Docker Compose

```bash
# Pastikan file .env.production sudah terisi
docker-compose up -d --build
```

Aplikasi akan berjalan di **[http://localhost:3005](http://localhost:3005)**

### Detail Konfigurasi Docker

| Parameter | Nilai |
|---|---|
| **Base Image** | `node:18-alpine` |
| **Port** | `3005` |
| **Output Mode** | `standalone` (Next.js) |
| **Volume** | `/media/HDNFS/surabaya/uploads/images` → `/app/public/images` |
| **Restart Policy** | `always` |

### Build Manual Docker

```bash
# Build image
docker build -t main-surabaya .

# Jalankan container
docker run -d \
  -p 3005:3005 \
  --env-file .env.production \
  --name surabaya-frontend \
  main-surabaya
```

---

## Arsitektur API

Aplikasi menggunakan pola **Backend-for-Frontend (BFF)**:

```
Browser/Client
     │
     ▼
Next.js Pages & Components
     │
     ▼
Next.js API Routes (/pages/api/data/)   ← Layer BFF (server-side proxy)
     │
     ├──► Backend API Surabaya (BASE_API_URL)
     └──► WebDisplay API (API_URL_WEBDISPLAY)
```

### Konfigurasi Axios

`utils/axios.config.tsx` menyediakan dua instance Axios:

```ts
// Menggunakan BASE_API_URL (internal backend Surabaya)
axiosConfig(true)

// Menggunakan API_URL_WEBDISPLAY
axiosConfig(false)
```

Setiap request menyertakan header `Signature` untuk autentikasi ke backend.

---

## Halaman & Routing

| Path | Deskripsi |
|---|---|
| `/` | Halaman utama (beranda) |
| `/berita` | Daftar berita |
| `/berita/[slug]` | Detail artikel berita |
| `/agenda` | Daftar agenda / event kota |
| `/wisata` | Halaman informasi wisata |
| `/infografis` | Daftar infografis |
| `/photos` | Galeri foto |
| `/videos` | Galeri video |
| `/podcasts` | Galeri podcast |
| `/api/data/news` | API Route: proxy data berita |
| `/api/data/agenda` | API Route: proxy data agenda |
| `/api/data/menu` | API Route: proxy data menu navigasi |
| `/api/data/webdisplay` | API Route: proxy data webdisplay |

---

## Komponen Utama

| Komponen | Fungsi |
|---|---|
| `layout.tsx` | Wrapper utama halaman (header + footer) |
| `header.tsx` | Navigasi utama & menu |
| `footer.tsx` | Footer situs |
| `carousel.main.tsx` | Carousel hero di halaman utama |
| `carousel.photo.tsx` | Carousel galeri foto |
| `news.list.tsx` | Daftar artikel berita |
| `news.detail.redesign.tsx` | Tampilan detail berita |
| `wisata.tsx` | Daftar destinasi wisata |
| `destination.tsx` | Detail destinasi |
| `hotel.tsx` | Informasi hotel |
| `culinary.tsx` | Informasi kuliner |
| `media.player.video.tsx` | Pemutar video |
| `media.player.audio.tsx` | Pemutar podcast/audio |
| `infografis.list.tsx` | Daftar infografis |
| `search.tsx` | Komponen pencarian |
| `pagination.tsx` | Komponen paginasi |
| `accessibility.tsx` | Fitur aksesibilitas |
| `popper.share.tsx` | Tombol share ke media sosial |
| `loading.tsx` | Indikator loading |

---

## Lisensi

Proyek ini bersifat **private** dan dikembangkan untuk keperluan internal Pemerintah Kota Surabaya.

---

> Dikembangkan oleh Tim Pengembang Web Kota Surabaya · v2.0.0
