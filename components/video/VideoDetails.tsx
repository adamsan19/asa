import { CalendarIcon, CubeIcon, LapTimerIcon, RocketIcon, Share1Icon } from "@radix-ui/react-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { humanDuration, humanSize } from "@/lib/utils"
import ServerCopyButton from "@/components/ServerCopyButton"
import ServerLikeButton from "@/components/ServerLikeButton"
import DownloadButton from "@/components/download-button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { KeywordIcon } from "@/components/icons/KeywordIcon"
import ClientWrapper from "@/components/ClientWrapper"
import { Suspense } from "react"

type VideoDetailsProps = {
  file: {
    title: string
    filecode: string
    file_code?: string
    splash_img: string
    single_img: string
    length: number
    views: number
    uploaded: string
    size: number
    status?: string
    protected?: boolean
    public?: boolean
  }
}

// Fallback component for loading state
function VideoDetailsFallback() {
  return (
    <Card className="mx-2 mb-8 border-t-4 border-t-primary animate-pulse">
      <CardHeader className="pb-2">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
      </CardHeader>
      <CardContent>
        <div className="h-40 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  )
}

function VideoDetailsContent({ file }: VideoDetailsProps) {
  // Extract keywords from title
  const keywords = file.title
    .split(" ")
    .filter((word) => word.length > 3)
    .slice(0, 5)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))

  // Format date for better display
  const uploadDate = new Date(file.uploaded + ".000Z")
  const formattedDate = uploadDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedTime = uploadDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="mx-2 mb-8 border-t-4 border-t-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl md:text-3xl font-bold">{file.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{file.views.toLocaleString()} views</span>
          <span className="mx-2">•</span>
          <span>{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="flex gap-2 items-center font-medium">
                    <LapTimerIcon className="size-4 md:size-5 text-primary"></LapTimerIcon>
                    Duration
                  </TableCell>
                  <TableCell>{humanDuration(file.length)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex gap-2 items-center font-medium">
                    <RocketIcon className="size-4 md:size-5 text-primary"></RocketIcon>
                    Views
                  </TableCell>
                  <TableCell>{file.views.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex gap-2 items-center font-medium">
                    <CubeIcon className="size-4 md:size-5 text-primary"></CubeIcon>
                    Size
                  </TableCell>
                  <TableCell>{humanSize(file.size)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex gap-2 items-center font-medium">
                    <CalendarIcon className="size-4 md:size-5 text-primary"></CalendarIcon>
                    Uploaded
                  </TableCell>
                  <TableCell>
                    {formattedDate} at {formattedTime}
                  </TableCell>
                </TableRow>
                {file.status && (
                  <TableRow>
                    <TableCell className="flex gap-2 items-center font-medium">Status</TableCell>
                    <TableCell>
                      <Badge variant={file.status === "active" ? "success" : "secondary"}>{file.status}</Badge>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="flex gap-2 items-center font-medium">
                    <KeywordIcon className="size-4 md:size-5 text-primary" />
                    Keywords
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Actions</h3>
            <div className="grid gap-3">
              <DownloadButton fileCode={file.filecode || file.file_code || ""} />

              <ServerCopyButton className="w-full bg-secondary">
                <Share1Icon className="size-4 me-1 mb-0.5"></Share1Icon>
                Share
              </ServerCopyButton>

              <ServerLikeButton className="w-full" useButton={true} file={file} />
            </div>

            <Separator className="my-4" />

            <div className="bg-secondary/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">About this video</h4>
              <p className="text-sm text-muted-foreground">
                This video was uploaded on {formattedDate}. It has been viewed {file.views.toLocaleString()} times since
                then.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VideoDetails({ file }: VideoDetailsProps) {
  return (
    <Suspense fallback={<VideoDetailsFallback />}>
      <ClientWrapper>
        <VideoDetailsContent file={file} />
      </ClientWrapper>
    </Suspense>
  )
}

