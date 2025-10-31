import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function AdminHome() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  return (
    <div className="grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
      <Link className="card" href="/admin/produk">Kelola Produk</Link>
      <Link className="card" href="/admin/kategori">Kelola Kategori</Link>
      <Link className="card" href="/admin/pages">Kelola Pages</Link>
      <Link className="card" href="/admin/hero">Hero Slider</Link>
      <Link className="card" href="/admin/partner">Logo Partner</Link>
      <Link className="card" href="/admin/testimoni">Testimoni</Link>
      <Link className="card" href="/admin/setting">Pengaturan</Link>
    </div>
  );
}
