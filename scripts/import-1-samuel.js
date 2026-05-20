#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const { polishKidReadableText } = require('./lib/kids-bible-style')

const BOOK = '1 Samuel'
const BOOK_SLUG = '1-samuel'
const SOURCE_BASE = 'https://www.canonapi.com/v1/1samuel'
const EXPECTED_VERSE_COUNTS = [
  28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25,
  23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22,
  44, 25, 12, 25, 11, 31, 13,
]

const STORY_REVISIONS = {
  '1 Samuel 1:3': {
    all: 'Every year Elkanah went up from his town to worship and offer sacrifices to the Lord of Armies at Shiloh. Hophni and Phinehas, the two sons of Eli, served there as priests of the Lord.',
  },
  '1 Samuel 1:10': {
    all: 'Hannah was deeply hurt inside. She prayed to the Lord and cried many tears.',
  },
  '1 Samuel 1:11': {
    all: 'She made a solemn promise and said, "Lord of Armies, please look at the sorrow of your servant and remember me. If you give your servant a son, then I will give him to the Lord all the days of his life, and no razor will touch his head."',
  },
  '1 Samuel 2:1': {
    all: 'Hannah prayed and said, "My heart rejoices in the Lord. The Lord has lifted up my strength. My mouth speaks boldly over my enemies, because I rejoice in your salvation.',
  },
  '1 Samuel 2:2': {
    all: 'There is no one holy like the Lord. There is no one besides you. There is no rock like our God.',
  },
  '1 Samuel 3:4': {
    all: 'Then the Lord called, "Samuel!" Samuel answered, "Here I am!"',
  },
  '1 Samuel 3:10': {
    all: 'The Lord came and stood there, calling as before, "Samuel! Samuel!" Samuel said, "Speak, for your servant is listening."',
  },
  '1 Samuel 8:7': {
    all: 'The Lord said to Samuel, "Listen to the voice of the people in all that they say to you. They have not rejected you. They have rejected me from being king over them.',
  },
  '1 Samuel 10:1': {
    all: 'Samuel took the flask of oil and poured it on Saul\'s head. Then he kissed him and said, "Has not the Lord anointed you to be prince over his people Israel?',
  },
  '1 Samuel 12:22': {
    all: 'The Lord will not leave his people, because of his great name, because the Lord was pleased to make you his people.',
  },
  '1 Samuel 13:14': {
    all: 'But now your kingdom will not continue. The Lord has sought for himself a man after his own heart, and the Lord has appointed him to be prince over his people, because you have not kept what the Lord commanded you."',
  },
  '1 Samuel 15:22': {
    all: 'Samuel said, "Does the Lord delight in burnt offerings and sacrifices as much as in obeying the Lord\'s voice? Listen, to obey is better than sacrifice, and to listen is better than the fat of male sheep.',
  },
  '1 Samuel 16:7': {
    all: 'But the Lord said to Samuel, "Do not look at his appearance or how tall he is, because I have rejected him. The Lord does not see as people see. People look at the outward appearance, but the Lord looks at the heart."',
  },
  '1 Samuel 16:16': {
    all: 'Let our lord command your servants who stand before you to look for a man who plays the lyre well. When the harmful spirit from God comes on you, he can play, and you will feel better."',
  },
  '1 Samuel 16:23': {
    all: 'Whenever the spirit from God came on Saul, David took the lyre and played it. Then Saul found relief, felt better, and the harmful spirit left him.',
  },
  '1 Samuel 17:4': {
    all: 'A champion came out from the Philistine camp. His name was Goliath, from Gath. He was a giant of a man, more than nine feet tall.',
  },
  '1 Samuel 17:45': {
    all: 'David said to the Philistine, "You come to me with a sword, a spear, and a javelin, but I come to you in the name of the Lord of Armies, the God of Israel\'s battle lines, whom you have defied.',
  },
  '1 Samuel 17:47': {
    all: 'Then all this assembly will know that the Lord does not save by sword or spear. The battle belongs to the Lord, and he will give you into our hand."',
  },
  '1 Samuel 18:1': {
    all: 'When David finished speaking with Saul, Jonathan\'s heart was knit to David\'s heart. Jonathan loved David as he loved his own life.',
  },
  '1 Samuel 18:3': {
    all: 'Jonathan made a covenant with David, because Jonathan loved him as he loved his own life.',
  },
  '1 Samuel 18:4': {
    all: 'Jonathan took off the robe he was wearing and gave it to David. He also gave David his clothing, his sword, his bow, and his belt.',
  },
  '1 Samuel 18:5': {
    all: 'David went wherever Saul sent him and acted wisely. Saul put him over the soldiers, and this pleased all the people and Saul\'s servants too.',
  },
  '1 Samuel 18:8': {
    all: 'Saul became very angry, and the song displeased him. He said, "They have credited David with ten thousands, but me with only thousands. What more can he have but the kingdom?"',
  },
  '1 Samuel 18:14': {
    all: 'David acted wisely in all his ways, and the Lord was with him.',
  },
  '1 Samuel 18:25': {
    all: 'Saul said, "Tell David, \'The king does not want money for the bride. He wants one hundred proofs that you have defeated Philistine men, so the king can be avenged of his enemies.\'" Saul thought David would fall by the hand of the Philistines.',
  },
  '1 Samuel 18:27': {
    all: 'David and his men went out and defeated two hundred Philistine men. David brought the full number of proofs to the king so he could become the king\'s son-in-law. Then Saul gave him his daughter Michal as his wife.',
  },
  '1 Samuel 20:17': {
    all: 'Jonathan had David promise again because of his love for him, for Jonathan loved David as he loved his own life.',
  },
  '1 Samuel 20:30': {
    all: 'Then Saul\'s anger burned against Jonathan. He said to him, "You son of a rebellious woman! Do I not know that you have chosen the son of Jesse, bringing shame on yourself and on your mother\'s family?',
  },
  '1 Samuel 24:6': {
    all: 'David said to his men, "May the Lord keep me from doing this thing to my lord, the Lord\'s anointed, and from lifting my hand against him, because he is the Lord\'s anointed."',
  },
  '1 Samuel 26:23': {
    all: 'The Lord rewards every person for righteousness and faithfulness. Today the Lord gave you into my hand, but I would not lift my hand against the Lord\'s anointed.',
  },
  '1 Samuel 28:7': {
    all: 'Then Saul said to his servants, "Find me a woman who tries to speak with the dead, so I may go to her and ask her what to do." His servants said, "There is such a woman at En Dor."',
  },
  '1 Samuel 30:6': {
    all: 'David was greatly distressed, because the people talked about throwing stones at him. Every person was bitter in soul for his sons and daughters. But David strengthened himself in the Lord his God.',
  },
}

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
  const override = STORY_REVISIONS[reference]?.[ageRange] || STORY_REVISIONS[reference]?.all
  let text = override || normalizeSource(source)

  text = applySamuelReplacements(text, ageRange)
  return polishKidReadableText(finalPolish(text), ageRange)
}

