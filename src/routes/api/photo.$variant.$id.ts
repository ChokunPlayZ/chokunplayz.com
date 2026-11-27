import { createFileRoute } from '@tanstack/react-router'
import { pichausApiBase } from '../../lib/photos'

// PicHaus requires `Authorization: Bearer` on image downloads, so the browser
// can't hit it directly. This route fetches with the server-side key and
// caches the bytes: the API allows only 120 reads/min per account, and a
// single PhotoMode visit can request ~120 thumbnails.

const VARIANTS = new Set(['thumb', 'full'])
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/
const CACHE_BUDGET_BYTES = 256 * 1024 * 1024
const MAX_ENTRY_BYTES = 8 * 1024 * 1024

interface Entry {
  body: ArrayBuffer
  contentType: string
}

// Map preserves insertion order, so it doubles as an LRU.
const cache = new Map<string, Entry>()
let cacheBytes = 0
const inflight = new Map<string, Promise<Entry | Response>>()

function remember(key: string, entry: Entry) {
  if (entry.body.byteLength > MAX_ENTRY_BYTES) return
  cache.set(key, entry)
  cacheBytes += entry.body.byteLength
  for (const [k, v] of cache) {
    if (cacheBytes <= CACHE_BUDGET_BYTES) break
    cache.delete(k)
    cacheBytes -= v.body.byteLength
  }
}

function recall(key: string): Entry | undefined {
  const hit = cache.get(key)
  if (hit) {
    cache.delete(key)
    cache.set(key, hit)
  }
  return hit
}

async function fetchUpstream(
  variant: string,
  id: string,
): Promise<Entry | Response> {
  const apiKey = process.env.PICHAUS_API_KEY
  if (!apiKey) return new Response('API key not configured', { status: 500 })

  const upstream = await fetch(`${pichausApiBase()}/photos/${id}/${variant}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!upstream.ok) {
    const headers = new Headers({ 'Cache-Control': 'no-store' })
    const retryAfter = upstream.headers.get('Retry-After')
    if (retryAfter) headers.set('Retry-After', retryAfter)
    return new Response(null, { status: upstream.status, headers })
  }
  return {
    body: await upstream.arrayBuffer(),
    contentType: upstream.headers.get('Content-Type') ?? 'image/jpeg',
  }
}

export const Route = createFileRoute('/api/photo/$variant/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { variant, id } = params
        if (!VARIANTS.has(variant) || !ID_RE.test(id))
          return new Response('Not found', { status: 404 })

        const key = `${variant}/${id}`
        let result: Entry | Response | undefined = recall(key)
        if (!result) {
          let pending = inflight.get(key)
          if (!pending) {
            pending = fetchUpstream(variant, id)
              .then((r) => {
                if (!(r instanceof Response)) remember(key, r)
                return r
              })
              .catch(() => new Response('Upstream error', { status: 502 }))
              .finally(() => inflight.delete(key))
            inflight.set(key, pending)
          }
          result = await pending
        }

        // Concurrent waiters share one error Response; clone so each can read it.
        if (result instanceof Response) return result.clone()

        return new Response(result.body, {
          headers: {
            'Content-Type': result.contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      },
    },
  },
})
