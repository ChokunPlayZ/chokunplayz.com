import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PhotoMode } from '../components/PhotoMode'
import { getRandomPhotos, getWebAlbums } from '../lib/photos'

export const Route = createFileRoute('/photos')({
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
    const navigate = useNavigate()
    return (
        <PhotoMode
            photos={photos}
            albums={albums}
            onExit={() => navigate({ to: '/' })}
        />
    )
}
