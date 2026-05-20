#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = 'genesis';
const BOOK_NAME = 'Genesis';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];

const CHAPTERS = Array.from({ length: 48 }, (_, index) => index + 3);

const VOCABULARY = {
  adoption: 'Being received and counted as part of a family',
  altar: 'A special place where someone worshiped the Lord with an offering',
  Almighty: 'A name that speaks of God\'s great power',
  angel: 'A messenger sent from God',
  ark: 'The large boat God told Noah to build',
  Babel: 'The city where the Lord confused human language',
  barren: 'Not able to have children',
  Benjamin: 'Jacob\'s youngest son, born to Rachel',
  Bethel: 'The place Jacob named "house of God"',
  blessing: 'Good spoken or given by God',
  blood: 'A word often connected with life in Genesis',
  brothers: 'Sons in the same family',
  birthright: 'The special family place and inheritance of the firstborn son',
  burial: 'Placing someone who has died in a grave or tomb',
  Canaan: 'The land God promised to Abraham and his family',
  children: 'Sons and daughters in a family',
  chief: 'A leader over a family group or people',
  clan: 'A large family group within a people',
  comfort: 'Help and relief in sorrow or hard work',
  confession: 'Telling the truth about sin or wrongdoing',
  covenant: 'A serious promise relationship God makes',
  curse: 'A judgment that brings sorrow instead of blessing',
  death: 'The end of earthly life',
  deceit: 'A lie or trick meant to hide the truth',
  dream: 'A picture or message seen while sleeping',
  Eden: 'The garden place God prepared for the first people',
  Edom: 'The land and people connected with Esau\'s family',
  Ephraim: 'Joseph\'s younger son whom Jacob blessed before Manasseh',
  Esau: 'Isaac and Rebekah\'s older son, Jacob\'s brother',
  exile: 'Being sent away from home',
  Egypt: 'The land where Joseph was taken and where Jacob\'s family later lived',
  envy: 'Sad or angry wanting of what someone else has',
  famine: 'A time when there is very little food',
  faith: 'Trust in God and in what he has spoken',
  faithfulness: 'Steady loyalty that keeps doing what is right',
  family: 'People joined by parents, children, marriage, or covenant promise',
  favor: 'Kindness or grace shown to someone',
  fear: 'Deep concern, dread, or awe',
  feast: 'A special meal with plenty of food',
  firstborn: 'The child born first in a family',
  flood: 'The great waters God sent in Noah\'s day',
  forgiveness: 'Letting go of guilt because mercy has been given',
  forgotten: 'Left out of someone\'s thoughts or help',
  genealogy: 'A family line that tells who came from whom',
  generation: 'People living in the same time, or a step in a family line',
  gift: 'Something given to another person',
  God: 'The one true Creator and Lord over all',
  Goshen: 'The region in Egypt where Joseph settled Jacob\'s family',
  grain: 'Seeds from crops used for food',
  grief: 'Deep sadness',
  guilt: 'The blame and burden that come from doing wrong',
  guidance: 'Help that shows the right way to go',
  hospitality: 'Welcoming and caring for guests',
  idol: 'A false god people worship instead of the true God',
  inheritance: 'What a child receives from the family after a parent dies',
  interpretation: 'Explaining the meaning of a dream or message',
  Isaac: 'Abraham and Sarah\'s promised son',
  Ishmael: 'Abraham and Hagar\'s son',
  Israel: 'The name God gave Jacob, and later the name of his family people',
  Jacob: 'Isaac and Rebekah\'s younger son, whom God later named Israel',
  journey: 'Travel from one place to another',
  Joseph: 'Jacob\'s son whom God used in Egypt to preserve life',
  Judah: 'Jacob\'s son whose family line receives an important ruler promise',
  judgment: 'God\'s right decision about sin and evil',
  justice: 'Doing what is right and fair before God',
  kindness: 'Goodness shown in action toward another person',
  king: 'A ruler over a people or land',
  kingdom: 'A people or land ruled by a king',
  labor: 'Hard work',
  land: 'The place God promised to give Abraham\'s family',
  language: 'The words a people use to speak with one another',
  Leah: 'Jacob\'s first wife and the mother of several sons of Israel',
  Manasseh: 'Joseph\'s older son whom Jacob blessed after Ephraim',
  marriage: 'The covenant joining of husband and wife',
  mercy: 'Kind help given to someone in need or guilt',
  nation: 'A people with their own land, language, or family identity',
  obedience: 'Doing what God commands',
  oath: 'A serious promise made before God',
  offspring: 'Children and later family who come after someone',
  offering: 'A gift brought to the Lord in worship',
  patriarch: 'An early father of God\'s covenant family',
  peace: 'Wholeness and calm where conflict has been answered',
  prayer: 'Speaking to God with trust, need, thanks, or praise',
  preserved: 'Kept alive or protected',
  presence: 'Being with someone',
  priest: 'A worship leader who serves before God',
  prison: 'A guarded place where prisoners are kept',
  promise: 'Words someone says and keeps',
  protection: 'God keeping someone from harm or guarding his promise',
  provision: 'What God gives to meet a need',
  providence: 'God ruling and caring even through events people cannot see clearly',
  Rachel: 'Jacob\'s loved wife and the mother of Joseph and Benjamin',
  rainbow: 'The sign God gave of his covenant after the flood',
  Rebekah: 'Isaac\'s wife and the mother of Jacob and Esau',
  remembered: 'God turning his faithful care toward someone he has not forgotten',
  repentance: 'Turning from sin with a changed heart',
  refuge: 'A safe place to run for help',
  reunion: 'Coming together again after being apart',
  rescue: 'Being saved from danger',
  righteous: 'Right before God, shown by trust and obedience',
  righteousness: 'Being counted right before God',
  sacrifice: 'An offering given to God in worship',
  scattered: 'Spread out in many directions',
  serpent: 'The crafty creature that tempted the woman in Eden',
  sign: 'Something given to point to a promise or truth',
  sin: 'Disobeying God and going against his good way',
  stewardship: 'Taking care of what has been placed in your hands',
  substitute: 'Someone who stands in another person\'s place',
  Tamar: 'The woman in Judah\'s family story through whom Perez was born',
  temptation: 'A pull toward sin or disobedience',
  test: 'A hard moment that reveals trust and obedience',
  tribe: 'A large family group descended from one ancestor',
  truth: 'What is real, right, and faithful',
  violence: 'Cruel force used to hurt others',
  'walked with God': 'Lived in close faith and fellowship with God',
  well: 'A deep hole dug to bring up water',
  wickedness: 'Deep and serious evil',
  wilderness: 'A wild place away from settled towns',
  worship: 'Honoring God with trust, praise, and obedience',
};

