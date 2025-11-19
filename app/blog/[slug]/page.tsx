import BlogPostClientPage from '@/components/BlogPostClientPage'

interface PageProps {
  params: Promise<{ slug: string }>
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
