import BlogPost from "@/components/BlogPostClientPage"
import { Metadata } from "next"
import { wixClient } from "@/lib/wixClient"
import { media } from '@wix/sdk'

interface Params {
  params: { slug: string }
}

// Function to get Wix Image URL for meta tags with proper error handling
function getWixImageUrl(wixUrl: string | undefined): string | null {
  if (!wixUrl) return null
  
  try {
    // Handle both wix:image:// and direct URLs
    if (wixUrl.startsWith('wix:image://')) {
      const { url } = media.getImageUrl(wixUrl)
      return url
    } else if (wixUrl.startsWith('http')) {
      // If it's already a direct URL, return as is
      return wixUrl
    }
    return null
  } catch (error) {
    console.error('Error getting Wix image URL:', error)
    return null
  }
}

// Function to get optimized Wix Image URL for social sharing
function getOptimizedWixImageUrl(wixUrl: string | undefined, width: number = 1200, height: number = 630): string | null {
  if (!wixUrl) return null
  
  try {
    if (wixUrl.startsWith('wix:image://')) {
      const { url } = media.getImageUrl(wixUrl)
      return url
    } else if (wixUrl.startsWith('http')) {
      // For direct URLs, try to optimize if it's a Wix static URL
      if (wixUrl.includes('static.wixstatic.com')) {
        // Wix static URLs can be optimized by modifying the parameters
        // Use Wix's image transformation API
        return wixUrl.replace(/\/v1\/(.*)$/, `/v1/fill/w_${width},h_${height},al_c,q_85,usm_0.66_1.00_0.01,blur_0/$1`)
      }
      return wixUrl
    }
    return null
  } catch (error) {
    console.error('Error getting optimized Wix image URL:', error)
    return null
  }
}

// Function to validate and fix image URL for social media
function validateAndFixImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null
  
  try {
    // Check if URL is valid
    new URL(imageUrl)
    
    // Fix common Wix URL issues for social media
    if (imageUrl.includes('static.wixstatic.com')) {
      // Ensure the URL uses HTTPS
      const secureUrl = imageUrl.replace('http://', 'https://')
      
      // Remove any double encoding or weird characters
      const cleanUrl = secureUrl.replace(/%25/g, '%')
      
      // Ensure it has proper file extension
      if (!cleanUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
        // If no extension, assume jpg and add parameters for optimization
        return `${cleanUrl}~mv2.jpg`
      }
      
      return cleanUrl
    }
    
    return imageUrl
  } catch (error) {
    console.error('Invalid image URL for social media:', imageUrl, error)
    return null
  }
}

// Function to generate optimized share image URL - with validation
function getOptimizedShareImage(wixUrl: string | undefined): string | null {
  if (!wixUrl) return null
  
  // Try to get optimized image for social sharing first
  const optimizedImageUrl = getOptimizedWixImageUrl(wixUrl, 1200, 630)
  const imageUrl = optimizedImageUrl || getWixImageUrl(wixUrl)
  
  // Validate and fix the URL for social media platforms
  return validateAndFixImageUrl(imageUrl)
}

// Function to extract text from content for meta description
function extractTextForMeta(content: any): string {
  if (!content) return ''
  
  if (typeof content === 'string') {
    return content.replace(/<[^>]*>/g, '').trim()
  }
  
  // For Ricos content, return a generic description since we can't parse it here
  if (content.nodes) {
    return 'Informative medical blog post from Medivisor India.'
  }
  
  return ''
}

// Function to generate meta description from content
function generateMetaDescription(content: any, excerpt?: string): string {
  if (excerpt && excerpt.trim().length > 0) {
    return excerpt.trim()
  }

  const text = extractTextForMeta(content)

  // Limit to 160 characters for SEO
  if (text.length > 160) {
    return text.substring(0, 157) + '...'
  }

  return text || 'Read this informative blog post about medical treatment, patient journeys, and healthcare tips in India.'
}

