#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = 'deuteronomy';
const BOOK_NAME = 'Deuteronomy';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 34 }, (_, index) => index + 1);

const BOOK_OVERVIEW =
  'Deuteronomy records Moses speaking to Israel before they enter the land, calling them to remember the Lord and keep his covenant.';

const RESOURCE_DATA = {
  1: {
    summary: 'Moses begins speaking to Israel on the plains of Moab, looking back on the journey from Horeb to Kadesh Barnea. He reminds the people that the Lord gave the land, appointed helpers for judgment, and carried Israel like a father carries his son, but the people refused to trust the Lord and enter.',
    lessons: [
      ['God remembers the whole journey', 'Moses helps Israel look back and see the Lord leading them step by step.'],
      ['Unbelief brings loss', 'Israel saw the good land but would not trust the Lord who carried them.'],
    ],
  },
  2: {
    summary: 'Moses recalls Israel traveling around Edom, Moab, and Ammon, lands the Lord had given to other peoples. When the Lord finally tells Israel to fight Sihon, he gives Israel victory and begins to place the promised land before them.',
    lessons: [
      ['God rules over all lands', 'Israel may not take what the Lord gave to Edom, Moab, and Ammon.'],
      ['God gives victory in his time', 'Israel waits until the Lord commands them to move against Sihon.'],
    ],
  },
  3: {
    summary: 'The Lord gives Israel victory over Og king of Bashan and gives land east of the Jordan to Reuben, Gad, and half of Manasseh. Moses asks to enter the land, but the Lord says no, tells him to see it from the mountain, and commands him to strengthen Joshua.',
    lessons: [
      ['God keeps his promise of victory', 'Even strong kings fall when the Lord gives them into Israel\'s hand.'],
      ['God prepares the next leader', 'Joshua is strengthened before he leads Israel across the Jordan.'],
    ],
  },
  4: {
    summary: 'Moses calls Israel to listen, obey, and remember the day the Lord spoke from the fire at Horeb. He warns them not to make idols, teaches that the Lord alone is God, and sets apart cities of refuge east of the Jordan.',
    lessons: [
      ['God is not an idol', 'Israel heard the Lord\'s voice but saw no shape to copy or worship.'],
      ['God shows mercy and authority', 'The Lord reveals himself, warns his people, and provides refuge for those who need justice.'],
    ],
  },
  5: {
    summary: 'Moses repeats the covenant words the Lord spoke from the fire, beginning with the Lord\'s rescue from Egypt. Israel hears the Ten Commandments again and remembers how the people asked Moses to stand between them and the Lord because they feared the fire and voice.',
    lessons: [
      ['God\'s commands begin with rescue', 'The Lord first says he brought Israel out of slavery before giving the covenant words.'],
      ['God\'s word is holy and serious', 'The fire, cloud, darkness, and voice show that the Lord must be heard with reverence.'],
    ],
  },
  6: {
    summary: 'Moses teaches Israel to love the Lord with all their heart, all their life, and all their strength. Parents are to keep the Lord\'s words close, teach them to their children, and remember that the Lord rescued them from Egypt.',
    lessons: [
      ['Love for God fills the whole life', 'The Lord calls for heart, life, strength, home, road, morning, and night.'],
      ['Children need the rescue story', 'Israel must answer their children by telling how the Lord brought them out of Egypt.'],
    ],
  },
  7: {
    summary: 'Moses tells Israel to stay separate from the nations\' idols and trust the Lord as they enter the land. The Lord chose Israel not because they were large or strong, but because of his love and the covenant promise he made to their fathers.',
    lessons: [
      ['God loves by grace', 'Israel is chosen because the Lord loves and keeps his promise.'],
      ['Idols must not be welcomed', 'The Lord warns Israel not to bring false worship into their homes.'],
    ],
  },
  8: {
    summary: 'Moses tells Israel to remember the wilderness, where the Lord humbled them, fed them with manna, and taught them that people live by every word from the Lord. He warns them not to forget God when they eat, build, prosper, and enjoy the good land.',
    lessons: [
      ['God teaches dependence', 'Manna taught Israel that life comes from the Lord, not from bread alone.'],
      ['Blessings must lead to thanks', 'When Israel has homes, food, and herds, they must remember the Lord who gave them power.'],
    ],
  },
  9: {
    summary: 'Moses warns Israel not to think they receive the land because of their own righteousness. He reminds them of the golden calf, their many rebellions, and his intercession when he pleaded with the Lord for the people he had redeemed.',
    lessons: [
      ['God\'s gift is not earned by pride', 'Israel must not pretend they deserve the land by their own goodness.'],
      ['Intercession matters', 'Moses pleads for the people by remembering the Lord\'s promise and rescue.'],
    ],
  },
  10: {
    summary: 'The Lord gives Moses new tablets after the golden calf, and Moses places them in the ark. Then Moses teaches that the Lord requires Israel to honor him, walk in his ways, love him, serve him, keep his commands, and love the foreigner because the Lord loves the foreigner.',
    lessons: [
      ['God renews covenant mercy', 'The new tablets show that the Lord continues with his people after judgment.'],
      ['God wants heart obedience', 'The Lord calls Israel to love, serve, and remove stubbornness from the heart.'],
    ],
  },
  11: {
    summary: 'Moses calls Israel to love the Lord and remember his mighty works in Egypt, at the sea, and in the wilderness. He sets blessing and curse before them and tells them to store the Lord\'s words in their hearts and teach them to their children.',
    lessons: [
      ['Remembering helps obedience', 'Israel must not forget what their own eyes saw the Lord do.'],
      ['God\'s words belong in the home', 'The commands are to be taught while sitting, walking, lying down, and rising.'],
    ],
  },
  12: {
    summary: 'Moses commands Israel to destroy false worship places and worship the Lord at the place he chooses for his name. Israel may enjoy meat as the Lord blesses them, but they must not eat blood and must not copy the nations\' hateful worship practices.',
    lessons: [
      ['Worship belongs to God\'s direction', 'Israel may not invent worship from the nations around them.'],
      ['Life belongs to God', 'The command not to eat blood teaches Israel that life is precious before the Lord.'],
    ],
  },
  13: {
    summary: 'Moses warns Israel not to follow any prophet, close family member, friend, or town that invites them to worship other gods. Even persuasive signs, private pressure, and whole-city temptation must not pull Israel away from the Lord who rescued them.',
    lessons: [
      ['God alone is to be worshiped', 'No sign or close relationship may lead Israel after false gods.'],
      ['Temptation must be resisted clearly', 'The Lord teaches Israel to reject idolatry before it spreads.'],
    ],
  },
  14: {
    summary: 'Moses reminds Israel that they are the Lord\'s children and a holy people. He gives food laws that mark Israel as set apart and commands tithes that teach worship, joy, and care for Levites, foreigners, children without fathers, and widows.',
    lessons: [
      ['God\'s people belong to him', 'Israel is called the Lord\'s children and treasured people.'],
      ['Worship includes care for the weak', 'The tithe provides for servants of the Lord and vulnerable neighbors.'],
    ],
  },
  15: {
    summary: 'Moses teaches Israel about the seventh-year release of debts, open-handed mercy to the poor, generous treatment of Hebrew servants, and firstborn animals given to the Lord. The people are to remember they were once slaves in Egypt and the Lord redeemed them.',
    lessons: [
      ['Mercy should be open-handed', 'The Lord commands Israel not to close their heart to a poor brother.'],
      ['Rescued people show generosity', 'Israel must remember their own slavery when releasing servants.'],
    ],
  },
  16: {
    summary: 'Moses teaches Israel to keep Passover, the Feast of Weeks, and the Feast of Booths at the place the Lord chooses. He also commands judges to do justice without favoritism or bribes and warns against worship objects the Lord hates.',
    lessons: [
      ['The feasts remember rescue and provision', 'Israel\'s calendar teaches them to rejoice before the Lord.'],
      ['Justice matters in God\'s land', 'Judges must not twist what is right for money or favoritism.'],
    ],
  },
  17: {
    summary: 'Moses warns against unacceptable sacrifices and idolatry, gives instructions for hard cases brought to priests and judges, and describes the future king. The king must not multiply horses, wives, or wealth, but must write and read God\'s law so his heart stays humble.',
    lessons: [
      ['Leaders stand under God\'s word', 'Even a king must read the law and obey the Lord.'],
      ['Justice must be careful', 'Hard cases are to be brought before appointed servants and handled with reverence.'],
    ],
  },
  18: {
    summary: 'Moses explains the portion for priests and Levites, forbids occult practices, and promises that the Lord will raise up a prophet like Moses. Israel must listen to the true prophet and reject anyone who speaks falsely in the Lord\'s name.',
    lessons: [
      ['God provides true words', 'The promised prophet shows that Israel does not need forbidden spiritual practices.'],
      ['False words must be tested', 'A prophet who speaks in the Lord\'s name must speak what comes to pass.'],
    ],
  },
  19: {
    summary: 'Moses commands cities of refuge so someone who kills without meaning to may run to safety until judgment is heard. He also protects boundary markers, requires more than one witness, and commands truthful justice against false witnesses.',
    lessons: [
      ['Justice distinguishes accident from murder', 'The refuge cities protect life while the truth is examined.'],
      ['Truth needs faithful witnesses', 'One person alone cannot decide a serious case.'],
    ],
  },
  20: {
    summary: 'Moses gives Israel laws for battle, calling them to trust the Lord rather than fear horses, chariots, or large armies. He teaches exemptions, peace offers to distant cities, judgment on Canaanite cities, and care for fruit trees during a siege.',
    lessons: [
      ['The Lord is Israel\'s help in battle', 'The priest reminds the people that the Lord goes with them.'],
      ['Even war has boundaries under God', 'Israel may not act without the Lord\'s commands and limits.'],
    ],
  },
  21: {
    summary: 'Moses gives laws about unsolved murder, a captive woman, firstborn rights, a stubborn rebellious son, and burial for someone hanged on a tree. These laws show that bloodshed, family order, vulnerable people, discipline, and the land all matter before the Lord.',
    lessons: [
      ['God sees bloodshed and injustice', 'A hidden death in the land must not be ignored.'],
      ['Power must have limits', 'Even difficult laws protect people from being treated as objects.'],
    ],
  },
  22: {
    summary: 'Moses teaches neighbor-love through returning lost animals, helping fallen animals, building safe roofs, and keeping boundaries in daily life. The chapter also gives serious marriage and sexual justice laws that protect faithfulness, expose false accusation, and punish violence.',
    lessons: [
      ['Love notices a neighbor\'s need', 'Israel must not hide from a lost or fallen animal.'],
      ['God guards marriage and the vulnerable', 'False accusation, adultery, and violence are treated as serious sins.'],
    ],
  },
  23: {
    summary: 'Moses gives laws about the Lord\'s gathered people, camp holiness, escaped servants, money from shameful practices, interest, vows, and eating from a neighbor\'s field. Israel must live as a holy camp because the Lord walks among them.',
    lessons: [
      ['God is present with his people', 'The camp must be holy because the Lord walks there.'],
      ['Promises matter', 'Words spoken to the Lord must be kept with care.'],
    ],
  },
  24: {
    summary: 'Moses gives laws about marriage, loans, kidnapping, skin disease instructions, fair wages, personal responsibility, and gleaning. Israel must treat poor workers, foreigners, children without fathers, and widows with justice because they were once slaves in Egypt.',
    lessons: [
      ['God cares about daily justice', 'Clothes, wages, fields, and courts all belong under the Lord\'s care.'],
      ['Remembering rescue shapes mercy', 'Israel must leave grain, olives, and grapes for vulnerable neighbors.'],
    ],
  },
  25: {
    summary: 'Moses teaches fair limits in punishment, kindness even to a working ox, family duty for a brother who dies without a son, honest weights, and the command to remember Amalek. Justice must be measured, honest, and faithful to the Lord.',
    lessons: [
      ['Justice must not become cruelty', 'Even when someone is punished, the Lord sets limits.'],
      ['Honesty matters to God', 'Cheating with weights and measures is hateful to the Lord.'],
    ],
  },
  26: {
    summary: 'Moses teaches Israel what to say when bringing firstfruits into the land: they must remember Jacob, Egypt, slavery, the Lord\'s rescue, and the good land. He also gives words for the third-year tithe and renews the covenant call to obey as the Lord\'s treasured people.',
    lessons: [
      ['Worship retells God\'s rescue', 'The firstfruits confession remembers the Lord bringing Israel out of Egypt.'],
      ['God\'s people answer with obedience', 'Israel declares the Lord to be their God and receives his covenant word.'],
    ],
  },
  27: {
    summary: 'Moses commands Israel to write the law on stones after crossing the Jordan, build an altar on Mount Ebal, and hear blessings and curses from the mountains. The Levites speak covenant curses, and all the people answer, "Amen."',
    lessons: [
      ['God\'s word must be clear', 'The law is to be written plainly for the people.'],
      ['The people answer the covenant', 'Saying "Amen" means the people agree that the Lord\'s word is right.'],
    ],
  },
  28: {
    summary: 'Moses lays out covenant blessings for listening to the Lord and covenant curses for refusing his voice. The chapter is long and severe because turning from the Lord brings judgment, loss, exile, and deep sorrow, while obedience brings life under his blessing.',
    lessons: [
      ['The Lord\'s covenant is serious', 'Blessing and curse show that Israel\'s response to God matters deeply.'],
      ['Disobedience destroys', 'The warnings are meant to turn Israel away from idolatry and toward life.'],
    ],
  },
  29: {
    summary: 'Moses renews the covenant in Moab with all Israel, including leaders, children, foreigners, and future generations. He warns against hidden idolatry and ends by saying that secret things belong to the Lord, but revealed things belong to Israel so they may obey.',
    lessons: [
      ['The covenant reaches the whole people', 'No one is too important or too small to stand before the Lord.'],
      ['God reveals enough for obedience', 'Israel is not told every secret, but they are given the words they must do.'],
    ],
  },
  30: {
    summary: 'Moses speaks of Israel returning to the Lord after blessing and curse come upon them. The Lord will restore, gather, and change hearts, and Moses places life and death before the people, calling them to love the Lord because he is their life.',
    lessons: [
      ['God gives hope after judgment', 'The Lord promises restoration when his people return to him.'],
      ['Choose life by clinging to the Lord', 'The Lord himself is Israel\'s life and length of days.'],
    ],
  },
  31: {
    summary: 'Moses tells Israel he will not cross the Jordan and publicly strengthens Joshua to lead. He writes the law, commands it to be read every seven years, and receives the Lord\'s warning that Israel will turn away, so the song will stand as a witness.',
    lessons: [
      ['God stays with his people', 'Moses will die, but the Lord goes before Israel and Joshua.'],
      ['God\'s word must be heard by every generation', 'Men, women, children, and foreigners are to hear the law read aloud.'],
    ],
  },
  32: {
    summary: 'Moses sings a covenant song that calls heaven and earth to listen. The song praises the Lord as the faithful Rock, exposes Israel\'s corruption and idolatry, warns of judgment, and still declares that the Lord will show compassion and make atonement for his land and people.',
    lessons: [
      ['The Lord is the faithful Rock', 'God is true and just even when his people are crooked and unfaithful.'],
      ['Songs can witness to truth', 'The song helps future generations remember both warning and mercy.'],
    ],
  },
  33: {
    summary: 'Before his death, Moses blesses the tribes of Israel. He speaks of the Lord coming with majesty, caring for his people, giving help to the tribes, and being Israel\'s eternal refuge underneath them.',
    lessons: [
      ['Blessing comes from the Lord', 'Moses blesses the tribes by looking to God\'s help and care.'],
      ['God is Israel\'s refuge', 'The everlasting arms of the Lord hold his people.'],
    ],
  },
  34: {
    summary: 'Moses climbs Mount Nebo and sees the land the Lord swore to Abraham, Isaac, and Jacob, but he does not enter it. Moses dies, the Lord buries him, Israel mourns, Joshua is filled with wisdom, and the book closes by honoring Moses as the prophet whom the Lord knew face to face.',
    lessons: [
      ['God keeps his promise beyond one servant', 'Moses dies, but the promised land and the Lord\'s plan continue.'],
      ['The Lord knew Moses face to face', 'Moses is remembered for the mighty work the Lord did through him.'],
    ],
  },
};

