#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const { polishKidReadableText } = require('./lib/kids-bible-style')

const BOOK = 'Ruth'
const BOOK_SLUG = 'ruth'
const SOURCE_BASE = 'https://www.canonapi.com/v1/ruth'
const EXPECTED_VERSE_COUNTS = [22, 23, 18, 22]

const STORY_REVISIONS = {
  'Ruth 1:1': {
    all: 'In the days when the judges led Israel, a famine came over the land. A man from Bethlehem in Judah went to live for a while in the country of Moab with his wife and his two sons.',
  },
  'Ruth 1:2': {
    all: 'The man was named Elimelech. His wife was named Naomi, and his two sons were named Mahlon and Chilion. They were Ephrathites from Bethlehem in Judah. They came to the country of Moab and stayed there.',
  },
  'Ruth 1:3': {
    all: 'Then Elimelech, Naomi\'s husband, died. Naomi was left with her two sons.',
  },
  'Ruth 1:4': {
    all: 'Her sons married women from Moab. One wife was named Orpah, and the other was named Ruth. They lived there about ten years.',
  },
  'Ruth 1:5': {
    all: 'Then both Mahlon and Chilion died too. Naomi was left without her husband and without her two sons.',
  },
  'Ruth 1:6': {
    all: 'Naomi heard in Moab that the Lord had cared for his people and given them food again. So she got ready to leave Moab with her daughters-in-law and return home.',
  },
  'Ruth 1:7': {
    all: 'Naomi left the place where she had been living, and her two daughters-in-law went with her. They started down the road back to the land of Judah.',
  },
  'Ruth 1:8': {
    all: 'Naomi said to her two daughters-in-law, "Go back, each of you, to your mother\'s house. May the Lord show kindness to you, as you showed kindness to the men who died and to me.',
  },
  'Ruth 1:9': {
    all: 'May the Lord give each of you rest and a home with a husband." Then Naomi kissed them, and they lifted their voices and cried.',
  },
  'Ruth 1:10': {
    all: 'They said to Naomi, "No, we will return with you to your people."',
  },
  'Ruth 1:11': {
    all: 'But Naomi said, "Turn back, my daughters. Why would you go with me? Do I have more sons who could grow up and become husbands for you?',
  },
  'Ruth 1:12': {
    all: 'Turn back, my daughters, and go your way. I am too old to have another husband. Even if I said, \'I still have hope,\' and even if I married tonight and later had sons,',
  },
  'Ruth 1:13': {
    all: 'would you wait until they grew up? Would you keep yourselves from marrying? No, my daughters. My life is very bitter for your sake, because the Lord\'s hand has gone out against me."',
  },
  'Ruth 1:14': {
    all: 'Then they lifted their voices and cried again. Orpah kissed her mother-in-law goodbye, but Ruth clung tightly to Naomi.',
  },
  'Ruth 1:15': {
    all: 'Naomi said, "Look, your sister-in-law has gone back to her people and to her gods. Go back after your sister-in-law."',
  },
  'Ruth 1:16': {
    all: 'But Ruth said, "Do not urge me to leave you or turn back from following you. Where you go, I will go. Where you stay, I will stay. Your people will be my people, and your God will be my God.',
  },
  'Ruth 1:17': {
    all: 'Where you die, I will die, and there I will be buried. May the Lord deal with me, even very strongly, if anything but death separates you and me."',
  },
  'Ruth 1:18': {
    all: 'When Naomi saw that Ruth was determined to go with her, she stopped trying to persuade her.',
  },
  'Ruth 1:19': {
    all: 'So the two women walked on until they came to Bethlehem. When they arrived, the whole town was stirred up because of them. The women asked, "Is this Naomi?"',
  },
  'Ruth 1:20': {
    all: 'Naomi said to them, "Do not call me Naomi. Naomi means pleasant. Call me Mara. Mara means bitter, because the Almighty has made my life very bitter.',
  },
  'Ruth 1:21': {
    all: 'I went away full, but the Lord has brought me home empty. Why call me Naomi, since the Lord has testified against me and the Almighty has brought trouble on me?"',
  },
  'Ruth 1:22': {
    all: 'So Naomi returned from the country of Moab with Ruth the Moabite, her daughter-in-law. They came to Bethlehem at the beginning of the barley harvest.',
  },

  'Ruth 2:1': {
    all: 'Naomi had a relative from her husband\'s family. He was a strong and respected man from the family of Elimelech, and his name was Boaz.',
  },
  'Ruth 2:2': {
    all: 'Ruth the Moabite said to Naomi, "Please let me go to the field and pick up leftover grain behind someone who shows me kindness." Naomi said to her, "Go, my daughter."',
  },
  'Ruth 2:3': {
    all: 'So Ruth went out, entered a field, and gathered leftover grain behind the harvest workers. As it happened, she came to the part of the field that belonged to Boaz, who was from Elimelech\'s family.',
  },
  'Ruth 2:4': {
    all: 'Just then Boaz came from Bethlehem. He said to the harvest workers, "The Lord be with you." They answered him, "May the Lord bless you."',
  },
  'Ruth 2:5': {
    all: 'Boaz asked the servant in charge of the harvest workers, "Which family does this young woman belong to?"',
  },
  'Ruth 2:6': {
    all: 'The servant in charge answered, "She is the young Moabite woman who came back with Naomi from the country of Moab.',
  },
  'Ruth 2:7': {
    all: 'She said, \'Please let me gather and pick up grain among the bundles after the harvest workers.\' She came and has worked from morning until now, except for a short rest in the shelter."',
  },
  'Ruth 2:8': {
    all: 'Then Boaz said to Ruth, "Listen, my daughter. Do not go gather grain in another field, and do not leave this one. Stay close to my young women.',
  },
  'Ruth 2:9': {
    all: 'Keep your eyes on the field where they harvest, and follow after them. I have commanded the young men not to bother or harm you. When you are thirsty, go to the water jars and drink from what the young men have drawn."',
  },
  'Ruth 2:10': {
    all: 'Ruth bowed down with her face to the ground and said to him, "Why are you being so kind to me and noticing me, even though I am a foreign woman?"',
  },
  'Ruth 2:11': {
    all: 'Boaz answered her, "I have been told everything you have done for your mother-in-law since your husband died. You left your father, your mother, and the land where you were born, and you came to a people you did not know before.',
  },
  'Ruth 2:12': {
    all: 'May the Lord repay your work. May your reward be full from the Lord, the God of Israel. You have come to him for refuge, like a bird sheltering under safe wings."',
  },
  'Ruth 2:13': {
    all: 'Ruth said, "May you keep being kind to me, my lord, because you have comforted me and spoken kindly to your servant, even though I am not one of your servants."',
  },
  'Ruth 2:14': {
    all: 'At mealtime Boaz said to her, "Come here. Eat some bread and dip your piece in the vinegar." So Ruth sat beside the harvest workers. Boaz passed roasted grain to her, and she ate until she was full and had some left over.',
  },
  'Ruth 2:15': {
    all: 'When Ruth got up to gather grain, Boaz commanded his young men, "Let her gather even among the bundles, and do not shame her.',
  },
  'Ruth 2:16': {
    all: 'Also pull out some handfuls from the bundles and leave them for her to pick up. Do not scold her."',
  },
  'Ruth 2:17': {
    all: 'So Ruth gathered grain in the field until evening. Then she shook and beat the grain loose from what she had gathered, and it was about a large basket of barley.',
  },
  'Ruth 2:18': {
    all: 'Ruth picked it up and went into the city. Naomi saw how much Ruth had gathered. Ruth also brought out the food she had left from lunch after she was full and gave it to Naomi.',
  },
  'Ruth 2:19': {
    all: 'Naomi asked Ruth, "Where did you gather grain today? Where did you work? Blessed be the man who noticed you." Ruth told her mother-in-law, "The man I worked with today is named Boaz."',
  },
  'Ruth 2:20': {
    all: 'Naomi said to her daughter-in-law, "May Boaz be blessed by the Lord, who has not stopped showing kindness to the living and to the dead." Naomi also said, "The man is a close relative of ours, one of our family redeemers."',
  },
  'Ruth 2:21': {
    all: 'Ruth the Moabite said, "He also told me, \'Stay close to my young men until they have finished all my harvest.\'"',
  },
  'Ruth 2:22': {
    all: 'Naomi said to Ruth her daughter-in-law, "It is good, my daughter, that you go out with his young women, so no one harms you in another field."',
  },
  'Ruth 2:23': {
    all: 'So Ruth stayed close to the young women of Boaz and gathered grain until the barley harvest and the wheat harvest were finished. And she lived with her mother-in-law.',
  },

  'Ruth 3:1': {
    all: 'Naomi, Ruth\'s mother-in-law, said to her, "My daughter, I should look for a safe home and rest for you, so life may go well for you.',
  },
  'Ruth 3:2': {
    all: 'Boaz is our relative, the man whose young women you were with. Listen, tonight he will be at the threshing floor, the flat place where workers separate barley grain from its dry chaff.',
  },
  'Ruth 3:3': {
    all: 'Wash, put on perfume, and dress yourself. Then go down to the threshing floor, but do not let Boaz know you are there until he has finished eating and drinking.',
  },
  'Ruth 3:4': {
    all: 'When he lies down, notice the place where he lies. Then go in, lift the covering at his feet, and lie down there. He will tell you what to do."',
  },
  'Ruth 3:5': {
    all: 'Ruth said to Naomi, "I will do everything you say."',
  },
  'Ruth 3:6': {
    all: 'So Ruth went down to the threshing floor and did everything her mother-in-law had told her to do.',
  },
  'Ruth 3:7': {
    all: 'After Boaz ate and drank, his heart was cheerful. He went to lie down at the far end of the grain pile. Then Ruth came quietly, lifted the covering at his feet, and lay down.',
  },
  'Ruth 3:8': {
    all: 'At midnight, Boaz was startled. He turned, and there was a woman lying at his feet.',
  },
  'Ruth 3:9': {
    all: 'Boaz asked, "Who are you?" Ruth answered, "I am Ruth, your servant. Spread your wing over your servant. Please protect me and take me as your wife, because you are a family redeemer."',
  },
  'Ruth 3:10': {
    all: 'Boaz said, "May you be blessed by the Lord, my daughter. You have shown even more kindness now than before, because you have not gone after young men, whether poor or rich.',
  },
  'Ruth 3:11': {
    all: 'Now, my daughter, do not be afraid. I will do for you all that you ask, because everyone in the gate of my people knows that you are a worthy woman.',
  },
  'Ruth 3:12': {
    all: 'It is true that I am a family redeemer. Yet there is another redeemer closer than I am.',
  },
  'Ruth 3:13': {
    all: 'Stay here tonight. In the morning, if he will act as family redeemer for you, good, let him do it. But if he does not want to redeem you, then as the Lord lives, I will redeem you. Lie down until morning."',
  },
  'Ruth 3:14': {
    all: 'So Ruth lay at his feet until morning, but she got up before people could recognize one another. Boaz said, "Do not let it be known that a woman came to the threshing floor."',
  },
  'Ruth 3:15': {
    all: 'Boaz also said, "Bring the shawl you are wearing and hold it out." So Ruth held it out, and Boaz measured six measures of barley into it and placed it on her. Then he went into the city.',
  },
  'Ruth 3:16': {
    all: 'When Ruth came to her mother-in-law, Naomi asked, "How did it go, my daughter?" Ruth told Naomi everything the man had done for her.',
  },
  'Ruth 3:17': {
    all: 'Ruth said, "He gave me these six measures of barley, because he said, \'Do not go back to your mother-in-law empty-handed.\'"',
  },
  'Ruth 3:18': {
    all: 'Naomi said, "Wait, my daughter, until you know how the matter will turn out. The man will not rest until he has settled it today."',
  },

  'Ruth 4:1': {
    all: 'Boaz went up to the city gate and sat down there. The family redeemer Boaz had spoken about came by. Boaz said, "Come over here, friend, and sit down." So the man came over and sat down.',
  },
  'Ruth 4:2': {
    all: 'Boaz took ten men from the elders, the leaders of the city, and said, "Sit down here." So they sat down.',
  },
  'Ruth 4:3': {
    all: 'Then Boaz said to the family redeemer, "Naomi, who came back from the country of Moab, is selling the piece of land that belonged to our relative Elimelech.',
  },
  'Ruth 4:4': {
    all: 'I thought I should tell you about it and say, \'Buy it in front of those sitting here and in front of the elders of my people.\' If you will buy it back as a family redeemer, do it. But if you will not, tell me, so I may know. There is no one before you, and I come after you." The man said, "I will buy it back."',
  },
  'Ruth 4:5': {
    all: 'Then Boaz said, "On the day you buy the field from Naomi, you must also take Ruth the Moabite, the wife of the man who died, to keep the dead man\'s family land and name going."',
  },
  'Ruth 4:6': {
    all: 'The family redeemer said, "I cannot buy it back for myself, or I might harm my own family land and name. You use my right to buy it back, because I cannot do it."',
  },
  'Ruth 4:7': {
    all: 'In earlier days in Israel, this was the custom for buying back family land and making a trade final: a man took off his sandal and gave it to the other person. This showed everyone that the matter was settled in Israel.',
  },
  'Ruth 4:8': {
    all: 'So the redeemer said to Boaz, "Buy it for yourself." Then he took off his sandal.',
  },
  'Ruth 4:9': {
    all: 'Boaz said to the elders and all the people, "You are witnesses today that I have bought from Naomi everything that belonged to Elimelech and everything that belonged to Chilion and Mahlon.',
  },
  'Ruth 4:10': {
    all: 'I have also taken Ruth the Moabite, Mahlon\'s wife, to be my wife, to keep the dead man\'s family land and name going. In this way, his name will not disappear from among his brothers or from the gate of his place. You are witnesses today."',
  },
  'Ruth 4:11': {
    all: 'All the people at the gate and the elders said, "We are witnesses. May the Lord make the woman coming into your house like Rachel and Leah, the two women who built the house of Israel. May you act with honor in Ephrathah and be famous in Bethlehem.',
  },
  'Ruth 4:12': {
    all: 'May your house be like the house of Perez, whom Tamar bore to Judah, because of the offspring the Lord will give you by this young woman."',
  },
  'Ruth 4:13': {
    all: 'So Boaz took Ruth, and she became his wife. The Lord gave Ruth the gift of becoming pregnant, and she gave birth to a son.',
  },
  'Ruth 4:14': {
    all: 'The women said to Naomi, "Blessed be the Lord, who has not left you today without a family redeemer. May his name be famous in Israel.',
  },
  'Ruth 4:15': {
    all: 'This child will help restore your life and care for you in your old age, because your daughter-in-law, who loves you and is better to you than seven sons, has given birth to him."',
  },
  'Ruth 4:16': {
    all: 'Naomi took the child, held him close to her chest, and cared for him.',
  },
  'Ruth 4:17': {
    all: 'The neighbor women gave him a name, saying, "A son has been born to Naomi." They named him Obed. He became the father of Jesse, the father of David.',
  },
  'Ruth 4:18': {
    all: 'Now these are the generations of Perez: Perez became the father of Hezron,',
  },
  'Ruth 4:19': {
    all: 'Hezron became the father of Ram, Ram became the father of Amminadab,',
  },
  'Ruth 4:20': {
    all: 'Amminadab became the father of Nahshon, Nahshon became the father of Salmon,',
  },
  'Ruth 4:21': {
    all: 'Salmon became the father of Boaz, Boaz became the father of Obed,',
  },
  'Ruth 4:22': {
    all: 'Obed became the father of Jesse, and Jesse became the father of David.',
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

  text = text
    .replace(/\bYahweh\b/g, 'the Lord')
    .replace(/\bwhich\b/g, 'that')
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')
    .replace(/\bglean\b/g, 'gather leftover grain')
    .replace(/\bgleaned\b/g, 'gathered leftover grain')
    .replace(/\bgleaning\b/g, 'gathering leftover grain')
    .replace(/\bkinsman redeemer\b/g, 'family redeemer')
    .replace(/\bkinsman-redeemer\b/g, 'family redeemer')
    .replace(/\bnear kinsman\b/g, 'close relative')
    .replace(/\bservant\b/g, 'servant')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bhandmaid\b/g, 'female servant')
    .replace(/\bhandmaids\b/g, 'female servants')
    .replace(/\bdamsel\b/g, 'young woman')
    .replace(/\bdamsels\b/g, 'young women')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look')
    .replace(/\bsojourn\b/g, 'live for a while')
    .replace(/\bsojourned\b/g, 'lived for a while')
    .replace(/\bsojourner\b/g, 'foreigner living among them')
    .replace(/\bbarley sheaves\b/g, 'bundles of barley')
    .replace(/\bsheaves\b/g, 'bundles')
    .replace(/\bsheaf\b/g, 'bundle')
    .replace(/\breapers\b/g, 'harvest workers')
    .replace(/\breaper\b/g, 'harvest worker')
    .replace(/\bthreshing floor\b/g, 'threshing floor')
    .replace(/\bthreshed\b/g, 'separated grain from chaff')
    .replace(/\bthresh\b/g, 'separate grain from chaff')
    .replace(/\bmeasure of barley\b/g, 'measure of barley')
    .replace(/\bmeasures of barley\b/g, 'measures of barley')
    .replace(/\bMara\b/g, 'Mara')
    .replace(/\bMoabitess\b/g, 'Moabite woman')
    .replace(/\bMoabite woman woman\b/g, 'Moabite woman')
    .replace(/\bthe Almighty\b/g, 'the Almighty')

  if (ageRange === '5-7') {
    text = text
      .replace(/\bredeemer\b/g, 'family redeemer')
      .replace(/\bfamily family redeemer\b/g, 'family redeemer')
      .replace(/\binheritance\b/g, 'family land and name')
      .replace(/\bservant\b/g, 'servant')
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
    .replace(/\bmust be full\b/g, 'will be full')
    .replace(/\bmust go\b/g, 'will go')
    .replace(/\bmust stay\b/g, 'will stay')
    .replace(/\bmust be my people\b/g, 'will be my people')
    .replace(/\bmust be my God\b/g, 'will be my God')
    .replace(/\bmust I not\b/g, 'should I not')
    .replace(/\bfamily family redeemer\b/g, 'family redeemer')
    .replace(/\bfamily redeemer family redeemer\b/g, 'family redeemer')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\ban ([bcdfghjklmnpqrstvwxyz])/gi, 'a $1')
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