const CHAPTER_DATA = {
  3: {
    overview:
      'Genesis 3 tells how the serpent questioned God\'s word, how the man and woman disobeyed, and how sin brought fear, blame, pain, and exile. Yet God also spoke the first promise that the woman\'s offspring would crush the serpent.',
    keywords: ['serpent', 'sin', 'curse', 'Eden', 'exile', 'offspring', 'promise'],
    summary:
      'The serpent twisted God\'s command, the woman and the man ate the forbidden fruit, and their shame showed that sin had entered human life. God judged the serpent, the woman, and the man, but he also promised that the woman\'s offspring would defeat the serpent. God clothed Adam and Eve and sent them out of Eden, guarding the way to the tree of life.',
    lessons: [
      ['God tells the truth', 'The serpent questioned God\'s word, but God\'s warning came to pass.'],
      ['Sin brings sorrow', 'Disobedience brought fear, hiding, blame, pain, and exile.'],
      ['God still gives hope', 'Even while judging sin, God promised that evil would not win forever.'],
    ],
    memory: 15,
    notes: {
      1: 'Keep the serpent\'s question clear: he challenges God\'s word without making the scene silly.',
      6: 'Show the temptation through sight, desire, and action without excusing the disobedience.',
      15: 'This is often called the first gospel promise. Keep the serpent, woman, offspring, head, and heel details in order.',
      21: 'God clothes Adam and Eve after judgment. Do not add details about sacrifice that the verse itself does not state.',
      24: 'Keep the guarded way to the tree of life clear without making the scene needlessly frightening.',
    },
    crossRefs: { 1: ['2 Corinthians 11:3', 'Revelation 12:9'], 15: ['Romans 16:20', 'Hebrews 2:14'], 21: ['Genesis 22:8'], 24: ['Revelation 22:14'] },
  },
  4: {
    overview:
      'Genesis 4 follows Adam and Eve\'s sons, Cain and Abel. Sin moves from the garden into the family, but the Lord still speaks, warns, judges, and protects life from revenge.',
    keywords: ['sin', 'offering', 'curse', 'mercy', 'generation'],
    summary:
      'Cain and Abel brought offerings to the Lord, but Cain became angry when the Lord accepted Abel and not him. God warned Cain that sin was crouching nearby, but Cain killed his brother. The Lord judged Cain and sent him away, yet marked him so others would not kill him. The chapter also traces Cain\'s family and ends with Seth and Enosh, when people began calling on the Lord\'s name.',
    lessons: [
      ['God sees the heart', 'The Lord cared about more than the gift; he cared about the person bringing it.'],
      ['Anger must be ruled', 'God warned Cain before Cain acted, showing that sin should not be welcomed or followed.'],
      ['Life belongs to God', 'Abel\'s blood mattered to God, and even Cain\'s life was not left to revenge.'],
    ],
    memory: 7,
    notes: {
      7: 'Keep the image of sin crouching at the door; it helps children picture temptation without treating sin as a toy.',
      10: 'The blood crying from the ground is a vivid justice image, not a literal conversation to overexplain.',
      26: 'Calling on the Lord\'s name points to worship and dependence on God.',
    },
    crossRefs: { 4: ['Hebrews 11:4'], 7: ['James 1:14-15'], 10: ['Hebrews 12:24'], 26: ['Romans 10:13'] },
  },
  5: {
    overview:
      'Genesis 5 gives the family line from Adam to Noah. The repeated words about death show that Genesis 3 was true, while Enoch\'s walk with God and Noah\'s birth keep hope in the story.',
    keywords: ['genealogy', 'generation', 'death', 'walked with God', 'comfort'],
    summary:
      'The chapter lists the generations from Adam through Seth down to Noah. Again and again, each person lives, has children, and dies, showing the heavy result of sin. Enoch stands out because he walked with God, and God took him. Lamech names Noah with hope that God will bring comfort from the painful ground.',
    lessons: [
      ['God remembers families', 'Names and years matter because real people lived before God.'],
      ['Sin brought death', 'The repeated deaths show that God\'s warning in Eden was true.'],
      ['Walking with God matters', 'Enoch\'s life shines as a short but beautiful witness in a long list.'],
    ],
    memory: 24,
    notes: {
      3: 'Keep the image-of-God family line connected to Genesis 1 without implying people stopped bearing God\'s image after sin.',
      24: 'Avoid adding details about Enoch beyond the text; the verse says he walked with God and God took him.',
      29: 'Noah\'s name is tied to hope for comfort from painful work under the curse.',
    },
    crossRefs: { 1: ['Genesis 1:26-27'], 24: ['Hebrews 11:5'], 29: ['Genesis 3:17-19'] },
  },
  6: {
    overview:
      'Genesis 6 shows human wickedness spreading across the earth, but Noah finds favor with the Lord. God announces judgment by flood and commands Noah to build an ark for rescue.',
    keywords: ['wickedness', 'grief', 'favor', 'righteous', 'covenant', 'ark'],
    summary:
      'The Lord saw that human evil had become great and that every thought of the heart was bent toward evil. God was grieved and announced judgment, but Noah found favor. Noah walked with God in a corrupt world. God told him that a flood would come and gave careful instructions for the ark, promising to establish his covenant with Noah and preserve life inside the ark.',
    lessons: [
      ['God grieves evil', 'Wickedness is not small to God; it brings real sorrow and judgment.'],
      ['Grace appears before rescue', 'Noah found favor before the ark was built.'],
      ['God gives exact rescue', 'The ark was not Noah\'s idea; God gave the plan and the promise.'],
    ],
    memory: 8,
    notes: {
      5: 'Do not soften the spread of evil into mere bad choices; the verse speaks about the heart and thoughts.',
      8: 'Noah finding favor means grace from God, not Noah earning rescue apart from God.',
      18: 'The covenant promise begins before the flood; keep God as the one who establishes it.',
    },
    crossRefs: { 5: ['Matthew 24:37-39'], 8: ['Ephesians 2:8'], 18: ['1 Peter 3:20'] },
  },
  7: {
    overview:
      'Genesis 7 tells how Noah entered the ark with his family and the animals, just as the Lord commanded. The floodwaters rose over the earth, and the Lord preserved those inside the ark.',
    keywords: ['ark', 'judgment', 'obedience', 'flood', 'preserved'],
    summary:
      'The Lord told Noah to enter the ark, bringing his family and the animals God named. Noah obeyed. Rain fell, the deep waters burst open, and the waters lifted the ark above the earth. Everything outside that breathed died, but Noah and those with him in the ark remained alive.',
    lessons: [
      ['God keeps his word', 'The flood came just as God had said.'],
      ['Obedience followed faith', 'Noah entered the ark and did what the Lord commanded.'],
      ['God preserves life', 'Judgment was real, and so was the rescue God provided.'],
    ],
    memory: 5,
    notes: {
      1: 'The Lord calls Noah into the ark; keep the action personal and commanded by God.',
      16: 'The Lord shutting Noah in is a protective action, not a detail to skip.',
      23: 'Keep both realities together: judgment outside the ark and preservation inside it.',
    },
    crossRefs: { 5: ['Hebrews 11:7'], 16: ['Matthew 24:37-39'], 23: ['2 Peter 2:5'] },
  },
  8: {
    overview:
      'Genesis 8 shows God remembering Noah as the floodwaters go down. Noah leaves the ark, worships the Lord, and God promises the ordered seasons will continue while the earth remains.',
    keywords: ['remembered', 'ark', 'altar', 'offering', 'promise'],
    summary:
      'God remembered Noah and all the living creatures in the ark, and the waters began to recede. Noah waited, sent out birds, and finally came out with his family and the animals when God commanded. Noah built an altar and worshiped. The Lord promised that he would not again curse the ground in the same way and that seedtime, harvest, cold, heat, summer, winter, day, and night would not cease while the earth remains.',
    lessons: [
      ['God remembers with action', 'When God remembered Noah, he moved the story toward rescue.'],
      ['Waiting can be faithful', 'Noah waited for God\'s timing before leaving the ark.'],
      ['Worship follows rescue', 'Noah\'s first recorded act after leaving the ark was worship.'],
    ],
    memory: 22,
    notes: {
      1: 'In the Bible, God remembering means he acts faithfully; it does not mean he had forgotten.',
      20: 'Keep Noah\'s altar as worship after rescue, not as payment for rescue.',
      22: 'This promise concerns the continuing order of seasons while the earth remains.',
    },
    crossRefs: { 1: ['Exodus 2:24'], 20: ['Psalm 116:17'], 22: ['Jeremiah 33:20'] },
  },
  9: {
    overview:
      'Genesis 9 gives God\'s covenant with Noah, his family, and every living creature. The rainbow is given as a sign, and Noah\'s later family failure shows that sin still remains after the flood.',
    keywords: ['covenant', 'rainbow', 'blood', 'blessing', 'curse'],
    summary:
      'God blessed Noah and his sons, gave commands about life and blood, and made a covenant that floodwaters would never again destroy all flesh. The rainbow became the sign of that covenant. Later Noah became drunk, Ham dishonored him, and Noah spoke words about Canaan, Shem, and Japheth. The chapter ends with Noah\'s death.',
    lessons: [
      ['God values life', 'Human life is protected because people are made in God\'s image.'],
      ['God gives signs to remember', 'The rainbow points to God\'s covenant promise.'],
      ['Sin still needs mercy', 'Even after judgment and rescue, Noah\'s family still needed God\'s grace.'],
    ],
    memory: 13,
    notes: {
      6: 'Keep the image of God as the reason human life must not be murdered.',
      13: 'The rainbow is God\'s covenant sign, not a magical object.',
      25: 'Handle Noah\'s curse carefully and do not add later racial meanings that are not in the text.',
    },
    crossRefs: { 6: ['Genesis 1:26-27', 'James 3:9'], 13: ['Ezekiel 1:28'], 17: ['Isaiah 54:9'] },
  },
  10: {
    overview:
      'Genesis 10 lists the peoples who came from Noah\'s sons after the flood. It shows nations spreading across lands, languages, clans, and families under God\'s rule.',
    keywords: ['genealogy', 'nation', 'clan', 'language', 'kingdom'],
    summary:
      'The descendants of Japheth, Ham, and Shem spread into many lands after the flood. The chapter names peoples, territories, and cities, including Nimrod, Babel, Nineveh, Canaanite groups, and the family line of Shem. The table of nations prepares readers for Babel in the next chapter and for God\'s later promise to bless all families through Abraham.',
    lessons: [
      ['God sees all nations', 'The Bible names many peoples because the nations matter to God.'],
      ['Families become peoples', 'Genesis shows families growing into clans, lands, languages, and nations.'],
      ['The story is moving toward blessing', 'The nations named here will matter when God promises blessing through Abraham.'],
    ],
    memory: 32,
    notes: {
      11: 'Keep the movement visual: from Shinar, Nimrod goes into Assyria and builds cities such as Nineveh.',
      25: 'Peleg\'s name is connected with division in his days; do not overexplain beyond the verse.',
      32: 'The chapter closes by summarizing families, nations, and the spread after the flood.',
    },
    crossRefs: { 11: ['Jonah 1:2'], 25: ['Genesis 11:8-9'], 32: ['Acts 17:26'] },
  },
  11: {
    overview:
      'Genesis 11 tells of Babel, where people tried to build a city and tower for their own name. The Lord confused their language and scattered them, then the chapter narrows to Shem\'s line and Abram\'s family.',
    keywords: ['Babel', 'language', 'scattered', 'genealogy', 'promise'],
    summary:
      'The people of the earth shared one language and gathered in Shinar to build a city and tower, wanting to make a name for themselves and avoid being scattered. The Lord came down, confused their language, and scattered them over the earth. The rest of the chapter traces Shem\'s family line down to Terah, Abram, Nahor, Haran, Sarai, and Lot, preparing for God\'s call of Abram.',
    lessons: [
      ['Pride tries to make its own name', 'Babel shows people seeking greatness apart from God.'],
      ['God rules over human plans', 'The Lord confused the language and scattered the people.'],
      ['God keeps the promise moving', 'The genealogy leads quietly toward Abram and the covenant story.'],
    ],
    memory: 9,
    notes: {
      4: 'Keep the people\'s motive clear: they wanted a name for themselves and feared being scattered.',
      7: 'Use careful wording for God\'s speech; do not make the Lord sound confused or threatened.',
      30: 'Sarai being barren matters for the coming promise of Isaac.',
    },
    crossRefs: { 4: ['Genesis 1:28'], 9: ['Acts 2:6'], 30: ['Genesis 18:11'] },
  },
};

