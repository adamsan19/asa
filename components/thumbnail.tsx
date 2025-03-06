"use client" // Tandai komponen ini sebagai Client Component

import Image from "next/image"
import { useState } from "react"

const ImageLoader = ({ src, width, quality }: any) => {
  return `https://wsrv.nl/?url=${src}&w=320&q=${quality || 80}&fit=cover&output=webp`
}

const Thumbnail = ({
  single_img,
  splash_img,
  title,
  alt,
  className,
}: {
  single_img: string
  splash_img: string
  title: string
  alt?: string // Prop alt opsional
  className?: string // Prop className opsional
}) => {
  const [imageIndex, setImageIndex] = useState(0)
  const image = [single_img, splash_img, "https://iili.io/J5ahFSa.png"]

  const handleImageError = () => {
    if (imageIndex === image.length - 1) return
    setImageIndex(imageIndex + 1)
  }

  return (
    <Image
      className={
        className || "!w-full !h-[110px] md:!h-[150px] lg:!h-[180px] object-cover rounded-none md:rounded-t-md"
      }
      alt={alt || title}
      src={image[imageIndex] || "/placeholder.svg"}
      loader={ImageLoader}
      width={320}
      height={180}
      quality={100}
      onError={handleImageError}
      priority
    />
  )
}

export default Thumbnail

