"use client";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  // Very light guard. Real check is server-side in pages via actions.
  const [ok, setOk] = useState(true);
  useEffect(() => { setOk(true); }, []);
  if (!ok) return null;
  return <>{children}</>;
}
