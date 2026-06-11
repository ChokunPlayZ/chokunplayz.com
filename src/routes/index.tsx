import { Await, Link, createFileRoute, defer } from '@tanstack/react-router'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Camera, ImageIcon, Home, User, FolderGit2, Mail, Briefcase, Terminal } from 'lucide-react'
import { JumpNavigation } from '../components/JumpNavigation'
import { ExperienceCard } from '../components/ExperienceCard'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { PhotoAlbumCard } from '../components/PhotoAlbumCard'
import { SocialLinks } from '../components/SocialLinks'
import { ThemeToggle } from '../components/ThemeToggle'
import { PhotoSlideshow } from '../components/PhotoSlideshow'
import { Typewriter } from '../components/Typewriter'
import { PhotoMode } from '../components/PhotoMode'
import { experiences, photoAlbums, profile, projects, socials, sshKey } from '../data/site'
import { getRandomPhotos } from '../lib/photos'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    'photo-mode': search['photo-mode'] === 'true' || search['photo-mode'] === true,
  }),
  loader: () => {
    return {
      randomPhotosPromise: defer(getRandomPhotos()),
    }
  },
  component: HomePage,
})

const SECTIONS = [
  { id: 'home',         label: 'Home',         icon: <Home className="w-4 h-4" /> },
  { id: 'about',        label: 'About',         icon: <User className="w-4 h-4" /> },
  { id: 'experiences',  label: 'Experiences',   icon: <Briefcase className="w-4 h-4" /> },
  { id: 'projects',     label: 'Projects',      icon: <FolderGit2 className="w-4 h-4" /> },
  { id: 'photos',       label: 'Photos',        icon: <Camera className="w-4 h-4" />, offset: -40 },
  { id: 'recent-shots', label: 'Recent Shots',  icon: <ImageIcon className="w-4 h-4" />, offset: -40 },
  { id: 'ssh',          label: 'SSH',           icon: <Terminal className="w-4 h-4" /> },
  { id: 'contact',      label: 'Contact',       icon: <Mail className="w-4 h-4" /> },
]

