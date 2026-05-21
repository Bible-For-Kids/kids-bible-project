#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = '2-samuel';
const BOOK_NAME = '2 Samuel';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 24 }, (_, index) => index + 1);

const BOOK_OVERVIEW =
  '2 Samuel tells how the Lord established David as king, made covenant promises to his house, exposed David\'s sin and its sorrow, and showed both judgment and mercy.';

const RESOURCE_DATA = {
  1: {
    summary: 'David hears that Saul and Jonathan have died and grieves deeply instead of celebrating. He judges the Amalekite messenger and teaches Judah a lament for Saul and Jonathan.',
    lessons: [
      ['Godly grief honors what is true', 'David mourns Saul and Jonathan even though Saul had been his enemy.'],
      ['Life and death are serious before God', 'David refuses to treat the death of the Lord\'s anointed king lightly.'],
    ],
  },
  2: {
    summary: 'David asks the Lord where to go, and Judah anoints him king in Hebron. Abner makes Ishbosheth king over Israel, and conflict grows between David\'s servants and Saul\'s house.',
    lessons: [
      ['Ask the Lord before moving forward', 'David seeks the Lord before going to Hebron.'],
      ['Divided hearts bring conflict', 'Judah follows David while other tribes follow Saul\'s house.'],
    ],
  },
  3: {
    summary: 'David grows stronger while Saul\'s house grows weaker. Abner turns toward David, but Joab murders Abner, and David publicly grieves to show he is not guilty of Abner\'s blood.',
    lessons: [
      ['God can establish his promise through messy times', 'David\'s house grows stronger while the kingdom is divided.'],
      ['Revenge brings guilt', 'Joab kills Abner, but David refuses to approve the murder.'],
    ],
  },
  4: {
    summary: 'Two men murder Ishbosheth and bring his head to David, expecting reward. David judges them because they killed an innocent man in his own house.',
    lessons: [
      ['Wrong actions are not holy help', 'The murderers think they are helping David, but David calls their act evil.'],
      ['Righteous rule protects the innocent', 'David judges the killing of Ishbosheth instead of rewarding it.'],
    ],
  },
  5: {
    summary: 'All Israel anoints David king, and David captures Jerusalem, the city of David. The Lord establishes David and gives him victories over the Philistines when David asks for guidance.',
    lessons: [
      ['The Lord establishes leaders', 'David knows his kingdom is lifted up for the sake of God\'s people.'],
      ['Victory follows God\'s word', 'David asks the Lord before fighting the Philistines.'],
    ],
  },
  6: {
    summary: 'David brings the ark toward Jerusalem, but Uzzah dies when the ark is handled wrongly. Later David brings the ark with reverence and joy, while Michal despises David\'s worship.',
    lessons: [
      ['Holy worship needs reverence', 'The ark must be treated according to the Lord\'s holiness.'],
      ['Joy before the Lord can be humble', 'David rejoices before the Lord with all his strength.'],
    ],
  },
  7: {
    summary: 'David wants to build a house for the Lord, but the Lord promises to build David a house. God promises that David\'s offspring will have an everlasting throne.',
    lessons: [
      ['God\'s promises are greater than our plans', 'David wants to build for God, but God promises to build David\'s house.'],
      ['The Lord keeps covenant', 'God promises a kingdom and throne that point beyond David himself.'],
    ],
  },
  8: {
    summary: 'The Lord gives David victories over surrounding enemies, and David dedicates treasures to the Lord. David rules over Israel with justice and righteousness.',
    lessons: [
      ['The Lord gives victory', 'David\'s success comes because the Lord preserves him.'],
      ['Good rule needs justice', 'David administers justice and righteousness for his people.'],
    ],
  },
  9: {
    summary: 'David remembers his covenant with Jonathan and seeks someone from Saul\'s house to show kindness to. He brings Mephibosheth to his table and restores Saul\'s land to him.',
    lessons: [
      ['Covenant love remembers promises', 'David shows kindness for Jonathan\'s sake.'],
      ['Kindness lifts the weak', 'Mephibosheth receives a place at the king\'s table.'],
    ],
  },
  10: {
    summary: 'David sends kindness to Hanun after his father dies, but Hanun shames David\'s servants and hires Aramean armies. The Lord gives Israel victory through Joab and Abishai.',
    lessons: [
      ['Rejected kindness can lead to conflict', 'Hanun answers David\'s kindness with shame.'],
      ['Courage trusts the Lord', 'Joab calls the army to be strong while leaving the outcome to the Lord.'],
    ],
  },
  11: {
    summary: 'David stays in Jerusalem, takes Bathsheba, and arranges Uriah\'s death to hide his sin. David marries Bathsheba, but the thing David has done is evil in the Lord\'s sight.',
    lessons: [
      ['Sin grows when it is hidden', 'David\'s first sin leads to lies and murder.'],
      ['The Lord sees what kings do', 'David can hide from people for a time, but not from the Lord.'],
    ],
  },
  12: {
    summary: 'Nathan confronts David with a parable, and David confesses that he has sinned against the Lord. The Lord forgives David, but painful consequences follow, and later Solomon is born.',
    lessons: [
      ['God exposes sin to bring truth', 'Nathan\'s parable helps David see his guilt.'],
      ['Forgiveness is real, and sin is still serious', 'David is forgiven, yet sorrow follows his sin.'],
    ],
  },
  13: {
    summary: 'Amnon sins terribly against Tamar, and David\'s house fills with grief and anger. Absalom later kills Amnon and flees, leaving David mourning and the family torn apart.',
    lessons: [
      ['God names evil as evil', 'Amnon\'s sin against Tamar is not softened or excused.'],
      ['Sin tears families apart', 'David\'s household suffers deep sorrow and revenge.'],
    ],
  },
  14: {
    summary: 'Joab uses a wise woman from Tekoa to move David toward bringing Absalom back. Absalom returns to Jerusalem, but the relationship remains broken for a time.',
    lessons: [
      ['Return is not always full repair', 'Absalom comes back, but the house is still wounded.'],
      ['Wise words can uncover a heart', 'The woman\'s story presses David to think about mercy and exile.'],
    ],
  },
  15: {
    summary: 'Absalom steals the hearts of Israel and begins a rebellion. David flees Jerusalem, trusts the Lord with the ark, and sends friends back to help him with wisdom.',
    lessons: [
      ['Pride can steal hearts', 'Absalom wins people by flattery and false promises.'],
      ['Faith trusts God in exile', 'David leaves Jerusalem and puts himself in the Lord\'s hands.'],
    ],
  },
  16: {
    summary: 'Ziba meets David with supplies, Shimei curses David, and David humbly leaves judgment with the Lord. Absalom enters Jerusalem and follows Ahithophel\'s wicked counsel.',
    lessons: [
      ['Humility leaves judgment with God', 'David refuses to strike Shimei and hopes in the Lord.'],
      ['Sinful counsel deepens rebellion', 'Absalom follows advice that shames his father.'],
    ],
  },
  17: {
    summary: 'Ahithophel and Hushai give different counsel to Absalom, and the Lord uses Hushai\'s counsel to defeat Ahithophel\'s plan. David receives warning and supplies in the wilderness.',
    lessons: [
      ['The Lord can overturn clever plans', 'God defeats Ahithophel\'s counsel through Hushai.'],
      ['God provides in the wilderness', 'David and his people receive food and help when they are weary.'],
    ],
  },
  18: {
    summary: 'David\'s servants defeat Absalom\'s army, and Absalom dies after being caught in a tree. David grieves bitterly for Absalom, even though Absalom rebelled against him.',
    lessons: [
      ['Rebellion brings bitter sorrow', 'Absalom\'s rebellion ends in death and grief.'],
      ['A father\'s grief can be deep', 'David mourns his son with heartbreaking words.'],
    ],
  },
  19: {
    summary: 'Joab rebukes David for grieving in a way that discourages the people who saved him. David returns toward Jerusalem, showing mercy to Shimei and Mephibosheth while Israel and Judah argue.',
    lessons: [
      ['Leaders must care for their people', 'David must rise and speak kindly to his servants.'],
      ['Mercy can mark a restored king', 'David spares Shimei and listens to Mephibosheth.'],
    ],
  },
  20: {
    summary: 'Sheba leads another rebellion, and Joab kills Amasa. A wise woman of Abel helps end the crisis so the city is spared.',
    lessons: [
      ['Rebellion keeps causing harm', 'Sheba divides the people after Absalom\'s rebellion.'],
      ['Wisdom can protect a city', 'A wise woman speaks and prevents wider destruction.'],
    ],
  },
  21: {
    summary: 'David seeks the Lord during a famine and deals with Saul\'s guilt against the Gibeonites. The chapter also records battles with Philistine giants and the bravery of David\'s servants.',
    lessons: [
      ['Old wrongs still matter', 'David must address Saul\'s sin against the Gibeonites.'],
      ['God can give strength through others', 'David\'s servants help protect Israel in battle.'],
    ],
  },
  22: {
    summary: 'David sings a song of praise to the Lord, calling him rock, fortress, deliverer, refuge, and savior. David remembers the Lord\'s rescue, righteousness, strength, and covenant kindness.',
    lessons: [
      ['The Lord is a sure refuge', 'David describes God as rock, fortress, shield, and savior.'],
      ['Rescue should become praise', 'David answers the Lord\'s deliverance with worship.'],
    ],
  },
  23: {
    summary: 'David\'s last words praise the God who made an everlasting covenant with him. The chapter also remembers David\'s mighty men and their brave deeds.',
    lessons: [
      ['God\'s covenant is sure', 'David rests in the everlasting covenant God made with him.'],
      ['Faithful courage should be remembered', 'The mighty men used their strength in service of the king.'],
    ],
  },
  24: {
    summary: 'David sins by numbering the people, and judgment comes on Israel. David confesses his sin, builds an altar on Araunah\'s threshing floor, and refuses to offer the Lord what costs him nothing.',
    lessons: [
      ['Even strong kings need repentance', 'David confesses that he has sinned greatly.'],
      ['Worship should not be cheap', 'David will not offer the Lord sacrifices that cost him nothing.'],
    ],
  },
};