const CHAPTER_TOPICS = {
  12: ['God calls Abram to leave home, promises land, offspring, and blessing, and brings him to Canaan before Abram goes down to Egypt during famine.', ['promise', 'blessing', 'famine', 'altar'], 2],
  13: ['Abram and Lot separate peacefully, Lot chooses the Jordan plain near Sodom, and the Lord renews his promise of land and offspring to Abram.', ['promise', 'land', 'peace', 'offspring'], 15],
  14: ['Warring kings capture Lot, Abram rescues him, Melchizedek blesses Abram, and Abram refuses to become rich through the king of Sodom.', ['king', 'rescue', 'priest', 'blessing', 'oath'], 20],
  15: ['The Lord promises Abram offspring as many as the stars, counts Abram\'s faith as righteousness, and makes a covenant about the land.', ['promise', 'faith', 'righteousness', 'covenant', 'offspring'], 6],
  16: ['Sarai gives Hagar to Abram, Hagar bears Ishmael, and the Lord sees Hagar in her suffering and speaks promises about her son.', ['barren', 'promise', 'angel', 'Ishmael', 'mercy'], 13],
  17: ['God gives Abram the covenant sign of circumcision, changes Abram and Sarai\'s names, and promises that Sarah will bear Isaac.', ['covenant', 'promise', 'offspring', 'sign', 'Isaac'], 7],
  18: ['The Lord appears to Abraham by the oaks of Mamre, promises Sarah a son, and lets Abraham plead for mercy before Sodom is judged.', ['promise', 'hospitality', 'mercy', 'judgment', 'prayer'], 14],
  19: ['Angels rescue Lot from Sodom before judgment falls, but Lot\'s family suffers from delay, looking back, fear, and further sin.', ['angel', 'judgment', 'rescue', 'mercy', 'sin'], 29],
  20: ['Abraham again says Sarah is his sister, God protects Sarah in Abimelech\'s house, and Abimelech returns her with gifts.', ['protection', 'truth', 'mercy', 'prayer'], 6],
  21: ['Isaac is born as God promised, Hagar and Ishmael are preserved in the wilderness, and Abraham makes peace at Beersheba.', ['promise', 'Isaac', 'wilderness', 'well', 'oath'], 1],
  22: ['God tests Abraham, Abraham offers Isaac in obedience, the Lord provides a ram, and the covenant promise is confirmed again.', ['test', 'obedience', 'sacrifice', 'provision', 'promise'], 14],
  23: ['Sarah dies, and Abraham buys the cave of Machpelah as a burial place in Canaan, showing his faith in God\'s promised land.', ['death', 'burial', 'land', 'promise'], 19],
  24: ['Abraham\'s servant seeks a wife for Isaac, the Lord guides him to Rebekah, and Rebekah willingly leaves to become Isaac\'s wife.', ['prayer', 'guidance', 'kindness', 'promise', 'Rebekah'], 27],
  25: ['Abraham dies, Ishmael\'s family is listed, and Isaac and Rebekah have Esau and Jacob, whose conflict begins even before birth.', ['generation', 'promise', 'birthright', 'Jacob', 'Esau'], 23],
  26: ['The Lord renews the promise to Isaac, protects Rebekah, blesses Isaac in Gerar, and gives peace after disputes over wells.', ['promise', 'blessing', 'well', 'peace', 'oath'], 24],
  27: ['Jacob deceives Isaac and receives the blessing meant for Esau, bringing grief, anger, and danger into the family.', ['deceit', 'blessing', 'firstborn', 'family', 'fear'], 29],
  28: ['Jacob leaves home, dreams of a stairway reaching to heaven, hears God renew the promise, and names the place Bethel.', ['dream', 'promise', 'presence', 'Bethel', 'worship'], 15],
  29: ['Jacob arrives in Haran, marries Leah and Rachel through Laban\'s deceit, and the Lord sees Leah and gives her sons.', ['deceit', 'marriage', 'Leah', 'Rachel', 'mercy'], 35],
  30: ['Jacob\'s family grows through Rachel, Leah, Bilhah, and Zilpah, and God blesses Jacob\'s flocks as he serves Laban.', ['children', 'blessing', 'envy', 'labor', 'providence'], 22],
  31: ['Jacob leaves Laban, Rachel hides household idols, Laban pursues, and the families make a covenant boundary before God.', ['idols', 'covenant', 'protection', 'oath', 'journey'], 49],
  32: ['Jacob prepares to meet Esau, prays in fear, sends gifts ahead, and wrestles through the night before God names him Israel.', ['prayer', 'fear', 'mercy', 'Israel', 'blessing'], 28],
  33: ['Jacob and Esau meet in peace, Jacob bows before his brother, and God\'s mercy turns a feared meeting into a reunion.', ['peace', 'mercy', 'reunion', 'gift', 'altar'], 11],
  34: ['Dinah is violated in Shechem, Simeon and Levi answer with deceit and violence, and Jacob fears the trouble brought on his household.', ['violence', 'deceit', 'justice', 'family', 'sin'], 31],
  35: ['God sends Jacob back to Bethel, renews his name Israel and the covenant promises, and the chapter records Rachel and Isaac\'s deaths.', ['Bethel', 'idol', 'promise', 'Israel', 'death'], 11],
  36: ['Esau\'s family line is recorded, showing the chiefs and kings who came from him in the land of Edom.', ['genealogy', 'Esau', 'Edom', 'chief', 'king'], 8],
  37: ['Joseph receives dreams, his brothers hate him, sell him into Egypt, and deceive Jacob with Joseph\'s robe.', ['dream', 'hatred', 'deceit', 'Egypt', 'providence'], 28],
  38: ['Judah\'s family story with Tamar exposes sin, injustice, and confession while preserving the line through Perez.', ['Judah', 'Tamar', 'sin', 'confession', 'offspring'], 26],
  39: ['The Lord is with Joseph in Potiphar\'s house and in prison, even when Joseph is falsely accused for refusing sin.', ['presence', 'temptation', 'faithfulness', 'prison', 'favor'], 21],
  40: ['Joseph interprets the cupbearer\'s and baker\'s dreams in prison, and the dreams come true, but the cupbearer forgets Joseph.', ['dream', 'interpretation', 'prison', 'forgotten', 'God'], 8],
  41: ['God gives Pharaoh troubling dreams, Joseph interprets them, and Pharaoh raises Joseph to govern Egypt during plenty and famine.', ['dream', 'wisdom', 'famine', 'Egypt', 'providence'], 38],
  42: ['Joseph\'s brothers come to Egypt for grain, do not recognize him, and are tested while their guilt over Joseph returns to mind.', ['famine', 'grain', 'guilt', 'testing', 'brothers'], 21],
  43: ['Jacob finally sends Benjamin to Egypt, where Joseph receives his brothers with a feast while still hiding his identity.', ['Benjamin', 'mercy', 'fear', 'feast', 'providence'], 14],
  44: ['Joseph tests his brothers with the silver cup, and Judah offers himself in Benjamin\'s place to spare their father grief.', ['test', 'Judah', 'mercy', 'substitute', 'repentance'], 33],
  45: ['Joseph reveals himself, forgives his brothers, and explains that God sent him ahead to preserve life during famine.', ['forgiveness', 'providence', 'famine', 'family', 'rescue'], 5],
  46: ['God tells Jacob not to fear going to Egypt, Jacob\'s family travels there, and Joseph meets his father with tears.', ['promise', 'Egypt', 'family', 'fear', 'reunion'], 3],
  47: ['Joseph settles his family in Goshen, manages Egypt during famine, and Jacob makes Joseph swear to bury him with his fathers.', ['Goshen', 'famine', 'stewardship', 'oath', 'burial'], 30],
  48: ['Jacob blesses Joseph\'s sons, placing Ephraim before Manasseh, and gives them a place among his own sons.', ['blessing', 'adoption', 'Ephraim', 'Manasseh', 'faith'], 15],
  49: ['Jacob gathers his sons, speaks blessings and warnings over the tribes of Israel, and gives burial instructions before his death.', ['blessing', 'tribe', 'Judah', 'Joseph', 'burial'], 18],
  50: ['Jacob is buried in Canaan, Joseph comforts his fearful brothers with forgiveness, and Joseph dies trusting God to bring Israel back to the promised land.', ['burial', 'forgiveness', 'providence', 'promise', 'faith'], 20],
};

