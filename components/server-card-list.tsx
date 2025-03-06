import MessageBox from "./message-box"
import Paginate from "./paginate"
import ServerVideoCard from "./ServerVideoCard"
import doodstream from "@/lib/doodstream"
import ClientWrapper from "./ClientWrapper"
import { Suspense } from "react"

type ServerCardListProps = {
  page: number
  per_page: number
  fld_id: string | undefined
}

// Fallback component for loading state
function CardListFallback() {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 gap-1 md:grid-cols-5 md:gap-2 lg:grid-cols-6 lg:gap-3">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[16/9] rounded-t-md"></div>
              <div className="p-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

// Server component that fetches data
const ServerCardList = async ({ page, per_page, fld_id }: ServerCardListProps) => {
  const data = await doodstream.listFiles({ page, per_page, fld_id })

  if (!data.result.results) {
    return (
      <MessageBox title="No videos found" variant="info">
        <p className="text-center">This Channel doesn&apos;t have any videos yet.</p>
      </MessageBox>
    )
  }

  return (
    <Suspense fallback={<CardListFallback />}>
      <ClientWrapper>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 gap-1 md:grid-cols-5 md:gap-2 lg:grid-cols-6 lg:gap-3">
            {data.result.files.map((video: any) => {
              return <ServerVideoCard key={video.file_code} video={video}></ServerVideoCard>
            })}
          </div>
          <Paginate total={data.result.total_pages} current={page}></Paginate>
        </div>
      </ClientWrapper>
    </Suspense>
  )
}

export default ServerCardList

