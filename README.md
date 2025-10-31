# Besi Catalog Starter (Next.js + Prisma)

Fitur:
- Katalog Produk, Kategori, Varian sederhana
- Pages `/pages/[slug]` untuk Tentang/FAQ
- Hero slider, Partner logo, Testimoni
- CTA WhatsApp di beranda dan detail produk
- Panel Admin sederhana (password .env)

## Jalankan Lokal
```
cp .env.example .env
# opsional: ubah ADMIN_PASSWORD dan NEXT_PUBLIC_WHATSAPP_NUMBER

npm i
npm run prisma:push
npm run seed

npm run dev
```

Buka:
- `http://localhost:3000/` beranda
- `http://localhost:3000/produk`
- `http://localhost:3000/pages/tentang-kami`
- `http://localhost:3000/admin` (login pakai ADMIN_PASSWORD)

## Deploy cepat (Vercel)
- Set `DATABASE_URL` ke Neon/Postgres atau gunakan `file:./dev.db` dengan Prisma Accelerate disabled.
- Set `ADMIN_PASSWORD` dan `NEXT_PUBLIC_*` di dashboard Vercel.
- Jalankan `npm run prisma:push` sebagai build command tambahan jika perlu.

## Catatan
- Ini kerangka dasar. Kembangkan upload media, SEO meta, pagination, filter, dan checkout jika diperlukan.
