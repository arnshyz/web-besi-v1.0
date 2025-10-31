import {
  prisma,
  prismaUnavailableMessage,
  safePrismaAction,
  safePrismaQuery,
} from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function EditCategory({ params }: { params: { id: string } }) {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const categoryResult = await safePrismaQuery(
    prisma.category.findUnique({ where: { id: params.id } })
  );
  const listResult = await safePrismaQuery(
    prisma.category.findMany({ orderBy: { name: "asc" } })
  );
  if (categoryResult.status === "skipped") {
    return <div>{prismaUnavailableMessage(categoryResult.reason, "admin")}</div>;
  }
  if (listResult.status === "skipped") {
    return <div>{prismaUnavailableMessage(listResult.reason, "admin")}</div>;
  }
  const c = categoryResult.data;
  const cats = listResult.data;
  if (!c) redirect("/admin/kategori");

  async function save(formData: FormData) {
    "use server";
    if (!c) {
      throw new Error("Category not found");
    }
    const name = String(formData.get("name") || "");
    const slug = String(formData.get("slug") || "");
    const parentId = String(formData.get("parentId") || "") || null;
    const result = await safePrismaAction(() =>
      prisma.category.update({ where: { id: c.id }, data: { name, slug, parentId: parentId || null } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
      return;
    }
    redirect("/admin/kategori");
  }

  async function remove() {
    "use server";
    if (!c) {
      throw new Error("Category not found");
    }
    const result = await safePrismaAction(() =>
      prisma.category.delete({ where: { id: c.id } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
      return;
    }
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
