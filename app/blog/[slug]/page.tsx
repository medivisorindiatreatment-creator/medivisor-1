import BlogPostClientPage from "@/components/BlogPostClientPage"
import { wixServerClient } from "@/lib/wixServer"
import type { Metadata } from "next"
import { media } from "@wix/sdk"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    // Try to fetch the post to generate metadata
    // We use the server client here
    const response = await wixServerClient.posts.getPostBySlug(slug)
    const post = response?.post

    if (!post) {
      return {
        title: "Post Not Found | Medivisor India",
        description: "The blog post you are looking for does not exist.",
      }
    }

    // Extract image URL for Open Graph
    let ogImage = "/blog-abstract-design.png"
    if (post.coverMedia?.image) {
      const imageId = post.coverMedia.image
      if (imageId.startsWith("wix:image://")) {
        ogImage = media.getImageUrl(imageId).url
      } else {
        ogImage = imageId
      }
    }

    return {
      title: `${post.title} | Medivisor India`,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        type: "article",
        url: `/blog/${post.slug}`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        publishedTime: post.firstPublishedDate,
        modifiedTime: post.lastPublishedDate,
        authors: ["Medivisor India"],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.title,
        images: [ogImage],
      },
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Medivisor India Blog",
      description: "Read our latest articles on medical tourism and healthcare in India.",
    }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  return <BlogPostClientPage slug={slug} />
}

// Generate static params for blog posts (optional, for better performance)
export async function generateStaticParams() {
  // You can fetch all blog slugs here if needed for static generation
  return []
}
