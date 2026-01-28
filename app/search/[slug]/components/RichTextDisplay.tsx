"use client"

import { useMemo } from "react"

const RichTextDisplay = ({ htmlContent, className = "" }: { htmlContent: string; className?: string }) => {
  const transformListItems = (html: string): string => {
    const iconSvgHtml =
      `<span style="display: inline-flex; align-items: flex-start; margin-right: 0.75rem; flex-shrink: 0; min-width: 1.25rem; height: 1.25rem;">` +
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" style="color:#74BF44; width: 1.25rem; height: 1.25rem;">` +
      `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>` +
      `</svg></span>`

    const liContentWrapperStart = `<div style="display: flex; align-items: flex-start;">${iconSvgHtml}<span style="flex: 1;">`
    const liContentWrapperEnd = `</span></div>`

    let transformedHtml = html.replace(
        /(<ul>.*?)(<li([^>]*)>)(.*?)(<\/li>)/gs,
        (match, ulStart, liOpenTag, liAttrs, liContent, liCloseTag) => {
            const trimmedContent = liContent.trim()
            if (trimmedContent.length > 0 && !trimmedContent.includes(iconSvgHtml)) {
                return ulStart + liOpenTag + liContentWrapperStart + trimmedContent + liContentWrapperEnd + liCloseTag
            }
            return match
        }
    )

    transformedHtml = transformedHtml.replace(/<li([^>]*)>(.*?)<\/li>/gs, (match, liAttrs, liContent) => {
        const trimmedContent = liContent.trim()
        if (trimmedContent.length > 0 && !trimmedContent.includes(iconSvgHtml)) {
            return `<li${liAttrs}>${liContentWrapperStart}${trimmedContent}${liContentWrapperEnd}</li>`
        }
        return match
    })

    return transformedHtml
  }

  const modifiedHtml = useMemo(() => {
    let cleanHtml = htmlContent
    cleanHtml = transformListItems(cleanHtml)
    return cleanHtml
  }, [htmlContent])

  const typographyClasses = `
    prose max-w-none text-gray-700 leading-relaxed
    prose-h1:text-3xl prose-h1:font-extrabold prose-h1:mt-8 prose-h1:mb-4 prose-h1:text-gray-900
    prose-h2:text-2xl prose-h2:font-extrabold prose-h2:mt-7 prose-h2:mb-4 prose-h2:text-gray-900
    prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800
    prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-5 prose-h4:mb-2 prose-h4:text-gray-800
    prose-p prose-p:font-sans prose-p:mt-3 prose-p:mb-3 prose-p:text-base prose-p:text-gray-700
    prose-li:font-sans prose-li:mt-3 prose-li:mb-3 prose-li:text-base prose-li:text-gray-700
    prose-li:list-none prose-li:ml-0 prose-li:pl-0
    prose-ul:mt-4 prose-ul:mb-4 prose-ul:list-none prose-ul:ml-0 prose-ul:pl-0
    prose-ol:mt-3 prose-ol:mb-3 prose-ol:list-decimal
    prose-a:text-blue-600 prose-a:font-medium prose-a:underline hover:prose-a:text-blue-800
    prose-strong:font-bold prose-strong:text-gray-900
  `

  return (
    <div
      className={`${typographyClasses} ${className}`}
      dangerouslySetInnerHTML={{ __html: modifiedHtml }}
    />
  )
}

export default RichTextDisplay