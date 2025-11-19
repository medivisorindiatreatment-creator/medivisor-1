// lib/ricos-parser.ts
export interface RicosContent {
  nodes: any[]
  metadata?: any
}

/**
 * Extracts plain text from Ricos content nodes
 */
export function extractTextFromRicos(nodes: any[]): string {
  if (!Array.isArray(nodes)) return ''
  
  let text = ''
  
  for (const node of nodes) {
    if (node.textData && node.textData.text) {
      text += node.textData.text + ' '
    }
    
    if (node.nodes && Array.isArray(node.nodes)) {
      text += extractTextFromRicos(node.nodes)
    }
  }
  
  return text.trim()
}
