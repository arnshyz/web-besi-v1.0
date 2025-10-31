import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const form = await req.formData();
  const pw = String(form.get("password") || "");
  if (pw && process.env.ADMIN_PASSWORD && pw === process.env.ADMIN_PASSWORD) {
    (await cookies()).set("admin_session", "ok", { httpOnly: true, sameSite: "lax", path: "/" });
    return NextResponse.json({ ok: true });
  }
  return new NextResponse("Unauthorized", { status: 401 });
}
