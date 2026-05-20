import Link from 'next/link'
import { Book } from 'lucide-react'
import { getBibleCatalog, getChapterNavigation } from '@/lib/bible-catalog'
import { loadChapterContent } from '@/lib/chapter-loader'
import type { ChapterData } from '@/lib/chapter-loader'
import { BibleChapterClient } from './chapter-reader-client'

export async function generateStaticParams() {
  const catalog = await getBibleCatalog()

  return catalog.flatMap(book =>
    book.chapters.map(chapter => ({
      book: book.slug,
      chapter: String(chapter),
    }))
  )
}

interface PageParams {
  params: {
    book: string
    chapter: string
  }
}

export default async function BibleChapterReader({ params }: PageParams) {
  const book = params.book
  const chapterNumber = Number(params.chapter)

  let chapter: ChapterData | null = null
  try {
    chapter = await loadChapterContent(book, chapterNumber)
  } catch (err) {
    console.error('Failed to load chapter', err)
  }

  if (!chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-green-50">
        <div className="text-center">
          <Book className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Chapter Not Found</h2>
          <Link
            href="/bible"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const navigation = await getChapterNavigation(book, chapterNumber)

  return <BibleChapterClient book={book} chapter={chapter} navigation={navigation} />
}
