import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Tags } from 'lucide-react'
import { getBlogPosts } from '@/lib/blog'

const POSTS_PER_PAGE = 5

interface BlogSearch {
  page: number
}

function parsePositivePage(value: unknown): number {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isNaN(parsed) && parsed > 0) return parsed
  }
  return 1
}

export const Route = createFileRoute('/blog/')({
  validateSearch: (search): BlogSearch => ({
    page: parsePositivePage(search.page),
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => {
    const allPosts = getBlogPosts()
    const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))
    const page = Math.min(Math.max(deps.page, 1), totalPages)
    const start = (page - 1) * POSTS_PER_PAGE
    const posts = allPosts.slice(start, start + POSTS_PER_PAGE)
    return { posts, page, totalPages }
  },
  component: BlogIndexPage,
})

function formatDate(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed)
}

function BlogIndexPage() {
  const { posts, page, totalPages } = Route.useLoaderData()
  const hasPrevious = page > 1
  const hasNext = page < totalPages

  return (
    <main className="min-h-screen gradient-bg px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl space-y-10">

        {/* Header */}
        <header className="space-y-4">
          <Link
            to="/"
            search={{ 'photo-mode': false }}
            className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--accent) transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest opacity-60">Writing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) tracking-tight">
            Blog
          </h1>
          <p className="text-(--text-secondary) max-w-lg leading-relaxed">
            Notes about engineering, infrastructure, and whatever I'm currently learning.
          </p>
        </header>

        {/* Post list */}
        {posts.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-(--text-secondary)">
            No posts yet. Add a markdown file in <code className="text-(--accent)">src/content/blog</code> to publish one.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="glass-panel card-shine card-glow rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-(--accent)/25 to-transparent pointer-events-none" />

                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-(--text-muted)">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.date)}
                  </span>
                  {post.tags.length > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <Tags className="h-3.5 w-3.5" />
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-(--accent)/10 text-(--accent) border border-(--accent)/20 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200 mb-2">
                  <Link to="/blog/$slug" params={{ slug: post.slug }}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-(--text-secondary) text-sm leading-relaxed mb-4">{post.summary}</p>

                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--accent) hover:gap-2.5 transition-all duration-200"
                >
                  Read more
                  <span>→</span>
                </Link>
              </article>
            ))}

            {/* Pagination */}
            <nav className="flex items-center justify-between gap-4 pt-2">
              {hasPrevious ? (
                <Link
                  to="/blog"
                  search={{ page: page - 1 }}
                  className="inline-flex items-center gap-2 rounded-full border border-(--border) px-4 py-2 text-sm text-(--text-primary) hover:bg-(--accent)/10 hover:border-(--accent)/30 transition-all duration-200"
                >
                  ← Newer
                </Link>
              ) : <span />}

              <p className="text-xs text-(--text-muted)">
                Page {page} / {totalPages}
              </p>

              {hasNext ? (
                <Link
                  to="/blog"
                  search={{ page: page + 1 }}
                  className="inline-flex items-center gap-2 rounded-full border border-(--border) px-4 py-2 text-sm text-(--text-primary) hover:bg-(--accent)/10 hover:border-(--accent)/30 transition-all duration-200"
                >
                  Older →
                </Link>
              ) : <span />}
            </nav>
          </div>
        )}
      </div>
    </main>
  )
}
