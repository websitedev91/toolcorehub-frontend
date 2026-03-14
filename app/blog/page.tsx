// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, featuredImage, postCategories, postAuthor } from "@/lib/wordpress";
import type { WPPost } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Toolcorehub",
  description:
    "Tips, guides, and insights on productivity tools, SEO, finance calculators, and more — from the Toolcorehub team.",
};

const PER_PAGE = 9;

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function estimateReadTime(content: string): number {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

// ── Post card ─────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: WPPost }): React.ReactElement {
  const image = featuredImage(post);
  const categories = postCategories(post);
  const excerpt = stripHtml(post.excerpt?.rendered ?? "");
  const readTime = estimateReadTime(post.content?.rendered ?? post.excerpt?.rendered ?? "");
  const author = postAuthor(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-200"
    >
      {/* Featured image */}
      {image?.source_url && (
        <div className="overflow-hidden h-52 bg-gray-100">
          <img
            src={image.source_url}
            alt={image.alt_text || stripHtml(post.title.rendered)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category badge + read time */}
        <div className="flex items-center gap-3 flex-wrap">
          {categories.length > 0 && (
            <span className="inline-block px-3 py-1 text-[11px] font-bold rounded-full bg-orange-500 text-white uppercase tracking-wide">
              {categories[0].name}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" strokeWidth="2" />
            </svg>
            {readTime} mins read
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-[16px] font-bold text-gray-900 leading-snug group-hover:text-orange-500 transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
            {excerpt}
          </p>
        )}

        {/* Author + Date */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {author?.avatar_urls?.["48"] ? (
              <img
                src={author.avatar_urls["48"]}
                alt={author.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                {author?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {author?.name ?? "Author"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
            </svg>
            {formatDate(post.date)}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}): React.ReactElement | null {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && currentPage > 3) ||
      (i === currentPage + 2 && currentPage < totalPages - 2)
    ) {
      pages.push("…");
    }
  }

  const btnBase =
    "inline-flex items-center justify-center h-9 min-w-[36px] px-3 rounded-lg text-sm font-medium transition-colors";

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-center gap-1.5 mt-12 flex-wrap"
    >
      {currentPage > 1 && (
        <Link
          href={`/blog?page=${currentPage - 1}`}
          className={`${btnBase} bg-white text-gray-600 hover:bg-gray-50 border border-gray-200`}
        >
          ← Prev
        </Link>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="text-gray-400 px-1">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={`/blog?page=${p}`}
            className={`${btnBase} ${
              p === currentPage
                ? "bg-orange-500 text-white border border-orange-500"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className={`${btnBase} bg-white text-gray-600 hover:bg-gray-50 border border-gray-200`}
        >
          Next →
        </Link>
      )}
    </nav>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<React.ReactElement> {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page ?? 1));

  const { posts, totalPages } = await getPosts(currentPage, PER_PAGE);

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-5 py-1.5 text-xs font-bold uppercase tracking-widest bg-orange-500 text-white rounded-full mb-5">
          Our Blog
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Toolcorehub Blog
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto">
          Tips, guides &amp; insights on{" "}
          <span className="text-orange-500">SEO, AI tools, and digital marketing</span>
        </p>
        <div className="mt-5 mx-auto w-16 h-1 bg-orange-500 rounded-full" />
      </div>

      {/* Grid or empty state */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-500 text-lg mb-2">No posts found.</p>
          <p className="text-gray-400 text-sm">
            Check back soon — new articles are on the way.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
