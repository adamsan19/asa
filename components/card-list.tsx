import MessageBox from "./message-box"
import Paginate from "./paginate"
import VideoCard from "./video-card"
import doodstream from "@/lib/doodstream"

const CardList = async ({
  page,
  per_page,
  fld_id,
}: {
  page: number
  per_page: number
  fld_id: string | undefined
}) => {
  const data = await doodstream.listFiles({ page, per_page, fld_id })

  if (!data.result.results) {
    return (
      <MessageBox title="No videos found" variant="info">
        <p className="text-center">This Channel doesn&apos;t have any videos yet.</p>
      </MessageBox>
    )
  }

  return (
    <div className="flex flex-col">
      <ul className="list-none p-0">
        {data.result.files.map((video: any) => {
          return (
            <li key={video.file_code} className="mb-3">
              <VideoCard video={video}></VideoCard>
            </li>
          )
        })}
      </ul>
      <Paginate total={data.result.total_pages} current={page}></Paginate>
    </div>
  )
}

export default CardList

