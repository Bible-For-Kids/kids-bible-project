#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = '1-kings';
const BOOK_NAME = '1 Kings';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 22 }, (_, index) => index + 1);

const BOOK_OVERVIEW =
  '1 Kings tells how Solomon received wisdom and built the temple, how his heart turned away, how the kingdom divided, and how the Lord spoke through prophets like Elijah.';

const RESOURCE_DATA = {
  1: {
    summary: 'David is old, and Adonijah tries to make himself king. Nathan and Bathsheba tell David, and David keeps his promise by having Solomon anointed as king.',
    lessons: [
      ['God keeps his covenant line', 'Solomon becomes king according to David\'s promise, not Adonijah\'s pride.'],
      ['Pride grasps for honor', 'Adonijah lifts himself up instead of waiting for the right appointment.'],
    ],
  },
  2: {
    summary: 'David charges Solomon to walk in the Lord\'s ways, then dies. Solomon\'s kingdom is established as he deals with Adonijah, Abiathar, Joab, and Shimei.',
    lessons: [
      ['A king must listen to God\'s law', 'David tells Solomon to keep the Lord\'s charge and walk in his ways.'],
      ['Justice establishes the kingdom', 'Solomon must rule with wisdom and judgment after David dies.'],
    ],
  },
  3: {
    summary: 'The Lord invites Solomon to ask for a gift, and Solomon asks for a listening heart to judge the people. God gives him wisdom, and Solomon shows that wisdom in a difficult judgment.',
    lessons: [
      ['Wisdom is better than selfish gain', 'Solomon asks for wisdom instead of long life or riches.'],
      ['God gives wisdom for justice', 'Solomon\'s wise judgment protects the living child.'],
    ],
  },
  4: {
    summary: 'Solomon organizes the kingdom, and Israel enjoys peace and plenty. God gives Solomon great wisdom, and people from many nations come to hear him.',
    lessons: [
      ['God can give wisdom abundantly', 'Solomon\'s understanding is described as wide like the sand on the shore.'],
      ['Peace is a gift to steward', 'The people live in safety while Solomon rules.'],
    ],
  },
  5: {
    summary: 'Solomon prepares to build the Lord\'s house by making peace with Hiram and gathering workers, cedar, and stone. The building project begins because the Lord promised David that his son would build.',
    lessons: [
      ['God\'s promises guide our work', 'Solomon builds because the Lord spoke to David.'],
      ['Good work needs order and help', 'Solomon gathers materials and workers for the temple.'],
    ],
  },
  6: {
    summary: 'Solomon builds the temple with carefully prepared rooms, woodwork, gold, and carvings. The Lord reminds Solomon that obedience matters more than the beauty of the building.',
    lessons: [
      ['God cares about obedience', 'The Lord speaks about walking in his statutes while the temple is being built.'],
      ['Beautiful worship must honor God\'s word', 'The temple is carefully made for the Lord, not for human pride.'],
    ],
  },
  7: {
    summary: 'Solomon builds his palace and finishes the temple furnishings through Hiram\'s skilled bronze work. The temple receives pillars, bowls, stands, tools, gold items, and David\'s dedicated treasures.',
    lessons: [
      ['Skill can serve worship', 'Hiram\'s craft is used for the Lord\'s house.'],
      ['Dedicated gifts belong to the Lord', 'Solomon brings David\'s dedicated treasures into the temple.'],
    ],
  },
  8: {
    summary: 'The ark is brought into the temple, and the glory of the Lord fills the house. Solomon blesses the Lord, prays for Israel, and calls the people to have hearts wholly devoted to God.',
    lessons: [
      ['God keeps every promise', 'Solomon says not one word of the Lord\'s good promise has failed.'],
      ['Prayer looks to God\'s mercy', 'Solomon asks the Lord to hear when his people pray and repent.'],
    ],
  },
  9: {
    summary: 'The Lord appears to Solomon again and promises blessing for faithfulness but warns of judgment if Solomon or Israel turns to false gods. The chapter also records Solomon\'s building projects and trade.',
    lessons: [
      ['Covenant blessing calls for faithfulness', 'The Lord calls Solomon to walk before him with a whole heart.'],
      ['Idolatry brings judgment', 'The Lord warns that turning to false gods will bring disaster.'],
    ],
  },
  10: {
    summary: 'The queen of Sheba visits Solomon, hears his wisdom, sees his kingdom, and blesses the Lord. Solomon\'s wealth and fame grow greatly.',
    lessons: [
      ['True wisdom points beyond the king', 'The queen blesses the Lord who set Solomon on the throne.'],
      ['Riches cannot be the heart\'s treasure', 'Solomon\'s wealth is impressive, but later chapters show wealth cannot keep a heart faithful.'],
    ],
  },
  11: {
    summary: 'Solomon loves many foreign wives, and they turn his heart after false gods. The Lord judges Solomon by announcing that the kingdom will be torn, though not completely because of David.',
    lessons: [
      ['A heart can drift from the Lord', 'Solomon\'s wisdom does not protect him when he loves what God warned against.'],
      ['God keeps mercy in judgment', 'The kingdom will be torn, but the Lord remembers David\'s covenant line.'],
    ],
  },
  12: {
    summary: 'Rehoboam rejects wise counsel and answers Israel harshly, so the kingdom divides. Jeroboam becomes king over Israel and makes golden calves, leading the people into sin.',
    lessons: [
      ['Harsh pride can divide people', 'Rehoboam refuses wise counsel and loses much of the kingdom.'],
      ['False worship is sin', 'Jeroboam\'s calves turn the people away from the Lord\'s appointed worship.'],
    ],
  },
  13: {
    summary: 'A man of God speaks the Lord\'s word against Jeroboam\'s altar, but later disobeys the Lord after an old prophet lies to him. The Lord\'s word proves true.',
    lessons: [
      ['God\'s word must be obeyed', 'The man of God must follow what the Lord told him.'],
      ['Lies can lead people into danger', 'The old prophet\'s lie does not remove the need to obey God.'],
    ],
  },
  14: {
    summary: 'Ahijah announces judgment on Jeroboam\'s house because of his idolatry. Rehoboam also leads Judah into sin, and Egypt takes treasures from the Lord\'s house and the king\'s house.',
    lessons: [
      ['Idolatry brings grief', 'Jeroboam\'s false worship brings judgment on his house.'],
      ['A holy name must not be used for unholy living', 'Judah has the temple, but still turns to evil.'],
    ],
  },
  15: {
    summary: 'The chapter compares kings of Judah and Israel. Abijam is not wholly devoted to the Lord, but Asa does what is right, removes idol worship, and trusts the Lord imperfectly amid conflict.',
    lessons: [
      ['The Lord sees the heart of a king', 'The chapter measures kings by faithfulness to the Lord.'],
      ['Doing right may require removing wrong', 'Asa removes sinful worship practices from Judah.'],
    ],
  },
  16: {
    summary: 'Israel passes through several wicked kings, each walking in sin and violence. Ahab becomes king and does more evil than those before him, serving Baal with Jezebel.',
    lessons: [
      ['Sin can deepen over generations', 'Israel\'s kings continue and increase evil.'],
      ['False worship corrupts leadership', 'Ahab brings Baal worship into Israel openly.'],
    ],
  },
  17: {
    summary: 'Elijah announces drought to Ahab, and the Lord feeds Elijah by ravens and then through a widow. The Lord provides flour and oil and later restores the widow\'s son to life.',
    lessons: [
      ['The Lord provides in dry places', 'God feeds Elijah during the drought.'],
      ['God\'s word is true', 'The widow sees that the Lord\'s word in Elijah\'s mouth is truth.'],
    ],
  },
  18: {
    summary: 'Elijah meets Ahab and calls Israel to choose between the Lord and Baal. On Mount Carmel, the Lord answers by fire, the people confess that the Lord is God, and rain returns.',
    lessons: [
      ['The Lord alone is God', 'Baal cannot answer, but the Lord answers by fire.'],
      ['God turns hearts back', 'Elijah prays so the people will know the Lord is God.'],
    ],
  },
  19: {
    summary: 'Elijah runs into the wilderness afraid and weary, and the Lord feeds him and meets him at Horeb. The Lord speaks in a gentle whisper and sends Elijah back with new work and a promise of a faithful remnant.',
    lessons: [
      ['The Lord cares for tired servants', 'God gives Elijah food, rest, and his word.'],
      ['God is not absent when we feel alone', 'The Lord has kept seven thousand who have not bowed to Baal.'],
    ],
  },
  20: {
    summary: 'The Lord gives Ahab victories over Ben Hadad so Israel will know that he is the Lord. Ahab disobeys by sparing the enemy king, and a prophet announces judgment.',
    lessons: [
      ['The Lord proves he is God everywhere', 'God is Lord of hills and valleys.'],
      ['Mercy must not ignore God\'s command', 'Ahab spares Ben Hadad against the Lord\'s word.'],
    ],
  },
  21: {
    summary: 'Ahab wants Naboth\'s vineyard, and Jezebel arranges false witnesses so Naboth is killed. Elijah confronts Ahab, and the Lord notes Ahab\'s humbling while still judging his house.',
    lessons: [
      ['Greed can become great evil', 'Ahab\'s desire for a vineyard leads to Naboth\'s death.'],
      ['The Lord sees hidden injustice', 'Ahab and Jezebel cannot hide Naboth\'s blood from God.'],
    ],
  },
  22: {
    summary: 'Ahab wants to fight Ramoth Gilead, and Micaiah speaks the Lord\'s true word even when pressured to agree with false prophets. Ahab ignores the warning and dies in battle, as the Lord said.',
    lessons: [
      ['God\'s word is true even when unpopular', 'Micaiah says only what the Lord tells him.'],
      ['Disguises cannot hide someone from God', 'Ahab goes into battle disguised, but the Lord\'s word still comes to pass.'],
    ],
  },
};