const STORY_REVISIONS = {
  'Deuteronomy 1:1': {
    '5-7': 'These are the words Moses spoke to all Israel. The people were across the Jordan River in the wilderness, in the open desert land near Suf, between Paran, Tophel, Laban, Hazeroth, and Dizahab.',
    '8-10': 'These are the words Moses spoke to all Israel across the Jordan, in the wilderness, in the Arabah near Suf, between Paran, Tophel, Laban, Hazeroth, and Dizahab.',
  },
  'Deuteronomy 1:2': {
    all: 'The trip from Horeb to Kadesh Barnea by the Mount Seir road takes eleven days.',
  },
  'Deuteronomy 1:3': {
    '5-7': 'Forty years after Israel left Egypt, on the first day of the eleventh month, Moses spoke to the people of Israel everything the Lord had commanded him to say.',
    '8-10': 'In the fortieth year, on the first day of the eleventh month, Moses spoke to the people of Israel everything the Lord had commanded him to tell them.',
  },
  'Deuteronomy 1:4': {
    all: 'This was after Israel had defeated Sihon king of the Amorites, who lived in Heshbon, and Og king of Bashan, who lived in Ashtaroth and was defeated at Edrei.',
  },
  'Deuteronomy 1:5': {
    '5-7': 'Across the Jordan, in the land of Moab, Moses began to explain God\'s law to the people. He said,',
    '8-10': 'Across the Jordan, in the land of Moab, Moses began to explain this law. He said,',
  },
  'Deuteronomy 1:6': {
    '5-7': '"The Lord our God spoke to us at Horeb. He said, \'You have stayed long enough at this mountain.',
    '8-10': '"The Lord our God spoke to us at Horeb, saying, \'You have stayed long enough at this mountain.',
  },
  'Deuteronomy 1:7': {
    all: 'Turn and begin your journey. Go to the hill country of the Amorites and to all the nearby places: the Arabah, the hills, the lowlands, the southern land, the seashore, the land of the Canaanites, and Lebanon, as far as the great Euphrates River.',
  },
  'Deuteronomy 1:8': {
    '5-7': 'See, I have set the land before you. Go in and take the land the Lord swore to give to your ancestors, to Abraham, Isaac, and Jacob, and to their children after them.\' "',
    '8-10': 'See, I have set the land before you. Go in and take the land the Lord swore to give to your ancestors, to Abraham, Isaac, and Jacob, and to their offspring after them.\' "',
  },
  'Deuteronomy 1:9': {
    '5-7': 'Moses said, "At that time I told you, \'I cannot carry the weight of leading all of you by myself.',
    '8-10': 'Moses said, "At that time I told you, \'I cannot carry the burden of leading all of you by myself.',
  },
  'Deuteronomy 1:10': {
    all: 'The Lord your God has made you many, and today you are as many as the stars in the sky.',
  },
  'Deuteronomy 1:18': {
    all: 'At that time I commanded you about everything you should do.',
  },
  'Deuteronomy 1:7': {
    '5-7': 'Turn and begin your journey. Go to the hill country of the Amorites and to all the places nearby: the Arabah, the hills, the lowland, the southern land, the seashore, the land of the Canaanites, and Lebanon, as far as the great river, the Euphrates.',
    '8-10': 'Turn and begin your journey. Go to the hill country of the Amorites and to all the places nearby: the Arabah, the hills, the lowland, the southern land, the seashore, the land of the Canaanites, and Lebanon, as far as the great river, the Euphrates.',
  },
  'Deuteronomy 1:8': {
    '5-7': 'Look, I have set the land in front of you. Go in and take the land the Lord swore to give to your ancestors, to Abraham, Isaac, and Jacob, and to their children after them."',
    '8-10': 'Look, I have set the land in front of you. Go in and take the land the Lord swore to give to your ancestors, to Abraham, Isaac, and Jacob, and to their offspring after them."',
  },
  'Deuteronomy 1:14': {
    all: 'You answered me and said, "What you said is good to do."',
  },
  'Deuteronomy 1:18': {
    all: 'At that time, I commanded you about everything you should do.',
  },
  'Deuteronomy 1:19': {
    '5-7': 'Then we left Horeb and traveled through that great and frightening wilderness. You saw the wide, dry land as we went toward the hill country of the Amorites, just as the Lord our God commanded us. At last we came to Kadesh Barnea.',
    '8-10': 'Then we left Horeb and traveled through that great and frightening wilderness you saw, going toward the hill country of the Amorites as the Lord our God commanded us. At last we came to Kadesh Barnea.',
  },
  'Deuteronomy 1:21': {
    '5-7': '"Look, the Lord your God has set the land in front of you. Go up and take it, just as the Lord, the God of your ancestors, told you. Do not be afraid. Do not lose heart."',
    '8-10': '"Look, the Lord your God has set the land in front of you. Go up and take possession, as the Lord, the God of your ancestors, has told you. Do not be afraid or discouraged."',
  },
  'Deuteronomy 1:22': {
    '5-7': 'Then all of you came near to me and said, "Let us send men ahead of us. They can search the land for us and bring back word about the road we should take and the cities we will reach."',
    '8-10': 'Then all of you came near to me and said, "Let us send men ahead of us. They can search the land for us and bring back word about the road we should take and the cities we will reach."',
  },
  'Deuteronomy 1:23': {
    all: 'That plan seemed good to me, so I chose twelve men from you, one man from each tribe.',
  },
  'Deuteronomy 1:25': {
    '5-7': 'They took some fruit from the land in their hands and brought it down to us. They brought back word and said, "The Lord our God is giving us a good land."',
    '8-10': 'They took some fruit from the land in their hands and brought it down to us. They brought back word and said, "The Lord our God is giving us a good land."',
  },
  'Deuteronomy 1:27': {
    '5-7': 'You complained in your tents and said, "The Lord must hate us. He brought us out of Egypt to hand us over to the Amorites and destroy us."',
    '8-10': 'You complained in your tents and said, "The Lord must hate us. He brought us out of Egypt to hand us over to the Amorites and destroy us."',
  },
  'Deuteronomy 1:28': {
    '5-7': '"Where can we go now? Our brothers have made our hearts melt with fear. They said, \'The people are bigger and taller than we are. The cities are large and walled up to the sky. We even saw the sons of Anak there!\'"',
    '8-10': '"Where can we go now? Our brothers have made our hearts melt with fear. They said, \'The people are bigger and taller than we are. The cities are large and walled up to the sky. We even saw the sons of Anak there!\'"',
  },
  'Deuteronomy 1:31': {
    '5-7': 'In the wilderness, you saw how the Lord your God carried you all the way, like a father carrying his son, until you came to this place.',
    '8-10': 'In the wilderness, you saw how the Lord your God carried you all the way, like a man carries his son, until you came to this place.',
  },
  'Deuteronomy 1:32': {
    all: 'Yet even after all this, you did not believe the Lord your God.',
  },
  'Deuteronomy 1:33': {
    '5-7': 'He went before you on the way. At night he led you with fire, and by day he led you with the cloud, showing you where to walk and where to set up your tents.',
    '8-10': 'He went before you on the way, in fire by night and in the cloud by day, showing you the way to go and where to set up your tents.',
  },
  'Deuteronomy 1:35': {
    all: '"Not one man from this evil generation will see the good land I swore to give your ancestors,',
  },
  'Deuteronomy 1:41': {
    '5-7': 'Then you answered me, "We have sinned against the Lord. We will go up and fight, just as the Lord our God commanded us." So each man strapped on his weapons, and you proudly tried to go up into the hill country.',
    '8-10': 'Then you answered me, "We have sinned against the Lord. We will go up and fight, just as the Lord our God commanded us." So each man strapped on his weapons, and you presumed to go up into the hill country.',
  },
  'Deuteronomy 1:43': {
    '5-7': 'I told you, but you did not listen. You would not obey the Lord\'s command. You proudly went up into the hill country anyway.',
    '8-10': 'I told you, but you did not listen. You rebelled against the Lord\'s command and proudly went up into the hill country.',
  },
  'Deuteronomy 1:46': {
    all: 'So you stayed in Kadesh for many days.',
  },
  'Deuteronomy 1:33': {
    '5-7': 'He went ahead of you on the road to find places for your tents. At night he led you by fire, and by day he led you in the cloud, showing you the way to go.',
    '8-10': 'He went ahead of you on the road to find places for your tents. At night he led you by fire, and by day he led you in the cloud, showing you the way to go.',
  },
  'Deuteronomy 1:35': {
    '5-7': '"Not one of the men of this evil generation will see the good land I swore to give to your ancestors,',
    '8-10': '"Not one of the men of this evil generation will see the good land I swore to give to your ancestors,',
  },
  'Deuteronomy 1:36': {
    '5-7': 'except Caleb son of Jephunneh. He will see it. I will give him and his children the land where he walked, because he followed the Lord completely."',
    '8-10': 'except Caleb son of Jephunneh. He will see it. I will give him and his children the land where he walked, because he followed the Lord completely."',
  },
  'Deuteronomy 1:38': {
    '5-7': 'Joshua son of Nun, who stands before you, will go in there. Encourage him, because he will lead Israel to receive the land.',
    '8-10': 'Joshua son of Nun, who stands before you, will go in there. Encourage him, because he will lead Israel to receive the land as an inheritance.',
  },
  'Deuteronomy 1:41': {
    '5-7': 'Then you answered me, "We have sinned against the Lord. We will go up and fight, just as the Lord our God commanded us." Each of you put on his weapons for battle and thought it would be easy to go up into the hill country.',
    '8-10': 'Then you answered me, "We have sinned against the Lord. We will go up and fight, just as the Lord our God commanded us." Each of you put on his weapons for battle and presumed it would be easy to go up into the hill country.',
  },
  'Deuteronomy 4:9': {
    '5-7': 'Only be careful. Guard your heart closely. Do not forget the things your eyes have seen, and do not let them slip away from your heart all your life. Teach them to your children and to your children\'s children.',
    '8-10': 'Only be careful and guard your heart closely. Do not forget the things your eyes have seen, and do not let them slip from your heart all your life. Teach them to your children and grandchildren.',
  },
  'Deuteronomy 4:1': {
    '5-7': 'Now, Israel, listen to the rules and commands I am teaching you to do. Then you may live, go in, and take the land the Lord, the God of your ancestors, gives you.',
    '8-10': 'Now, Israel, listen to the rules and commands I am teaching you to do. Then you may live, go in, and take the land the Lord, the God of your ancestors, gives you.',
  },
  'Deuteronomy 4:8': {
    all: 'What great nation has rules and commands as righteous as all this law I set before you today?',
  },
  'Deuteronomy 4:12': {
    all: 'The Lord spoke to you from the middle of the fire. You heard the sound of words, but you saw no shape. There was only a voice.',
  },
  'Deuteronomy 4:15': {
    '5-7': 'So guard yourselves carefully. You did not see any shape on the day the Lord spoke to you at Horeb from the middle of the fire.',
    '8-10': 'So guard yourselves carefully, because you saw no form on the day the Lord spoke to you at Horeb from the middle of the fire.',
  },
  'Deuteronomy 4:24': {
    all: 'For the Lord your God is a consuming fire, a jealous God.',
  },
  'Deuteronomy 4:30': {
    '5-7': 'When trouble comes on you, and all these things happen in later days, you will return to the Lord your God and listen to his voice.',
    '8-10': 'When distress comes on you, and all these things happen in later days, you will return to the Lord your God and listen to his voice.',
  },
  'Deuteronomy 4:32': {
    '5-7': 'Ask about the old days before you, from the day God created people on the earth. Search from one end of the sky to the other. Has anything this great ever happened or been heard before?',
    '8-10': 'Ask about the old days before you, from the day God created man on the earth. Search from one end of the sky to the other. Has anything this great ever happened or been heard before?',
  },
  'Deuteronomy 4:34': {
    '5-7': 'Has any god ever tried to take a nation for himself from inside another nation by tests, signs, wonders, war, a mighty hand, an outstretched arm, and great terrors, like everything the Lord your God did for you in Egypt before your eyes?',
    '8-10': 'Has any god ever tried to take a nation for himself from inside another nation by trials, signs, wonders, war, a mighty hand, an outstretched arm, and great terrors, like everything the Lord your God did for you in Egypt before your eyes?',
  },
  'Deuteronomy 4:40': {
    '5-7': 'Keep his rules and commands that I give you today, so things may go well with you and with your children after you, and so you may live long in the land the Lord your God gives you for all time.',
    '8-10': 'Keep his rules and commands that I give you today, so things may go well with you and with your children after you, and so you may live long in the land the Lord your God gives you for all time.',
  },
  'Deuteronomy 5:1': {
    '5-7': 'Moses called to all Israel and said to them, "Hear, Israel, the rules and commands I speak to you today. Learn them and be careful to do them."',
    '8-10': 'Moses called to all Israel and said to them, "Hear, Israel, the rules and commands I speak to you today. Learn them and be careful to do them."',
  },
  'Deuteronomy 5:6': {
    '5-7': '"I am the Lord your God. I brought you out of Egypt, out of the land where you were slaves.',
    '8-10': '"I am the Lord your God, who brought you out of the land of Egypt, out of the house of slavery.',
  },
  'Deuteronomy 5:11': {
    '5-7': '"You must not misuse the name of the Lord your God. The Lord will not treat it as a small thing when someone misuses his name.',
    '8-10': '"You must not misuse the name of the Lord your God, for the Lord will not treat as guiltless anyone who misuses his name.',
  },
  'Deuteronomy 5:18': {
    '5-7': '"You must not break marriage by taking another person\'s husband or wife.',
    '8-10': '"You must not break marriage faithfulness.',
  },
  'Deuteronomy 5:21': {
    '5-7': '"You must not want for yourself your neighbor\'s wife. You must not long to take your neighbor\'s house, field, servants, ox, donkey, or anything that belongs to your neighbor."',
    '8-10': '"You must not covet your neighbor\'s wife. You must not desire your neighbor\'s house, field, servants, ox, donkey, or anything that belongs to your neighbor."',
  },
  'Deuteronomy 5:20': {
    '5-7': '"You must not tell lies against your neighbor."',
    '8-10': '"You must not give false witness against your neighbor."',
  },
  'Deuteronomy 5:22': {
    '5-7': 'The Lord spoke these words to your whole group on the mountain, from the middle of the fire, cloud, and thick darkness, with a great voice. He added no more. He wrote them on two stone tablets and gave them to me.',
    '8-10': 'The Lord spoke these words to your whole assembly on the mountain, from the middle of the fire, cloud, and thick darkness, with a great voice. He added no more. He wrote them on two stone tablets and gave them to me.',
  },
  'Deuteronomy 5:29': {
    '5-7': 'Oh, that their hearts would stay this way, honoring me and keeping all my commands always, so things may go well with them and with their children forever!',
    '8-10': 'Oh, that they would always have hearts like this, honoring me and keeping all my commands, so things may go well with them and with their children forever!',
  },
  'Deuteronomy 6:4': {
    all: 'Hear, Israel: The Lord is our God. The Lord is one.',
  },
  'Deuteronomy 6:5': {
    all: 'You must love the Lord your God with all your heart, all your life, and all your strength.',
  },
  'Deuteronomy 6:1': {
    '5-7': 'These are the commands, rules, and teachings the Lord your God commanded me to teach you, so you may do them in the land you are crossing over to take.',
    '8-10': 'These are the commands, rules, and teachings the Lord your God commanded me to teach you, so you may do them in the land you are crossing over to take.',
  },
  'Deuteronomy 6:2': {
    '5-7': 'Honor the Lord your God and keep all his rules and commands, you, your children, and your grandchildren, all the days of your life, so your days may be long.',
    '8-10': 'Honor the Lord your God and keep all his rules and commands, you, your children, and your grandchildren, all the days of your life, so your days may be long.',
  },
  'Deuteronomy 6:3': {
    '5-7': 'So listen, Israel, and be careful to do what God says. Then things may go well with you, and you may grow into a great people in a land flowing with milk and honey, just as the Lord, the God of your ancestors, promised.',
    '8-10': 'So listen, Israel, and be careful to do what God says. Then things may go well with you, and you may grow greatly in a land flowing with milk and honey, just as the Lord, the God of your ancestors, promised.',
  },
  'Deuteronomy 6:6': {
    all: 'These words I command you today must be on your heart.',
  },
  'Deuteronomy 6:7': {
    '5-7': 'Teach these words carefully to your children. Talk about them when you sit in your house, when you walk on the road, when you lie down, and when you get up.',
    '8-10': 'Teach these words carefully to your children. Talk about them when you sit in your house, when you walk along the road, when you lie down, and when you rise up.',
  },
  'Deuteronomy 6:8': {
    '5-7': 'Tie them on your hand as a sign, and let them be like a reminder between your eyes.',
    '8-10': 'Tie them on your hand as a sign, and let them be like reminders between your eyes.',
  },
  'Deuteronomy 6:9': {
    all: 'Write them on the doorposts of your house and on your gates.',
  },
  'Deuteronomy 6:10': {
    '5-7': 'The Lord your God will bring you into the land he swore to give to your ancestors, to Abraham, Isaac, and Jacob. You will live in large, good cities you did not build,',
    '8-10': 'The Lord your God will bring you into the land he swore to give to your ancestors, to Abraham, Isaac, and Jacob. You will live in great, good cities you did not build,',
  },
  'Deuteronomy 6:11': {
    '5-7': 'houses full of good things you did not fill, wells you did not dig, and vineyards and olive trees you did not plant. When you eat and are full,',
    '8-10': 'houses full of good things you did not fill, wells you did not dig, and vineyards and olive trees you did not plant. When you eat and are full,',
  },
  'Deuteronomy 6:12': {
    all: 'be careful that you do not forget the Lord, who brought you out of Egypt, out of the land where you were slaves.',
  },
  'Deuteronomy 6:13': {
    '5-7': 'Honor the Lord your God. Serve him, and make your promises in his name.',
    '8-10': 'Honor the Lord your God. Serve him, and swear by his name.',
  },
  'Deuteronomy 6:15': {
    '5-7': 'The Lord your God is among you, and he is a jealous God. If you go after other gods, the Lord your God\'s anger will burn against you, and he will destroy you from the face of the earth.',
    '8-10': 'The Lord your God is among you, and he is a jealous God. If you go after other gods, the Lord your God\'s anger will burn against you, and he will destroy you from the face of the earth.',
  },
  'Deuteronomy 6:1': {
    '5-7': 'These are the commands, rules, and teachings the Lord your God commanded me to teach you, so you may do them in the land you are crossing over to take.',
    '8-10': 'These are the commands, rules, and teachings the Lord your God commanded me to teach you, so you may do them in the land you are crossing over to take.',
  },
  'Deuteronomy 6:2': {
    '5-7': 'Honor the Lord your God by keeping all his rules and commands that I command you, you, your son, and your grandson, all the days of your life, so your days may be long.',
    '8-10': 'Honor the Lord your God by keeping all his rules and commands that I command you, you, your son, and your grandson, all the days of your life, so your days may be long.',
  },
  'Deuteronomy 6:8': {
    '5-7': 'Tie them as a sign on your hand, and let them be like a reminder between your eyes.',
    '8-10': 'Tie them as a sign on your hand, and let them be like a reminder between your eyes.',
  },
  'Deuteronomy 6:11': {
    '5-7': 'There will be houses full of good things you did not fill, water pits you did not dig, and vineyards and olive trees you did not plant. When you eat and are full,',
    '8-10': 'There will be houses full of good things you did not fill, cisterns you did not dig, and vineyards and olive trees you did not plant. When you eat and are full,',
  },
  'Deuteronomy 6:15': {
    '5-7': 'because the Lord your God, who is among you, is a jealous God. If you do, the Lord your God\'s anger will burn against you, and he will destroy you from the face of the earth.',
    '8-10': 'because the Lord your God, who is among you, is a jealous God. If you do, the Lord your God\'s anger will burn against you, and he will destroy you from the face of the earth.',
  },
  'Deuteronomy 6:17': {
    '5-7': 'Carefully keep the commands of the Lord your God, and the covenant teachings and rules he commanded you.',
    '8-10': 'Carefully keep the commands of the Lord your God, and the covenant teachings and rules he commanded you.',
  },
  'Deuteronomy 6:19': {
    '5-7': 'and to drive out all your enemies before you, just as the Lord has spoken.',
    '8-10': 'and to drive out all your enemies before you, just as the Lord has spoken.',
  },
  'Deuteronomy 6:20': {
    '5-7': 'In days to come, your son may ask you, "What do these covenant teachings, rules, and commands from the Lord our God mean?"',
    '8-10': 'In days to come, your son may ask you, "What do the covenant teachings, rules, and commands that the Lord our God commanded you mean?"',
  },
  'Deuteronomy 6:24': {
    all: 'The Lord commanded us to do all these rules and to honor the Lord our God for our good always, so he might keep us alive, as we are today.',
  },
  'Deuteronomy 6:25': {
    '5-7': 'It will be counted as righteousness for us if we are careful to do all these commands before the Lord our God, just as he commanded us."',
    '8-10': 'It will be righteousness for us if we are careful to do all these commands before the Lord our God, just as he commanded us."',
  },
  'Deuteronomy 7:7': {
    all: 'The Lord did not set his love on you or choose you because you were more numerous than other peoples, for you were the fewest of all peoples.',
  },
  'Deuteronomy 7:8': {
    '5-7': 'No, the Lord chose you because he loved you and kept the promise he swore to your ancestors. With his strong hand, the Lord brought you out and bought you back from slavery, from Pharaoh king of Egypt.',
    '8-10': 'The Lord chose you because he loved you and kept the oath he swore to your ancestors. With a strong hand, the Lord brought you out and redeemed you from slavery, from Pharaoh king of Egypt.',
  },
  'Deuteronomy 7:9': {
    '5-7': 'Know therefore that the Lord your God is God. He is the faithful God, keeping covenant and faithful love to a thousand generations of those who love him and keep his commands.',
    '8-10': 'Know therefore that the Lord your God is God. He is the faithful God, keeping covenant and faithful love to a thousand generations of those who love him and keep his commands.',
  },
  'Deuteronomy 7:25': {
    '5-7': 'You must burn the carved idols of their gods with fire. Do not want the silver or gold on them for yourself, or it will trap you. Those idols are hateful to the Lord your God.',
    '8-10': 'You must burn the carved images of their gods with fire. Do not covet the silver or gold on them or take it for yourself, or it will trap you. Those idols are detestable to the Lord your God.',
  },
  'Deuteronomy 7:26': {
    '5-7': 'Do not bring a hateful idol into your house and become set apart for destruction like it. You must hate it completely, because it is set apart for destruction.',
    '8-10': 'Do not bring a detestable idol into your house and become set apart for destruction like it. You must utterly detest it and hate it, because it is set apart for destruction.',
  },
  'Deuteronomy 8:3': {
    '5-7': 'He humbled you and let you be hungry. Then he fed you with manna, food you and your ancestors had not known, to teach you that people do not live by bread only. People live by every word that comes from the mouth of the Lord.',
    '8-10': 'He humbled you and let you be hungry. Then he fed you with manna, which you and your ancestors had not known, to teach you that man does not live by bread alone, but by every word that comes from the mouth of the Lord.',
  },
  'Deuteronomy 8:4': {
    '5-7': 'Your clothes did not wear out on you, and your feet did not swell during those forty years.',
    '8-10': 'Your clothes did not wear out on you, and your feet did not swell during those forty years.',
  },
  'Deuteronomy 8:17': {
    '5-7': 'Do not say in your heart, "My own power and my own strong hand made me rich."',
    '8-10': 'Do not say in your heart, "My power and the strength of my hand made me this wealth."',
  },
  'Deuteronomy 8:18': {
    '5-7': 'Remember the Lord your God, because he gives you power to gain wealth. He does this to keep the covenant promise he swore to your ancestors, as it is today.',
    '8-10': 'Remember the Lord your God, because he gives you power to gain wealth, so that he may keep the covenant he swore to your ancestors, as it is today.',
  },
  'Deuteronomy 8:9': {
    '5-7': 'It is a land where you will eat bread without running out, and you will lack nothing. Its stones have iron, and you can dig copper from its hills.',
    '8-10': 'It is a land where you will eat bread without scarcity, and you will lack nothing. Its stones have iron, and you can dig copper from its hills.',
  },
  'Deuteronomy 9:17': {
    '5-7': 'So I took hold of the two tablets and threw them from my two hands. I broke them before your eyes.',
    '8-10': 'So I took hold of the two tablets and threw them from my two hands. I broke them before your eyes.',
  },
  'Deuteronomy 10:5': {
    '5-7': 'Then I turned and came down from the mountain. I put the tablets in the ark I had made, and there they are, just as the Lord commanded me.',
    '8-10': 'Then I turned and came down from the mountain. I put the tablets in the ark I had made, and there they are, just as the Lord commanded me.',
  },
  'Deuteronomy 10:18': {
    '5-7': 'He does justice for children without fathers and for women whose husbands died, and he loves the foreigner by giving him food and clothing.',
    '8-10': 'He does justice for children without fathers and for widows, and he loves the foreigner by giving him food and clothing.',
  },
  'Deuteronomy 10:21': {
    '5-7': 'He is your praise, and he is your God. Your own eyes saw him do great and awesome things for you.',
    '8-10': 'He is your praise, and he is your God. Your own eyes saw him do great and awesome things for you.',
  },
  'Deuteronomy 10:12': {
    '5-7': 'Now, Israel, what does the Lord your God ask from you? Honor the Lord your God, walk in all his ways, love him, serve the Lord your God with all your heart and all your life,',
    '8-10': 'Now, Israel, what does the Lord your God require from you? Honor the Lord your God, walk in all his ways, love him, and serve the Lord your God with all your heart and all your life,',
  },
  'Deuteronomy 10:19': {
    '5-7': 'So love the foreigner living among you, because you were foreigners in the land of Egypt.',
    '8-10': 'So love the foreigner, because you were foreigners in the land of Egypt.',
  },
  'Deuteronomy 11:18': {
    '5-7': 'Put these words of mine in your heart and in your whole self. Tie them as a sign on your hand, and let them be like a reminder between your eyes.',
    '8-10': 'Put these words of mine in your heart and in your whole self. Tie them as a sign on your hand, and let them be like reminders between your eyes.',
  },
  'Deuteronomy 11:19': {
    '5-7': 'Teach them to your children. Talk about them when you sit in your house, when you walk on the road, when you lie down, and when you get up.',
    '8-10': 'Teach them to your children. Talk about them when you sit in your house, when you walk along the road, when you lie down, and when you rise up.',
  },
  'Deuteronomy 12:2': {
    '5-7': 'You must completely destroy all the places where the nations you will drive out served their gods: on the high mountains, on the hills, and under every green tree.',
    '8-10': 'You must completely destroy all the places where the nations you will dispossess served their gods: on the high mountains, on the hills, and under every green tree.',
  },
  'Deuteronomy 12:31': {
    '5-7': 'You must not worship the Lord your God in their way. They have done every hateful thing the Lord hates for their gods. They even burn their sons and daughters in the fire for their gods.',
    '8-10': 'You must not worship the Lord your God in their way. They have done for their gods every detestable thing the Lord hates. They even burn their sons and daughters in the fire for their gods.',
  },
  'Deuteronomy 13:5': {
    '5-7': 'That prophet or dreamer must be put to death, because he spoke rebellion against the Lord your God, who brought you out of Egypt and bought you back from slavery. He tried to pull you away from the path the Lord your God commanded you to walk. So you must remove the evil from among you.',
    '8-10': 'That prophet or dreamer must be put to death, because he spoke rebellion against the Lord your God, who brought you out of Egypt and redeemed you from slavery. He tried to pull you away from the path the Lord your God commanded you to walk. So you must remove the evil from among you.',
  },
  'Deuteronomy 13:9': {
    '5-7': 'Instead, you must put him to death. Your hand must be first against him, and afterward the hands of all the people.',
    '8-10': 'Instead, you must put him to death. Your hand must be first against him, and afterward the hands of all the people.',
  },
  'Deuteronomy 13:14': {
    '5-7': 'then you must ask, search, and look carefully. If the report is true and certain that this hateful thing has happened among you,',
    '8-10': 'then you must ask, investigate, and search carefully. If the report is true and certain that this detestable thing has happened among you,',
  },
  'Deuteronomy 13:17': {
    '5-7': 'Nothing God said must be destroyed may stick to your hand. Then the Lord may turn from his fierce anger, show you mercy, have compassion on you, and multiply you, as he swore to your ancestors.',
    '8-10': 'Nothing set apart for destruction must cling to your hand. Then the Lord may turn from his fierce anger, show you mercy, have compassion on you, and multiply you, as he swore to your ancestors.',
  },
  'Deuteronomy 14:1': {
    '5-7': 'You are the children of the Lord your God. You must not cut yourselves or shave the front of your heads for the dead.',
    '8-10': 'You are the children of the Lord your God. You must not cut yourselves or shave the front of your heads for the dead.',
  },
  'Deuteronomy 14:3': {
    '5-7': 'You must not eat anything the Lord says is hateful for you to eat.',
    '8-10': 'You must not eat any detestable thing.',
  },
  'Deuteronomy 15:7': {
    '5-7': 'If there is a poor person among you, one of your brothers in any of your towns in the land the Lord your God gives you, do not harden your heart or close your hand against your poor brother.',
    '8-10': 'If there is a poor person among you, one of your brothers in any of your towns in the land the Lord your God gives you, do not harden your heart or close your hand against your poor brother.',
  },
  'Deuteronomy 15:8': {
    '5-7': 'Open your hand wide to him. Lend him enough for what he needs.',
    '8-10': 'Open your hand wide to him. Lend him enough for what he needs.',
  },
  'Deuteronomy 15:10': {
    '5-7': 'Give to him generously, and do not let your heart be sad when you give. Because of this, the Lord your God will bless you in all your work and everything you do.',
    '8-10': 'Give to him generously, and do not let your heart be sad when you give. Because of this, the Lord your God will bless you in all your work and everything you do.',
  },
  'Deuteronomy 16:20': {
    all: 'Follow justice, only justice, so you may live and receive the land the Lord your God gives you.',
  },
  'Deuteronomy 17:18': {
    '5-7': 'When the king sits on his throne, he must write for himself a copy of this law in a book, from the law kept by the priests, the Levites.',
    '8-10': 'When the king sits on his royal throne, he must write for himself a copy of this law in a book, from the law kept by the priests, the Levites.',
  },
  'Deuteronomy 17:19': {
    '5-7': 'It must stay with him, and he must read it all the days of his life, so he may learn to honor the Lord his God and carefully keep all the words of this law and these rules.',
    '8-10': 'It must stay with him, and he must read it all the days of his life, so he may learn to honor the Lord his God and carefully keep all the words of this law and these rules.',
  },
  'Deuteronomy 18:10': {
    '5-7': 'No one among you may burn a son or daughter as an offering, tell the future by forbidden signs, practice magic, read omens, or use sorcery.',
    '8-10': 'No one among you may burn a son or daughter as an offering, practice divination, tell fortunes, read omens, or practice sorcery.',
  },
  'Deuteronomy 18:15': {
    '5-7': 'The Lord your God will raise up for you a prophet like me from among your brothers. You must listen to him.',
    '8-10': 'The Lord your God will raise up for you a prophet like me from among your brothers. You must listen to him.',
  },
  'Deuteronomy 19:2': {
    '5-7': 'then set apart three cities for yourselves in the middle of the land the Lord your God gives you to take.',
    '8-10': 'then set apart three cities for yourselves in the middle of the land the Lord your God gives you to take.',
  },
  'Deuteronomy 19:4': {
    '5-7': 'This is the rule for someone who kills another person without meaning to and may run there and live: he did not hate the person before.',
    '8-10': 'This is the rule for someone who kills another person without meaning to and may flee there and live: he did not hate the person before.',
  },
  'Deuteronomy 19:15': {
    '5-7': 'One witness alone must not stand against someone for any wrong or any sin. A matter must be confirmed by two or three witnesses.',
    '8-10': 'One witness alone must not stand against someone for any wrong or any sin. A matter must be confirmed by two or three witnesses.',
  },
  'Deuteronomy 20:1': {
    '5-7': 'When you go out to battle against your enemies and see horses, chariots, and more people than you have, do not be afraid of them. The Lord your God, who brought you up out of Egypt, is with you.',
    '8-10': 'When you go out to battle against your enemies and see horses, chariots, and more people than you have, do not be afraid of them. The Lord your God, who brought you up out of Egypt, is with you.',
  },
  'Deuteronomy 20:3': {
    '5-7': 'He must say to them, "Hear, Israel! Today you are going near for battle against your enemies. Do not let your heart grow weak. Do not be afraid, panic, or tremble because of them,',
    '8-10': 'He must say to them, "Hear, Israel! Today you are going near for battle against your enemies. Do not let your heart grow weak. Do not be afraid, panic, or tremble because of them,',
  },
  'Deuteronomy 20:4': {
    all: 'because the Lord your God goes with you to fight for you against your enemies and to save you."',
  },
  'Deuteronomy 21:10': {
    all: 'When you go out to battle against your enemies, and the Lord your God gives them into your hand and you take captives,',
  },
  'Deuteronomy 21:13': {
    '5-7': 'She must take off the clothes she wore when she was captured and stay in your house. She may mourn her father and mother for a full month. After that, you may marry her, and she will be your wife.',
    '8-10': 'She must take off the clothes she wore when she was captured and stay in your house. She may mourn her father and mother for a full month. After that, you may marry her, and she will be your wife.',
  },
  'Deuteronomy 21:14': {
    '5-7': 'If you are not pleased with her, you must let her go wherever she wishes. You must not sell her for money or treat her as a slave, because you have taken her into marriage.',
    '8-10': 'If you are not pleased with her, you must let her go wherever she wishes. You must not sell her for money or treat her as a slave, because you have humbled her.',
  },
  'Deuteronomy 21:23': {
    '5-7': 'his body must not stay on the tree overnight. You must bury him the same day, because anyone hanged on a tree is cursed by God. Do not make the land the Lord your God gives you not clean before him.',
    '8-10': 'his body must not stay on the tree overnight. You must bury him the same day, because anyone hanged on a tree is cursed by God. Do not make the land the Lord your God gives you unclean.',
  },
  'Deuteronomy 22:1': {
    '5-7': 'If you see your brother\'s ox or sheep wandering away, you must not pretend you did not see it. You must bring it back to your brother.',
    '8-10': 'If you see your brother\'s ox or sheep wandering away, you must not hide yourself from them. You must bring them back to your brother.',
  },
  'Deuteronomy 22:4': {
    '5-7': 'If you see your brother\'s donkey or ox fallen on the road, you must not pretend you did not see it. You must help him lift it up again.',
    '8-10': 'If you see your brother\'s donkey or ox fallen on the road, you must not hide yourself from them. You must help him lift it up again.',
  },
  'Deuteronomy 22:5': {
    '5-7': 'A woman must not wear men\'s clothing, and a man must not put on women\'s clothing, because the Lord your God hates people confusing what he has made.',
    '8-10': 'A woman must not wear men\'s clothing, and a man must not put on women\'s clothing, because whoever does these things is detestable to the Lord your God.',
  },
  'Deuteronomy 22:7': {
    '5-7': 'Let the mother bird go, but you may take the young for yourself, so things may go well with you and your days may be long.',
    '8-10': 'Let the mother bird go, but you may take the young for yourself, so things may go well with you and your days may be long.',
  },
  'Deuteronomy 22:8': {
    '5-7': 'When you build a new house, make a railing around your roof. Then no one will fall from it and bring bloodguilt on your house.',
    '8-10': 'When you build a new house, make a railing around your roof, so no one falls from it and brings bloodguilt on your house.',
  },
  'Deuteronomy 22:9': {
    '5-7': 'Do not plant your vineyard with two kinds of seed, or the whole harvest will be treated as set apart and not for ordinary use.',
    '8-10': 'Do not plant your vineyard with two kinds of seed, or the whole harvest will be treated as set apart and not for ordinary use.',
  },
  'Deuteronomy 22:13': {
    '5-7': 'If a man takes a wife, acts with her as a husband, and then hates her,',
    '8-10': 'If a man takes a wife, has relations with her as her husband, and then hates her,',
  },
  'Deuteronomy 22:14': {
    '5-7': 'and accuses her with shameful words, gives her a bad name, and says, "I married this woman, but I did not find proof that she had kept herself for marriage,"',
    '8-10': 'and accuses her with shameful words, gives her a bad name, and says, "I married this woman, but I did not find proof that she had kept herself for marriage,"',
  },
  'Deuteronomy 22:15': {
    '5-7': 'then the young woman\'s father and mother must bring the proof that she had kept herself for marriage to the elders at the city gate.',
    '8-10': 'then the young woman\'s father and mother must bring the proof that she had kept herself for marriage to the elders at the city gate.',
  },
  'Deuteronomy 22:17': {
    '5-7': 'He has accused her with shameful words and said he found no proof that she had kept herself for marriage. But here is the proof for my daughter." Then they must spread the cloth before the elders of the city.',
    '8-10': 'He has accused her with shameful words and said he found no proof that she had kept herself for marriage. But here is the proof for my daughter." Then they must spread the cloth before the elders of the city.',
  },
  'Deuteronomy 22:21': {
    '5-7': 'then they must bring the young woman to the door of her father\'s house, and the men of her city must throw stones at her until she dies, because she has done a disgraceful sin in Israel by being unfaithful in her father\'s house. So you must remove the evil from among you.',
    '8-10': 'then they must bring the young woman to the door of her father\'s house, and the men of her city must throw stones at her until she dies, because she has done a disgraceful sin in Israel by being sexually unfaithful in her father\'s house. So you must remove the evil from among you.',
  },
  'Deuteronomy 22:22': {
    '5-7': 'If a man is found acting with another man\'s wife in the way only marriage should have, then both of them must die, the man and the woman. So you must remove the evil from Israel.',
    '8-10': 'If a man is found having relations with another man\'s wife, then both of them must die, the man and the woman. So you must remove the evil from Israel.',
  },
  'Deuteronomy 22:23': {
    '5-7': 'If a young woman is promised to be married and has kept herself for marriage, and a man finds her in the city and acts with her as only marriage should,',
    '8-10': 'If a young woman is promised to be married and has kept herself for marriage, and a man finds her in the city and has relations with her,',
  },
  'Deuteronomy 22:24': {
    '5-7': 'then you must bring them both to the gate of that city and throw stones at them until they die: the young woman because she did not cry out for help in the city, and the man because he dishonored his neighbor\'s future wife. So you must remove the evil from among you.',
    '8-10': 'then you must bring them both to the gate of that city and throw stones at them until they die: the young woman because she did not cry out for help in the city, and the man because he violated his neighbor\'s future wife. So you must remove the evil from among you.',
  },
  'Deuteronomy 22:25': {
    '5-7': 'But if the man finds the young woman promised to be married out in the field, and he overpowers her and forces her in that way, then only the man who did this must die.',
    '8-10': 'But if the man finds the young woman promised to be married out in the field, and he overpowers her and harms her in that way, then only the man who did this to her must die.',
  },
  'Deuteronomy 22:26': {
    '5-7': 'Do nothing to the young woman. She has not done a sin worthy of death. This matter is like a man attacking his neighbor and killing him.',
    '8-10': 'Do nothing to the young woman. She has not done a sin worthy of death. This matter is like a man attacking his neighbor and killing him.',
  },
  'Deuteronomy 22:27': {
    '5-7': 'The man found her in the field. The young woman promised to be married cried out, but there was no one there to save her.',
    '8-10': 'The man found her in the field. The young woman promised to be married cried out, but there was no one there to save her.',
  },
  'Deuteronomy 22:28': {
    '5-7': 'If a man finds a young woman who has kept herself for marriage, who is not promised to be married, and he takes hold of her and acts with her as only marriage should, and they are found,',
    '8-10': 'If a man finds a young woman who has kept herself for marriage, who is not promised to be married, and he takes hold of her and has relations with her, and they are found,',
  },
  'Deuteronomy 22:29': {
    '5-7': 'then the man must give the young woman\'s father fifty silver pieces. She will be his wife because of what he did to her, and he may not divorce her all his days.',
    '8-10': 'then the man must give the young woman\'s father fifty silver pieces. She will be his wife, because he violated her. He may not divorce her all his days.',
  },
  'Deuteronomy 23:1': {
    '5-7': 'A man with a serious injury to his private body parts must not join the Lord\'s gathered people.',
    '8-10': 'A man whose private parts have been badly injured or cut off must not join the Lord\'s gathered people.',
  },
  'Deuteronomy 23:14': {
    '5-7': 'The Lord your God walks in the middle of your camp to rescue you and hand your enemies over to you. So your camp must be holy, so he does not see anything shameful among you and turn away from you.',
    '8-10': 'The Lord your God walks in the middle of your camp to rescue you and hand your enemies over to you. So your camp must be holy, so he does not see anything unclean among you and turn away from you.',
  },
  'Deuteronomy 23:18': {
    '5-7': 'You must not bring money earned from shameful idol-worship sin into the house of the Lord your God for any promise, because that money is hateful to the Lord your God.',
    '8-10': 'You must not bring money earned from shameful sin into the house of the Lord your God for any vow, because that money is hateful to the Lord your God.',
  },
  'Deuteronomy 23:23': {
    '5-7': 'You must keep and do what you promised. Whatever you freely promised to the Lord your God with your mouth, you must do.',
    '8-10': 'You must keep and do what you promised. Whatever you freely promised to the Lord your God with your mouth, you must do.',
  },
  'Deuteronomy 24:1': {
    '5-7': 'If a man marries a woman and later is not pleased with her because he finds something shameful, and he writes her a divorce paper, gives it to her, and sends her out of his house,',
    '8-10': 'If a man marries a woman and later is not pleased with her because he finds something shameful, and he writes her a divorce paper, gives it to her, and sends her out of his house,',
  },
  'Deuteronomy 24:4': {
    '5-7': 'then her first husband, who sent her away, may not take her again to be his wife after she has belonged to another marriage. That would be hateful to the Lord. You must not bring sin on the land the Lord your God gives you as an inheritance.',
    '8-10': 'then her first husband, who sent her away, may not take her again to be his wife after she has belonged to another marriage. That would be hateful to the Lord. You must not bring sin on the land the Lord your God gives you as an inheritance.',
  },
  'Deuteronomy 24:12': {
    '5-7': 'If he is poor, you must not go to sleep while still keeping what he gave as the item for the loan.',
    '8-10': 'If he is poor, you must not go to sleep while still keeping what he gave as the item for the loan.',
  },
  'Deuteronomy 24:13': {
    '5-7': 'You must return the item to him when the sun goes down, so he may sleep in his clothing and bless you. This will be counted as righteousness for you before the Lord your God.',
    '8-10': 'You must return the item to him when the sun goes down, so he may sleep in his clothing and bless you. This will be counted as righteousness for you before the Lord your God.',
  },
  'Deuteronomy 24:17': {
    '5-7': 'Do not twist justice for a foreigner or a child without a father, and do not take a widow\'s clothing as an item for a loan.',
    '8-10': 'Do not twist justice for a foreigner or a child without a father, and do not take a widow\'s clothing as an item for a loan.',
  },
  'Deuteronomy 24:19': {
    '5-7': 'When you harvest your field and forget a bundle of grain there, do not go back to get it. Leave it for the foreigner, the child without a father, and the widow, so the Lord your God may bless you in all the work of your hands.',
    '8-10': 'When you harvest your field and forget a bundle of grain there, do not go back to get it. Leave it for the foreigner, the child without a father, and the widow, so the Lord your God may bless you in all the work of your hands.',
  },
  'Deuteronomy 25:4': {
    '5-7': 'Do not cover the ox\'s mouth while it walks over grain to separate it.',
    '8-10': 'Do not muzzle the ox while it treads out the grain.',
  },
  'Deuteronomy 25:13': {
    '5-7': 'Do not keep two different weights in your bag, one heavy and one light, for cheating.',
    '8-10': 'Do not keep two different weights in your bag, one heavy and one light, for cheating.',
  },
  'Deuteronomy 25:16': {
    '5-7': 'Everyone who does dishonest things like this is hateful to the Lord your God.',
    '8-10': 'Everyone who does dishonest things like this is detestable to the Lord your God.',
  },
  'Deuteronomy 26:5': {
    '5-7': 'You must answer before the Lord your God, "My father was a wandering Aramean. He went down into Egypt with only a few people and lived there. There he became a great, mighty, and many-numbered nation.',
    '8-10': 'You must answer before the Lord your God, "My father was a wandering Aramean. He went down into Egypt with only a few people and lived there. There he became a great, mighty, and many-numbered nation.',
  },
  'Deuteronomy 26:8': {
    all: 'The Lord brought us out of Egypt with a mighty hand, an outstretched arm, great terror, signs, and wonders.',
  },
  'Deuteronomy 27:8': {
    all: 'You must write all the words of this law very clearly on the stones."',
  },
  'Deuteronomy 27:15': {
    '5-7': '"Cursed is the person who makes a carved idol or an idol made from melted metal, a hateful thing to the Lord, made by a craftsman\'s hands, and sets it up in secret." All the people must answer and say, "Amen."',
    '8-10': '"Cursed is the person who makes a carved idol or an idol made from melted metal, a detestable thing to the Lord, made by a craftsman\'s hands, and sets it up in secret." All the people must answer and say, "Amen."',
  },
  'Deuteronomy 27:20': {
    '5-7': '"Cursed is anyone who dishonors his father\'s marriage." All the people must say, "Amen."',
    '8-10': '"Cursed is anyone who has relations with his father\'s wife, because he dishonors his father\'s bed." All the people must say, "Amen."',
  },
  'Deuteronomy 27:21': {
    '5-7': '"Cursed is anyone who acts with an animal in a way God forbids." All the people must say, "Amen."',
    '8-10': '"Cursed is anyone who has relations with any animal." All the people must say, "Amen."',
  },
  'Deuteronomy 27:22': {
    '5-7': '"Cursed is anyone who acts with his sister in the way only marriage should have, whether she is his father\'s daughter or his mother\'s daughter." All the people must say, "Amen."',
    '8-10': '"Cursed is anyone who has relations with his sister, whether she is his father\'s daughter or his mother\'s daughter." All the people must say, "Amen."',
  },
  'Deuteronomy 27:23': {
    '5-7': '"Cursed is anyone who acts with his mother-in-law in the way only marriage should have." All the people must say, "Amen."',
    '8-10': '"Cursed is anyone who has relations with his mother-in-law." All the people must say, "Amen."',
  },
  'Deuteronomy 28:1': {
    '5-7': 'If you carefully listen to the voice of the Lord your God and do all his commands that I give you today, the Lord your God will set you high above all the nations of the earth.',
    '8-10': 'If you carefully listen to the voice of the Lord your God and do all his commands that I command you today, the Lord your God will set you high above all the nations of the earth.',
  },
  'Deuteronomy 28:21': {
    '5-7': 'The Lord will make terrible sickness cling to you until you are destroyed from the land you are entering to take.',
    '8-10': 'The Lord will make terrible sickness cling to you until you are destroyed from the land you are entering to take.',
  },
  'Deuteronomy 28:30': {
    '5-7': 'You will be promised a wife, but another man will take her by force. You will build a house, but you will not live in it. You will plant a vineyard, but you will not enjoy its fruit.',
    '8-10': 'You will be promised a wife, but another man will take her by force. You will build a house, but you will not live in it. You will plant a vineyard, but you will not enjoy its fruit.',
  },
  'Deuteronomy 28:53': {
    '5-7': 'In the terrible siege, hunger will become so awful that people will even eat their own children, the sons and daughters the Lord your God gave them.',
    '8-10': 'In the siege and distress from your enemies, hunger will become so terrible that you will eat your own children, the sons and daughters the Lord your God gave you.',
  },
  'Deuteronomy 28:54': {
    '5-7': 'Even the tender, gentle man among you will look coldly at his brother, the wife he loves, and the children he still has,',
    '8-10': 'Even the tender, delicate man among you will look coldly at his brother, the wife he loves, and the children he still has,',
  },
  'Deuteronomy 28:55': {
    '5-7': 'and he will not share with any of them, because nothing will be left during the terrible siege in all your towns.',
    '8-10': 'and he will not share with any of them from the flesh of his children, because nothing will be left during the siege and distress in all your towns.',
  },
  'Deuteronomy 28:56': {
    '5-7': 'Even the tender, gentle woman among you, so gentle she would hardly put her foot on the ground, will look coldly at the husband she loves, her son, and her daughter,',
    '8-10': 'Even the tender, delicate woman among you, so delicate she would hardly put her foot on the ground, will look coldly at the husband she loves, her son, and her daughter,',
  },
  'Deuteronomy 28:57': {
    '5-7': 'and even at her newborn child and her other children, because hunger will be so terrible that she will hide and eat in secret during the siege and distress in your towns.',
    '8-10': 'and even at her newborn child and her other children, because hunger will be so terrible that she will eat them secretly during the siege and distress in your towns.',
  },
  'Deuteronomy 28:58': {
    '5-7': 'If you are not careful to do all the words of this law written in this book, and if you do not honor this glorious and fearful name, the Lord your God,',
    '8-10': 'If you are not careful to do all the words of this law written in this book, and if you do not honor this glorious and fearful name, the Lord your God,',
  },
  'Deuteronomy 28:65': {
    '5-7': 'Among those nations you will find no ease, and your feet will find no resting place. There the Lord will give you a trembling heart, tired eyes, and a weary life.',
    '8-10': 'Among those nations you will find no ease, and your feet will find no resting place. There the Lord will give you a trembling heart, failing eyes, and a weary life.',
  },
  'Deuteronomy 29:29': {
    all: 'The secret things belong to the Lord our God, but the things he has revealed belong to us and to our children forever, so that we may do all the words of this law.',
  },
  'Deuteronomy 30:11': {
    '5-7': 'This command I give you today is not too hard for you, and it is not far away.',
    '8-10': 'This command I give you today is not too hard for you, and it is not far away.',
  },
  'Deuteronomy 30:14': {
    '5-7': 'No, the word is very near you. It is in your mouth and in your heart, so you can do it.',
    '8-10': 'No, the word is very near you. It is in your mouth and in your heart, so you can do it.',
  },
  'Deuteronomy 30:19': {
    '5-7': 'I call heaven and earth to witness against you today. I have set life and death, blessing and curse, in front of you. Choose life, so you and your children may live.',
    '8-10': 'I call heaven and earth to witness against you today. I have set life and death, blessing and curse, before you. Choose life, so you and your offspring may live.',
  },
  'Deuteronomy 31:6': {
    '5-7': 'Be strong and brave. Do not be afraid or tremble before them, because the Lord your God goes with you. He will not leave you or forsake you.',
    '8-10': 'Be strong and courageous. Do not be afraid or tremble before them, because the Lord your God goes with you. He will not leave you or forsake you.',
  },
  'Deuteronomy 31:8': {
    '5-7': 'The Lord himself goes before you. He will be with you. He will not leave you or forsake you. Do not be afraid or discouraged.',
    '8-10': 'The Lord himself goes before you. He will be with you. He will not leave you or forsake you. Do not be afraid or discouraged.',
  },
  'Deuteronomy 31:12': {
    '5-7': 'Gather the people, the men, women, little ones, and foreigners living in your towns, so they may hear, learn, honor the Lord your God, and carefully do all the words of this law.',
    '8-10': 'Gather the people, the men, women, little ones, and foreigners living in your towns, so they may hear, learn, honor the Lord your God, and carefully do all the words of this law.',
  },
  'Deuteronomy 32:4': {
    '5-7': 'He is the Rock. His work is perfect. All his ways are justice. He is a faithful God who does no wrong. He is right and true.',
    '8-10': 'He is the Rock. His work is perfect. All his ways are justice. He is a faithful God who does no wrong. He is righteous and true.',
  },
  'Deuteronomy 32:11': {
    '5-7': 'Like an eagle stirring up its nest and hovering over its young, spreading out its wings, taking them up, and carrying them on its feathers,',
    '8-10': 'Like an eagle stirring up its nest and hovering over its young, spreading out its wings, taking them up, and carrying them on its feathers,',
  },
  'Deuteronomy 32:12': {
    all: 'the Lord alone led him. No foreign god was with him.',
  },
  'Deuteronomy 33:27': {
    '5-7': 'The eternal God is your home of safety. Underneath you are his everlasting arms. He drives the enemy out before you and says, "Destroy!"',
    '8-10': 'The eternal God is your refuge. Underneath you are his everlasting arms. He drives the enemy out before you and says, "Destroy!"',
  },
  'Deuteronomy 34:1': {
    '5-7': 'Moses went up from the plains of Moab to Mount Nebo, to the top of Pisgah across from Jericho. The Lord showed him the whole land: Gilead as far as Dan,',
    '8-10': 'Moses went up from the plains of Moab to Mount Nebo, to the top of Pisgah across from Jericho. The Lord showed him the whole land: Gilead as far as Dan,',
  },
  'Deuteronomy 34:5': {
    '5-7': 'So Moses, the servant of the Lord, died there in the land of Moab, just as the Lord had said.',
    '8-10': 'So Moses, the servant of the Lord, died there in the land of Moab, according to the Lord\'s word.',
  },
  'Deuteronomy 34:6': {
    '5-7': 'The Lord buried him in the valley in the land of Moab, near Beth Peor. To this day, no one knows where Moses was buried.',
    '8-10': 'The Lord buried him in the valley in the land of Moab, near Beth Peor. To this day, no one knows where Moses was buried.',
  },
  'Deuteronomy 34:10': {
    '5-7': 'Since then, no prophet has risen in Israel like Moses, whom the Lord knew face to face.',
    '8-10': 'Since then, no prophet has risen in Israel like Moses, whom the Lord knew face to face.',
  },
};

