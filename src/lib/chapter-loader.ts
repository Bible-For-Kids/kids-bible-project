import path from 'path'
import { promises as fs } from 'fs'

export interface VerseData {
  number: number
  reference: string
  original: string | null
  ages5to7: string | null
  ages8to10: string | null
  translationNotes?: string | null
  keyVocabulary?: string[]
  crossReferences?: string[]
  illustrationPrompt?: string | null
}

export interface ChapterData {
  book: string
  chapter: number
  verses: VerseData[]
  summary?: string | null
  keyLessons?: string[]
  memoryVerses?: Record<'ages5to7' | 'ages8to10', string | null>
  discussionQuestions?: Record<'ages5to7' | 'ages8to10', string[]>
  prayer?: string | null
}

type AgeRange = '5-7' | '8-10'

export async function loadChapterContent(bookSlug: string, chapterNumber: number): Promise<ChapterData> {
  const filePath = resolveChapterPath(bookSlug, chapterNumber)
  const rawContent = await readOptionalFile(filePath)
  const ageText = {
    ages5to7: await loadAgeTextMap(bookSlug, chapterNumber, '5-7'),
    ages8to10: await loadAgeTextMap(bookSlug, chapterNumber, '8-10'),
  }

  const supportVerses = rawContent ? parseVerses(rawContent) : []
  const verses = mergeAgeTextSources(
    supportVerses.length ? supportVerses : buildVersesFromAgeText(bookSlug, chapterNumber, ageText),
    ageText
  )

  if (!verses.length) {
    throw new Error(`No chapter content found for ${bookSlug} ${chapterNumber}`)
  }

  const summary = rawContent ? extractSection(rawContent, '## Chapter Summary')?.trim() ?? null : null
  const keyLessons = rawContent ? extractList(rawContent, '## Key Lessons for Children') : undefined
  const memoryVerses = rawContent ? extractMemoryVerses(rawContent) : undefined
  const discussionQuestions = rawContent ? extractDiscussionQuestions(rawContent) : undefined
  const prayer = rawContent ? extractSection(rawContent, '## Prayer')?.trim() ?? null : null

  return {
    book: capitalize(bookSlug),
    chapter: chapterNumber,
    verses,
    summary,
    keyLessons,
    memoryVerses,
    discussionQuestions,
    prayer,
  }
}

function resolveChapterPath(bookSlug: string, chapterNumber: number) {
  return path.join(
    process.cwd(),
    'content',
    'old-testament',
    bookSlug,
    `chapter-${chapterNumber}.md`
  )
}

async function readOptionalFile(filePath: string) {
  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'ENOENT') return null
    throw err
  }
}

function resolveAgeTextPath(bookSlug: string, chapterNumber: number, ageRange: AgeRange) {
  return path.join(
    process.cwd(),
    'content',
    'bible-text',
    `ages-${ageRange}`,
    'old-testament',
    bookSlug,
    `chapter-${chapterNumber}.md`
  )
}

async function loadAgeTextMap(bookSlug: string, chapterNumber: number, ageRange: AgeRange) {
  const filePath = resolveAgeTextPath(bookSlug, chapterNumber, ageRange)

  try {
    const rawContent = await fs.readFile(filePath, 'utf-8')
    return parseAgeTextVerses(rawContent)
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'ENOENT') return new Map<number, string>()
    throw err
  }
}

function parseAgeTextVerses(markdown: string) {
  const verseSection = extractSection(markdown, '## Verses') ?? markdown
  const verseRegex = /^###\s+(.+?\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+.+?\s+\d+:\d+\s*$|^##\s+|(?![\s\S]))/gm
  const verses = new Map<number, string>()
  let match

  while ((match = verseRegex.exec(verseSection)) !== null) {
    const numberMatch = match[1].match(/:(\d+)$/)
    if (!numberMatch) continue
    verses.set(Number(numberMatch[1]), match[2].trim())
  }

  return verses
}

function mergeAgeTextSources(
  verses: VerseData[],
  ageText: Record<'ages5to7' | 'ages8to10', Map<number, string>>
): VerseData[] {
  return verses.map(verse => ({
    ...verse,
    ages5to7: ageText.ages5to7.get(verse.number) ?? verse.ages5to7,
    ages8to10: ageText.ages8to10.get(verse.number) ?? verse.ages8to10,
  }))
}

function buildVersesFromAgeText(
  bookSlug: string,
  chapterNumber: number,
  ageText: Record<'ages5to7' | 'ages8to10', Map<number, string>>
): VerseData[] {
  const verseNumbers = new Set<number>([
    ...Array.from(ageText.ages5to7.keys()),
    ...Array.from(ageText.ages8to10.keys()),
  ])

  return Array.from(verseNumbers)
    .sort((a, b) => a - b)
    .map(number => ({
      number,
      reference: `${capitalize(bookSlug)} ${chapterNumber}:${number}`,
      original: null,
      ages5to7: ageText.ages5to7.get(number) ?? null,
      ages8to10: ageText.ages8to10.get(number) ?? null,
    }))
}

