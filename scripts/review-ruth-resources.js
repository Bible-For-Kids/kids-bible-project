#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = 'ruth';
const BOOK_NAME = 'Ruth';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = [1, 2, 3, 4];

const BOOK_OVERVIEW =
  'Ruth tells how the Lord cared for Naomi and Ruth through loyal love, ordinary work, Boaz\'s kindness, and the family line that would lead to King David.';

const RESOURCE_DATA = {
  1: {
    summary: 'A famine sends Naomi\'s family from Bethlehem to Moab, where Naomi loses her husband and both sons. When Naomi returns home in sorrow, Ruth clings to her and confesses that Naomi\'s people will be her people and Naomi\'s God will be her God.',
    lessons: [
      ['The Lord sees bitter sorrow', 'Naomi comes home feeling empty, but the Lord is already beginning a story of care.'],
      ['Covenant love stays near', 'Ruth leaves her old life behind and clings to Naomi and to the Lord.'],
    ],
  },
  2: {
    summary: 'Ruth goes to gather leftover grain so she and Naomi can eat. The Lord leads her to Boaz\'s field, where Boaz protects her, provides for her, and blesses her for taking refuge under the Lord\'s wings.',
    lessons: [
      ['God can care through ordinary work', 'Ruth gathers grain one handful at a time, and the Lord provides.'],
      ['Kindness shows God\'s care', 'Boaz sees Ruth, protects her, and gives generously.'],
    ],
  },
  3: {
    summary: 'Naomi sends Ruth to Boaz at the threshing floor to ask him to act as family redeemer. Boaz honors Ruth, protects her reputation, and promises to settle the matter rightly because another redeemer is closer than he is.',
    lessons: [
      ['Wisdom handles customs carefully', 'Ruth follows Naomi\'s plan, and Boaz responds with honor.'],
      ['Righteous love keeps promises', 'Boaz does not take shortcuts, but seeks to do what is right.'],
    ],
  },
  4: {
    summary: 'Boaz meets the closer redeemer at the city gate, receives the right to redeem Naomi\'s land and marry Ruth, and takes Ruth as his wife. The Lord gives them a son named Obed, who becomes the grandfather of King David.',
    lessons: [
      ['The Lord restores the empty', 'Naomi began in grief, but the Lord gives her joy through Obed.'],
      ['God works through family lines', 'Ruth and Boaz become part of the family line leading to David.'],
    ],
  },
};

const MEMORY_REFERENCES = {
  1: 'Ruth 1:16',
  2: 'Ruth 2:12',
  3: 'Ruth 3:11',
  4: 'Ruth 4:14',
};

function main() {
  for (const chapterNumber of CHAPTERS) {
    const ageTexts = {};

    for (const ageRange of AGE_RANGES) {
      const filePath = ageTextPath(chapterNumber, ageRange);
      const verses = extractVerses(fs.readFileSync(filePath, 'utf8')).map(verse => ({
        ...verse,
        body: polishRuthText(verse.body, ageRange),
      }));

      ageTexts[ageRange] = verses;
      writeAgeChapter(filePath, chapterNumber, verses);
    }

    updateResourceChapter(chapterNumber, ageTexts);
  }

  console.log(`Reviewed Ruth chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishRuthText(text, ageRange) {
  let result = polishKidReadableText(text, ageRange)
    .replace(/\bwhich\b/g, 'that')
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')
    .replace(/\bkinsman redeemer\b/g, 'family redeemer')
    .replace(/\bkinsman-redeemer\b/g, 'family redeemer')
    .replace(/\bnear kinsman\b/g, 'close relative')
    .replace(/\bglean\b/g, 'gather leftover grain')
    .replace(/\bgleaned\b/g, 'gathered leftover grain')
    .replace(/\bgleaning\b/g, 'gathering leftover grain')
    .replace(/\breapers\b/g, 'harvest workers')
    .replace(/\breaper\b/g, 'harvest worker')
    .replace(/\bsheaves\b/g, 'bundles')
    .replace(/\bsheaf\b/g, 'bundle')
    .replace(/\bMoabitess\b/g, 'Moabite woman')
    .replace(/\bhandmaid\b/g, 'female servant')
    .replace(/\bhandmaids\b/g, 'female servants')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bdamsel\b/g, 'young woman')
    .replace(/\bdamsels\b/g, 'young women')
    .replace(/\bsojourn\b/g, 'live for a while')
    .replace(/\bsojourned\b/g, 'lived for a while')
    .replace(/\bthreshed\b/g, 'separated grain from chaff')
    .replace(/\bthresh\b/g, 'separate grain from chaff')
    .replace(/\bthreshing floor\b/g, 'threshing floor')
    .replace(/\bthe Almighty\b/g, 'the Almighty')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look');

  if (ageRange === '5-7') {
    result = result
      .replace(/\binheritance\b/g, 'family land and name')
      .replace(/\bredeemer\b/g, 'family redeemer')
      .replace(/\bfamily family redeemer\b/g, 'family redeemer');
  }

  return finalPolish(result);
}

function finalPolish(text) {
  return String(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac[\u02dc\u2122]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\bmust be full\b/g, 'will be full')
    .replace(/\bmust go\b/g, 'will go')
    .replace(/\bmust stay\b/g, 'will stay')
    .replace(/\bmust be my people\b/g, 'will be my people')
    .replace(/\bmust be my God\b/g, 'will be my God')
    .replace(/\bmust I not\b/g, 'should I not')
    .replace(/\bfamily family redeemer\b/g, 'family redeemer')
    .replace(/\bfamily redeemer family redeemer\b/g, 'family redeemer')
    .replace(/\bMoabite woman woman\b/g, 'Moabite woman')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\ba ([aeiou])/gi, 'an $1')
    .replace(/\ban (one|united|useful|year|young)/gi, 'a $1')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function ageTextPath(chapterNumber, ageRange) {
  return path.join(
    CONTENT_DIR,
    'bible-text',
    `ages-${ageRange}`,
    TESTAMENT,
    BOOK,
    `chapter-${chapterNumber}.md`
  );
}

function extractVerses(content) {
  const verseRegex = /^###\s+(.+?\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+.+?\s+\d+:\d+\s*$|^##\s+|(?![\s\S]))/gm;
  return [...content.matchAll(verseRegex)].map(match => ({
    reference: match[1].trim(),
    body: match[2].trim(),
  }));
}

function writeAgeChapter(filePath, chapterNumber, verses) {
  const parts = [
    `# ${BOOK_NAME} ${chapterNumber}`,
    '',
    '## Book',
    BOOK_NAME,
    '',
    '## Chapter',
    String(chapterNumber),
    '',
    '## Verses',
    '',
  ];

  verses.forEach((verse, index) => {
    if (index > 0) parts.push('');
    parts.push(`### ${verse.reference}`);
    parts.push(verse.body);
  });

  fs.writeFileSync(filePath, `${parts.join('\n').replace(/\n+$/g, '')}\n`, 'utf8');
}

