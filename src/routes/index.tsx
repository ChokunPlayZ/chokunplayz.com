import { Await, createFileRoute, defer } from '@tanstack/react-router'
import { Suspense, useEffect, useRef } from 'react'
import { Camera, ImageIcon } from 'lucide-react'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { PhotoAlbumCard } from '../components/PhotoAlbumCard'
import { SocialLinks } from '../components/SocialLinks'
import { ThemeToggle } from '../components/ThemeToggle'
import { PhotoSlideshow } from '../components/PhotoSlideshow'
import { photoAlbums, profile, projects, socials } from '../data/site'
import { getRandomPhotos } from '../lib/photos'

export const Route = createFileRoute('/')({
  loader: () => {
    return {
      randomPhotosPromise: defer(getRandomPhotos()),
    }
  },
  component: HomePage,
})

function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { randomPhotosPromise } = Route.useLoaderData()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    const elements = containerRef.current?.querySelectorAll('.fade-in-section')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen gradient-bg selection:bg-(--accent) selection:text-white"
    >
      {/* Navbar / Theme Toggle */}
      <nav className="fixed top-0 right-0 p-6 z-50 flex gap-4">
        <ThemeToggle />
      </nav>

      {/* Floating decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-160 h-160 bg-sky-300/30 dark:bg-sky-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-[20%] right-[-5%] w-120 h-120 bg-blue-200/30 dark:bg-blue-400/10 rounded-full blur-[80px] animate-float-slow" />
        <div className="absolute bottom-[-10%] left-[20%] w-140 h-140 bg-cyan-200/30 dark:bg-cyan-500/10 rounded-full blur-[90px] animate-float-delayed" />
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center z-10 space-y-8 fade-in-section is-visible">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-(--text-primary) tracking-tight leading-none">
              Hello, I'm <br />
              <span className="bg-linear-to-r from-(--accent) via-sky-400 to-blue-300 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-(--text-secondary) max-w-2xl mx-auto font-light leading-relaxed">
            {profile.tagline}
          </p>

          <div className="flex justify-center pt-8">
            <SocialLinks links={socials} className="justify-center" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-(--text-muted)">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </header>

      {/* About Section */}
      <Section title="About Me" id="about" className="fade-in-section">
        <div className="glass-panel p-8 md:p-10 rounded-3xl">
          <p className="text-lg md:text-xl text-(--text-secondary) leading-relaxed">
            {profile.about}
          </p>
        </div>
      </Section>

      {/* Projects Section */}
      <Section
        title="Featured Projects"
        id="projects"
        className="fade-in-section"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              description={project.description}
              url={project.url}
              tech={project.tech}
            />
          ))}
        </div>
      </Section>

      {/* Photography Section */}
      <Section id="photos" className="fade-in-section">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-(--accent)/10 text-(--accent)">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary)">
              Photography
            </h2>
            <p className="text-(--text-muted)">Capturing moments & frames</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {photoAlbums.map((album) => (
            <PhotoAlbumCard
              key={album.title}
              title={album.title}
              date={album.date}
              url={album.url}
              location={'location' in album ? album.location : undefined}
            />
          ))}
        </div>
      </Section>

      {/* Random Photos Slideshow */}
      <section className="py-16 fade-in-section">
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-(--accent)/10 text-(--accent)">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary)">
                Recent Shots
              </h2>
              <p className="text-(--text-muted)">
                Random photos from my gallery
              </p>
            </div>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="h-[400px] w-full flex items-center justify-center text-(--text-muted)">
              <div className="w-8 h-8 border-4 border-(--accent)/20 border-t-(--accent) rounded-full animate-spin" />
            </div>
          }
        >
          <Await promise={randomPhotosPromise}>
            {(data: any) => {
              const photos = data?.photos ?? []
              return photos.length > 0 ? (
                <PhotoSlideshow photos={photos} />
              ) : null
            }}
          </Await>
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="py-24 text-center fade-in-section">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-(--text-primary) mb-6">
            Let's Connect
          </h2>
          <SocialLinks links={socials} className="justify-center mb-8" />
          <p className="text-sm text-(--text-muted)">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </footer>
    </div>
  )
}
