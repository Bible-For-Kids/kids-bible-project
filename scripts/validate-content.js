#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { collectBibleTextStyleIssues } = require('./lib/kids-bible-style');

function chapterCounts(bookPath, counts) {
  return Object.fromEntries(
    counts.map((count, index) => [
      path.normalize(`${bookPath}/chapter-${index + 1}.md`),
      count,
    ])
  );
}

const expectedVerseCounts = {
  [path.normalize('old-testament/genesis/chapter-1.md')]: 31,
  [path.normalize('old-testament/genesis/chapter-2.md')]: 25,
  [path.normalize('old-testament/genesis/chapter-3.md')]: 24,
  [path.normalize('old-testament/genesis/chapter-4.md')]: 26,
  [path.normalize('old-testament/genesis/chapter-5.md')]: 32,
  [path.normalize('old-testament/genesis/chapter-6.md')]: 22,
  [path.normalize('old-testament/genesis/chapter-7.md')]: 24,
  [path.normalize('old-testament/genesis/chapter-8.md')]: 22,
  [path.normalize('old-testament/genesis/chapter-9.md')]: 29,
  [path.normalize('old-testament/genesis/chapter-10.md')]: 32,
  [path.normalize('old-testament/genesis/chapter-11.md')]: 32,
  [path.normalize('old-testament/genesis/chapter-12.md')]: 20,
  [path.normalize('old-testament/genesis/chapter-13.md')]: 18,
  [path.normalize('old-testament/genesis/chapter-14.md')]: 24,
  [path.normalize('old-testament/genesis/chapter-15.md')]: 21,
  [path.normalize('old-testament/genesis/chapter-16.md')]: 16,
  [path.normalize('old-testament/genesis/chapter-17.md')]: 27,
  [path.normalize('old-testament/genesis/chapter-18.md')]: 33,
  [path.normalize('old-testament/genesis/chapter-19.md')]: 38,
  [path.normalize('old-testament/genesis/chapter-20.md')]: 18,
  [path.normalize('old-testament/genesis/chapter-21.md')]: 34,
  [path.normalize('old-testament/genesis/chapter-22.md')]: 24,
  [path.normalize('old-testament/genesis/chapter-23.md')]: 20,
  [path.normalize('old-testament/genesis/chapter-24.md')]: 67,
  [path.normalize('old-testament/genesis/chapter-25.md')]: 34,
  [path.normalize('old-testament/genesis/chapter-26.md')]: 35,
  [path.normalize('old-testament/genesis/chapter-27.md')]: 46,
  [path.normalize('old-testament/genesis/chapter-28.md')]: 22,
  [path.normalize('old-testament/genesis/chapter-29.md')]: 35,
  [path.normalize('old-testament/genesis/chapter-30.md')]: 43,
  [path.normalize('old-testament/genesis/chapter-31.md')]: 55,
  [path.normalize('old-testament/genesis/chapter-32.md')]: 32,
  [path.normalize('old-testament/genesis/chapter-33.md')]: 20,
  [path.normalize('old-testament/genesis/chapter-34.md')]: 31,
  [path.normalize('old-testament/genesis/chapter-35.md')]: 29,
  [path.normalize('old-testament/genesis/chapter-36.md')]: 43,
  [path.normalize('old-testament/genesis/chapter-37.md')]: 36,
  [path.normalize('old-testament/genesis/chapter-38.md')]: 30,
  [path.normalize('old-testament/genesis/chapter-39.md')]: 23,
  [path.normalize('old-testament/genesis/chapter-40.md')]: 23,
  [path.normalize('old-testament/genesis/chapter-41.md')]: 57,
  [path.normalize('old-testament/genesis/chapter-42.md')]: 38,
  [path.normalize('old-testament/genesis/chapter-43.md')]: 34,
  [path.normalize('old-testament/genesis/chapter-44.md')]: 34,
  [path.normalize('old-testament/genesis/chapter-45.md')]: 28,
  [path.normalize('old-testament/genesis/chapter-46.md')]: 34,
  [path.normalize('old-testament/genesis/chapter-47.md')]: 31,
  [path.normalize('old-testament/genesis/chapter-48.md')]: 22,
  [path.normalize('old-testament/genesis/chapter-49.md')]: 33,
  [path.normalize('old-testament/genesis/chapter-50.md')]: 26,
  [path.normalize('old-testament/exodus/chapter-1.md')]: 22,
  [path.normalize('old-testament/exodus/chapter-2.md')]: 25,
  [path.normalize('old-testament/exodus/chapter-3.md')]: 22,
  [path.normalize('old-testament/exodus/chapter-4.md')]: 31,
  [path.normalize('old-testament/exodus/chapter-5.md')]: 23,
  [path.normalize('old-testament/exodus/chapter-6.md')]: 30,
  [path.normalize('old-testament/exodus/chapter-7.md')]: 25,
  [path.normalize('old-testament/exodus/chapter-8.md')]: 32,
  [path.normalize('old-testament/exodus/chapter-9.md')]: 35,
  [path.normalize('old-testament/exodus/chapter-10.md')]: 29,
  [path.normalize('old-testament/exodus/chapter-11.md')]: 10,
  [path.normalize('old-testament/exodus/chapter-12.md')]: 51,
  [path.normalize('old-testament/exodus/chapter-13.md')]: 22,
  [path.normalize('old-testament/exodus/chapter-14.md')]: 31,
  [path.normalize('old-testament/exodus/chapter-15.md')]: 27,
  [path.normalize('old-testament/exodus/chapter-16.md')]: 36,
  [path.normalize('old-testament/exodus/chapter-17.md')]: 16,
  [path.normalize('old-testament/exodus/chapter-18.md')]: 27,
  [path.normalize('old-testament/exodus/chapter-19.md')]: 25,
  [path.normalize('old-testament/exodus/chapter-20.md')]: 26,
  [path.normalize('old-testament/exodus/chapter-21.md')]: 36,
  [path.normalize('old-testament/exodus/chapter-22.md')]: 31,
  [path.normalize('old-testament/exodus/chapter-23.md')]: 33,
  [path.normalize('old-testament/exodus/chapter-24.md')]: 18,
  [path.normalize('old-testament/exodus/chapter-25.md')]: 40,
  [path.normalize('old-testament/exodus/chapter-26.md')]: 37,
  [path.normalize('old-testament/exodus/chapter-27.md')]: 21,
  [path.normalize('old-testament/exodus/chapter-28.md')]: 43,
  [path.normalize('old-testament/exodus/chapter-29.md')]: 46,
  [path.normalize('old-testament/exodus/chapter-30.md')]: 38,
  [path.normalize('old-testament/exodus/chapter-31.md')]: 18,
  [path.normalize('old-testament/exodus/chapter-32.md')]: 35,
  [path.normalize('old-testament/exodus/chapter-33.md')]: 23,
  [path.normalize('old-testament/exodus/chapter-34.md')]: 35,
  [path.normalize('old-testament/exodus/chapter-35.md')]: 35,
  [path.normalize('old-testament/exodus/chapter-36.md')]: 38,
  [path.normalize('old-testament/exodus/chapter-37.md')]: 29,
  [path.normalize('old-testament/exodus/chapter-38.md')]: 31,
  [path.normalize('old-testament/exodus/chapter-39.md')]: 43,
  [path.normalize('old-testament/exodus/chapter-40.md')]: 38,
  [path.normalize('old-testament/leviticus/chapter-1.md')]: 17,
  [path.normalize('old-testament/leviticus/chapter-2.md')]: 16,
  [path.normalize('old-testament/leviticus/chapter-3.md')]: 17,
  [path.normalize('old-testament/leviticus/chapter-4.md')]: 35,
  [path.normalize('old-testament/leviticus/chapter-5.md')]: 19,
  [path.normalize('old-testament/leviticus/chapter-6.md')]: 30,
  [path.normalize('old-testament/leviticus/chapter-7.md')]: 38,
  [path.normalize('old-testament/leviticus/chapter-8.md')]: 36,
  [path.normalize('old-testament/leviticus/chapter-9.md')]: 24,
  [path.normalize('old-testament/leviticus/chapter-10.md')]: 20,
  [path.normalize('old-testament/leviticus/chapter-11.md')]: 47,
  [path.normalize('old-testament/leviticus/chapter-12.md')]: 8,
  [path.normalize('old-testament/leviticus/chapter-13.md')]: 59,
  [path.normalize('old-testament/leviticus/chapter-14.md')]: 57,
  [path.normalize('old-testament/leviticus/chapter-15.md')]: 33,
  [path.normalize('old-testament/leviticus/chapter-16.md')]: 34,
  [path.normalize('old-testament/leviticus/chapter-17.md')]: 16,
  [path.normalize('old-testament/leviticus/chapter-18.md')]: 30,
  [path.normalize('old-testament/leviticus/chapter-19.md')]: 37,
  [path.normalize('old-testament/leviticus/chapter-20.md')]: 27,
  [path.normalize('old-testament/leviticus/chapter-21.md')]: 24,
  [path.normalize('old-testament/leviticus/chapter-22.md')]: 33,
  [path.normalize('old-testament/leviticus/chapter-23.md')]: 44,
  [path.normalize('old-testament/leviticus/chapter-24.md')]: 23,
  [path.normalize('old-testament/leviticus/chapter-25.md')]: 55,
  [path.normalize('old-testament/leviticus/chapter-26.md')]: 46,
  [path.normalize('old-testament/leviticus/chapter-27.md')]: 34,
  ...chapterCounts('old-testament/numbers', [
    54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32,
    22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13,
  ]),
  ...chapterCounts('old-testament/deuteronomy', [
    46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22,
    21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12,
  ]),
  ...chapterCounts('old-testament/joshua', [
    18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24,
    33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33,
  ]),
  ...chapterCounts('old-testament/judges', [
    36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15,
    25, 20, 20, 31, 13, 31, 30, 48, 25,
  ]),
  ...chapterCounts('old-testament/ruth', [22, 23, 18, 22]),
  ...chapterCounts('old-testament/1-samuel', [
    28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25,
    23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22,
    44, 25, 12, 25, 11, 31, 13,
  ]),
  ...chapterCounts('old-testament/2-samuel', [
    27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31,
    39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25,
  ]),
  ...chapterCounts('old-testament/1-kings', [
    53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43,
    33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53,
  ]),
};