function applySamuelReplacements(source, ageRange) {
  let text = source
    .replace(/\bYahweh of Armies\b/g, 'the Lord of Armies')
    .replace(/\bYahweh\b/g, 'the Lord')
    .replace(/\bchildren of Israel\b/gi, 'people of Israel')
    .replace(/\bIsraelites\b/g, 'people of Israel')
    .replace(/\bIsraelite\b/g, 'person of Israel')
    .replace(/\bPhilistines\b/g, 'Philistines')
    .replace(/\blords of the Philistines\b/g, 'Philistine rulers')
    .replace(/\blord of the Philistines\b/g, 'Philistine ruler')
    .replace(/\belders\b/g, 'elders')
    .replace(/\bseer\b/g, 'prophet called a seer')
    .replace(/\bseers\b/g, 'prophets called seers')
    .replace(/\bprophet called a prophet called a seer\b/g, 'prophet called a seer')
    .replace(/\bmaidservants\b/g, 'female servants')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bservants\b/g, 'servants')
    .replace(/\bservant\b/g, 'servant')
    .replace(/\bhandmaid\b/g, 'female servant')
    .replace(/\bhandmaids\b/g, 'female servants')
    .replace(/\bdamsel\b/g, 'young woman')
    .replace(/\bdamsels\b/g, 'young women')
    .replace(/\bvirgin\b/g, 'unmarried young woman')
    .replace(/\bvirgins\b/g, 'unmarried young women')
    .replace(/\bconcubine\b/g, 'secondary wife')
    .replace(/\bconcubines\b/g, 'secondary wives')
    .replace(/\blinen ephod\b/g, 'linen priestly vest')
    .replace(/\bephod\b/g, 'priestly vest')
    .replace(/\bteraphim\b/g, 'household idol')
    .replace(/\bgraven image\b/g, 'carved idol')
    .replace(/\bimages\b/g, 'idols')
    .replace(/\bidols idols\b/g, 'idols')
    .replace(/\bAshtaroth\b/g, 'the Ashtaroth')
    .replace(/\bBaalim\b/g, 'the Baals')
    .replace(/\bother gods\b/g, 'false gods')
    .replace(/\bstrange gods\b/g, 'false gods')
    .replace(/\biniquity\b/g, 'sin')
    .replace(/\biniquities\b/g, 'sins')
    .replace(/\btransgressed\b/g, 'sinned')
    .replace(/\btransgression\b/g, 'sin')
    .replace(/\bwickedness\b/g, 'evil')
    .replace(/\bwicked\b/g, 'evil')
    .replace(/\bbarren\b/g, 'unable to have children')
    .replace(/\bwomb\b/g, 'body')
    .replace(/\bconceive\b/g, 'become pregnant')
    .replace(/\bconceived\b/g, 'became pregnant')
    .replace(/\bshe bore a son\b/g, 'she gave birth to a son')
    .replace(/\bHannah bore\b/g, 'Hannah gave birth to')
    .replace(/\bnursing child\b/g, 'baby')
    .replace(/\bsuckling child\b/g, 'baby')
    .replace(/\binfant\b/g, 'little child')
    .replace(/\bweaned\b/g, 'old enough to stop nursing')
    .replace(/\bwean\b/g, 'make old enough to stop nursing')
    .replace(/\bthe yearly sacrifice\b/g, 'the yearly sacrifice')
    .replace(/\bburnt offering\b/g, 'burnt offering')
    .replace(/\bburnt offerings\b/g, 'burnt offerings')
    .replace(/\bsacrifice\b/g, 'sacrifice')
    .replace(/\bsacrifices\b/g, 'sacrifices')
    .replace(/\bark of God\b/g, 'ark of God')
    .replace(/\bark of the Lord\b/g, 'ark of the Lord')
    .replace(/\bark of the covenant\b/g, 'ark of the covenant')
    .replace(/\bgarrisons\b/g, 'military camps')
    .replace(/\bgarrison\b/g, 'military camp')
    .replace(/\bmen of war\b/g, 'soldiers')
    .replace(/\bman of war\b/g, 'soldier')
    .replace(/\bmighty men\b/g, 'brave men')
    .replace(/\bmighty man\b/g, 'brave man')
    .replace(/\bmighty men of valor\b/g, 'brave fighting men')
    .replace(/\bmighty man of valor\b/g, 'brave fighting man')
    .replace(/\bvaliant men\b/g, 'brave men')
    .replace(/\bchampion\b/g, 'champion')
    .replace(/\buncircumcised Philistine\b/g, 'Philistine outside God\'s covenant people')
    .replace(/\buncircumcised Philistines\b/g, 'Philistines outside God\'s covenant people')
    .replace(/\buncircumcised\b/g, 'outside God\'s covenant sign')
    .replace(/\bforeskins of the Philistines\b/g, 'proofs that he had defeated the Philistine men')
    .replace(/\bforeskins\b/g, 'proofs from defeated enemies')
    .replace(/\bforeskin\b/g, 'covenant body sign')
    .replace(/\bthose who urinate against a wall\b/g, 'males')
    .replace(/\bone who urinates on a wall\b/g, 'one male')
    .replace(/\bone who urinates against a wall\b/g, 'one male')
    .replace(/\bwho urinates against a wall\b/g, 'male')
    .replace(/\bpisseth against the wall\b/g, 'male')
    .replace(/\brelieve himself\b/g, 'use the cave privately')
    .replace(/\bcover his feet\b/g, 'use the cave privately')
    .replace(/\bnaked\b/g, 'without his outer clothes')
    .replace(/\bmediums\b/g, 'people who try to speak with the dead')
    .replace(/\bmedium\b/g, 'person who tries to speak with the dead')
    .replace(/\bfamiliar spirits\b/g, 'spirits used for forbidden messages')
    .replace(/\bfamiliar spirit\b/g, 'spirit used for forbidden messages')
    .replace(/\bwizards\b/g, 'people who practice forbidden magic')
    .replace(/\bwizard\b/g, 'person who practices forbidden magic')
    .replace(/\bwitch\b/g, 'woman who practices forbidden magic')
    .replace(/\bdivination\b/g, 'forbidden fortune-telling')
    .replace(/\bwitchcraft\b/g, 'forbidden magic')
    .replace(/\bthe dead\b/g, 'the dead')
    .replace(/\blive before the Lord\b/g, 'serve before the Lord')
    .replace(/\bministered to the Lord\b/g, 'served the Lord')
    .replace(/\bministered before the Lord\b/g, 'served before the Lord')
    .replace(/\bminister\b/g, 'serve')
    .replace(/\bministry\b/g, 'service')
    .replace(/\banointed\b/g, 'anointed')
    .replace(/\banoint\b/g, 'anoint')
    .replace(/\bthe Lord's anointed\b/g, "the Lord's anointed king")
    .replace(/\bprince\b/g, 'leader')
    .replace(/\bprinces\b/g, 'leaders')
    .replace(/\bkingdom\b/g, 'kingdom')
    .replace(/\bthrone\b/g, 'throne')
    .replace(/\breign\b/g, 'rule')
    .replace(/\breigned\b/g, 'ruled')
    .replace(/\bdevoted to destruction\b/g, 'set apart for the Lord\'s judgment')
    .replace(/\bdevote to destruction\b/g, 'set apart for the Lord\'s judgment')
    .replace(/\butterly destroy\b/g, 'completely destroy under the Lord\'s judgment')
    .replace(/\butterly destroyed\b/g, 'completely destroyed under the Lord\'s judgment')
    .replace(/\butterly\b/g, 'completely')
    .replace(/\bslain\b/g, 'killed')
    .replace(/\bslay\b/g, 'kill')
    .replace(/\bsmote\b/g, 'struck')
    .replace(/\bsmite\b/g, 'strike')
    .replace(/\bstruck with the edge of the sword\b/g, 'struck down with the sword')
    .replace(/\bstruck them with the edge of the sword\b/g, 'struck them down with the sword')
    .replace(/\bput to the edge of the sword\b/g, 'struck down with the sword')
    .replace(/\bfell on his sword\b/g, 'fell on his own sword')
    .replace(/\barmor bearer\b/g, 'armor-bearer')
    .replace(/\barmourbearer\b/g, 'armor-bearer')
    .replace(/\bjavelin\b/g, 'short spear')
    .replace(/\bcoat of mail\b/g, 'heavy battle coat')
    .replace(/\bweaver's beam\b/g, 'heavy wooden beam')
    .replace(/\bsix cubits and a span\b/g, 'more than nine feet')
    .replace(/\bcubits\b/g, 'arm-lengths')
    .replace(/\bcubit\b/g, 'arm-length')
    .replace(/\bshekel\b/g, 'silver piece')
    .replace(/\bshekels\b/g, 'silver pieces')
    .replace(/\btalent\b/g, 'large weight')
    .replace(/\btalents\b/g, 'large weights')
    .replace(/\bephah\b/g, 'dry measure')
    .replace(/\bhin\b/g, 'liquid measure')
    .replace(/\bbottle\b/g, 'skin bottle')
    .replace(/\bskin bottle skin bottle\b/g, 'skin bottle')
    .replace(/\bskin-bottle\b/g, 'skin bottle')
    .replace(/\bflask\b/g, 'small bottle')
    .replace(/\bjar\b/g, 'jar')
    .replace(/\bvessel\b/g, 'container')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look')
    .replace(/\bdwelt\b/g, 'lived')
    .replace(/\bdwell\b/g, 'live')
    .replace(/\bencamped\b/g, 'camped')
    .replace(/\bencamp\b/g, 'camp')
    .replace(/\bsojourn\b/g, 'live for a while')
    .replace(/\bsojourned\b/g, 'lived for a while')
    .replace(/\blodged\b/g, 'stayed')
    .replace(/\blodge\b/g, 'stay')
    .replace(/\bfetched\b/g, 'brought')
    .replace(/\bwhither\b/g, 'where')
    .replace(/\bthither\b/g, 'there')
    .replace(/\bentreated the favor of\b/g, 'asked for favor from')
    .replace(/\bentreat\b/g, 'ask')
    .replace(/\bsash\b/g, 'belt')
    .replace(/\btrespass offering\b/g, 'guilt offering')
    .replace(/\btrespass offerings\b/g, 'guilt offerings')
    .replace(/\bbattle in array\b/g, 'battle lines')
    .replace(/\bset the battle in array\b/g, 'lined up for battle')
    .replace(/\bput the battle in array\b/g, 'lined up for battle')
    .replace(/\bplace of the wagons\b/g, 'camp area')
    .replace(/\bnaughtiness of your heart\b/g, 'bad intent in your heart')
    .replace(/\brehearsed them before\b/g, 'reported them to')
    .replace(/\bInquire\b/g, 'Ask')
    .replace(/\binquire\b/g, 'ask')
    .replace(/\bmorsel\b/g, 'piece')
    .replace(/\bconstrained\b/g, 'urged')
    .replace(/\blest\b/g, 'or else')
    .replace(/\bin the sight of the Lord\b/g, "in the Lord's sight")
    .replace(/\bIt happened when\b/g, 'When')
    .replace(/\bIt happened that\b/g, 'Then')
    .replace(/\bit happened that\b/g, 'then')
    .replace(/\bthat which\b/g, 'what')
    .replace(/\bwhich\b/g, 'that')
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')

  if (ageRange === '5-7') {
    text = text
      .replace(/\bthe Lord of Armies\b/g, 'the Lord of Armies')
      .replace(/\bpriestly vest\b/g, 'special priestly vest')
      .replace(/\bkingdom\b/g, 'kingdom')
      .replace(/\bset apart for the Lord's judgment\b/g, 'set apart for the Lord to judge')
      .replace(/\bcompletely destroy under the Lord's judgment\b/g, 'completely destroy as the Lord judged')
      .replace(/\boutside God's covenant sign\b/g, 'outside God\'s covenant people')
  }

  return text
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
    .replace(/\bmust be with\b/g, 'will be with')
    .replace(/\bmust give\b/g, 'will give')
    .replace(/\bmust deliver\b/g, 'will deliver')
    .replace(/\bmust rule\b/g, 'will rule')
    .replace(/\bthe Lord chosen and marked with oil you king\b/g, 'the Lord anointed you as king')
    .replace(/\bthe Lord chosen and marked with oil you\b/g, 'the Lord anointed you')
    .replace(/\bchosen and marked with oil him\b/g, 'anointed him')
    .replace(/\bchosen and marked with oil you\b/g, 'anointed you')
    .replace(/\bhis chosen and marked with oil\b/g, 'his anointed king')
    .replace(/\bbefore his chosen and marked with oil\b/g, 'before his anointed king')
    .replace(/\bSaul bring him over\b/g, 'Saul put him over')
    .replace(/\btook Dagon and bring him in his place again\b/g, 'took Dagon and put him back in his place')
    .replace(/\bspecial special priestly vest\b/g, 'special priestly vest')
    .replace(/\ban special priestly vest\b/g, 'a special priestly vest')
    .replace(/\ban priestly vest\b/g, 'a priestly vest')
    .replace(/\bsweet-smelling sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\bset the battle lines\b/g, 'lined up for battle')
    .replace(/\bput the battle lines\b/g, 'lined up for battle')
    .replace(/\bto set your battle lines\b/g, 'to line up for battle')
    .replace(/\bcreditd\b/g, 'credited')
    .replace(/\bman who gave birth to his armor\b/g, 'young man who carried his armor')
    .replace(/\byoung man who gave birth to his armor\b/g, 'young man who carried his armor')
    .replace(/\bman who gave birth to the shield\b/g, 'shield-bearer')
    .replace(/\bman who bore the shield\b/g, 'shield-bearer')
    .replace(/\ban dry measure\b/g, 'a dry measure')
    .replace(/\ba dry measure of this parched grain\b/g, 'a basket measure of this roasted grain')
    .replace(/\belderly old man\b/g, 'old man')
    .replace(/\bdismayed, and greatly afraid\b/g, 'shaken and very afraid')
    .replace(/\bwas dismayed\b/g, 'was shaken')
    .replace(/\bcovert of the mountain, that look\b/g, 'hidden part of the mountain, and look')
    .replace(/\bblood guiltiness\b/g, 'bloodguilt')
    .replace(/\bbloodguilt\b/g, 'guilt for shedding blood')
    .replace(/\bavenging myself\b/g, 'taking revenge')
    .replace(/\bavenged himself\b/g, 'taken revenge')
    .replace(/\bavenged of\b/g, 'avenged against')
    .replace(/\btrespass of your servant\b/g, 'wrong of your servant')
    .replace(/\bdefrauded\b/g, 'cheated')
    .replace(/\boppressed\b/g, 'treated harshly')
    .replace(/\bbribe\b/g, 'secret payment')
    .replace(/\bworthless fellow\b/g, 'foolish and evil man')
    .replace(/\bworthless fellows\b/g, 'foolish and evil men')
    .replace(/\breproach\b/g, 'shame')
    .replace(/\bclad him with\b/g, 'covered him with')
    .replace(/\bdisdained him\b/g, 'looked down on him')
    .replace(/\bruddy\b/g, 'healthy-looking')
    .replace(/\bslaughter\b/g, 'defeat')
    .replace(/\bprevailed over\b/g, 'won against')
    .replace(/\bprudent in speech\b/g, 'wise in speech')
    .replace(/\bbrave man of valor\b/g, 'brave man')
    .replace(/\badjured the people\b/g, 'put the people under an oath')
    .replace(/\binquired of the Lord\b/g, 'asked the Lord')
    .replace(/\binquired of God\b/g, 'asked God')
    .replace(/\bUrim\b/g, 'the priestly lots called Urim')
    .replace(/\bperceived\b/g, 'understood')
    .replace(/\bexecute his fierce wrath on Amalek\b/g, 'carry out his fierce judgment on Amalek')
    .replace(/\bSaul lay within\b/g, 'Saul was lying inside')
    .replace(/\bSaul lay sleeping within\b/g, 'Saul was sleeping inside')
    .replace(/\bhis share is who goes down to the battle\b/g, 'the share of the one who goes down to the battle')
    .replace(/\bhis share be who stays with the baggage\b/g, 'the share of the one who stays with the supplies')
    .replace(/\bsure house\b/g, 'lasting house')
    .replace(/\bseek your soul\b/g, 'seek your life')
    .replace(/\bthe soul of my lord will be bound in the bundle of life with the Lord your God\b/g, 'my lord\'s life will be kept safe with the Lord your God')
    .replace(/\bHe will sling out the souls of your enemies, as from the hollow of a sling\b/g, 'He will throw away your enemies like a stone from a sling')
    .replace(/\bthis must be no grief to you, nor offense of heart to my lord\b/g, 'this will not bring grief or a troubled heart to my lord')
    .replace(/\bBlessed is your discretion\b/g, 'Blessed is your wise judgment')
    .replace(/\bNabal's heart was merry within him\b/g, 'Nabal\'s heart was cheerful')
    .replace(/\bwhen the wine had gone out of Nabal\b/g, 'when Nabal was sober again')
    .replace(/\bhe became as a stone\b/g, 'he became like a stone')
    .replace(/\bthe Lord is witness\b/g, 'The Lord is witness')
    .replace(/\bthe Lord will judge\b/g, 'The Lord will judge')
    .replace(/\bthe Lord visited Hannah\b/g, 'The Lord cared for Hannah')
    .replace(/\bthe Lord who delivered\b/g, 'The Lord who delivered')
    .replace(/\bthe Lord has done\b/g, 'The Lord has done')
    .replace(/\bthe Lord has torn\b/g, 'The Lord has torn')
    .replace(/\bthe Lord will deliver\b/g, 'The Lord will deliver')
    .replace(/\bToday, The Lord\b/g, 'Today, the Lord')
    .replace(/\bwhen The Lord\b/g, 'when the Lord')
    .replace(/\bbecause The Lord\b/g, 'because the Lord')
    .replace(/\. the Lord/g, '. The Lord')
    .replace(/\? the Lord/g, '? The Lord')
    .replace(/"the Lord/g, '"The Lord')
    .replace(/"Go! the Lord/g, '"Go! The Lord')
    .replace(/\brehearsed them where the Lord heard them\b/g, 'repeated them where the Lord heard')
    .replace(/\bthe Lord the Lord\b/g, 'the Lord')
    .replace(/\bLord God of Armies\b/g, 'Lord of Armies')
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
