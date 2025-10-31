import { prisma, prismaUnavailableMessage, safePrismaQuery } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CmsPage({ params }: { params: { slug: string } }) {
  const pageResult = await safePrismaQuery(
    prisma.page.findUnique({ where: { slug: params.slug } })
  );
  if (pageResult.status === "skipped") {
    return <div>{prismaUnavailableMessage(pageResult.reason)}</div>;
  }
  const page = pageResult.data;
  if (!page) notFound();
  return (
    <article className="card">
      <h1 className="text-2xl font-semibold mb-3">{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}
