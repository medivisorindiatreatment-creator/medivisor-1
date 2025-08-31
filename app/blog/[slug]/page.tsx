import { wixClient } from "@/lib/wixClient"
import BlogPostClientPage from "@/components/BlogPostClientPage"
import { media } from "@wix/sdk"

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    console.log("Starting generateStaticParams...")

    if (!wixClient.posts) {
      console.error("Error: wixClient.posts module not available")
      return []
    }

    let allPosts: any[] = []

    try {
      if (typeof wixClient.posts.listPosts === "function") {
        console.log("Using listPosts method...")
        const response = await wixClient.posts.listPosts({
          paging: { limit: 100 },
        })
        allPosts = response.posts || []
        console.log(`Found ${allPosts.length} posts using listPosts`)
      }
    } catch (listError) {
      console.log("listPosts failed, trying queryPosts...")
      try {
        if (typeof wixClient.posts.queryPosts === "function") {
          const response = await wixClient.posts.queryPosts().limit(100).find()
          allPosts = response.items || []
          console.log(`Found ${allPosts.length} posts using queryPosts`)
        }
      } catch (queryError) {
        console.error("Both listPosts and queryPosts failed:", queryError)
        return []
      }
    }

    const slugs = allPosts
      .filter((post) => post.slug && typeof post.slug === "string")
      .map((post) => ({
        slug: post.slug,
      }))

    console.log(
      "Generated slugs:",
      slugs.map((s) => s.slug),
    )
    return slugs
  } catch (error) {
    console.error("Failed to generate static params:", error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    let post: any = null

    try {
      if (wixClient.posts.getPostBySlug) {
        const response = await wixClient.posts.getPostBySlug(slug)
        post = response.post
      }
    } catch (error) {
      try {
        const response = await wixClient.posts.queryPosts().eq("slug", slug).find()
        post = response.items?.[0]
      } catch (fallbackError) {
        console.error("Failed to fetch post for metadata:", fallbackError)
      }
    }

    if (post) {
      const imageUrl = getWixImageUrl(post.media?.wixMedia?.image || post.coverMedia?.image)

      return {
        title: post.title || "Blog Post",
        description: post.excerpt || "Read this blog post",
        openGraph: {
          title: post.title,
          description: post.excerpt,
          images: imageUrl ? [{ url: imageUrl }] : [],
          type: "article",
          publishedTime: post.firstPublishedDate,
          modifiedTime: post.lastPublishedDate,
        },
        twitter: {
          card: "summary_large_image",
          title: post.title,
          description: post.excerpt,
          images: imageUrl ? [imageUrl] : [],
        },
      }
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error)
  }

  return {
    title: "Blog Post",
    description: "Read our latest blog post",
  }
}

function getWixImageUrl(wixUrl: string | undefined): string | null {
  if (!wixUrl || !wixUrl.startsWith("wix:image://")) {
    return null
  }
  try {
    const { url } = media.getImageUrl(wixUrl)
    return url
  } catch (error) {
    console.error("Error getting Wix image URL:", error)
    return null
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <BlogPostClientPage slug={slug} />
}
