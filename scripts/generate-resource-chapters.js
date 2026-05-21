#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];

const BOOKS = ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', '1-samuel', '2-samuel'];

const BOOK_NAMES = {
  genesis: 'Genesis',
  exodus: 'Exodus',
  leviticus: 'Leviticus',
  numbers: 'Numbers',
  deuteronomy: 'Deuteronomy',
  joshua: 'Joshua',
  judges: 'Judges',
  ruth: 'Ruth',
  '1-samuel': '1 Samuel',
  '2-samuel': '2 Samuel',
};

const BOOK_OVERVIEWS = {
  genesis:
    'Genesis tells how God made the world, how sin entered human life, and how God began his covenant promises through the first families.',
  exodus:
    'Exodus tells how the Lord rescued Israel from Egypt, brought them through the wilderness, and taught them to live as his covenant people.',
  leviticus:
    'Leviticus gives Israel worship laws, holiness laws, and priestly instructions for living near the holy Lord.',
  numbers:
    'Numbers follows Israel through the wilderness, showing the people counted, tested, corrected, protected, and guided by the Lord.',
  deuteronomy:
    'Deuteronomy records Moses speaking to Israel before they enter the land, calling them to remember the Lord and keep his covenant.',
  joshua:
    'Joshua tells how the Lord brought Israel into the promised land, gave them victories, divided the land, and called them to serve him faithfully.',
  judges:
    'Judges shows Israel turning from the Lord again and again, and the Lord raising rescuers while exposing how badly his people needed faithful covenant leadership.',
  ruth:
    'Ruth tells how the Lord cared for Naomi and Ruth through loyal love, ordinary work, Boaz\'s kindness, and the family line that would lead to King David.',
  '1-samuel':
    '1 Samuel tells how the Lord answered Hannah, called Samuel, judged corrupt leadership, gave Israel a king, rejected Saul for disobedience, and began raising up David.',
  '2-samuel':
    '2 Samuel tells how the Lord established David as king, made covenant promises to his house, exposed David\'s sin and its sorrow, and showed both judgment and mercy.',
};

const CHAPTER_SUMMARIES = {
  'genesis-3':
    'The serpent questions God\'s word, the man and woman disobey, and sin brings fear, blame, pain, and exile from Eden. Even in judgment, God gives a first promise that the woman\'s offspring will defeat the serpent.',
};

const CROSS_REFERENCES = {
  'genesis-3-1': ['2 Corinthians 11:3', 'Revelation 12:9'],
  'genesis-3-15': ['Romans 16:20', 'Hebrews 2:14', 'Revelation 12:9'],
  'genesis-3-19': ['Genesis 2:7', 'Psalm 103:14'],
  'genesis-3-21': ['Genesis 22:8'],
  'genesis-3-24': ['Revelation 22:14'],
};

