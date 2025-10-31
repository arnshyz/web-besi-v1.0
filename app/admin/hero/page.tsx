import {
  prisma,
  prismaUnavailableMessage,
  safePrismaAction,
  safePrismaQuery,
} from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function HeroPage() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const slidesResult = await safePrismaQuery(
    prisma.heroSlide.findMany({ orderBy: { sort: "asc" } })
  );
  if (slidesResult.status === "skipped") {
    return <div>{prismaUnavailableMessage(slidesResult.reason, "admin")}</div>;
  }

  const slides = slidesResult.data;

  async function add(formData: FormData) {
    "use server";
    const title = String(formData.get("title")||"");
    const subtitle = String(formData.get("subtitle")||"");
    const image = String(formData.get("image")||"");
    const ctaText = String(formData.get("ctaText")||"");
    const ctaHref = String(formData.get("ctaHref")||"");
    const result = await safePrismaAction(() =>
      prisma.heroSlide.create({ data: { title, subtitle, image, ctaText, ctaHref } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
    }
  }

  async function del(formData: FormData) {
    "use server";
    const id = String(formData.get("id")||"");
    const result = await safePrismaAction(() =>
      prisma.heroSlide.delete({ where: { id } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
    }
  }

  return (
    <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
      <form action={add} className="card grid">
        <h2 className="text-lg font-semibold">Tambah Slide</h2>
        <div><label>Title</label><input name="title" required/></div>
        <div><label>Subtitle</label><input name="subtitle"/></div>
        <div><label>Image URL</label><input name="image" required/></div>
        <div><label>CTA Text</label><input name="ctaText"/></div>
        <div><label>CTA Href</label><input name="ctaHref"/></div>
        <button className="btn" type="submit">Tambah</button>
      </form>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Daftar Slide</h2>
        <table className="table">
          <thead><tr><th>Title</th><th>Image</th><th></th></tr></thead>
          <tbody>
            {slides.map(s => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td><img src={s.image} alt={s.title} style={{height:40}}/></td>
                <td>
                  <form action={del}><input type="hidden" name="id" value={s.id}/><button className="btn">Hapus</button></form>
                </td>
              </tr>
            ))}
            {slides.length === 0 && (
              <tr>
                <td colSpan={3}>
                  Belum ada slide.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