Object.assign(STORY_REVISIONS, {
  'Deuteronomy 11:2': {
    '5-7': 'Remember today that I am not speaking to your children, who did not know or see the Lord your God\'s discipline, his greatness, his mighty hand, and his outstretched arm.',
    '8-10': 'Remember today that I am not speaking to your children, who did not know or see the Lord your God\'s discipline, his greatness, his mighty hand, and his outstretched arm.',
  },
  'Deuteronomy 11:7': {
    all: 'Your own eyes have seen all the great work the Lord did.',
  },
  'Deuteronomy 11:29': {
    all: 'When the Lord your God brings you into the land you are entering to take, you must place the blessing on Mount Gerizim and the curse on Mount Ebal.',
  },
  'Deuteronomy 11:32': {
    all: 'Be careful to do all the rules and commands I set before you today.',
  },
  'Deuteronomy 12:3': {
    all: 'Break down their altars, smash their stone pillars, and burn their Asherah poles with fire. Cut down the carved idols of their gods and wipe out their names from that place.',
  },
  'Deuteronomy 12:7': {
    all: 'There, before the Lord your God, you and your households must eat and rejoice in all the work of your hands, because the Lord your God has blessed you.',
  },
  'Deuteronomy 12:11': {
    '5-7': 'Then bring everything I command you to the place the Lord your God chooses for his name to dwell: your burned offerings, sacrifices, tithes, gifts you lift before the Lord, and all the special promises you choose to make to the Lord.',
    '8-10': 'Then bring everything I command you to the place the Lord your God chooses for his name to dwell: your burned offerings, sacrifices, tithes, offerings lifted before the Lord, and all the choice vows you make to the Lord.',
  },
  'Deuteronomy 13:2': {
    all: 'and the sign or wonder he told you about comes true, and he says, "Let us go after other gods you have not known, and let us serve them,"',
  },
  'Deuteronomy 13:15': {
    all: 'then you must strike the people of that city with the sword. You must completely destroy the city, all that is in it, and its animals.',
  },
  'Deuteronomy 14:12': {
    all: 'But these are the birds you must not eat: the eagle, the vulture, and the osprey;',
  },
  'Deuteronomy 14:23': {
    '5-7': 'Eat before the Lord your God in the place he chooses for his name to dwell. Bring the tenth of your grain, new grape juice, oil, and the firstborn of your herd and flock, so you may learn to honor the Lord your God always.',
    '8-10': 'Eat before the Lord your God in the place he chooses for his name to dwell. Bring the tithe of your grain, new wine, oil, and the firstborn of your herd and flock, so you may learn to honor the Lord your God always.',
  },
  'Deuteronomy 15:2': {
    all: 'This is how the release will work: every lender must release what he lent to his neighbor. He must not demand payment from his neighbor or brother, because the Lord\'s release has been announced.',
  },
  'Deuteronomy 16:16': {
    '5-7': 'Three times a year, all your males must appear before the Lord your God in the place he chooses: at the Feast of Bread Made Without Yeast, the Feast of Weeks, and the Feast of Booths. They must not appear before the Lord empty-handed.',
    '8-10': 'Three times a year, all your males must appear before the Lord your God in the place he chooses: at the Feast of Unleavened Bread, the Feast of Weeks, and the Feast of Booths. They must not appear before the Lord empty-handed.',
  },
  'Deuteronomy 18:19': {
    all: 'Whoever will not listen to my words that he speaks in my name, I myself will call that person to account.',
  },
  'Deuteronomy 18:20': {
    all: 'But the prophet who proudly speaks a word in my name that I did not command him to speak, or who speaks in the name of other gods, that prophet must die."',
  },
  'Deuteronomy 21:4': {
    all: 'The elders of that city must bring the young cow down to a valley with flowing water, a valley that has not been plowed or planted, and break the young cow\'s neck there.',
  },
  'Deuteronomy 21:6': {
    all: 'All the elders of the city nearest the killed man must wash their hands over the young cow whose neck was broken in the valley.',
  },
  'Deuteronomy 21:16': {
    all: 'when he gives his sons their inheritance, he must not treat the son of the loved wife as the firstborn instead of the true firstborn, the son of the unloved wife.',
  },
  'Deuteronomy 22:3': {
    all: 'Do the same with his donkey, his clothing, and every lost thing your brother has lost and you have found. Do not hide from helping.',
  },
  'Deuteronomy 22:5': {
    '5-7': 'A woman must not wear men\'s clothing, and a man must not put on women\'s clothing, because the Lord your God hates this confusion.',
    '8-10': 'A woman must not wear men\'s clothing, and a man must not put on women\'s clothing, because whoever does these things is detestable to the Lord your God.',
  },
  'Deuteronomy 22:12': {
    '5-7': 'Make tassels for yourselves on the four corners of the outer coat you use to cover yourself.',
    '8-10': 'Make tassels for yourselves on the four corners of the cloak you use to cover yourself.',
  },
  'Deuteronomy 22:24': {
    '5-7': 'then you must bring them both to the gate of that city and throw stones at them until they die: the young woman because she did not cry out for help in the city, and the man because he dishonored his neighbor\'s future wife. So you must remove the evil from among you.',
    '8-10': 'then you must bring them both to the gate of that city and throw stones at them until they die: the young woman because she did not cry out for help in the city, and the man because he violated his neighbor\'s future wife. So you must remove the evil from among you.',
  },
  'Deuteronomy 22:25': {
    '5-7': 'But if the man finds the young woman promised to be married out in the field, and he overpowers her and forces her in that way, then only the man who did this must die.',
    '8-10': 'But if the man finds the young woman promised to be married out in the field, and he overpowers her and violates her, then only the man who violated her must die.',
  },
  'Deuteronomy 22:29': {
    '5-7': 'then the man must give the young woman\'s father fifty silver pieces. She will be his wife because of what he did to her, and he may not divorce her all his days.',
    '8-10': 'then the man must give the young woman\'s father fifty silver pieces. She will be his wife because of what he did to her, and he may not divorce her all his days.',
  },
  'Deuteronomy 23:16': {
    all: 'He must live with you, among you, in the place he chooses in one of your towns, wherever seems best to him. You must not oppress him.',
  },
  'Deuteronomy 28:20': {
    all: 'The Lord will send cursing, confusion, and rebuke on everything you put your hand to do, until you are destroyed and perish quickly, because you have done evil and forsaken him.',
  },
  'Deuteronomy 28:27': {
    '5-7': 'The Lord will strike you with the boils of Egypt, with tumors, scurvy, and itch, and you will not be healed.',
    '8-10': 'The Lord will strike you with the boils of Egypt, with tumors, scurvy, and itch, and you will not be healed.',
  },
  'Deuteronomy 28:35': {
    '5-7': 'The Lord will strike your knees and legs with a sore boil that cannot be healed, from the bottom of your foot to the top of your head.',
    '8-10': 'The Lord will strike your knees and legs with a sore boil that cannot be healed, from the sole of your foot to the crown of your head.',
  },
  'Deuteronomy 28:37': {
    all: 'You will become a horror, a warning saying, and a shameful name among all the peoples where the Lord leads you away.',
  },
  'Deuteronomy 28:40': {
    '5-7': 'You will have olive trees all through your land, but you will not enjoy the oil, because your olives will drop off.',
    '8-10': 'You will have olive trees all through your land, but you will not anoint yourself with the oil, because your olives will drop off.',
  },
  'Deuteronomy 28:41': {
    all: 'You will have sons and daughters, but they will not remain with you, because they will go away as captives.',
  },
  'Deuteronomy 28:50': {
    '5-7': 'a fierce nation that does not respect the elderly or show kindness to the young.',
    '8-10': 'a fierce-looking nation that does not respect the elderly or show kindness to the young.',
  },
  'Deuteronomy 28:52': {
    all: 'They will besiege you in all your towns until the high, strong walls you trusted in come down throughout your land. They will besiege you in all your towns throughout the land the Lord your God has given you.',
  },
  'Deuteronomy 28:68': {
    all: 'The Lord will bring you back to Egypt in ships, by the road I told you that you would never see again. There you will offer yourselves to your enemies as male and female slaves, but no one will buy you.',
  },
  'Deuteronomy 29:1': {
    all: 'These are the words of the covenant the Lord commanded Moses to make with the people of Israel in the land of Moab, in addition to the covenant he made with them at Horeb.',
  },
  'Deuteronomy 29:22': {
    '5-7': 'The next generation, your children who rise up after you, and the foreigner who comes from a far land, will see the terrible sicknesses of that land and the sicknesses the Lord used to make it sick.',
    '8-10': 'The next generation, your children who rise up after you, and the foreigner who comes from a far land, will see the terrible sicknesses of that land and the sicknesses the Lord used to make it sick.',
  },
  'Deuteronomy 30:1': {
    all: 'When all these things come on you, the blessing and the curse I have set before you, and you call them to mind among all the nations where the Lord your God has driven you,',
  },
  'Deuteronomy 30:3': {
    '5-7': 'then the Lord your God will restore you from captivity, have compassion on you, and gather you again from all the peoples where the Lord your God scattered you.',
    '8-10': 'then the Lord your God will restore you from captivity, have compassion on you, and gather you again from all the peoples where the Lord your God scattered you.',
  },
  'Deuteronomy 31:5': {
    all: 'The Lord will give them over to you, and you must do to them according to all the command I have commanded you.',
  },
  'Deuteronomy 31:11': {
    all: 'when all Israel comes to appear before the Lord your God in the place he chooses, you must read this law before all Israel so they can hear it.',
  },
  'Deuteronomy 31:16': {
    '5-7': 'The Lord said to Moses, "You will die and rest with your ancestors. Then this people will rise up and run after the foreign gods of the land they are entering. They will forsake me and break my covenant that I made with them.',
    '8-10': 'The Lord said to Moses, "You will die and rest with your ancestors. Then this people will rise up and prostitute themselves after the foreign gods of the land they are entering. They will forsake me and break my covenant that I made with them.',
  },
  'Deuteronomy 31:17': {
    all: 'Then my anger will burn against them on that day. I will forsake them and hide my face from them. They will be devoured, and many evils and troubles will come on them. On that day they will say, "Have these evils come on us because our God is not among us?"',
  },
  'Deuteronomy 31:18': {
    all: 'I will surely hide my face on that day because of all the evil they have done by turning to other gods.',
  },
  'Deuteronomy 31:29': {
    all: 'I know that after my death you will corrupt yourselves completely and turn away from the way I commanded you. Evil will happen to you in later days because you will do what is evil in the Lord\'s sight, provoking him to anger by the work of your hands."',
  },
  'Deuteronomy 32:37': {
    all: 'He will say, "Where are their gods, the rock where they took refuge?',
  },
  'Deuteronomy 32:46': {
    all: 'He said to them, "Set your hearts on all the words I testify to you today. Command your children to be careful to do all the words of this law.',
  },
  'Deuteronomy 32:49': {
    all: '"Go up into this mountain of Abarim, Mount Nebo, in the land of Moab across from Jericho, and see the land of Canaan, which I give to the people of Israel as their land.',
  },
  'Deuteronomy 32:52': {
    all: 'You will see the land from a distance, but you must not go there into the land I give the people of Israel."',
  },
  'Deuteronomy 33:1': {
    all: 'This is the blessing Moses, the man of God, gave the people of Israel before his death.',
  },
  'Deuteronomy 12:3': {
    '5-7': 'Break down their altars, smash their pillars, and burn their Asherah poles with fire. Cut down the carved idols of their gods, and remove their names from that place.',
    '8-10': 'Break down their altars, smash their pillars, and burn their Asherah poles with fire. Cut down the carved images of their gods, and remove their names from that place.',
  },
  'Deuteronomy 12:5': {
    all: 'Go to the place the Lord your God will choose from all your tribes as the place for his name. Seek him there, and come there.',
  },
  'Deuteronomy 12:6': {
    '5-7': 'Bring there your burned offerings, sacrifices, tithes, special gifts, special promises, gifts people choose to bring, and the firstborn from your herd and flock.',
    '8-10': 'Bring there your burned offerings, sacrifices, tithes, special gifts, vows, gifts people choose to bring, and the firstborn from your herd and flock.',
  },
  'Deuteronomy 12:7': {
    all: 'There you and your households must eat before the Lord your God and rejoice in all your work, because the Lord your God has blessed you.',
  },
  'Deuteronomy 12:9': {
    all: 'because you have not yet come to the rest and inheritance the Lord your God gives you.',
  },
  'Deuteronomy 12:11': {
    '5-7': 'then bring everything I command you to the place the Lord your God will choose for his name: your burned offerings, sacrifices, tithes, special gifts, and all the special promises you choose to make to the Lord.',
    '8-10': 'then bring everything I command you to the place the Lord your God will choose for his name: your burned offerings, sacrifices, tithes, special gifts, and all the vows you choose to make to the Lord.',
  },
  'Deuteronomy 12:12': {
    all: 'Rejoice before the Lord your God: you, your sons and daughters, your male and female servants, and the Levite in your towns, because he has no share of land with you.',
  },
  'Deuteronomy 12:15': {
    all: 'You may kill and eat meat in all your towns, as much as you desire, according to the blessing the Lord your God has given you. People not clean for worship and people who are clean may eat it, as they eat gazelle or deer.',
  },
  'Deuteronomy 12:17': {
    '5-7': 'But in your towns you may not eat the tithe of your grain, new wine, oil, the firstborn of your herd or flock, any special promises you make, gifts people choose to bring, or your special gifts.',
    '8-10': 'But in your towns you may not eat the tithe of your grain, new wine, oil, the firstborn of your herd or flock, any vows you make, gifts people choose to bring, or your special gifts.',
  },
  'Deuteronomy 12:18': {
    all: 'Eat them before the Lord your God in the place the Lord your God will choose: you, your son, your daughter, your male servant, your female servant, and the Levite in your towns. Rejoice before the Lord your God in all your work.',
  },
  'Deuteronomy 12:21': {
    all: 'If the place the Lord your God will choose for his name is too far from you, then you may kill animals from the herd and flock the Lord has given you, as I commanded you, and eat in your towns as much as you desire.',
  },
  'Deuteronomy 12:22': {
    all: 'Eat it as gazelle or deer is eaten. People not clean for worship and people who are clean may eat it alike.',
  },
  'Deuteronomy 12:26': {
    '5-7': 'Take your holy gifts and your special promises, and go to the place the Lord will choose.',
    '8-10': 'Take your holy gifts and your vows, and go to the place the Lord will choose.',
  },
  'Deuteronomy 12:28': {
    all: 'Listen to and keep all these words I command you, so things may go well with you and your children after you forever, when you do what is good and right in the Lord your God\'s eyes.',
  },
  'Deuteronomy 12:30': {
    all: 'be careful that you are not trapped into following them after they are destroyed before you. Do not ask about their gods, saying, "How did these nations serve their gods? I will do the same."',
  },
  'Deuteronomy 12:32': {
    all: 'Everything I command you, be careful to do. Do not add to it or take away from it.',
  },
  'Deuteronomy 14:6': {
    all: 'You may eat any animal with a split hoof that chews the cud, chewing its food again.',
  },
  'Deuteronomy 14:7': {
    all: 'But do not eat these animals, even though they chew the cud or have a split hoof: the camel, the hare, and the rabbit. They chew the cud but do not have a split hoof, so they are not clean for you to eat.',
  },
  'Deuteronomy 14:8': {
    all: 'The pig has a split hoof but does not chew the cud, so it is not clean for you to eat. Do not eat its meat or touch its dead body.',
  },
  'Deuteronomy 14:9': {
    all: 'From the waters, you may eat anything that has fins and scales.',
  },
  'Deuteronomy 14:10': {
    all: 'Do not eat anything from the water that does not have fins and scales. It is not clean for you to eat.',
  },
  'Deuteronomy 14:12': {
    all: 'But these are the birds you must not eat: the eagle, the vulture, the osprey,',
  },
  'Deuteronomy 14:19': {
    all: 'All winged creeping things are not clean for you to eat. They must not be eaten.',
  },
  'Deuteronomy 14:21': {
    all: 'Do not eat anything that dies by itself. You may give it to the foreigner living in your towns, and he may eat it, or you may sell it to a foreigner. You are a holy people to the Lord your God. Do not boil a young goat in its mother\'s milk.',
  },
  'Deuteronomy 14:22': {
    all: 'Every year, faithfully give a tenth from all the crops that grow in your field.',
  },
  'Deuteronomy 14:23': {
    all: 'Eat the tithe of your grain, new wine, oil, and the firstborn of your herd and flock before the Lord your God in the place he chooses for his name. In this way you will learn to honor the Lord your God always.',
  },
  'Deuteronomy 14:24': {
    all: 'If the road is too long and you cannot carry the tithe because the place the Lord your God chooses is too far away, when the Lord your God blesses you,',
  },
  'Deuteronomy 14:25': {
    all: 'then turn the tithe into money, tie the money safely in your hand, and go to the place the Lord your God will choose.',
  },
  'Deuteronomy 14:26': {
    '5-7': 'Use the money for whatever you desire: cattle, sheep, wine, drink that can make someone drunk, or whatever you want. Eat there before the Lord your God, and rejoice with your household.',
    '8-10': 'Use the money for whatever you desire: cattle, sheep, wine, strong drink, or whatever you want. Eat there before the Lord your God, and rejoice with your household.',
  },
  'Deuteronomy 14:27': {
    all: 'Do not forget the Levite in your towns, because he has no share of land with you.',
  },
  'Deuteronomy 14:28': {
    all: 'At the end of every three years, bring all the tithe from that year\'s increase and store it in your towns.',
  },
  'Deuteronomy 14:29': {
    all: 'Then the Levite, who has no share of land with you, and the foreigner, the child without a father, and the woman whose husband died in your towns may come, eat, and be satisfied. Then the Lord your God may bless you in all the work of your hands.',
  },
  'Deuteronomy 33:2': {
    all: 'Moses said, "The Lord came from Sinai. He rose like light from Seir and shone from Mount Paran. He came with ten thousands of holy ones, and fiery law was at his right hand.',
  },
  'Deuteronomy 33:3': {
    all: 'Yes, he loves his people. All his holy ones are in his hand. They sit at his feet and receive his words.',
  },
  'Deuteronomy 33:4': {
    all: 'Moses commanded us the law, an inheritance for the gathered people of Jacob.',
  },
  'Deuteronomy 33:5': {
    all: 'The Lord was king in Jeshurun when the leaders of the people gathered, all the tribes of Israel together.',
  },
  'Deuteronomy 33:6': {
    all: '"Let Reuben live and not die, and let his men not be few."',
  },
  'Deuteronomy 33:7': {
    all: 'This blessing is for Judah. Moses said, "Lord, hear Judah\'s voice and bring him to his people. Help him with your hands against his enemies."',
  },
  'Deuteronomy 33:8': {
    all: 'About Levi he said, "Your Urim and Thummim, the sacred tools for seeking your judgment, belong to your faithful one. You tested him at Massah and contended with him at the waters of Meribah.',
  },
  'Deuteronomy 33:9': {
    all: 'He put your word above even father, mother, brothers, and children. The Levites guarded your word and kept your covenant.',
  },
  'Deuteronomy 33:10': {
    all: 'They will teach Jacob your commands and Israel your law. They will put incense before you and whole burned offerings on your altar.',
  },
  'Deuteronomy 33:11': {
    all: 'Lord, bless Levi\'s strength and accept the work of his hands. Strike those who rise against him and those who hate him, so they do not rise again."',
  },
  'Deuteronomy 33:12': {
    all: 'About Benjamin he said, "The one the Lord loves will live safely beside him. The Lord covers him all day long and holds him close."',
  },
  'Deuteronomy 33:13': {
    all: 'About Joseph he said, "May his land be blessed by the Lord with good gifts from the heavens, with dew, and with water from the deep below,',
  },
  'Deuteronomy 33:14': {
    all: 'with good fruit grown by the sun and good crops that come month by month,',
  },
  'Deuteronomy 33:15': {
    all: 'with the best gifts of the ancient mountains and the good things of the everlasting hills,',
  },
  'Deuteronomy 33:16': {
    all: 'with the good gifts of the earth and everything in it, and with the favor of the one who appeared in the bush. Let these blessings rest on Joseph, on the head of the one set apart from his brothers.',
  },
  'Deuteronomy 33:17': {
    all: 'Joseph has majesty like a firstborn bull. His horns are like the horns of a wild ox. With them he will push peoples to the ends of the earth. These are the ten thousands of Ephraim and the thousands of Manasseh."',
  },
  'Deuteronomy 33:18': {
    all: 'About Zebulun he said, "Rejoice, Zebulun, when you go out; and rejoice, Issachar, in your tents.',
  },
  'Deuteronomy 33:19': {
    all: 'They will call peoples to the mountain. There they will offer right sacrifices, because they will draw abundance from the seas and hidden treasures from the sand."',
  },
  'Deuteronomy 33:20': {
    all: 'About Gad he said, "Blessed is the one who enlarges Gad. Gad rests like a lioness and tears arm and head.',
  },
  'Deuteronomy 33:21': {
    all: 'He chose the first part for himself, because a commander\'s portion was kept there. He came with the leaders of the people and carried out the Lord\'s righteousness and commands with Israel."',
  },
  'Deuteronomy 33:22': {
    all: 'About Dan he said, "Dan is a lion\'s cub leaping out from Bashan."',
  },
  'Deuteronomy 33:23': {
    all: 'About Naphtali he said, "Naphtali is satisfied with favor and full of the Lord\'s blessing. Take possession by the west and the south."',
  },
  'Deuteronomy 33:24': {
    all: 'About Asher he said, "Asher is blessed with children. May he be pleasing to his brothers, and may he dip his foot in oil.',
  },
  'Deuteronomy 33:25': {
    all: 'Your bars will be iron and bronze, and your strength will last as long as your days.',
  },
  'Deuteronomy 33:26': {
    all: '"There is no one like God, Jeshurun. He rides across the heavens to help you, across the skies in his majesty.',
  },
  'Deuteronomy 33:27': {
    all: 'The eternal God is your refuge. Underneath you are his everlasting arms. He drives the enemy out before you and says, "Destroy!"',
  },
  'Deuteronomy 33:28': {
    all: 'So Israel lives in safety, the spring of Jacob alone, in a land of grain and new wine. The heavens drop dew for him.',
  },
  'Deuteronomy 33:29': {
    all: 'You are blessed, Israel! Who is like you, a people saved by the Lord? He is your helping shield and your majestic sword. Your enemies will bow before you, and you will tread on their high places."',
  },
});

