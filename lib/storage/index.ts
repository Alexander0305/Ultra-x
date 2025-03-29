import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { MediaType } from "@prisma/client"
import sharp from "sharp"
import { createFFmpeg } from "@ffmpeg/ffmpeg"

// Base storage directory
const STORAGE_DIR = path.join(process.cwd(), "storage")

// Ensure storage directories exist
const ensureDirectories = () => {
  const directories = [
    path.join(STORAGE_DIR, "photos"),
    path.join(STORAGE_DIR, "videos"),
    path.join(STORAGE_DIR, "stories"),
    path.join(STORAGE_DIR, "audio"),
    path.join(STORAGE_DIR, "documents"),
    path.join(STORAGE_DIR, "thumbnails"),
  ]

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

// Initialize storage
export const initStorage = () => {
  ensureDirectories()
}

// Get directory path based on media type
const getDirectoryPath = (mediaType: MediaType): string => {
  switch (mediaType) {
    case "IMAGE":
      return path.join(STORAGE_DIR, "photos")
    case "VIDEO":
      return path.join(STORAGE_DIR, "videos")
    case "AUDIO":
      return path.join(STORAGE_DIR, "audio")
    case "DOCUMENT":
      return path.join(STORAGE_DIR, "documents")
    default:
      throw new Error(`Unsupported media type: ${mediaType}`)
  }
}

// Save a file to storage
export const saveFile = async (
  file: Buffer,
  filename: string,
  mediaType: MediaType,
  options?: {
    width?: number
    height?: number
    quality?: number
    generateThumbnail?: boolean
  },
): Promise<{
  url: string
  filename: string
  mimeType: string
  size: number
  width?: number
  height?: number
  duration?: number
  thumbnailUrl?: string
}> => {
  const directory = getDirectoryPath(mediaType)
  const fileExtension = path.extname(filename)
  const uniqueFilename = `${uuidv4()}${fileExtension}`
  const filePath = path.join(directory, uniqueFilename)

  // Determine mime type based on extension
  const mimeType = getMimeType(fileExtension)

  // Process file based on media type
  const fileInfo: any = {
    url: `/api/media/${mediaType.toLowerCase()}/${uniqueFilename}`,
    filename: uniqueFilename,
    mimeType,
    size: file.length,
  }

  if (mediaType === "IMAGE") {
    // Process image
    let imageBuffer = file

    if (options?.width || options?.height || options?.quality) {
      const sharpInstance = sharp(file)

      if (options.width || options.height) {
        sharpInstance.resize(options.width, options.height, {
          fit: "inside",
          withoutEnlargement: true,
        })
      }

      if (options.quality) {
        sharpInstance.jpeg({ quality: options.quality })
      }

      imageBuffer = await sharpInstance.toBuffer()
    }

    // Get image dimensions
    const metadata = await sharp(imageBuffer).metadata()
    fileInfo.width = metadata.width
    fileInfo.height = metadata.height

    // Save the image
    fs.writeFileSync(filePath, imageBuffer)

    // Generate thumbnail if requested
    if (options?.generateThumbnail) {
      const thumbnailFilename = `thumb_${uniqueFilename}`
      const thumbnailPath = path.join(STORAGE_DIR, "thumbnails", thumbnailFilename)

      await sharp(imageBuffer).resize(200, 200, { fit: "cover" }).jpeg({ quality: 80 }).toFile(thumbnailPath)

      fileInfo.thumbnailUrl = `/api/media/thumbnails/${thumbnailFilename}`
    }
  } else if (mediaType === "VIDEO") {
    // Save the video
    fs.writeFileSync(filePath, file)

    // Generate thumbnail and get video metadata
    if (options?.generateThumbnail) {
      try {
        const ffmpeg = createFFmpeg({ log: false })
        await ffmpeg.load()

        ffmpeg.FS("writeFile", uniqueFilename, file)

        // Extract first frame as thumbnail
        await ffmpeg.run("-i", uniqueFilename, "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg")

        // Get video duration and dimensions
        await ffmpeg.run("-i", uniqueFilename, "-c", "copy", "-f", "null", "-")

        const thumbnailData = ffmpeg.FS("readFile", "thumbnail.jpg")
        const thumbnailFilename = `thumb_${path.parse(uniqueFilename).name}.jpg`
        const thumbnailPath = path.join(STORAGE_DIR, "thumbnails", thumbnailFilename)

        fs.writeFileSync(thumbnailPath, Buffer.from(thumbnailData))

        fileInfo.thumbnailUrl = `/api/media/thumbnails/${thumbnailFilename}`

        // Extract video metadata
        const metadata = await getVideoMetadata(filePath)
        if (metadata) {
          fileInfo.width = metadata.width
          fileInfo.height = metadata.height
          fileInfo.duration = metadata.duration
        }
      } catch (error) {
        console.error("Error generating video thumbnail:", error)
      }
    }
  } else if (mediaType === "AUDIO") {
    // Save the audio file
    fs.writeFileSync(filePath, file)

    // Extract audio metadata if possible
    try {
      const metadata = await getAudioMetadata(filePath)
      if (metadata && metadata.duration) {
        fileInfo.duration = metadata.duration
      }
    } catch (error) {
      console.error("Error extracting audio metadata:", error)
    }
  } else {
    // For documents or other file types, just save the file
    fs.writeFileSync(filePath, file)
  }

  return fileInfo
}

// Delete a file from storage
export const deleteFile = (filename: string, mediaType: MediaType): boolean => {
  try {
    const directory = getDirectoryPath(mediaType)
    const filePath = path.join(directory, filename)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)

      // Also delete thumbnail if it exists
      const thumbnailPath = path.join(STORAGE_DIR, "thumbnails", `thumb_${filename}`)
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath)
      }

      return true
    }

    return false
  } catch (error) {
    console.error("Error deleting file:", error)
    return false
  }
}

