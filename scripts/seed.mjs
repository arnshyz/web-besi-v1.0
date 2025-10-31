import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1, waNumber: "6281234567890" } });
  await prisma.page.upsert({ where: { slug: "tentang-kami" }, update: {}, create: { slug:"tentang-kami", title:"Tentang Kami", content:"<p>Profil perusahaan besi & baja.</p>" } });
  await prisma.page.upsert({ where: { slug: "faq" }, update: {}, create: { slug:"faq", title:"FAQ", content:"<p>Pertanyaan yang sering diajukan.</p>" } });
  const cat = await prisma.category.upsert({ where: { slug: "besi" }, update: {}, create: { slug:"besi", name:"Besi" } });
  await prisma.product.upsert({ where: { slug: "besi-beton-8mm" }, update: {}, create: { slug:"besi-beton-8mm", name:"Besi Beton 8mm", priceMin: 50000, featured: true, categoryId: cat.id } });
  await prisma.heroSlide.createMany({ data: [
    { title: "Stok Lengkap", subtitle: "Ready kirim", image: "https://picsum.photos/seed/steel1/800/400", sort: 0 },
    { title: "Harga Bersaing", subtitle: "Tanya penawaran", image: "https://picsum.photos/seed/steel2/800/400", sort: 1 }
  ]});
  await prisma.partnerLogo.create({ title:"Contoh Partner", image:"https://picsum.photos/seed/logo/200/80", url:"#" });
  await prisma.testimonial.create({ author:"Budi", content:"Pelayanan cepat dan ramah." });
}

main().finally(()=> prisma.$disconnect());
