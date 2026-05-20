import Link from 'next/link'
import { BookOpen, ChevronRight, Library, Users } from 'lucide-react'
import { getBibleCatalog } from '@/lib/bible-catalog'

export default async function BibleIndexPage() {
  const catalog = await getBibleCatalog()
  const chapterCount = catalog.reduce((total, book) => total + book.chapters.length, 0)

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900">
                <ChevronRight className="h-4 w-4 rotate-180" />
                Home
              </Link>
              <h1 className="mt-3 text-3xl font-bold tracking-normal text-slate-950">Bible Reader</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Children&apos;s Bible Version</p>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Ages 5-7 and 8-10
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Library className="h-5 w-5 text-blue-700" />
                <span className="text-sm font-semibold">Books</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-950">{catalog.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <BookOpen className="h-5 w-5 text-blue-700" />
                <span className="text-sm font-semibold">Chapters</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-950">{chapterCount}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Users className="h-5 w-5 text-blue-700" />
                <span className="text-sm font-semibold">Reading Level</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-950">2 levels</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {catalog.length ? (
          <div className="space-y-8">
            {catalog.map(book => (
              <section key={book.slug} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">{book.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {book.chapters.length} chapter{book.chapters.length === 1 ? '' : 's'} available
                    </p>
                  </div>
                  <Link
                    href={`/bible/${book.slug}/${book.chapters[0]}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Start reading
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-10">
                  {book.chapters.map(chapter => (
                    <Link
                      key={`${book.slug}-${chapter}`}
                      href={`/bible/${book.slug}/${chapter}`}
                      className="flex aspect-square items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                    >
                      {chapter}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-4 text-xl font-bold text-slate-950">No Chapters Found</h2>
          </div>
        )}
      </section>
    </main>
  )
}
