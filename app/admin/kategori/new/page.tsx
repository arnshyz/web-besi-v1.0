import { redirect } from "next/navigation";
import { prisma, safePrismaQuery } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export default async function NewCategory() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const catsResult = await safePrismaQuery(
    prisma.category.findMany({ orderBy: { name: "asc" } })
  );
  if (catsResult.status === "skipped") {
    return <div>{catsResult.message}</div>;
  }
  const cats = catsResult.data;

  async function create(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const slug = String(formData.get("slug") || "");
    const parentId = String(formData.get("parentId") || "") || null;
    await prisma.category.create({ data: { name, slug, parentId: parentId || null } });
    redirect("/admin/kategori");
  }

  return (
    <form action={create} className="grid" style={{maxWidth:520}}>
      <div><label>Nama</label><input name="name" required/></div>
      <div><label>Slug</label><input name="slug" required/></div>
      <div>
        <label>Parent</label>
        <select name="parentId" defaultValue="">
          <option value="">(none)</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <button className="btn" type="submit">Simpan</button>
    </form>
  );
}
