import { prisma, prismaUnavailableMessage, safePrismaQuery } from "@/lib/prisma";
import Link from "next/link";

export default async function ProdukList() {
  const result = await safePrismaQuery(
    prisma.product.findMany({ orderBy: { updatedAt: "desc" }, take: 50 })
  );
  const products = result.status === "success" ? result.data : [];
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-3">Katalog Produk</h1>
      <div className="grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {products.map(p => (
          <Link key={p.id} className="card" href={`/produk/${p.slug}`}>
            <b>{p.name}</b>
            {p.priceMin != null ? <div className="text-sm">Mulai Rp {p.priceMin.toLocaleString("id-ID")}</div> : <div className="text-sm">Hubungi CS</div>}
          </Link>
        ))}
        {products.length===0 && (
          <div>
            {result.status === "skipped"
              ? prismaUnavailableMessage(result.reason)
              : "Belum ada produk."}
          </div>
        )}
      </div>
    </div>
  );
}
