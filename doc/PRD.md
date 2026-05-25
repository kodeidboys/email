# Product Requirements Document (PRD)
# AIPIK Studio - AI Photo Editor

---

## 1. Informasi Dokumen

| Field | Detail |
|-------|--------|
| **Nama Produk** | AIPIK Studio |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 25 Mei 2026 |
| **Author** | AIPIK Studio Team |
| **Status** | Draft |

---

## 2. Executive Summary

AIPIK Studio adalah platform editor foto berbasis AI yang menggabungkan kemampuan generative AI dengan tools editing profesional. Platform ini memungkinkan siapa saja — dari pemula hingga profesional — untuk membuat dan mengedit gambar berkualitas tinggi tanpa keahlian desain yang mendalam.

### 2.1 Problem Statement

- Designer dan content creator membutuhkan banyak tools terpisah untuk workflow editing mereka
- Tools AI yang ada sering terlalu teknis atau mahal untuk pengguna casual
- Proses editing foto tradisional memakan waktu lama untuk hasil yang sederhana
- Bisnis kecil kesulitan membuat visual marketing berkualitas dengan budget terbatas

### 2.2 Proposed Solution

Platform all-in-one yang mengintegrasikan AI image generation, photo editing, dan design tools dalam satu interface yang intuitif dengan model freemium yang accessible.

---

## 3. Goals & Success Metrics

### 3.1 Business Goals

| Goal | Target | Timeline |
|------|--------|----------|
| Monthly Active Users (MAU) | 50,000 | 6 bulan post-launch |
| Paid Conversion Rate | 5-8% | 6 bulan post-launch |
| Monthly Recurring Revenue | $25,000 | 12 bulan post-launch |
| User Retention (D30) | > 40% | 3 bulan post-launch |

### 3.2 User Goals

- Membuat gambar dari teks dalam < 30 detik
- Menghapus background foto dalam < 5 detik
- Menyelesaikan editing dasar dalam < 2 menit
- Export hasil dalam kualitas tinggi tanpa watermark (Pro)

---

## 4. Target Users & Personas

### Persona 1: Sarah - Content Creator

| Attribute | Detail |
|-----------|--------|
| **Usia** | 22-30 tahun |
| **Pekerjaan** | Instagram/TikTok Content Creator |
| **Kebutuhan** | Buat konten visual menarik dengan cepat |
| **Pain Point** | Photoshop terlalu kompleks, Canva kurang AI features |
| **Goal** | Generate dan edit gambar untuk feed dalam hitungan menit |
| **Willingness to Pay** | Rp 99.000 - 199.000/bulan |

### Persona 2: Budi - E-commerce Seller

| Attribute | Detail |
|-----------|--------|
| **Usia** | 28-40 tahun |
| **Pekerjaan** | Online Shop Owner |
| **Kebutuhan** | Foto produk profesional tanpa studio |
| **Pain Point** | Biaya fotografer mahal, hasil foto HP kurang menarik |
| **Goal** | Background removal, enhance produk, buat banner promo |
| **Willingness to Pay** | Rp 149.000 - 299.000/bulan |

### Persona 3: Rina - Graphic Designer Freelance

| Attribute | Detail |
|-----------|--------|
| **Usia** | 25-35 tahun |
| **Pekerjaan** | Freelance Graphic Designer |
| **Kebutuhan** | Percepat workflow desain dengan AI assistance |
| **Pain Point** | Deadline ketat, perlu generate banyak variasi |
| **Goal** | AI sebagai co-pilot untuk mempercepat produksi |
| **Willingness to Pay** | Rp 199.000 - 499.000/bulan |

### Persona 4: Andi - Small Business Owner

| Attribute | Detail |
|-----------|--------|
| **Usia** | 30-50 tahun |
| **Pekerjaan** | Pemilik UMKM |
| **Kebutuhan** | Marketing material tanpa hire designer |
| **Pain Point** | Tidak punya skill desain, budget terbatas |
| **Goal** | Buat logo, poster, social media post sendiri |
| **Willingness to Pay** | Rp 49.000 - 149.000/bulan |

---

## 5. Feature Requirements

### 5.1 AI Image Generator (P0 - Must Have)

**Deskripsi**: Fitur utama yang memungkinkan pengguna menghasilkan gambar dari deskripsi teks.

#### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| IG-01 | User dapat memasukkan text prompt (max 500 karakter) | P0 |
| IG-02 | System menghasilkan gambar dalam < 30 detik | P0 |
| IG-03 | User dapat memilih style preset (min 10 styles) | P0 |
| IG-04 | User dapat memilih aspect ratio (1:1, 4:3, 16:9, 9:16, 3:4) | P0 |
| IG-05 | User dapat generate 4 variasi sekaligus | P1 |
| IG-06 | User dapat menggunakan negative prompt | P1 |
| IG-07 | User dapat mengatur seed untuk reproduksi | P2 |
| IG-08 | System menyimpan history generation | P1 |
| IG-09 | User dapat download hasil dalam PNG/JPG | P0 |
| IG-10 | User dapat langsung edit hasil di Canvas Editor | P1 |

#### Style Presets

- Realistic / Photographic
- Anime / Manga
- 3D Render
- Digital Illustration
- Watercolor
- Oil Painting
- Pixel Art
- Flat Design / Vector
- Cinematic
- Fantasy Art
- Minimalist
- Pop Art

---
