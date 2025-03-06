import MessageBox from "../message-box"
import ServerVideoCard from "../ServerVideoCard"
import doodstream from "@/lib/doodstream"
import { settingsManager } from "@/lib/settings"

const ServerSearchCardList = async ({
  query,
  banner,
  sort,
}: {
  query: string
  banner?: boolean
  sort?: string
}) => {
  const settings = settingsManager.getSettings()
  const data = await doodstream.search({ query, sort: sort || settings.defaultSort })

  if (!data.result || !Array.isArray(data.result)) {
    return (
      <MessageBox title="No results found" variant="info">
        <p className="text-center">Try a shorter search term.</p>
      </MessageBox>
    )
  }

  return (
    <div className="flex flex-col">
      {banner && (
        <div className="my-6 mb-8 text-center">
          <h1 className="text-xs md:text-sm font-bold text-gray-600 uppercase">Search Results</h1>
          <h1 className="text-sm md:text-xl uppercase">
            Found {data.result.length} videos for &apos;{query}
            &apos;
          </h1>
        </div>
      )}
      {data.result.length ? (
        <div className="grid grid-cols-3 gap-1 md:grid-cols-5 md:gap-2 lg:grid-cols-6 lg:gap-3">
          {data.result.map((video: any) => {
            return <ServerVideoCard key={video.file_code} video={video}></ServerVideoCard>
          })}
        </div>
      ) : (
        <MessageBox title="No results found" variant="info">
          <p className="text-center">Try a shorter search term.</p>
        </MessageBox>
      )}
    </div>
  )
}

export default ServerSearchCardList