const SPECIAL_NOTES = {
  '12:1': 'Keep God as the one who initiates Abram\'s journey; Abram does not invent the promise.',
  '12:3': 'This promise reaches beyond Abram\'s family to all families of the earth.',
  '15:6': 'Do not turn this into Abram earning righteousness; the verse says he believed and God counted it as righteousness.',
  '17:5': 'The name change marks God\'s promise, not Abram changing himself.',
  '18:14': 'This is a key question about God\'s power; keep it clear and memorable.',
  '22:14': 'The Lord provides the ram; keep the focus on God\'s provision.',
  '28:15': 'God promises presence, protection, return, and faithfulness to his word.',
  '32:28': 'Jacob is renamed Israel after struggling and receiving blessing; do not imply he defeated God by strength.',
  '37:28': 'Keep the sale into Egypt clear without making the brothers\' sin sound harmless.',
  '39:9': 'Joseph names the temptation as sin against God, not only a wrong against Potiphar.',
  '45:5': 'Joseph does not excuse the brothers\' sin, but he sees God\'s saving purpose over it.',
  '49:10': 'Keep Judah\'s ruler promise intact; do not flatten scepter and ruler\'s staff into generic leadership.',
};

const SPECIAL_CROSS_REFS = {
  '12:3': ['Galatians 3:8', 'Genesis 22:18'],
  '15:6': ['Romans 4:3', 'Galatians 3:6'],
  '17:7': ['Luke 1:72-73'],
  '18:14': ['Luke 1:37'],
  '22:14': ['John 1:29'],
  '28:15': ['Hebrews 13:5'],
  '32:28': ['Hosea 12:3-4'],
  '37:28': ['Psalm 105:17'],
  '39:21': ['Acts 7:9'],
  '45:5': ['Genesis 50:20'],
  '49:10': ['Revelation 5:5'],
};

