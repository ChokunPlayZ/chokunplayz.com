import { Link, createFileRoute } from '@tanstack/react-router'
import { Calendar, Tags } from 'lucide-react'
import { getBlogPosts } from '@/lib/blog'

const POSTS_PER_PAGE = 5

interface BlogSearch {
  page: number
}

function parsePositivePage(value: unknown): number {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  return 1
}

export const Route = createFileRoute('/blog/')({
  validateSearch: (search): BlogSearch => ({
    page: parsePositivePage(search.page),
  }),
  loaderDeps: ({ search }) => ({
    page: search.page,
  }),
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
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

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
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-(--text-primary)">
            Blog
          </h1>
          <p className="max-w-2xl text-(--text-secondary)">
            Notes about engineering, infra, and whatever I am currently learning.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-(--text-secondary)">
            No posts yet. Add a markdown file in `src/content/blog` to publish one.
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <article key={post.slug} className="glass-panel rounded-3xl p-6 md:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-(--text-muted)">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.date)}
                  </span>
                  {post.tags.length > 0 && (
                    <span className="inline-flex items-center gap-2">
                      <Tags className="h-4 w-4" />
                      {post.tags.join(' · ')}
                    </span>
                  )}
                </div>

                <h2 className="text-lg md:text-xl font-bold text-(--text-primary)">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="hover:text-(--accent) transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-3 text-(--text-secondary)">{post.summary}</p>
              </article>
            ))}

            <nav className="flex items-center justify-between gap-4 pt-2">
              {hasPrevious ? (
                <Link
                  to="/blog"
                  search={{ page: page - 1 }}
                  className="inline-flex items-center rounded-full border border-(--border) px-4 py-2 text-sm text-(--text-primary) hover:bg-(--accent)/10 transition-colors"
                >
                  Newer Posts
                </Link>
              ) : (
                <span />
              )}

              <p className="text-sm text-(--text-muted)">Page {page} of {totalPages}</p>

              {hasNext ? (
                <Link
                  to="/blog"
                  search={{ page: page + 1 }}
                  className="inline-flex items-center rounded-full border border-(--border) px-4 py-2 text-sm text-(--text-primary) hover:bg-(--accent)/10 transition-colors"
                >
                  Older Posts
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>
        )}
      </div>
    </main>
  )
}
