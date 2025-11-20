import { NextResponse, type NextRequest } from "next/server";
import { wixServerClient } from "@/lib/wixServer";

// Allowed domains for security
const ALLOWED_ORIGINS = [
  "https://medivisorindiatreatment.com",
  "https://www.medivisorindiatreatment.com",
  "http://localhost:3000",
];

function createCORSResponse(body: any, status = 200, origin?: string) {
  const res = NextResponse.json(body, { status });

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return res;
}

// -----------------------------
// GET: Fetch Wix Blog Posts
// -----------------------------
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin") || "";

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "12");
  const offset = Number(searchParams.get("offset") ?? "0");
  const sort = searchParams.get("sort") ?? "PUBLISHED_DATE_DESC";

  try {
    const result = await wixServerClient.posts.listPosts({
      paging: { limit, offset },
      sort,
    });

    return createCORSResponse(
      {
        posts: result.posts ?? [],
        metaData: { total: result.metaData?.total ?? 0 },
      },
      200,
      origin
    );
  } catch (error) {
    console.error("[api/wix-posts] Error fetching posts:", error);

    return createCORSResponse(
      { error: "Failed to fetch blog posts." },
      500,
      origin
    );
  }
}

// -----------------------------
// OPTIONS: Preflight CORS
// -----------------------------
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}
