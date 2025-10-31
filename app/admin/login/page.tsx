"use client";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string|undefined>();
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", { method:"POST", body: fd });
    if (res.ok) location.href="/admin";
    else setError("Password salah");
  }
  return (
    <div className="card" style={{maxWidth:360, margin:"60px auto"}}>
      <h1 className="text-xl font-semibold mb-3">Admin Login</h1>
      <form onSubmit={onSubmit} className="grid">
        <div>
          <label>Password</label>
          <input type="password" name="password" required/>
        </div>
        {error && <div style={{color:"crimson"}}>{error}</div>}
        <button className="btn" type="submit">Masuk</button>
      </form>
    </div>
  );
}
