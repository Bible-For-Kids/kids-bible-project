#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { polishKidReadableText } = require('./lib/kids-bible-style')

const CONTENT_DIR = path.join(__dirname, '..', 'content')
const BOOK = '2-kings'
const BOOK_NAME = '2 Kings'
const TESTAMENT = 'old-testament'
const AGE_RANGES = ['5-7', '8-10']
const CHAPTERS = Array.from({ length: 25 }, (_, index) => index + 1)

const BOOK_OVERVIEW =
  '2 Kings continues the story of Israel and Judah, showing Elisha\'s ministry, the fall of Israel, Hezekiah and Josiah\'s reforms, and Jerusalem\'s exile after the people would not listen to the Lord.'

const RESOURCE_DATA = {
  1: {
    summary: 'Ahaziah seeks help from Baal Zebub instead of the Lord. Elijah announces the Lord\'s judgment, and Ahaziah dies according to the Lord\'s word.',
    lessons: [
      ['The Lord alone should be sought', 'Ahaziah turns to a false god, but the Lord sends the true word through Elijah.'],
      ['God\'s word comes to pass', 'What the Lord speaks through Elijah happens.'],
    ],
  },
  2: {
    summary: 'The Lord takes Elijah up by a whirlwind, and Elisha receives Elijah\'s cloak and prophetic work. The Lord confirms Elisha\'s ministry through signs of judgment and mercy.',
    lessons: [
      ['God continues his work', 'Elijah is taken up, but the Lord continues speaking through Elisha.'],
      ['The Lord gives power for his calling', 'Elisha crosses the Jordan as Elijah had done.'],
    ],
  },
  3: {
    summary: 'Israel, Judah, and Edom march against Moab and run out of water. The Lord provides water through Elisha\'s word and gives victory, but Moab\'s king responds with terrible false worship.',
    lessons: [
      ['The Lord provides when people are helpless', 'The dry valley fills with water by the Lord\'s word.'],
      ['False worship brings horror, not hope', 'Moab\'s king turns to a dreadful offering instead of trusting the Lord.'],
    ],
  },
  4: {
    summary: 'The Lord works through Elisha to provide oil for a widow, give a son to the Shunammite woman, restore that son to life, heal a pot of food, and feed many people.',
    lessons: [
      ['God sees needy families', 'The widow and her sons receive help through the oil.'],
      ['The Lord gives life and provision', 'The chapter shows God caring in homes, kitchens, and hungry crowds.'],
    ],
  },
  5: {
    summary: 'Naaman, a Syrian commander with a serious skin disease, hears from a young Israelite girl and comes to Elisha. He humbles himself, washes in the Jordan, is healed, and confesses that the Lord is God.',
    lessons: [
      ['God can use a child\'s witness', 'The young girl points Naaman toward the prophet in Israel.'],
      ['Humble obedience receives mercy', 'Naaman is healed when he listens and washes as Elisha said.'],
    ],
  },
  6: {
    summary: 'Elisha helps recover a borrowed ax head, shows that the Lord\'s fiery army surrounds his servant, and leads blinded Syrian soldiers safely to Samaria. Later, Samaria suffers a terrible famine during a siege.',
    lessons: [
      ['The Lord sees more than we see', 'Elisha\'s servant learns that the Lord\'s army is greater than the enemy.'],
      ['Sin and siege bring deep sorrow', 'The famine shows how terrible covenant judgment can become.'],
    ],
  },
  7: {
    summary: 'Elisha announces that food will become plentiful in Samaria. Four men with serious skin disease find the Syrian camp empty, share the good news, and the Lord\'s word comes true.',
    lessons: [
      ['Good news should be shared', 'The men realize they must tell the starving city what they found.'],
      ['The Lord can rescue suddenly', 'The empty camp proves the Lord can turn fear into provision.'],
    ],
  },
  8: {
    summary: 'The Shunammite woman receives her land back after famine. Elisha weeps over the harm Hazael will do, and the chapter records kings of Judah who walk in sinful ways.',
    lessons: [
      ['The Lord can restore what was lost', 'The woman receives her house and land again.'],
      ['God knows future sorrow', 'Elisha grieves because he knows the damage Hazael will bring.'],
    ],
  },
  9: {
    summary: 'A prophet anoints Jehu king over Israel. Jehu brings judgment on Joram, Ahaziah, and Jezebel according to the Lord\'s word against Ahab\'s house.',
    lessons: [
      ['The Lord judges evil leadership', 'Ahab\'s house cannot escape the word spoken through Elijah.'],
      ['Judgment is serious', 'The violent scenes must be read as sober judgment, not entertainment.'],
    ],
  },
  10: {
    summary: 'Jehu destroys Ahab\'s house and removes Baal worship from Israel. Yet Jehu does not walk with the Lord wholeheartedly and keeps the golden calf sins of Jeroboam.',
    lessons: [
      ['Partial obedience is not wholehearted faithfulness', 'Jehu removes Baal but keeps other false worship.'],
      ['God\'s word does not fall to the ground', 'The Lord fulfills what he said about Ahab\'s house.'],
    ],
  },
  11: {
    summary: 'Athaliah tries to destroy the royal family, but Joash is hidden and protected. Jehoiada brings Joash out, makes covenant before the Lord, and the people remove Baal worship.',
    lessons: [
      ['God preserves David\'s line', 'Joash is kept alive when the royal family is attacked.'],
      ['Covenant renewal changes worship', 'The people promise to belong to the Lord and remove Baal worship.'],
    ],
  },
  12: {
    summary: 'Jehoash does what is right while Jehoiada teaches him and repairs the Lord\'s house with faithfully handled offerings. Later he gives temple treasures to Hazael to turn him away from Jerusalem.',
    lessons: [
      ['Faithful teaching matters', 'Jehoash does right while Jehoiada guides him.'],
      ['Holy things must be handled faithfully', 'The repair money is used honestly for the Lord\'s house.'],
    ],
  },
  13: {
    summary: 'Israel\'s kings continue in sin, but the Lord shows compassion because of his covenant with Abraham, Isaac, and Jacob. Elisha dies after promising victory, and even his bones are connected with a sign of life.',
    lessons: [
      ['God remembers his covenant', 'The Lord has compassion even when Israel has sinned.'],
      ['God\'s word gives hope near death', 'Elisha speaks victory while he is sick and dying.'],
    ],
  },
  14: {
    summary: 'Amaziah rules Judah and follows some right ways, but not like David. Israel also continues under troubled kings, yet the Lord sees Israel\'s bitter suffering and saves them for a time.',
    lessons: [
      ['The Lord measures kings by faithfulness', 'Amaziah does some right things but is not fully like David.'],
      ['God sees bitter suffering', 'The Lord helps Israel even though the nation has not been faithful.'],
    ],
  },
  15: {
    summary: 'The chapter lists kings of Judah and Israel, showing some right actions in Judah and repeated violence and instability in Israel. Assyria begins carrying parts of Israel away.',
    lessons: [
      ['Sin makes kingdoms unstable', 'Israel\'s throne changes through violence again and again.'],
      ['Judgment can begin before the final fall', 'Assyria starts taking Israelite people away before Samaria falls.'],
    ],
  },
  16: {
    summary: 'Ahaz rules Judah wickedly, follows the ways of Israel\'s kings, copies a foreign altar from Damascus, and changes worship connected to the Lord\'s house.',
    lessons: [
      ['Borrowed false worship is still false worship', 'Ahaz copies an altar instead of honoring the Lord\'s commands.'],
      ['A king can lead worship in the wrong direction', 'Ahaz changes temple worship for political fear and sinful desire.'],
    ],
  },
  17: {
    summary: 'Samaria falls, and Israel is carried away to Assyria because the people sinned against the Lord, ignored his prophets, served false gods, and would not listen.',
    lessons: [
      ['Exile has covenant reasons', 'The chapter explains that Israel fell because the people rejected the Lord.'],
      ['Warnings are mercy before judgment', 'The Lord sent prophets again and again, calling the people to turn back.'],
    ],
  },
  18: {
    summary: 'Hezekiah trusts the Lord, removes false worship, and rebels against Assyria. The Assyrian spokesman mocks the Lord and tries to frighten Jerusalem, but the people keep silent as Hezekiah commanded.',
    lessons: [
      ['Trust in the Lord can stand under pressure', 'Hezekiah trusts the Lord while Assyria threatens.'],
      ['Mocking words do not change God\'s power', 'Assyria speaks proudly, but the Lord remains God.'],
    ],
  },
  19: {
    summary: 'Hezekiah seeks the Lord, spreads Assyria\'s threatening letter before him, and prays for deliverance. Isaiah brings the Lord\'s answer, and the Lord saves Jerusalem from Assyria.',
    lessons: [
      ['Bring fear before the Lord', 'Hezekiah carries the letter into the Lord\'s house and prays.'],
      ['The Lord defends his name', 'Jerusalem is saved so the nations may know the Lord is God alone.'],
    ],
  },
  20: {
    summary: 'Hezekiah becomes very sick, prays, and receives healing with a sign from the Lord. Later he shows his treasures to Babylonian messengers, and Isaiah announces that those treasures will one day be carried away.',
    lessons: [
      ['God hears prayer and sees tears', 'The Lord answers Hezekiah when he is near death.'],
      ['Pride can endanger the future', 'Hezekiah shows his treasures, and Babylon will later carry them away.'],
    ],
  },
  21: {
    summary: 'Manasseh does great evil, fills Jerusalem with idolatry and innocent blood, and leads Judah into sin. Amon follows evil and is killed by his servants.',
    lessons: [
      ['Sin can spread through leadership', 'Manasseh leads Judah into practices worse than the nations before them.'],
      ['God sees innocent blood', 'Manasseh\'s violence is part of the reason judgment is coming.'],
    ],
  },
  22: {
    summary: 'Josiah becomes king as a child and does what is right. During temple repairs, the book of the law is found, and Josiah grieves because Judah has not obeyed the Lord\'s words.',
    lessons: [
      ['God\'s word must be heard again', 'The found book shows the people how far they have drifted.'],
      ['A tender heart responds to Scripture', 'Josiah humbles himself when he hears the law.'],
    ],
  },
  23: {
    summary: 'Josiah reads the covenant book, renews the covenant, removes idolatry, and keeps Passover. Yet because of earlier sins, the Lord\'s judgment on Judah is not turned away.',
    lessons: [
      ['True reform listens to God\'s word', 'Josiah reads the covenant and acts on it.'],
      ['Faithfulness matters even when judgment is near', 'Josiah turns to the Lord with all his heart.'],
    ],
  },
  24: {
    summary: 'Babylon rises against Judah, and the Lord sends judgment because of Judah\'s sins. Jehoiachin and many leaders, soldiers, and craftsmen are carried away to Babylon.',
    lessons: [
      ['The Lord\'s warnings are fulfilled', 'Judah is removed because the people would not listen.'],
      ['Exile is grief for the whole nation', 'Kings, families, workers, and the city all suffer.'],
    ],
  },
  25: {
    summary: 'Jerusalem is surrounded, starved, broken, and burned. The temple is destroyed, Judah is carried into exile, and the book ends with Jehoiachin receiving kindness in Babylon.',
    lessons: [
      ['Judgment is real and sorrowful', 'Jerusalem falls after years of refusing the Lord.'],
      ['A small mercy remains at the end', 'Jehoiachin is lifted from prison and given daily food.'],
    ],
  },
}

