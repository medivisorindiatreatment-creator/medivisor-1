import { type NextRequest, NextResponse } from "next/server"
import { wixServerClient } from "@/lib/wixServer"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    console.log("[v0] Fetching post with slug:", slug)

    let post: any = null

    // Try different methods to fetch the post by slug
    try {
      if (typeof wixServerClient.posts.getPostBySlug === "function") {
        const response = await wixServerClient.posts.getPostBySlug(slug)
        post = response.post
        console.log("[v0] Post found using getPostBySlug")
      }
    } catch (error) {
      console.log("[v0] getPostBySlug failed, trying queryPosts...")
      try {
        if (typeof wixServerClient.posts.queryPosts === "function") {
          const response = await wixServerClient.posts.queryPosts().eq("slug", slug).find()
          post = response.items?.[0]
          console.log("[v0] Post found using queryPosts")
        }
      } catch (fallbackError) {
        console.error("[v0] Both getPostBySlug and queryPosts failed:", fallbackError)
        const errorResponse = NextResponse.json(
          {
            error: "Post not found",
            details: fallbackError instanceof Error ? fallbackError.message : "Unknown error",
          },
          { status: 404 },
        )
        errorResponse.headers.set("Access-Control-Allow-Origin", "*")
        errorResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return errorResponse
      }
    }

    if (!post) {
      console.log("[v0] No post found for slug:", slug)
      const notFoundResponse = NextResponse.json({ error: "Post not found" }, { status: 404 })
      notFoundResponse.headers.set("Access-Control-Allow-Origin", "*")
      notFoundResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      notFoundResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
      return notFoundResponse
    }

    const processedPost = {
      ...post,
      excerpt: post.excerpt || "No description available.",
      content: post.content || "",
      publishedDate: post.publishedDate || post.firstPublishedDate,
      author: post.author || { name: "Anonymous" },
      tags: post.tags || [],
      categories: post.categories || [],
    }

    console.log("[v0] Post processed successfully:", processedPost.title)

    const response = NextResponse.json({ post: processedPost })
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("[v0] Failed to fetch post:", error)
    const errorResponse = NextResponse.json(
      {
        error: "Failed to fetch blog post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
    errorResponse.headers.set("Access-Control-Allow-Origin", "*")
    errorResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return errorResponse
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