const MEMORY_REFERENCES = {
  1: '1 Kings 1:39',
  2: '1 Kings 2:3',
  3: '1 Kings 3:9',
  4: '1 Kings 4:29',
  5: '1 Kings 5:5',
  6: '1 Kings 6:13',
  7: '1 Kings 7:51',
  8: '1 Kings 8:56',
  9: '1 Kings 9:5',
  10: '1 Kings 10:9',
  11: '1 Kings 11:4',
  12: '1 Kings 12:30',
  13: '1 Kings 13:26',
  14: '1 Kings 14:8',
  15: '1 Kings 15:11',
  16: '1 Kings 16:30',
  17: '1 Kings 17:14',
  18: '1 Kings 18:39',
  19: '1 Kings 19:12',
  20: '1 Kings 20:28',
  21: '1 Kings 21:29',
  22: '1 Kings 22:14',
};

function main() {
  for (const chapterNumber of CHAPTERS) {
    const ageTexts = {};

    for (const ageRange of AGE_RANGES) {
      const filePath = ageTextPath(chapterNumber, ageRange);
      const verses = extractVerses(fs.readFileSync(filePath, 'utf8')).map(verse => ({
        ...verse,
        body: polishKingsText(verse.body, ageRange),
      }));

      ageTexts[ageRange] = verses;
      writeAgeChapter(filePath, chapterNumber, verses);
    }

    updateResourceChapter(chapterNumber, ageTexts);
  }

  console.log(`Reviewed ${BOOK_NAME} chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishKingsText(text, ageRange) {
  let result = polishKidReadableText(text, ageRange)
    .replace(/\bYahweh\b/g, 'the Lord')
    .replace(/\bwhich\b/g, 'that')
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')
    .replace(/\bstatutes\b/g, 'laws')
    .replace(/\bstatute\b/g, 'law')
    .replace(/\bordinances\b/g, 'rules')
    .replace(/\bordinance\b/g, 'rule')
    .replace(/\bcommandments\b/g, 'commands')
    .replace(/\bcommandment\b/g, 'command')
    .replace(/\btestimonies\b/g, 'covenant teachings')
    .replace(/\btestimony\b/g, 'covenant teaching')
    .replace(/\bsupplications\b/g, 'humble prayers')
    .replace(/\bsupplication\b/g, 'humble prayer')
    .replace(/\bperpetually\b/g, 'always')
    .replace(/\bloving kindness\b/g, 'faithful kindness')
    .replace(/\btook counsel with\b/g, 'asked advice from')
    .replace(/\btook counsel\b/g, 'asked advice')
    .replace(/\bcounsel\b/g, 'advice')
    .replace(/\bold men\b/g, 'elders')
    .replace(/\byet lived\b/g, 'was still alive')
    .replace(/\bDepart for\b/g, 'Go away for')
    .replace(/\bephod\b/g, 'priestly vest')
    .replace(/\bturban\b/g, 'head covering')
    .replace(/\bsashes\b/g, 'belts')
    .replace(/\bsash\b/g, 'belt')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bdamsel\b/g, 'young woman')
    .replace(/\bconcubines\b/g, 'secondary wives')
    .replace(/\bconcubine\b/g, 'secondary wife')
    .replace(/\bprostitutes\b/g, 'women living in sexual sin')
    .replace(/\bprostitute\b/g, 'woman living in sexual sin')
    .replace(/\bharlots\b/g, 'women living in sexual sin')
    .replace(/\bharlot\b/g, 'woman living in sexual sin')
    .replace(/\bsodomites\b/g, 'people doing sexual sin in idol worship')
    .replace(/\bsodomite\b/g, 'person doing sexual sin in idol worship')
    .replace(/\babominations\b/g, 'detestable sins')
    .replace(/\babomination\b/g, 'detestable sin')
    .replace(/\babominable\b/g, 'detestable')
    .replace(/\bthose who urinate against a wall\b/g, 'males')
    .replace(/\bone who urinates on a wall\b/g, 'one male')
    .replace(/\bone who urinates against a wall\b/g, 'one male')
    .replace(/\beveryone who urinates on a wall\b/g, 'every male')
    .replace(/\beveryone who urinates against a wall\b/g, 'every male')
    .replace(/\bwho urinates against a wall\b/g, 'male')
    .replace(/\bnaked\b/g, 'without his outer clothes')
    .replace(/\blay with her\b/g, 'sinned with her as if she were his wife')
    .replace(/\blay with\b/g, 'slept with')
    .replace(/\blie with\b/g, 'sleep with')
    .replace(/\bwent in to her\b/g, 'took her as his wife')
    .replace(/\bhigh places\b/g, 'high worship places')
    .replace(/\bhigh place\b/g, 'high worship place')
    .replace(/\bmolten bronze\b/g, 'bronze made in molds')
    .replace(/\bmolten image\b/g, 'metal image')
    .replace(/\bmolten images\b/g, 'metal images')
    .replace(/\bmolten sea\b/g, 'huge round bronze basin')
    .replace(/\bmantle\b/g, 'cloak')
    .replace(/\bAmmonitess\b/g, 'Ammonite woman')
    .replace(/\bpavilions\b/g, 'tents')
    .replace(/\bpavilion\b/g, 'tent')
    .replace(/\bmustered\b/g, 'counted')
    .replace(/\bmuster\b/g, 'count')
    .replace(/\bprovinces\b/g, 'districts')
    .replace(/\bprovince\b/g, 'district')
    .replace(/\bchapiters\b/g, 'pillar tops')
    .replace(/\bchapiter\b/g, 'pillar top')
    .replace(/\bknops\b/g, 'round decorations')
    .replace(/\bknop\b/g, 'round decoration')
    .replace(/\blavers\b/g, 'large washbasins')
    .replace(/\blaver\b/g, 'large washbasin')
    .replace(/\boracle\b/g, 'inner room')
    .replace(/\bporch\b/g, 'entry room')
    .replace(/\bbrass\b/g, 'bronze')
    .replace(/\bbrazen\b/g, 'bronze')
    .replace(/\bseahs\b/g, 'small dry measures')
    .replace(/\bseah\b/g, 'small dry measure')
    .replace(/\bbaths\b/g, 'large liquid measures')
    .replace(/\bbath\b/g, 'large liquid measure')
    .replace(/\bcors\b/g, 'large dry measures')
    .replace(/\bcor\b/g, 'large dry measure')
    .replace(/\bwho bore burdens\b/g, 'who carried heavy loads')
    .replace(/\bwho bore the Lord's ark\b/g, "who carried the Lord's ark")
    .replace(/\bguard bore them\b/g, 'guards carried them')
    .replace(/\bcamels that bore\b/g, 'camels that carried')
    .replace(/\bbore him\b/g, 'gave birth to')
    .replace(/\bslept with his fathers\b/g, 'died and was buried with his fathers')
    .replace(/\babhorred\b/g, 'hated')
    .replace(/\bslaughter\b/g, 'many deaths')
    .replace(/\bflesh\b/g, 'body')
    .replace(/\bbosom\b/g, 'arms')
    .replace(/\bmorsel\b/g, 'small piece')
    .replace(/\bmeal\b/g, 'flour')
    .replace(/\bsustain\b/g, 'provide food for')
    .replace(/\bsustained\b/g, 'provided food for')
    .replace(/\bdelivered a child\b/g, 'gave birth to a child')
    .replace(/\bhad ran away\b/g, 'had run away')
    .replace(/\bchastised\b/g, 'disciplined')
    .replace(/\bchastise\b/g, 'discipline')
    .replace(/\bscorpions\b/g, 'whips that sting like scorpions')
    .replace(/\bsullen\b/g, 'gloomy')
    .replace(/\bon high among the people\b/g, 'in an important place among the people')
    .replace(/\bprovocation\b/g, 'anger')
    .replace(/\babominably\b/g, 'in a detestable way')
    .replace(/\babominable\b/g, 'detestable')
    .replace(/\bseer\b/g, 'prophet called a seer')
    .replace(/\bseers\b/g, 'prophets called seers');

  if (ageRange === '5-7') {
    result = result
      .replace(/\bpriestly vest\b/g, 'special priestly vest')
      .replace(/\bsecondary wives\b/g, 'other wives')
      .replace(/\bsecondary wife\b/g, 'other wife')
      .replace(/\bhigh worship places\b/g, 'worship places on hills')
      .replace(/\bhigh worship place\b/g, 'worship place on a hill')
      .replace(/\bcontainers\b/g, 'bowls and tools')
      .replace(/\bcontainer\b/g, 'bowl or tool');
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
    .replace(/\bcherubim, mighty heavenly creatures, mighty heavenly creatures\b/g, 'cherubim, mighty heavenly creatures')
    .replace(/\bsweet-smelling sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\brun away away\b/g, 'run away')
    .replace(/\bthe Lord the Lord\b/g, 'the Lord')
    .replace(/\bdied and was buried with his fathers, and was buried in\b/g, 'died and was buried with his fathers in')
    .replace(/\bdied and was buried with his fathers, and was buried with his fathers in\b/g, 'died and was buried with his fathers in')
    .replace(/\bdied and was buried with her fathers, and was buried in\b/g, 'died and was buried with her fathers in')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\bto to\b/g, 'to')
    .replace(/\band and\b/g, 'and')
    .replace(/^the Lord/g, 'The Lord')
    .replace(/^look,/g, 'Look,')
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
