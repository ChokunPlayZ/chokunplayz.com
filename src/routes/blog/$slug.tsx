import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Tags } from 'lucide-react'
import { getBlogPostBySlug } from '@/lib/blog'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => ({
    post: getBlogPostBySlug(params.slug),
  }),
  component: BlogPostPage,
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

function readingTime(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function BlogPostPage() {
  const { post } = Route.useLoaderData()

  if (!post) {
    return (
      <main className="min-h-screen gradient-bg px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="glass-panel rounded-3xl p-8 space-y-4">
            <h1 className="text-3xl font-bold text-(--text-primary)">
              Post not found
            </h1>
            <p className="text-(--text-secondary)">
              This post does not exist or is not published.
            </p>
            <Link
              to="/blog"
              search={{ page: 1 }}
              className="inline-flex items-center gap-2 text-(--accent) hover:brightness-110 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to blog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const mins = readingTime(post.html)

  return (
    <main className="min-h-screen gradient-bg px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          to="/blog"
          search={{ page: 1 }}
          className="mb-10 inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--accent) transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All posts
        </Link>

        <article className="glass-panel rounded-3xl p-8 md:p-12 relative">
          {/* Top accent */}
          <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-(--accent)/35 to-transparent pointer-events-none" />

          <header className="mb-10 space-y-4 pb-8 border-b border-(--border)">
            <h1 className="text-2xl md:text-4xl font-bold text-(--text-primary) leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-(--text-muted)">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="text-(--border)">·</span>
              <span>{mins} min read</span>
              {post.tags.length > 0 && (
                <>
                  <span className="text-(--border)">·</span>
                  <span className="inline-flex items-center gap-1.5 flex-wrap">
                    <Tags className="h-3.5 w-3.5" />
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-(--accent)/10 text-(--accent) border border-(--accent)/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </>
              )}
            </div>
            {post.summary && (
              <p className="text-(--text-secondary) leading-relaxed border-l-2 border-(--accent)/40 pl-4 italic">
                {post.summary}
              </p>
            )}
          </header>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <footer className="mt-12 pt-8 border-t border-(--border)">
            <Link
              to="/blog"
              search={{ page: 1 }}
              className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--accent) transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </Link>
          </footer>
        </article>
      </div>
    </main>
  )
}
