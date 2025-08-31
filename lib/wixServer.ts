import { createClient, OAuthStrategy } from "@wix/sdk"
import { posts, categories } from "@wix/blog"
import { proGallery } from "@wix/pro-gallery"
import { items } from "@wix/data"

export const wixServerClient = createClient({
  auth: OAuthStrategy({
    clientId: process.env.WIX_CLIENT_ID!, // Server-side env var (no NEXT_PUBLIC_)
  }),
  modules: {
    posts,
    categories,
    proGallery,
    items,
  },
}) as any

export type WixServerClientType = typeof wixServerClient
