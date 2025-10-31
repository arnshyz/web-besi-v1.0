import Link from "next/link";

export function Toolbar({ title, createHref }: { title: string; createHref: string }) {
  return (
    <div className="header">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Link className="btn" href={createHref}>Tambah</Link>
    </div>
  );
}
