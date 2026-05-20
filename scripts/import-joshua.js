#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const { polishKidReadableText } = require('./lib/kids-bible-style')

const BOOK = 'Joshua'
const BOOK_SLUG = 'joshua'
const SOURCE_BASE = 'https://www.canonapi.com/v1/joshua'
const EXPECTED_VERSE_COUNTS = [
  18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24,
  33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33,
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

function adaptText(source, ageRange, reference) {
  let text = normalizeSource(source)

  text = text
    .replace(/\bYahweh\b/g, 'the Lord')
    .replace(/\bchildren of Israel\b/gi, 'people of Israel')
    .replace(/\bchild of Israel\b/gi, 'person of Israel')
    .replace(/\bservant of the Lord\b/g, 'servant of the Lord')
    .replace(/\bMoses' servant\b/g, "Moses' helper")
    .replace(/\bMoses' assistant\b/g, "Moses' helper")
    .replace(/\bthe land which\b/g, 'the land that')
    .replace(/\bwhich the Lord\b/g, 'that the Lord')
    .replace(/\bwhich I\b/g, 'that I')
    .replace(/\bwhich you\b/g, 'that you')
    .replace(/\bwhich he\b/g, 'that he')
    .replace(/\bwhich they\b/g, 'that they')
    .replace(/\bpass over this Jordan\b/g, 'cross this Jordan River')
    .replace(/\bpass over the Jordan\b/g, 'cross the Jordan River')
    .replace(/\bpassed over the Jordan\b/g, 'crossed the Jordan River')
    .replace(/\bwent over the Jordan\b/g, 'crossed the Jordan River')
    .replace(/\bgo over this Jordan\b/g, 'cross this Jordan River')
    .replace(/\bgo over the Jordan\b/g, 'cross the Jordan River')
    .replace(/\bthe Jordan\b/g, 'the Jordan River')
    .replace(/\bJordan River River\b/g, 'Jordan River')
    .replace(/\bpossess the land\b/g, 'take the land')
    .replace(/\bpossess it\b/g, 'take it')
    .replace(/\bpossessed it\b/g, 'took it')
    .replace(/\bpossess\b/g, 'take')
    .replace(/\bPossess\b/g, 'Take')
    .replace(/\binheritance\b/g, 'inheritance')
    .replace(/\binherit\b/g, 'receive as an inheritance')
    .replace(/\btribe of their fathers\b/g, "fathers' tribe")
    .replace(/\bfathers\b/g, 'ancestors')
    .replace(/\bark of the covenant of the Lord\b/g, "the Lord's covenant chest")
    .replace(/\bark of the covenant\b/g, 'covenant chest')
    .replace(/\bArk of the Covenant\b/g, 'Covenant Chest')
    .replace(/\bthe ark\b/g, 'the covenant chest')
    .replace(/\bThe ark\b/g, 'The covenant chest')
    .replace(/\bcircumcise\b/g, 'give the covenant sign of circumcision to')
    .replace(/\bcircumcised\b/g, 'given the covenant sign of circumcision')
    .replace(/\bforeskins\b/g, 'covenant body sign')
    .replace(/\bflint knives\b/g, 'sharp stone knives')
    .replace(/\bcommander of the Lord's army\b/g, "commander of the Lord's army")
    .replace(/\bcaptain of the army of the Lord\b/g, "commander of the Lord's army")
    .replace(/\bmen of war\b/g, 'soldiers')
    .replace(/\bman of war\b/g, 'soldier')
    .replace(/\bmighty men of valor\b/g, 'brave fighting men')
    .replace(/\bprostitute\b/g, 'woman whose life had been sinful')
    .replace(/\bharlot\b/g, 'woman whose life had been sinful')
    .replace(/\bscarlet cord\b/g, 'red cord')
    .replace(/\bscarlet thread\b/g, 'red cord')
    .replace(/\bspies\b/g, 'spies')
    .replace(/\bspy\b/g, 'spy')
    .replace(/\baccursed thing\b/g, "thing set apart for the Lord's judgment")
    .replace(/\baccursed things\b/g, "things set apart for the Lord's judgment")
    .replace(/\bdevoted things\b/g, "things set apart for the Lord's judgment")
    .replace(/\bdevoted thing\b/g, "thing set apart for the Lord's judgment")
    .replace(/\bdevoted to destruction\b/g, 'set apart for destruction')
    .replace(/\bdevote to destruction\b/g, 'set apart for destruction')
    .replace(/\butterly destroyed\b/g, 'completely destroyed')
    .replace(/\butterly destroy\b/g, 'completely destroy')
    .replace(/\butterly\b/g, 'completely')
    .replace(/\bambush\b/g, 'hidden soldiers')
    .replace(/\ban hidden soldiers\b/g, 'a group of hidden soldiers')
    .replace(/\bthe hidden soldiers\b/g, 'the hidden soldiers')
    .replace(/\bliers in wait\b/g, 'hidden soldiers waiting')
    .replace(/\blie in wait\b/g, 'hide and wait')
    .replace(/\bstruck with the edge of the sword\b/g, 'struck down with the sword')
    .replace(/\bstruck them with the edge of the sword\b/g, 'struck them down with the sword')
    .replace(/\bsmote\b/g, 'struck')
    .replace(/\bsmite\b/g, 'strike')
    .replace(/\bslain\b/g, 'killed')
    .replace(/\binhabitants\b/g, 'people who lived there')
    .replace(/\binhabitant\b/g, 'person who lived there')
    .replace(/\bsave alive\b/g, 'let live')
    .replace(/\bleft no one remaining\b/g, 'left no one alive')
    .replace(/\bleft none remaining\b/g, 'left no one alive')
    .replace(/\bdestroyed all that breathed\b/g, 'destroyed every living person there')
    .replace(/\bcities of refuge\b/g, 'cities of refuge')
    .replace(/\bcity of refuge\b/g, 'city of refuge')
    .replace(/\bmanslayer\b/g, 'person who killed someone')
    .replace(/\bman slayer\b/g, 'person who killed someone')
    .replace(/\bavenger of blood\b/g, 'family protector seeking justice')
    .replace(/\bsuburbs\b/g, 'pasturelands')
    .replace(/\bsuburb\b/g, 'pastureland')
    .replace(/\bborders\b/g, 'boundary lines')
    .replace(/\bborder\b/g, 'boundary line')
    .replace(/\bcoast\b/g, 'boundary')
    .replace(/\bcoasts\b/g, 'boundaries')
    .replace(/\baccording to their families\b/g, 'by their family groups')
    .replace(/\bcongregation\b/g, 'whole group')
    .replace(/\bassembly\b/g, 'whole group')
    .replace(/\bordained\b/g, 'commanded')
    .replace(/\bordinance\b/g, 'command')
    .replace(/\bstatute\b/g, 'rule')
    .replace(/\bstatutes\b/g, 'rules')
    .replace(/\bcommandments\b/g, 'commands')
    .replace(/\bcovenant\b/g, 'covenant')
    .replace(/\btransgressed\b/g, 'broken')
    .replace(/\btransgression\b/g, 'wrong')
    .replace(/\btrespass\b/g, 'act unfaithfully')
    .replace(/\btrespassed\b/g, 'acted unfaithfully')
    .replace(/\biniquity\b/g, 'sin')
    .replace(/\bdismayed\b/g, 'discouraged')
    .replace(/\bBe strong and courageous\b/g, 'Be strong and courageous')

  if (ageRange === '5-7') {
    text = text
      .replace(/\binheritance\b/g, 'share of land')
      .replace(/\breceive as an share of land\b/g, 'receive as a share of land')
      .replace(/\bwoman whose life had been sinful\b/g, 'woman named Rahab, whose life had been sinful')
      .replace(/\bthe woman named Rahab, whose life had been sinful\b/g, 'Rahab')
      .replace(/\bRahab named Rahab, whose life had been sinful\b/g, 'Rahab')
      .replace(/\bcovenant sign of circumcision\b/g, 'covenant body sign called circumcision')
      .replace(/\bcovenant chest\b/g, 'covenant chest')
      .replace(/\bthings set apart for the Lord's judgment\b/g, "things the Lord had set apart for judgment")
      .replace(/\bthing set apart for the Lord's judgment\b/g, "thing the Lord had set apart for judgment")
      .replace(/\bhidden soldiers\b/g, 'soldiers hiding and waiting')
      .replace(/\bcity of refuge\b/g, 'safe city')
      .replace(/\bcities of refuge\b/g, 'safe cities')
  } else {
    text = text
      .replace(/\bwoman whose life had been sinful\b/g, 'woman named Rahab, who had lived in sexual sin')
      .replace(/\bthe woman named Rahab, who had lived in sexual sin\b/g, 'Rahab')
      .replace(/\bRahab named Rahab, who had lived in sexual sin\b/g, 'Rahab')
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
    .replace(/\bmust be strong\b/g, 'must be strong')
    .replace(/\bmust be with you\b/g, 'will be with you')
    .replace(/\bmust give\b/g, 'will give')
    .replace(/\bmust come to pass\b/g, 'will happen')
    .replace(/\bIt must happen\b/g, 'Then')
    .replace(/\bit must happen\b/g, 'then')
    .replace(/\bthe Lord, the God\b/g, 'the Lord, the God')
    .replace(/\bLord the Lord\b/g, 'Lord God')
    .replace(/\bthe covenant chest of the covenant\b/g, 'the covenant chest')
    .replace(/\bthe covenant chest of the Lord's covenant\b/g, "the Lord's covenant chest")
    .replace(/\bthe Lord's covenant chest of the Lord\b/g, "the Lord's covenant chest")
    .replace(/\bJordan River River\b/g, 'Jordan River')
    .replace(/\bshare of land of\b/g, 'share of land for')
    .replace(/\bto take the land the land\b/g, 'to take the land')
    .replace(/\bthe land that that\b/g, 'the land that')
    .replace(/\ba group of soldiers hiding and waiting\b/g, 'soldiers hiding and waiting')
    .replace(/\bsoldiers hiding and waitingment\b/g, 'ambush')
    .replace(/\bthe soldiers hiding and waiting\b/g, 'the soldiers hiding and waiting')
    .replace(/\bwoman named Rahab, whose life had been sinful named Rahab, whose life had been sinful\b/g, 'Rahab')
    .replace(/\bwoman named Rahab, who had lived in sexual sin named Rahab, who had lived in sexual sin\b/g, 'Rahab')
    .replace(/\bof of\b/g, 'of')
    .replace(/\bthe the\b/g, 'the')
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
