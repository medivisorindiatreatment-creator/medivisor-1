// lib/wixServerClient.ts
import { createClient, OAuthStrategy } from "@wix/sdk"
import { posts, categories } from "@wix/blog"
import { proGallery } from "@wix/pro-gallery"
import { items } from "@wix/data"

export const wixServerClient = createClient({
  auth: OAuthStrategy({
    clientId: process.env.WIX_CLIENT_ID!, // from Wix OAuth app
    // optionally add clientSecret if needed for server-to-server
    // clientSecret: process.env.WIX_CLIENT_SECRET!,
  }),
  modules: {
    posts,
    categories,
    proGallery,
    items,
  },
}) as any

export type WixServerClientType = typeof wixServerClient
