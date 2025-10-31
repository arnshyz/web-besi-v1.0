import { prisma } from "@/lib/prisma";
import { Toolbar } from "../_ui";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function KategoriList() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <Toolbar title="Kategori" createHref="/admin/kategori/new"/>
      <table className="table">
        <thead><tr><th>Nama</th><th>Slug</th><th>Parent</th><th></th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.slug}</td>
              <td>{i.parentId ? items.find(x=>x.id===i.parentId)?.name : "-"}</td>
              <td><Link href={`/admin/kategori/${i.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