const theologicalGuardrails = [
  {
    pattern: /\bGod speaks,\s+and creation obeys\b/i,
    message: 'Prefer "God speaks, and his words come to pass" over personifying creation as obeying',
  },
  {
    pattern: /\bplaced lights in the sky\b/i,
    message: 'Prefer text-shaped wording such as "made the great lights of the sky" in Genesis 1 summaries',
  },
];

function validateStory(filePath, content) {
  if (isBibleTextFile(filePath)) {
    return validateBibleTextFile(filePath, content);
  }

  if (content.includes('## Verse-by-Verse Translation')) {
    return validateChapter(filePath, content);
  }

  return validateStoryMarkdown(filePath, content);
}

function validateChapter(filePath, content) {
  const errors = [];
  const warnings = [];

  requireSection(content, '# ', 'chapter title', errors);
  requireSection(content, '## Book Overview', 'book overview', warnings);
  requireSection(content, '## Verse-by-Verse Translation', 'verse-by-verse translation section', errors);
  requireSection(content, '## Chapter Summary', 'chapter summary', warnings);
  requireSection(content, '## Key Lessons for Children', 'key lessons', warnings);
  requireSection(content, '## Memory Verses by Age', 'memory verses by age', warnings);
  requireSection(content, '## Discussion Questions by Age', 'discussion questions by age', warnings);
  requireSection(content, '## Prayer', 'prayer', warnings);
  collectTheologicalGuardrailWarnings(content, warnings);

  if (content.includes('[Continue for verses')) {
    errors.push('Contains placeholder text for unfinished verses');
  }

  const verses = extractVerses(content);
  if (!verses.length) {
    errors.push('No verse entries found');
  }

  const relativePath = path.normalize(path.relative(path.join(__dirname, '../content'), filePath));
  const expectedCount = expectedVerseCounts[relativePath];
  if (expectedCount && verses.length !== expectedCount) {
    errors.push(`Expected ${expectedCount} verses but found ${verses.length}`);
  }

  const ageTextByRange = {};
  for (const ageRange of ['5-7', '8-10']) {
    const ageTextPath = resolveAgeTextPathForChapter(filePath, ageRange);
    if (!ageTextPath) continue;

    if (!fs.existsSync(ageTextPath)) {
      errors.push(`Missing ages ${ageRange} Bible text source: ${path.relative(path.join(__dirname, '../content'), ageTextPath)}`);
      continue;
    }

    const ageTextVerses = extractBibleTextVerses(fs.readFileSync(ageTextPath, 'utf8'));
    ageTextByRange[ageRange] = ageTextVerses;
    if (expectedCount && ageTextVerses.length !== expectedCount) {
      errors.push(`Ages ${ageRange} Bible text source expected ${expectedCount} verses but found ${ageTextVerses.length}`);
    }
  }

  let previousVerseNumber = 0;
  for (const verse of verses) {
    const numberMatch = verse.reference.match(/:(\d+)$/);
    const verseNumber = numberMatch ? Number(numberMatch[1]) : null;

    if (!verseNumber) {
      errors.push(`${verse.reference}: could not read verse number`);
    } else if (previousVerseNumber && verseNumber !== previousVerseNumber + 1) {
      errors.push(`${verse.reference}: verse numbering jumps after verse ${previousVerseNumber}`);
    }
    previousVerseNumber = verseNumber ?? previousVerseNumber;

    if (!verse.body.includes('**Original Reference**:')) {
      errors.push(`${verse.reference}: missing original reference`);
    }

    for (const ageRange of ['5-7', '8-10']) {
      const ageTextVerses = ageTextByRange[ageRange] || [];
      if (ageTextVerses.length && !ageTextVerses.some(ageVerse => ageVerse.reference === verse.reference)) {
        errors.push(`${verse.reference}: missing from ages ${ageRange} Bible text source`);
      }
    }
  }

  return {
    errors,
    warnings,
    valid: errors.length === 0,
  };
}