const MEMORY_REFERENCES = {
  1: '2 Kings 1:3',
  2: '2 Kings 2:14',
  3: '2 Kings 3:17',
  4: '2 Kings 4:44',
  5: '2 Kings 5:15',
  6: '2 Kings 6:16',
  7: '2 Kings 7:9',
  8: '2 Kings 8:1',
  9: '2 Kings 9:6',
  10: '2 Kings 10:10',
  11: '2 Kings 11:17',
  12: '2 Kings 12:2',
  13: '2 Kings 13:23',
  14: '2 Kings 14:27',
  15: '2 Kings 15:3',
  16: '2 Kings 16:2',
  17: '2 Kings 17:13',
  18: '2 Kings 18:5',
  19: '2 Kings 19:19',
  20: '2 Kings 20:5',
  21: '2 Kings 21:12',
  22: '2 Kings 22:2',
  23: '2 Kings 23:25',
  24: '2 Kings 24:3',
  25: '2 Kings 25:30',
}

function main() {
  for (const chapterNumber of CHAPTERS) {
    const ageTexts = {}

    for (const ageRange of AGE_RANGES) {
      const filePath = ageTextPath(chapterNumber, ageRange)
      const verses = extractVerses(fs.readFileSync(filePath, 'utf8')).map(verse => ({
        ...verse,
        body: polishKingsText(verse.body, ageRange),
      }))

      ageTexts[ageRange] = verses
      writeAgeChapter(filePath, chapterNumber, verses)
    }

    updateResourceChapter(chapterNumber, ageTexts)
  }

  console.log(`Reviewed ${BOOK_NAME} chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`)
}

