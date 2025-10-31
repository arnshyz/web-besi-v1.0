import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const p = await prisma.product.findUnique({ where: { id: params.id } });
  if (!p) redirect("/admin/produk");

  async function save(formData: FormData) {
    "use server";
    if (!p) {
      throw new Error("Product not found");
    }
    const name = String(formData.get("name") || "");
    const slug = String(formData.get("slug") || "");
    const priceMin = formData.get("priceMin") ? Number(formData.get("priceMin")) : null;
    const featured = formData.get("featured") === "on";
    await prisma.product.update({ where: { id: p.id }, data: { name, slug, priceMin, featured } });
    redirect("/admin/produk");
  }

  async function remove() {
    "use server";
    if (!p) {
      throw new Error("Product not found");
    }
    await prisma.product.delete({ where: { id: p.id } });
    redirect("/admin/produk");
  }

  return (
    <form action={save} className="grid" style={{maxWidth:520}}>
      <div><label>Nama</label><input name="name" defaultValue={p.name} required/></div>
      <div><label>Slug</label><input name="slug" defaultValue={p.slug} required/></div>
      <div><label>Harga Min</label><input name="priceMin" type="number" min="0" defaultValue={p.priceMin ?? undefined}/></div>
      <div><label>Featured</label><input name="featured" type="checkbox" defaultChecked={p.featured}/></div>
      <div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:8}}>
        <button className="btn" type="submit">Simpan</button>
        <form action={remove}><button className="btn" formAction={remove}>Hapus</button></form>
      </div>
    </form>
  );
}
