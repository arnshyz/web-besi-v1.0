import {
  prisma,
  prismaUnavailableMessage,
  safePrismaAction,
  safePrismaQuery,
} from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function TestimoniPage() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const itemsResult = await safePrismaQuery(
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } })
  );
  if (itemsResult.status === "skipped") {
    return <div>{prismaUnavailableMessage(itemsResult.reason, "admin")}</div>;
  }

  const items = itemsResult.data;

  async function add(formData: FormData) {
    "use server";
    const author = String(formData.get("author")||"");
    const content = String(formData.get("content")||"");
    const result = await safePrismaAction(() =>
      prisma.testimonial.create({ data: { author, content } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
    }
  }

  async function del(formData: FormData) {
    "use server";
    const id = String(formData.get("id")||"");
    const result = await safePrismaAction(() =>
      prisma.testimonial.delete({ where: { id } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
    }
  }

  return (
    <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
      <form action={add} className="card grid">
        <h2 className="text-lg font-semibold">Tambah Testimoni</h2>
        <div><label>Author</label><input name="author" required/></div>
        <div><label>Content</label><textarea name="content" rows={4} required></textarea></div>
        <button className="btn" type="submit">Tambah</button>
      </form>
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Daftar Testimoni</h2>
        <table className="table">
          <thead><tr><th>Author</th><th>Content</th><th></th></tr></thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id}>
                <td>{s.author}</td>
                <td>{s.content}</td>
                <td><form action={del}><input type="hidden" name="id" value={s.id}/><button className="btn">Hapus</button></form></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3}>
                  Belum ada testimoni.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