function validateBibleTextFile(filePath, content) {
  const errors = [];
  const warnings = [];

  requireSection(content, '# ', 'chapter title', errors);
  requireSection(content, '## Book', 'book section', errors);
  requireSection(content, '## Chapter', 'chapter section', errors);
  requireSection(content, '## Verses', 'verses section', errors);

  const verses = extractBibleTextVerses(content);
  if (!verses.length) {
    errors.push('No verse entries found');
  }

  const expectedCount = getExpectedVerseCount(filePath);
  if (expectedCount && verses.length !== expectedCount) {
    errors.push(`Expected ${expectedCount} verses but found ${verses.length}`);
  }

  let previousVerseNumber = 0;
  for (const verse of verses) {
    const numberMatch = verse.reference.match(/:(\d+)$/);
    const verseNumber = numberMatch ? Number(numberMatch[1]) : null;

    if (!verseNumber) {
      errors.push(`${verse.reference}: could not read verse number`);
    } else if (previousVerseNumber && verseNumber !== previousVerseNumber + 1) {
      errors.push(`${verse.reference}: verse numbering jumps after verse ${previousVerseNumber}`);
    }
    previousVerseNumber = verseNumber ?? previousVerseNumber;

    if (!verse.body.trim()) {
      errors.push(`${verse.reference}: verse text is empty`);
    }
  }

  if (isAges5to7File(filePath)) {
    for (const verse of verses) {
      if (verse.body.trim().length < 20 && !isListFragmentVerse(verse.body)) {
        warnings.push(`${verse.reference}: Ages 5-7 text may be too brief for the richer story style`);
      }
    }
  }

  const styleIssues = collectBibleTextStyleIssues(filePath, content);
  errors.push(...styleIssues.errors);
  warnings.push(...styleIssues.warnings);

  return {
    errors,
    warnings,
    valid: errors.length === 0,
  };
}

