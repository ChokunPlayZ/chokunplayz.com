import { createServerFn } from '@tanstack/react-start'

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
  // Presigned storage URLs (~5 min lifetime), null when storage can't serve
  // directly. Prefer these; fall back to the proxy when missing or expired.
  signedUrl?: string | null
  signedThumbnailUrl?: string | null
}

type PhotoRef = Pick<PichausPhoto, 'id' | 'signedUrl' | 'signedThumbnailUrl'>
type Variant = 'thumb' | 'full'

// PicHaus image endpoints require the Bearer key, so images are served
// through our own proxy route (src/routes/api/photo.$variant.$id.ts).
// Stable URL that never expires — use for links opened later (href).
export const getPhotoProxyUrl = (id: string, variant: Variant = 'full') =>
  `/api/photo/${variant}/${id}`

export const getPhotoUrl = (photo: PhotoRef) =>
  photo.signedUrl ?? getPhotoProxyUrl(photo.id, 'full')

export const getPhotoThumbnailUrl = (photo: PhotoRef) =>
  photo.signedThumbnailUrl ?? getPhotoProxyUrl(photo.id, 'thumb')

// Signed URLs expire after ~5 min, so a lazy image that loads late can 403.
// Swap to the proxy once; the guard stops a loop if the proxy fails too.
export const fallbackToProxy =
  (id: string, variant: Variant) =>
  (e: { currentTarget: HTMLImageElement }) => {
    const img = e.currentTarget
    const proxy = getPhotoProxyUrl(id, variant)
    if (!img.src.endsWith(proxy)) img.src = proxy
  }

// Server-only: this module is also imported by client components.
export const pichausApiBase = () =>
  process.env.PICHAUS_API_URL ?? 'https://marin.pic.haus/api/external'

// The cover's id isn't guaranteed on `coverPhoto`; fall back to parsing it
// out of `previewImageUrl` (…/photos/{id}/thumb).
function coverIdFromDetail(detail: {
  coverPhoto?: { id?: string } | null
  previewImageUrl?: string | null
}): string | undefined {
  if (detail.coverPhoto?.id) return detail.coverPhoto.id
  return detail.previewImageUrl?.match(/\/photos\/([^/]+)\/[^/]+$/)?.[1]
}

