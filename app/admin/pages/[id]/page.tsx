import { prisma, safePrismaQuery } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function EditPage({ params }: { params: { id: string } }) {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const pageResult = await safePrismaQuery(
    prisma.page.findUnique({ where: { id: params.id } })
  );
  if (pageResult.status === "skipped") {
    return <div>{pageResult.message}</div>;
  }
  const p = pageResult.data;
  if (!p) redirect("/admin/pages");

  async function save(formData: FormData) {
    "use server";
    if (!p) {
      throw new Error("Page not found");
    }
    const title = String(formData.get("title") || "");
    const slug = String(formData.get("slug") || "");
    const content = String(formData.get("content") || "");
    await prisma.page.update({ where: { id: p.id }, data: { title, slug, content } });
    redirect("/admin/pages");
  }

  async function remove() {
    "use server";
    if (!p) {
      throw new Error("Page not found");
    }
    await prisma.page.delete({ where: { id: p.id } });
    redirect("/admin/pages");
  }

  return (
    <form action={save} className="grid" style={{maxWidth:720}}>
      <div><label>Title</label><input name="title" defaultValue={p.title} required/></div>
      <div><label>Slug</label><input name="slug" defaultValue={p.slug} required/></div>
      <div><label>Content (HTML)</label><textarea name="content" rows={10} defaultValue={p.content}></textarea></div>
      <div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:8}}>
        <button className="btn" type="submit">Simpan</button>
        <form action={remove}><button className="btn" formAction={remove}>Hapus</button></form>
      </div>
    </form>
  );
}
