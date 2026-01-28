"use client"

import { useState, useEffect, useRef, ReactNode } from "react"

const InfiniteHoverScroll = ({
  children,
  className = "",
  speed = 40
}: {
  children: ReactNode
  className?: string
  speed?: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const animationRef = useRef<number | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const container = containerRef.current
        const content = contentRef.current
        const containerW = container.clientWidth
        const contentW = content.scrollWidth
        setContainerWidth(containerW)
        setContentWidth(contentW)
        setIsOverflowing(contentW > containerW)
      }
    }

    checkOverflow()
    const resizeObserver = new ResizeObserver(checkOverflow)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [children])

  useEffect(() => {
    if (!isOverflowing || !isHovering) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      setScrollPosition(0)
      return
    }

    let lastTime: number

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime
      const deltaTime = currentTime - lastTime
      lastTime = currentTime
      const scrollAmount = (speed * deltaTime) / 1000

      setScrollPosition(prev => {
        let newPos = prev + scrollAmount
        if (newPos >= contentWidth) {
          newPos = 0
        }
        return newPos
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isOverflowing, isHovering, contentWidth, speed])

  useEffect(() => {
    const handleHover = () => {
      if (containerRef.current) {
        const handleMouseEnter = () => setIsHovering(true)
        const handleMouseLeave = () => setIsHovering(false)
        const container = containerRef.current
        container.addEventListener('mouseenter', handleMouseEnter)
        container.addEventListener('mouseleave', handleMouseLeave)

        return () => {
          container.removeEventListener('mouseenter', handleMouseEnter)
          container.removeEventListener('mouseleave', handleMouseLeave)
        }
      }
    }

    handleHover()
  }, [])

  useEffect(() => {
    if (!isHovering) {
      setScrollPosition(0)
    }
  }, [isHovering])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className} transition-all duration-300 ${
        isOverflowing && isHovering ? 'cursor-pointer' : ''
      }`}
      title={isOverflowing ? "Hover to scroll" : undefined}
    >
      <div
        ref={contentRef}
        className={`inline-flex whitespace-nowrap transition-transform duration-300 ease-out ${
          isOverflowing && isHovering ? 'will-change-transform' : ''
        }`}
        style={{
          transform: isOverflowing && isHovering
            ? `translateX(-${scrollPosition}px)`
            : 'translateX(0)',
          transition: isHovering ? 'none' : 'transform 300ms ease-out'
        }}
      >
        {children}
      </div>

      {isOverflowing && isHovering && (
        <div
          className="inline-flex whitespace-nowrap absolute left-full ml-8"
          style={{
            transform: `translateX(-${scrollPosition}px)`
          }}
          aria-hidden="true"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default InfiniteHoverScroll