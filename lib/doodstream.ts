import { DEFAULT_PER_PAGE } from "./constants"
import { settingsManager } from "./settings"

type DoodstreamProps = {
  baseUrl: string
  key: string
}

class Doodstream {
  baseUrl: string
  key: string
  upstream: string | undefined

  constructor({ baseUrl, key }: DoodstreamProps) {
    if (!baseUrl) throw new Error("Doodstream Base URL not set")
    if (!key) throw new Error("Doodstream Key not set")

    this.baseUrl = baseUrl
    this.key = key
  }

  serializeQueryParams(params: { [key: string]: string }) {
    return new URLSearchParams(params).toString()
  }

  async fetch(cmd: string, params: { [key: string]: string }, cacheKey: string) {
    const settings = settingsManager.getSettings()

    // Check cache first if caching is enabled
    if (settings.cacheConfig) {
      const cached = settingsManager.getCachedData(cacheKey)
      if (cached) return cached
    }

    // Build URL based on the command
    let url: string
    switch (cmd) {
      case "/search":
        url = `https://v0-aban.vercel.app/api/search?${this.serializeQueryParams(params)}`
        break
      case "/info":
        url = `https://v0-aban.vercel.app/api/info?${this.serializeQueryParams(params)}`
        break
      case "/list":
        url = `https://v0-aban.vercel.app/api/list?${this.serializeQueryParams(params)}`
        break
      case "/folder/list":
        url = `https://doodapi.com/api/folder/list?key=${this.key}&${this.serializeQueryParams(params)}`
        break
      default:
        throw new Error("Invalid command")
    }

    const response = await fetch(url)
    const data = await response.json()

    // Cache the response if caching is enabled
    if (settings.cacheConfig) {
      settingsManager.setCachedData(cacheKey, data)
    }

    return data
  }

  async listFiles({
    page = 1,
    per_page = DEFAULT_PER_PAGE,
    fld_id = "",
  }: {
    page?: number
    per_page?: number
    fld_id?: string
  }) {
    if (per_page && per_page > 200) throw new Error("per_page cannot be greater than 200")

    const data = await this.fetch(
      "/list",
      {
        page: page.toString(),
        per_page: per_page.toString(),
        fld_id: fld_id.toString(),
      },
      `fileList:${fld_id}:${page}:${per_page}`,
    )
    return data
  }

  async getFile({ file_code }: { file_code: string }) {
    const data = await this.fetch("/info", { file_code }, `fileInfo:${file_code}`)
    return data
  }

  async search({
    query,
    sort = "relevance",
    page = 1,
    per_page = 50,
  }: {
    query: string
    sort?: string
    page?: number
    per_page?: number
  }) {
    // Normalize the search query: replace hyphens with spaces
    const normalizedQuery = query.replace(/-/g, " ")

    const data = await this.fetch(
      "/search",
      {
        q: normalizedQuery, // Use the normalized query
        sort: sort,
        page: page.toString(), // Add page parameter
        per_page: per_page.toString(), // Add per_page parameter
      },
      `search:${normalizedQuery}:${sort}:${page}:${per_page}`,
    )

    if (data.result && Array.isArray(data.result)) {
      // Filter results to ensure unique lengths
      const uniqueLengths = new Set<number>()
      data.result = data.result.filter((video: any) => {
        if (!uniqueLengths.has(video.length)) {
          uniqueLengths.add(video.length)
          return true
        }
        return false
      })

      // Sort results based on the selected option
      if (sort === "views") {
        data.result.sort((a: any, b: any) => b.views - a.views)
      } else if (sort === "uploaded") {
        data.result.sort((a: any, b: any) => {
          const dateA = new Date(a.uploaded + ".000Z").getTime()
          const dateB = new Date(b.uploaded + ".000Z").getTime()
          return dateB - dateA
        })
      }

      // Filter results to include only those that match the normalized query
      data.result = data.result.filter((video: any) => {
        const title = video.title.toLowerCase()
        return title.includes(normalizedQuery.toLowerCase())
      })
    }

    return data
  }

  async listFolders({ fld_id = "" }: { fld_id?: string }) {
    const data = await this.fetch(
      "/folder/list",
      {
        only_folders: "1",
        fld_id,
      },
      `folderList:${fld_id}`,
    )
    return data
  }

  async getFolder({ fld_id }: { fld_id: string }) {
    const data = await this.listFolders({ fld_id: "" })
    const folder = data.result.folders.find((f: any) => f.fld_id === fld_id)
    return {
      ...data,
      folder,
    }
  }
}

// Contoh penggunaan:
const doodstream = new Doodstream({
  baseUrl: "https://doodapi.com", // Ganti dengan base URL yang sesuai
  key: "112623ifbcbltzajwjrpjx", // Ganti dengan API key yang sesuai
})

export default doodstream

