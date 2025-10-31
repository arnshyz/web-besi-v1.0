import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function EditCategory({ params }: { params: { id: string } }) {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const c = await prisma.category.findUnique({ where: { id: params.id } });
  const cats = await prisma.category.findMany({ orderBy: { name: "asc" } });
  if (!c) redirect("/admin/kategori");

  async function save(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const slug = String(formData.get("slug") || "");
    const parentId = String(formData.get("parentId") || "") || null;
    await prisma.category.update({ where: { id: c.id }, data: { name, slug, parentId: parentId || null } });
    redirect("/admin/kategori");
  }

  async function remove() {
    "use server";
    await prisma.category.delete({ where: { id: c.id } });
    redirect("/admin/kategori");
  }

  return (
    <form action={save} className="grid" style={{maxWidth:520}}>
      <div><label>Nama</label><input name="name" defaultValue={c.name} required/></div>
      <div><label>Slug</label><input name="slug" defaultValue={c.slug} required/></div>
      <div>
        <label>Parent</label>
        <select name="parentId" defaultValue={c.parentId || ""}>
          <option value="">(none)</option>
          {cats.filter(x=>x.id!==c.id).map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </div>
      <div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:8}}>
        <button className="btn" type="submit">Simpan</button>
        <form action={remove}><button className="btn" formAction={remove}>Hapus</button></form>
      </div>
    </form>
  );
}
