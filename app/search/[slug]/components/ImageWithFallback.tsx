"use client"

import Image from "next/image"

const ImageWithFallback = ({
  src,
  alt,
  fallbackIcon: Icon,
  className = "",
  fallbackClassName = ""
}: {
  src: string | null
  alt: string
  fallbackIcon: any
  className?: string
  fallbackClassName?: string
}) => {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain ${className}`}
        sizes="100vw"
        loading="lazy"
      />
    )
  }
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-xs ${fallbackClassName}`}>
      <Icon className="w-12 h-12 text-gray-400" />
    </div>
  )
}

export default ImageWithFallback