export interface PichausAlbum {
  id: string
  title: string
  eventDate: number | null // Unix timestamp (seconds), null when unset
  location?: string
  photoCount?: number
  coverPhoto?: {
    id: string
    width: number
    height: number
    signedThumbnailUrl?: string | null
  }
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

// Server-side response cache. The API allows 120 reads/min per account and
// one albums load alone costs 1 + N requests, so results are shared across
// visitors for CACHE_TTL_MS. Signed URLs live ~5 min, so cached ones stay
// valid. Only successful results are cached; on failure the last good value
// (if any) is served instead of the error.
const CACHE_TTL_MS = 2 * 60 * 1000
const responseCache = new Map<string, { value: unknown; at: number }>()
const responseInflight = new Map<string, Promise<unknown>>()

async function cached<T extends { error: string | null }>(
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  const hit = responseCache.get(key) as { value: T; at: number } | undefined
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value

  let pending = responseInflight.get(key) as Promise<T> | undefined
  if (!pending) {
    pending = load()
      .then((value) => {
        if (value.error === null)
          responseCache.set(key, { value, at: Date.now() })
        return value
      })
      .finally(() => responseInflight.delete(key))
    responseInflight.set(key, pending)
  }
  const value = await pending
  return value.error !== null && hit ? hit.value : value
}

function hardcodedAlbums(): Array<PichausAlbum> {
  return []
}

const WEB_ALBUM_TAG = 'WEB'

export const getWebAlbums = createServerFn().handler(() =>
  cached('albums', fetchWebAlbums),
)

async function fetchWebAlbums() {
  const apiKey = process.env.PICHAUS_API_KEY
  if (!apiKey)
    return { albums: hardcodedAlbums(), error: 'API key not configured' }
  try {
    const response = await fetch(
      `${pichausApiBase()}/albums?tag=${WEB_ALBUM_TAG}&sortBy=eventDate&order=desc&limit=100`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    )
    if (!response.ok) {
      console.warn(
        'getWebAlbums API error',
        response.status,
        '– falling back to hardcoded list',
      )
      return {
        albums: hardcodedAlbums(),
        error: `API error: ${response.status}`,
      }
    }
    const result = (await response.json()) as AlbumsApiResponse
    if (!result.success || !result.data)
      return { albums: hardcodedAlbums(), error: 'Invalid response' }

    // Fetch individual album details in parallel to retrieve coverPhoto
    const albums: Array<PichausAlbum> = await Promise.all(
      result.data.map(async (a) => {
        try {
          const detailResponse = await fetch(
            `${pichausApiBase()}/albums/${a.id}`,
            { headers: { Authorization: `Bearer ${apiKey}` } },
          )
          if (detailResponse.ok) {
            const detailResult = await detailResponse.json()
            if (detailResult.success && detailResult.data) {
              const coverId = coverIdFromDetail(detailResult.data)
              const cp = detailResult.data.coverPhoto
              return {
                id: a.id,
                title: a.title,
                eventDate: a.eventDate,
                location: a.location,
                photoCount: a.photoCount,
                coverPhoto: coverId
                  ? {
                      id: coverId,
                      width: cp?.width ?? 0,
                      height: cp?.height ?? 0,
                      signedThumbnailUrl: cp?.signedThumbnailUrl ?? null,
                    }
                  : undefined,
              }
            }
          }
        } catch (e) {
          console.warn(`Failed to fetch detail for album ${a.id}:`, e)
        }
        return {
          id: a.id,
          title: a.title,
          eventDate: a.eventDate,
          location: a.location,
          photoCount: a.photoCount,
          coverPhoto: undefined,
        }
      }),
    )

    return { albums, error: null }
  } catch {
    return { albums: hardcodedAlbums(), error: 'Failed to fetch' }
  }
}

interface ApiResponse {
  success: boolean
  pagination?: { page: number; limit: number; total: number; hasMore: boolean }
  data?: Array<{
    id: string
    url: string
    thumbnailUrl: string
    width: number
    height: number
    blurhash: string
    dateTaken: number
    signedUrl?: string | null
    signedThumbnailUrl?: string | null
    signedUrlExpiresAt?: number | null
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
  .validator((data: { albumId: string; page?: number; limit?: number }) => data)
  .handler(({ data }) => {
    const { albumId, page = 1, limit = 50 } = data
    return cached(`album:${albumId}:${page}:${limit}`, () =>
      fetchAlbumPhotos(albumId, page, limit),
    )
  })

async function fetchAlbumPhotos(albumId: string, page: number, limit: number) {
  const apiKey = process.env.PICHAUS_API_KEY
  if (!apiKey)
    return {
      photos: [] as Array<PichausPhoto>,
      total: null,
      hasMore: false,
      error: 'API key not configured',
    }
  try {
    const response = await fetch(
      `${pichausApiBase()}/albums/${albumId}/photos?sortBy=dateTaken&page=${page}&limit=${Math.min(limit, 100)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    )
    if (!response.ok)
      return {
        photos: [] as Array<PichausPhoto>,
        total: null,
        hasMore: false,
        error: `API error: ${response.status}`,
      }
    const result = (await response.json()) as ApiResponse
    if (!result.success || !result.data)
      return {
        photos: [] as Array<PichausPhoto>,
        total: null,
        hasMore: false,
        error: 'Invalid response',
      }
    const photos: Array<PichausPhoto> = result.data.map((p) => ({
      id: p.id,
      width: p.width,
      height: p.height,
      blurhash: p.blurhash,
      dateTaken: p.dateTaken,
      album: { id: p.album?.id ?? albumId, title: p.album?.title ?? '' },
      signedUrl: p.signedUrl ?? null,
      signedThumbnailUrl: p.signedThumbnailUrl ?? null,
    }))
    return {
      photos,
      total: result.pagination?.total ?? null,
      hasMore: result.pagination?.hasMore ?? photos.length >= limit,
      error: null,
    }
  } catch {
    return {
      photos: [] as Array<PichausPhoto>,
      total: null,
      hasMore: false,
      error: 'Failed to fetch',
    }
  }
}

// Server function to fetch random photos from Pichaus API
const RANDOM_BATCH_MAX = 50

export const getRandomPhotos = createServerFn().handler(() =>
  cached('random', fetchRandomPhotos),
)

async function fetchRandomPhotos() {
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
    // The API caps `count` at 50 per request, so fetch in batches.
    const batches: Array<number> = []
    for (let left = count; left > 0; left -= RANDOM_BATCH_MAX)
      batches.push(Math.min(left, RANDOM_BATCH_MAX))

    const responses = await Promise.all(
      batches.map((n) =>
        fetch(
          `${pichausApiBase()}/photos/random?count=${n}&tag=${WEB_ALBUM_TAG}`,
          {
            headers: { Authorization: `Bearer ${apiKey}` },
          },
        ),
      ),
    )

    const failed = responses.find((r) => !r.ok)
    if (failed) {
      console.error('Pichaus API error:', failed.status, failed.statusText)
      return {
        photos: [] as Array<PichausPhoto>,
        error: `API error: ${failed.status}`,
      }
    }

    const results = (await Promise.all(
      responses.map((r) => r.json()),
    )) as Array<ApiResponse>

    if (results.some((r) => !r.success || !r.data)) {
      return {
        photos: [] as Array<PichausPhoto>,
        error: 'Invalid API response',
      }
    }

    // Batches are sampled independently, so drop duplicates.
    const seen = new Set<string>()
    const data = results
      .flatMap((r) => r.data ?? [])
      .filter((p) => !seen.has(p.id) && seen.add(p.id))

    // Map and pick only necessary fields to reduce payload
    const photos: Array<PichausPhoto> = data.map((photo) => ({
      id: photo.id,
      width: photo.width,
      height: photo.height,
      blurhash: photo.blurhash,
      dateTaken: photo.dateTaken,
      album: {
        id: photo.album?.id ?? '',
        title: photo.album?.title ?? '',
      },
      signedUrl: photo.signedUrl ?? null,
      signedThumbnailUrl: photo.signedThumbnailUrl ?? null,
    }))

    return { photos, error: null }
  } catch (error) {
    console.error('Failed to fetch photos:', error)
    return {
      photos: [] as Array<PichausPhoto>,
      error: 'Failed to fetch photos',
    }
  }
}

interface ShareLink {
  url: string
  expiresAt: number | null
  hasPassword: boolean
  selectedPhotoCount: number | null
}

// Rank usable links: whole album over a photo subset, no password over a
// password, then the one that stays valid longest (null = never expires).
// The API already drops revoked, disabled and expired links.
function pickShareLink(links: Array<ShareLink>): ShareLink | undefined {
  const score = (l: ShareLink) => [
    l.selectedPhotoCount === null ? 1 : 0,
    l.hasPassword ? 0 : 1,
    l.expiresAt ?? Infinity,
  ]
  return [...links].sort((a, b) => {
    const sa = score(a)
    const sb = score(b)
    for (let i = 0; i < sa.length; i++)
      if (sa[i] !== sb[i]) return sb[i] - sa[i]
    return 0
  })[0]
}

// Guest link for "Open in PicHaus". `url` is null when the album has no
// usable share link, so the caller hides the button.
export const getAlbumShareLink = createServerFn()
  .validator((data: { albumId: string }) => data)
  .handler(({ data }) =>
    cached(`share:${data.albumId}`, () => fetchAlbumShareLink(data.albumId)),
  )

async function fetchAlbumShareLink(albumId: string) {
  const apiKey = process.env.PICHAUS_API_KEY
  if (!apiKey) return { url: null, error: 'API key not configured' }
  try {
    const response = await fetch(
      `${pichausApiBase()}/albums/${encodeURIComponent(albumId)}/share-links?limit=100`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    )
    if (!response.ok)
      return { url: null, error: `API error: ${response.status}` }
    const result = (await response.json()) as {
      success: boolean
      data?: Array<ShareLink>
    }
    if (!result.success || !result.data)
      return { url: null, error: 'Invalid response' }
    return { url: pickShareLink(result.data)?.url ?? null, error: null }
  } catch {
    return { url: null, error: 'Failed to fetch' }
  }
}
