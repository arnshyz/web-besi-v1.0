import { prisma, prismaUnavailableMessage, safePrismaQuery } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [slidesResult, partnersResult, testimonialsResult] = await Promise.all([
    safePrismaQuery(prisma.heroSlide.findMany({ orderBy: { sort: "asc" } })),
    safePrismaQuery(prisma.partnerLogo.findMany({})),
    safePrismaQuery(prisma.testimonial.findMany({ take: 6, orderBy: { createdAt: "desc" } })),
  ]);
  const featuredResult = await safePrismaQuery(
    prisma.product.findMany({ where: { featured: true }, take: 8, include: { category: true } })
  );
  const slides = slidesResult.status === "success" ? slidesResult.data : [];
  const partners = partnersResult.status === "success" ? partnersResult.data : [];
  const testimonials = testimonialsResult.status === "success" ? testimonialsResult.data : [];
  const featured = featuredResult.status === "success" ? featuredResult.data : [];

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waHref = wa ? `https://wa.me/${wa}` : undefined;
  const heroSlide = slides[0];
  const heroTitle = heroSlide?.title || "Solusi Besi & Baja Terlengkap";
  const heroSubtitle = heroSlide?.subtitle ||
    "Distribusi besi beton, plat, pipa, dan kebutuhan konstruksi lain dengan layanan logistik cepat ke seluruh Indonesia.";
  const heroPrimaryText = heroSlide?.ctaText || "Lihat Katalog";
  const heroPrimaryHref = heroSlide?.ctaHref || "/produk";

  const highlights = [
    {
      title: "Distribusi Nasional",
      description: "Pengiriman terpercaya untuk proyek skala kecil hingga mega proyek di berbagai kota.",
    },
    {
      title: "Ratusan SKU",
      description: "Pilihan material mulai dari besi beton, WF, H-Beam, kanal, hingga stainless siap kirim.",
    },
    {
      title: "Konsultasi Teknis",
      description: "Tim ahli membantu rekomendasi spesifikasi dan estimasi kebutuhan material Anda.",
    },
  ];

  const stats = [
    { value: "15+", label: "Tahun pengalaman" },
    { value: "300+", label: "Varian produk" },
    { value: "500+", label: "Klien korporasi" },
    { value: "24/7", label: "Layanan konsultasi" },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="eyebrow">Besi Nusantara</span>
            <h1 className="hero-title">{heroTitle}</h1>
            <p className="hero-text">{heroSubtitle}</p>
            <div className="hero-actions">
              <Link className="btn" href={heroPrimaryHref}>{heroPrimaryText}</Link>
              {waHref && (
                <a className="btn btn-secondary" href={`${waHref}?text=Halo%20saya%20butuh%20penawaran`}>Hubungi WhatsApp</a>
              )}
            </div>
            <div className="hero-slide-strip">
              {slides.length === 0 ? (
                <div className="hero-slide-card">
                  {slidesResult.status === "skipped"
                    ? prismaUnavailableMessage(slidesResult.reason)
                    : "Tambahkan slide promosi melalui panel admin untuk menampilkan highlight terbaru."}
                </div>
              ) : (
                slides.slice(0, 3).map((slide) => (
                  <div key={slide.id} className="hero-slide-card">
                    <strong>{slide.title}</strong>
                    {slide.subtitle ? <div>{slide.subtitle}</div> : null}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="hero-visual">
            {heroSlide?.image ? (
              <img src={heroSlide.image} alt={heroSlide.title} />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                alt="Produksi besi dan baja"
              />
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Kenapa memilih kami</span>
            <h2 className="section-title">Partner besi dan baja yang memahami kebutuhan proyek Anda</h2>
            <p className="section-subtitle">
              Kami hadir sebagai mitra pengadaan material konstruksi yang responsif dengan dukungan jaringan supply chain yang kuat.
            </p>
          </div>
          <div className="stat-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="card-grid" style={{ marginTop: 32 }}>
            {highlights.map((highlight) => (
              <div key={highlight.title} className="card card-muted">
                <h3 style={{ marginTop: 0 }}>{highlight.title}</h3>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Produk Unggulan</span>
            <h2 className="section-title">Material pilihan untuk kebutuhan konstruksi dan manufaktur</h2>
            <p className="section-subtitle">Telusuri koleksi produk unggulan kami atau jelajahi seluruh katalog untuk pilihan lebih lengkap.</p>
          </div>
          <div className="card-grid">
            {featured.map((product) => (
              <Link key={product.id} className="product-card" href={`/produk/${product.slug}`}>
                <span>{product.category?.name || "Produk"}</span>
                <strong>{product.name}</strong>
                <p style={{ margin: 0, color: "var(--muted)" }}>{product.summary || product.description || "Hubungi kami untuk detail spesifikasi."}</p>
                <div style={{ fontWeight: 600 }}>
                  {product.priceMin != null ? `Mulai Rp ${product.priceMin.toLocaleString("id-ID")}` : "Hubungi CS"}
                </div>
              </Link>
            ))}
            {featured.length === 0 && (
              <div className="card card-muted">
                {featuredResult.status === "skipped"
                  ? prismaUnavailableMessage(featuredResult.reason)
                  : "Belum ada produk unggulan yang ditampilkan. Tandai produk sebagai unggulan melalui admin."}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 24 }}>
            <span className="section-eyebrow">Partner Kami</span>
            <h2 className="section-title">Dipercaya berbagai produsen dan kontraktor nasional</h2>
          </div>
          <div className="partner-strip">
            <div className="partner-logos">
              {partners.length === 0 ? (
                <div>
                  {partnersResult.status === "skipped"
                    ? prismaUnavailableMessage(partnersResult.reason)
                    : "Logo partner akan tampil otomatis setelah diunggah melalui admin."}
                </div>
              ) : (
                partners.map((partner) => (
                  <a key={partner.id} href={partner.url || "#"}>
                    <img src={partner.image} alt={partner.title} />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Testimoni</span>
            <h2 className="section-title">Cerita dari klien yang membangun bersama kami</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.length === 0 ? (
              <div className="card card-muted">
                {testimonialsResult.status === "skipped"
                  ? prismaUnavailableMessage(testimonialsResult.reason)
                  : "Tambah testimoni pelanggan di admin agar tampil di halaman utama."}
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="quote">“{testimonial.content}”</div>
                  <div><span className="badge">{testimonial.author}</span></div>
                </div>
              ))
            )}
          </div>
          {waHref && (
            <div className="cta-banner">
              <div style={{ fontSize: 24, fontWeight: 600 }}>Siap diskusi proyek terbaru Anda?</div>
              <p style={{ margin: 0, maxWidth: 480 }}>
                Tim kami akan membantu menghitung kebutuhan material, jadwal pengiriman, dan estimasi biaya terbaik.
              </p>
              <a className="btn" href={`${waHref}?text=Halo%20saya%20ingin%20konsultasi%20kebutuhan%20besi%20dan%20baja`}>Konsultasi Gratis</a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
