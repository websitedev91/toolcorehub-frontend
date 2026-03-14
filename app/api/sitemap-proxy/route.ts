import { NextRequest, NextResponse } from "next/server";

const WP_BASE = "https://darkgreen-chicken-655727.hostingersite.com";
const PUBLIC_BASE = "https://www.toolcorehub.com/blog";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) return new NextResponse("Not found", { status: 404 });

  try {
    const res = await fetch(`${WP_BASE}/${path}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return new NextResponse("Not found", { status: 404 });

    const xml = await res.text();
    // Replace all Hostinger URLs with the public toolcorehub.com/blog URL
    const rewritten = xml.replaceAll(WP_BASE, PUBLIC_BASE);

    return new NextResponse(rewritten, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch sitemap", { status: 502 });
  }
}
