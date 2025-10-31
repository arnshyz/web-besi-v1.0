import { prisma } from "@/lib/prisma";

export default async function ProdukDetail({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { variants: true, images: true, category: true } });
  if (!product) return <div>Produk tidak ditemukan.</div>;
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const price = product.priceMin != null ? `Mulai Rp ${product.priceMin.toLocaleString("id-ID")}` : "Hubungi CS";

  return (
    <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
      <div className="card">
        {product.images[0] ? <img src={product.images[0].url} alt={product.images[0].alt || product.name} style={{width:"100%", borderRadius:12}}/> : <div className="card">Tidak ada gambar</div>}
      </div>
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="text-sm" style={{color:"#777"}}>{product.category?.name}</div>
        <div className="mt-2">{price}</div>
        <div className="mt-4">{product.description || "—"}</div>
        <a className="btn mt-4" href={`https://wa.me/${wa}?text=Halo%20saya%20ingin%20tanya%20produk%20${encodeURIComponent(product.name)}`}>Dapatkan Penawaran</a>
        <div className="mt-4">
          <b>Varian</b>
          <ul>
            {product.variants.map(v => (
              <li key={v.id} className="text-sm">{v.name} {v.price != null ? `- Rp ${v.price.toLocaleString("id-ID")}` : ""}</li>
            ))}
            {product.variants.length===0 && <li className="text-sm">Tidak ada varian.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
