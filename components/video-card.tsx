import { Card, CardContent } from "./ui/card"
import { humanDuration, naturalTime } from "@/lib/utils"
import { Badge } from "./ui/badge"
import LikeButton from "./like-button"
import Link from "next/link"
import Thumbnail from "./thumbnail"

const VideoCard = ({ video }: any) => {
  return (
    <Card className="border-0 rounded-none md:border-[1px] md:rounded-md transform transition duration-200 md:hover:scale-[101%] md:hover:shadow-lg">
      <div className="relative">
        <Link href={`/e/${video.file_code}`} aria-label={`Watch ${video.title}`}>
          {/* Container Thumbnail dengan Rasio 4:5 */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Thumbnail
              single_img={video.single_img}
              splash_img={video.splash_img}
              title={video.title}
              alt={video.title} // Pastikan `alt` digunakan dengan benar untuk gambar
              className="w-full h-full object-cover"
            />
            {/* Ikon Play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                fill="#ffffff80"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 408.221 408.221"
                className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 hover:fill-white transition-colors duration-200"
                aria-hidden="true" // Tambahkan aria-hidden untuk ikon dekoratif
              >
                <path d="M204.11,0C91.388,0,0,91.388,0,204.111c0,112.725,91.388,204.11,204.11,204.11c112.729,0,204.11-91.385,204.11-204.11 C408.221,91.388,316.839,0,204.11,0z M286.547,229.971l-126.368,72.471c-17.003,9.75-30.781,1.763-30.781-17.834V140.012 c0-19.602,13.777-27.575,30.781-17.827l126.368,72.466C303.551,204.403,303.551,220.217,286.547,229.971z" />
              </svg>
            </div>
          </div>
        </Link>
        <Badge className="absolute bottom-1 right-1 px-1 bg-black bg-opacity-65">{humanDuration(video.length)}</Badge>
      </div>
      <CardContent className="p-1.5">
        <Link
          href={`/e/${video.file_code}`}
          className="line-clamp-2 text-sm md:text-md font-semibold hover:text-primary focus:text-primary"
        >
          {video.title}
        </Link>
        <div className="flex flex-row justify-between text-[0.6rem] md:text-xs my-1 uppercase text-gray-500">
          <span>{video.views} views</span>
          <div className="inline-flex">
            {naturalTime(video.uploaded + ".000Z")}
            <LikeButton file={video} className="ml-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VideoCard