main();

function main() {
  for (const chapterNumber of CHAPTERS) {
    const resourcePath = path.join(CONTENT_DIR, TESTAMENT, BOOK, `chapter-${chapterNumber}.md`);
    const existingResource = fs.existsSync(resourcePath) ? fs.readFileSync(resourcePath, 'utf8') : '';
    const originals = extractOriginals(existingResource);
    const ageTexts = Object.fromEntries(
      AGE_RANGES.map(age => [age, readAgeChapter(chapterNumber, age)])
    );

    const markdown = renderChapter(chapterNumber, originals, ageTexts);
    fs.writeFileSync(resourcePath, markdown, 'utf8');
  }

  console.log(`Reviewed Genesis chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function readAgeChapter(chapterNumber, ageRange) {
  const filePath = path.join(
    CONTENT_DIR,
    'bible-text',
    `ages-${ageRange}`,
    TESTAMENT,
    BOOK,
    `chapter-${chapterNumber}.md`
  );
  return extractVerses(fs.readFileSync(filePath, 'utf8'));
}

function extractVerses(content) {
  const match = content.match(/## Verses\s*\r?\n+([\s\S]*)/i);
  const verseSection = match ? match[1] : content;
  const verseRegex = /^###\s+(Genesis\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+Genesis\s+\d+:\d+\s*$|(?![\s\S]))/gm;
  return [...verseSection.matchAll(verseRegex)].map(item => ({
    reference: item[1].trim(),
    body: cleanText(item[2]),
  }));
}

function extractOriginals(content) {
  const regex = /^###\s+Genesis\s+(\d+):(\d+)[\s\S]*?\*\*Original Reference\*\*:\s*Genesis\s+\d+:\d+\s+-\s*(.*)$/gm;
  const originals = new Map();
  for (const match of content.matchAll(regex)) {
    originals.set(Number(match[2]), cleanText(match[3]));
  }
  return originals;
}

function renderChapter(chapterNumber, originals, ageTexts) {
  const data = getChapterData(chapterNumber);
  const verseCount = Math.max(originals.size, ageTexts['5-7'].length, ageTexts['8-10'].length);
  const parts = [
    `# Genesis Chapter ${chapterNumber}`,
    '',
    '## Book Overview',
    data.overview,
    '',
    '## Important Keywords',
    ...data.keywords.map(keyword => `- ${keyword}: ${VOCABULARY[keyword] || explainKeyword(keyword)}`),
    '',
    '## Verse-by-Verse Translation',
    '',
  ];

  for (let verseNumber = 1; verseNumber <= verseCount; verseNumber += 1) {
    const reference = `Genesis ${chapterNumber}:${verseNumber}`;
    const original = originals.get(verseNumber) || '';
    const age57 = findVerse(ageTexts['5-7'], reference);
    const age810 = findVerse(ageTexts['8-10'], reference);
    const note = getNote(chapterNumber, verseNumber, data);
    const keywords = verseKeywords(`${original} ${age57} ${age810}`, data.keywords);
    const crossRefs = getCrossRefs(chapterNumber, verseNumber, data);

    parts.push(`### ${reference}`);
    parts.push(`**Original Reference**: ${reference} - ${original}`);
    parts.push('');
    parts.push('#### Ages 5-7');
    parts.push(age57);
    parts.push('');
    parts.push('#### Ages 8-10');
    parts.push(age810);
    parts.push('');
    if (note) {
      parts.push('**Translation Notes**:');
      parts.push(note);
      parts.push('');
    }

    if (keywords.length) {
      parts.push('**Key Vocabulary**:');
      for (const keyword of keywords) {
        parts.push(`- ${keyword}: ${VOCABULARY[keyword] || explainKeyword(keyword)}`);
      }
      parts.push('');
    }

    if (crossRefs.length) {
      parts.push('**Cross-References**:');
      for (const crossRef of crossRefs) {
        parts.push(`- ${crossRef}`);
      }
      parts.push('');
    }

    parts.push('---');
    parts.push('');
  }

  parts.push('## Chapter Summary');
  parts.push(data.summary);
  parts.push('');
  parts.push('## Key Lessons for Children');
  data.lessons.forEach(([title, body], index) => {
    parts.push(`${index + 1}. **${title}**: ${body}`);
  });
  parts.push('');
  parts.push('## Memory Verses by Age');
  parts.push('');
  parts.push('### Ages 5-7');
  parts.push(formatMemory(chapterNumber, data.memory, ageTexts['5-7']));
  parts.push('');
  parts.push('### Ages 8-10');
  parts.push(formatMemory(chapterNumber, data.memory, ageTexts['8-10']));
  parts.push('');
  parts.push('## Discussion Questions by Age');
  parts.push('');
  parts.push('### Ages 5-7');
  parts.push('1. What picture did this chapter help you see in your mind?');
  parts.push('2. What did God say, do, promise, or show?');
  parts.push('');
  parts.push('### Ages 8-10');
  parts.push('1. How does this chapter move God\'s promise story forward?');
  parts.push('2. Which detail should be explained carefully so the meaning stays true?');
  parts.push('');
  parts.push('## Prayer');
  parts.push(`Lord, help us read Genesis ${chapterNumber} with humble hearts. Teach us to see what your word says, trust your promises, and tell the story truthfully. Amen.`);
  parts.push('');

  return `${parts.join('\n').replace(/\n+$/g, '')}\n`;
}

