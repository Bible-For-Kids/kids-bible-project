'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Book, BookOpen, ChevronLeft, ChevronRight, Eye, List, Share2 } from 'lucide-react'
import type { BibleBookSummary } from '@/lib/bible-catalog'
import type { ChapterData } from '@/lib/chapter-loader'

type AgeRange = '5-7' | '8-10'
type ReaderMode = 'read' | 'study'
type Verse = ChapterData['verses'][number]
type VerseIllustration = NonNullable<Verse['illustration']>

interface VocabularyHint {
  term: string
  terms: string[]
  canonicalTerm: string
  definition: string
}

interface KeywordAnnotation {
  start: number
  end: number
  hint: VocabularyHint
}

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
const MODE_STORAGE_KEY = 'kids-bible-reader-mode'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function getAgeText(chapter: ChapterData, age: AgeRange, verseIndex: number) {
  const verse = chapter.verses[verseIndex]
  return age === '5-7' ? verse.ages5to7 : verse.ages8to10
}

function normalizeTerm(term: string) {
  return term.trim().toLowerCase().replace(/\s+/g, ' ')
}

function getUniqueTerms(terms: string[]) {
  const seenTerms = new Set<string>()
  const uniqueTerms: string[] = []

  for (const term of terms) {
    const normalizedTerm = normalizeTerm(term)
    if (!normalizedTerm || seenTerms.has(normalizedTerm)) continue

    seenTerms.add(normalizedTerm)
    uniqueTerms.push(term.trim())
  }

  return uniqueTerms
}

function getTermVariants(term: string) {
  const normalizedTerm = normalizeTerm(term)
  const variants = [term]

  if (normalizedTerm === 'walked with god') {
    variants.push('walked faithfully with God')
  }

  if (normalizedTerm === 'wickedness') {
    variants.push('human evil')
  }

  if (normalizedTerm === 'grief') {
    variants.push('grieved')
  }

  if (normalizedTerm === 'death') {
    variants.push('died')
  }

  return variants
}

function parseVocabularyHint(item: string): VocabularyHint | null {
  const separatorIndex = item.indexOf(':')
  if (separatorIndex === -1) return null

  const rawTerms = item
    .slice(0, separatorIndex)
    .split(/\s*(?:\||\/)\s*/)
    .map(term => term.trim())
    .filter(Boolean)
  const definition = item.slice(separatorIndex + 1).trim()
  if (!rawTerms.length || !definition) return null

  const term = rawTerms[0]
  const terms = getUniqueTerms(rawTerms.flatMap(getTermVariants))

  return {
    term,
    terms,
    canonicalTerm: normalizeTerm(term),
    definition,
  }
}

function getVocabularyHintsFromItems(items: string[] | undefined) {
  const seenTerms = new Set<string>()

  return (items ?? []).reduce<VocabularyHint[]>((hints, item) => {
    const hint = parseVocabularyHint(item)
    const normalizedTerm = hint?.canonicalTerm

    if (!hint || !normalizedTerm || seenTerms.has(normalizedTerm)) {
      return hints
    }

    seenTerms.add(normalizedTerm)
    return [...hints, hint]
  }, [])
}

function getVocabularyHints(verse: Verse) {
  return getVocabularyHintsFromItems(verse.keyVocabulary)
}

function mergeVocabularyHints(...hintGroups: VocabularyHint[][]) {
  const seenTerms = new Set<string>()
  const hints: VocabularyHint[] = []

  for (const group of hintGroups) {
    for (const hint of group) {
      if (seenTerms.has(hint.canonicalTerm)) continue

      seenTerms.add(hint.canonicalTerm)
      hints.push(hint)
    }
  }

  return hints
}

function getReadingGroupSize(age: AgeRange) {
  return age === '5-7' ? 3 : 4
}

function getReadingParagraphs(verses: Verse[], age: AgeRange) {
  const groupSize = getReadingGroupSize(age)
  const paragraphs: Verse[][] = []

  for (let index = 0; index < verses.length; index += groupSize) {
    paragraphs.push(verses.slice(index, index + groupSize))
  }

  return paragraphs
}

function getPublicAssetSrc(src: string) {
  return src.startsWith('/') ? `${BASE_PATH}${src}` : src
}

function getParagraphIllustrations(paragraph: Verse[]) {
  return paragraph
    .map(verse => verse.illustration)
    .filter((illustration): illustration is VerseIllustration => Boolean(illustration))
}

function VerseIllustrationFigure({
  illustration,
  compact = false,
}: {
  illustration: VerseIllustration
  compact?: boolean
}) {
  return (
    <figure className={compact ? 'mt-5' : 'space-y-2'}>
      <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-100">
        <Image
          src={getPublicAssetSrc(illustration.src)}
          alt={illustration.alt}
          width={1200}
          height={675}
          loading="lazy"
          unoptimized
          sizes={compact ? '(min-width: 768px) 720px, 100vw' : '(min-width: 768px) 50vw, 100vw'}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>
      {illustration.caption && (
        <figcaption className="px-1 text-sm leading-6 text-slate-600">
          {illustration.caption}
        </figcaption>
      )}
    </figure>
  )
}