function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { randomPhotosPromise } = Route.useLoaderData()
  const { 'photo-mode': photoModeParam } = Route.useSearch()
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [photoMode, setPhotoMode] = useState(() => photoModeParam)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header id="home" className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 hero-grid pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center z-10 space-y-8 fade-in-section is-visible">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-(--text-primary) tracking-tight leading-none">
              Hello, I'm <br />
              <span className="bg-linear-to-r from-(--accent) via-sky-300 to-blue-300 bg-clip-text text-transparent animated-gradient-text">
                {profile.name}
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-(--text-secondary) max-w-2xl mx-auto font-light leading-relaxed">
            I'm a{' '}
            <Typewriter
              words={profile.titles}
              typingSpeed={80}
              deletingSpeed={50}
              interactiveWord="Photographer"
              onInteractiveWordClick={() => setPhotoMode(true)}
            />
          </p>

          <div className="flex justify-center pt-4">
            <SocialLinks links={socials} className="justify-center" />
          </div>

          <div className="pt-2 flex flex-wrap gap-3 justify-center">
            <Link
              to="/blog"
              search={{ page: 1 }}
              className="inline-flex items-center gap-2 rounded-full border border-(--border) px-6 py-3 text-sm font-medium text-(--text-primary) hover:bg-(--accent)/10 hover:border-(--accent)/40 transition-all duration-200"
            >
              Read the blog
              <span className="text-(--text-muted)">→</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-(--text-muted) animate-bounce">
          <span className="text-xs uppercase tracking-widest opacity-50">Scroll</span>
          <div className="w-px h-8 bg-linear-to-b from-(--accent)/50 to-transparent" />
        </div>
      </header>

      {/* ── About ─────────────────────────────────────────────── */}
      <Section title="About Me" id="about" index={1} className="fade-in-section">
        <div className="glass-panel p-8 md:p-10 rounded-3xl">
          <p className="text-lg md:text-xl text-(--text-secondary) leading-relaxed">
            {profile.about}
          </p>
        </div>
      </Section>

      {/* ── Experience ────────────────────────────────────────── */}
      <Section title="Experiences" id="experiences" index={2} className="fade-in-section">
        {/* Timeline connector line */}
        <div className="relative space-y-4">
          <div className="absolute left-5 top-8 bottom-8 w-px bg-linear-to-b from-(--accent)/25 via-(--accent)/10 to-transparent pointer-events-none" />
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={index}
              company={exp.company}
              position={exp.position}
              period={exp.period}
              description={exp.description}
              type={exp.type}
            />
          ))}
        </div>
      </Section>

      {/* ── Projects ──────────────────────────────────────────── */}
      <Section title="Featured Projects" id="projects" index={3} className="fade-in-section">
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

      {/* ── Photography albums ────────────────────────────────── */}
      <Section id="photos" index={4} className="fade-in-section">
        <div className="flex items-center gap-4 mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-(--accent)/10 text-(--accent)">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest mb-1 opacity-60">04</p>
            <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary)">Photography</h2>
            <p className="text-(--text-muted) text-sm">Capturing moments & frames</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {photoAlbums.map((album, index) => (
            <div
              key={album.title}
              className={
                !showAllEvents
                  ? index >= 9
                    ? 'hidden'
                    : index >= 3
                      ? 'hidden md:block'
                      : ''
                  : ''
              }
            >
              <PhotoAlbumCard
                title={album.title}
                date={album.date}
                url={album.url}
                location={'location' in album ? album.location : undefined}
              />
            </div>
          ))}
        </div>

        {!showAllEvents && photoAlbums.length > 3 && (
          <div className={`flex justify-center mt-6 ${photoAlbums.length > 9 ? '' : 'md:hidden'}`}>
            <button
              onClick={() => setShowAllEvents(true)}
              className="px-6 py-2 rounded-full border border-(--border) hover:bg-(--accent)/5 hover:border-(--accent)/30 text-sm font-medium transition-all duration-200"
            >
              Show More Events
            </button>
          </div>
        )}
      </Section>

      {/* ── Recent Shots ──────────────────────────────────────── */}
      <section id="recent-shots" className="py-16 fade-in-section">
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-(--accent)/10 text-(--accent)">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest mb-1 opacity-60">05</p>
              <h2 className="text-3xl md:text-4xl font-bold text-(--text-primary)">Recent Shots</h2>
              <p className="text-(--text-muted) text-sm">Random photos from my gallery</p>
            </div>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="h-100 w-full flex items-center justify-center text-(--text-muted)">
              <div className="w-8 h-8 border-4 border-(--accent)/20 border-t-(--accent) rounded-full animate-spin" />
            </div>
          }
        >
          <Await promise={randomPhotosPromise}>
            {(data: any) => {
              const photos = data?.photos ?? []
              return photos.length > 0 ? (
                <div className="-mx-16 overflow-hidden">
                  <PhotoSlideshow photos={photos} />
                </div>
              ) : null
            }}
          </Await>
        </Suspense>
      </section>

      {/* ── SSH ───────────────────────────────────────────────── */}
      <Section title="SSH Access" id="ssh" index={6} className="fade-in-section">
        <div className="glass-panel p-8 md:p-10 rounded-3xl space-y-6">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-(--accent)/10 text-(--accent)">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-(--text-primary) mb-2">
                For the Brave Souls 😎
              </h3>
              <p className="text-(--text-secondary) mb-6">
                {sshKey.description}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-(--text-primary) mb-2">
                    Quick Add (One-liner):
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <code className="flex-1 p-3 bg-(--bg-secondary) rounded-lg text-sm font-mono text-(--text-secondary) overflow-x-auto border border-(--border) min-w-0">
                      {sshKey.oneLiner}
                    </code>
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText(sshKey.oneLiner)
                        const btn = e.currentTarget
                        const orig = btn.textContent
                        btn.textContent = '✓'
                        setTimeout(() => { btn.textContent = orig }, 2000)
                      }}
                      className="sm:self-start px-4 py-2 bg-(--accent) hover:bg-(--accent-hover) text-white rounded-lg text-sm font-medium transition-colors shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--text-primary) mb-2">
                    Public Key:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <code className="flex-1 p-3 bg-(--bg-secondary) rounded-lg text-xs font-mono text-(--text-secondary) overflow-x-auto break-all border border-(--border) min-w-0">
                      {sshKey.publicKey}
                    </code>
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText(sshKey.publicKey)
                        const btn = e.currentTarget
                        const orig = btn.textContent
                        btn.textContent = '✓'
                        setTimeout(() => { btn.textContent = orig }, 2000)
                      }}
                      className="sm:self-start px-4 py-2 bg-(--accent) hover:bg-(--accent-hover) text-white rounded-lg text-sm font-medium transition-colors shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Footer / Contact ──────────────────────────────────── */}
      <footer id="contact" className="py-32 text-center fade-in-section">
        {/* Separator */}
        <div className="max-w-xs mx-auto mb-16">
          <div className="h-px bg-linear-to-r from-transparent via-(--border) to-transparent" />
        </div>
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest opacity-60">07</p>
          <h2 className="text-4xl md:text-5xl font-bold text-(--text-primary)">
            Let's Connect
          </h2>
          <p className="text-(--text-secondary) max-w-sm mx-auto">
            Whether it's a project, a question, or just a hello — my inbox is open.
          </p>
          <div className="pt-2">
            <SocialLinks links={socials} className="justify-center" />
          </div>
          <p className="text-xs text-(--text-muted) pt-6 opacity-60">
            © {new Date().getFullYear()} {profile.name} · Built with TanStack Start
          </p>
        </div>
      </footer>

      <JumpNavigation sections={SECTIONS} />

      {photoMode && (
        <PhotoMode photosPromise={randomPhotosPromise} onExit={() => setPhotoMode(false)} />
      )}
    </div>
  )
}