function getChapterData(chapterNumber) {
  if (CHAPTER_DATA[chapterNumber]) return CHAPTER_DATA[chapterNumber];
  const topic = CHAPTER_TOPICS[chapterNumber];
  if (!topic) {
    throw new Error(`Missing Genesis ${chapterNumber} review data.`);
  }
  const [summarySeed, keywords, memory] = topic;
  return {
    overview: `Genesis ${chapterNumber} continues the covenant family story. ${summarySeed}`,
    keywords,
    summary: summarySeed,
    lessons: [
      ['God keeps the story moving', 'Even family conflict, journeys, and danger cannot stop the promises God has spoken.'],
      ['People need mercy and truth', 'The chapter shows real human choices while keeping God as the faithful one.'],
      ['Details matter', 'Names, places, blessings, and promises should be kept clear because they carry the story forward.'],
    ],
    memory,
    notes: {},
    crossRefs: {},
  };
}

function findVerse(verses, reference) {
  return verses.find(verse => verse.reference === reference)?.body || '';
}

function getNote(chapterNumber, verseNumber, data) {
  const key = `${chapterNumber}:${verseNumber}`;
  if (SPECIAL_NOTES[key]) return SPECIAL_NOTES[key];
  if (data.notes?.[verseNumber]) return data.notes[verseNumber];

  const base = getChapterData(chapterNumber);
  if (verseNumber === base.memory) {
    return 'This is a good memory verse for the chapter. Preserve the exact promise, warning, or worship focus of the verse.';
  }
  return null;
}

