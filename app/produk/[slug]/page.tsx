import Link from "next/link";
import { prisma, prismaUnavailableMessage, safePrismaQuery } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProdukDetail({ params }: { params: { slug: string } }) {
  const productResult = await safePrismaQuery(
    prisma.product.findUnique({ where: { slug: params.slug }, include: { variants: true, images: true, category: true } })
  );
  if (productResult.status === "skipped") {
    return <div>{prismaUnavailableMessage(productResult.reason)}</div>;
  }
  const product = productResult.data;
  if (!product) return <div>Produk tidak ditemukan.</div>;
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waHref = wa ? `https://wa.me/${wa}` : undefined;
  const price = product.priceMin != null ? `Mulai Rp ${product.priceMin.toLocaleString("id-ID")}` : "Hubungi CS";
  const description = product.description || product.summary || "Hubungi tim kami untuk informasi detail spesifikasi produk.";
  const heroImage = product.images[0]?.url;

  return (
    <section className="section">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span>/</span>
          <Link href="/produk">Produk</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-gallery">
            {heroImage ? (
              <img src={heroImage} alt={product.images[0]?.alt || product.name} />
            ) : (
              <div className="card card-muted">Gambar produk belum tersedia.</div>
            )}
          </div>

          <div className="product-info card">
            <span className="section-eyebrow" style={{ color: "var(--muted)" }}>{product.category?.name || "Produk"}</span>
            <h1 className="section-title" style={{ marginBottom: 12 }}>{product.name}</h1>
            <div className="product-price">{price}</div>
            <p className="product-description">{description}</p>
            {waHref && (
              <a
                className="btn"
                href={`${waHref}?text=Halo%20saya%20ingin%20tanya%20produk%20${encodeURIComponent(product.name)}`}
              >
                Dapatkan Penawaran
              </a>
            )}

            <div className="product-meta">
              <div>
                <span className="meta-label">ID Produk</span>
                <strong>{product.slug}</strong>
              </div>
              <div>
                <span className="meta-label">Terakhir diperbarui</span>
                <strong>{product.updatedAt.toLocaleDateString("id-ID")}</strong>
              </div>
            </div>

            <div className="variant-block">
              <h2>Varian &amp; Spesifikasi</h2>
              {product.variants.length === 0 ? (
                <p className="variant-empty">Belum ada varian yang tercatat.</p>
              ) : (
                <ul>
                  {product.variants.map((variant) => (
                    <li key={variant.id}>
                      <strong>{variant.name}</strong>
                      {variant.price != null ? <span>Rp {variant.price.toLocaleString("id-ID")}</span> : null}
                      {variant.stock != null ? <span>Stok: {variant.stock}</span> : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="card detail-description">
          <h2 style={{ marginTop: 0 }}>Informasi tambahan</h2>
          <p style={{ marginBottom: 0 }}>{product.description || "Detail spesifikasi dapat disesuaikan berdasarkan kebutuhan proyek."}</p>
        </div>
      </div>
    </section>
  );
}
