/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Book, Eye, Share2 } from 'lucide-react'

interface Verse {
  number: number
  reference: string
  original: string
  ages5to7: string
  ages8to10: string
  translationNotes?: string
  keyVocabulary?: string[]
  crossReferences?: string[]
  illustrationPrompt?: string
}

interface Chapter {
  book: string
  chapter: number
  verses: Verse[]
  summary?: string
  keyLessons?: string[]
  memoryVerses?: {
    ages5to7: string
    ages8to10: string
  }
  discussionQuestions?: {
    ages5to7: string[]
    ages8to10: string[]
  }
  prayer?: string
}

export default function BibleReader() {
  const params = useParams()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [selectedAge, setSelectedAge] = useState<'5-7' | '8-10'>('5-7')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Parse book and chapter from URL params
  const book = params?.book as string
  const chapterNum = params?.chapter ? parseInt(params.chapter as string) : 1

  const loadChapter = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // In a real app, this would fetch from an API
      // For now, we'll simulate loading the Genesis Chapter 1 content
      if (book === 'genesis' && chapterNum === 1) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // This would normally come from the markdown file
        const mockChapter: Chapter = {
          book: 'Genesis',
          chapter: 1,
          verses: [
            {
              number: 1,
              reference: 'Genesis 1:1',
              original: 'In the beginning God created the heavens and the earth.',
              ages5to7: 'In the beginning, God made the sky and the ground.',
              ages8to10: 'In the beginning, God created the heavens and the earth.',
              keyVocabulary: ['Beginning', 'Created', 'Heavens', 'Earth'],
              crossReferences: ['John 1:1', 'Colossians 1:16', 'Hebrews 11:3']
            },
            {
              number: 2,
              reference: 'Genesis 1:2',
              original: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.',
              ages5to7: 'The earth was empty and didn\'t have a shape yet. There was complete darkness over the deep waters. And God\'s Spirit was hovering over the waters.',
              ages8to10: 'The earth was formless and empty, and darkness covered the deep waters. The Spirit of God was hovering over the waters.',
              keyVocabulary: ['Formless', 'Empty', 'Hovering', 'Spirit of God'],
              crossReferences: ['Job 26:13', 'Psalm 104:30']
            },
            {
              number: 3,
              reference: 'Genesis 1:3',
              original: 'And God said, "Let there be light," and there was light.',
              ages5to7: 'God said, "Let there be light!" And there was light.',
              ages8to10: 'And God said, "Let there be light," and there was light.',
              keyVocabulary: ['Light', 'Said'],
              crossReferences: ['John 1:3', '2 Corinthians 4:6', '1 John 1:5']
            }
            // Add more verses as needed
          ],
          summary: 'God created everything in six days and rested on the seventh day. Each day God evaluated His work as "good," showing that creation was perfect and complete.',
          keyLessons: [
            'God is Powerful: God created everything just by speaking',
            'God is Organized: God created things in an orderly way',
            'God is Good: Everything God made was good',
            'God Rests: Even God took time to rest and enjoy His work'
          ],
          memoryVerses: {
            ages5to7: 'In the beginning, God made the sky and the ground. - Genesis 1:1',
            ages8to10: 'In the beginning, God created the heavens and the earth. - Genesis 1:1'
          },
          discussionQuestions: {
            ages5to7: [
              'What did God make first?',
              'How many days did God take to make everything?',
              'What did God do on the seventh day?'
            ],
            ages8to10: [
              'Why do you think God created things in order?',
              'What does it mean that God saw His creation was "good"?',
              'How does this chapter show God\'s power?'
            ]
          },
          prayer: 'Dear God, thank you for creating this amazing world. Thank you for making the light, the sky, the land, and all living things. Help us to take care of your creation the way you intended. Amen.'
        }
        
        setChapter(mockChapter)
      } else {
        setError('Chapter not found')
      }
    } catch (err) {
      setError('Failed to load chapter')
      console.error('Error loading chapter:', err)
    } finally {
      setLoading(false)
    }
  }, [book, chapterNum])

  useEffect(() => {
    loadChapter()
  }, [loadChapter])

  const getVerseText = (verse: Verse) => {
    return selectedAge === '5-7' ? verse.ages5to7 : verse.ages8to10
  }

  const navigateToChapter = (newChapter: number) => {
    // In a real app, this would navigate to the new chapter
    window.location.href = `/bible/${book}/${newChapter}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapter...</p>
        </div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Chapter Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{chapter.book} {chapter.chapter}</h1>
                <p className="text-sm text-gray-600">Children&apos;s Bible Version</p>
              </div>
            </div>
            
            {/* Age Selector */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setSelectedAge('5-7')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedAge === '5-7' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Ages 5-7
              </button>
              <button
                onClick={() => setSelectedAge('8-10')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedAge === '8-10' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Ages 8-10
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Chapter Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateToChapter(chapter.chapter - 1)}
            disabled={chapter.chapter === 1}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous Chapter</span>
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">Chapter {chapter.chapter}</p>
          </div>
          
          <button
            onClick={() => navigateToChapter(chapter.chapter + 1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Verses */}
        <div className="space-y-6 mb-12">
          {chapter.verses.map((verse) => (
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
                      {getVerseText(verse)}
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
                        {verse.keyVocabulary.map((word, index) => (
                          <div key={index} className="text-sm bg-blue-50 px-3 py-1 rounded text-blue-700">
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
                        {verse.crossReferences.map((ref, index) => (
                          <div key={index} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
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
              {chapter.keyLessons.map((lesson, index) => (
                <li key={index} className="text-purple-700 flex items-start">
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
              {(selectedAge === '5-7' ? chapter.discussionQuestions.ages5to7 : chapter.discussionQuestions.ages8to10).map((question, index) => (
                <li key={index} className="text-blue-700">
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