function isWordBoundary(character: string | undefined) {
  return !character || !/[A-Za-z0-9]/.test(character)
}

function overlapsExistingAnnotation(start: number, end: number, annotations: KeywordAnnotation[]) {
  return annotations.some(annotation => start < annotation.end && end > annotation.start)
}

function getLongestHintTermLength(hint: VocabularyHint) {
  return Math.max(...hint.terms.map(term => term.length))
}

function findHintMatch(text: string, hint: VocabularyHint, annotations: KeywordAnnotation[]) {
  const normalizedText = text.toLowerCase()
  const longestTermsFirst = [...hint.terms].sort((first, second) => second.length - first.length)
  let bestMatch: { start: number; end: number } | null = null

  for (const term of longestTermsFirst) {
    const normalizedTerm = normalizeTerm(term)
    let searchIndex = 0

    while (searchIndex < text.length) {
      const start = normalizedText.indexOf(normalizedTerm, searchIndex)
      if (start === -1) break

      const end = start + normalizedTerm.length
      if (
        isWordBoundary(text[start - 1]) &&
        isWordBoundary(text[end]) &&
        !overlapsExistingAnnotation(start, end, annotations) &&
        (!bestMatch || start < bestMatch.start || (start === bestMatch.start && end - start > bestMatch.end - bestMatch.start))
      ) {
        bestMatch = { start, end }
        break
      }

      searchIndex = start + 1
    }
  }

  return bestMatch
}

function findKeywordAnnotations(text: string, hints: VocabularyHint[]) {
  const annotations: KeywordAnnotation[] = []
  const longestHintsFirst = [...hints].sort(
    (first, second) => getLongestHintTermLength(second) - getLongestHintTermLength(first)
  )

  for (const hint of longestHintsFirst) {
    const match = findHintMatch(text, hint, annotations)
    if (match) {
      annotations.push({ ...match, hint })
    }
  }

  return annotations.sort((first, second) => first.start - second.start)
}

function getReadModeHintPlan(chapter: ChapterData, age: AgeRange) {
  const chapterHints = getVocabularyHintsFromItems(chapter.importantKeywords)
  const usedTerms = new Set<string>()
  const plan: Record<number, VocabularyHint[]> = {}

  chapter.verses.forEach((verse, index) => {
    const text = getAgeText(chapter, age, index)
    if (!text) return

    const verseHints = getVocabularyHints(verse)
    const availableHints = mergeVocabularyHints(verseHints, chapterHints)
    const plannedHints: VocabularyHint[] = []

    for (const hint of availableHints) {
      if (usedTerms.has(hint.canonicalTerm)) continue
      if (!findHintMatch(text, hint, [])) continue

      plannedHints.push(hint)
      usedTerms.add(hint.canonicalTerm)
    }

    if (plannedHints.length) {
      plan[verse.number] = plannedHints
    }
  })

  return plan
}

function AnnotatedVerseText({
  text,
  hints,
  annotationIdPrefix,
}: {
  text: string
  hints: VocabularyHint[]
  annotationIdPrefix: string
}) {
  const annotations = findKeywordAnnotations(text, hints)

  if (!annotations.length) {
    return <>{text}</>
  }

  const parts: ReactNode[] = []
  let cursor = 0

  annotations.forEach((annotation, annotationIndex) => {
    if (annotation.start > cursor) {
      parts.push(text.slice(cursor, annotation.start))
    }

    const followingPunctuation = /[.,;:!?]/.test(text[annotation.end] ?? '') ? text[annotation.end] : ''
    const displayedTerm = `${text.slice(annotation.start, annotation.end)}${followingPunctuation}`
    const tooltipId = `${annotationIdPrefix}-hint-${annotationIndex}`

    parts.push(
      <span key={tooltipId} className="group relative inline-flex items-baseline">
        <span>{displayedTerm}</span>
        <sup className="ml-0.5">
          <button
            type="button"
            aria-describedby={tooltipId}
            aria-label={`${annotation.hint.term}: ${annotation.hint.definition}`}
            className="inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-1 text-[0.625rem] font-bold leading-none text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-100 focus-visible"
          >
            ?
          </button>
        </sup>
        <span
          id={tooltipId}
          role="tooltip"
          className="fixed bottom-4 left-4 right-4 z-20 hidden rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm font-normal leading-5 text-slate-700 shadow-lg group-hover:block group-focus-within:block sm:absolute sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-full sm:mt-2 sm:w-60 sm:max-w-[calc(100vw-2rem)] sm:-translate-x-1/2"
        >
          <span className="block font-semibold text-slate-950">{annotation.hint.term}</span>
          <span>{annotation.hint.definition}</span>
        </span>
      </span>
    )

    cursor = annotation.end + followingPunctuation.length
  })

  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }

  return <>{parts}</>
}