const VOCABULARY = {
  Aaron: 'Moses\' brother and Israel\'s first high priest',
  altar: 'A special place where offerings were given to the Lord',
  atonement: 'God making a way for sin to be covered and forgiven',
  blessed: 'Spoke good over someone or something',
  blessing: 'Good that comes from God',
  cherubim: 'Mighty heavenly servants of God',
  command: 'Something God tells someone to do',
  covenant: 'A serious promise relationship God makes',
  cursed: 'Placed under judgment instead of blessing',
  desert: 'A dry wilderness place',
  Egypt: 'The land where Israel had been enslaved',
  Eden: 'The garden place God prepared for the first people',
  evil: 'What is wrong and against God',
  exile: 'Being sent away from home',
  faith: 'Trust in God',
  God: 'The one true Creator and Lord over all',
  guilt: 'The blame that comes from doing wrong',
  holy: 'Set apart for God',
  Israel: 'God\'s covenant people descended from Jacob',
  Jacob: 'The man God also named Israel',
  judgment: 'God\'s right decision about sin',
  Jericho: 'The first city Israel faced after crossing the Jordan',
  Jordan: 'The river Israel crossed when the Lord brought them into the promised land',
  Joshua: 'The servant God appointed to lead Israel after Moses',
  Baal: 'A false god worshiped by many Canaanites',
  Deborah: 'A prophetess and judge who helped lead Israel',
  Gideon: 'A judge the Lord used to rescue Israel from Midian',
  judge: 'A leader God raised up to rescue and guide Israel',
  Samson: 'A judge given great strength, whom God used against the Philistines',
  Boaz: 'The man from Bethlehem who showed covenant kindness to Ruth and Naomi',
  Naomi: 'Ruth\'s mother-in-law, who returned to Bethlehem after great loss',
  redeemer: 'A close relative who could protect family land and raise up a family line',
  Ruth: 'The Moabite woman who clung to Naomi and trusted the Lord',
  David: 'The shepherd the Lord chose to become king after Saul',
  Absalom: 'David\'s son who rebelled against him',
  Bathsheba: 'The woman David sinned against and later married',
  Eli: 'The priest who served at Shiloh when Samuel was a child',
  Hannah: 'Samuel\'s mother, who prayed to the Lord in deep sorrow',
  Jonathan: 'Saul\'s son and David\'s faithful friend',
  Samuel: 'The prophet and judge whom the Lord called as a boy',
  Saul: 'Israel\'s first king, who later disobeyed the Lord',
  Shiloh: 'The place where the tabernacle stood in Samuel\'s early days',
  Zion: 'The stronghold city David captured, also called the city of David',
  law: 'God\'s instruction for his people',
  Levites: 'The tribe set apart for service connected with worship',
  Lord: 'God\'s covenant name used in many English Bibles',
  manna: 'The bread-like food God gave Israel in the wilderness',
  Moses: 'The servant God used to lead Israel out of Egypt',
  offering: 'A gift brought to the Lord in worship',
  Passover: 'The meal and day remembering how God rescued Israel from Egypt',
  Pharaoh: 'The king of Egypt',
  priest: 'A worship leader who served at the holy place',
  promise: 'Words someone says and keeps',
  Rahab: 'The woman in Jericho who protected Israel\'s spies and trusted the Lord',
  refuge: 'A safe place God provided for someone who needed protection until a fair hearing',
  Sabbath: 'A day of holy rest',
  sacrifice: 'An offering given in worship',
  serpent: 'The crafty creature that tempted the woman in Eden',
  sin: 'Disobeying God and going against his good way',
  tabernacle: 'The holy tent where the Lord met with Israel',
  wilderness: 'A wild, dry place away from towns and farms',
  Yahweh: 'The Lord, God\'s covenant name in the Hebrew Scriptures',
};

async function main() {
  const options = {
    overwrite: process.argv.includes('--overwrite'),
    overwriteGenerated: process.argv.includes('--overwrite-generated'),
  };

  const generated = [];
  const skipped = [];

  for (const bookSlug of BOOKS) {
    const chapters = getAvailableChapters(bookSlug);
    for (const chapterNumber of chapters) {
      const targetPath = path.join(CONTENT_DIR, TESTAMENT, bookSlug, `chapter-${chapterNumber}.md`);
      if (fs.existsSync(targetPath) && !shouldOverwrite(targetPath, options)) {
        skipped.push(path.relative(CONTENT_DIR, targetPath));
        continue;
      }

      const ageTexts = Object.fromEntries(
        AGE_RANGES.map(ageRange => [
          ageRange,
          readAgeChapter(bookSlug, chapterNumber, ageRange),
        ])
      );
      const originalVerses = await fetchOriginalVerses(bookSlug, chapterNumber);
      const markdown = renderResourceChapter(bookSlug, chapterNumber, ageTexts, originalVerses);

      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, markdown, 'utf8');
      generated.push(path.relative(CONTENT_DIR, targetPath));
    }
  }

  console.log(`Generated ${generated.length} resource chapters.`);
  for (const filePath of generated) {
    console.log(`  ${filePath}`);
  }
  console.log(`Skipped ${skipped.length} existing resource chapters.`);
}

function getAvailableChapters(bookSlug) {
  const chapterSets = AGE_RANGES.map(ageRange => {
    const dir = path.join(CONTENT_DIR, 'bible-text', `ages-${ageRange}`, TESTAMENT, bookSlug);
    if (!fs.existsSync(dir)) return new Set();

    return new Set(
      fs.readdirSync(dir)
        .map(fileName => fileName.match(/^chapter-(\d+)\.md$/))
        .filter(Boolean)
        .map(match => Number(match[1]))
    );
  });

  return [...chapterSets[0]]
    .filter(chapterNumber => chapterSets.every(set => set.has(chapterNumber)))
    .sort((a, b) => a - b);
}

