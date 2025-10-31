import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Besi Nusantara";
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappHref = waNumber ? `https://wa.me/${waNumber}` : undefined;

  return (
    <html lang="id">
      <body>
        <header className="site-header">
          <div className="container nav-bar">
            <Link className="brand" href="/">
              <span className="brand-mark" aria-hidden="true">BN</span>
              <div className="brand-copy">
                <span className="brand-label">{siteName}</span>
                <span className="brand-tagline">Distributor Besi &amp; Baja</span>
              </div>
            </Link>
            <nav className="nav-links">
              <Link href="/produk">Produk</Link>
              <Link href="/pages/tentang-kami">Tentang</Link>
              <Link href="/pages/faq">FAQ</Link>
              <Link href="/admin">Admin</Link>
            </nav>
            {whatsappHref ? (
              <a className="nav-cta" href={`${whatsappHref}?text=Halo%20Besi%20Nusantara`}>Hubungi Kami</a>
            ) : null}
          </div>
        </header>
        <main className="page-content">{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <div className="footer-brand">{siteName}</div>
              <p>Kami melayani kebutuhan besi dan baja untuk proyek konstruksi, industri, dan manufaktur di seluruh Indonesia.</p>
            </div>
            <div className="footer-links">
              <span>Jelajahi</span>
              <Link href="/produk">Katalog Produk</Link>
              <Link href="/pages/tentang-kami">Profil Perusahaan</Link>
              <Link href="/pages/faq">FAQ</Link>
            </div>
            <div className="footer-links">
              <span>Hubungi</span>
              {whatsappHref ? <a href={`${whatsappHref}?text=Halo%20saya%20butuh%20penawaran`}>WhatsApp</a> : <span>WhatsApp belum dikonfigurasi</span>}
              <Link href="/admin">Masuk Admin</Link>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} {siteName}. Semua hak dilindungi.
          </div>
        </footer>
      </body>
    </html>
  );
}
