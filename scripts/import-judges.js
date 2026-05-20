#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const { polishKidReadableText } = require('./lib/kids-bible-style')

const BOOK = 'Judges'
const BOOK_SLUG = 'judges'
const SOURCE_BASE = 'https://www.canonapi.com/v1/judges'
const EXPECTED_VERSE_COUNTS = [
  36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15,
  25, 20, 20, 31, 13, 31, 30, 48, 25,
]

async function main() {
  for (let chapter = 1; chapter <= EXPECTED_VERSE_COUNTS.length; chapter += 1) {
    const verses = await fetchChapter(chapter)
    const expectedCount = EXPECTED_VERSE_COUNTS[chapter - 1]
    if (verses.length !== expectedCount) {
      throw new Error(`Expected ${BOOK} ${chapter} to have ${expectedCount} verses, got ${verses.length}`)
    }

    await writeChapter(chapter, '5-7', verses.map((text, index) => adaptText(text, '5-7', `${BOOK} ${chapter}:${index + 1}`)))
    await writeChapter(chapter, '8-10', verses.map((text, index) => adaptText(text, '8-10', `${BOOK} ${chapter}:${index + 1}`)))
    console.log(`Wrote ${BOOK} ${chapter} (${verses.length} verses)`)
  }
}

async function fetchChapter(chapter) {
  const response = await fetch(`${SOURCE_BASE}/${chapter}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${BOOK} ${chapter}: ${response.status} ${response.statusText}`)
  }

  const verses = await response.json()
  if (!Array.isArray(verses) || !verses.length) {
    throw new Error(`No verses returned for ${BOOK} ${chapter}`)
  }

  return verses
}

async function writeChapter(chapter, ageRange, verses) {
  const directory = path.join(
    process.cwd(),
    'content',
    'bible-text',
    `ages-${ageRange}`,
    'old-testament',
    BOOK_SLUG
  )
  await fs.mkdir(directory, { recursive: true })

  const body = [
    `# ${BOOK} ${chapter}`,
    '',
    '## Book',
    BOOK,
    '',
    '## Chapter',
    String(chapter),
    '',
    '## Verses',
    '',
    ...verses.flatMap((text, index) => [
      `### ${BOOK} ${chapter}:${index + 1}`,
      text,
      '',
    ]),
  ].join('\n')

  await fs.writeFile(path.join(directory, `chapter-${chapter}.md`), body, 'utf8')
}

