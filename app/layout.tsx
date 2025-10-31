import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="header container">
          <div><Link href="/"><b>{process.env.NEXT_PUBLIC_SITE_NAME || "Site"}</b></Link></div>
          <nav>
            <Link href="/produk">Produk</Link>
            <Link href="/pages/tentang-kami">Tentang</Link>
            <Link href="/pages/faq">FAQ</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="container" style={{marginTop:40, borderTop:"1px solid #eee", paddingTop:16}}>
          <div>© {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || "Site"}</div>
        </footer>
      </body>
    </html>
  );
}
