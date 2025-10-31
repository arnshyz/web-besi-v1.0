"use server";

import { cookies } from "next/headers";

const COOKIE = "admin_session";

export async function loginAdmin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    (await cookies()).set(COOKIE, "ok", { httpOnly: true, sameSite: "lax", path: "/" });
    return { ok: true };
  }
  return { ok: false, error: "Invalid password" };
}

export async function logoutAdmin() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const c = (await cookies()).get(COOKIE)?.value;
  return c === "ok";
}
