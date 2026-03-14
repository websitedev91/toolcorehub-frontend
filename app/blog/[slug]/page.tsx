// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllSlugs,
  featuredImage,
  postCategories,
} from "@/lib/wordpress";

export const revalidate = 60;

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Toolcorehub" };
  }

  const image = featuredImage(post);
  const title = post.title.rendered.replace(/<[^>]*>/g, "");
  const description = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, 160);

  return {
    title: `${title} | Toolcorehub`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      ...(image?.source_url
        ? {
            images: [
              {
                url: image.source_url,
                alt: image.alt_text || title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image?.source_url ? { images: [image.source_url] } : {}),
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Rough reading-time estimate: 200 wpm */
function readingTime(html: string): string {
  const words = html.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactElement> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const image = featuredImage(post);
  const categories = postCategories(post);
  const title = post.title.rendered.replace(/<[^>]*>/g, "");

  return (
    <article>
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-400 transition-colors mb-8"
      >
        ← Back to Blog
      </Link>

      {/* Featured image */}
      {image?.source_url && (
        <div className="w-full rounded-2xl overflow-hidden mb-8 bg-slate-800">
          <img
            src={image.source_url}
            alt={image.alt_text || title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* Category badges */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1
        className="text-3xl md:text-4xl font-bold text-slate-50 leading-tight mb-5"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      {/* Meta: author line */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
        <span>{formatDate(post.date)}</span>
        <span className="text-slate-700">·</span>
        <span>{readingTime(post.content.rendered)}</span>
      </div>

      {/* Post content */}
      <div
        className="prose prose-lg prose-invert prose-slate max-w-none
          prose-headings:font-semibold prose-headings:text-slate-100
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-200
          prose-code:text-violet-300 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
          prose-blockquote:border-l-violet-500 prose-blockquote:text-slate-400
          prose-img:rounded-xl prose-img:border prose-img:border-slate-800
          prose-hr:border-slate-800
          prose-ul:text-slate-300 prose-ol:text-slate-300
          prose-li:marker:text-violet-400"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* Footer back link */}
      <div className="mt-12 pt-8 border-t border-slate-800">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-400 transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </article>
  );
}