function validateStoryMarkdown(filePath, content) {
  const errors = [];
  const warnings = [];

  requireSection(content, '# ', 'story title', errors);
  requireSection(content, '## Bible Reference', 'Bible Reference section', errors);
  requireSection(content, '## Age Group', 'Age Group section', errors);
  requireSection(content, '## Story Content', 'Story Content section', errors);
  requireSection(content, '## Key Lesson', 'Key Lesson section', errors);
  requireSection(content, '## Discussion Questions', 'Discussion Questions section', errors);
  requireSection(content, '## Memory Verse', 'Memory Verse section', errors);
  requireSection(content, '## Prayer', 'Prayer section', errors);

  if (!content.includes('### Ages 5-7')) {
    warnings.push('Missing Ages 5-7 section');
  }
  if (!content.includes('### Ages 8-10')) {
    warnings.push('Missing Ages 8-10 section');
  }
  if (!content.includes('<!-- Illustration Prompt -->')) {
    warnings.push('Missing illustration prompt');
  }

  return {
    errors,
    warnings,
    valid: errors.length === 0,
  };
}

function validateApprovedChapterManifest(contentDir) {
  const errors = [];
  const warnings = [];
  const manifestPath = path.join(contentDir, 'bible-text', 'approved-chapters.json');

  if (!fs.existsSync(manifestPath)) {
    return {
      errors: ['Missing approved chapter manifest: bible-text/approved-chapters.json'],
      warnings,
      valid: false,
    };
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    return {
      errors: [`Could not parse approved chapter manifest: ${err.message}`],
      warnings,
      valid: false,
    };
  }

  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    errors.push('Approved chapter manifest must be a JSON object');
    return { errors, warnings, valid: false };
  }

  for (const [testament, books] of Object.entries(manifest)) {
    if (!['old-testament', 'new-testament'].includes(testament)) {
      warnings.push(`Unknown testament "${testament}" in approved chapter manifest`);
    }

    if (!books || typeof books !== 'object' || Array.isArray(books)) {
      errors.push(`${testament}: expected a book-to-chapters object`);
      continue;
    }

    for (const [bookSlug, chapters] of Object.entries(books)) {
      if (!Array.isArray(chapters)) {
        errors.push(`${testament}/${bookSlug}: approved chapters must be an array`);
        continue;
      }

      const seenChapters = new Set();
      for (const chapterNumber of chapters) {
        if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
          errors.push(`${testament}/${bookSlug}: chapter "${chapterNumber}" must be a positive integer`);
          continue;
        }

        if (seenChapters.has(chapterNumber)) {
          warnings.push(`${testament}/${bookSlug}/chapter-${chapterNumber}: duplicate approved chapter entry`);
        }
        seenChapters.add(chapterNumber);

        const requiredFiles = [
          path.join(contentDir, testament, bookSlug, `chapter-${chapterNumber}.md`),
          path.join(contentDir, 'bible-text', 'ages-5-7', testament, bookSlug, `chapter-${chapterNumber}.md`),
          path.join(contentDir, 'bible-text', 'ages-8-10', testament, bookSlug, `chapter-${chapterNumber}.md`),
        ];

        for (const requiredFile of requiredFiles) {
          if (!fs.existsSync(requiredFile)) {
            errors.push(
              `${testament}/${bookSlug}/chapter-${chapterNumber}: missing ${path.relative(contentDir, requiredFile)}`
            );
          }
        }
      }
    }
  }

  return {
    errors,
    warnings,
    valid: errors.length === 0,
  };
}

