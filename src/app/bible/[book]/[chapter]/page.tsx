import Link from 'next/link'
import { ChevronLeft, ChevronRight, Book, Eye, Share2 } from 'lucide-react'
import { loadChapterContent } from '@/lib/chapter-loader'
import type { ChapterData } from '@/lib/chapter-loader'

type VerseEntry = ChapterData['verses'][number]

function getAgeText(chapter: ChapterData, age: '5-7' | '8-10', verseIndex: number) {
  const verse = chapter.verses[verseIndex]
  return age === '5-7' ? verse.ages5to7 : verse.ages8to10
}

interface PageParams {
  params: {
    book: string
    chapter: string
  }
  searchParams?: {
    age?: string
  }
}

export default async function BibleChapterReader({ params, searchParams }: PageParams) {
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Chapter Not Found</h2>
          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const selectedAge = searchParams?.age === '8-10' ? '8-10' : '5-7'

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{chapter.book} {chapter.chapter}</h1>
                <p className="text-sm text-gray-600">Children&apos;s Bible Version</p>
              </div>
            </div>
            
            {/* Age Selector */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <Link
                href={`/bible/${book}/${chapterNumber}?age=5-7`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedAge === '5-7' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'}`}
              >
                Ages 5-7
              </Link>
              <Link
                href={`/bible/${book}/${chapterNumber}?age=8-10`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedAge === '8-10' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'}`}
              >
                Ages 8-10
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter Navigation */}
        <div className="flex items-center justify-between mb-8">
          {chapter.chapter === 1 ? (
            <div className="flex items-center space-x-2 text-gray-400 cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Chapter</span>
            </div>
          ) : (
            <Link
              href={`/bible/${book}/${chapter.chapter - 1}`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Chapter</span>
            </Link>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-600">Chapter {chapter.chapter}</p>
          </div>
          
          <Link
            href={`/bible/${book}/${chapter.chapter + 1}`}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Verses */}
        <div className="space-y-6 mb-12">
          {chapter.verses.map((verse: VerseEntry, index: number) => (
            <div key={verse.number} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{verse.number}</span>
                </div>
                <div className="flex-grow">
                  <div className="mb-2">
                    <span className="text-sm text-gray-500 font-medium">{verse.reference}</span>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-800 leading-relaxed text-lg">
                      {getAgeText(chapter!, selectedAge, index)}
                    </p>
                  </div>
                  
                  {/* Original Reference */}
                  <details className="mt-4">
                    <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                      <Eye className="inline w-4 h-4 mr-1" />
                      Original Text
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 italic">
                      {verse.original}
                    </div>
                  </details>

                  {/* Key Vocabulary */}
                  {verse.keyVocabulary && verse.keyVocabulary.length > 0 && (
                    <details className="mt-4">
                      <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                        <Book className="inline w-4 h-4 mr-1" />
                        Key Words
                      </summary>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {verse.keyVocabulary.map((word: string, vocabIndex: number) => (
                          <div key={`${verse.number}-vocab-${vocabIndex}`} className="text-sm bg-blue-50 px-3 py-1 rounded text-blue-700">
                            {word}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {/* Cross References */}
                  {verse.crossReferences && verse.crossReferences.length > 0 && (
                    <details className="mt-4">
                      <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                        <Share2 className="inline w-4 h-4 mr-1" />
                        Related Verses
                      </summary>
                      <div className="mt-2 space-y-1">
                        {verse.crossReferences.map((ref: string, refIndex: number) => (
                          <div key={`${verse.number}-ref-${refIndex}`} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
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

        {/* Chapter Summary */}
        {chapter.summary && (
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-3">Chapter Summary</h2>
            <p className="text-green-700">{chapter.summary}</p>
          </div>
        )}

        {/* Key Lessons */}
        {chapter.keyLessons && chapter.keyLessons.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-purple-800 mb-3">Key Lessons</h2>
            <ul className="space-y-2">
              {chapter.keyLessons.map((lesson: string, lessonIndex: number) => (
                <li key={`lesson-${lessonIndex}`} className="text-purple-700 flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Memory Verse */}
        {chapter.memoryVerses && (
          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-3">Memory Verse</h2>
            <p className="text-yellow-700 italic font-medium">
              {selectedAge === '5-7' ? chapter.memoryVerses.ages5to7 : chapter.memoryVerses.ages8to10}
            </p>
          </div>
        )}

        {/* Discussion Questions */}
        {chapter.discussionQuestions && (
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Discussion Questions</h2>
            <ol className="space-y-2">
              {(selectedAge === '5-7' ? chapter.discussionQuestions.ages5to7 : chapter.discussionQuestions.ages8to10).map((question: string, questionIndex: number) => (
                <li key={`question-${questionIndex}`} className="text-blue-700">
                  {question}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Prayer */}
        {chapter.prayer && (
          <div className="bg-pink-50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-pink-800 mb-3">Prayer</h2>
            <p className="text-pink-700 italic">{chapter.prayer}</p>
          </div>
        )}
      </main>
    </div>
  )
}
