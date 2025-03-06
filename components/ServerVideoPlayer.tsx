import { Suspense } from "react"
import ClientWrapper from "./ClientWrapper"
import VideoPlayer from "./VideoPlayer"

type VideoPlayerProps = {
  file: {
    title: string
    filecode: string
    splash_img: string
    length: number
    views: number
    uploaded: string
    single_img: string
  }
}

export default function ServerVideoPlayer({ file }: VideoPlayerProps) {
  return (
    <Suspense
      fallback={
        <div
          className="w-full h-[100vh] bg-black bg-no-repeat bg-center bg-contain flex items-center justify-center"
          style={{ backgroundImage: `url('${file.splash_img}')` }}
        >
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-24 w-24"></div>
          </div>
        </div>
      }
    >
      <ClientWrapper>
        <VideoPlayer file={file} />
      </ClientWrapper>
    </Suspense>
  )
}

