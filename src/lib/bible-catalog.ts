import path from 'path'
import { promises as fs } from 'fs'

export type AgeRange = '5-7' | '8-10'

export interface BibleBookSummary {
  testament: 'old-testament'
  slug: string
  name: string
  chapters: number[]
  ageRanges: AgeRange[]
}

const AGE_RANGES: AgeRange[] = ['5-7', '8-10']
const TESTAMENT = 'old-testament' as const
const BOOK_ORDER = ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy']

export async function getBibleCatalog(): Promise<BibleBookSummary[]> {
  const chaptersByBook = new Map<string, Set<number>>()
  const agesByBook = new Map<string, Set<AgeRange>>()

  for (const ageRange of AGE_RANGES) {
    const testamentPath = path.join(
      process.cwd(),
      'content',
      'bible-text',
      `ages-${ageRange}`,
      TESTAMENT
    )

    const books = await readDirectory(testamentPath)
    for (const book of books) {
      if (!book.isDirectory()) continue

      const chapterDir = path.join(testamentPath, book.name)
      const chapterFiles = await readDirectory(chapterDir)
      for (const file of chapterFiles) {
        if (!file.isFile()) continue

        const chapterMatch = file.name.match(/^chapter-(\d+)\.md$/)
        if (!chapterMatch) continue

        const chapterNumber = Number(chapterMatch[1])
        if (!chaptersByBook.has(book.name)) {
          chaptersByBook.set(book.name, new Set())
        }
        if (!agesByBook.has(book.name)) {
          agesByBook.set(book.name, new Set())
        }

        chaptersByBook.get(book.name)?.add(chapterNumber)
        agesByBook.get(book.name)?.add(ageRange)
      }
    }
  }

  return Array.from(chaptersByBook.entries())
    .map(([slug, chapters]) => ({
      testament: TESTAMENT,
      slug,
      name: formatBookName(slug),
      chapters: Array.from(chapters).sort((a, b) => a - b),
      ageRanges: Array.from(agesByBook.get(slug) ?? []).sort() as AgeRange[],
    }))
    .sort((a, b) => compareBooks(a.slug, b.slug))
}

export async function getChapterNavigation(bookSlug: string, chapterNumber: number) {
  const catalog = await getBibleCatalog()
  const book = catalog.find(entry => entry.slug === bookSlug)
  if (!book) {
    return { book: null, previousChapter: null, nextChapter: null }
  }

  const currentIndex = book.chapters.indexOf(chapterNumber)
  return {
    book,
    previousChapter: currentIndex > 0 ? book.chapters[currentIndex - 1] : null,
    nextChapter:
      currentIndex >= 0 && currentIndex < book.chapters.length - 1
        ? book.chapters[currentIndex + 1]
        : null,
  }
}

export function formatBookName(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function readDirectory(directory: string) {
  try {
    return await fs.readdir(directory, { withFileTypes: true })
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'ENOENT') return []
    throw err
  }
}

function compareBooks(first: string, second: string) {
  const firstIndex = BOOK_ORDER.indexOf(first)
  const secondIndex = BOOK_ORDER.indexOf(second)

  if (firstIndex !== -1 || secondIndex !== -1) {
    if (firstIndex === -1) return 1
    if (secondIndex === -1) return -1
    return firstIndex - secondIndex
  }

  return first.localeCompare(second)
}
