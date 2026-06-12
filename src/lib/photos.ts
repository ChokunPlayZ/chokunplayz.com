import { createServerFn } from '@tanstack/react-start'
import { photoAlbums } from '../data/site'

export interface PichausPhoto {
  id: string
  width: number
  height: number
  blurhash: string
  dateTaken: number
  album: {
    id: string
    title: string
  }
}

export const getPhotoUrl = (id: string) =>
  `https://p.ckl.moe/api/assets/full/${id}`

export const getPhotoThumbnailUrl = (id: string) =>
  `https://p.ckl.moe/api/assets/thumb/${id}`

export interface PichausAlbum {
  id: string
  title: string
  eventDate: number | null  // Unix timestamp (seconds), null when unset
  location?: string
  photoCount?: number
  coverPhoto?: { id: string; width: number; height: number }
}

interface AlbumsApiResponse {
  success: boolean
  data?: Array<{
    id: string
    title: string
    eventDate: number | null
    location?: string
    photoCount?: number
    coverPhoto?: { id: string; width: number; height: number }
    [key: string]: unknown
  }>
}

function hardcodedAlbums(): PichausAlbum[] {
  return (photoAlbums as readonly { title: string; date: string; url: string; location?: string }[])
    .map((a) => ({
      id: a.url.split('/v/')[1] ?? '',
      title: a.title,
      eventDate: Math.floor(new Date(`${a.date}T12:00:00`).getTime() / 1000),
      location: a.location,
    }))
    .filter((a) => a.id !== '')
}

export const getWebAlbums = createServerFn().handler(async () => {
  const apiKey = process.env.PICHAUS_API_KEY
  if (!apiKey) return { albums: hardcodedAlbums(), error: 'API key not configured' }
  try {
    const response = await fetch(
      'https://p.ckl.moe/api/external/albums?tag=WEB&sortBy=eventDate&order=desc',
      { headers: { Authorization: `Bearer ${apiKey}` } },
    )
    if (!response.ok) {
      console.warn('getWebAlbums API error', response.status, '– falling back to hardcoded list')
      return { albums: hardcodedAlbums(), error: `API error: ${response.status}` }
    }
    const result = (await response.json()) as AlbumsApiResponse
    if (!result.success || !result.data) return { albums: hardcodedAlbums(), error: 'Invalid response' }
    const albums: PichausAlbum[] = result.data.map((a) => ({
      id: a.id,
      title: a.title,
      eventDate: a.eventDate,
      location: a.location,
      photoCount: a.photoCount,
      coverPhoto: a.coverPhoto,
    }))
    return { albums, error: null }
  } catch {
    return { albums: hardcodedAlbums(), error: 'Failed to fetch' }
  }
})

interface ApiResponse {
  success: boolean
  data?: Array<{
    id: string
    url: string
    thumbnailUrl: string
    width: number
    height: number
    blurhash: string
    dateTaken: number
    album?: {
      id: string
      title: string
    }
    filename?: string
    originalName?: string
    createdAt?: number
  }>
}

export const getAlbumPhotos = createServerFn()
  .validator((albumId: string) => albumId)
  .handler(async ({ data: albumId }) => {
    const apiKey = process.env.PICHAUS_API_KEY
    if (!apiKey) return { photos: [] as PichausPhoto[], error: 'API key not configured' }
    try {
      const response = await fetch(
        `https://p.ckl.moe/api/external/albums/${albumId}/photos?sortBy=dateTaken`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
      )
      if (!response.ok) return { photos: [] as PichausPhoto[], error: `API error: ${response.status}` }
      const result = (await response.json()) as ApiResponse
      if (!result.success || !result.data) return { photos: [] as PichausPhoto[], error: 'Invalid response' }
      const photos: PichausPhoto[] = result.data.map((p) => ({
        id: p.id, width: p.width, height: p.height,
        blurhash: p.blurhash, dateTaken: p.dateTaken,
        album: { id: p.album?.id ?? albumId, title: p.album?.title ?? '' },
      }))
      return { photos, error: null }
    } catch {
      return { photos: [] as PichausPhoto[], error: 'Failed to fetch' }
    }
  })

// Server function to fetch random photos from Pichaus API
export const getRandomPhotos = createServerFn().handler(async () => {
  const count = 120
  const apiKey = process.env.PICHAUS_API_KEY

  if (!apiKey) {
    console.error('PICHAUS_API_KEY not found in environment variables')
    return {
      photos: [] as Array<PichausPhoto>,
      error: 'API key not configured',
    }
  }

  try {
    const response = await fetch(
      `https://p.ckl.moe/api/external/photos/random?count=${count}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )

    if (!response.ok) {
      console.error('Pichaus API error:', response.status, response.statusText)
      return {
        photos: [] as Array<PichausPhoto>,
        error: `API error: ${response.status}`,
      }
    }

    const result = (await response.json()) as ApiResponse

    if (!result.success || !result.data) {
      return {
        photos: [] as Array<PichausPhoto>,
        error: 'Invalid API response',
      }
    }

    // Map and pick only necessary fields to reduce payload
    const photos: Array<PichausPhoto> = result.data.map((photo) => ({
      id: photo.id,
      width: photo.width,
      height: photo.height,
      blurhash: photo.blurhash,
      dateTaken: photo.dateTaken,
      album: {
        id: photo.album?.id ?? '',
        title: photo.album?.title ?? '',
      },
    }))

    return { photos, error: null }
  } catch (error) {
    console.error('Failed to fetch photos:', error)
    return {
      photos: [] as Array<PichausPhoto>,
      error: 'Failed to fetch photos',
    }
  }
})
