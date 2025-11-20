// Ricos content parser for Wix rich content
export interface RicosNode {
  type: string
  nodes?: RicosNode[]
  textData?: {
    text: string
    decorations?: Array<{
      type: string
      [key: string]: any
    }>
  }
  paragraphData?: {
    textStyle?: {
      textAlignment?: string
    }
  }
  headingData?: {
    level: number
  }
  imageData?: {
    containerData?: {
      width?: {
        size: number
      }
      height?: {
        size: number
      }
      alignment?: string
    }
    image?: {
      src?: {
        id: string
        originalFileName: string
      }
    }
    altText?: string
    caption?: string
  }
  videoData?: {
    containerData?: {
      width?: {
        size: number
      }
      height?: {
        size: number
      }
      alignment?: string
    }
    video?: {
      src?: {
        url: string
      }
    }
    thumbnail?: {
      src?: {
        id: string
      }
    }
  }
  linkData?: {
    link?: {
      url: string
      target?: string
    }
  }
  listData?: {
    indentation: number
    type: string
  }
  blockquoteData?: any
  codeBlockData?: {
    textStyle?: {
      language?: string
    }
  }
  dividerData?: any
  buttonData?: {
    text: string
    link?: {
      url: string
      target?: string
    }
    design?: {
      backgroundColor?: string
      borderColor?: string
      textColor?: string
    }
  }
  embedData?: {
    src: string
    type?: string
  }
  galleryData?: {
    items?: Array<{
      image?: {
        src?: {
          id: string
        }
      }
      title?: string
      description?: string
    }>
  }
  audioData?: {
    audio?: {
      src?: {
        url: string
      }
    }
    name?: string
    authorName?: string
    html?: string
  }
  fileData?: {
    src?: {
      url: string
    }
    name?: string
    type?: string
    size?: number
  }
  anchorData?: {
    anchor: string
  }
  mentionData?: {
    mention?: {
      name: string
      slug?: string
    }
  }
  colorData?: {
    foreground?: string
    background?: string
  }
  fontSizeData?: {
    value: number
    unit: string
  }
}

export interface RicosContent {
  nodes: RicosNode[]
  metadata?: {
    version: string
    createdTimestamp: string
    updatedTimestamp: string
  }
}

// Helper function to extract text content from Ricos nodes
export function extractTextFromRicos(nodes: RicosNode[]): string {
  let text = ""

  for (const node of nodes) {
    if (node.textData?.text) {
      text += node.textData.text
    }
    if (node.nodes) {
      text += extractTextFromRicos(node.nodes)
    }
    if (node.type === "PARAGRAPH") {
      text += "\n"
    }
  }

  return text
}

// Helper function to get Wix media URL
export function getWixMediaUrl(mediaId: string, width?: number, height?: number): string {
  const baseUrl = `https://static.wixstatic.com/media/${mediaId}`
  if (width && height) {
    return `${baseUrl}/v1/fit/w_${width},h_${height}/file.jpg`
  }
  return baseUrl
}
