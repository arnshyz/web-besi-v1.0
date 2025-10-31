import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CmsPage({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({ where: { slug: params.slug } });
  if (!page) notFound();
  return (
    <article className="card">
      <h1 className="text-2xl font-semibold mb-3">{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}
