import { prisma } from "@/lib/prisma";
import { Toolbar } from "../_ui";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function ProdukList() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const items = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <Toolbar title="Produk" createHref="/admin/produk/new"/>
      <table className="table">
        <thead><tr><th>Nama</th><th>Slug</th><th>Harga Min</th><th>Featured</th><th></th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.slug}</td>
              <td>{i.priceMin ?? "-"}</td>
              <td>{i.featured ? "Ya" : "-"}</td>
              <td><Link href={`/admin/produk/${i.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
