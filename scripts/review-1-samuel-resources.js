#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = '1-samuel';
const BOOK_NAME = '1 Samuel';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 31 }, (_, index) => index + 1);

const BOOK_OVERVIEW =
  '1 Samuel tells how the Lord answered Hannah, called Samuel, judged corrupt leadership, gave Israel a king, rejected Saul for disobedience, and began raising up David.';

const RESOURCE_DATA = {
  1: {
    summary: 'Hannah prays in deep sorrow because she has no child, and the Lord remembers her. She gives birth to Samuel, keeps her promise, and brings him to serve the Lord at Shiloh.',
    lessons: [
      ['The Lord hears sorrowful prayer', 'Hannah pours out her grief before the Lord, and he remembers her.'],
      ['Kept promises honor God', 'Hannah gives Samuel to the Lord just as she promised.'],
    ],
  },
  2: {
    summary: 'Hannah praises the Lord, who lifts up the weak and brings down the proud. Eli\'s sons treat the Lord\'s offerings with contempt, while Samuel serves before the Lord, and a man of God announces judgment on Eli\'s house.',
    lessons: [
      ['God lifts the lowly', 'Hannah sings that the Lord raises the poor and humbles the proud.'],
      ['Worship must be treated as holy', 'Eli\'s sons show contempt for the Lord\'s offerings and are judged.'],
    ],
  },
  3: {
    summary: 'The Lord calls Samuel during the night and gives him a hard message about Eli\'s house. Samuel tells Eli the truth, and all Israel knows that Samuel is established as a prophet of the Lord.',
    lessons: [
      ['God speaks truly', 'Samuel learns to listen when the Lord calls.'],
      ['Faithful servants tell the truth', 'Samuel must share a difficult message without changing it.'],
    ],
  },
  4: {
    summary: 'Israel treats the ark like a battle charm instead of trusting the Lord. The Philistines defeat Israel, capture the ark, Eli\'s sons die, Eli dies, and Phinehas\'s wife names her child Ichabod because glory has departed from Israel.',
    lessons: [
      ['Holy things are not magic charms', 'Israel brings the ark without humble trust in the Lord.'],
      ['God takes corrupt leadership seriously', 'The judgment spoken against Eli\'s house comes to pass.'],
    ],
  },
  5: {
    summary: 'The Philistines place the ark in Dagon\'s temple, but Dagon falls before the ark of the Lord. The Lord heavily troubles the Philistine cities until they know the ark must not stay with them.',
    lessons: [
      ['The Lord is above idols', 'Dagon falls before the ark of God.'],
      ['God defends his own glory', 'The Philistines learn that they cannot treat the ark as a trophy.'],
    ],
  },
  6: {
    summary: 'The Philistines send the ark back to Israel with guilt offerings, and the cows pull it straight toward Beth Shemesh. The people rejoice, but some treat the ark wrongly and suffer judgment.',
    lessons: [
      ['God guides even unusual events', 'The cows go straight toward Israel, showing the Lord\'s hand.'],
      ['Joy still needs reverence', 'The ark returns, but holy things must be honored rightly.'],
    ],
  },
  7: {
    summary: 'Samuel calls Israel to put away false gods and serve the Lord alone. The people repent at Mizpah, the Lord thunders against the Philistines, and Samuel sets up Ebenezer to remember the Lord\'s help.',
    lessons: [
      ['Repentance turns from idols', 'Samuel tells Israel to put away false gods and serve only the Lord.'],
      ['The Lord helps his people', 'Ebenezer reminds Israel that the Lord has helped them.'],
    ],
  },
  8: {
    summary: 'Israel asks Samuel for a king like the other nations. The Lord says they are rejecting him as king, and Samuel warns them what a human king will take from them.',
    lessons: [
      ['Wanting to copy the nations is dangerous', 'Israel asks for a king like everyone else.'],
      ['The Lord is the true king', 'God says the people have rejected him from ruling over them.'],
    ],
  },
  9: {
    summary: 'Saul goes looking for his father\'s lost donkeys, but the Lord is leading him to Samuel. Samuel honors Saul at a meal and prepares to reveal the Lord\'s plan for him.',
    lessons: [
      ['God can guide ordinary errands', 'Saul is looking for donkeys, but the Lord is directing the meeting.'],
      ['God sees future needs', 'The Lord has already told Samuel about Saul before Saul arrives.'],
    ],
  },
  10: {
    summary: 'Samuel anoints Saul and gives him signs that come to pass. Saul is chosen by lot before the people, but he hides among the baggage before being presented as Israel\'s king.',
    lessons: [
      ['God\'s word comes to pass', 'The signs Samuel gives Saul happen just as he said.'],
      ['Human kings are still small before God', 'Saul is chosen, but he hides in fear.'],
    ],
  },
  11: {
    summary: 'Nahash threatens Jabesh Gilead, and the Spirit of God rushes on Saul. Saul gathers Israel, rescues the city, shows mercy to those who doubted him, and is confirmed as king at Gilgal.',
    lessons: [
      ['The Lord can strengthen leaders to rescue', 'The Spirit of God moves Saul to act for Jabesh Gilead.'],
      ['Mercy is better than revenge', 'Saul refuses to execute those who doubted him after the victory.'],
    ],
  },
  12: {
    summary: 'Samuel gives his farewell speech, reminding Israel of the Lord\'s righteous acts and warning them not to turn aside. The Lord sends thunder and rain, and Samuel calls the people to fear the Lord and serve him faithfully.',
    lessons: [
      ['Remember the Lord\'s works', 'Samuel retells how the Lord rescued and led Israel.'],
      ['Grace does not excuse rebellion', 'The Lord will not abandon his people, but they must not turn aside.'],
    ],
  },
  13: {
    summary: 'Saul grows afraid while waiting for Samuel and offers the burnt offering himself. Samuel rebukes him, saying his kingdom will not continue because he did not keep the Lord\'s command.',
    lessons: [
      ['Fear must not lead obedience', 'Saul acts wrongly when pressure builds.'],
      ['God desires a faithful king', 'Samuel says the Lord has sought a man after his own heart.'],
    ],
  },
  14: {
    summary: 'Jonathan trusts that the Lord can save by many or by few, and the Lord throws the Philistines into confusion. Saul\'s rash oath nearly brings death on Jonathan, but the people rescue him.',
    lessons: [
      ['The Lord can save by many or few', 'Jonathan trusts the Lord before attacking the Philistine camp.'],
      ['Rash words can harm others', 'Saul\'s oath troubles the army and endangers Jonathan.'],
    ],
  },
  15: {
    summary: 'Saul disobeys the Lord\'s command about Amalek and then tries to excuse himself. Samuel tells Saul that obedience is better than sacrifice, and the Lord rejects Saul from being king.',
    lessons: [
      ['Partial obedience is disobedience', 'Saul keeps what the Lord told him to destroy.'],
      ['Obedience is better than religious excuses', 'Samuel says listening to the Lord is better than sacrifice.'],
    ],
  },
  16: {
    summary: 'The Lord sends Samuel to Bethlehem and teaches him that people look at outward appearance, but the Lord looks at the heart. Samuel anoints David, the Spirit of the Lord comes on David, and David later serves Saul with music.',
    lessons: [
      ['The Lord looks at the heart', 'God does not choose the way people choose by appearance.'],
      ['God prepares his servant quietly', 'David is anointed while still a young shepherd.'],
    ],
  },
  17: {
    summary: 'Goliath defies Israel, but David trusts the Lord and goes to meet him with a sling and stones. The Lord gives David victory, showing that the battle belongs to the Lord.',
    lessons: [
      ['The battle belongs to the Lord', 'David knows swords and spears are not Israel\'s hope.'],
      ['Faith remembers God\'s past help', 'David remembers how the Lord rescued him before.'],
    ],
  },
  18: {
    summary: 'Jonathan loves David, and David succeeds wherever Saul sends him because the Lord is with him. Saul becomes jealous and afraid of David, but David continues to act wisely.',
    lessons: [
      ['Faithful friendship is a gift', 'Jonathan loves David and makes a covenant with him.'],
      ['Jealousy grows dangerous', 'Saul fears David instead of rejoicing in what the Lord is doing.'],
    ],
  },
  19: {
    summary: 'Saul tries again to kill David, but Jonathan speaks for David and Michal helps him escape. David flees to Samuel, and even Saul is stopped when the Spirit of God comes on him.',
    lessons: [
      ['God protects his servant', 'David escapes danger again and again.'],
      ['Courage can defend the innocent', 'Jonathan speaks truth to Saul on David\'s behalf.'],
    ],
  },
  20: {
    summary: 'David and Jonathan make a covenant of loyal friendship before the Lord. Jonathan tests Saul\'s anger, warns David with the arrow sign, and the two friends part in sorrow and faithfulness.',
    lessons: [
      ['Loyal love keeps promises', 'Jonathan protects David even when it costs him.'],
      ['The Lord witnesses our covenants', 'David and Jonathan make their promise before the Lord.'],
    ],
  },
  21: {
    summary: 'David comes to Nob hungry and receives holy bread from Ahimelech, along with Goliath\'s sword. Then David flees to Gath and acts strangely because he is afraid of Achish.',
    lessons: [
      ['God provides in need', 'David receives food while he is fleeing.'],
      ['Fear can make even brave people weak', 'David is afraid in Gath and acts to survive.'],
    ],
  },
  22: {
    summary: 'David gathers distressed people at Adullam, but Saul grows cruel and suspicious. Doeg tells Saul about Nob, Saul orders the priests killed, and Abiathar escapes to David.',
    lessons: [
      ['Unjust anger destroys', 'Saul\'s fear and suspicion lead to terrible violence.'],
      ['God preserves a witness', 'Abiathar escapes and comes to David.'],
    ],
  },
  23: {
    summary: 'David rescues Keilah from the Philistines, then must flee when Saul seeks him there. Jonathan strengthens David in God, and the Lord protects David when Saul nearly catches him.',
    lessons: [
      ['Seek the Lord for guidance', 'David asks the Lord what to do more than once.'],
      ['Godly friends strengthen faith', 'Jonathan helps David find strength in God.'],
    ],
  },
  24: {
    summary: 'David finds Saul in the cave but refuses to kill the Lord\'s anointed king. David shows Saul the corner of the robe and asks the Lord to judge between them.',
    lessons: [
      ['Do not take revenge into your own hands', 'David refuses to kill Saul when he has the chance.'],
      ['Respect for God shapes choices', 'David spares Saul because Saul is the Lord\'s anointed king.'],
    ],
  },
  25: {
    summary: 'After Samuel dies, Nabal insults David, but Abigail wisely hurries to stop bloodshed. David blesses the Lord for sending Abigail, and the Lord judges Nabal.',
    lessons: [
      ['Wisdom can stop harm', 'Abigail acts quickly with humble words and gifts.'],
      ['The Lord can keep us from sin', 'David sees that God used Abigail to keep him from bloodshed.'],
    ],
  },
  26: {
    summary: 'David again has a chance to kill Saul, this time in Saul\'s camp, but he refuses to lift his hand against the Lord\'s anointed king. David takes Saul\'s spear and water jar, then calls Saul to see his innocence.',
    lessons: [
      ['Faithfulness can repeat under pressure', 'David spares Saul a second time.'],
      ['The Lord rewards righteousness', 'David entrusts justice to the Lord.'],
    ],
  },
  27: {
    summary: 'David fears Saul will one day catch him, so he goes to live among the Philistines under Achish. Achish gives David Ziklag, and David stays there while fighting surrounding peoples.',
    lessons: [
      ['Fear can push complicated choices', 'David moves to Philistine land because he feels unsafe.'],
      ['God\'s story continues in hard places', 'Even in Ziklag, David remains part of the Lord\'s larger plan.'],
    ],
  },
  28: {
    summary: 'The Philistines gather for war, and Saul is terrified because the Lord does not answer him. Saul seeks a forbidden woman who tries to speak with the dead, and Samuel announces that Saul and his sons will fall.',
    lessons: [
      ['Forbidden guidance is not faith', 'Saul turns to what the Lord had forbidden instead of repenting.'],
      ['The Lord\'s word stands', 'Samuel\'s message confirms the judgment already spoken against Saul.'],
    ],
  },
  29: {
    summary: 'David marches with Achish, but the Philistine rulers do not trust him and send him away from the battle. Achish says David has been upright with him, but David must return.',
    lessons: [
      ['God can close dangerous doors', 'David is sent away from a battle that would trap him between loyalties.'],
      ['Reputation matters', 'Achish has seen David act faithfully toward him.'],
    ],
  },
  30: {
    summary: 'The Amalekites raid Ziklag and take the families captive, and David strengthens himself in the Lord. The Lord guides David to pursue, recover everyone, and share the spoil fairly.',
    lessons: [
      ['Strength comes from the Lord', 'David strengthens himself in the Lord when everyone is grieving.'],
      ['God\'s gifts should be shared fairly', 'David makes sure those who guarded the supplies share in the spoil.'],
    ],
  },
  31: {
    summary: 'The Philistines defeat Israel on Mount Gilboa. Saul\'s sons die, Saul dies, and brave men from Jabesh Gilead recover and bury the bodies of Saul and his sons.',
    lessons: [
      ['Sinful leadership ends in sorrow', 'Saul\'s story closes with defeat and death.'],
      ['Courage can honor the dead', 'The men of Jabesh Gilead risk danger to bury Saul and his sons.'],
    ],
  },
};

