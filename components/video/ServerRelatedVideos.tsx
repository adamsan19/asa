import { Suspense } from "react"
import MessageBox from "@/components/message-box"
import ServerVideoCard from "@/components/ServerVideoCard"
import ClientWrapper from "@/components/ClientWrapper"
import ClientRelatedVideos from "./ClientRelatedVideos"

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

function RelatedVideosFallback({ videos, query }: RelatedVideosProps) {
  const displayVideos = videos.slice(0, 50)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Related Videos</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 xl:grid-cols-4">
        {displayVideos.length > 0
          ? displayVideos.map((video) => <ServerVideoCard key={video.file_code} video={video} />)
          : Array(4)
              .fill(0)
              .map((_, i) => <div key={i} className="h-[200px] bg-gray-200 animate-pulse rounded-md"></div>)}
      </div>
    </div>
  )
}

export default function ServerRelatedVideos({ videos, query }: RelatedVideosProps) {
  if (!videos || videos.length === 0) {
    return (
      <MessageBox title="No related videos found" variant="info">
        <p className="text-center">No videos related to this content were found.</p>
      </MessageBox>
    )
  }

  // Provide a server-rendered component that will be enhanced on the client
  return (
    <Suspense fallback={<RelatedVideosFallback videos={videos} query={query} />}>
      <ClientWrapper>
        <ClientRelatedVideos videos={videos} query={query} />
      </ClientWrapper>
    </Suspense>
  )
}

