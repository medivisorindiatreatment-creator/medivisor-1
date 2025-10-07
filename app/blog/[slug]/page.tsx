import BlogPost from "@/components/BlogPostClientPage";
import { Metadata } from "next";
import { wixClient } from "@/lib/wixClient";
import { media } from '@wix/sdk';

interface Params {
  params: { slug: string };
}

// Function to get Wix Image URL for meta tags
function getWixImageUrl(wixUrl: string | undefined): string | null {
  if (!wixUrl || !wixUrl.startsWith('wix:image://')) {
    return null;
  }
  try {
    const { url } = media.getImageUrl(wixUrl);
    return url;
  } catch (error) {
    console.error('Error getting Wix image URL:', error);
    return null;
  }
}

// Function to generate optimized share image URL
function getOptimizedShareImage(wixUrl: string | undefined): string {
  const imageUrl = getWixImageUrl(wixUrl);
  
  if (imageUrl) {
    return imageUrl;
  }
  
  // Fallback to default share image
  return "https://medivisorindiatreatment.com/default-share-image.jpg";
}

// Function to generate meta description from content
function generateMetaDescription(content: any, excerpt?: string): string {
  if (excerpt && excerpt.trim().length > 0) {
    return excerpt.trim();
  }

  let text = '';
  if (typeof content === 'string') {
    text = content.replace(/<[^>]*>/g, '').trim();
  } else if (content?.nodes) {
    // You might need to import and use extractTextFromRicos here if needed
    text = 'Informative medical blog post from Medivisor India.';
  }

  // Limit to 160 characters for SEO
  if (text.length > 160) {
    return text.substring(0, 157) + '...';
  }

  return text || 'Read this informative blog post about medical treatment, patient journeys, and healthcare tips in India.';
}

// ✅ Helper function to fetch blog by slug from Wix
async function fetchBlogBySlug(slug: string) {
  try {
    if (!wixClient.posts) return null;

    let blog = null;
    
    // Try getPostBySlug first
    if (typeof wixClient.posts.getPostBySlug === "function") {
      const response = await wixClient.posts.getPostBySlug(slug, {
        fieldsets: [
          "CONTENT_TEXT",
          "URL",
          "RICH_CONTENT",
          "TAGS",
          "SEO",
          "EXCERPT",
          "TITLE",
          "COVER_MEDIA",
          "PUBLISHED_DATE",
          "CONTENT",
          "MEDIA",
          "FIRST_PUBLISHED_DATE",
          "LAST_PUBLISHED_DATE",
        ],
      });
      if (response.post) blog = response.post;
    }

    // Fallback to queryPosts if getPostBySlug fails
    if (!blog && typeof wixClient.posts.queryPosts === "function") {
      const response = await wixClient.posts.queryPosts()
        .eq('slug', slug)
        .find();
      
      if (response.items && response.items.length > 0) {
        blog = response.items[0];
      }
    }

    return blog;
  } catch (err) {
    console.error("Error fetching blog:", err);
    return null;
  }
}

// ✅ Dynamic Metadata for Blog Post
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const blog = await fetchBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | Medivisor India",
      description: "The requested blog post doesn't exist.",
      robots: "noindex, nofollow",
    };
  }

  const title = blog.title || "Medivisor India Blog";
  const description = generateMetaDescription(blog.richContent || blog.contentText || blog.content, blog.excerpt);
  const imageUrl = getOptimizedShareImage(blog.coverMedia?.image || blog.media?.wixMedia?.image);
  const url = `https://medivisorindiatreatment.com/blog/${blog.slug}/`;
  const keywords = (blog.tags || []).join(", ") || "medical treatment, healthcare, patient stories, Medivisor India";
  const publishedTime = blog.firstPublishedDate || blog.lastPublishedDate;
  const modifiedTime = blog.lastPublishedDate || blog.firstPublishedDate;

  return {
    title: `${title} | Medivisor India`,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Medivisor India`,
      description,
      url,
      siteName: "Medivisor India Treatment",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: ["Medivisor India"],
      tags: blog.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Medivisor India`,
      description,
      images: [imageUrl],
      site: "@MedivisorIndia",
      creator: "@MedivisorIndia",
    },
    authors: [{ name: "Medivisor India" }],
    publisher: "Medivisor India",
    robots: "index, follow, max-image-preview:large",
    metadataBase: new URL("https://medivisorindiatreatment.com"),
    
    // Additional SEO meta tags
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": title,
      "og:image:type": "image/jpeg",
      "twitter:image:alt": title,
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:author": "Medivisor India",
      ...(blog.tags && blog.tags.length > 0 && {
        "article:tag": blog.tags.join(", "),
      }),
    },
  };
}

// ✅ Generate static params for better performance
export async function generateStaticParams() {
  try {
    if (!wixClient.posts) return [];

    let posts = [];
    
    if (typeof wixClient.posts.listPosts === "function") {
      const response = await wixClient.posts.listPosts({
        paging: { limit: 100 },
      });
      posts = response.posts || [];
    } else if (typeof wixClient.posts.queryPosts === "function") {
      const response = await wixClient.posts.queryPosts()
        .limit(100)
        .find();
      posts = response.items || [];
    }

    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// ✅ Page Component
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPost slug={params.slug} />;
}