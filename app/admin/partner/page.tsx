import {
  prisma,
  prismaUnavailableMessage,
  safePrismaAction,
  safePrismaQuery,
} from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function PartnerPage() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const itemsResult = await safePrismaQuery(
    prisma.partnerLogo.findMany({})
  );
  if (itemsResult.status === "skipped") {
    return <div>{prismaUnavailableMessage(itemsResult.reason, "admin")}</div>;
  }

  const items = itemsResult.data;

  async function add(formData: FormData) {
    "use server";
    const title = String(formData.get("title")||"");
    const url = String(formData.get("url")||"");
    const image = String(formData.get("image")||"");
    const result = await safePrismaAction(() =>
      prisma.partnerLogo.create({ data: { title, url, image } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
    }
  }

  async function del(formData: FormData) {
    "use server";
    const id = String(formData.get("id")||"");
    const result = await safePrismaAction(() =>
      prisma.partnerLogo.delete({ where: { id } })
    );
    if (result.status === "skipped") {
      console.warn(prismaUnavailableMessage(result.reason, "admin"));
    }
  }

  return (
    <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
      <form action={add} className="card grid">
        <h2 className="text-lg font-semibold">Tambah Partner</h2>
        <div><label>Title</label><input name="title" required/></div>
        <div><label>URL</label><input name="url"/></div>
        <div><label>Image URL</label><input name="image" required/></div>
        <button className="btn" type="submit">Tambah</button>
      </form>
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Daftar Partner</h2>
        <table className="table">
          <thead><tr><th>Title</th><th>Image</th><th></th></tr></thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td><img src={s.image} alt={s.title} style={{height:40}}/></td>
                <td><form action={del}><input type="hidden" name="id" value={s.id}/><button className="btn">Hapus</button></form></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3}>
                  Belum ada partner.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
