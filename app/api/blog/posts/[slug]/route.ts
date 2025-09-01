import { NextResponse, type NextRequest } from "next/server"
import { wixServerClient } from "@/lib/wixServer"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10)
  const offset = Number.parseInt(searchParams.get("offset") || "0", 10)
  const sort = searchParams.get("sort") || "PUBLISHED_DATE_DESC"

  try {
    const result = await wixServerClient.posts.listPosts({
      paging: { limit, offset },
      sort,
    })

    const posts = result.posts ?? []
    const total = result.metaData?.total ?? 0

    return NextResponse.json(
      { posts, metaData: { total } }, 
      { 
        status: 200,
        headers: corsHeaders,
      }
    )
  } catch (error) {
    console.error("[api/wix-posts] Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts." }, 
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}