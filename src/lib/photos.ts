import { createServerFn } from '@tanstack/react-start'

// Type for the photo response from the API (matching actual API response)
export interface PichausPhoto {
  id: string
  url: string
  thumbnailUrl: string
  filename: string
  originalName: string
  width: number
  height: number
  blurhash: string
  dateTaken: number
  createdAt: number
  album: {
    id: string
    title: string
  }
}

interface ApiResponse {
  success: boolean
  data?: Array<PichausPhoto>
}

// Server function to fetch random photos from Pichaus API
export const getRandomPhotos = createServerFn().handler(async () => {
  const count = 40
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

    return { photos: result.data, error: null }
  } catch (error) {
    console.error('Failed to fetch photos:', error)
    return {
      photos: [] as Array<PichausPhoto>,
      error: 'Failed to fetch photos',
    }
  }
})