function updateResourceChapter(chapterNumber, ageTexts) {
  const resourcePath = path.join(CONTENT_DIR, TESTAMENT, BOOK, `chapter-${chapterNumber}.md`);
  if (!fs.existsSync(resourcePath)) return;

  let content = fs.readFileSync(resourcePath, 'utf8');
  const verseCount = Math.max(ageTexts['5-7'].length, ageTexts['8-10'].length);

  for (let verseNumber = 1; verseNumber <= verseCount; verseNumber += 1) {
    const reference = `${BOOK_NAME} ${chapterNumber}:${verseNumber}`;
    content = replaceResourceAgeText(content, reference, '5-7', findVerse(ageTexts['5-7'], reference));
    content = replaceResourceAgeText(content, reference, '8-10', findVerse(ageTexts['8-10'], reference));
  }

  content = replaceMemoryVerseText(content, '5-7', ageTexts['5-7'], chapterNumber);
  content = replaceMemoryVerseText(content, '8-10', ageTexts['8-10'], chapterNumber);
  content = replaceResourceOverview(content, chapterNumber);
  content = replaceChapterSummary(content, chapterNumber);
  content = removeDraftResourceNote(content);
  content = content.replace(/\n{2,}$/g, '\n');

  fs.writeFileSync(resourcePath, content, 'utf8');
}

function replaceResourceAgeText(content, reference, ageRange, text) {
  const heading = ageRange === '5-7' ? '#### Ages 5-7' : '#### Ages 8-10';
  const nextHeading = ageRange === '5-7' ? '#### Ages 8-10' : '**Translation Notes**:';
  const pattern = new RegExp(
    `(### ${escapeRegex(reference)}[\\s\\S]*?${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(\\r?\\n\\r?\\n${escapeRegex(nextHeading)})`,
    'm'
  );

  return content.replace(pattern, `$1${text || `[Ages ${ageRange} text missing.]`}$3`);
}

function replaceMemoryVerseText(content, ageRange, verses, chapterNumber) {
  const heading = ageRange === '5-7' ? '### Ages 5-7' : '### Ages 8-10';
  const nextHeading = ageRange === '5-7' ? '### Ages 8-10' : '## Discussion Questions by Age';
  const verse = getMemoryVerse(chapterNumber, verses);
  const pattern = new RegExp(
    `(## Memory Verses by Age[\\s\\S]*?${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(\\r?\\n\\r?\\n${escapeRegex(nextHeading)})`,
    'm'
  );

  return content.replace(pattern, `$1${verse}$3`);
}

function replaceResourceOverview(content, chapterNumber) {
  const data = RESOURCE_DATA[chapterNumber];
  if (!data) return content;

  const overview = `${BOOK_OVERVIEW} In ${BOOK_NAME} ${chapterNumber}, ${data.summary}`;
  return replaceSection(content, '## Book Overview', overview);
}

function replaceChapterSummary(content, chapterNumber) {
  const data = RESOURCE_DATA[chapterNumber];
  if (!data) return content;

  let updated = replaceSection(content, '## Chapter Summary', data.summary);
  const lessons = data.lessons
    .map(([title, body], index) => `${index + 1}. **${title}**: ${body}`)
    .join('\n');
  updated = replaceSection(updated, '## Key Lessons for Children', lessons);
  return updated;
}

function replaceSection(content, heading, body) {
  const pattern = new RegExp(
    `(${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(?=\\r?\\n##\\s|$)`
  );
  return content.replace(pattern, `$1${body.trim()}\n`);
}

function removeDraftResourceNote(content) {
  return content
    .replace(/\n?<!-- Draft Resource Note -->[\s\S]*?<!-- End Draft Resource Note -->\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function getMemoryVerse(chapterNumber, verses) {
  const reference = MEMORY_REFERENCES[chapterNumber];
  const verse = verses.find(item => item.reference === reference) || verses[0];
  if (!verse) return `${BOOK_NAME} ${chapterNumber}:1`;
  return `${verse.body} - ${verse.reference}`;
}

function findVerse(verses, reference) {
  return verses.find(verse => verse.reference === reference)?.body || '';
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
