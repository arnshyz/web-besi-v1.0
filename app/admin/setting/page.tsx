import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function SettingPage() {
  const ok = await isAdmin(); if (!ok) redirect("/admin/login");
  const s = await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id:1 } });

  async function save(formData: FormData) {
    "use server";
    const waNumber = String(formData.get("waNumber")||"");
    await prisma.setting.update({ where: { id: 1 }, data: { waNumber } });
  }

  return (
    <form action={save} className="card grid" style={{maxWidth:520}}>
      <h2 className="text-lg font-semibold">Pengaturan</h2>
      <div><label>Nomor WhatsApp (62...)</label><input name="waNumber" defaultValue={s.waNumber}/></div>
      <button className="btn" type="submit">Simpan</button>
      <div className="text-sm" style={{color:"#777"}}>Public env NEXT_PUBLIC_WHATSAPP_NUMBER juga digunakan di halaman publik.</div>
    </form>
  );
}
