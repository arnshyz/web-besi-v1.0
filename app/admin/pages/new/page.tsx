import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export default async function NewPage() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");

  async function create(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const slug = String(formData.get("slug") || "");
    const content = String(formData.get("content") || "");
    await prisma.page.create({ data: { title, slug, content } });
    redirect("/admin/pages");
  }

  return (
    <form action={create} className="grid" style={{maxWidth:720}}>
      <div><label>Title</label><input name="title" required/></div>
      <div><label>Slug</label><input name="slug" required/></div>
      <div><label>Content (HTML)</label><textarea name="content" rows={10}></textarea></div>
      <button className="btn" type="submit">Simpan</button>
    </form>
  );
}
