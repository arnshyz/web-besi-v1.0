import { prisma, safePrismaQuery } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const [slidesResult, partnersResult, testimonialsResult] = await Promise.all([
    safePrismaQuery(prisma.heroSlide.findMany({ orderBy: { sort: "asc" } })),
    safePrismaQuery(prisma.partnerLogo.findMany({})),
    safePrismaQuery(prisma.testimonial.findMany({ take: 6, orderBy: { createdAt: "desc" } })),
  ]);
  const featuredResult = await safePrismaQuery(
    prisma.product.findMany({ where: { featured: true }, take: 8 })
  );
  const slides = slidesResult.status === "success" ? slidesResult.data : [];
  const partners = partnersResult.status === "success" ? partnersResult.data : [];
  const testimonials = testimonialsResult.status === "success" ? testimonialsResult.data : [];
  const featured = featuredResult.status === "success" ? featuredResult.data : [];

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <div className="grid" style={{gridTemplateColumns:"1fr"}}>
      {/* Hero */}
      <section className="card">
        <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
          <div>
            <h1 className="text-3xl font-bold mb-2">Solusi Besi & Baja Anda</h1>
            <p className="mb-4">Katalog lengkap dengan harga bersaing. Tanyakan stok dan penawaran.</p>
            <a className="btn" href={`https://wa.me/${wa}?text=Halo%20saya%20butuh%20penawaran`}>Chat WhatsApp</a>
          </div>
          <div>
            {slides.length === 0 ? (
              <div className="card">
                {slidesResult.status === "skipped" ? slidesResult.message : "Tambahkan slide di Admin"}
              </div>
            ) : (
              <div className="grid" style={{gridTemplateColumns:`repeat(${Math.min(3, slides.length)}, 1fr)`}}>
                {slides.slice(0,3).map(s => (
                  <div key={s.id} className="card">
                    <img src={s.image} alt={s.title} style={{width:"100%", height:140, objectFit:"cover", borderRadius:12}}/>
                    <div className="mt-2"><b>{s.title}</b><div className="text-sm" style={{color:"#777"}}>{s.subtitle}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="card">
        <div className="header">
          <h2 className="text-xl font-semibold">Produk Unggulan</h2>
          <Link href="/produk">Lihat semua</Link>
        </div>
        <div className="grid" style={{gridTemplateColumns:"repeat(4, 1fr)"}}>
          {featured.map(p => (
            <Link key={p.id} href={`/produk/${p.slug}`} className="card">
              <b>{p.name}</b>
              {p.priceMin != null ? <div className="text-sm">Mulai Rp {p.priceMin.toLocaleString("id-ID")}</div> : <div className="text-sm">Hubungi CS</div>}
            </Link>
          ))}
          {featured.length===0 && (
            <div>
              {featuredResult.status === "skipped"
                ? featuredResult.message
                : "Belum ada produk unggulan."}
            </div>
          )}
        </div>
      </section>

      {/* Partners */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-3">Partner</h2>
        <div className="grid" style={{gridTemplateColumns:"repeat(6, 1fr)"}}>
          {partners.map(p => (
            <a key={p.id} href={p.url || "#"} className="card">
              <img src={p.image} alt={p.title} style={{width:"100%", height:60, objectFit:"contain"}}/>
            </a>
          ))}
          {partners.length===0 && (
            <div>
              {partnersResult.status === "skipped" ? partnersResult.message : "Belum ada logo partner."}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-3">Testimoni</h2>
        <div className="grid" style={{gridTemplateColumns:"repeat(3, 1fr)"}}>
          {testimonials.map(t => (
            <div key={t.id} className="card">
              <div className="text-sm" style={{color:"#777"}}>“{t.content}”</div>
              <div className="mt-2"><span className="badge">{t.author}</span></div>
            </div>
          ))}
          {testimonials.length===0 && (
            <div>
              {testimonialsResult.status === "skipped" ? testimonialsResult.message : "Belum ada testimoni."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
