import Link from "next/link"

interface BlogPostCardProps {
  title: string
  date: string
  category: string
  excerpt: string
  slug: string
}

export function BlogPostCard({ title, date, category, excerpt, slug }: BlogPostCardProps) {
  return (
    <Link href={`/posts/${slug}`} className="block p-6 rounded-lg hover:bg-zinc-800 transition-colors duration-200">
      <h2 className="text-xl font-semibold text-zinc-50 mb-2">{title}</h2>
      <p className="text-sm text-zinc-400 mb-4">
        {date} · {category}
      </p>
      <p className="text-zinc-300 leading-relaxed line-clamp-3">{excerpt}</p>
    </Link>
  )
}