function parseVerses(markdown: string): VerseData[] {
  const verseSection = extractSection(markdown, '## Verse-by-Verse Translation') ?? markdown
  const verseRegex = /^###\s+(.+?\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+.+?\s+\d+:\d+\s*$|^##\s+|(?![\s\S]))/gm
  const verses: VerseData[] = []
  let match

  while ((match = verseRegex.exec(verseSection)) !== null) {
    const reference = match[1].trim()
    const body = match[2]
    const numberMatch = reference.match(/:(\d+)/)
    const verseNumber = numberMatch ? Number(numberMatch[1]) : verses.length + 1

    const original = extractLine(body, '**Original Reference**:')
    const ages5to7 = extractAgeSection(body, '5-7')
    const ages8to10 = extractAgeSection(body, '8-10')
    const translationNotes = extractLabeledBlock(body, '**Translation Notes**:')?.trim() ?? null
    const keyVocabulary = extractBulletList(body, '**Key Vocabulary**:')
    const crossReferences = extractBulletList(body, '**Cross-References**:')
    const illustrationPrompt = extractIllustrationPrompt(body)

    verses.push({
      number: verseNumber,
      reference,
      original,
      ages5to7,
      ages8to10,
      translationNotes,
      keyVocabulary,
      crossReferences,
      illustrationPrompt,
    })
  }

  return verses
}

function extractLine(block: string, label: string): string | null {
  const regex = new RegExp(`${escapeRegex(label)}\\s*(.+)`)
  const match = block.match(regex)
  return match ? match[1].trim() : null
}

function extractAgeSection(block: string, label: string): string | null {
  const regex = new RegExp(
    `^####\\s+Ages\\s+${escapeRegex(label)}\\s*\\r?\\n([\\s\\S]*?)(?=^####\\s+Ages\\s+|^\\*\\*|^<!--|^---\\s*$|^###\\s+|(?![\\s\\S]))`,
    'm'
  )
  const match = block.match(regex)
  return match ? match[1].trim() : null
}

function extractSection(content: string, heading: string): string | null {
  const regex = new RegExp(`${escapeRegex(heading)}\\s*\\r?\\n+([\\s\\S]*?)(?=\\r?\\n##\\s|(?![\\s\\S]))`, 'i')
  const match = content.match(regex)
  return match ? match[1].trim() : null
}

function extractLabeledBlock(content: string, label: string): string | null {
  const regex = new RegExp(
    `${escapeRegex(label)}\\s*\\r?\\n?([\\s\\S]*?)(?=^\\*\\*|^####|^###|^---\\s*$|^<!--|(?![\\s\\S]))`,
    'm'
  )
  const match = content.match(regex)
  return match ? match[1].trim() : null
}

function extractBulletList(content: string, heading: string): string[] | undefined {
  const regex = new RegExp(
    `${escapeRegex(heading)}\\s*\\r?\\n+([\\s\\S]*?)(?=^\\*\\*|^####|^###|^---\\s*$|^<!--|\\n\\s*\\n|(?![\\s\\S]))`,
    'm'
  )
  const match = content.match(regex)
  if (!match) return undefined

  const items = match[1]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.replace(/^-\s*/, '').trim())

  return items.length ? items : undefined
}

function extractIllustrationPrompt(block: string): string | null {
  const regex = /<!--\s*Illustration Prompt\s*-->([\s\S]*?)<!--\s*End Illustration Prompt\s*-->/
  const match = block.match(regex)
  return match ? match[1].trim() : null
}

function extractList(content: string, heading: string): string[] | undefined {
  const section = extractSection(content, heading)
  if (!section) return undefined

  const items = section
    .split('\n')
    .map(line => line.trim().replace(/^\d+\.\s*/, ''))
    .filter(Boolean)

  return items.length ? items : undefined
}

function extractMemoryVerses(content: string): Record<'ages5to7' | 'ages8to10', string | null> | undefined {
  const section = extractSection(content, '## Memory Verses by Age')
  if (!section) return undefined

  return {
    ages5to7: extractAgeBlock(section, '### Ages 5-7'),
    ages8to10: extractAgeBlock(section, '### Ages 8-10'),
  }
}

function extractDiscussionQuestions(content: string): Record<'ages5to7' | 'ages8to10', string[]> | undefined {
  const section = extractSection(content, '## Discussion Questions by Age')
  if (!section) return undefined

  const ages5to7 = extractNumberedList(section, '### Ages 5-7')
  const ages8to10 = extractNumberedList(section, '### Ages 8-10')

  return {
    ages5to7: ages5to7 ?? [],
    ages8to10: ages8to10 ?? [],
  }
}

function extractAgeBlock(content: string, heading: string): string | null {
  const regex = new RegExp(`${escapeRegex(heading)}\\s*\\r?\\n+([\\s\\S]*?)(?=^###\\s|(?![\\s\\S]))`, 'im')
  const match = content.match(regex)
  return match ? match[1].trim() : null
}

function extractNumberedList(content: string, heading: string): string[] | undefined {
  const block = extractAgeBlock(content, heading)
  if (!block) return undefined

  const items = block
    .split('\n')
    .map(line => line.trim().replace(/^\d+\.\s*/, ''))
    .filter(Boolean)

  return items.length ? items : undefined
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
