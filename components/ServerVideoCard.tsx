import { Card, CardContent } from "./ui/card"
import { humanDuration, naturalTime } from "@/lib/utils"
import { Badge } from "./ui/badge"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Import client components with dynamic import
const Thumbnail = dynamic(() => import("./thumbnail"), { ssr: false })
const ServerLikeButton = dynamic(() => import("./ServerLikeButton"), { ssr: false })

const ServerVideoCard = ({ video }: any) => {
  return (
    <Card className="border-0 rounded-none md:border-[1px] md:rounded-md transform transition duration-200 md:hover:scale-[101%] md:hover:shadow-lg">
      <div className="relative">
        <Link href={`/e/${video.file_code}`} aria-label={`Watch ${video.title}`}>
          {/* Container Thumbnail dengan Rasio 16:9 untuk tampilan lebih modern */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <Suspense
              fallback={<div className="w-full h-full bg-gray-200 animate-pulse rounded-none md:rounded-t-md"></div>}
            >
              <Thumbnail
                single_img={video.single_img}
                splash_img={video.splash_img}
                title={video.title}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </Suspense>
            {/* Ikon Play dengan ukuran responsif */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[15%] h-[15%] min-w-[24px] min-h-[24px] max-w-[48px] max-h-[48px] flex items-center justify-center">
                <svg
                  fill="#ffffff80" // Warna ikon play dengan opacity
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 408.221 408.221"
                  className="w-full h-full hover:fill-white transition-colors duration-200" // Efek hover
                >
                  <path d="M204.11,0C91.388,0,0,91.388,0,204.111c0,112.725,91.388,204.11,204.11,204.11c112.729,0,204.11-91.385,204.11-204.11 C408.221,91.388,316.839,0,204.11,0z M286.547,229.971l-126.368,72.471c-17.003,9.75-30.781,1.763-30.781-17.834V140.012 c0-19.602,13.777-27.575,30.781-17.827l126.368,72.466C303.551,204.403,303.551,220.217,286.547,229.971z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
        <Badge className="absolute bottom-1 right-1 px-1 bg-black bg-opacity-65">{humanDuration(video.length)}</Badge>
      </div>
      <CardContent className="p-1.5">
        <Link
          href={`/e/${video.file_code}`}
          className="line-clamp-2 text-sm md:text-md font-semibold hover:text-primary focus:text-primary"
          aria-label={`Watch ${video.title}`}
        >
          {video.title}
        </Link>
        <div className="flex flex-row justify-between text-[0.6rem] md:text-xs my-1 uppercase text-gray-500">
          <span>{video.views} views</span>
          <div className="inline-flex">
            {naturalTime(video.uploaded + ".000Z")}
            <Suspense fallback={<div className="ml-2 w-4 h-4"></div>}>
              <ServerLikeButton file={video} className="ml-2" />
            </Suspense>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServerVideoCard

