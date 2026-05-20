import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kids Bible Project - Bible Stories for Children',
  description: 'Free, open source Bible stories translated for kids ages 5-12. Simple language, beautiful illustrations, and engaging content.',
  keywords: ['bible', 'children', 'kids', 'stories', 'christian', 'education', 'free'],
  authors: [{ name: 'Kids Bible Project Contributors' }],
  openGraph: {
    title: 'Kids Bible Project',
    description: 'Bible stories made simple and fun for children',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-blue-50 to-green-50`}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-white shadow-sm border-b border-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">📖</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Kids Bible Project</h1>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                  <a href="/stories" className="text-gray-700 hover:text-blue-600 transition-colors">Stories</a>
                  <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
                  <a href="/contribute" className="text-gray-700 hover:text-blue-600 transition-colors">Contribute</a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-600 text-sm">
                    Making Bible stories accessible and engaging for children ages 5-12 through simple language and beautiful illustrations.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/stories" className="text-blue-600 hover:text-blue-800">All Stories</a></li>
                    <li><a href="/parents" className="text-blue-600 hover:text-blue-800">Parent Guide</a></li>
                    <li><a href="/teachers" className="text-blue-600 hover:text-blue-800">Teacher Resources</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Community</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/contribute" className="text-blue-600 hover:text-blue-800">How to Contribute</a></li>
                    <li><a href="https://github.com/kids-bible-project" className="text-blue-600 hover:text-blue-800">GitHub</a></li>
                    <li><a href="/contact" className="text-blue-600 hover:text-blue-800">Contact Us</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>&copy; 2024 Kids Bible Project. Licensed under MIT and Creative Commons.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