function shouldOverwrite(filePath, options) {
  if (options.overwrite) return true;
  if (!options.overwriteGenerated) return false;

  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('<!-- Draft Resource Note -->');
}

function readAgeChapter(bookSlug, chapterNumber, ageRange) {
  const filePath = path.join(
    CONTENT_DIR,
    'bible-text',
    `ages-${ageRange}`,
    TESTAMENT,
    bookSlug,
    `chapter-${chapterNumber}.md`
  );
  const content = fs.readFileSync(filePath, 'utf8');
  return extractBibleTextVerses(content);
}

function extractBibleTextVerses(content) {
  const verseSection = extractSection(content, '## Verses') || content;
  const verseRegex = /^###\s+(.+?\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+.+?\s+\d+:\d+\s*$|^##\s+|(?![\s\S]))/gm;
  return [...verseSection.matchAll(verseRegex)].map(match => ({
    reference: match[1].trim(),
    body: match[2].trim(),
  }));
}

function extractSection(content, heading) {
  const regex = new RegExp(`${escapeRegex(heading)}\\s*\\r?\\n+([\\s\\S]*?)(?=\\r?\\n##\\s|(?![\\s\\S]))`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

async function fetchOriginalVerses(bookSlug, chapterNumber) {
  const apiBook = bookSlug.replace(/-/g, '');
  const url = `https://www.canonapi.com/v1/${apiBook}/${chapterNumber}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const parsed = await response.json();
  return Array.isArray(parsed.value) ? parsed.value : parsed;
}

function renderResourceChapter(bookSlug, chapterNumber, ageTexts, originalVerses) {
  const bookName = BOOK_NAMES[bookSlug];
  const verseCount = Math.max(
    originalVerses.length,
    ageTexts['5-7'].length,
    ageTexts['8-10'].length
  );
  const summary = getChapterSummary(bookSlug, chapterNumber, ageTexts['8-10']);
  const overview = `${BOOK_OVERVIEWS[bookSlug]} This resource chapter supports ${bookName} ${chapterNumber} and should be reviewed before approval.`;
  const chapterKeywords = getChapterKeywords(originalVerses, ageTexts);
  const parts = [
    `# ${bookName} Chapter ${chapterNumber}`,
    '',
    '## Book Overview',
    overview,
    '',
    '## Important Keywords',
  ];

  for (const keyword of chapterKeywords) {
    parts.push(`- ${keyword}: ${VOCABULARY[keyword]}`);
  }

  parts.push(
    '',
    '## Verse-by-Verse Translation',
    '',
  );

  for (let index = 0; index < verseCount; index++) {
    const verseNumber = index + 1;
    const reference = `${bookName} ${chapterNumber}:${verseNumber}`;
    const original = normalizeVerseText(originalVerses[index] || '');
    const age57 = findVerse(ageTexts['5-7'], reference);
    const age810 = findVerse(ageTexts['8-10'], reference);
    const keywords = getKeywords(`${original} ${age57} ${age810}`);
    const crossReferences = getCrossReferences(bookSlug, chapterNumber, verseNumber);

    parts.push(`### ${reference}`);
    parts.push(`**Original Reference**: ${reference} - ${original || 'Original text should be supplied during review.'}`);
    parts.push('');
    parts.push('#### Ages 5-7');
    parts.push(age57 || '[Ages 5-7 text missing.]');
    parts.push('');
    parts.push('#### Ages 8-10');
    parts.push(age810 || '[Ages 8-10 text missing.]');
    parts.push('');

    parts.push('**Translation Notes**:');
    parts.push(getTranslationNote(bookSlug, chapterNumber, verseNumber));
    parts.push('');

    if (keywords.length) {
      parts.push('**Key Vocabulary**:');
      for (const keyword of keywords) {
        parts.push(`- ${keyword}: ${VOCABULARY[keyword]}`);
      }
      parts.push('');
    }

    if (crossReferences.length) {
      parts.push('**Cross-References**:');
      for (const crossReference of crossReferences) {
        parts.push(`- ${crossReference}`);
      }
      parts.push('');
    }

    parts.push('---');
    parts.push('');
  }

  parts.push('## Chapter Summary');
  parts.push(summary);
  parts.push('');
  parts.push('## Key Lessons for Children');
  getLessons(bookSlug, chapterNumber).forEach((lesson, index) => {
    parts.push(`${index + 1}. **${lesson.title}**: ${lesson.body}`);
  }
  );
  parts.push('');
  parts.push('## Memory Verses by Age');
  parts.push('');
  parts.push('### Ages 5-7');
  parts.push(getMemoryVerse(bookSlug, bookName, chapterNumber, ageTexts['5-7']));
  parts.push('');
  parts.push('### Ages 8-10');
  parts.push(getMemoryVerse(bookSlug, bookName, chapterNumber, ageTexts['8-10']));
  parts.push('');
  parts.push('## Discussion Questions by Age');
  parts.push('');
  parts.push('### Ages 5-7');
  parts.push('1. What happened in this chapter?');
  parts.push('2. What did God show about himself?');
  parts.push('');
  parts.push('### Ages 8-10');
  parts.push('1. What does this chapter teach about God, people, or covenant life?');
  parts.push('2. Which verse would need the most careful explanation for a younger child?');
  parts.push('');
  parts.push('## Prayer');
  parts.push(`Lord, help us understand ${bookName} ${chapterNumber} truthfully. Teach us to listen to your word, trust your promises, and walk in your ways. Amen.`);
  parts.push('');
  parts.push('<!-- Draft Resource Note -->');
  parts.push('This resource chapter was generated from the age-range Bible text and WEB original-reference text. It must receive human theological and child-readability review before being added to `content/bible-text/approved-chapters.json`.');
  parts.push('<!-- End Draft Resource Note -->');
  parts.push('');

  return parts.join('\n');
}

function findVerse(verses, reference) {
  return verses.find(verse => verse.reference === reference)?.body || '';
}

function normalizeVerseText(text) {
  return String(text)
    .replace(/â€”/g, '-')
    .replace(/â€“/g, '-')
    .replace(/â€œ|â€/g, '"')
    .replace(/â€˜|â€™/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTranslationNote(bookSlug, chapterNumber, verseNumber) {
  const key = `${bookSlug}-${chapterNumber}-${verseNumber}`;
  const specialNotes = {
    'genesis-3-1': 'Keep the serpent\'s question clear: he challenges God\'s word without making the verse cartoonish or silly.',
    'genesis-3-15': 'This verse is often read as the first promise that evil will be defeated. Keep the serpent, woman, offspring, head, and heel details in order.',
    'genesis-3-21': 'The clothing shows God caring for Adam and Eve after judgment. Do not add details about sacrifice beyond what the verse says.',
    'genesis-3-24': 'Keep the guarded way to the tree of life clear without making the scene too frightening for children.',
  };

  if (specialNotes[key]) return specialNotes[key];
  if (bookSlug === 'leviticus') {
    return 'Preserve the worship or holiness instruction, but replace adult ritual terms with concrete child-readable wording during review.';
  }
  if (bookSlug === 'numbers') {
    return 'Preserve the people, places, numbers, and wilderness setting. Make repeated legal or travel details readable without deleting them.';
  }
  if (bookSlug === 'deuteronomy') {
    return 'Preserve Moses\' covenant teaching and the reason for obedience. Keep commands clear without turning them into slogans.';
  }
  if (bookSlug === 'joshua') {
    return 'Preserve the Lord\'s promise, Israel\'s obedience or disobedience, and the real places in the conquest and land-allotment story. Keep judgment language accurate but child-readable.';
  }
  if (bookSlug === 'judges') {
    return 'Preserve the cycle of Israel\'s sin, suffering, crying out, and the Lord raising a rescuer. Keep violent or adult details truthful but restrained and child-readable.';
  }
  if (bookSlug === 'ruth') {
    return 'Preserve Ruth\'s covenant loyalty, Naomi\'s sorrow, Boaz\'s righteous kindness, and the family-redeemer customs. Explain harvest and marriage customs in child-readable story language.';
  }
  if (bookSlug === '1-samuel') {
    return 'Preserve the Lord\'s word through Samuel, the seriousness of covenant leadership, Saul\'s disobedience, David\'s calling, and the real danger in the story. Keep violence and adult details restrained and child-readable.';
  }
  if (bookSlug === '2-samuel') {
    return 'Preserve the Lord\'s covenant promises to David, David\'s kingship, the seriousness of David\'s sin, and the grief that follows rebellion. Keep adult and violent details truthful, restrained, and child-readable.';
  }
  return 'Preserve the verse meaning, sequence, people, places, and theological claim. Expand this note during review if the wording could confuse a child.';
}

function getKeywords(text) {
  const normalized = normalizeVerseText(text);
  return Object.keys(VOCABULARY)
    .filter(keyword => new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i').test(normalized))
    .slice(0, 5);
}

function getChapterKeywords(originalVerses, ageTexts) {
  const allText = [
    ...originalVerses,
    ...ageTexts['5-7'].map(verse => verse.body),
    ...ageTexts['8-10'].map(verse => verse.body),
  ].join(' ');

  const found = getKeywords(allText);
  if (found.length) return found.slice(0, 8);
  return ['Lord', 'God'].filter(keyword => VOCABULARY[keyword]);
}

function getCrossReferences(bookSlug, chapterNumber, verseNumber) {
  return CROSS_REFERENCES[`${bookSlug}-${chapterNumber}-${verseNumber}`] || [];
}

function getChapterSummary(bookSlug, chapterNumber, verses) {
  const key = `${bookSlug}-${chapterNumber}`;
  if (CHAPTER_SUMMARIES[key]) return CHAPTER_SUMMARIES[key];

  const bookName = BOOK_NAMES[bookSlug];
  const firstVerse = normalizeVerseText(verses[0]?.body || '');
  const lastVerse = normalizeVerseText(verses[verses.length - 1]?.body || '');
  const middleVerse = normalizeVerseText(verses[Math.floor(verses.length / 2)]?.body || '');

  return `${bookName} ${chapterNumber} is a draft resource chapter. The chapter opens with "${trimForSentence(firstVerse)}," moves through "${trimForSentence(middleVerse)}," and closes with "${trimForSentence(lastVerse)}." Review this summary for fuller theological detail before approval.`;
}

function getLessons(bookSlug, chapterNumber) {
  if (bookSlug === 'genesis' && chapterNumber === 3) {
    return [
      {
        title: 'God tells the truth',
        body: 'The serpent questioned God\'s word, but God\'s warning was true.',
      },
      {
        title: 'Sin brings sorrow',
        body: 'Disobeying God brought fear, blame, pain, and exile.',
      },
      {
        title: 'God still gives hope',
        body: 'God promised that the woman\'s offspring would defeat the serpent.',
      },
    ];
  }

  return [
    {
      title: 'Listen carefully to God\'s word',
      body: 'This chapter should be read in the order God gave it, with every person, place, and command kept clear.',
    },
    {
      title: 'God teaches his people',
      body: 'Even hard chapters show something true about God, people, worship, sin, rescue, or covenant life.',
    },
  ];
}

function getMemoryVerse(bookSlug, bookName, chapterNumber, verses) {
  const specialReference = {
    'genesis-3': 'Genesis 3:15',
  }[`${bookSlug}-${chapterNumber}`];
  const verse =
    (specialReference ? verses.find(item => item.reference === specialReference) : null) ||
    verses.find(item => isGoodMemoryVerse(item.body)) ||
    verses[0];
  if (!verse) return `${bookName} ${chapterNumber}:1`;
  return `${verse.body} - ${verse.reference}`;
}

function isGoodMemoryVerse(text) {
  const trimmed = text.trim();
  const quoteCount = (trimmed.match(/"/g) || []).length;
  return (
    trimmed.length >= 40 &&
    trimmed.length <= 190 &&
    quoteCount % 2 === 0 &&
    !/[,:;]$/.test(trimmed)
  );
}

function trimForSentence(text) {
  const trimmed = text.replace(/^"+|"+$/g, '');
  if (trimmed.length <= 100) return trimmed;
  return `${trimmed.slice(0, 97).trim()}...`;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
