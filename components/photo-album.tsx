"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Heart } from "lucide-react"
import { useEffect } from "react"

// Mock Wix SDK for demonstration purposes.
// In a real Wix Studio environment, the 'Wix' global object would be provided by the Wix platform.
declare global {
  interface Window {
    Wix?: {
      Activities: {
        Type: {
          ALBUM_SHARE: string
          ALBUM_FAN: string
          [key: string]: string // Allow other types if needed
        }
        postActivity: (
          activity: {
            type: string
            info: object
            details: {
              additionalInfoUrl: string | null
              summary: string
            }
            contactUpdate: object | null
          },
          onSuccess: (data: { activityId: string; contactId: string }) => void,
          onFailure?: (data: any) => void,
        ) => void
        getActivityById: (id: string, onSuccess: (data: any) => void, onFailure: (data: any) => void) => void
      }
    }
  }
}

// Initialize mock Wix object if not already present in the window.
if (typeof window !== "undefined" && !window.Wix) {
  window.Wix = {
    Activities: {
      Type: {
        ALBUM_SHARE: "music/album-share",
        ALBUM_FAN: "music/album-fan",
      },
      postActivity: (activity, onSuccess, onFailure) => {
        console.log("Mock Wix.Activities.postActivity called with:", activity)
        // Simulate success after a short delay
        setTimeout(() => {
          onSuccess({ activityId: `mock-activity-${Date.now()}`, contactId: `mock-contact-${Date.now()}` })
        }, 500)
      },
      getActivityById: (id, onSuccess, onFailure) => {
        console.log("Mock Wix.Activities.getActivityById called with ID:", id)
        // Simulate failure for demonstration purposes, as we don't have real data
        setTimeout(() => {
          onFailure("Activity not found in mock data.")
        }, 500)
      },
    },
  }
}

interface Album {
  id: string
  title: string
  artist: string
  imageUrl: string
  description: string
}

const albums: Album[] = [
  {
    id: "1",
    title: "Nature's Symphony",
    artist: "Green Lens",
    imageUrl: "/placeholder.svg?height=300&width=300",
    description: "A collection of breathtaking landscapes and serene natural moments.",
  },
  {
    id: "2",
    title: "Urban Echoes",
    artist: "Cityscape Captures",
    imageUrl: "/placeholder.svg?height=300&width=300",
    description: "Capturing the vibrant energy and hidden corners of metropolitan life.",
  },
  {
    id: "3",
    title: "Portraits of Life",
    artist: "Human Canvas",
    imageUrl: "/placeholder.svg?height=300&width=300",
    description: "Intimate and expressive portraits that tell unique stories.",
  },
  {
    id: "4",
    title: "Abstract Visions",
    artist: "Form & Color",
    imageUrl: "/placeholder.svg?height=300&width=300",
    description: "Exploring the interplay of shapes, colors, and light in abstract forms.",
  },
]

export default function PhotoAlbum() {
  const handleShareAlbum = (album: Album) => {
    if (window.Wix && window.Wix.Activities) {
      const activity = {
        type: window.Wix.Activities.Type.ALBUM_SHARE,
        info: {
          albumId: album.id,
          albumTitle: album.title,
        },
        details: {
          // Replace with your actual Wix App ID, Instance ID, and deep link
          additionalInfoUrl: `http://www.wix.com/my-account/app/your-app-id/your-instance-id/album/${album.id}`,
          summary: `Album "${album.title}" shared by a site visitor.`,
        },
        contactUpdate: {
          // Example contact update, replace with actual user data if available
          emails: [{ tag: "main", email: "visitor@example.com" }],
          name: { first: "Site", last: "Visitor" },
        },
      }

      window.Wix.Activities.postActivity(
        activity,
        (data) => {
          console.log(
            `Successfully posted ALBUM_SHARE activity for "${album.title}". Activity ID: ${data.activityId}, Contact ID: ${data.contactId}`,
          )
          alert(`Album "${album.title}" shared! Activity logged.`)
        },
        (error) => {
          console.error(`Failed to post ALBUM_SHARE activity for "${album.title}":`, error)
          alert(`Failed to share album "${album.title}". Check console for details.`)
        },
      )
    } else {
      console.warn("Wix SDK not available. Cannot post activity.")
      alert("Wix SDK not available. (Check console for mock output)")
    }
  }

  const handleFanAlbum = (album: Album) => {
    if (window.Wix && window.Wix.Activities) {
      const activity = {
        type: window.Wix.Activities.Type.ALBUM_FAN,
        info: {
          albumId: album.id,
          albumTitle: album.title,
        },
        details: {
          // Replace with your actual Wix App ID, Instance ID, and deep link
          additionalInfoUrl: `http://www.wix.com/my-account/app/your-app-id/your-instance-id/album/${album.id}`,
          summary: `Site visitor became a fan of album "${album.title}".`,
        },
        contactUpdate: {
          // Example contact update, replace with actual user data if available
          emails: [{ tag: "main", email: "fan@example.com" }],
          name: { first: "Album", last: "Fan" },
        },
      }

      window.Wix.Activities.postActivity(
        activity,
        (data) => {
          console.log(
            `Successfully posted ALBUM_FAN activity for "${album.title}". Activity ID: ${data.activityId}, Contact ID: ${data.contactId}`,
          )
          alert(`You are now a fan of "${album.title}"! Activity logged.`)
        },
        (error) => {
          console.error(`Failed to post ALBUM_FAN activity for "${album.title}":`, error)
          alert(`Failed to become a fan of album "${album.title}". Check console for details.`)
        },
      )
    } else {
      console.warn("Wix SDK not available. Cannot post activity.")
      alert("Wix SDK not available. (Check console for mock output)")
    }
  }

  // Example of using getActivityById (for demonstration, not directly tied to UI) [^1]
  useEffect(() => {
    if (window.Wix && window.Wix.Activities) {
      // This would typically be called with an actual activity ID from Wix
      // For this demo, we'll try to get a non-existent one to show the failure callback
      window.Wix.Activities.getActivityById(
        "non-existent-activity-id",
        (data) => console.log("getActivityById success:", data),
        (error) => console.error("getActivityById failure:", error),
      )
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-10">My Photo Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => (
          <Card key={album.id} className="flex flex-col">
            <CardContent className="p-0">
              <Image
                src={album.imageUrl || "/placeholder.svg"}
                alt={album.title}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardContent>
            <CardHeader className="flex-grow">
              <CardTitle>{album.title}</CardTitle>
              <CardDescription>{album.artist}</CardDescription>
              <p className="text-sm text-muted-foreground mt-2">{album.description}</p>
            </CardHeader>
            <CardFooter className="flex justify-between items-center p-4 border-t">
              <Button variant="outline" onClick={() => handleShareAlbum(album)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={() => handleFanAlbum(album)}>
                <Heart className="mr-2 h-4 w-4" />
                Fan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
