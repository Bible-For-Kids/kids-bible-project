#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const { polishKidReadableText } = require('./lib/kids-bible-style')

const BOOK = '2 Samuel'
const BOOK_SLUG = '2-samuel'
const SOURCE_BASE = 'https://www.canonapi.com/v1/2samuel'
const EXPECTED_VERSE_COUNTS = [
  27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31,
  39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25,
]

const STORY_REVISIONS = {
  '2 Samuel 1:1': {
    all: 'After Saul died, David returned from fighting the Amalekites and stayed two days in Ziklag.',
  },
  '2 Samuel 1:17': {
    all: 'David sang a sad song over Saul and Jonathan his son.',
  },
  '2 Samuel 1:21': {
    all: 'You mountains of Gilboa, may no dew or rain fall on you, and may no fields there produce offerings. There the shield of the brave was defiled, the shield of Saul, no longer rubbed with oil.',
  },
  '2 Samuel 1:26': {
    all: 'I am full of sorrow for you, my brother Jonathan. You were very dear to me. Your love for me was wonderful, more wonderful than the love of women.',
  },
  '2 Samuel 2:4': {
    all: 'The men of Judah came and anointed David there as king over the house of Judah. They told David, "The men of Jabesh Gilead buried Saul."',
  },
  '2 Samuel 3:34': {
    all: 'Your hands were not tied, and your feet were not locked in chains. You fell the way someone falls before evil men." Then all the people wept over Abner again.',
  },
  '2 Samuel 5:3': {
    all: 'All the elders of Israel came to King David at Hebron, and King David made a covenant with them before the Lord. Then they anointed David king over Israel.',
  },
  '2 Samuel 5:12': {
    all: 'David knew that the Lord had established him as king over Israel and had lifted up his kingdom for the sake of the Lord\'s people Israel.',
  },
  '2 Samuel 6:14': {
    all: 'David danced before the Lord with all his strength, and David was wearing a linen priestly vest.',
  },
  '2 Samuel 6:13': {
    all: 'When the men carrying the Lord\'s ark had taken six steps, David offered an ox and a fattened calf.',
  },
  '2 Samuel 6:20': {
    all: 'Then David returned to bless his household. Michal, Saul\'s daughter, came out to meet him and said, "How the king of Israel honored himself today! He looked undignified in front of the servant girls, like a foolish man who is not ashamed."',
  },
  '2 Samuel 7:12': {
    all: 'When your days are finished and you lie down with your fathers, I will raise up your offspring after you, one who will come from your own body, and I will establish his kingdom.',
  },
  '2 Samuel 7:13': {
    all: 'He will build a house for my name, and I will establish the throne of his kingdom forever.',
  },
  '2 Samuel 7:16': {
    all: 'Your house and your kingdom will be made sure forever before you. Your throne will be established forever."',
  },
  '2 Samuel 7:10': {
    all: 'I will appoint a place for my people Israel and plant them there, so they may live in their own place and not be troubled anymore. Evil people will not hurt them as they did at first,',
  },
  '2 Samuel 9:7': {
    all: 'David said to him, "Do not be afraid, because I will surely show you kindness for Jonathan your father\'s sake. I will give back to you all the land of Saul your father, and you will always eat at my table."',
  },
  '2 Samuel 10:4': {
    all: 'So Hanun took David\'s servants, shaved off half of each man\'s beard, cut their clothes short to shame them, and sent them away.',
  },
  '2 Samuel 10:6': {
    all: 'The Ammonites saw that David now hated what they had done. So they hired Aramean soldiers from Beth Rehob and Zobah, twenty thousand foot soldiers, the king of Maacah with one thousand men, and twelve thousand men from Tob.',
  },
  '2 Samuel 10:8': {
    all: 'The Ammonites marched out and lined up for battle at the entrance of the city gate. The Arameans from Zobah and Rehob, along with the men of Tob and Maacah, stood by themselves in the open field.',
  },
  '2 Samuel 10:9': {
    all: 'Joab saw that enemy lines were in front of him and behind him. He chose some of Israel\'s best soldiers and lined them up against the Arameans.',
  },
  '2 Samuel 10:10': {
    all: 'He put the rest of the men under the command of his brother Abishai, and Abishai lined them up against the Ammonites.',
  },
  '2 Samuel 10:13': {
    all: 'Then Joab and the men with him moved forward to fight the Arameans, and the Arameans ran away from him.',
  },
  '2 Samuel 10:14': {
    all: 'When the Ammonites saw that the Arameans had run away, they also ran away from Abishai and went back into the city. Then Joab left the Ammonites and returned to Jerusalem.',
  },
  '2 Samuel 10:17': {
    all: 'When David was told, he gathered all Israel, crossed the Jordan, and came to Helam. The Arameans lined up for battle against David and fought him.',
  },
  '2 Samuel 10:18': {
    all: 'The Arameans ran away from Israel. David defeated seven hundred chariot teams and forty thousand horsemen of the Arameans, and Shobach, the commander of their army, died there.',
  },
  '2 Samuel 10:19': {
    all: 'All the kings who served Hadadezer saw that Israel had defeated them. They made peace with Israel and served them. After that, the Arameans were afraid to help the Ammonites again.',
  },
  '2 Samuel 11:2': {
    all: 'One evening David got up from his bed and walked on the roof of the king\'s house. From the roof he saw a woman bathing. The woman was very beautiful.',
  },
  '2 Samuel 11:3': {
    all: 'David sent and asked about the woman. Someone said, "Is this not Bathsheba, daughter of Eliam and wife of Uriah the Hittite?"',
  },
  '2 Samuel 11:4': {
    all: 'David sent messengers and took her. She came to him, and David sinned with her as if she were his wife. Then she returned to her house.',
  },
  '2 Samuel 11:5': {
    all: 'The woman became pregnant, and she sent and told David, "I am pregnant."',
  },
  '2 Samuel 11:15': {
    all: 'In the letter David wrote, "Put Uriah at the front where the battle is fiercest. Then pull back from him, so he may be struck down and die."',
  },
  '2 Samuel 11:27': {
    all: 'When the time of mourning was over, David sent and brought Bathsheba to his house. She became his wife and gave birth to a son. But the thing David had done was evil in the Lord\'s sight.',
  },
  '2 Samuel 12:7': {
    all: 'Nathan said to David, "You are the man! The Lord, the God of Israel, says, \'I anointed you king over Israel, and I rescued you from the hand of Saul.',
  },
  '2 Samuel 12:13': {
    all: 'David said to Nathan, "I have sinned against the Lord." Nathan said to David, "The Lord also has put away your sin. You will not die.',
  },
  '2 Samuel 12:15': {
    all: 'Then Nathan went home. The Lord struck the child born to David and Uriah\'s wife, and the child became very sick.',
  },
  '2 Samuel 12:24': {
    all: 'David comforted Bathsheba his wife. Later she gave birth to a son, and David named him Solomon. The Lord loved him.',
  },
  '2 Samuel 12:31': {
    all: 'David brought out the people who were in the city and put them to hard forced work with saws, iron picks, iron axes, and brick ovens. He did the same to all the Ammonite cities. Then David and all the people returned to Jerusalem.',
  },
  '2 Samuel 13:11': {
    all: 'When Tamar brought the food near so Amnon could eat, he grabbed her and said, "Come lie with me, my sister."',
  },
  '2 Samuel 13:12': {
    all: 'Tamar said, "No, my brother. Do not force me. Such a thing must not be done in Israel. Do not do this disgraceful thing.',
  },
  '2 Samuel 13:14': {
    all: 'But Amnon would not listen to Tamar. He was stronger than she was, and he forced her and sinned against her.',
  },
  '2 Samuel 13:15': {
    all: 'Then Amnon hated Tamar with a very great hatred. The hatred he felt for her was greater than the love he had felt before. Amnon said to her, "Get up and go!"',
  },
  '2 Samuel 13:21': {
    all: 'When King David heard about all these things, he was very angry.',
  },
  '2 Samuel 14:14': {
    all: 'We must all die, like water spilled on the ground that cannot be gathered up again. But God does not take away life without mercy. He plans ways so that the person sent away from him may not stay away forever.',
  },
  '2 Samuel 15:6': {
    all: 'Absalom did this to everyone in Israel who came to the king for judgment. In this way, Absalom stole the hearts of the men of Israel.',
  },
  '2 Samuel 16:12': {
    all: 'Perhaps the Lord will look on the wrong done to me, and perhaps the Lord will repay me with good for the curse against me today."',
  },
  '2 Samuel 16:6': {
    all: 'Shimei threw stones at David and at all King David\'s servants, while the people and the brave men walked on David\'s right and left.',
  },
  '2 Samuel 16:11': {
    all: 'David said to Abishai and to all his servants, "My own son is trying to take my life. How much more may this man from Benjamin speak against me? Leave him alone, and let him curse, because the Lord has allowed him.',
  },
  '2 Samuel 16:21': {
    all: 'Ahithophel said to Absalom, "Take your father\'s secondary wives, whom he left to keep the house. Then all Israel will hear that your father hates you, and everyone with you will feel stronger."',
  },
  '2 Samuel 16:22': {
    all: 'So they spread a tent for Absalom on the roof, and Absalom took his father\'s secondary wives for himself in the sight of all Israel.',
  },
  '2 Samuel 17:14': {
    all: 'Absalom and all the men of Israel said, "Hushai the Archite has given better advice than Ahithophel." The Lord had decided to defeat Ahithophel\'s good advice, so the Lord would bring disaster on Absalom.',
  },
  '2 Samuel 17:9': {
    all: 'Even now, David may be hidden in a pit or some other place. If some of Absalom\'s men fall at the first attack, people will hear it and say, "Many of the people following Absalom have died!"',
  },
  '2 Samuel 18:7': {
    all: 'The men of Israel were defeated there by David\'s servants, and many men died that day, twenty thousand in all.',
  },
  '2 Samuel 18:1': {
    all: 'David counted the people who were with him and set commanders over groups of thousands and hundreds.',
  },
  '2 Samuel 18:2': {
    all: 'David sent the people out in three groups: one group under Joab, one under Joab\'s brother Abishai son of Zeruiah, and one under Ittai the Gittite. The king said to the people, "I will surely go out with you myself."',
  },
  '2 Samuel 18:3': {
    all: 'But the people said, "You must not go out. If we run away, they will not care about us. Even if half of us die, they will not care about us. But you are worth ten thousand of us. It is better for you to stay in the city and send us help."',
  },
  '2 Samuel 18:8': {
    all: 'The battle spread across the whole countryside. That day, the forest took more lives than the sword did.',
  },
  '2 Samuel 18:9': {
    all: 'Absalom met David\'s servants. Absalom was riding on his mule, and the mule went under the thick branches of a great oak. Absalom\'s head caught in the oak, and he was left hanging between heaven and earth while the mule under him went on.',
  },
  '2 Samuel 18:11': {
    all: 'Joab said to the man who told him, "You saw him there. Why did you not strike him to the ground? I would have given you ten silver pieces and a belt."',
  },
  '2 Samuel 18:14': {
    all: 'Joab said, "I will not wait like this with you." Then he took three spears in his hand and struck Absalom in the heart while Absalom was still alive in the oak.',
  },
  '2 Samuel 18:15': {
    all: 'Ten young men who carried Joab\'s armor surrounded Absalom, struck him, and killed him.',
  },
  '2 Samuel 18:17': {
    all: 'They took Absalom and threw him into a large pit in the forest. Then they piled a very large heap of stones over him. All Israel ran away, each person to his own tent.',
  },
  '2 Samuel 18:24': {
    all: 'David was sitting between the two gates. The watchman climbed up to the roof of the gate by the wall, looked out, and saw one man running alone.',
  },
  '2 Samuel 18:33': {
    all: 'The king was deeply shaken. He went up to the room over the gate and cried. As he went, he said, "My son Absalom! My son, my son Absalom! I wish I had died instead of you, Absalom, my son, my son!"',
  },
  '2 Samuel 20:1': {
    all: 'A worthless man named Sheba son of Bichri, from Benjamin, happened to be there. He blew the trumpet and shouted, "We have no share in David! We have no inheritance in the son of Jesse! Every man to his tents, Israel!"',
  },
  '2 Samuel 20:2': {
    all: 'So all the men of Israel left David and followed Sheba son of Bichri. But the men of Judah stayed close to their king, all the way from the Jordan to Jerusalem.',
  },
  '2 Samuel 20:3': {
    all: 'David came back to his house in Jerusalem. He took the ten secondary wives he had left to keep the house and placed them in a guarded house. He provided food for them, but he did not live with them as a husband again. They lived apart until the day they died, like widows.',
  },
  '2 Samuel 20:4': {
    all: 'Then the king said to Amasa, "Call the men of Judah together for me within three days, and you be here too."',
  },
  '2 Samuel 20:5': {
    all: 'Amasa went to gather the men of Judah, but he took longer than the time David had set for him.',
  },
  '2 Samuel 20:6': {
    all: 'David said to Abishai, "Sheba son of Bichri will do us more harm than Absalom did. Take your lord\'s servants and chase him, or he may find strong cities and escape from us."',
  },
  '2 Samuel 20:8': {
    all: 'When they reached the great stone in Gibeon, Amasa came to meet them. Joab was wearing his battle clothes, with a sword fastened in its sheath at his belt. As Joab stepped forward, the sword slipped out.',
  },
  '2 Samuel 20:10': {
    all: 'Amasa did not notice the sword in Joab\'s hand. Joab struck him in the body, and Amasa died. Then Joab and his brother Abishai chased Sheba son of Bichri.',
  },
  '2 Samuel 20:11': {
    all: 'One of Joab\'s young men stood beside Amasa and called out, "Whoever favors Joab, and whoever is for David, follow Joab!"',
  },
  '2 Samuel 20:12': {
    all: 'Amasa lay in the middle of the road. When one of Joab\'s men saw that everyone stopped beside him, he moved Amasa from the road into a field and covered him with a garment.',
  },
  '2 Samuel 20:13': {
    all: 'After Amasa was moved from the road, all the people went on after Joab to chase Sheba son of Bichri.',
  },
  '2 Samuel 20:14': {
    all: 'Sheba passed through all the tribes of Israel to Abel and Beth Maacah, and all the Berites gathered and followed him.',
  },
  '2 Samuel 20:15': {
    all: 'Joab\'s men came and surrounded Sheba in Abel Beth Maacah. They built a mound against the city wall, and all the men with Joab battered the wall to knock it down.',
  },
  '2 Samuel 20:16': {
    all: 'Then a wise woman cried out from the city, "Listen! Listen! Please tell Joab, \'Come near so I can speak with you.\'"',
  },
  '2 Samuel 20:17': {
    all: 'Joab came near to her, and the woman asked, "Are you Joab?" He answered, "I am." She said, "Listen to the words of your servant." He answered, "I am listening."',
  },
  '2 Samuel 20:18': {
    all: 'Then she said, "In old times people used to say, \'Ask counsel at Abel,\' and that settled the matter.',
  },
  '2 Samuel 20:19': {
    all: 'I am one of the peaceful and faithful people in Israel. You are trying to destroy a city that is like a mother in Israel. Why would you swallow up the Lord\'s inheritance?"',
  },
  '2 Samuel 20:20': {
    all: 'Joab answered, "Far be it from me, far be it, that I should swallow up or destroy.',
  },
  '2 Samuel 20:21': {
    all: 'That is not what I want. A man from the hill country of Ephraim, Sheba son of Bichri, has lifted his hand against King David. Hand him over, and I will leave the city." The woman said to Joab, "His head will be thrown to you over the wall."',
  },
  '2 Samuel 20:22': {
    all: 'Then the woman went to all the people with her wise plan. They put Sheba son of Bichri to death and threw his head out to Joab. Joab blew the trumpet, and everyone left the city and went home. Then Joab returned to the king in Jerusalem.',
  },
  '2 Samuel 20:23': {
    all: 'Joab was over all the army of Israel. Benaiah son of Jehoiada was over the Cherethites and Pelethites.',
  },
  '2 Samuel 20:24': {
    all: 'Adoram was over the men who had to do forced labor. Jehoshaphat son of Ahilud was the recorder.',
  },
  '2 Samuel 20:25': {
    all: 'Sheva was the scribe, and Zadok and Abiathar were priests.',
  },
  '2 Samuel 20:26': {
    all: 'Ira the Jairite was also David\'s chief minister.',
  },
  '2 Samuel 21:8': {
    all: 'The king took the two sons Rizpah daughter of Aiah had with Saul, Armoni and Mephibosheth, and the five sons of Michal daughter of Saul, whom she had with Adriel son of Barzillai the Meholathite.',
  },
  '2 Samuel 22:2': {
    all: 'David said, "The Lord is my rock, my fortress, and my deliverer,',
  },
  '2 Samuel 22:3': {
    all: 'my God, my rock, in whom I take refuge, my shield, the horn of my salvation, my high tower, my refuge, and my savior. You save me from violence.',
  },
  '2 Samuel 23:5': {
    all: 'Is not my house so with God? He has made an everlasting covenant with me, ordered in all things and sure. Will he not make all my salvation and desire grow?',
  },
  '2 Samuel 23:23': {
    all: 'Benaiah was honored more than the thirty, but he did not belong to the three. David appointed him over his guard.',
  },
  '2 Samuel 23:37': {
    all: 'Zelek the Ammonite, and Naharai the Beerothite, who carried armor for Joab son of Zeruiah,',
  },
  '2 Samuel 24:24': {
    all: 'The king said to Araunah, "No, I will surely buy it from you for a price. I will not offer burnt offerings to the Lord my God that cost me nothing." So David bought the threshing floor and the oxen for fifty silver pieces.',
  },
  '2 Samuel 24:25': {
    all: 'David built an altar to the Lord there and offered burnt offerings and peace offerings. The Lord listened to prayer for the land, and the plague was removed from Israel.',
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
    .replace(/\bchildren of Ammon\b/g, 'Ammonites')
    .replace(/\bchildren of Judah\b/g, 'people of Judah')
    .replace(/\bchildren of Benjamin\b/g, 'people of Benjamin')
    .replace(/\bchildren of evil\b/g, 'evil people')
    .replace(/\bchildren of sin\b/g, 'evil people')
    .replace(/\bchildren of men\b/g, 'people')
    .replace(/\bIsraelites\b/g, 'people of Israel')
    .replace(/\bIsraelite\b/g, 'person of Israel')
    .replace(/\blords of the Philistines\b/g, 'Philistine rulers')
    .replace(/\blord of the Philistines\b/g, 'Philistine ruler')
    .replace(/\bmaidservants\b/g, 'female servants')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bhandmaid\b/g, 'female servant')
    .replace(/\bhandmaids\b/g, 'female servants')
    .replace(/\bdamsel\b/g, 'young woman')
    .replace(/\bdamsels\b/g, 'young women')
    .replace(/\bvirgin\b/g, 'unmarried young woman')
    .replace(/\bvirgins\b/g, 'unmarried young women')
    .replace(/\bconcubines\b/g, 'secondary wives')
    .replace(/\bconcubine\b/g, 'secondary wife')
    .replace(/\blinen ephod\b/g, 'linen priestly vest')
    .replace(/\bephod\b/g, 'priestly vest')
    .replace(/\bteraphim\b/g, 'household idol')
    .replace(/\bother gods\b/g, 'false gods')
    .replace(/\biniquity\b/g, 'sin')
    .replace(/\biniquities\b/g, 'sins')
    .replace(/\btransgressed\b/g, 'sinned')
    .replace(/\btransgression\b/g, 'sin')
    .replace(/\bwickedness\b/g, 'evil')
    .replace(/\bwicked\b/g, 'evil')
    .replace(/\bwomb\b/g, 'body')
    .replace(/\bconceive\b/g, 'become pregnant')
    .replace(/\bconceived\b/g, 'became pregnant')
    .replace(/\bshe bore a son\b/g, 'she gave birth to a son')
    .replace(/\bBathsheba bore\b/g, 'Bathsheba gave birth to')
    .replace(/\bwhom she bore to\b/g, 'whom she had with')
    .replace(/\bwho bore the Lord's ark\b/g, "who carried the Lord's ark")
    .replace(/\bwho bore Joab's armor\b/g, "who carried Joab's armor")
    .replace(/\bbore Joab's armor\b/g, "carried Joab's armor")
    .replace(/\bburnt offerings\b/g, 'burnt offerings')
    .replace(/\bburnt offering\b/g, 'burnt offering')
    .replace(/\bgarrisons\b/g, 'military camps')
    .replace(/\bgarrison\b/g, 'military camp')
    .replace(/\bmen of war\b/g, 'soldiers')
    .replace(/\bman of war\b/g, 'soldier')
    .replace(/\bmighty men of valor\b/g, 'brave fighting men')
    .replace(/\bmighty man of valor\b/g, 'brave fighting man')
    .replace(/\bmighty men\b/g, 'brave men')
    .replace(/\bmighty man\b/g, 'brave man')
    .replace(/\bvaliant men\b/g, 'brave men')
    .replace(/\bfootmen\b/g, 'foot soldiers')
    .replace(/\bfootman\b/g, 'foot soldier')
    .replace(/\bcaptains of thousands\b/g, 'commanders over thousands')
    .replace(/\bcaptains of hundreds\b/g, 'commanders over hundreds')
    .replace(/\bcaptain of the army\b/g, 'army commander')
    .replace(/\bcaptains of the army\b/g, 'army commanders')
    .replace(/\bcaptains\b/g, 'commanders')
    .replace(/\bcaptain\b/g, 'commander')
    .replace(/\buncircumcised Philistine\b/g, 'Philistine outside God\'s covenant people')
    .replace(/\buncircumcised Philistines\b/g, 'Philistines outside God\'s covenant people')
    .replace(/\buncircumcised\b/g, 'outside God\'s covenant people')
    .replace(/\bforeskins of the Philistines\b/g, 'proofs that he had defeated the Philistine men')
    .replace(/\bforeskins\b/g, 'proofs from defeated enemies')
    .replace(/\bforeskin\b/g, 'covenant body sign')
    .replace(/\bthose who urinate against a wall\b/g, 'males')
    .replace(/\bone who urinates on a wall\b/g, 'one male')
    .replace(/\bone who urinates against a wall\b/g, 'one male')
    .replace(/\bwho urinates against a wall\b/g, 'male')
    .replace(/\brelieve himself\b/g, 'use the cave privately')
    .replace(/\bcover his feet\b/g, 'use the cave privately')
    .replace(/\bnaked\b/g, 'without his outer clothes')
    .replace(/\blay with her\b/g, 'sinned with her as if she were his wife')
    .replace(/\blay with\b/g, 'slept with')
    .replace(/\blie with\b/g, 'sleep with')
    .replace(/\bwent in to her\b/g, 'took her as his wife')
    .replace(/\bravished\b/g, 'forced and sinned against')
    .replace(/\bviolated\b/g, 'hurt and sinned against')
    .replace(/\bwhoredom\b/g, 'sexual sin')
    .replace(/\bwhore\b/g, 'woman in sexual sin')
    .replace(/\bharlot\b/g, 'woman in sexual sin')
    .replace(/\bthe Lord's anointed\b/g, "the Lord's anointed king")
    .replace(/\bprince\b/g, 'leader')
    .replace(/\bprinces\b/g, 'leaders')
    .replace(/\breign\b/g, 'rule')
    .replace(/\breigned\b/g, 'ruled')
    .replace(/\bdevoted to destruction\b/g, 'set apart for the Lord\'s judgment')
    .replace(/\butterly destroy\b/g, 'completely destroy under the Lord\'s judgment')
    .replace(/\butterly destroyed\b/g, 'completely destroyed under the Lord\'s judgment')
    .replace(/\bslain\b/g, 'killed')
    .replace(/\bslay\b/g, 'kill')
    .replace(/\bsmote\b/g, 'struck')
    .replace(/\bsmite\b/g, 'strike')
    .replace(/\bstruck with the edge of the sword\b/g, 'struck down with the sword')
    .replace(/\bstruck them with the edge of the sword\b/g, 'struck them down with the sword')
    .replace(/\bfell on his sword\b/g, 'fell on his own sword')
    .replace(/\barmor bearer\b/g, 'armor-bearer')
    .replace(/\barmourbearer\b/g, 'armor-bearer')
    .replace(/\bjavelin\b/g, 'short spear')
    .replace(/\bsashes\b/g, 'belts')
    .replace(/\bsash\b/g, 'belt')
    .replace(/\bapparel of war\b/g, 'battle clothes')
    .replace(/\bcubits\b/g, 'arm-lengths')
    .replace(/\bcubit\b/g, 'arm-length')
    .replace(/\bshekels\b/g, 'silver pieces')
    .replace(/\bshekel\b/g, 'silver piece')
    .replace(/\btalents\b/g, 'large weights')
    .replace(/\btalent\b/g, 'large weight')
    .replace(/\bephah\b/g, 'dry measure')
    .replace(/\bhin\b/g, 'liquid measure')
    .replace(/\bflask\b/g, 'small bottle')
    .replace(/\bvessels\b/g, 'containers')
    .replace(/\bvessel\b/g, 'container')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look')
    .replace(/\barose\b/g, 'got up')
    .replace(/\bArise!\b/g, 'Get up!')
    .replace(/\bArise\b/g, 'Get up')
    .replace(/\barise\b/g, 'get up')
    .replace(/\bfled\b/g, 'ran away')
    .replace(/\bflee\b/g, 'run away')
    .replace(/\bfleeing\b/g, 'running away')
    .replace(/\bdwelt\b/g, 'lived')
    .replace(/\bdwell\b/g, 'live')
    .replace(/\bencamped\b/g, 'camped')
    .replace(/\bencamp\b/g, 'camp')
    .replace(/\bsojourn\b/g, 'live for a while')
    .replace(/\bsojourned\b/g, 'lived for a while')
    .replace(/\blodged\b/g, 'stayed')
    .replace(/\blodge\b/g, 'stay')
    .replace(/\bfetched\b/g, 'brought')
    .replace(/\bodious to David\b/g, 'hated by David')
    .replace(/\bput the battle in array\b/g, 'lined up for battle')
    .replace(/\bput them in array\b/g, 'lined them up')
    .replace(/\bset themselves in array\b/g, 'lined up for battle')
    .replace(/\bset in array\b/g, 'lined up for battle')
    .replace(/\bin array against\b/g, 'in lines against')
    .replace(/\bbattle was set against him before and behind\b/g, 'enemy lines were in front of him and behind him')
    .replace(/\bcommitted into the hand of\b/g, 'put under the command of')
    .replace(/\btook no heed to\b/g, 'did not notice')
    .replace(/\bbowels\b/g, 'body')
    .replace(/\bsustenance\b/g, 'food')
    .replace(/\bwidowhood\b/g, 'life as widows')
    .replace(/\babhorred\b/g, 'hated')
    .replace(/\bcast an upper millstone\b/g, 'threw an upper millstone')
    .replace(/\bcast stones\b/g, 'threw stones')
    .replace(/\bcast a garment over\b/g, 'covered')
    .replace(/\bcast him into\b/g, 'threw him into')
    .replace(/\bcast up a mound\b/g, 'built a mound')
    .replace(/\bcast\b/g, 'threw')
    .replace(/\bentreated for the land\b/g, 'listened to prayer for the land')
    .replace(/\bwhither\b/g, 'where')
    .replace(/\bthither\b/g, 'there')
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
      .replace(/\bpriestly vest\b/g, 'special priestly vest')
      .replace(/\bset apart for the Lord's judgment\b/g, 'set apart for the Lord to judge')
      .replace(/\bcompletely destroy under the Lord's judgment\b/g, 'completely destroy as the Lord judged')
      .replace(/\bsecondary wives\b/g, 'other wives')
      .replace(/\bsecondary wife\b/g, 'other wife')
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
    .replace(/\bspecial special priestly vest\b/g, 'special priestly vest')
    .replace(/\ban special priestly vest\b/g, 'a special priestly vest')
    .replace(/\ban priestly vest\b/g, 'a priestly vest')
    .replace(/\bsweet-smelling sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\brun away away\b/g, 'run away')
    .replace(/\bthe Lord the Lord\b/g, 'the Lord')
    .replace(/\bLord God of Armies\b/g, 'Lord of Armies')
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
    .trim()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