const MEMORY_REFERENCES = {
  1: '2 Samuel 1:26',
  2: '2 Samuel 2:1',
  3: '2 Samuel 3:1',
  4: '2 Samuel 4:11',
  5: '2 Samuel 5:12',
  6: '2 Samuel 6:14',
  7: '2 Samuel 7:16',
  8: '2 Samuel 8:15',
  9: '2 Samuel 9:7',
  10: '2 Samuel 10:12',
  11: '2 Samuel 11:27',
  12: '2 Samuel 12:13',
  13: '2 Samuel 13:12',
  14: '2 Samuel 14:14',
  15: '2 Samuel 15:25',
  16: '2 Samuel 16:12',
  17: '2 Samuel 17:14',
  18: '2 Samuel 18:33',
  19: '2 Samuel 19:22',
  20: '2 Samuel 20:22',
  21: '2 Samuel 21:14',
  22: '2 Samuel 22:2',
  23: '2 Samuel 23:5',
  24: '2 Samuel 24:24',
};

function main() {
  for (const chapterNumber of CHAPTERS) {
    const ageTexts = {};

    for (const ageRange of AGE_RANGES) {
      const filePath = ageTextPath(chapterNumber, ageRange);
      const verses = extractVerses(fs.readFileSync(filePath, 'utf8')).map(verse => ({
        ...verse,
        body: polishSamuelText(verse.body, ageRange),
      }));

      ageTexts[ageRange] = verses;
      writeAgeChapter(filePath, chapterNumber, verses);
    }

    updateResourceChapter(chapterNumber, ageTexts);
  }

  console.log(`Reviewed ${BOOK_NAME} chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishSamuelText(text, ageRange) {
  let result = polishKidReadableText(text, ageRange)
    .replace(/\bYahweh\b/g, 'the Lord')
    .replace(/\bwhich\b/g, 'that')
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')
    .replace(/\bephod\b/g, 'priestly vest')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bdamsel\b/g, 'young woman')
    .replace(/\bconcubines\b/g, 'secondary wives')
    .replace(/\bconcubine\b/g, 'secondary wife')
    .replace(/\buncircumcised Philistine\b/g, 'Philistine outside God\'s covenant people')
    .replace(/\buncircumcised\b/g, 'outside God\'s covenant people')
    .replace(/\bforeskins?\b/g, 'proofs that enemies were defeated')
    .replace(/\bthose who urinate against a wall\b/g, 'males')
    .replace(/\bone who urinates on a wall\b/g, 'one male')
    .replace(/\bone who urinates against a wall\b/g, 'one male')
    .replace(/\bwho urinates against a wall\b/g, 'male')
    .replace(/\bnaked\b/g, 'without his outer clothes')
    .replace(/\blay with her\b/g, 'sinned with her as if she were his wife')
    .replace(/\blay with\b/g, 'slept with')
    .replace(/\blie with\b/g, 'sleep with')
    .replace(/\bwent in to her\b/g, 'took her as his wife')
    .replace(/\bravished\b/g, 'forced and sinned against')
    .replace(/\bviolated\b/g, 'hurt and sinned against')
    .replace(/\bharlot\b/g, 'woman in sexual sin')
    .replace(/\bdevoted to destruction\b/g, 'set apart for the Lord\'s judgment')
    .replace(/\butterly destroy\b/g, 'completely destroy under the Lord\'s judgment')
    .replace(/\butterly destroyed\b/g, 'completely destroyed under the Lord\'s judgment')
    .replace(/\bseer\b/g, 'prophet called a seer')
    .replace(/\bseers\b/g, 'prophets called seers');

  if (ageRange === '5-7') {
    result = result
      .replace(/\bpriestly vest\b/g, 'special priestly vest')
      .replace(/\bset apart for the Lord's judgment\b/g, 'set apart for the Lord to judge')
      .replace(/\bcompletely destroy under the Lord's judgment\b/g, 'completely destroy as the Lord judged')
      .replace(/\bsecondary wives\b/g, 'other wives')
      .replace(/\bsecondary wife\b/g, 'other wife');
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
    .replace(/\bmust be with\b/g, 'will be with')
    .replace(/\bmust give\b/g, 'will give')
    .replace(/\bmust deliver\b/g, 'will deliver')
    .replace(/\bmust rule\b/g, 'will rule')
    .replace(/\bspecial special priestly vest\b/g, 'special priestly vest')
    .replace(/\ban special priestly vest\b/g, 'a special priestly vest')
    .replace(/\ban priestly vest\b/g, 'a priestly vest')
    .replace(/\bsweet-smelling sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\brun away away\b/g, 'run away')
    .replace(/\bthe Lord the Lord\b/g, 'the Lord')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\bToday, The Lord\b/g, 'Today, the Lord')
    .replace(/\bwhen The Lord\b/g, 'when the Lord')
    .replace(/\bbecause The Lord\b/g, 'because the Lord')
    .replace(/\. the Lord/g, '. The Lord')
    .replace(/\? the Lord/g, '? The Lord')
    .replace(/"the Lord/g, '"The Lord')
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
