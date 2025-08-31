/**
 * Utility functions for handling Wix rich content
 */

/**
 * Strips HTML tags and extracts plain text from rich content
 * @param richContent - The rich content string that may contain HTML tags
 * @param maxLength - Optional maximum length for the extracted text
 * @returns Clean plain text
 */
export function stripHtmlTags(richContent: string | null | undefined, maxLength?: number): string {
  if (!richContent) return '';
  
  // Remove HTML tags using regex
  let cleanText = richContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Replace HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  // Truncate if maxLength is specified
  if (maxLength && cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength).trim();
    // Don't cut off in the middle of a word
    const lastSpaceIndex = cleanText.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.8) { // Only if we're not cutting too much
      cleanText = cleanText.substring(0, lastSpaceIndex);
    }
    cleanText += '...';
  }

  return cleanText;
}

/**
 * Extracts and cleans excerpt from rich content
 * @param content - The rich content
 * @param maxLength - Maximum length for excerpt (default: 150)
 * @returns Clean excerpt
 */
export function extractExcerpt(content: string | null | undefined, maxLength: number = 150): string {
  const cleanText = stripHtmlTags(content);
  if (cleanText.length <= maxLength) return cleanText;
  
  const truncated = cleanText.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  // If we find a sentence ending within reasonable bounds, use it
  if (lastSentenceEnd > maxLength * 0.6) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  // Otherwise, cut at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Processes Wix rich text content for display
 * @param richContent - Raw rich content from Wix
 * @returns Processed content object with clean text and excerpt
 */
export function processWixRichContent(richContent: any) {
  if (!richContent) {
    return {
      plainText: '',
      excerpt: '',
      hasContent: false
    };
  }

  // Handle different Wix rich content formats
  let contentString = '';
  
  if (typeof richContent === 'string') {
    contentString = richContent;
  } else if (richContent.blocks && Array.isArray(richContent.blocks)) {
    // Handle Wix draft-js format
    contentString = richContent.blocks
      .map((block: any) => block.text || '')
      .join(' ');
  } else if (richContent.content && Array.isArray(richContent.content)) {
    // Handle another Wix format
    contentString = richContent.content
      .map((item: any) => {
        if (item.type === 'text') return item.text || '';
        if (item.type === 'paragraph' && item.content) {
          return item.content.map((subItem: any) => subItem.text || '').join('');
        }
        return '';
      })
      .join(' ');
  } else if (typeof richContent === 'object' && richContent.html) {
    contentString = richContent.html;
  }

  const plainText = stripHtmlTags(contentString);
  const excerpt = extractExcerpt(contentString, 150);
  
  return {
    plainText,
    excerpt,
    hasContent: plainText.length > 0
  };
}