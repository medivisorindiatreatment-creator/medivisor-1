"use client"

import { useState, useEffect, useRef } from "react"
import classNames from "classnames"

/**
 * UPDATED: MarqueeHeading
 * Implements an infinite scroll using a CSS keyframe animation.
 * The scroll only activates when isHovered is true and text overflows.
 */
const MarqueeHeading = ({
  children,
  className = "",
  isHovered = false,
}: {
  children: React.ReactNode
  className?: string
  isHovered?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [scrollWidth, setScrollWidth] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const contentWidth = containerRef.current.scrollWidth
      if (contentWidth > containerWidth) {
        setShouldScroll(true)
        setScrollWidth(contentWidth)
      } else {
        setShouldScroll(false)
      }
    }
  }, [children])

  // Calculate duration based on text length to keep speed consistent
  const duration = Math.max(scrollWidth / 30, 5)

  return (
    <div
      ref={containerRef}
      className={classNames(
        "relative overflow-hidden whitespace-nowrap select-none",
        className
      )}
      style={{
        maskImage: shouldScroll && isHovered ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none',
        WebkitMaskImage: shouldScroll && isHovered ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none',
      }}
    >
      <style jsx>{`
        @keyframes marqueeInfinite {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-scroll {
          display: inline-flex;
          animation: marqueeInfinite ${duration}s linear infinite;
        }
      `}</style>

      {/* Ghost element to maintain height and show static text when not hovered */}
      <div className={classNames("transition-opacity duration-300", isHovered && shouldScroll ? "opacity-0" : "opacity-100")}>
        {children}
      </div>

      {/* Actual scrolling layer */}
      {shouldScroll && (
        <div
          className={classNames(
            "absolute top-0 left-0 h-full flex items-center pointer-events-none transition-opacity duration-300",
            isHovered ? "opacity-100 animate-scroll" : "opacity-0"
          )}
        >
          <span className="pr-12">{children}</span>
          <span className="pr-12">{children}</span>
        </div>
      )}
    </div>
  )
}

export default MarqueeHeading