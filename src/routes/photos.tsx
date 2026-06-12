import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PhotoMode } from '../components/PhotoMode'
import { getRandomPhotos } from '../lib/photos'

export const Route = createFileRoute('/photos')({
    loader: async () => {
        const { photos } = await getRandomPhotos()
        return { photos }
    },
    component: PhotosPage,
})

function PhotosPage() {
    const { photos } = Route.useLoaderData()
    const navigate = useNavigate()
    return (
        <PhotoMode
            photos={photos}
            onExit={() => navigate({ to: '/' })}
        />
    )
}
