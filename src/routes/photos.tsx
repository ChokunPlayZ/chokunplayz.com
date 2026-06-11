import { createFileRoute, defer, useNavigate } from '@tanstack/react-router'
import { PhotoMode } from '../components/PhotoMode'
import { getRandomPhotos } from '../lib/photos'

export const Route = createFileRoute('/photos')({
    loader: () => ({
        randomPhotosPromise: defer(getRandomPhotos()),
    }),
    component: PhotosPage,
})

function PhotosPage() {
    const { randomPhotosPromise } = Route.useLoaderData()
    const navigate = useNavigate()
    return (
        <PhotoMode
            photosPromise={randomPhotosPromise}
            onExit={() => navigate({ to: '/' })}
        />
    )
}
