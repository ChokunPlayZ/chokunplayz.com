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
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed)
}

function BlogPostPage() {
  const { post } = Route.useLoaderData()

  if (!post) {
    return (
      <main className="min-h-screen gradient-bg px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="glass-panel rounded-3xl p-8 space-y-4">
            <h1 className="text-3xl font-bold text-(--text-primary)">Post not found</h1>
            <p className="text-(--text-secondary)">
              This post does not exist or is not published.
            </p>
            <Link
              to="/blog"
              search={{ page: 1 }}
              className="inline-flex items-center gap-2 text-(--accent) hover:brightness-110"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to blog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen gradient-bg px-6 py-20 md:py-28">
      <article className="mx-auto max-w-5xl glass-panel rounded-3xl p-8 md:p-10">
        <Link
          to="/blog"
          search={{ page: 1 }}
          className="mb-8 inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--accent) transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        <header className="mb-8 space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-(--text-primary)">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-(--text-muted)">
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
        </header>

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  )
}
