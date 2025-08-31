// lib/ricos-utils.ts

interface RicosNode {
  type: string;
  nodes?: RicosNode[];
  textData?: {
    text: string;
    decorations: any[];
  };
  // Add other Ricos node properties as needed for parsing
}

/**
 * Extracts plain text from a Ricos JSON document.
 * This function traverses the Ricos document's nodes and concatenates text from 'TEXT' nodes.
 * It's a simplified parser and may not handle all complex Ricos features (e.g., embedded media, tables)
 * but is sufficient for basic text extraction from paragraphs and lists.
 * @param ricosDocument The Ricos JSON document object.
 * @returns A string containing the extracted plain text.
 */
export function extractPlainTextFromRicos(ricosDocument: Record<string, any> | null): string {
  if (!ricosDocument || !ricosDocument.nodes || !Array.isArray(ricosDocument.nodes)) {
    return '';
  }

  let extractedText = '';

  function traverseNodes(nodes: RicosNode[], indent = 0) {
    nodes.forEach(node => {
      if (node.type === 'PARAGRAPH' && node.nodes) {
        node.nodes.forEach(subNode => {
          if (subNode.type === 'TEXT' && subNode.textData?.text) {
            extractedText += subNode.textData.text;
          }
        });
        extractedText += '\n'; // Add newline after each paragraph
      } else if (node.type === 'LIST_ITEM' && node.nodes) {
        extractedText += '  '.repeat(indent) + '• '; // Add bullet point for list items
        traverseNodes(node.nodes, indent + 1);
      } else if (node.nodes) {
        traverseNodes(node.nodes, indent);
      }
    });
  }

  traverseNodes(ricosDocument.nodes);

  return extractedText.trim();
}
