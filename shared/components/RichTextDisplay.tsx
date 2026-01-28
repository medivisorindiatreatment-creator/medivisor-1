"use client"

import { useMemo } from "react"

interface RichTextDisplayProps {
  htmlContent: string
  className?: string
}

export const RichTextDisplay = ({ htmlContent, className = "" }: RichTextDisplayProps) => {

  // MODIFIED: Function to replace <li> tags in <ul> with the CheckCircle icon HTML
  const transformListItems = (html: string): string => {
    // 1. Define the HTML for the Lucide CheckCircle icon with the required styling
    // This is the SVG markup for the CheckCircle icon, stylized with inline CSS
    // to match the requested w-5 h-5 text-[#74BF44] flex-shrink-0.
    const iconSvgHtml =
      `<span style="display: inline-flex; align-items: flex-start; margin-right: 3px; flex-shrink: 0; min-width: 1.25rem; height: 1.25rem;">` +
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" style="color:#74BF44; width: 1rem; margin-top: 5px; height: 1rem;">` +
      `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>` +
      `</svg></span>`;

    // 2. Define the new structure for the <li> content wrapper
    // We use a flex div inside the <li> to correctly position the icon next to the text.
    // The "min-w" and "height" styles on the span ensure the icon reserves space even if text wraps.
    const liContentWrapperStart = `<div style="display: flex; align-items: flex-start;">${iconSvgHtml}<span style="flex: 1;">`;
    const liContentWrapperEnd = `</span></div>`;

    // 3. Regex to replace content inside <li>...</li> tags.
    // Matches an opening <li> tag (with optional attributes), captures content (non-greedily), and the closing </li> tag.
    // The `s` flag allows `.` to match newlines.

    // Replace the content inside <li> tags (targeting only `<ul>` items for safety)
    let transformedHtml = html.replace(
        /(<ul>.*?)(<li([^>]*)>)(.*?)(<\/li>)/gs,
        (match, ulStart, liOpenTag, liAttrs, liContent, liCloseTag) => {
            // Trim whitespace from content
            const trimmedContent = liContent.trim();

            // Check if content is NOT empty and NOT already wrapped
            // NOTE: Checking for a substring of the icon HTML is a quick way to avoid double-wrapping,
            // though not foolproof for all malformed HTML.
            if (trimmedContent.length > 0 && !trimmedContent.includes(iconSvgHtml)) {
                // Reconstruct the <li> tag, but wrap content with the new structure
                // We keep ulStart and liOpenTag as is, then insert the new content structure, then liCloseTag
                return ulStart + liOpenTag + liContentWrapperStart + trimmedContent + liContentWrapperEnd + liCloseTag;
            }

            // If content is empty or already wrapped, return the original match (ulStart + li...).
            return match;
        }
    );

    // Fallback: If it's a simple list not contained in a UL block, apply the transformation
    // to any remaining top-level <li> tags. This is less ideal but necessary if content structure is flat.
    transformedHtml = transformedHtml.replace(/<li([^>]*)>(.*?)<\/li>/gs, (match, liAttrs, liContent) => {
        const trimmedContent = liContent.trim();
        if (trimmedContent.length > 0 && !trimmedContent.includes(iconSvgHtml)) {
            return `<li${liAttrs}>${liContentWrapperStart}${trimmedContent}${liContentWrapperEnd}</li>`;
        }
        return match;
    });

    return transformedHtml;
  }

  const modifiedHtml = useMemo(() => {
    let cleanHtml = htmlContent;

    // Apply the list item transformation
    cleanHtml = transformListItems(cleanHtml);

    // IMPORTANT SECURITY NOTE:
    // In a real application, you must use a library like DOMPurify
    // here to sanitize the HTML before using dangerouslySetInnerHTML.
    // Example: return DOMPurify.sanitize(cleanHtml);

    return cleanHtml;
  }, [htmlContent]);


  // MODIFIED: Updated Tailwind classes to REMOVE default list styling and padding
  const typographyClasses = `
    prose max-w-none text-gray-700 leading-relaxed

    /* Headings: Playfair (Serif) */
    prose-h1:text-3xl prose-h1:font-extrabold prose-h1:mt-8 prose-h1:mb-4 prose-h1:text-gray-900
    prose-h2:text-2xl prose-h2:font-extrabold prose-h2:mt-7 prose-h2:mb-4 prose-h2:text-gray-900
    prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800
    prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-5 prose-h4:mb-2 prose-h4:text-gray-800

    /* Paragraphs and Lists */
    prose-p prose-p:font-sans prose-p:mt-3 prose-p:mb-3 prose-p:text-base prose-p:text-gray-700

    /* MODIFIED: Custom list styling to REMOVE default bullets/indentation */
    prose-li:font-sans prose-li:mt-3 prose-li:mb-3 prose-li:text-base prose-li:text-gray-700
    prose-li:list-none prose-li:ml-0 prose-li:pl-0 /* CRITICAL: REMOVE DEFAULT LIST STYLES */

    prose-ul:mt-4 prose-ul:mb-4 prose-ul:list-none prose-ul:ml-0 prose-ul:pl-0 /* Ensure UL is clean */
    prose-ol:mt-3 prose-ol:mb-3 prose-ol:list-decimal // Keep numbered lists standard

    /* Links, emphasis, etc. */
    prose-a:text-blue-600 prose-a:font-medium prose-a:underline hover:prose-a:text-blue-800
    prose-strong:font-bold prose-strong:text-gray-900
  `;

  return (
    <div
      className={`${typographyClasses} ${className}`}
      // This is necessary to render the HTML structure from Wix CMS
      dangerouslySetInnerHTML={{ __html: modifiedHtml }}
    />
  );
};