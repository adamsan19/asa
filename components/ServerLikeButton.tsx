import dynamic from "next/dynamic"
import { Suspense } from "react"

// Import the client component with dynamic import
const LikeButtonClient = dynamic(() => import("./like-button"), { ssr: false })

export default function ServerLikeButton({
  className,
  useButton,
  file,
}: {
  className?: string
  useButton?: boolean
  file: any
}) {
  return (
    <Suspense
      fallback={
        <div className={className || ""}>
          {useButton ? (
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2">
              <span className="size-4 mr-1 mb-0.5"></span>
              Like
            </div>
          ) : (
            <div className="size-3.5 mb-0.5"></div>
          )}
        </div>
      }
    >
      <LikeButtonClient className={className} useButton={useButton} file={file} />
    </Suspense>
  )
}

