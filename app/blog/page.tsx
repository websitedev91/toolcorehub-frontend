// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, featuredImage, postCategories } from "@/lib/wordpress";
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
    month: "long",
    day: "numeric",
  });
}

// ── Post card ─────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: WPPost }): React.ReactElement {
  const image = featuredImage(post);
  const categories = postCategories(post);
  const excerpt = stripHtml(post.excerpt?.rendered ?? "");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/60 hover:shadow-[0_8px_32px_rgba(88,28,135,0.35)] transition-all duration-200"
    >
      {/* Featured image */}
      {image?.source_url && (
        <div className="overflow-hidden h-48 bg-slate-800">
          <img
            src={image.source_url}
            alt={image.alt_text || stripHtml(post.title.rendered)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category badges */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className="text-[16px] font-semibold text-slate-100 leading-snug group-hover:text-violet-300 transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 flex-1">
            {excerpt}
          </p>
        )}

        {/* Date */}
        <p className="text-xs text-slate-500 mt-auto">{formatDate(post.date)}</p>
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

  // Show at most 5 page numbers around current
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
          className={`${btnBase} bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700`}
        >
          ← Prev
        </Link>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="text-slate-500 px-1">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={`/blog?page=${p}`}
            className={`${btnBase} ${
              p === currentPage
                ? "bg-violet-500 text-white border border-violet-500"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className={`${btnBase} bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700`}
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
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 mb-3">
          Blog
        </h1>
        <p className="text-slate-400 text-[15px] max-w-xl">
          Tips, guides, and deep-dives on tools, productivity, SEO, and finance.
        </p>
      </div>

      {/* Grid or empty state */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-slate-400 text-lg mb-2">No posts found.</p>
          <p className="text-slate-500 text-sm">
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