function requireSection(content, marker, label, bucket) {
  if (!content.includes(marker)) {
    bucket.push(`Missing ${label}`);
  }
}

function extractVerses(content) {
  const verseSection = extractSection(content, '## Verse-by-Verse Translation') || content;
  const verseRegex = /^###\s+(.+?\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+.+?\s+\d+:\d+\s*$|^##\s+|(?![\s\S]))/gm;
  return [...verseSection.matchAll(verseRegex)].map((match) => ({
    reference: match[1].trim(),
    body: match[2],
  }));
}

function extractBibleTextVerses(content) {
  const verseSection = extractSection(content, '## Verses') || content;
  const verseRegex = /^###\s+(.+?\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+.+?\s+\d+:\d+\s*$|^##\s+|(?![\s\S]))/gm;
  return [...verseSection.matchAll(verseRegex)].map((match) => ({
    reference: match[1].trim(),
    body: match[2].trim(),
  }));
}

function extractAgeText(content, ageLabel) {
  const regex = new RegExp(
    `^####\\s+Ages\\s+${escapeRegex(ageLabel)}\\s*\\r?\\n([\\s\\S]*?)(?=^####\\s+Ages\\s+|^\\*\\*|^<!--|^---\\s*$|^###\\s+|(?![\\s\\S]))`,
    'm'
  );
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function extractSection(content, heading) {
  const regex = new RegExp(`${escapeRegex(heading)}\\s*\\r?\\n+([\\s\\S]*?)(?=\\r?\\n##\\s|(?![\\s\\S]))`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findMarkdownFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    for (const item of fs.readdirSync(currentDir)) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function isBibleTextFile(filePath) {
  const relativePath = path.normalize(path.relative(path.join(__dirname, '../content'), filePath));
  return relativePath.startsWith(path.normalize('bible-text/'));
}

function isAges5to7File(filePath) {
  const relativePath = path.normalize(path.relative(path.join(__dirname, '../content'), filePath));
  return relativePath.startsWith(path.normalize('bible-text/ages-5-7/'));
}

function isListFragmentVerse(text) {
  const trimmed = text.trim();
  return trimmed.endsWith(',') || /^[a-z]/.test(trimmed);
}

function collectTheologicalGuardrailWarnings(content, warnings) {
  for (const guardrail of theologicalGuardrails) {
    if (guardrail.pattern.test(content)) {
      warnings.push(guardrail.message);
    }
  }
}

function resolveAgeTextPathForChapter(filePath, ageRange) {
  const contentDir = path.join(__dirname, '../content');
  const relativePath = path.normalize(path.relative(contentDir, filePath));

  if (!relativePath.startsWith(path.normalize('old-testament/')) && !relativePath.startsWith(path.normalize('new-testament/'))) {
    return null;
  }

  return path.join(contentDir, 'bible-text', `ages-${ageRange}`, relativePath);
}

function getExpectedVerseCount(filePath) {
  const contentDir = path.join(__dirname, '../content');
  const relativePath = path.normalize(path.relative(contentDir, filePath));
  const bibleTextMatch = relativePath.match(new RegExp(`^${escapeRegex(path.normalize('bible-text/'))}ages-(?:5-7|8-10)[\\\\/]?(.+)$`));
  const chapterPath = bibleTextMatch ? path.normalize(bibleTextMatch[1]) : relativePath;

  return expectedVerseCounts[chapterPath];
}

function validateAll() {
  const contentDir = path.join(__dirname, '../content');
  const markdownFiles = findMarkdownFiles(contentDir);

  if (markdownFiles.length === 0) {
    console.log(chalk.yellow('No markdown files found in content directory'));
    return;
  }

  console.log(chalk.blue(`Validating ${markdownFiles.length} markdown files...\n`));

  let totalErrors = 0;
  let totalWarnings = 0;
  let validFiles = 0;

  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = validateStory(filePath, content);

    if (result.valid) {
      console.log(chalk.green(`OK ${path.relative(contentDir, filePath)}`));
      validFiles++;
    } else {
      console.log(chalk.red(`FAIL ${path.relative(contentDir, filePath)}`));
    }

    for (const error of result.errors) {
      console.log(chalk.red(`  Error: ${error}`));
    }

    for (const warning of result.warnings) {
      console.log(chalk.yellow(`  Warning: ${warning}`));
    }

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  }

  const manifestResult = validateApprovedChapterManifest(contentDir);
  console.log('');
  if (manifestResult.valid) {
    console.log(chalk.green('OK bible-text/approved-chapters.json'));
    validFiles++;
  } else {
    console.log(chalk.red('FAIL bible-text/approved-chapters.json'));
  }

  for (const error of manifestResult.errors) {
    console.log(chalk.red(`  Error: ${error}`));
  }

  for (const warning of manifestResult.warnings) {
    console.log(chalk.yellow(`  Warning: ${warning}`));
  }

  totalErrors += manifestResult.errors.length;
  totalWarnings += manifestResult.warnings.length;

  console.log('\n' + chalk.blue('Validation Summary:'));
  console.log(`Files validated: ${markdownFiles.length + 1}`);
  console.log(chalk.green(`Valid files: ${validFiles}`));
  console.log(chalk.red(`Total errors: ${totalErrors}`));
  console.log(chalk.yellow(`Total warnings: ${totalWarnings}`));

  if (totalErrors > 0) {
    console.log('\n' + chalk.red('Validation failed. Please fix errors before submitting.'));
    process.exit(1);
  }

  if (totalWarnings > 0) {
    console.log('\n' + chalk.yellow('Validation passed with warnings.'));
  } else {
    console.log('\n' + chalk.green('All files passed validation.'));
  }
}

if (require.main === module) {
  validateAll();
}

module.exports = { validateStory, validateChapter, validateApprovedChapterManifest, validateAll };
