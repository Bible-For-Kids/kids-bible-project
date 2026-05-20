/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { BookOpen, Heart, Users, Palette } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 to-green-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bible Stories for Kids
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Free, open source Bible stories translated for children ages 5-12. 
            Simple language, beautiful illustrations, and engaging content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/bible/genesis/1" 
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Reading
            </Link>
            <Link 
              href="/about" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Kids Love Our Bible Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Read</h3>
              <p className="text-gray-600">
                Simple language perfect for each age group, from 5-7 years to 11-12 years.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Age-Appropriate</h3>
              <p className="text-gray-600">
                Content carefully crafted for each developmental stage with appropriate themes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive</h3>
              <p className="text-gray-600">
                Discussion questions, prayers, and activities help kids engage with each story.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful</h3>
              <p className="text-gray-600">
                Child-friendly illustrations designed to capture imagination and enhance learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
                <span className="text-6xl">🌍</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">The Creation Story</h3>
                <p className="text-gray-600 mb-4">
                  Learn how God created the world in seven days, from light to animals to people.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Genesis 1-2</span>
                  <Link href="/bible/genesis/1" className="text-blue-600 hover:text-blue-800">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-300 to-blue-400 flex items-center justify-center">
                <span className="text-6xl">⛵</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Noah's Ark</h3>
                <p className="text-gray-600 mb-4">
                  Discover how Noah built a great ark to save his family and the animals from the flood.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Genesis 6-9</span>
                  <Link href="/bible/genesis/6" className="text-blue-600 hover:text-blue-800">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center">
                <span className="text-6xl">🌟</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">David and Goliath</h3>
                <p className="text-gray-600 mb-4">
                  See how a young shepherd boy trusted God to defeat the giant Goliath.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">1 Samuel 17</span>
                  <Link href="/bible/1-samuel/17" className="text-blue-600 hover:text-blue-800">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/stories" 
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Age Groups */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Content for Every Age
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-2 border-blue-200 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Ages 5-7</h3>
              <p className="text-gray-600 mb-4">
                Simple sentences (3-5 words), concrete concepts, and familiar examples.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Very simple language</li>
                <li>• Short, clear sentences</li>
                <li>• Focus on basic concepts</li>
                <li>• Happy, reassuring tone</li>
              </ul>
            </div>
            
            <div className="border-2 border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Ages 8-10</h3>
              <p className="text-gray-600 mb-4">
                More complex sentences, introduction to abstract ideas, and storytelling.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Growing vocabulary</li>
                <li>• Simple compound sentences</li>
                <li>• Beginning abstract concepts</li>
                <li>• Moral lessons introduced</li>
              </ul>
            </div>
            
            <div className="border-2 border-purple-200 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Ages 11-12</h3>
              <p className="text-gray-600 mb-4">
                Full storytelling, complex narratives, and deeper spiritual lessons.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Rich vocabulary</li>
                <li>• Complex sentences</li>
                <li>• Abstract thinking</li>
                <li>• Deeper theological concepts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Help us make Bible stories accessible to children everywhere. 
            Whether you're a writer, developer, or parent, there's a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contribute" 
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              How to Contribute
            </Link>
            <Link 
              href="https://github.com/kids-bible-project" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