Object.assign(STORY_REVISIONS, {
  'Deuteronomy 18:17': {
    all: 'The Lord said to me, "What they have spoken is good.',
  },
  'Deuteronomy 21:20': {
    all: 'They must tell the elders of his city, "This son of ours is stubborn and rebellious. He will not obey us. He eats greedily and gets drunk."',
  },
  'Deuteronomy 25:5': {
    '5-7': 'If brothers live together and one of them dies without a son, the dead man\'s wife must not marry outside the family. Her husband\'s brother must marry her and do the family duty for his brother.',
    '8-10': 'If brothers live together and one of them dies without a son, the dead man\'s wife must not marry outside the family. Her husband\'s brother must marry her and do the duty of a husband\'s brother for her.',
  },
  'Deuteronomy 25:7': {
    '5-7': 'If the man does not want to marry his brother\'s widow, then she must go to the elders at the city gate and say, "My husband\'s brother refuses to carry on his brother\'s name in Israel. He will not do his family duty for me."',
    '8-10': 'If the man does not want to marry his brother\'s widow, then she must go to the elders at the city gate and say, "My husband\'s brother refuses to carry on his brother\'s name in Israel. He will not do the duty of a husband\'s brother for me."',
  },
  'Deuteronomy 25:9': {
    '5-7': 'then his brother\'s widow must come to him in front of the elders, take his sandal off his foot, spit in his face, and say, "This is what is done to the man who will not build up his brother\'s house."',
    '8-10': 'then his brother\'s widow must come to him in front of the elders, take his sandal off his foot, spit in his face, and say, "This is what is done to the man who will not build up his brother\'s house."',
  },
  'Deuteronomy 9:28': {
    all: 'Otherwise the land you brought us out from may say, "The Lord was not able to bring them into the land he promised them, and because he hated them, he brought them out to kill them in the wilderness."',
  },
  'Deuteronomy 17:8': {
    '5-7': 'If a case is too hard for you to judge in your towns, whether it is about bloodshed, a legal claim, or an injury, then go up to the place the Lord your God chooses.',
    '8-10': 'If a case is too hard for you to judge in your towns, whether it is about bloodshed, a legal claim, or an injury, then go up to the place the Lord your God chooses.',
  },
  'Deuteronomy 19:6': {
    '5-7': 'Otherwise, the close relative who avenges the death might chase the person who killed someone while his anger is hot. If the road is too long, he might catch him and strike him down, even though the man did not deserve death, because he had not hated the person before.',
    '8-10': 'Otherwise, the close relative who avenges the death might chase the person who killed someone while his anger is hot. If the road is too long, he might catch him and strike him down, even though the man did not deserve death, because he had not hated the person before.',
  },
  'Deuteronomy 19:10': {
    all: 'Then innocent blood will not be shed in the middle of the land the Lord your God gives you as an inheritance, and bloodguilt will not be on you.',
  },
  'Deuteronomy 19:13': {
    all: 'You must not show pity to him. Remove the guilt of innocent blood from Israel, so things may go well with you.',
  },
  'Deuteronomy 19:17': {
    all: 'then both people in the dispute must stand before the Lord, before the priests and judges serving in those days.',
  },
  'Deuteronomy 21:5': {
    '5-7': 'The priests, the sons of Levi, must come near. The Lord your God chose them to serve him and bless in the Lord\'s name, and every argument and injury must be decided by their word.',
    '8-10': 'The priests, the sons of Levi, must come near. The Lord your God chose them to serve him and bless in the Lord\'s name, and every dispute and injury must be decided by their word.',
  },
  'Deuteronomy 21:8': {
    '5-7': 'Forgive your people Israel, Lord, the people you bought back. Do not hold innocent blood against your people Israel." So the bloodguilt will be forgiven them.',
    '8-10': 'Forgive your people Israel, Lord, the people you redeemed. Do not hold innocent blood against your people Israel." So the bloodguilt will be forgiven them.',
  },
  'Deuteronomy 21:9': {
    all: 'So you must remove the guilt of innocent blood from among you by doing what is right in the Lord\'s eyes.',
  },
  'Deuteronomy 21:15': {
    '5-7': 'If a man has two wives, one he loves and one he does not love, and both wives have borne him children, and the firstborn son belongs to the unloved wife,',
    '8-10': 'If a man has two wives, one he loves and one he does not love, and both wives have borne him children, and the firstborn son belongs to the unloved wife,',
  },
  'Deuteronomy 21:17': {
    all: 'He must recognize the firstborn, the son of the unloved wife, by giving him a double share of all he has. That son is the beginning of his strength, and the right of the firstborn belongs to him.',
  },
  'Deuteronomy 21:18': {
    '5-7': 'If a man has a stubborn and rebellious son who will not listen to his father or mother, even after they discipline him,',
    '8-10': 'If a man has a stubborn and rebellious son who will not listen to his father or mother, even after they discipline him,',
  },
  'Deuteronomy 21:20': {
    '5-7': 'They must tell the elders of his city, "This son of ours is stubborn and rebellious. He will not obey us. He eats greedily and gets drunk."',
    '8-10': 'They must tell the elders of his city, "This son of ours is stubborn and rebellious. He will not obey us. He is a glutton and a drunkard."',
  },
  'Deuteronomy 21:22': {
    '5-7': 'If a man has committed a sin that deserves death, and he is put to death and hung on a tree,',
    '8-10': 'If a man has committed a sin that deserves death, and he is put to death and hung on a tree,',
  },
  'Deuteronomy 25:6': {
    '5-7': 'The firstborn son she bears will carry on the name of the brother who died, so his name will not be forgotten in Israel.',
    '8-10': 'The firstborn son she bears will carry on the name of the brother who died, so his name will not be forgotten in Israel.',
  },
  'Deuteronomy 26:13': {
    '5-7': 'You must say before the Lord your God, "I have taken the holy gifts out of my house and given them to the Levite, the foreigner, the child without a father, and the woman whose husband died, just as you commanded me. I have not disobeyed or forgotten any of your commands.',
    '8-10': 'You must say before the Lord your God, "I have taken the holy gifts out of my house and given them to the Levite, the foreigner, the child without a father, and the widow, just as you commanded me. I have not disobeyed or forgotten any of your commands.',
  },
  'Deuteronomy 33:9': {
    '5-7': 'Levi said of his father and mother, "I have not favored them." He did not favor his brothers or his own children, because the Levites kept your word and guarded your covenant.',
    '8-10': 'Levi said of his father and mother, "I have not favored them." He did not favor his brothers or his own children, because the Levites kept your word and guarded your covenant.',
  },
  'Deuteronomy 33:12': {
    '5-7': 'About Benjamin he said, "The one loved by the Lord will live safely beside him. The Lord covers him all day long, and he rests between his shoulders."',
    '8-10': 'About Benjamin he said, "The beloved of the Lord will live safely beside him. The Lord covers him all day long, and he rests between his shoulders."',
  },
  'Deuteronomy 4:28': {
    '5-7': 'There you will serve gods made by human hands, gods of wood and stone that cannot see, hear, eat, or smell.',
    '8-10': 'There you will serve gods made by human hands, gods of wood and stone that cannot see, hear, eat, or smell.',
  },
  'Deuteronomy 8:16': {
    '5-7': 'He fed you in the wilderness with manna your ancestors had not known. He humbled you and tested you, so he could do good for you in the end.',
    '8-10': 'He fed you in the wilderness with manna your ancestors had not known. He humbled you and tested you, so he could do good for you in the end.',
  },
  'Deuteronomy 9:18': {
    '5-7': 'Then I fell down before the Lord as I had done at first, forty days and forty nights. I did not eat bread or drink water, because of all the sin you had done by doing evil in the Lord\'s sight and making him angry.',
    '8-10': 'Then I fell down before the Lord as I had done at first, forty days and forty nights. I did not eat bread or drink water, because of all the sin you had done by doing evil in the Lord\'s sight and making him angry.',
  },
  'Deuteronomy 11:11': {
    '5-7': 'But the land you are crossing over to take is a land of hills and valleys. It drinks water from the rain of the sky.',
    '8-10': 'But the land you are crossing over to take is a land of hills and valleys. It drinks water from the rain of the sky.',
  },
  'Deuteronomy 11:24': {
    '5-7': 'Every place where the bottom of your foot steps will be yours: from the wilderness and Lebanon, from the Euphrates River to the western sea, will be your border.',
    '8-10': 'Every place where the sole of your foot steps will be yours: from the wilderness and Lebanon, from the Euphrates River to the western sea, will be your border.',
  },
  'Deuteronomy 18:8': {
    '5-7': 'They must have equal portions to eat, besides what comes from selling family possessions.',
    '8-10': 'They must have equal portions to eat, besides what comes from selling family possessions.',
  },
  'Deuteronomy 21:3': {
    '5-7': 'The elders of the city nearest the killed man must take a young cow from the herd, one that has never been worked with or pulled a yoke.',
    '8-10': 'The elders of the city nearest the killed man must take a young cow from the herd, one that has never been worked with or pulled a yoke.',
  },
  'Deuteronomy 29:3': {
    all: 'your eyes saw the great trials, the signs, and those great wonders.',
  },
  'Deuteronomy 32:17': {
    '5-7': 'They sacrificed to demons, not to God, to gods they had not known, new gods that had recently come, gods your ancestors had not feared.',
    '8-10': 'They sacrificed to demons, not to God, to gods they had not known, new gods that had recently come, gods your ancestors had not feared.',
  },
  'Deuteronomy 32:38': {
    '5-7': 'who ate the fat of their sacrifices and drank the wine of their drink gifts? Let them rise up and help you. Let them protect you!',
    '8-10': 'who ate the fat of their sacrifices and drank the wine of their drink offerings? Let them rise up and help you. Let them protect you!',
  },
  'Deuteronomy 3:28': {
    all: 'But appoint Joshua, encourage him, and strengthen him, because he will cross over before this people and lead them to receive the land that you will see."',
  },
  'Deuteronomy 5:14': {
    '5-7': 'but the seventh day is a Sabbath to the Lord your God. On that day you must not do any work: not you, your son, your daughter, your male servant or female servant, your ox, your donkey, any of your animals, or the foreigner in your towns, so your servants may rest as well as you.',
    '8-10': 'but the seventh day is a Sabbath to the Lord your God. On that day you must not do any work: not you, your son, your daughter, your male servant or female servant, your ox, your donkey, any of your animals, or the foreigner in your towns, so your servants may rest as well as you.',
  },
  'Deuteronomy 5:21': {
    '5-7': '"You must not want for yourself your neighbor\'s wife. You must not long to take your neighbor\'s house, field, servants, ox, donkey, or anything that belongs to your neighbor."',
    '8-10': '"You must not want for yourself your neighbor\'s wife. You must not desire your neighbor\'s house, field, servants, ox, donkey, or anything that belongs to your neighbor."',
  },
  'Deuteronomy 7:19': {
    all: 'You saw the great trials, signs, wonders, mighty hand, and outstretched arm by which the Lord your God brought you out. The Lord your God will do the same to all the peoples you fear.',
  },
  'Deuteronomy 7:25': {
    '5-7': 'You must burn the carved idols of their gods with fire. Do not want the silver or gold on them for yourself, or it will trap you. Those idols are hateful to the Lord your God.',
    '8-10': 'You must burn the carved images of their gods with fire. Do not want the silver or gold on them for yourself, or it will trap you. Those idols are hateful to the Lord your God.',
  },
  'Deuteronomy 21:20': {
    all: 'They must tell the elders of his city, "This son of ours is stubborn and rebellious. He will not obey us. He eats greedily and gets drunk."',
  },
  'Deuteronomy 9:19': {
    all: 'I was afraid because the Lord was angry enough with you to destroy you. But the Lord listened to me that time also.',
  },
  'Deuteronomy 13:14': {
    all: 'then you must ask, investigate, and search carefully. If the report is true and certain that this hateful thing has happened among you,',
  },
  'Deuteronomy 14:3': {
    all: 'You must not eat anything the Lord calls hateful.',
  },
  'Deuteronomy 22:13': {
    all: 'If a man takes a wife, acts with her as her husband, and then hates her,',
  },
  'Deuteronomy 22:22': {
    all: 'If a man is found acting with another man\'s wife in the way only marriage should have, then both of them must die, the man and the woman. So you must remove the evil from Israel.',
  },
  'Deuteronomy 22:23': {
    all: 'If a young woman is promised to be married and has kept herself for marriage, and a man finds her in the city and acts with her as only marriage should,',
  },
  'Deuteronomy 22:28': {
    all: 'If a man finds a young woman who has kept herself for marriage, who is not promised to be married, and he takes hold of her and acts with her as only marriage should, and they are found,',
  },
  'Deuteronomy 22:29': {
    all: 'then the man must give the young woman\'s father fifty silver pieces. She will be his wife because of what he did to her, and he may not divorce her all his days.',
  },
  'Deuteronomy 27:20': {
    all: '"Cursed is anyone who dishonors his father\'s marriage." All the people must say, "Amen."',
  },
  'Deuteronomy 27:21': {
    all: '"Cursed is anyone who acts with an animal in a way God forbids." All the people must say, "Amen."',
  },
  'Deuteronomy 27:22': {
    all: '"Cursed is anyone who acts with his sister in the way only marriage should have, whether she is his father\'s daughter or his mother\'s daughter." All the people must say, "Amen."',
  },
  'Deuteronomy 27:23': {
    all: '"Cursed is anyone who acts with his mother-in-law in the way only marriage should have." All the people must say, "Amen."',
  },
  'Deuteronomy 28:30': {
    all: 'You will be promised a wife, but another man will take her by force. You will build a house, but you will not live in it. You will plant a vineyard, but you will not enjoy its fruit.',
  },
});