function adaptText(source, ageRange) {
  let text = normalizeSource(source)

  text = text
    .replace(/\bYahweh\b/g, 'the Lord')
    .replace(/\bchildren of Israel\b/gi, 'people of Israel')
    .replace(/\bchild of Israel\b/gi, 'person of Israel')
    .replace(/\bIsraelites\b/g, 'people of Israel')
    .replace(/\bIsraelite\b/g, 'person of Israel')
    .replace(/\bCanaanites\b/g, 'Canaanites')
    .replace(/\bthe land which\b/g, 'the land that')
    .replace(/\bwhich the Lord\b/g, 'that the Lord')
    .replace(/\bwhich I\b/g, 'that I')
    .replace(/\bwhich you\b/g, 'that you')
    .replace(/\bwhich he\b/g, 'that he')
    .replace(/\bwhich she\b/g, 'that she')
    .replace(/\bwhich they\b/g, 'that they')
    .replace(/\bwhich was\b/g, 'that was')
    .replace(/\bwhich were\b/g, 'that were')
    .replace(/\bthat which\b/g, 'what')
    .replace(/\bdid that was evil\b/g, 'did what was evil')
    .replace(/\bdid that which was evil\b/g, 'did what was evil')
    .replace(/\bin the sight of the Lord\b/g, "in the Lord's sight")
    .replace(/\bforsook\b/g, 'left')
    .replace(/\bserved Baal and Ashtaroth\b/g, 'served Baal and Ashtaroth, false gods')
    .replace(/\bBaalim\b/g, 'the Baals')
    .replace(/\bAshtaroth\b/g, 'the Ashtaroth')
    .replace(/\bstrange gods\b/g, 'false gods')
    .replace(/\bother gods\b/g, 'false gods')
    .replace(/\bwhoring after\b/g, 'chasing after')
    .replace(/\bprostituted themselves after\b/g, 'chased after')
    .replace(/\banger of the Lord was kindled\b/g, "Lord's anger burned")
    .replace(/\bdelivered them into the hand of\b/g, 'handed them over to')
    .replace(/\bsold them into the hand of\b/g, 'gave them over to')
    .replace(/\bhand of their enemies\b/g, 'power of their enemies')
    .replace(/\bhand of the enemy\b/g, 'power of the enemy')
    .replace(/\bhand of Midian\b/g, 'power of Midian')
    .replace(/\bhand of the Philistines\b/g, 'power of the Philistines')
    .replace(/\boppressors\b/g, 'cruel rulers')
    .replace(/\boppressor\b/g, 'cruel ruler')
    .replace(/\boppressed\b/g, 'treated harshly')
    .replace(/\boppress\b/g, 'treat harshly')
    .replace(/\bservitude\b/g, 'hard service')
    .replace(/\btribute\b/g, 'payment forced on them')
    .replace(/\bpossess\b/g, 'receive')
    .replace(/\bpossessed\b/g, 'received')
    .replace(/\binheritance\b/g, 'inheritance')
    .replace(/\bcast lots\b/g, 'used lots')
    .replace(/\bby lot\b/g, 'by lot')
    .replace(/\bmen of war\b/g, 'soldiers')
    .replace(/\bman of war\b/g, 'soldier')
    .replace(/\bmighty men of valor\b/g, 'brave fighting men')
    .replace(/\bmighty man of valor\b/g, 'brave fighting man')
    .replace(/\bambush\b/g, 'hidden soldiers')
    .replace(/\bliers in wait\b/g, 'hidden soldiers waiting')
    .replace(/\blay in wait\b/g, 'hid and waited')
    .replace(/\blie in wait\b/g, 'hide and wait')
    .replace(/\bsmote\b/g, 'struck')
    .replace(/\bsmite\b/g, 'strike')
    .replace(/\bslain\b/g, 'killed')
    .replace(/\bstruck with the edge of the sword\b/g, 'struck down with the sword')
    .replace(/\bstruck them with the edge of the sword\b/g, 'struck them down with the sword')
    .replace(/\butterly destroyed\b/g, 'completely destroyed')
    .replace(/\butterly destroy\b/g, 'completely destroy')
    .replace(/\butterly\b/g, 'completely')
    .replace(/\bdevoted to destruction\b/g, 'set apart for judgment')
    .replace(/\bdevoted\b/g, 'set apart')
    .replace(/\baccursed\b/g, 'under judgment')
    .replace(/\bhewed down\b/g, 'cut down')
    .replace(/\bhewed\b/g, 'cut')
    .replace(/\bthresh\b/g, 'beat grain')
    .replace(/\bthreshed\b/g, 'beat grain')
    .replace(/\bthreshing floor\b/g, 'grain-beating floor')
    .replace(/\bkinsmen\b/g, 'relatives')
    .replace(/\bkinsman\b/g, 'relative')
    .replace(/\bservants\b/g, 'servants')
    .replace(/\bservant\b/g, 'servant')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bmaidservants\b/g, 'female servants')
    .replace(/\bconcubine\b/g, 'secondary wife')
    .replace(/\bconcubines\b/g, 'secondary wives')
    .replace(/\bharlot\b/g, 'woman whose life had been sinful')
    .replace(/\bprostitute\b/g, 'woman whose life had been sinful')
    .replace(/\bvirgin\b/g, 'unmarried young woman')
    .replace(/\bvirgins\b/g, 'unmarried young women')
    .replace(/\bdamsel\b/g, 'young woman')
    .replace(/\bdamsels\b/g, 'young women')
    .replace(/\bfetched\b/g, 'brought')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look')
    .replace(/\blest\b/g, 'or else')
    .replace(/\bIt happened when\b/g, 'When')
    .replace(/\bIt happened that\b/g, 'Then')
    .replace(/\bit happened that\b/g, 'then')
    .replace(/\bdwelt\b/g, 'lived')
    .replace(/\bdwell\b/g, 'live')
    .replace(/\bencamped\b/g, 'camped')
    .replace(/\bencamp\b/g, 'camp')
    .replace(/\bwent up\b/g, 'went up')
    .replace(/\bcame to pass\b/g, 'came to pass')
    .replace(/\bPassover\b/g, 'Passover')

  if (ageRange === '5-7') {
    text = text
      .replace(/\binheritance\b/g, 'share of land')
      .replace(/\bjudge\b/g, 'leader and rescuer')
      .replace(/\bjudges\b/g, 'leaders and rescuers')
      .replace(/\bsecondary wife\b/g, 'other wife')
      .replace(/\bwoman whose life had been sinful\b/g, 'woman')
      .replace(/\bpayment forced on them\b/g, 'forced payment')
      .replace(/\bset apart for judgment\b/g, 'set apart for the Lord\'s judgment')
  } else {
    text = text
      .replace(/\bwoman whose life had been sinful\b/g, 'woman whose life had been sinful')
  }

  return polishKidReadableText(finalPolish(text), ageRange)
}

function normalizeSource(source) {
  return String(source)
    .replace(/\u00a0/g, ' ')
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac[\u02dc\u2122]/g, "'")
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/^"\s*'\s*/, '"')
    .replace(/^'\s*/, '')
    .replace(/\s*'\s*$/g, '')
    .trim()
}

function finalPolish(text) {
  return text
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')
    .replace(/\bmust be with\b/g, 'will be with')
    .replace(/\bmust give\b/g, 'will give')
    .replace(/\bmust deliver\b/g, 'will deliver')
    .replace(/\bthe Lord, the God\b/g, 'the Lord, the God')
    .replace(/\bLord the Lord\b/g, 'Lord God')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\ba ([aeiou])/gi, 'an $1')
    .replace(/\ban (one|united|useful|year|young)/gi, 'a $1')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
