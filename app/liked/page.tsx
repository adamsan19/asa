"use client"
import MessageBox from "@/components/message-box"
import VideoCard from "@/components/video-card"

function getLikedVideos() {
  "use client"
  const likedVideos = Object.entries(localStorage).filter((key) => key[0].startsWith("liked_"))
  const sortedLikedVideos = likedVideos.sort((a, b) => {
    const aFile = JSON.parse(a[1] || "{}")
    const bFile = JSON.parse(b[1] || "{}")

    return bFile.liked_on - aFile.liked_on
  })

  return sortedLikedVideos.map((video) => JSON.parse(video[1]))
}

export default function Liked() {
  const likedVideos = getLikedVideos()

  if (likedVideos.length === 0) {
    return (
      <MessageBox title="No liked videos found" variant="info">
        <p>Like videos to see them here.</p>
      </MessageBox>
    )
  }
  return (
    <div className="grid grid-cols-3 gap-1 md:grid-cols-5 md:gap-2 lg:grid-cols-6 lg:gap-3">
      {likedVideos.map((file) => (
        <VideoCard key={file.file_code} video={file} />
      ))}
    </div>
  )
}

