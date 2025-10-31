import { prisma } from "@/lib/prisma";
import { Toolbar } from "../_ui";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function PagesList() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const items = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <Toolbar title="Pages" createHref="/admin/pages/new"/>
      <table className="table">
        <thead><tr><th>Title</th><th>Slug</th><th></th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.slug}</td>
              <td><Link href={`/admin/pages/${i.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
