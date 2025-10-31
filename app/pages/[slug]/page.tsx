import Link from "next/link";
import { prisma, prismaUnavailableMessage, safePrismaQuery } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
    <section className="section">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span>/</span>
          <span>{page.title}</span>
        </nav>
        <article className="card cms-article">
          <h1 className="section-title" style={{ marginBottom: 24 }}>{page.title}</h1>
          <div className="cms-content" dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </div>
    </section>
  );
}
