import type { Metadata } from "next"
import { humanDuration, humanSize } from "@/lib/utils"
import MessageBox from "@/components/message-box"
import { SITENAME } from "@/lib/constants"
import doodstream from "@/lib/doodstream"
import JsonLd from "@/components/seo/json-ld"
import { generateVideoSchema, generateWebPageSchema, generateBreadcrumbSchema } from "@/components/seo/schemas"
import { headers } from "next/headers"
import { formatMetadata } from "@/lib/metadata"
import { settingsManager } from "@/lib/settings"
import VideoDetails from "@/components/video/VideoDetails"
import ServerVideoPlayer from "@/components/ServerVideoPlayer"
import ServerRelatedVideos from "@/components/video/ServerRelatedVideos"

export const dynamic = "force-dynamic"
export const revalidate = 0 // Revalidate every 60 seconds

type PageProps = {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await doodstream.getFile({ file_code: params.id })
  if (data.status !== 200) {
    return {
      title: data.msg,
      description: "Something went wrong. Please try again later.",
    }
  }

  const file = data.result[0]
  return formatMetadata("video", {
    videoTitle: file.title,
    duration: humanDuration(file.length),
    views: file.views.toString(),
    size: humanSize(file.size),
  })
}

export default async function Video({ params }: PageProps) {
  const data = await doodstream.getFile({ file_code: params.id })
  const headersList = headers()
  const domain = headersList.get("host") || ""
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const fullUrl = `${protocol}://${domain}/e/${params.id}`

  if (data.status !== 200) {
    return (
      <MessageBox title={data.msg} countdown={30} variant="error">
        <p className="text-center">Something went wrong. Please try again later.</p>
      </MessageBox>
    )
  }

  const file = data.result[0]
  const query = file.title ? file.title.split(" ")[0] : ""

  // Pre-fetch related videos data on the server
  const settings = settingsManager.getSettings()
  const relatedVideosData = await doodstream.search({
    query,
    sort: settings.defaultSort,
  })

  const schemas = [
    generateVideoSchema(file, fullUrl),
    generateWebPageSchema(`${file.title} - ${SITENAME}`, `Watch ${file.title} on ${SITENAME}`, fullUrl),
    generateBreadcrumbSchema([
      { name: "Home", url: `${protocol}://${domain}` },
      { name: "Videos", url: `${protocol}://${domain}/videos` },
      { name: file.title, url: fullUrl },
    ]),
  ]

  // Ensure we have a valid array of videos for related content
  const relatedVideos =
    relatedVideosData.result && Array.isArray(relatedVideosData.result) ? relatedVideosData.result : []

  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <div className="grid col-span-full gap-6 md:gap-8 md:mx-10">
        {/* Video Player */}
        <ServerVideoPlayer file={file} />

        {/* Video Details */}
        <VideoDetails file={file} />

        {/* Related Videos */}
        <ServerRelatedVideos videos={relatedVideos} query={query} />
      </div>
    </>
  )
}

