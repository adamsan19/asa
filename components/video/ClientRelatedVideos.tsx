"use client"

import ServerVideoCard from "@/components/ServerVideoCard"
import MessageBox from "@/components/message-box"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"

type RelatedVideosProps = {
  videos: any[]
  query: string
}

// Fungsi untuk memformat query
const executeSearch = (query: string) => {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return ""

  // Replace spaces with hyphens and convert to lowercase
  const formattedQuery = trimmedQuery
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase() // Convert to lowercase

  // Encode the query to ensure it's URL-safe
  return encodeURIComponent(formattedQuery)
}

export default function ClientRelatedVideos({ videos, query }: RelatedVideosProps) {
  // Format query menggunakan fungsi executeSearch
  const formattedQuery = executeSearch(query)

  if (!videos || videos.length === 0) {
    return (
      <MessageBox title="No related videos found" variant="info">
        <p className="text-center">No videos related to this content were found.</p>
      </MessageBox>
    )
  }

  // Get the most viewed videos
  const mostViewed = [...videos].sort((a, b) => b.views - a.views).slice(0, 50)

  // Get the most recent videos
  const mostRecent = [...videos]
    .sort((a, b) => {
      const dateA = new Date(a.uploaded + ".000Z").getTime()
      const dateB = new Date(b.uploaded + ".000Z").getTime()
      return dateB - dateA
    })
    .slice(0, 50)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Related Videos</h2>
        <Link href={`/f/${formattedQuery}`}>
          <Button variant="ghost" size="sm" className="text-primary">
            See all
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="popular">Most Viewed</TabsTrigger>
          <TabsTrigger value="recent">Most Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-3 gap-1 md:grid-cols-5 md:gap-2 lg:grid-cols-6 lg:gap-3">
            {videos.slice(0, 12).map((video) => (
              <ServerVideoCard key={video.file_code} video={video} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <div className="grid grid-cols-3 gap-1 md:grid-cols-5 md:gap-2 lg:grid-cols-6 lg:gap-3">
            {mostViewed.slice(0, 12).map((video) => (
              <ServerVideoCard key={video.file_code} video={video} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="grid grid-cols-3 gap-1 md:grid-cols-5 md:gap-2 lg:grid-cols-6 lg:gap-3">
            {mostRecent.slice(0, 12).map((video) => (
              <ServerVideoCard key={video.file_code} video={video} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

