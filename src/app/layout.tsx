import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { BookOpen } from 'lucide-react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  title: 'Kids Bible Project - Bible Stories for Children',
  description:
    'Free, open source Bible stories translated for kids ages 5-12. Simple language, beautiful illustrations, and engaging content.',
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
        <link rel="icon" type="image/svg+xml" href={`${basePath}/favicon.svg`} />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-blue-50 to-green-50`}>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-blue-100 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-green-400">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Kids Bible Project</h1>
                </div>
                <nav className="hidden space-x-8 md:flex">
                  <Link href="/" className="text-gray-700 transition-colors hover:text-blue-600">
                    Home
                  </Link>
                  <Link href="/bible" className="text-gray-700 transition-colors hover:text-blue-600">
                    Bible Reader
                  </Link>
                  <Link href="/bible/genesis/1" className="text-gray-700 transition-colors hover:text-blue-600">
                    Genesis
                  </Link>
                  <Link href="/bible/exodus/1" className="text-gray-700 transition-colors hover:text-blue-600">
                    Exodus
                  </Link>
                  <Link href="/bible/leviticus/1" className="text-gray-700 transition-colors hover:text-blue-600">
                    Leviticus
                  </Link>
                  <Link href="/bible/numbers/1" className="text-gray-700 transition-colors hover:text-blue-600">
                    Numbers
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-grow">{children}</main>

          <footer className="mt-12 border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">About</h3>
                  <p className="text-sm text-gray-600">
                    Making Bible stories accessible and engaging for children through age-aware Bible text.
                  </p>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/bible" className="text-blue-600 hover:text-blue-800">
                        Bible Reader
                      </Link>
                    </li>
                    <li>
                      <Link href="/bible/genesis/1" className="text-blue-600 hover:text-blue-800">
                        Genesis
                      </Link>
                    </li>
                    <li>
                      <Link href="/bible/exodus/1" className="text-blue-600 hover:text-blue-800">
                        Exodus
                      </Link>
                    </li>
                    <li>
                      <Link href="/bible/leviticus/1" className="text-blue-600 hover:text-blue-800">
                        Leviticus
                      </Link>
                    </li>
                    <li>
                      <Link href="/bible/numbers/1" className="text-blue-600 hover:text-blue-800">
                        Numbers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Community</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="https://github.com/Bible-For-Kids" className="text-blue-600 hover:text-blue-800">
                        GitHub Organization
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/Bible-For-Kids/kids-bible-project"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Project Repository
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                <p>Copyright 2026 Kids Bible Project. Licensed under MIT and Creative Commons.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
