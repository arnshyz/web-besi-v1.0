import { prisma, prismaUnavailableMessage, safePrismaQuery } from "@/lib/prisma";
import { Toolbar } from "../_ui";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function ProdukList() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const itemsResult = await safePrismaQuery(
    prisma.product.findMany({ orderBy: { updatedAt: "desc" } })
  );
  const items = itemsResult.status === "success" ? itemsResult.data : [];
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
          {items.length === 0 && (
            <tr>
              <td colSpan={5}>
                {itemsResult.status === "skipped"
                  ? prismaUnavailableMessage(itemsResult.reason, "admin")
                  : "Belum ada produk."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
