import { NextResponse } from "next/server"

export async function GET() {
  try {
    // --- Replace this section with your actual Wix API integration ---
    // Example: Fetching from a public API (JSONPlaceholder)
    const EXTERNAL_API_URL = "https://jsonplaceholder.typicode.com/photos?_limit=8" // Example public API
    // const WIX_API_KEY = process.env.WIX_API_KEY; // Get your Wix API key from environment variables
    // const WIX_ALBUMS_ENDPOINT = "YOUR_WIX_ALBUMS_API_ENDPOINT"; // Replace with your actual Wix API endpoint

    const response = await fetch(EXTERNAL_API_URL, {
      // headers: {
      //   'Authorization': `Bearer ${WIX_API_KEY}`, // Example: If Wix uses Bearer token
      //   'Content-Type': 'application/json',
      // },
      cache: "no-store", // Ensure fresh data
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch from external API: ${response.status} - ${errorText}`)
      return new NextResponse(JSON.stringify({ message: "Failed to fetch albums from external source" }), {
        status: response.status,
      })
    }

    const externalData = await response.json()

    // --- Transform the external API data to match your Album interface ---
    // This is crucial as external APIs will have their own data structure.
    const albums = externalData.map((item: any) => ({
      id: String(item.id), // Ensure ID is a string
      name: item.title.substring(0, 30) + (item.title.length > 30 ? "..." : ""), // Use title as name, truncate if long
      images: [item.thumbnailUrl || item.url], // Use thumbnail or full image URL
    }))
    // --- End of Wix API integration section ---

    return NextResponse.json(albums)
  } catch (error) {
    console.error("Error in API route:", error)
    return new NextResponse(JSON.stringify({ message: "Internal server error" }), { status: 500 })
  }
}
