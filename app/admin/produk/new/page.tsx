import { redirect } from "next/navigation";
import { prisma, prismaUnavailableMessage, safePrismaAction, safePrismaQuery } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export default async function NewProduct() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");

  const availability = await safePrismaQuery(prisma.product.count());
  if (availability.status === "skipped") {
    return <div>{prismaUnavailableMessage(availability.reason, "admin")}</div>;
  }

  async function create(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const slug = String(formData.get("slug") || "");
    const priceMin = formData.get("priceMin") ? Number(formData.get("priceMin")) : null;
    const featured = formData.get("featured") === "on";
    const result = await safePrismaAction(() =>
      prisma.product.create({ data: { name, slug, priceMin, featured } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
      return;
    }
    redirect("/admin/produk");
  }

  return (
    <form action={create} className="grid" style={{maxWidth:520}}>
      <div><label>Nama</label><input name="name" required/></div>
      <div><label>Slug</label><input name="slug" required/></div>
      <div><label>Harga Min</label><input name="priceMin" type="number" min="0"/></div>
      <div><label>Featured</label><input name="featured" type="checkbox"/></div>
      <button className="btn" type="submit">Simpan</button>
    </form>
  );
}
