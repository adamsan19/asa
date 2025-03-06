import dynamic from "next/dynamic"
import { Suspense } from "react"
import type { ReactNode } from "react"

// Import the client component with dynamic import
const CopyButtonClient = dynamic(() => import("./copy-button"), { ssr: false })

export default function ServerCopyButton({
  className,
  text,
  children,
}: {
  className?: string
  text?: string
  children?: ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div
          className={`inline-flex h-10 items-center justify-center rounded-md ${className || "bg-primary"} px-4 py-2`}
        >
          {children || "Copy"}
        </div>
      }
    >
      <CopyButtonClient className={className} text={text}>
        {children}
      </CopyButtonClient>
    </Suspense>
  )
}

