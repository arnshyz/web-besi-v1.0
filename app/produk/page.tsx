import { prisma, prismaUnavailableMessage, safePrismaQuery } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProdukList() {
  const result = await safePrismaQuery(
    prisma.product.findMany({ orderBy: { updatedAt: "desc" }, take: 100, include: { category: true } })
  );
  const products = result.status === "success" ? result.data : [];
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waHref = wa ? `https://wa.me/${wa}` : undefined;

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Katalog Produk</span>
          <h1 className="section-title">Temukan material terbaik untuk proyek Anda</h1>
          <p className="section-subtitle">
            Katalog ini mencakup rangkaian besi beton, baja profil, pipa, hingga material penunjang lainnya. Hubungi kami untuk detail ketersediaan dan penawaran harga terbaru.
          </p>
        </div>
        <div className="card-grid">
          {products.map((product) => (
            <Link key={product.id} className="product-card" href={`/produk/${product.slug}`}>
              <span>{product.category?.name || "Produk"}</span>
              <strong>{product.name}</strong>
              <p style={{ margin: 0, color: "var(--muted)" }}>{product.summary || product.description || "Klik untuk melihat detail dan varian produk."}</p>
              <div style={{ fontWeight: 600 }}>
                {product.priceMin != null ? `Mulai Rp ${product.priceMin.toLocaleString("id-ID")}` : "Hubungi CS"}
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="card card-muted">
              {result.status === "skipped"
                ? prismaUnavailableMessage(result.reason)
                : "Belum ada produk di katalog. Tambahkan produk melalui panel admin."}
            </div>
          )}
        </div>
        {waHref && (
          <div className="cta-banner">
            <div style={{ fontSize: 22, fontWeight: 600 }}>Butuh bantuan memilih material?</div>
            <p style={{ margin: 0, maxWidth: 520 }}>
              Konsultasikan kebutuhan besi dan baja Anda dengan tim kami. Kami siap menyiapkan penawaran terbaik sesuai spesifikasi proyek.
            </p>
            <a className="btn" href={`${waHref}?text=Halo%20saya%20ingin%20tanya%20ketersediaan%20produk`}>Chat dengan Sales</a>
          </div>
        )}
      </div>
    </section>
  );
}
