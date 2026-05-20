'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Book, ChevronLeft, ChevronRight, Eye, Share2 } from 'lucide-react'
import type { BibleBookSummary } from '@/lib/bible-catalog'
import type { ChapterData } from '@/lib/chapter-loader'

type AgeRange = '5-7' | '8-10'

interface ChapterNavigation {
  book: BibleBookSummary | null
  previousChapter: number | null
  nextChapter: number | null
}

interface BibleChapterClientProps {
  book: string
  chapter: ChapterData
  navigation: ChapterNavigation
}

const AGE_STORAGE_KEY = 'kids-bible-age-range'

function getAgeText(chapter: ChapterData, age: AgeRange, verseIndex: number) {
  const verse = chapter.verses[verseIndex]
  return age === '5-7' ? verse.ages5to7 : verse.ages8to10
}

export function BibleChapterClient({ book, chapter, navigation }: BibleChapterClientProps) {
  const [selectedAge, setSelectedAge] = useState<AgeRange>('5-7')

  useEffect(() => {
    const savedAge = window.localStorage.getItem(AGE_STORAGE_KEY)
    if (savedAge === '5-7' || savedAge === '8-10') {
      setSelectedAge(savedAge)
    }
  }, [])

  function chooseAge(age: AgeRange) {
    setSelectedAge(age)
    window.localStorage.setItem(AGE_STORAGE_KEY, age)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <header className="border-b border-blue-100 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/bible"
                className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {chapter.book} {chapter.chapter}
                </h1>
                <p className="text-sm text-gray-600">Children&apos;s Bible Version</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => chooseAge('5-7')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedAge === '5-7' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Ages 5-7
              </button>
              <button
                type="button"
                onClick={() => chooseAge('8-10')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedAge === '8-10' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Ages 8-10
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          {navigation.previousChapter === null ? (
            <div className="flex cursor-not-allowed items-center space-x-2 text-gray-400">
              <ChevronLeft className="h-5 w-5" />
              <span>Previous Chapter</span>
            </div>
          ) : (
            <Link
              href={`/bible/${book}/${navigation.previousChapter}`}
              className="flex items-center space-x-2 text-blue-600 transition-colors hover:text-blue-800"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous Chapter</span>
            </Link>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">Chapter {chapter.chapter}</p>
          </div>

          {navigation.nextChapter === null ? (
            <div className="flex cursor-not-allowed items-center space-x-2 text-gray-400">
              <span>Next Chapter</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          ) : (
            <Link
              href={`/bible/${book}/${navigation.nextChapter}`}
              className="flex items-center space-x-2 text-blue-600 transition-colors hover:text-blue-800"
            >
              <span>Next Chapter</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          )}
        </div>

        <div className="mb-12 space-y-6">
          {chapter.verses.map((verse, index) => (
            <div key={verse.number} className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <span className="font-bold text-blue-600">{verse.number}</span>
                </div>
                <div className="flex-grow">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">{verse.reference}</span>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg leading-relaxed text-gray-800">
                      {getAgeText(chapter, selectedAge, index) ?? 'Text unavailable for this age range.'}
                    </p>
                  </div>

                  {verse.original && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        <Eye className="mr-1 inline h-4 w-4" />
                        Original Text
                      </summary>
                      <div className="mt-2 rounded bg-gray-50 p-3 text-sm italic text-gray-700">
                        {verse.original}
                      </div>
                    </details>
                  )}

                  {verse.keyVocabulary && verse.keyVocabulary.length > 0 && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        <Book className="mr-1 inline h-4 w-4" />
                        Key Words
                      </summary>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {verse.keyVocabulary.map((word, vocabIndex) => (
                          <div
                            key={`${verse.number}-vocab-${vocabIndex}`}
                            className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700"
                          >
                            {word}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {verse.crossReferences && verse.crossReferences.length > 0 && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        <Share2 className="mr-1 inline h-4 w-4" />
                        Related Verses
                      </summary>
                      <div className="mt-2 space-y-1">
                        {verse.crossReferences.map((ref, refIndex) => (
                          <div
                            key={`${verse.number}-ref-${refIndex}`}
                            className="cursor-pointer text-sm text-gray-700 hover:text-blue-600"
                          >
                            {ref}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {chapter.summary && (
          <div className="mb-8 rounded-lg bg-green-50 p-6">
            <h2 className="mb-3 text-xl font-semibold text-green-800">Chapter Summary</h2>
            <p className="text-green-700">{chapter.summary}</p>
          </div>
        )}

        {chapter.keyLessons && chapter.keyLessons.length > 0 && (
          <div className="mb-8 rounded-lg bg-purple-50 p-6">
            <h2 className="mb-3 text-xl font-semibold text-purple-800">Key Lessons</h2>
            <ul className="space-y-2">
              {chapter.keyLessons.map((lesson, lessonIndex) => (
                <li key={`lesson-${lessonIndex}`} className="flex items-start text-purple-700">
                  <span className="mr-2 text-purple-500">-</span>
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        )}

        {chapter.memoryVerses && (
          <div className="mb-8 rounded-lg bg-yellow-50 p-6">
            <h2 className="mb-3 text-xl font-semibold text-yellow-800">Memory Verse</h2>
            <p className="font-medium italic text-yellow-700">
              {selectedAge === '5-7' ? chapter.memoryVerses.ages5to7 : chapter.memoryVerses.ages8to10}
            </p>
          </div>
        )}

        {chapter.discussionQuestions && (
          <div className="mb-8 rounded-lg bg-blue-50 p-6">
            <h2 className="mb-3 text-xl font-semibold text-blue-800">Discussion Questions</h2>
            <ol className="space-y-2">
              {(selectedAge === '5-7'
                ? chapter.discussionQuestions.ages5to7
                : chapter.discussionQuestions.ages8to10
              ).map((question, questionIndex) => (
                <li key={`question-${questionIndex}`} className="text-blue-700">
                  {question}
                </li>
              ))}
            </ol>
          </div>
        )}

        {chapter.prayer && (
          <div className="rounded-lg bg-pink-50 p-6 text-center">
            <h2 className="mb-3 text-xl font-semibold text-pink-800">Prayer</h2>
            <p className="italic text-pink-700">{chapter.prayer}</p>
          </div>
        )}
      </main>
    </div>
  )
}