function polishKingsText(text, ageRange) {
  let result = polishKidReadableText(text, ageRange)
    .replace(/\bYahweh\b/g, 'the Lord')
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
    .replace(/\babominations\b/g, 'detestable sins')
    .replace(/\babomination\b/g, 'detestable sin')
    .replace(/\babominable\b/g, 'detestable')
    .replace(/\bleprosy\b/g, 'serious skin disease')
    .replace(/\bleprous\b/g, 'had a serious skin disease')
    .replace(/\blepers\b/g, 'men with serious skin disease')
    .replace(/\bleper\b/g, 'person with a serious skin disease')
    .replace(/\bsackcloth\b/g, 'rough cloth')
    .replace(/\bdung\b/g, 'animal waste')
    .replace(/\bdove's animal waste\b/g, 'dove droppings')
    .replace(/\bfamiliar spirits\b/g, 'people who tried to speak with spirits')
    .replace(/\bwizards\b/g, 'magic workers')
    .replace(/\beunuchs\b/g, 'palace officials')
    .replace(/\beunuch\b/g, 'palace official')
    .replace(/\bsodomites\b/g, 'people doing sexual sin in idol worship')
    .replace(/\bsodomite\b/g, 'person doing sexual sin in idol worship')
    .replace(/\bharlots\b/g, 'women living in sexual sin')
    .replace(/\bharlot\b/g, 'woman living in sexual sin')
    .replace(/\bhigh places\b/g, 'high worship places')
    .replace(/\bhigh place\b/g, 'high worship place')
    .replace(/\bAsherah\b/g, 'Asherah idol')
    .replace(/\bBaalim\b/g, 'Baals')
    .replace(/\bother gods\b/g, 'false gods')
    .replace(/\btalents\b/g, 'large weights')
    .replace(/\btalent\b/g, 'large weight')
    .replace(/\bshekels\b/g, 'silver pieces')
    .replace(/\bshekel\b/g, 'silver piece')
    .replace(/\bcubits\b/g, 'arm-lengths')
    .replace(/\bcubit\b/g, 'arm-length')
    .replace(/\bseahs\b/g, 'measures')
    .replace(/\bseah\b/g, 'measure')
    .replace(/\bsnuffers\b/g, 'wick trimmers')
    .replace(/\bsnuffer\b/g, 'wick trimmer')
    .replace(/\bson of the prophets\b/g, 'prophet in training')
    .replace(/\bsons of the prophets\b/g, 'company of prophets')
    .replace(/\bmantle\b/g, 'cloak')
    .replace(/\bthreshold\b/g, 'doorway')
    .replace(/\bvessels\b/g, 'containers')
    .replace(/\bvessel\b/g, 'container')
    .replace(/\bslept with his fathers\b/g, 'died and was buried with his fathers')

  if (ageRange === '5-7') {
    result = result
      .replace(/\bhigh worship places\b/g, 'worship places on hills')
      .replace(/\bhigh worship place\b/g, 'worship place on a hill')
      .replace(/\bcontainers\b/g, 'jars and bowls')
      .replace(/\bcontainer\b/g, 'jar or bowl')
  }

  return finalPolish(result)
}

function finalPolish(text) {
  return String(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac[\u02dc\u2122]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\bdid that was evil\b/g, 'did what was evil')
    .replace(/\bdid that was right\b/g, 'did what was right')
    .replace(/\bdid that which was evil\b/g, 'did what was evil')
    .replace(/\bdid that which was right\b/g, 'did what was right')
    .replace(/\bdo that was evil\b/g, 'do what was evil')
    .replace(/\bdo that which is evil\b/g, 'do what is evil')
    .replace(/\bdone that which is evil\b/g, 'done what is evil')
    .replace(/\bdoing that was evil\b/g, 'doing what was evil')
    .replace(/\bdoing that which is evil\b/g, 'doing what is evil')
    .replace(/\bexecuting that is right\b/g, 'doing what was right')
    .replace(/\bexecuting that which is right\b/g, 'doing what was right')
    .replace(/\bthat which is good in your eyes\b/g, 'what seems good to you')
    .replace(/\bthat which you put on me, I will bear\b/g, 'whatever payment you put on me, I will carry')
    .replace(/\bthat which grows of itself\b/g, 'what grows by itself')
    .replace(/\bthat which springs from which\b/g, 'what grows from that')
    .replace(/\bthat which was of gold, in gold, and that which was of silver, in silver\b/g, 'the gold things as gold and the silver things as silver')
    .replace(/\bThe Lord's word which you have spoken\b/g, "The Lord's word you have spoken")
    .replace(/\bthe Lord's word which\b/g, "the Lord's word that")
    .replace(/\bElisha's word which he spoke\b/g, "Elisha's word")
    .replace(/\bThis was the Lord's word which he spoke\b/g, "This was the Lord's word that he had spoken")
    .replace(/\bNow the rest of the acts of ([^,]+) which he did\b/g, 'The rest of what $1 did')
    .replace(/\bThe rest of the acts of ([^,]+) which he did\b/g, 'The rest of what $1 did')
    .replace(/\bThe rest of what ([^,]+) did, they are written\b/g, 'The rest of what $1 did is written')
    .replace(/\baren't they written in the book of the chronicles of the kings of ([A-Za-z]+)\?/g, 'they are written in the history book of the kings of $1.')
    .replace(/\bbook of the chronicles\b/g, 'history book')
    .replace(/\bwith that he made Israel to sin\b/g, 'that led Israel into sin')
    .replace(/\bwith which he made Israel to sin\b/g, 'that led Israel into sin')
    .replace(/\bof that the Lord said\b/g, 'about which the Lord said')
    .replace(/\bhouse of that the Lord said\b/g, 'house about which the Lord said')
    .replace(/\bcities in which they lived\b/g, 'cities where they lived')
    .replace(/\bcities in that they lived\b/g, 'cities where they lived')
    .replace(/\bfrom that\b/g, 'from which')
    .replace(/\bby that\b/g, 'by which')
    .replace(/\bwith that\b/g, 'with which')
    .replace(/\bTo that of us all\b/g, 'Which one of us is it for')
    .replace(/\bthat of us is for\b/g, 'which one of us is helping')
    .replace(/\bwhich of us is for\b/g, 'which one of us is helping')
    .replace(/\bFrom of the\b/g, 'From the')
    .replace(/\bElishah's\b/g, "Elisha's")
    .replace(/\bPlease be pleased to\b/g, 'Please')
    .replace(/\bAlas, my master!\b/g, 'Oh no, my master!')
    .replace(/\bAlas!\b/g, 'Oh no!')
    .replace(/\bAlas,/g, 'Oh no,')
    .replace(/\bNow therefore\b/g, 'So now')
    .replace(/\bnow therefore\b/g, 'so now')
    .replace(/\bNotwithstanding\b/g, 'Still')
    .replace(/\bnotwithstanding\b/g, 'still')
    .replace(/\bhardened their neck\b/g, 'were stubborn')
    .replace(/\bhardened his neck\b/g, 'was stubborn')
    .replace(/\bfollowed vanity, and became vain\b/g, 'followed empty false worship, and their lives became empty')
    .replace(/\bthe offspring of Israel\b/g, 'the people of Israel')
    .replace(/\boffspring of Israel\b/g, 'people of Israel')
    .replace(/\bafflicted them\b/g, 'let them suffer')
    .replace(/\bdelivered them into the hands of raiders\b/g, 'gave them over to raiders')
    .replace(/\bdelivered them into the hand of\b/g, 'gave them into the power of')
    .replace(/\bcast them out of his sight\b/g, 'removed them from his sight')
    .replace(/\bpossessed Samaria\b/g, 'took Samaria')
    .replace(/\bbeginning of their dwelling there\b/g, 'when they first lived there')
    .replace(/\bchildren of Jacob\b/g, 'descendants of Jacob')
    .replace(/\bobserve to do forever more\b/g, 'keep forever')
    .replace(/\bbow yourselves\b/g, 'bow down')
    .replace(/\bengraved images\b/g, 'carved idols')
    .replace(/\bengraved image\b/g, 'carved idol')
    .replace(/\bthe army of the sky\b/g, 'the sun, moon, and stars of the sky')
    .replace(/\ball the army of the sky\b/g, 'the sun, moon, and stars of the sky')
    .replace(/\ball the sun, moon, and stars of the sky\b/g, 'the sun, moon, and stars of the sky')
    .replace(/\bthe sun, the moon, the planets, and the sun, moon, and stars of the sky\b/g, 'the sun, the moon, the planets, and the stars of the sky')
    .replace(/\bno one like him got up\b/g, 'no king like him came after him')
    .replace(/\bAlas!/g, 'Oh no!')
    .replace(/\bconspired\b/g, 'made a secret plan')
    .replace(/\bconspiracy\b/g, 'secret plan')
    .replace(/\bspied\b/g, 'saw')
    .replace(/\bdeparted\b/g, 'left')
    .replace(/\bproclaimed\b/g, 'announced')
    .replace(/\bordained\b/g, 'appointed')
    .replace(/\bdefiled\b/g, 'made unfit for worship')
    .replace(/\bdefile\b/g, 'make unfit for worship')
    .replace(/\bprovoked the Lord to anger\b/g, 'made the Lord angry')
    .replace(/\bprovoke the Lord to anger\b/g, 'make the Lord angry')
    .replace(/\bprovoke him to anger\b/g, 'make him angry')
    .replace(/\bwrath\b/g, 'anger')
    .replace(/\bquenched\b/g, 'put out')
    .replace(/\bremnant of my inheritance\b/g, 'small group left from my people')
    .replace(/\bcast off\b/g, 'reject')
    .replace(/\bslaves\b/g, 'forced servants')
    .replace(/\bslave\b/g, 'forced servant')
    .replace(/\blatrine\b/g, 'toilet place')
    .replace(/\bconsumed him and his fifty\b/g, 'burned him and his fifty men up')
    .replace(/\bconsume you and your fifty\b/g, 'burn you and your fifty men up')
    .replace(/\bfire came down from the sky, and burned him and his fifty men up\b/g, 'fire came down from the sky and burned up the commander and his fifty men')
    .replace(/\bGod's fire came down from the sky, and burned him and his fifty men up\b/g, "God's fire came down from the sky and burned up the commander and his fifty men")
    .replace(/\bcommanders of fifty with their fifties\b/g, 'commanders and their fifty men')
    .replace(/\bcommander of fifty with his fifty\b/g, 'commander with his fifty men')
    .replace(/\bthe Lord the Lord\b/g, 'the Lord')
    .replace(/\bserious skin disease disease\b/g, 'serious skin disease')
    .replace(/\bhad a serious skin disease disease\b/g, 'had a serious skin disease')
    .replace(/\brough cloth cloth\b/g, 'rough cloth')
    .replace(/\bsweet-smelling sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\bAsherah idol idol\b/g, 'Asherah idol')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\bto to\b/g, 'to')
    .replace(/\band and\b/g, 'and')
    .replace(/\bthat that\b/g, 'that')
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
    .trim()
}

function ageTextPath(chapterNumber, ageRange) {
  return path.join(
    CONTENT_DIR,
    'bible-text',
    `ages-${ageRange}`,
    TESTAMENT,
    BOOK,
    `chapter-${chapterNumber}.md`
  )
}

function extractVerses(content) {
  const verseRegex = /^###\s+(.+?\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+.+?\s+\d+:\d+\s*$|^##\s+|(?![\s\S]))/gm
  return [...content.matchAll(verseRegex)].map(match => ({
    reference: match[1].trim(),
    body: match[2].trim(),
  }))
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
  ]

  verses.forEach((verse, index) => {
    if (index > 0) parts.push('')
    parts.push(`### ${verse.reference}`)
    parts.push(verse.body)
  })

  fs.writeFileSync(filePath, `${parts.join('\n').replace(/\n+$/g, '')}\n`, 'utf8')
}

function updateResourceChapter(chapterNumber, ageTexts) {
  const resourcePath = path.join(CONTENT_DIR, TESTAMENT, BOOK, `chapter-${chapterNumber}.md`)
  if (!fs.existsSync(resourcePath)) return

  let content = fs.readFileSync(resourcePath, 'utf8')
  const verseCount = Math.max(ageTexts['5-7'].length, ageTexts['8-10'].length)

  for (let verseNumber = 1; verseNumber <= verseCount; verseNumber += 1) {
    const reference = `${BOOK_NAME} ${chapterNumber}:${verseNumber}`
    content = replaceResourceAgeText(content, reference, '5-7', findVerse(ageTexts['5-7'], reference))
    content = replaceResourceAgeText(content, reference, '8-10', findVerse(ageTexts['8-10'], reference))
  }

  content = replaceMemoryVerseText(content, '5-7', ageTexts['5-7'], chapterNumber)
  content = replaceMemoryVerseText(content, '8-10', ageTexts['8-10'], chapterNumber)
  content = replaceResourceOverview(content, chapterNumber)
  content = replaceChapterSummary(content, chapterNumber)
  content = removeDraftResourceNote(content)
  content = content.replace(/\n{2,}$/g, '\n')

  fs.writeFileSync(resourcePath, content, 'utf8')
}

function replaceResourceAgeText(content, reference, ageRange, text) {
  const heading = ageRange === '5-7' ? '#### Ages 5-7' : '#### Ages 8-10'
  const nextHeading = ageRange === '5-7' ? '#### Ages 8-10' : '**Translation Notes**:'
  const pattern = new RegExp(
    `(### ${escapeRegex(reference)}[\\s\\S]*?${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(\\r?\\n\\r?\\n${escapeRegex(nextHeading)})`,
    'm'
  )

  return content.replace(pattern, `$1${text || `[Ages ${ageRange} text missing.]`}$3`)
}

function replaceMemoryVerseText(content, ageRange, verses, chapterNumber) {
  const heading = ageRange === '5-7' ? '### Ages 5-7' : '### Ages 8-10'
  const nextHeading = ageRange === '5-7' ? '### Ages 8-10' : '## Discussion Questions by Age'
  const verse = getMemoryVerse(chapterNumber, verses)
  const pattern = new RegExp(
    `(## Memory Verses by Age[\\s\\S]*?${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(\\r?\\n\\r?\\n${escapeRegex(nextHeading)})`,
    'm'
  )

  return content.replace(pattern, `$1${verse}$3`)
}

function replaceResourceOverview(content, chapterNumber) {
  const data = RESOURCE_DATA[chapterNumber]
  if (!data) return content

  const overview = `${BOOK_OVERVIEW} In ${BOOK_NAME} ${chapterNumber}, ${data.summary}`
  return replaceSection(content, '## Book Overview', overview)
}

function replaceChapterSummary(content, chapterNumber) {
  const data = RESOURCE_DATA[chapterNumber]
  if (!data) return content

  let updated = replaceSection(content, '## Chapter Summary', data.summary)
  const lessons = data.lessons
    .map(([title, body], index) => `${index + 1}. **${title}**: ${body}`)
    .join('\n')
  updated = replaceSection(updated, '## Key Lessons for Children', lessons)
  return updated
}

function replaceSection(content, heading, body) {
  const pattern = new RegExp(
    `(${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(?=\\r?\\n##\\s|$)`
  )
  return content.replace(pattern, `$1${body.trim()}\n`)
}

function removeDraftResourceNote(content) {
  return content
    .replace(/\n?<!-- Draft Resource Note -->[\s\S]*?<!-- End Draft Resource Note -->\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
}

function getMemoryVerse(chapterNumber, verses) {
  const reference = MEMORY_REFERENCES[chapterNumber]
  const verse = verses.find(item => item.reference === reference) || verses[0]
  if (!verse) return `${BOOK_NAME} ${chapterNumber}:1`
  return `${verse.body} - ${verse.reference}`
}

function findVerse(verses, reference) {
  return verses.find(verse => verse.reference === reference)?.body || ''
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

main()
