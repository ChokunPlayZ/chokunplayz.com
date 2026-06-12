import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PhotoMode } from '../components/PhotoMode'
import { getRandomPhotos, getWebAlbums } from '../lib/photos'

export const Route = createFileRoute('/photos')({
  validateSearch: (search: Record<string, unknown>) => ({
    album: typeof search.album === 'string' ? search.album : undefined,
  }),
  loader: async () => {
    const [{ photos }, { albums }] = await Promise.all([
      getRandomPhotos(),
      getWebAlbums(),
    ])
    return { photos, albums }
  },
  component: PhotosPage,
})

function PhotosPage() {
  const { photos, albums } = Route.useLoaderData()
  const { album: initialAlbumId } = Route.useSearch()
  const navigate = useNavigate()
  return (
    <PhotoMode
      photos={photos}
      albums={albums}
      initialAlbumId={initialAlbumId}
      onAlbumChange={(albumId) =>
        navigate({ to: '/photos', search: { album: albumId ?? undefined } })
      }
      onExit={() => navigate({ to: '/' })}
    />
  )
}