function getCrossRefs(chapterNumber, verseNumber, data) {
  return SPECIAL_CROSS_REFS[`${chapterNumber}:${verseNumber}`] || data.crossRefs?.[verseNumber] || [];
}

function verseKeywords(text, chapterKeywords) {
  const normalized = text.toLowerCase();
  return chapterKeywords
    .filter(keyword => normalized.includes(keyword.toLowerCase()))
    .slice(0, 5);
}

function formatMemory(chapterNumber, verseNumber, verses) {
  const reference = `Genesis ${chapterNumber}:${verseNumber}`;
  const verse = findVerse(verses, reference);
  return `${verse} - ${reference}`;
}

function cleanText(value) {
  return String(value)
    .replace(/Ã¢â‚¬â€/g, '-')
    .replace(/Ã¢â‚¬â€œ/g, '-')
    .replace(/Ã¢â‚¬Å“|Ã¢â‚¬Â/g, '"')
    .replace(/Ã¢â‚¬Ëœ|Ã¢â‚¬â„¢/g, "'")
    .replace(/[â€œâ€]/g, '"')
    .replace(/[â€˜â€™]/g, "'")
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\r?\n/g, '\n')
    .replace(/\s+$/g, '')
    .trim();
}

function explainKeyword(keyword) {
  return 'A key word that helps explain this chapter.';
}