main();

function main() {
  for (const chapterNumber of CHAPTERS) {
    const ageTexts = {};

    for (const ageRange of AGE_RANGES) {
      const filePath = ageTextPath(chapterNumber, ageRange);
      const verses = extractVerses(fs.readFileSync(filePath, 'utf8')).map(verse => ({
        ...verse,
        body: polishDeuteronomyText(verse.body, ageRange, verse.reference),
      }));

      ageTexts[ageRange] = verses;
      writeAgeChapter(filePath, chapterNumber, verses);
    }

    updateResourceChapter(chapterNumber, ageTexts);
  }

  console.log(`Reviewed Deuteronomy chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishDeuteronomyText(text, ageRange, reference) {
  let result = polishKidReadableText(text, ageRange);

  result = result
    .replace(/\bYAHWEH\b/g, 'the Lord')
    .replace(/\bThese are the words which\b/g, 'These are the words that')
    .replace(/\bwhich Moses\b/g, 'that Moses')
    .replace(/\bwhich I command\b/g, 'that I command')
    .replace(/\bwhich he commanded\b/g, 'that he commanded')
    .replace(/\bwhich the Lord\b/g, 'that the Lord')
    .replace(/\bwhich you\b/g, 'that you')
    .replace(/\bwhich they\b/g, 'that they')
    .replace(/\bthat which is right\b/g, 'what is right')
    .replace(/\bthat which is evil\b/g, 'what is evil')
    .replace(/\bThe thing which you have spoken is good to do\b/g, 'What you said is good to do')
    .replace(/\bThe thing pleased me well\b/g, 'That plan seemed good to me')
    .replace(/\bthis thing\b/g, 'this matter')
    .replace(/\bI commanded you at that time all the things which you should do\b/g, 'At that time I commanded you everything you should do')
    .replace(/\bgo out to war\b/g, 'go out to battle')
    .replace(/\bwent out to war\b/g, 'went out to battle')
    .replace(/\bmen of war\b/g, 'men of battle')
    .replace(/\bmust surely be put to death\b/g, 'must be put to death')
    .replace(/\bmust surely die\b/g, 'will surely die')
    .replace(/\bmust surely destroy\b/g, 'must completely destroy')
    .replace(/\bmust surely strike\b/g, 'must strike')
    .replace(/\bmust surely kill\b/g, 'must put to death')
    .replace(/\bmust surely bring\b/g, 'must bring')
    .replace(/\bmust surely tithe\b/g, 'must faithfully give the tithe of')
    .replace(/\bmust surely open your hand\b/g, 'must open your hand wide')
    .replace(/\bmust surely lend\b/g, 'must lend')
    .replace(/\bmust surely give\b/g, 'must give generously')
    .replace(/\bmust surely help\b/g, 'must help')
    .replace(/\bmust surely let\b/g, 'must let')
    .replace(/\bmust surely bury\b/g, 'must bury')
    .replace(/\bmust surely perish\b/g, 'will surely perish')
    .replace(/\bmust surely bring him\b/g, 'must bring him')
    .replace(/\bfree will offerings\b/g, 'gifts people choose to bring')
    .replace(/\bfree will offering\b/g, 'gift someone chooses to bring')
    .replace(/\bsolemn teachings\b/g, 'covenant teachings')
    .replace(/\btestimonies\b/g, 'covenant teachings')
    .replace(/\btestimony\b/g, 'covenant teaching')
    .replace(/\bdetestable things\b/g, 'hateful things')
    .replace(/\bdetestable thing\b/g, 'hateful thing')
    .replace(/\bdevoted thing\b/g, 'thing set apart for destruction')
    .replace(/\bdevoted things\b/g, 'things set apart for destruction')
    .replace(/\bdevoted to destruction\b/g, 'set apart for destruction')
    .replace(/\bset them apart for destruction\b/g, 'set them apart for destruction')
    .replace(/\bconsume all\b/g, 'destroy all')
    .replace(/\bconsume them\b/g, 'destroy them')
    .replace(/\bconsume you\b/g, 'destroy you')
    .replace(/\bconsumed from\b/g, 'gone from')
    .replace(/\bconsumed and dead\b/g, 'gone and dead')
    .replace(/\bconsume it\b/g, 'eat it up')
    .replace(/\bconsume\b/g, 'destroy')
    .replace(/\bpurge\b/g, 'remove')
    .replace(/\bperverse and crooked\b/g, 'crooked and unfaithful')
    .replace(/\bvery perverse generation\b/g, 'very crooked and unfaithful generation')
    .replace(/\bperverse generation\b/g, 'crooked and unfaithful generation')
    .replace(/\bperverseness\b/g, 'wrongdoing')
    .replace(/\bdefect\b/g, 'something wrong')
    .replace(/\banything evil\b/g, 'anything wrong')
    .replace(/\bthe fruit of your body\b/g, 'your children')
    .replace(/\bthe fruit of your animals\b/g, 'the young of your animals')
    .replace(/\bthe increase of your animals\b/g, 'the increase of your herds')
    .replace(/\bthe young of your flock\b/g, 'the lambs and young goats of your flock')
    .replace(/\bfruit of your own body\b/g, 'children of your own body')
    .replace(/\bby reason of\b/g, 'because of')
    .replace(/\bastonishment of heart\b/g, 'confusion of heart')
    .replace(/\ban astonishment, a proverb, and a byword\b/g, 'a warning, a proverb, and a saying')
    .replace(/\bhigh and fortified walls\b/g, 'high, strong walls')
    .replace(/\bthe remnant of his children\b/g, 'the rest of his children')
    .replace(/\bhis eye will be evil toward\b/g, 'he will look coldly at')
    .replace(/\bher eye will be evil toward\b/g, 'she will look coldly at')
    .replace(/\byour eye will be evil against\b/g, 'you will look coldly at')
    .replace(/\bYour eye must not pity\b/g, 'You must not show pity')
    .replace(/\byour eye must not pity\b/g, 'you must not show pity')
    .replace(/\bthe edge of the sword\b/g, 'the sword')
    .replace(/\bdestroying it utterly\b/g, 'completely destroying it')
    .replace(/\bdispossess\b/g, 'drive out')
    .replace(/\bdispossessed\b/g, 'drove out')
    .replace(/\bgo in to take\b/g, 'go in and take')
    .replace(/\bgoing in to take\b/g, 'going in to take')
    .replace(/\bgo over to take\b/g, 'cross over and take')
    .replace(/\bcome in to\b/g, 'come into')
    .replace(/\bwithin your gates\b/g, 'in your towns')
    .replace(/\bwithin all your gates\b/g, 'in all your towns')
    .replace(/\bin your gates\b/g, 'in your towns')
    .replace(/\bin all your gates\b/g, 'in all your towns')
    .replace(/\bthe gate of that city\b/g, 'the gate of that city')
    .replace(/\bthe gate to the elders\b/g, 'the city gate to the elders')
    .replace(/\belders of the city in the gate\b/g, 'elders at the city gate')
    .replace(/\bforeigner who is living with him\b/g, 'foreigner living among him')
    .replace(/\bforeigner living with you\b/g, 'foreigner living among you')
    .replace(/\bthe fatherless\b/g, 'children without fathers')
    .replace(/\bfatherless\b/g, 'children without fathers')
    .replace(/\bwidow\b/g, 'woman whose husband died')
    .replace(/\bwidows\b/g, 'women whose husbands died')
    .replace(/\bthe Levite\b/g, 'the Levite')
    .replace(/\bnew wine\b/g, 'new wine')
    .replace(/\bthreshing floor\b/g, 'place where grain is separated')
    .replace(/\bwine press\b/g, 'place where grapes are pressed')
    .replace(/\bwinepress\b/g, 'place where grapes are pressed')
    .replace(/\bfrontlets between your eyes\b/g, 'reminders between your eyes')
    .replace(/\bdoor posts\b/g, 'doorposts')
    .replace(/\bthrust out\b/g, 'drive out')
    .replace(/\bbe burn against\b/g, 'burn against')
    .replace(/\bhe destroy you\b/g, 'he will destroy you')
    .replace(/\bif we be careful\b/g, 'if we are careful')
    .replace(/\bgarment\b/g, 'clothing')
    .replace(/\bgarments\b/g, 'clothes')
    .replace(/\bpledged\b/g, 'promised')
    .replace(/\bitem held for a loan\b/g, 'item kept until a loan is repaid')
    .replace(/\bitems held for a loan\b/g, 'items kept until a loan is repaid')
    .replace(/\bwhat he gave\b/g, 'the item he gave')
    .replace(/\brelieve yourself\b/g, 'go to the bathroom')
    .replace(/\bwaste\b/g, 'waste')
    .replace(/\bpluck the ears\b/g, 'pick heads of grain')
    .replace(/\bstanding grain\b/g, 'grain field')
    .replace(/\bmuzzle the ox\b/g, "cover the ox's mouth")
    .replace(/\btreads out the grain\b/g, 'walks over grain to separate it')
    .replace(/\btreads out grain\b/g, 'walks over grain to separate it')
    .replace(/\bforty stripes\b/g, 'forty blows')
    .replace(/\bstripes\b/g, 'blows')
    .replace(/\bdegraded\b/g, 'shamed')
    .replace(/\bslack to pay it\b/g, 'slow to keep it')
    .replace(/\bvow a vow\b/g, 'make a vow')
    .replace(/\bvows which you vow\b/g, 'promises that you make')
    .replace(/\bwhich you vow\b/g, 'that you make')
    .replace(/\bthat which has gone out of your lips\b/g, 'what you promised')
    .replace(/\bwhatever has gone out of your lips\b/g, 'whatever you promised')
    .replace(/\bthe Lord's whole group\b/g, "the Lord's gathered people")
    .replace(/\bwhole group\b/g, ageRange === '5-7' ? 'whole group' : 'assembly')
    .replace(/\bthe Lord your God must choose\b/g, 'the Lord your God will choose')
    .replace(/\bthe Lord must choose\b/g, 'the Lord will choose')
    .replace(/\bmust choose to set his name\b/g, 'will choose to set his name')
    .replace(/\bmust choose to cause his name to live\b/g, 'will choose as the place for his name')
    .replace(/\bto cause his name to live there\b/g, 'as the place for his name')
    .replace(/\bmust choose out of all your tribes, to put his name there\b/g, 'will choose from all your tribes as the place for his name')
    .replace(/\bseek his habitation\b/g, 'go to the place where he puts his name')
    .replace(/\bthe lifted offering of your hand\b/g, 'your special gifts')
    .replace(/\blifted offering of your hand\b/g, 'special gifts')
    .replace(/\bthe offering lifted before the Lord of your hand\b/g, 'your special gifts')
    .replace(/\bkill of your herd and of your flock\b/g, 'kill animals from your herd and flock')
    .replace(/\bnot ensnared\b/g, 'not trapped')
    .replace(/\bensnared\b/g, 'trapped')
    .replace(/\binquire after their gods\b/g, 'ask about their gods')
    .replace(/\bI will do likewise\b/g, 'I will do the same')
    .replace(/\bWhatever thing I command you\b/g, 'Everything I command you')
    .replace(/\bwhatever thing I command you\b/g, 'everything I command you')
    .replace(/\bno portion nor inheritance\b/g, 'no share of land')
    .replace(/\bno portion\b/g, 'no share')
    .replace(/\bnor inheritance\b/g, 'or inheritance')
    .replace(/\bmake your days long\b/g, 'make your days long')
    .replace(/\bthat your days may be long\b/g, 'so your days may be long')
    .replace(/\bso things may go well with you\b/g, 'so things may go well with you')
    .replace(/\bpossess\b/g, 'take')
    .replace(/\bpossessed\b/g, 'took')
    .replace(/\bpossessing\b/g, 'taking')
    .replace(/\bpossession\b/g, 'land')
    .replace(/\binheritance\b/g, 'inheritance')
    .replace(/\bcarved image\b/g, 'carved idol')
    .replace(/\bcarved images\b/g, 'carved idols')
    .replace(/\bidol made from melted metal\b/g, 'metal idol')
    .replace(/\bidols made from melted metal\b/g, 'metal idols')
    .replace(/\bengraved images\b/g, 'carved idols')
    .replace(/\bengraved image\b/g, 'carved idol')
    .replace(/\bAsherah pole pole\b/g, 'Asherah pole')
    .replace(/\bof all flesh\b/g, 'among all people')
    .replace(/\bman\b/g, 'man')
    .replace(/\bNo man\b/g, 'No one')
    .replace(/\bno man\b/g, 'no one')
    .replace(/\bEvery man\b/g, 'Every person')
    .replace(/\bevery man\b/g, 'every person');

  if (ageRange === '5-7') {
    result = result
      .replace(/\bunclean and the clean\b/g, 'people not clean for worship and people who are clean')
      .replace(/\bThe unclean and the clean\b/g, 'People not clean for worship and people who are clean')
      .replace(/\bunclean thing\b/g, 'thing not clean for worship')
      .replace(/\ban unclean thing\b/g, 'anything not clean for worship')
      .replace(/\bis unclean\b/g, 'is not clean for worship')
      .replace(/\bare unclean\b/g, 'are not clean for worship')
      .replace(/\bIt is unclean\b/g, 'It is not clean for worship')
      .replace(/\bunclean to you\b/g, 'not clean for worship for you')
      .replace(/\bwhile I was unclean\b/g, 'while I was not clean for worship')
      .replace(/\bmade unclean\b/g, 'made not clean for worship')
      .replace(/\bmake unclean\b/g, 'make not clean for worship')
      .replace(/\bsexual relations with\b/g, 'acts as only a husband and wife should with')
      .replace(/\bhas sexual relations with\b/g, 'acts as only a husband and wife should with')
      .replace(/\bhaving sexual relations with\b/g, 'acting as only a husband and wife should with')
      .replace(/\bhad sexual relations with\b/g, 'had lived as a wife with')
      .replace(/\bhas had sexual relations\b/g, 'has kept herself for marriage')
      .replace(/\bnot had sexual relations\b/g, 'kept herself for marriage')
      .replace(/\bsexual sin\b/g, 'shameful sin against marriage')
      .replace(/\bcommit adultery\b/g, 'break marriage by taking another person\'s husband or wife')
      .replace(/\bcovet\b/g, 'want to take')
      .replace(/\bCovet\b/g, 'Want to take')
      .replace(/\bdesire your neighbor's\b/g, 'want to take your neighbor\'s')
      .replace(/\bdetestable\b/g, 'hateful')
      .replace(/\bDetestable\b/g, 'Hateful')
      .replace(/\bdivination\b/g, 'telling the future by forbidden signs')
      .replace(/\benchanter\b/g, 'person who uses magic')
      .replace(/\bsorcerer\b/g, 'person who uses sorcery')
      .replace(/\bcharmer\b/g, 'person who casts spells')
      .replace(/\bmedium\b/g, 'person who tries to speak with spirits')
      .replace(/\bspiritist\b/g, 'person who tries to speak with spirits')
      .replace(/\bnecromancer\b/g, 'person who tries to speak with the dead')
      .replace(/\bthe dead\b/g, 'dead people')
      .replace(/\bvirgin\b/g, 'young woman who kept herself for marriage')
      .replace(/\bvirgins\b/g, 'young women who kept themselves for marriage')
      .replace(/\bpromised to be married to a husband\b/g, 'promised to be married')
      .replace(/\bpromised to be married to\b/g, 'promised to be married to')
      .replace(/\btender and delicate\b/g, 'tender and gentle')
      .replace(/\bpining of person\b/g, 'a weary life')
      .replace(/\bperson desires\b/g, 'you desire')
      .replace(/\byour person\b/g, 'your life')
      .replace(/\bsoul\b/g, 'life')
      .replace(/\bsouls\b/g, 'lives')
      .replace(/\bcaptivity\b/g, 'being captured')
      .replace(/\bbewail\b/g, 'mourn')
      .replace(/\bhas no delight in her\b/g, 'is not pleased with her')
      .replace(/\bdeal with her as a slave\b/g, 'treat her as a slave')
      .replace(/\bconsecrate\b/g, 'set apart')
      .replace(/\banoint\b/g, 'put oil on')
      .replace(/\bsole of your foot\b/g, 'bottom of your foot')
      .replace(/\bcrown of your head\b/g, 'top of your head')
      .replace(/\bthe sole of her foot\b/g, 'the bottom of her foot');
  } else {
    result = result
      .replace(/\bunclean and the clean\b/g, 'people not clean for worship and people who are clean')
      .replace(/\bThe unclean and the clean\b/g, 'People not clean for worship and people who are clean')
      .replace(/\bis unclean\b/g, 'is not clean for worship')
      .replace(/\bare unclean\b/g, 'are not clean for worship')
      .replace(/\bIt is unclean\b/g, 'It is not clean for worship')
      .replace(/\bunclean to you\b/g, 'not clean for worship for you')
      .replace(/\bwhile I was unclean\b/g, 'while I was not clean for worship')
      .replace(/\bmade unclean\b/g, 'made not clean for worship')
      .replace(/\bmake unclean\b/g, 'make not clean for worship')
      .replace(/\bhas had sexual relations\b/g, 'has had relations')
      .replace(/\bnot had sexual relations\b/g, 'kept herself for marriage')
      .replace(/\bsexual relations with\b/g, 'relations with')
      .replace(/\bhaving sexual relations with\b/g, 'having relations with')
      .replace(/\bunclean thing\b/g, 'thing not clean for worship')
      .replace(/\bdetestable things\b/g, 'hateful things')
      .replace(/\bdetestable thing\b/g, 'hateful thing')
      .replace(/\bdetestable idol\b/g, 'hateful idol')
      .replace(/\bdetestable to the Lord\b/g, 'hateful to the Lord')
      .replace(/\bcovet\b/g, 'want for yourself')
      .replace(/\bcommit adultery\b/g, 'break marriage faithfulness')
      .replace(/\bmust not your brother interest\b/g, 'must not charge your brother interest');
  }

  result = finalPolish(result);

  const override = STORY_REVISIONS[reference]?.[ageRange] || STORY_REVISIONS[reference]?.all;
  return override ? finalPolish(override) : result;
}

function finalPolish(text) {
  return String(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac[\u02dc\u2122]/g, "'")
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\bwhich I\b/g, 'that I')
    .replace(/\bwhich you\b/g, 'that you')
    .replace(/\bwhich he\b/g, 'that he')
    .replace(/\bwhich she\b/g, 'that she')
    .replace(/\bwhich they\b/g, 'that they')
    .replace(/\bwhich we\b/g, 'that we')
    .replace(/\bwhich the Lord\b/g, 'that the Lord')
    .replace(/\bwhich Moses\b/g, 'that Moses')
    .replace(/\bwhich is\b/g, 'that is')
    .replace(/\bwhich was\b/g, 'that was')
    .replace(/\bwhich were\b/g, 'that were')
    .replace(/\bIt must happen, when\b/g, 'When')
    .replace(/\bit must happen, when\b/g, 'when')
    .replace(/\bIt must happen, because\b/g, 'Because')
    .replace(/\bit must happen, because\b/g, 'because')
    .replace(/\bthen it must happen that\b/g, 'then')
    .replace(/\bthen it must happen\b/g, 'then')
    .replace(/\bit must happen that\b/g, 'then')
    .replace(/\bIt must happen that\b/g, 'Then')
    .replace(/\bIt will be, when\b/g, 'When')
    .replace(/\bit will be, when\b/g, 'when')
    .replace(/\bIt will be, if\b/g, 'If')
    .replace(/\bit will be, if\b/g, 'if')
    .replace(/\bthen it will be, in the day that\b/g, 'then when')
    .replace(/\bmust faithfully give the tithe of all\b/g, 'must faithfully give a tenth of all')
    .replace(/\bmust faithfully give the tithe of\b/g, 'must faithfully give a tenth of')
    .replace(/\bwill be not clean for worship\b/g, 'will not be clean for worship')
    .replace(/\bbe not clean for worship\b/g, 'not be clean for worship')
    .replace(/\bmade not clean for worship\b/g, 'made not clean for worship')
    .replace(/\bmake not clean for worship your land\b/g, 'make your land not clean for worship')
    .replace(/\bDon't make not clean for worship your land\b/g, 'Do not make your land unclean')
    .replace(/\bnot clean for worship thing\b/g, 'thing not clean for worship')
    .replace(/\bnot clean for worship for you\b/g, 'not clean for you to eat')
    .replace(/\bnot clean for worship and people clean for worship\b/g, 'not clean for worship and people who are clean')
    .replace(/\bwho were not clean for worship and people who are clean may eat of it\b/g, 'who were not clean for worship and people who are clean may eat it')
    .replace(/\bmay eat of it\b/g, 'may eat it')
    .replace(/\beat of it\b/g, 'eat it')
    .replace(/\bmay eat of them\b/g, 'may eat them')
    .replace(/\beat of them\b/g, 'eat them')
    .replace(/\bmust not eat of them\b/g, 'must not eat them')
    .replace(/\bmust not eat of it\b/g, 'must not eat it')
    .replace(/\bmust not eat any hateful thing\b/g, 'must not eat anything the Lord calls hateful')
    .replace(/\bmust not eat any detestable thing\b/g, 'must not eat anything the Lord calls hateful')
    .replace(/\bYou must not bring a hateful thing\b/g, 'You must not bring a hateful idol')
    .replace(/\bthe hateful thing\b/g, 'the hateful idol')
    .replace(/\bhateful thing to the Lord\b/g, 'hateful to the Lord')
    .replace(/\bhateful things to the Lord\b/g, 'hateful to the Lord')
    .replace(/\bhateful thing the Lord hates\b/g, 'hateful thing the Lord hates')
    .replace(/\ba hateful thing to the Lord\b/g, 'hateful to the Lord')
    .replace(/\ba detestable thing to the Lord\b/g, 'detestable to the Lord')
    .replace(/\bdetestable thing the Lord hates\b/g, 'hateful thing the Lord hates')
    .replace(/\bdetestable to the Lord\b/g, 'hateful to the Lord')
    .replace(/\bdetestable idol\b/g, 'hateful idol')
    .replace(/\bmust not want to take your neighbor's wife\b/g, 'must not want for yourself your neighbor\'s wife')
    .replace(/\bmust not want to take the silver\b/g, 'must not want the silver')
    .replace(/\bthe Lord your God must deliver\b/g, 'the Lord your God delivers')
    .replace(/\bthe Lord your God must choose\b/g, 'the Lord your God chooses')
    .replace(/\bwhich he must choose\b/g, 'he chooses')
    .replace(/\bthat he must choose\b/g, 'he chooses')
    .replace(/\bplace he must choose\b/g, 'place he chooses')
    .replace(/\bthat the Lord your God must give\b/g, 'that the Lord your God gives')
    .replace(/\bif you must keep\b/g, 'if you keep')
    .replace(/\bif you must forget\b/g, 'if you forget')
    .replace(/\band must not turn away\b/g, 'and do not turn away')
    .replace(/\byou must not prosper\b/g, 'you will not prosper')
    .replace(/\bmust see that you\b/g, 'will see that you')
    .replace(/\bmust eat it alike\b/g, 'may eat it alike')
    .replace(/\bwill be cursed in\b/g, 'will be cursed in')
    .replace(/\bthe Lord your God, he\b/g, 'the Lord your God')
    .replace(/\bthe Lord our God, he\b/g, 'the Lord our God')
    .replace(/\bthe Lord your God your God\b/g, 'the Lord your God')
    .replace(/\bfrom before your face\b/g, 'from before you')
    .replace(/\bbefore your face\b/g, 'before you')
    .replace(/\bgo after other gods to serve them\b/g, 'go after other gods and serve them')
    .replace(/\bserve other gods which you have not known\b/g, 'serve other gods that you have not known')
    .replace(/\bin that you must not do any work\b/g, 'on which you must not do any work')
    .replace(/\bin that you trusted\b/g, 'you trusted in')
    .replace(/\bin that they\b/g, 'because they')
    .replace(/\bin that he\b/g, 'because he')
    .replace(/\bin that I\b/g, 'because I')
    .replace(/\bin that you\b/g, 'because you')
    .replace(/\bin that\b/g, 'where')
    .replace(/\bby that\b/g, 'by which')
    .replace(/\bof which he spoke\b/g, 'that he spoke about')
    .replace(/\bof that you must not eat\b/g, 'that you must not eat')
    .replace(/\bof that you cannot be healed\b/g, 'that cannot be healed')
    .replace(/\bwhere way\b/g, 'in that way')
    .replace(/\bThe unclean and clean people\b/g, 'People not clean for worship and clean people')
    .replace(/\bthe unclean and clean people\b/g, 'people not clean for worship and clean people')
    .replace(/\bunclean and clean people\b/g, 'people not clean for worship and clean people')
    .replace(/\banything unclean\b/g, 'anything not clean for worship')
    .replace(/\bmake the land the Lord your God gives you unclean\b/g, 'make the land the Lord your God gives you not clean before him')
    .replace(/\bsee anything unclean among you\b/g, 'see anything shameful among you')
    .replace(/\bthe way of which I told to you\b/g, 'the road I told you about')
    .replace(/\bby the way of which I told to you\b/g, 'by the road I told you about')
    .replace(/\bby the road I told to you\b/g, 'by the road I told you about')
    .replace(/\bby the way of that I told to you\b/g, 'by the road I told you about')
    .replace(/\bthe way by which we must go up\b/g, 'the road we should take')
    .replace(/\bby what way\b/g, 'which way')
    .replace(/\bthe place that he chooses to cause his name to live\b/g, 'the place he chooses for his name to dwell')
    .replace(/\bto cause his name to live there\b/g, 'for his name to dwell there')
    .replace(/\bto cause his name to live\b/g, 'for his name to dwell')
    .replace(/\bAsherah pole poles\b/g, 'Asherah poles')
    .replace(/\ban metal idol\b/g, 'a metal idol')
    .replace(/\ban horror\b/g, 'a horror')
    .replace(/\bfierce facial expressions\b/g, 'fierce faces')
    .replace(/\bwill be burn\b/g, 'will burn')
    .replace(/\bbe burn\b/g, 'burn')
    .replace(/\banger of the Lord your God burn\b/g, 'anger of the Lord your God will burn')
    .replace(/\banger will be burn\b/g, 'anger will burn')
    .replace(/\bdevoured\b/g, 'swallowed up')
    .replace(/\bbeing captured\b/g, 'captivity')
    .replace(/\bfrom being captured\b/g, 'from captivity')
    .replace(/\bgo into captivity\b/g, 'go away as captives')
    .replace(/\bput oil on yourself with the oil\b/g, 'enjoy the oil')
    .replace(/\bgreat and goodly cities\b/g, 'large, good cities')
    .replace(/\bcisterns dug out\b/g, 'water pits')
    .replace(/\bbecause of for this matter\b/g, 'because of this')
    .replace(/\bfor this matter\b/g, 'because of this')
    .replace(/\bfor an inheritance\b/g, 'as an inheritance')
    .replace(/\bwhere you go in and take\b/g, 'where you go in to take')
    .replace(/\bgoing in and take\b/g, 'going in to take')
    .replace(/\bthat you go in and take\b/g, 'that you go in to take')
    .replace(/\bto go in and take\b/g, 'to go in and take')
    .replace(/\bgo in and take it\b/g, 'go in and take it')
    .replace(/\byour towns, as much as you desire\b/g, 'your towns, as much as you desire')
    .replace(/\bwhich he has given you\b/g, 'that he has given you')
    .replace(/\bthat he has commanded you mean\b/g, 'that he has commanded you mean')
    .replace(/\bhas much animals\b/g, 'has many animals')
    .replace(/\bmuch animals\b/g, 'many animals')
    .replace(/\bcommission Joshua\b/g, 'appoint Joshua')
    .replace(/\bcause them to receive the land as an inheritance\b/g, 'lead them to receive the land')
    .replace(/\bmust cause them to receive\b/g, 'will lead them to receive')
    .replace(/\bmust cause Israel to receive\b/g, 'will lead Israel to receive')
    .replace(/\bmust see it\b/g, 'will see it')
    .replace(/\bmust not go there\b/g, 'will not go there')
    .replace(/\bthe good land which\b/g, 'the good land that')
    .replace(/\bthe land which\b/g, 'the land that')
    .replace(/\blaw which\b/g, 'law that')
    .replace(/\bwork which\b/g, 'work that')
    .replace(/\bcovenant which\b/g, 'covenant that')
    .replace(/\bcommand which\b/g, 'command that')
    .replace(/\bwords which\b/g, 'words that')
    .replace(/\bway which\b/g, 'way that')
    .replace(/\bto be careful to do, all the words\b/g, 'to be careful to do all the words')
    .replace(/\bthe item the item he gave\b/g, 'the item he gave')
    .replace(/\bthe item what he gave\b/g, 'the item he gave')
    .replace(/\bthe place where grain is separated floor\b/g, 'the place where grain is separated')
    .replace(/\bplace where grapes are pressedpress\b/g, 'place where grapes are pressed')
    .replace(/\bwith that you cover yourself\b/g, 'that you use to cover yourself')
    .replace(/\bthese are they of that you must not eat\b/g, 'these are the birds you must not eat')
    .replace(/\bThese are they of that you must not eat\b/g, 'These are the birds you must not eat')
    .replace(/\bThese you may eat of all that are in the waters\b/g, 'From the waters, you may eat these')
    .replace(/\bmust not eat of anything that dies of itself\b/g, 'must not eat anything that dies by itself')
    .replace(/\bthat which comes out of the field\b/g, 'what comes out of the field')
    .replace(/\bthat which he has lent\b/g, 'what he has lent')
    .replace(/\bthat which he has\b/g, 'what he has')
    .replace(/\bstrong drink\b/g, 'drink that can make someone drunk')
    .replace(/\bwill go to the place\b/g, 'go to the place')
    .replace(/\bwoman whose husband died who\b/g, 'woman whose husband died, who')
    .replace(/\bwomen whose husbands died who\b/g, 'women whose husbands died, who')
    .replace(/\bin having no clothes\b/g, 'with no clothes')
    .replace(/\bwhich your eyes will see\b/g, 'that your eyes will see')
    .replace(/\bwhich is not written\b/g, 'that is not written')
    .replace(/\bwhich I have set\b/g, 'that I have set')
    .replace(/\bwhich he made\b/g, 'that he made')
    .replace(/\bwhich he did\b/g, 'that he did')
    .replace(/\bwhich I commanded\b/g, 'that I commanded')
    .replace(/\bwhich I command\b/g, 'that I command')
    .replace(/\bwhich are written\b/g, 'that are written')
    .replace(/\bwhich we had taken\b/g, 'that we had taken')
    .replace(/\bwhich we didn't take\b/g, 'that we did not take')
    .replace(/\bwhich is on\b/g, 'that is on')
    .replace(/\bwhich is in\b/g, 'that is in')
    .replace(/\bwhich are\b/g, 'that are')
    .replace(/\bwhich were\b/g, 'that were')
    .replace(/\bwhich was\b/g, 'that was')
    .replace(/\bsolemn whole group\b/g, 'special holy gathering')
    .replace(/\bsolemn gathered people\b/g, 'special holy gathering')
    .replace(/\bsolemn gathering\b/g, 'special holy gathering')
    .replace(/\bsolemn rest\b/g, 'quiet holy rest')
    .replace(/\baccording as\b/g, 'as')
    .replace(/\bhas any something wrong-is lame or blind, or has any something wrong whatever\b/g, 'is lame, blind, or has anything wrong with it')
    .replace(/\bany something wrong\b/g, 'anything wrong')
    .replace(/\bthe Lord your God is whoever goes over before you as a devouring fire\b/g, 'the Lord your God is the one who goes ahead of you like a burning fire')
    .replace(/\bwhoever goes over before you as a devouring fire\b/g, 'the one who goes ahead of you like a burning fire')
    .replace(/\bclothing of her being captured\b/g, 'clothes she wore when she was captured')
    .replace(/\bprivate body parts\b/g, 'private body parts')
    .replace(/\bas only a husband and wife should with her\b/g, 'as only a husband and wife should')
    .replace(/\bas only a husband and wife should with him\b/g, 'as only a husband and wife should')
    .replace(/\bas only a husband and wife should with his\b/g, 'as only a husband and wife should with his')
    .replace(/\bacts as only a husband and wife should with any kind of animal\b/g, 'acts with an animal in a way God forbids')
    .replace(/\bacts as only a husband and wife should with his mother-in-law\b/g, 'acts with his mother-in-law in the way only marriage should have')
    .replace(/\bacts as only a husband and wife should with his sister\b/g, 'acts with his sister in the way only marriage should have')
    .replace(/\bacts as only a husband and wife should with his father's wife\b/g, 'dishonors his father\'s marriage')
    .replace(/\bviolated his neighbor's wife\b/g, 'dishonored his neighbor\'s wife')
    .replace(/\bviolated his neighbor's future wife\b/g, 'dishonored his neighbor\'s future wife')
    .replace(/\bviolates her\b/g, 'harms her in that way')
    .replace(/\bviolate her\b/g, 'take her by force')
    .replace(/\bbecause he violated her\b/g, 'because of what he did to her')
    .replace(/\bwho violated her\b/g, 'who did this to her')
    .replace(/\bnot clean for worship for worship\b/g, 'not clean for worship')
    .replace(/\bclean for worship for worship\b/g, 'clean for worship')
    .replace(/\bthe people of the Lord's gathered people\b/g, "the Lord's gathered people")
    .replace(/\bjoin the Lord's assembly\b/g, "join the Lord's gathered people")
    .replace(/\bassembly assembly\b/g, 'assembly')
    .replace(/\bwhole group assembly\b/g, 'assembly')
    .replace(/\bunto\b/g, 'to')
    .replace(/\bcan not\b/g, 'cannot')
    .replace(/\bdo not\b/g, 'do not')
    .replace(/\bDo not not\b/g, 'Do not')
    .replace(/\bnot not\b/g, 'not')
    .replace(/\bthat that\b/g, 'what')
    .replace(/\bmust must\b/g, 'must')
    .replace(/\bwill will\b/g, 'will')
    .replace(/\bwill must\b/g, 'will')
    .replace(/\bmust will\b/g, 'will')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\bto to\b/g, 'to')
    .replace(/\ba ([aeiou])/gi, 'an $1')
    .replace(/\ban (young|one|united|useful|year|yoke|ewe)/gi, 'a $1')
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

  content = cleanResourceEncoding(content);

  for (let verseNumber = 1; verseNumber <= verseCount; verseNumber += 1) {
    const reference = `${BOOK_NAME} ${chapterNumber}:${verseNumber}`;
    const age57 = findVerse(ageTexts['5-7'], reference);
    const age810 = findVerse(ageTexts['8-10'], reference);

    content = replaceResourceAgeText(content, reference, '5-7', age57);
    content = replaceResourceAgeText(content, reference, '8-10', age810);
  }

  content = replaceMemoryVerseText(content, '5-7', ageTexts['5-7']);
  content = replaceMemoryVerseText(content, '8-10', ageTexts['8-10']);
  content = replaceResourceOverview(content, chapterNumber);
  content = replaceChapterSummary(content, chapterNumber);
  content = removeDraftResourceNote(content);
  content = content.replace(/\n{2,}$/g, '\n');

  fs.writeFileSync(resourcePath, content, 'utf8');
}

function cleanResourceEncoding(content) {
  return content
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac[\u02dc\u2122]/g, "'")
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/â€”/g, '-')
    .replace(/â€œ/g, '"')
    .replace(/â€�/g, '"')
    .replace(/â€˜/g, "'")
    .replace(/â€™/g, "'")
    .replace(/â€¦/g, '...');
}

function replaceResourceOverview(content, chapterNumber) {
  const data = RESOURCE_DATA[chapterNumber];
  if (!data) return content;

  const firstSentence = data.summary.match(/^.*?\./)?.[0] || data.summary;
  const overview = `${BOOK_OVERVIEW} Chapter focus: ${firstSentence}`;

  return content.replace(
    /(## Book Overview\s*\r?\n+)([\s\S]*?)(\r?\n\r?\n## Important Keywords)/,
    `$1${overview}$3`
  );
}

function replaceChapterSummary(content, chapterNumber) {
  const data = RESOURCE_DATA[chapterNumber];
  if (!data) return content;

  const lessons = data.lessons
    .map(([title, body], index) => `${index + 1}. **${title}**: ${body}`)
    .join('\n');

  const block = [
    '## Chapter Summary',
    data.summary,
    '',
    '## Key Lessons for Children',
    lessons,
    '',
  ].join('\n') + '\n';

  return content.replace(/## Chapter Summary[\s\S]*?(?=## Memory Verses by Age)/, block);
}

function removeDraftResourceNote(content) {
  return content.replace(/\r?\n?<!-- Draft Resource Note -->[\s\S]*?<!-- End Draft Resource Note -->\r?\n?/g, '\n');
}

function replaceMemoryVerseText(content, ageRange, verses) {
  const heading = ageRange === '5-7' ? '### Ages 5-7' : '### Ages 8-10';
  const nextHeading = ageRange === '5-7' ? '### Ages 8-10' : '## Discussion Questions by Age';
  const regex = new RegExp(
    `(## Memory Verses by Age[\\s\\S]*?${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(\\r?\\n\\r?\\n${escapeRegex(nextHeading)})`,
    'm'
  );

  return content.replace(regex, (match, prefix, body, suffix) => {
    const updated = body.replace(/^(.+?)\s+-\s+(Deuteronomy\s+\d+:\d+)$/gm, (line, text, reference) => {
      const replacement = findVerse(verses, reference);
      return replacement ? `${replacement} - ${reference}` : line;
    });

    return `${prefix}${updated}${suffix}`;
  });
}

function replaceResourceAgeText(content, reference, ageRange, text) {
  if (!text) return content;

  const heading = ageRange === '5-7' ? '#### Ages 5-7' : '#### Ages 8-10';
  const nextHeading = ageRange === '5-7' ? '#### Ages 8-10' : '**Translation Notes**:';
  const escapedReference = escapeRegex(reference);
  const escapedHeading = escapeRegex(heading);
  const escapedNextHeading = escapeRegex(nextHeading);
  const regex = new RegExp(
    `(### ${escapedReference}[\\s\\S]*?${escapedHeading}\\s*\\r?\\n)([\\s\\S]*?)(\\r?\\n\\r?\\n${escapedNextHeading})`,
    'm'
  );

  return content.replace(regex, `$1${text}$3`);
}

function extractVerses(content) {
  const verseSection = extractSection(content, '## Verses') || content;
  const verseRegex = /^###\s+(Deuteronomy\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+Deuteronomy\s+\d+:\d+\s*$|(?![\s\S]))/gm;
  return [...verseSection.matchAll(verseRegex)].map(match => ({
    reference: match[1].trim(),
    body: cleanText(match[2]),
  }));
}

function extractSection(content, heading) {
  const regex = new RegExp(`${escapeRegex(heading)}\\s*\\r?\\n+([\\s\\S]*?)(?=\\r?\\n##\\s|(?![\\s\\S]))`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

function findVerse(verses, reference) {
  return verses.find(verse => verse.reference === reference)?.body || '';
}

function cleanText(value) {
  return String(value)
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