// Get a file from storage
export const getFile = (filename: string, mediaType: MediaType): Buffer | null => {
  try {
    const directory = getDirectoryPath(mediaType)
    const filePath = path.join(directory, filename)

    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath)
    }

    return null
  } catch (error) {
    console.error("Error reading file:", error)
    return null
  }
}

// Helper functions
const getMimeType = (extension: string): string => {
  const ext = extension.toLowerCase()

  switch (ext) {
    // Images
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".gif":
      return "image/gif"
    case ".webp":
      return "image/webp"

    // Videos
    case ".mp4":
      return "video/mp4"
    case ".webm":
      return "video/webm"
    case ".mov":
      return "video/quicktime"

    // Audio
    case ".mp3":
      return "audio/mpeg"
    case ".wav":
      return "audio/wav"
    case ".ogg":
      return "audio/ogg"

    // Documents
    case ".pdf":
      return "application/pdf"
    case ".doc":
    case ".docx":
      return "application/msword"

    default:
      return "application/octet-stream"
  }
}

// Get video metadata using ffmpeg
const getVideoMetadata = async (
  filePath: string,
): Promise<{ width: number; height: number; duration: number } | null> => {
  try {
    const ffmpeg = createFFmpeg({ log: false })
    await ffmpeg.load()

    const fileData = fs.readFileSync(filePath)
    const filename = path.basename(filePath)

    ffmpeg.FS("writeFile", filename, fileData)

    // Run ffprobe to get video metadata
    await ffmpeg.run(
      "-i",
      filename,
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,duration",
      "-of",
      "json",
      "metadata.json",
    )

    const metadataJson = ffmpeg.FS("readFile", "metadata.json")
    const metadata = JSON.parse(Buffer.from(metadataJson).toString())

    if (metadata.streams && metadata.streams.length > 0) {
      const stream = metadata.streams[0]
      return {
        width: Number.parseInt(stream.width, 10),
        height: Number.parseInt(stream.height, 10),
        duration: Number.parseFloat(stream.duration),
      }
    }

    return null
  } catch (error) {
    console.error("Error getting video metadata:", error)
    return null
  }
}

// Get audio metadata
const getAudioMetadata = async (filePath: string): Promise<{ duration: number } | null> => {
  try {
    const ffmpeg = createFFmpeg({ log: false })
    await ffmpeg.load()

    const fileData = fs.readFileSync(filePath)
    const filename = path.basename(filePath)

    ffmpeg.FS("writeFile", filename, fileData)

    // Run ffprobe to get audio metadata
    await ffmpeg.run("-i", filename, "-v", "error", "-show_entries", "format=duration", "-of", "json", "metadata.json")

    const metadataJson = ffmpeg.FS("readFile", "metadata.json")
    const metadata = JSON.parse(Buffer.from(metadataJson).toString())

    if (metadata.format && metadata.format.duration) {
      return {
        duration: Number.parseFloat(metadata.format.duration),
      }
    }

    return null
  } catch (error) {
    console.error("Error getting audio metadata:", error)
    return null
  }
}