export function BibleChapterClient({ book, chapter, navigation }: BibleChapterClientProps) {
  const [selectedAge, setSelectedAge] = useState<AgeRange>('5-7')
  const [readerMode, setReaderMode] = useState<ReaderMode>('read')

  useEffect(() => {
    const savedAge = window.localStorage.getItem(AGE_STORAGE_KEY)
    if (savedAge === '5-7' || savedAge === '8-10') {
      setSelectedAge(savedAge)
    }

    const savedMode = window.localStorage.getItem(MODE_STORAGE_KEY)
    if (savedMode === 'read' || savedMode === 'study') {
      setReaderMode(savedMode)
    }
  }, [])

  function chooseAge(age: AgeRange) {
    setSelectedAge(age)
    window.localStorage.setItem(AGE_STORAGE_KEY, age)
  }

  function chooseMode(mode: ReaderMode) {
    setReaderMode(mode)
    window.localStorage.setItem(MODE_STORAGE_KEY, mode)
  }

  const readingParagraphs = getReadingParagraphs(chapter.verses, selectedAge)
  const readingGroupSize = getReadingGroupSize(selectedAge)
  const readModeHintPlan = getReadModeHintPlan(chapter, selectedAge)

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

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1" aria-label="Reading age">
                <button
                  type="button"
                  aria-pressed={selectedAge === '5-7'}
                  onClick={() => chooseAge('5-7')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    selectedAge === '5-7' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Ages 5-7
                </button>
                <button
                  type="button"
                  aria-pressed={selectedAge === '8-10'}
                  onClick={() => chooseAge('8-10')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    selectedAge === '8-10' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Ages 8-10
                </button>
              </div>

              <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1" aria-label="Reader mode">
                <button
                  type="button"
                  aria-pressed={readerMode === 'read'}
                  onClick={() => chooseMode('read')}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    readerMode === 'read' ? 'bg-slate-900 text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Read
                </button>
                <button
                  type="button"
                  aria-pressed={readerMode === 'study'}
                  onClick={() => chooseMode('study')}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    readerMode === 'study' ? 'bg-slate-900 text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                  Study
                </button>
              </div>
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

        {readerMode === 'read' ? (
          <article className="mb-12 rounded-lg bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-10">
            <div className="mx-auto max-w-3xl space-y-8">
              {readingParagraphs.map((paragraph, paragraphIndex) => {
                const paragraphIllustrations = getParagraphIllustrations(paragraph)

                return (
                  <div key={`read-paragraph-${paragraphIndex}`} className="space-y-4">
                    <p
                      className={`font-story text-slate-900 ${
                        selectedAge === '5-7' ? 'text-xl leading-9' : 'text-lg leading-8'
                      }`}
                    >
                      {paragraph.map((verse, verseIndex) => {
                        const absoluteVerseIndex = readingGroupSize * paragraphIndex + verseIndex
                        const text = getAgeText(chapter, selectedAge, absoluteVerseIndex)

                        return (
                          <span key={`read-verse-${verse.number}`}>
                            <AnnotatedVerseText
                              text={text ?? 'Text unavailable for this age range.'}
                              hints={readModeHintPlan[verse.number] ?? []}
                              annotationIdPrefix={`verse-${verse.number}`}
                            />
                            {verseIndex < paragraph.length - 1 ? ' ' : null}
                          </span>
                        )
                      })}
                    </p>

                    {paragraphIllustrations.length > 0 && (
                      <div className={paragraphIllustrations.length > 1 ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4'}>
                        {paragraphIllustrations.map((illustration, illustrationIndex) => (
                          <VerseIllustrationFigure
                            key={`${paragraphIndex}-illustration-${illustrationIndex}`}
                            illustration={illustration}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </article>
        ) : (
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

                    {verse.illustration && (
                      <VerseIllustrationFigure illustration={verse.illustration} compact />
                    )}

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
        )}

        {readerMode === 'study' && chapter.summary && (
          <div className="mb-8 rounded-lg bg-green-50 p-6">
            <h2 className="mb-3 text-xl font-semibold text-green-800">Chapter Summary</h2>
            <p className="text-green-700">{chapter.summary}</p>
          </div>
        )}

        {readerMode === 'study' && chapter.keyLessons && chapter.keyLessons.length > 0 && (
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

        {readerMode === 'study' && chapter.memoryVerses && (
          <div className="mb-8 rounded-lg bg-yellow-50 p-6">
            <h2 className="mb-3 text-xl font-semibold text-yellow-800">Memory Verse</h2>
            <p className="font-medium italic text-yellow-700">
              {selectedAge === '5-7' ? chapter.memoryVerses.ages5to7 : chapter.memoryVerses.ages8to10}
            </p>
          </div>
        )}

        {readerMode === 'study' && chapter.discussionQuestions && (
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

        {readerMode === 'study' && chapter.prayer && (
          <div className="rounded-lg bg-pink-50 p-6 text-center">
            <h2 className="mb-3 text-xl font-semibold text-pink-800">Prayer</h2>
            <p className="italic text-pink-700">{chapter.prayer}</p>
          </div>
        )}
      </main>
    </div>
  )
}
