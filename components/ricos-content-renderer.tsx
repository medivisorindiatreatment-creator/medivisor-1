"use client"

import type React from "react"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import type { JSX } from "react/jsx-runtime"

interface RicosContentRendererProps {
  content: string
}

export function RicosContentRenderer({ content }: RicosContentRendererProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Try to parse as Ricos document
  const tryParseRicos = (content: string) => {
    try {
      const parsed = JSON.parse(content)
      if (parsed.nodes && Array.isArray(parsed.nodes)) {
        return parsed
      }
    } catch (e) {
      // Not a valid Ricos document
    }
    return null
  }

  const renderRicosNode = (node: any, index: number): React.ReactNode => {
    switch (node.type) {
      case "PARAGRAPH":
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {node.nodes?.map((textNode: any, textIndex: number) => renderTextNode(textNode, textIndex))}
          </p>
        )

      case "HEADING":
        const HeadingTag = `h${node.headingData?.level || 2}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag key={index} className="font-bold mb-4 text-slate-900">
            {node.nodes?.map((textNode: any, textIndex: number) => renderTextNode(textNode, textIndex))}
          </HeadingTag>
        )

      case "BLOCKQUOTE":
        return (
          <blockquote key={index} className="border-l-4 border-rose-300 pl-6 italic mb-4 text-slate-700">
            {node.nodes?.map((childNode: any, childIndex: number) => renderRicosNode(childNode, childIndex))}
          </blockquote>
        )

      case "BULLETED_LIST":
        return (
          <ul key={index} className="  mb-0 space-y-0">
            {node.nodes?.map((listItem: any, listIndex: number) => (
              <li key={listIndex} className="leading-relaxed flex gap-x-2">
                <CheckCircle className="text-[#75c045]"/>
                {listItem.nodes?.map((childNode: any, childIndex: number) => renderRicosNode(childNode, childIndex))}
              </li>
            ))}
          </ul>
        )

      case "ORDERED_LIST":
        return (
          <ol key={index} className="list-decimal list-inside mb-4 space-y-2">
            {node.nodes?.map((listItem: any, listIndex: number) => (
              <li key={listIndex} className="leading-relaxed">
                {listItem.nodes?.map((childNode: any, childIndex: number) => renderRicosNode(childNode, childIndex))}
              </li>
            ))}
          </ol>
        )

      case "DIVIDER":
        return <hr key={index} className="my-8 border-slate-200" />

      default:
        return null
    }
  }

  const renderTextNode = (textNode: any, index: number): React.ReactNode => {
    if (textNode.type !== "TEXT") return null

    const content = textNode.textData?.text || ""
    let className = ""
    const style: React.CSSProperties = {}

    // Apply decorations
    textNode.textData?.decorations?.forEach((decoration: any) => {
      switch (decoration.type) {
        case "BOLD":
          className += " font-bold"
          break
        case "ITALIC":
          className += " italic"
          break
        case "UNDERLINE":
          className += " underline"
          break
        case "COLOR":
          style.color = decoration.colorData?.foreground
          break
      }
    })

    return (
      <span key={index} className={className} style={style}>
        {content}
      </span>
    )
  }

  const ricosDocument = tryParseRicos(content)

  if (ricosDocument) {
    // Render as Ricos document
    return (
      <div className="ricos-content">
        {ricosDocument.nodes.map((node: any, index: number) => renderRicosNode(node, index))}
      </div>
    )
  }

  // Render as plain text with basic formatting
  const paragraphs = content.split("\n\n").filter((p) => p.trim())
  const shouldTruncate = paragraphs.length > 3 || content.length > 500

  return (
    <div className="space-y-4">
      {paragraphs.slice(0, isExpanded ? undefined : 3).map((paragraph, index) => (
        <p key={index} className="leading-relaxed text-slate-700">
          {paragraph.trim()}
        </p>
      ))}

      {shouldTruncate && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors"
        >
          Read more...
        </button>
      )}

      {isExpanded && shouldTruncate && (
        <button
          onClick={() => setIsExpanded(false)}
          className="text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  )
}
