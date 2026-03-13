import { readdirSync, readFileSync } from 'node:fs'
import { join, extname } from 'node:path'
import sharp from 'sharp'

const GALLERY_DIR = 'public/assets/images/gallery'
const GALLERY_URL_PREFIX = '/assets/images/gallery'
const IMAGE_EXTENSIONS = new Set(['.avif', '.webp', '.png', '.jpg', '.jpeg'])

export interface GalleryImage {
  src: string
  width: number
  height: number
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const dir = join(process.cwd(), GALLERY_DIR)
  const files = readdirSync(dir)
    .filter((f: string) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()))
    .sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }))

  const images: GalleryImage[] = []
  for (const f of files) {
    const meta = await sharp(join(dir, f)).metadata()
    images.push({
      src: `${GALLERY_URL_PREFIX}/${f}`,
      width: meta.width ?? 800,
      height: meta.height ?? 600
    })
  }
  return images
}
