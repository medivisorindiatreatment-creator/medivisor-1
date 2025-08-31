"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { wixClient } from "@/lib/wixClient"
import { getBestCoverImage, getWixImageUrl } from "@/lib/wixMedia"
import type { HappyMoment } from "@/types/happy-moment"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Tag, Images, Heart, Share2, Download, ZoomIn, X, ChevronLeft, ChevronRight, Star, Clock, User, Sparkles } from 'lucide-react'
import { OptimizedImage } from "@/components/optimized-image"
import { RicosContentRenderer } from "@/components/ricos-content-renderer"
import BlogAside from "@/components/blogAside"
import BlogCard from "@/components/blogCard"
const COLLECTION_ID = "photo-album"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function ModernMomentPage({ params }: PageProps) {
  const [moment, setMoment] = useState<HappyMoment | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const fetchMoment = async () => {
      try {
        const { id } = await params
        const response = await wixClient.items.query(COLLECTION_ID).eq("_id", id).find({ consistentRead: true })

        if (!response || !response.items || response.items.length === 0) {
          notFound()
          return
        }

        const item = response.items[0]
        let mediaGalleryParsed: HappyMoment["mediagallery"] = []

        if (item.mediagallery) {
          try {
            const parsedGallery =
              typeof item.mediagallery === "string" ? JSON.parse(item.mediagallery) : item.mediagallery
            mediaGalleryParsed = parsedGallery.filter(
              (media: any) => media.type === "image" || (media.src && media.src.startsWith("wix:image://")),
            )
          } catch (e) {
            console.error("Failed to parse Media Gallery for item:", item._id, e)
            mediaGalleryParsed = []
          }
        }

        const processedMoment = {
          _id: item._id,
          ...item,
          order: item.order?.toString(),
          mediagallery: mediaGalleryParsed,
          coverMedia: item.coverMedia || undefined,
          excerpt: item.excerpt || item.shortDescription || "No description available.",
          content: item.content || item.detail || "",
          firstPublishedDate: item.firstPublishedDate || item.date || item._createdDate,
        }

        setMoment(processedMoment)
        setLikeCount(Math.floor(Math.random() * 50) + 10) // Mock like count
      } catch (error) {
        console.error("Error fetching HappyMoment:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchMoment()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded-lg w-32"></div>
            <div className="h-96 bg-slate-200 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-20 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!moment) {
    notFound()
  }

  const coverImageUrl = getBestCoverImage(moment)
  const galleryImages = Array.isArray(moment.mediagallery)
    ? moment.mediagallery.filter((media) => media.src && media.src.startsWith("wix:image://"))
    : []

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedImageIndex(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return

    if (direction === "prev") {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : galleryImages.length - 1)
    } else {
      setSelectedImageIndex(selectedImageIndex < galleryImages.length - 1 ? selectedImageIndex + 1 : 0)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: moment.title_fld || "Happy Moment",
          text: moment.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/photo-albums">
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-100 rounded-xl px-4 py-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Gallery</span>
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-colors ${isLiked ? "text-rose-600 bg-rose-50 hover:bg-rose-100" : "hover:bg-slate-100"
                  }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="font-medium">{likeCount}</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={handleShare} className="rounded-xl px-4 py-2">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          {coverImageUrl && (
            <div className="relative h-[60vh] md:h-[80vh] overflow-hidden rounded-xs shadow-xs mb-8 group">
              <img
                src={coverImageUrl}
                alt={moment.title_fld || "Happy moment"}

                className="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-105"


              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Info Card */}
              <div className="absolute bottom-4 inline-flex w-auto left-4 right-4">
                <Card className="bg-white/95 backdrop-blur-xs border-0 shadow-xs rounded-xs overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h1 className="text-2xl  font-bold text-gray-700 mb-3 leading-tight">
                          {moment.title_fld || "Untitled title_fld"}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                          {moment.firstPublishedDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">
                                {new Date(moment.firstPublishedDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          {moment.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">{moment.location}</span>
                            </div>
                          )}
                          {galleryImages.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Images className="h-4 w-4" />
                              <span className="font-medium">
                                {galleryImages.length} photo{galleryImages.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* {moment.shortDescription && (
                          <p className="text-slate-700 leading-relaxed text-lg">{moment.shortDescription}</p>
                        )} */}
                      </div>

                      {moment.category && (
                        <Badge className="bg-gradient-to-r from-rose-1000 to-pink-500 text-white border-0 rounded-full px-4 py-2 font-medium shadow-lg">
                          <Sparkles className="h-3 w-3 mr-1.5" />
                          {moment.category}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Story Content */}
            {moment.content && moment.content !== moment.shortDescription && (
              <Card className="bg-white/80  border-0 shadow-xs rounded-xs overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#E22026] rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Patient Story</h2>
                      <p className="text-slate-600">A journey of hope and healing</p>
                    </div>
                  </div>

                  <div className="prose prose-lg prose-slate max-w-none">
                    <RicosContentRenderer content={moment.content} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photo Gallery */}
            {galleryImages.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xs rounded-xs overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xs flex items-center justify-center shadow-xs">
                        <Images className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Photo Gallery</h2>
                        <p className="text-slate-600">{galleryImages.length} beautiful moments captured</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((media, index) => {
                      const imageUrl = getWixImageUrl(media.src)
                      if (!imageUrl) return null

                      return (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-xs bg-slate-100 group cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                          onClick={() => openLightbox(index)}
                        >
                          <OptimizedImage
                            src={imageUrl}
                            alt={media.alt || media.title || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            fallbackSrc="/placeholder.svg?height=300&width=300&text=Beautiful Memory"
                          />

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                <ZoomIn className="h-5 w-5 text-slate-700" />
                              </div>
                            </div>

                            {(media.title || media.description) && (
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                {media.title && <p className="font-semibold text-sm mb-1">{media.title}</p>}
                                {media.description && <p className="text-xs opacity-90">{media.description}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10 col-span-3">
            {/* Quick Info Section */}
            <div className="sticky top-0">
              <Card className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xs rounded-xs overflow-hidden">
                <BlogAside  />
              </Card>

              {/* Tags Section */}
              {(moment.tags || moment.hashtags || moment.category) && (
                <Card className="bg-white/90 backdrop-blur-md border border-slate-100 shadow-xs rounded-xs overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-5">
                      <Tag className="w-5 h-5 text-blue-500" />
                      Tags
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {moment.category && (
                        <Badge className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border border-rose-200 rounded-full px-3 py-1 text-xs font-medium">
                          {moment.category}
                        </Badge>
                      )}
                      {moment.tags &&
                        moment.tags.split(",").map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border border-slate-200 text-slate-600 rounded-full px-3 py-1 text-xs font-medium"
                          >
                            {tag.trim()}
                          </Badge>
                        ))}
                      {moment.hashtags &&
                        moment.hashtags.split(" ").map((hashtag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border border-slate-200 text-slate-600 rounded-full px-3 py-1 text-xs font-medium"
                          >
                            {hashtag.trim()}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Share Section */}
              <Card className="bg-[#E22026] mt-6 text-white border-0 shadow-xs rounded-xs overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Share This Story</h2>
                  <p className="text-sm text-pink-100 mb-6 leading-relaxed">
                    Help inspire others by sharing this beautiful journey of hope and healing.
                  </p>

                  <div className="space-y-3">
                    <Button
                      onClick={handleShare}
                      className="w-full bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl font-medium"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Story
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-rose-600 rounded-xl font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save Photos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              onClick={closeLightbox}
              variant="ghost"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10 rounded-full p-3"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {galleryImages.length > 1 && (
              <>
                <Button
                  onClick={() => navigateImage("prev")}
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 rounded-full p-3"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  onClick={() => navigateImage("next")}
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 rounded-full p-3"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image */}
            <div className="relative max-w-7xl max-h-full">
              <OptimizedImage
                src={getWixImageUrl(galleryImages[selectedImageIndex].src) || ""}
                alt={
                  galleryImages[selectedImageIndex].alt ||
                  galleryImages[selectedImageIndex].title ||
                  `Gallery image ${selectedImageIndex + 1}`
                }
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
                fallbackSrc="/placeholder.svg?height=800&width=1200&text=Image"
              />
            </div>

            {/* Image Info */}
            {(galleryImages[selectedImageIndex].title || galleryImages[selectedImageIndex].description) && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-2xl p-4 text-white">
                {galleryImages[selectedImageIndex].title && (
                  <h4 className="font-semibold mb-1">{galleryImages[selectedImageIndex].title}</h4>
                )}
                {galleryImages[selectedImageIndex].description && (
                  <p className="text-sm opacity-90">{galleryImages[selectedImageIndex].description}</p>
                )}
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