const MEMORY_REFERENCES = {
  1: '1 Samuel 1:27',
  2: '1 Samuel 2:2',
  3: '1 Samuel 3:10',
  4: '1 Samuel 4:22',
  5: '1 Samuel 5:4',
  6: '1 Samuel 6:20',
  7: '1 Samuel 7:12',
  8: '1 Samuel 8:7',
  9: '1 Samuel 9:16',
  10: '1 Samuel 10:24',
  11: '1 Samuel 11:13',
  12: '1 Samuel 12:22',
  13: '1 Samuel 13:14',
  14: '1 Samuel 14:6',
  15: '1 Samuel 15:22',
  16: '1 Samuel 16:7',
  17: '1 Samuel 17:47',
  18: '1 Samuel 18:14',
  19: '1 Samuel 19:4',
  20: '1 Samuel 20:17',
  21: '1 Samuel 21:6',
  22: '1 Samuel 22:23',
  23: '1 Samuel 23:16',
  24: '1 Samuel 24:6',
  25: '1 Samuel 25:32',
  26: '1 Samuel 26:23',
  27: '1 Samuel 27:7',
  28: '1 Samuel 28:18',
  29: '1 Samuel 29:9',
  30: '1 Samuel 30:6',
  31: '1 Samuel 31:13',
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
    .replace(/\bconcubine\b/g, 'secondary wife')
    .replace(/\buncircumcised Philistine\b/g, 'Philistine outside God\'s covenant people')
    .replace(/\buncircumcised\b/g, 'outside God\'s covenant people')
    .replace(/\bforeskins?\b/g, 'proofs that enemies were defeated')
    .replace(/\bthose who urinate against a wall\b/g, 'males')
    .replace(/\bone who urinates on a wall\b/g, 'one male')
    .replace(/\bone who urinates against a wall\b/g, 'one male')
    .replace(/\bwho urinates against a wall\b/g, 'male')
    .replace(/\bmediums\b/g, 'people who try to speak with the dead')
    .replace(/\bmedium\b/g, 'person who tries to speak with the dead')
    .replace(/\bfamiliar spirits\b/g, 'spirits used for forbidden messages')
    .replace(/\bfamiliar spirit\b/g, 'spirit used for forbidden messages')
    .replace(/\bwizards?\b/g, 'people who practice forbidden magic')
    .replace(/\bwitchcraft\b/g, 'forbidden magic')
    .replace(/\bentreated the favor of\b/g, 'asked for favor from')
    .replace(/\bentreat\b/g, 'ask')
    .replace(/\bsash\b/g, 'belt')
    .replace(/\btrespass offerings\b/g, 'guilt offerings')
    .replace(/\btrespass offering\b/g, 'guilt offering')
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
    .replace(/\bnaked\b/g, 'without his outer clothes')
    .replace(/\bdevoted to destruction\b/g, 'set apart for the Lord\'s judgment')
    .replace(/\butterly destroy\b/g, 'completely destroy under the Lord\'s judgment')
    .replace(/\butterly destroyed\b/g, 'completely destroyed under the Lord\'s judgment')
    .replace(/\bseer\b/g, 'prophet called a seer')
    .replace(/\bseers\b/g, 'prophets called seers')
    .replace(/\bprophet called a prophet called a seer\b/g, 'prophet called a seer')
    .replace(/\bthe Lord's chosen and marked with oil king\b/g, "the Lord's anointed king")
    .replace(/\bthe Lord's anointed king king\b/g, "the Lord's anointed king")
    .replace(/\bthe Lord's anointed kinged\b/g, "the Lord's anointed");

  if (ageRange === '5-7') {
    result = result
      .replace(/\bpriestly vest\b/g, 'special priestly vest')
      .replace(/\bset apart for the Lord's judgment\b/g, 'set apart for the Lord to judge')
      .replace(/\bcompletely destroy under the Lord's judgment\b/g, 'completely destroy as the Lord judged');
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
    .replace(/\bthe Lord chosen and marked with oil you king\b/g, 'the Lord anointed you as king')
    .replace(/\bthe Lord chosen and marked with oil you\b/g, 'the Lord anointed you')
    .replace(/\bchosen and marked with oil him\b/g, 'anointed him')
    .replace(/\bchosen and marked with oil you\b/g, 'anointed you')
    .replace(/\bhis chosen and marked with oil\b/g, 'his anointed king')
    .replace(/\bfemale servants servants\b/g, 'female servants')
    .replace(/\bservant servant\b/g, 'servant')
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
  content = content.replace(/\bcreditd\b/g, 'credited');
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