// Helper function to fetch blog by slug from Wix
async function fetchBlogBySlug(slug: string) {
  try {
    if (!wixClient.posts) return null

    let blog = null
    
    // Try getPostBySlug first
    if (typeof wixClient.posts.getPostBySlug === "function") {
      const response = await wixClient.posts.getPostBySlug(slug, {
        fieldsets: [
          "CONTENT_TEXT",
          "URL",
          "RICH_CONTENT",
          "SEO",
        ],
      })
      if (response.post) blog = response.post
    }

    // Fallback to queryPosts if getPostBySlug fails
    if (!blog && typeof wixClient.posts.queryPosts === "function") {
      const response = await wixClient.posts.queryPosts()
        .eq('slug', slug)
        .find()
      
      if (response.items && response.items.length > 0) {
        blog = response.items[0]
      }
    }

    return blog
  } catch (err) {
    console.error("Error fetching blog:", err)
    return null
  }
}

// Dynamic Metadata for Blog Post
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const blog = await fetchBlogBySlug(params.slug)

  if (!blog) {
    return {
      title: "Blog Post Not Found | Medivisor India",
      description: "The requested blog post doesn't exist.",
      robots: "noindex, nofollow",
    }
  }

  const title = blog.title || "Medivisor India Blog"
  const description = generateMetaDescription(blog.richContent || blog.contentText || blog.content, blog.excerpt)
  
  // Get the featured image URL - prioritize coverMedia first, then media
  const featuredImageUrl = getOptimizedShareImage(blog.coverMedia?.image || blog.media?.wixMedia?.image)
  
  const url = `https://medivisorindiatreatment.com/blog/${params.slug}`
  
  // Your organization logo for structured data (only used in structured data, not OG image)
  const logoUrl = "https://medivisorindiatreatment.com/logo.png"

  // Article specific meta tags
  const articleMeta: any = {}
  if (blog.firstPublishedDate) {
    articleMeta.publishedTime = blog.firstPublishedDate
  }
  if (blog.lastPublishedDate) {
    articleMeta.modifiedTime = blog.lastPublishedDate
  }
  if (Array.isArray(blog.tags) && blog.tags.length > 0) {
    articleMeta.tags = blog.tags
  }

  // Prepare images array for Open Graph - only include if valid
  const ogImages = []
  if (featuredImageUrl) {
    ogImages.push({
      url: featuredImageUrl,

      alt: title,
   
    })
  }

  return {
    title: `${title} | Medivisor India`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Medivisor India Treatment",
      images: ogImages,
      locale: "en_US",
      type: "article",
      ...articleMeta,
      authors: ["Medivisor India"],
    },
    twitter: {
      card: featuredImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: featuredImageUrl ? [featuredImageUrl] : [],
      site: "@medivisorindia",
      creator: "@medivisorindia",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Additional meta tags for better SEO
    keywords: blog.tags?.join(', ') || "medical treatment, healthcare, India, patient journey",
    authors: [{ name: "Medivisor India" }],
    publisher: "Medivisor India",
    category: "healthcare",
    ...articleMeta,
  }
}

// Generate Static Params for SSG
export async function generateStaticParams() {
  try {
    if (!wixClient.posts) return []

    let posts: any[] = []
    
    // Try queryPosts first
    if (typeof wixClient.posts.queryPosts === "function") {
      const response = await wixClient.posts.queryPosts()
        .limit(50)
        .find()
      posts = response.items || []
    } 
    // Fallback to listPosts
    else if (typeof wixClient.posts.listPosts === "function") {
      const response = await wixClient.posts.listPosts({
        paging: { limit: 50 },
      })
      posts = response.posts || []
    }

    return posts.map((post: any) => ({
      slug: post.slug,
    }))
  } catch (err) {
    console.error("Error generating static params:", err)
    return []
  }
}

// Blog Post Page Component
export default function BlogPostPage({ params }: Params) {
  return <BlogPost slug={params.slug} />
}