import { marked } from 'marked'

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  summary: string
  tags: Array<string>
  published: boolean
}

export interface BlogPost extends BlogPostMeta {
  content: string
  html: string
}

type FrontmatterValue = string | boolean | number | Array<string>

type Frontmatter = Record<string, FrontmatterValue>

marked.setOptions({
  gfm: true,
})

function parseValue(raw: string): FrontmatterValue {
  const trimmed = raw.trim()

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const content = trimmed.slice(1, -1).trim()
    if (!content) return []

    return content
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  if (/^(true|false)$/i.test(trimmed)) {
    return trimmed.toLowerCase() === 'true'
  }

  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed)
  }

  return trimmed
}

function parseFrontmatter(markdown: string): {
  frontmatter: Frontmatter
  body: string
} {
  const normalized = markdown.replace(/\r\n/g, '\n')

  if (!normalized.startsWith('---\n')) {
    return { frontmatter: {}, body: normalized }
  }

  const end = normalized.indexOf('\n---\n', 4)
  if (end === -1) {
    return { frontmatter: {}, body: normalized }
  }

  const rawFrontmatter = normalized.slice(4, end)
  const body = normalized.slice(end + 5).trim()

  const frontmatter: Frontmatter = {}

  for (const line of rawFrontmatter.split('\n')) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmedLine.indexOf(':')
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const value = trimmedLine.slice(separatorIndex + 1)

    if (!key) {
      continue
    }

    frontmatter[key] = parseValue(value)
  }

  return { frontmatter, body }
}

function getSlugFromPath(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? ''
  return fileName.replace(/\.md$/, '')
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '$1')
    .replace(/[>#*_~\-]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}

function extractSummary(content: string): string {
  const firstParagraph = content
    .split('\n\n')
    .map((part) => part.trim())
    .find(Boolean)

  const plain = stripMarkdown(firstParagraph ?? content)

  if (plain.length <= 180) {
    return plain
  }

  return `${plain.slice(0, 177).trimEnd()}...`
}

function parseDate(date: string): number {
  const timestamp = new Date(date).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function collectBlogPosts(): Array<BlogPost> {
  const modules = import.meta.glob('../content/blog/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  })

  const posts = Object.entries(modules).map(([filePath, markdown]) => {
    const { frontmatter, body } = parseFrontmatter(markdown)
    const slug = getSlugFromPath(filePath)
    const title = String(frontmatter.title ?? slug)
    const date = String(frontmatter.date ?? '1970-01-01')
    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags.map((tag) => String(tag))
      : []
    const published = frontmatter.published !== false
    const summary = String(frontmatter.summary ?? extractSummary(body))
    const html = marked.parse(body) as string

    return {
      slug,
      title,
      date,
      summary,
      tags,
      published,
      content: body,
      html,
    }
  })

  return posts.sort((a, b) => parseDate(b.date) - parseDate(a.date))
}

interface GetBlogPostsOptions {
  includeDrafts?: boolean
}

interface GetBlogPostBySlugOptions {
  includeDrafts?: boolean
}

export function getBlogPosts(
  options: GetBlogPostsOptions = {},
): Array<BlogPostMeta> {
  const { includeDrafts = false } = options

  return collectBlogPosts()
    .filter((post) => includeDrafts || post.published)
    .map(({ content, html, ...meta }) => meta)
}

export function getBlogPostBySlug(
  slug: string,
  options: GetBlogPostBySlugOptions = {},
): BlogPost | null {
  const { includeDrafts = false } = options

  const post = collectBlogPosts().find((entry) => {
    if (entry.slug !== slug) {
      return false
    }

    if (includeDrafts) {
      return true
    }

    return entry.published
  })

  return post ?? null
}
