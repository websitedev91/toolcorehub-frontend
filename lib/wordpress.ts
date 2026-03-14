// lib/wordpress.ts

// Set NEXT_PUBLIC_WP_API_URL in .env.local:
// WordPress.com:  https://public-api.wordpress.com/wp/v2/sites/YOUR-SITE.wordpress.com
// Self-hosted WP: https://your-domain.com/wp-json/wp/v2
const API_BASE = process.env.NEXT_PUBLIC_WP_API_URL ?? "";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WPFeaturedMedia {
  source_url: string;
  alt_text: string;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WPFeaturedMedia[];
    "wp:term"?: WPCategory[][];
  };
}

export interface PostsResult {
  posts: WPPost[];
  totalPages: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function featuredImage(post: WPPost): WPFeaturedMedia | undefined {
  return post._embedded?.["wp:featuredmedia"]?.[0];
}

function postCategories(post: WPPost): WPCategory[] {
  return post._embedded?.["wp:term"]?.[0] ?? [];
}

// Re-export helpers so consumers don't need to know the shape
export { featuredImage, postCategories };

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * Fetch paginated published posts, embedded with media and terms.
 */
export async function getPosts(
  page: number = 1,
  perPage: number = 9
): Promise<PostsResult> {
  try {
    const url = `${API_BASE}/posts?_embed&page=${page}&per_page=${perPage}`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return { posts: [], totalPages: 0 };

    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? "0");
    const posts: WPPost[] = await res.json();
    return { posts, totalPages };
  } catch {
    return { posts: [], totalPages: 0 };
  }
}

/**
 * Fetch a single post by slug, embedded with media and terms.
 * Returns null if not found.
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const url = `${API_BASE}/posts?_embed&slug=${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const posts: WPPost[] = await res.json();
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch all post slugs for generateStaticParams.
 */
export async function getAllSlugs(): Promise<string[]> {
  try {
    // Fetch up to 100 slugs; for larger sites add pagination
    const url = `${API_BASE}/posts?per_page=100&_fields=slug`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) return [];

    const posts: { slug: string }[] = await res.json();
    return posts.map((p) => p.slug);
  } catch {
    return [];
  }
}

/**
 * Return the total number of pages for a given perPage count.
 */
export async function getTotalPages(perPage: number = 9): Promise<number> {
  try {
    const url = `${API_BASE}/posts?per_page=${perPage}&_fields=id`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) return 0;

    return Number(res.headers.get("X-WP-TotalPages") ?? "0");
  } catch {
    return 0;
  }
}

/**
 * Fetch all categories.
 */
export async function getCategories(): Promise<WPCategory[]> {
  try {
    const url = `${API_BASE}/categories?per_page=100`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) return [];

    const categories: WPCategory[] = await res.json();
    return categories;
  } catch {
    return [];
  }
}
