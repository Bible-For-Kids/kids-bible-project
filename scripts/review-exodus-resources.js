#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = 'exodus';
const BOOK_NAME = 'Exodus';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 40 }, (_, index) => index + 1);

const VOCABULARY = {
  Aaron: 'Moses\' brother, whom God gave as Moses\' helper and later as high priest',
  altar: 'A special place where offerings were given to the Lord',
  angel: 'A messenger or servant from God',
  ark: 'The gold-covered chest in the holy tent that held the testimony',
  atonement: 'God making a way for sin to be covered and forgiven',
  blessing: 'Goodness given by God',
  blood: 'A sign of life, and in Passover a sign marking the houses God would pass over',
  cherubim: 'Mighty heavenly guardians connected with God\'s throne and holy presence',
  covenant: 'A serious promise relationship God makes with his people',
  courtyard: 'The open area around the holy tent',
  darkness: 'The deep dark God sent over Egypt as a sign of judgment',
  deliverance: 'Being rescued by God from danger or slavery',
  Egypt: 'The land where Israel was enslaved before the Lord rescued them',
  firstborn: 'The child born first in a family',
  glory: 'The shining greatness of who God is',
  holy: 'Set apart for God',
  idol: 'A false god or image people worship instead of the true God',
  incense: 'Sweet-smelling smoke used in worship at the holy place',
  Israel: 'God\'s covenant people descended from Jacob',
  judgment: 'God\'s right answer to evil and sin',
  justice: 'Doing what is right and fair according to God\'s ways',
  lamb: 'The young sheep used in the Passover meal',
  law: 'God\'s instruction for his covenant people',
  manna: 'The bread-like food God gave Israel in the wilderness',
  mercy: 'God\'s kindness to people who need help and forgiveness',
  Moses: 'The servant God used to lead Israel out of Egypt',
  neighbor: 'Another person God calls us to treat rightly',
  offering: 'A gift brought to the Lord in worship',
  Passover: 'The meal and day remembering how God rescued Israel from Egypt',
  Pharaoh: 'The king of Egypt',
  plague: 'A severe sign of judgment God sent on Egypt',
  presence: 'The Lord being with his people',
  priest: 'A worship leader who served at the holy place',
  promise: 'Words someone says and keeps',
  provision: 'God giving what his people need',
  Sabbath: 'A day of holy rest',
  sacrifice: 'An offering given to God in worship',
  servant: 'Someone who serves or works for another person',
  sign: 'Something God gives or does to show his word is true',
  Sinai: 'The mountain where God spoke his covenant words to Israel',
  sin: 'Disobeying God and turning from his ways',
  skill: 'Ability God gives for careful work',
  slavery: 'Being forced to serve without freedom',
  tabernacle: 'The holy tent where the Lord met with Israel',
  testimony: 'The covenant words and witness God gave his people',
  water: 'What the Lord provided for Israel in the dry wilderness',
  wilderness: 'A wild place away from settled towns',
  wisdom: 'Knowing and choosing what is right in God\'s sight',
  worship: 'Honoring God with trust, praise, and obedience',
};

const CHAPTER_DATA = {
  1: ['Israel grows in Egypt, Pharaoh fears them, and the Hebrew midwives fear God more than the king.', ['Egypt', 'Israel', 'Pharaoh', 'slavery', 'deliverance'], 17],
  2: ['Moses is born under Pharaoh\'s cruel command, is preserved through the river, flees Egypt, and God hears Israel\'s groaning.', ['Moses', 'Egypt', 'deliverance', 'promise', 'Israel'], 24],
  3: ['The Lord appears to Moses in the burning bush, names himself as the God of Abraham, Isaac, and Jacob, and sends Moses to bring Israel out.', ['Moses', 'holy', 'Egypt', 'deliverance', 'promise'], 14],
  4: ['The Lord gives Moses signs, sends Aaron to help him, and Moses returns toward Egypt to speak God\'s words.', ['Moses', 'Aaron', 'sign', 'Pharaoh', 'Israel'], 12],
  5: ['Moses and Aaron speak to Pharaoh, but Pharaoh makes Israel\'s labor heavier, and the people groan under harsher slavery.', ['Pharaoh', 'Moses', 'slavery', 'Egypt', 'Israel'], 1],
  6: ['The Lord answers Moses with his covenant name, promises rescue, and traces the family line of Moses and Aaron.', ['covenant', 'promise', 'deliverance', 'Moses', 'Aaron'], 7],
  7: ['Moses and Aaron stand before Pharaoh, Aaron\'s staff becomes a serpent, and the first plague turns Egypt\'s water to blood.', ['Pharaoh', 'plague', 'Moses', 'Aaron', 'blood'], 5],
  8: ['The Lord sends frogs, gnats, and flies, showing Pharaoh and Egypt that the Lord rules over the land.', ['plague', 'Pharaoh', 'Egypt', 'Moses', 'Israel'], 22],
  9: ['The Lord sends more plagues on livestock, skin sores, and hail, while also warning Egypt to seek shelter before judgment falls.', ['plague', 'Pharaoh', 'Egypt', 'judgment', 'mercy'], 16],
  10: ['Locusts and deep darkness cover Egypt, but Pharaoh still refuses to let all Israel go worship the Lord.', ['plague', 'Pharaoh', 'darkness', 'worship', 'Egypt'], 2],
  11: ['The Lord announces the final plague on Egypt\'s firstborn and says Israel will be sent out with favor.', ['plague', 'firstborn', 'Egypt', 'deliverance', 'Pharaoh'], 7],
  12: ['The Lord gives the Passover, strikes Egypt\'s firstborn, and brings Israel out of Egypt after many years.', ['Passover', 'lamb', 'blood', 'firstborn', 'deliverance'], 13],
  13: ['The Lord commands Israel to remember the firstborn and the bread without yeast, then leads them by cloud and fire.', ['firstborn', 'Passover', 'deliverance', 'wilderness', 'promise'], 21],
  14: ['Pharaoh chases Israel to the sea, the Lord opens a dry path through the waters, and Israel sees his great rescue.', ['Pharaoh', 'deliverance', 'Moses', 'Israel', 'wilderness'], 14],
  15: ['Moses and Israel sing to the Lord after the sea rescue, then the Lord provides water in the wilderness.', ['worship', 'deliverance', 'Moses', 'wilderness', 'water'], 2],
  16: ['Israel grumbles for food, and the Lord gives quail and manna while teaching Sabbath rest.', ['manna', 'wilderness', 'Sabbath', 'provision', 'Israel'], 15],
  17: ['The Lord gives water from the rock and gives Israel victory while Moses holds up the staff of God.', ['water', 'wilderness', 'Moses', 'deliverance', 'altar'], 6],
  18: ['Jethro rejoices in the Lord\'s rescue and advises Moses to appoint helpers for judging the people.', ['Moses', 'priest', 'deliverance', 'wisdom', 'Israel'], 11],
  19: ['Israel camps at Sinai, and the Lord calls them to be his treasured people before he comes down on the mountain.', ['Sinai', 'covenant', 'holy', 'Moses', 'Israel'], 5],
  20: ['God speaks the covenant words, beginning with his rescue from Egypt and giving Israel the Ten Commandments.', ['law', 'covenant', 'Sabbath', 'Moses', 'Sinai'], 2],
  21: ['The Lord gives case laws for servants, violence, injury, responsibility, and justice among his people.', ['law', 'justice', 'servant', 'neighbor', 'Israel'], 23],
  22: ['The Lord gives laws about theft, care for property, justice, mercy for the poor, and holiness before him.', ['law', 'justice', 'mercy', 'holy', 'neighbor'], 21],
  23: ['The Lord commands justice, Sabbath rest, yearly feasts, and promises to guide Israel toward the land.', ['law', 'Sabbath', 'worship', 'promise', 'angel'], 20],
  24: ['Israel agrees to the covenant, Moses sprinkles covenant blood, and the leaders see God before Moses goes up the mountain.', ['covenant', 'blood', 'Moses', 'Sinai', 'worship'], 7],
  25: ['The Lord asks for willing offerings and gives the pattern for the ark, table, and lampstand of the holy tent.', ['offering', 'tabernacle', 'ark', 'worship', 'Moses'], 8],
  26: ['The Lord gives the pattern for the tabernacle curtains, coverings, frames, veil, and entrance screen.', ['tabernacle', 'holy', 'ark', 'worship', 'Moses'], 33],
  27: ['The Lord gives instructions for the bronze altar, courtyard, and oil for the lamp that must burn before him.', ['altar', 'tabernacle', 'offering', 'worship', 'Aaron'], 20],
  28: ['The Lord sets apart Aaron and his sons as priests and describes the holy clothes they will wear in service.', ['Aaron', 'priest', 'holy', 'worship', 'Israel'], 29],
  29: ['The Lord gives the ceremony for setting apart the priests and promises to meet with Israel at the holy tent.', ['priest', 'offering', 'altar', 'holy', 'tabernacle'], 45],
  30: ['The Lord gives instructions for the incense altar, atonement money, washing basin, holy oil, and incense.', ['altar', 'atonement', 'incense', 'holy', 'worship'], 6],
  31: ['The Lord fills Bezalel and Oholiab with skill for the holy work and reminds Israel to keep the Sabbath.', ['Sabbath', 'tabernacle', 'holy', 'Moses', 'covenant'], 13],
  32: ['Israel makes the golden calf, Moses pleads for mercy, and the Lord judges the people for their sin.', ['idol', 'Moses', 'Aaron', 'sin', 'mercy'], 11],
  33: ['The Lord tells Israel to leave Sinai, Moses seeks the Lord\'s presence, and the Lord promises to go with him.', ['Moses', 'presence', 'glory', 'mercy', 'Israel'], 14],
  34: ['The Lord renews the covenant, proclaims his name and mercy, and Moses comes down with a shining face.', ['covenant', 'mercy', 'Moses', 'glory', 'worship'], 6],
  35: ['Moses calls Israel to Sabbath rest and invites willing gifts and skilled work for the tabernacle.', ['Sabbath', 'offering', 'tabernacle', 'worship', 'Moses'], 21],
  36: ['The workers receive more than enough gifts and begin making the tabernacle curtains, coverings, frames, and entrance.', ['tabernacle', 'offering', 'worship', 'holy', 'skill'], 7],
  37: ['Bezalel makes the ark, atonement cover, table, lampstand, incense altar, oil, and incense for the holy tent.', ['ark', 'tabernacle', 'altar', 'incense', 'worship'], 1],
  38: ['Bezalel makes the altar, basin, courtyard, and records the metals used for the holy work.', ['altar', 'tabernacle', 'offering', 'worship', 'courtyard'], 22],
  39: ['The workers make the priestly clothes and bring the finished tabernacle pieces to Moses, who blesses them.', ['priest', 'Aaron', 'tabernacle', 'holy', 'blessing'], 32],
  40: ['Moses sets up the tabernacle, the Lord\'s glory fills it, and the cloud guides Israel on their journeys.', ['tabernacle', 'glory', 'Moses', 'worship', 'Israel'], 34],
};

const NOTES = {
  '1:17': 'Keep the midwives\' fear of God clear: they refuse Pharaoh\'s cruel command and preserve life.',
  '2:24': 'God remembering his covenant means he acts faithfully; it does not mean he had forgotten.',
  '3:5': 'The holy ground belongs to God\'s presence, not to the bush itself.',
  '3:14': 'This verse gives God\'s name as "I AM." Keep the mystery and authority of God\'s self-revelation.',
  '6:7': 'This covenant sentence joins rescue with relationship: the Lord will be their God and they will be his people.',
  '7:5': 'The plagues reveal the Lord to Egypt; do not present them as random disasters.',
  '12:13': 'The blood marks the houses for Passover. Keep the connection between the sign and the Lord passing over.',
  '14:14': 'The Lord is the rescuer. Israel is told to stand firm and see his salvation.',
  '16:15': 'Manna means "What is it?" Keep the wonder of God providing food in the wilderness.',
  '19:5': 'Israel is called treasured possession by covenant grace, not because they rescued themselves.',
  '20:2': 'The commandments begin with rescue: the Lord first says who he is and what he has done.',
  '20:11': 'This verse grounds Sabbath in creation. Preserve the link to Genesis 1-2.',
  '24:8': 'The blood of the covenant confirms the serious covenant relationship between the Lord and Israel.',
  '25:8': 'The tabernacle is the holy tent where the Lord dwells among his people; avoid making it sound like God is contained by a building.',
  '32:4': 'The golden calf is idolatry. Do not soften it into a harmless craft project.',
  '33:14': 'The Lord\'s presence is the gift Moses asks for; keep that as the center of the chapter.',
  '34:6': 'This is a major statement of the Lord\'s character: merciful, gracious, slow to anger, and full of faithful love.',
  '40:34': 'The glory cloud shows the Lord taking up his place among Israel.',
};

const CROSS_REFS = {
  '1:7': ['Genesis 46:3', 'Genesis 12:2'],
  '2:24': ['Genesis 15:13-14', 'Exodus 6:5'],
  '3:14': ['John 8:58'],
  '6:7': ['Leviticus 26:12', 'Revelation 21:3'],
  '12:13': ['1 Corinthians 5:7', 'Hebrews 11:28'],
  '14:14': ['Psalm 46:10'],
  '16:15': ['John 6:31-35'],
  '19:5': ['1 Peter 2:9'],
  '20:2': ['Deuteronomy 5:6'],
  '20:11': ['Genesis 2:2-3'],
  '24:8': ['Matthew 26:28', 'Hebrews 9:18-20'],
  '25:8': ['John 1:14'],
  '32:4': ['1 Corinthians 10:7'],
  '34:6': ['Psalm 103:8'],
  '40:34': ['1 Kings 8:10-11', 'John 1:14'],
};

const STORY_REVISIONS = {
  'Exodus 1:11': {
    '5-7': 'So the Egyptians put harsh work bosses over the Israelites and made them work very hard. The Israelites built storage cities for Pharaoh called Pithom and Raamses.',
    '8-10': 'So the Egyptians put harsh work bosses over the Israelites to make their lives hard with heavy labor. The Israelites built storage cities for Pharaoh, called Pithom and Raamses.',
  },
  'Exodus 1:12': {
    '5-7': 'But the harder the Egyptians treated them, the more the Israelites grew in number and spread out. The Egyptians became afraid of them.',
    '8-10': 'But the more the Egyptians treated them cruelly, the more the Israelites grew in number and spread out. The Egyptians became afraid of the children of Israel.',
  },
  'Exodus 1:14': {
    '5-7': 'They made the Israelites\' lives bitter with heavy work. The people worked with wet mud for bricks and worked hard in the fields, and the Egyptians treated them harshly.',
    '8-10': 'They made the Israelites\' lives bitter with hard work in mud mortar, brickmaking, and all kinds of field labor. In all their work, the Egyptians treated them harshly.',
  },
  'Exodus 1:15': {
    '5-7': 'The king of Egypt spoke to two Hebrew midwives, women who helped mothers when babies were born. Their names were Shiphrah and Puah.',
    '8-10': 'The king of Egypt spoke to two Hebrew midwives, women who helped mothers give birth. One was named Shiphrah, and the other was named Puah.',
  },
  'Exodus 2:24': {
    '5-7': 'God heard their groaning. God remembered his covenant, the serious promise he made with Abraham, Isaac, and Jacob.',
    '8-10': 'God heard their groaning, and God remembered his covenant, the serious promise relationship he made with Abraham, Isaac, and Jacob.',
  },
  'Exodus 3:7': {
    '5-7': 'The Lord said, "I have truly seen my people\'s suffering in Egypt. I have heard them cry because of their harsh work bosses, and I know their sorrows.',
    '8-10': 'The Lord said, "I have truly seen my people\'s suffering in Egypt. I have heard them cry because of their harsh work bosses, and I know their sorrows.',
  },
  'Exodus 4:16': {
    '5-7': '"Aaron will speak to the people for you. He will speak for you, and you will give him the words God gives you."',
    '8-10': '"Aaron will speak to the people for you. He will be your mouth, and you will stand before him with God\'s words."',
  },
  'Exodus 4:24': {
    '5-7': 'On the way, at a place where Moses\' family stopped for the night, the Lord met Moses in a frightening judgment, and Moses\' life was in danger.',
    '8-10': 'On the way, at a lodging place, the Lord met Moses in judgment, and Moses\' life was in danger.',
  },
  'Exodus 4:25': {
    '5-7': 'Then Zipporah took a sharp stone and circumcised her son, giving him the covenant body sign. She touched Moses\' feet with it and said, "You are truly a husband of blood to me."',
    '8-10': 'Then Zipporah took a sharp stone and circumcised her son, giving him the covenant sign in his body. She touched Moses\' feet with it and said, "Surely you are a husband of blood to me."',
  },
  'Exodus 4:26': {
    '5-7': 'So the Lord let Moses live. Zipporah said, "A husband of blood," because blood had been shed in circumcision.',
    '8-10': 'So the Lord let Moses go. Zipporah said, "A husband of blood," because of the circumcision.',
  },
  'Exodus 5:6': {
    '5-7': 'That same day Pharaoh gave orders to the harsh Egyptian work bosses and to the Israelite work leaders under them.',
    '8-10': 'That same day Pharaoh commanded the harsh Egyptian work bosses over the people and the Israelite work leaders under them.',
  },
  'Exodus 5:10': {
    '5-7': 'The work bosses and Israelite work leaders went out and told the people, "This is what Pharaoh says: I will not give you straw.',
    '8-10': 'The work bosses and Israelite work leaders went out and spoke to the people. They said, "This is what Pharaoh says: I will not give you straw.',
  },
  'Exodus 5:13': {
    '5-7': 'The work bosses pushed them hard and said, "Finish your daily work, just as you did when straw was given to you."',
    '8-10': 'The work bosses pressed them, saying, "Finish your daily work, just as when straw was provided."',
  },
  'Exodus 5:14': {
    '5-7': 'Pharaoh\'s work bosses beat the Israelite work leaders they had put over the people. They asked, "Why did you not finish your full number of bricks yesterday or today, as you did before?"',
    '8-10': 'Pharaoh\'s work bosses beat the Israelite work leaders they had set over the people. They asked, "Why have you not finished your required number of bricks, yesterday or today, as before?"',
  },
  'Exodus 5:15': {
    '5-7': 'Then the Israelite work leaders went and cried out to Pharaoh, "Why are you treating your servants this way?',
    '8-10': 'Then the Israelite work leaders came and cried out to Pharaoh, "Why are you treating your servants this way?',
  },
  'Exodus 5:19': {
    '5-7': 'The Israelite work leaders saw that they were in trouble when they were told, "You must not make fewer bricks each day."',
    '8-10': 'The Israelite work leaders saw that they were in trouble when they were told, "You will not reduce your daily number of bricks."',
  },
  'Exodus 6:3': {
    '5-7': '"I showed myself to Abraham, Isaac, and Jacob as God Almighty, but I did not make my name, the Lord, known to them in the way I am showing it now."',
    '8-10': '"I appeared to Abraham, Isaac, and Jacob as God Almighty, but I did not make my name, the Lord, known to them in the way I am revealing it now."',
  },
  'Exodus 6:4': {
    '5-7': '"I also made my covenant, my serious promise, with them. I promised to give them the land of Canaan, the land where they lived as strangers."',
    '8-10': '"I also established my covenant, my serious promise relationship, with them, to give them the land of Canaan, the land where they lived as foreigners."',
  },
  'Exodus 6:5': {
    '5-7': '"I have heard the sad groaning of the children of Israel, whom the Egyptians keep as slaves, and I have remembered my covenant promise."',
    '8-10': '"I have heard the groaning of the children of Israel, whom the Egyptians keep in slavery, and I have remembered my covenant promise."',
  },
  'Exodus 7:12': {
    '5-7': 'Each man threw down his staff, and the staffs became snakes. But Aaron\'s staff swallowed their staffs.',
    '8-10': 'Each man threw down his staff, and the staffs became snakes, but Aaron\'s staff swallowed their staffs.',
  },
  'Exodus 7:11': {
    '5-7': 'Then Pharaoh called for his wise men and magic workers. Egypt\'s magicians, men who used magic arts, did the same kind of thing.',
    '8-10': 'Then Pharaoh called for his wise men and magic workers, and Egypt\'s magicians also did similar things by their magic arts.',
  },
  'Exodus 11:9': {
    '5-7': 'The Lord had told Moses, "Pharaoh will not listen to you, so that my wonders will be shown even more in Egypt."',
    '8-10': 'The Lord had said to Moses, "Pharaoh will not listen to you, so that my wonders will be shown even more in the land of Egypt."',
  },
  'Exodus 12:15': {
    '5-7': 'For seven days you must eat bread made without yeast. On the first day, remove yeast from your houses. Anyone who eats bread with yeast during those seven days must be separated from Israel\'s people.',
    '8-10': 'For seven days you must eat bread made without yeast. On the first day, remove yeast from your houses. Anyone who eats bread with yeast during those seven days will be cut off, separated from Israel.',
  },
  'Exodus 12:17': {
    '5-7': 'Keep the Feast of Bread Made Without Yeast, because on this very day I brought your people out of Egypt. Keep this day through all your families as a lasting rule.',
    '8-10': 'Keep the Feast of Bread Made Without Yeast, because on this very day I brought your people out of Egypt. Keep this day throughout your generations as a lasting command.',
  },
  'Exodus 12:19': {
    '5-7': 'For seven days, no yeast may be found in your houses. Anyone who eats what is made with yeast must be separated from Israel\'s people, whether that person is from another people or was born in the land.',
    '8-10': 'For seven days, no yeast may be found in your houses. Anyone who eats what is made with yeast will be cut off from Israel, whether that person is a foreigner or born in the land.',
  },
  'Exodus 12:22': {
    '5-7': 'Take a small bunch of leafy hyssop branches, dip it in the blood in the bowl, and touch the blood to the top and sides of the doorframe. None of you must go out through the door of your house until morning.',
    '8-10': 'Take a small bunch of leafy hyssop branches, dip it in the blood in the basin, and put the blood on the upper doorpost and the two side posts. None of you may go out through the door of your house until morning.',
  },
  'Exodus 12:43': {
    '5-7': 'The Lord said to Moses and Aaron, "These are the rules for the Passover meal: someone outside Israel may not eat it.',
    '8-10': 'The Lord said to Moses and Aaron, "This is the rule for the Passover: no foreigner may eat it.',
  },
  'Exodus 12:44': {
    '5-7': 'But a servant bought with money may eat it after he receives the covenant body sign called circumcision.',
    '8-10': 'But every servant bought with money may eat it after he has received the covenant sign of circumcision.',
  },
  'Exodus 12:45': {
    '5-7': 'A visitor or a hired worker may not eat it.',
    '8-10': 'A visitor or a hired worker may not eat it.',
  },
  'Exodus 12:48': {
    '5-7': 'If someone from another people lives with you and wants to keep the Passover to the Lord, every male in his household must receive circumcision, the covenant body sign. Then he may come near and keep it, and he will be like someone born in the land. No one outside that covenant sign may eat it.',
    '8-10': 'If a foreigner living with you wants to keep the Passover to the Lord, all the males in his household must receive circumcision, the covenant sign. Then he may come near and keep it, and he will be like someone born in the land. No one outside that covenant sign may eat it.',
  },
  'Exodus 14:7': {
    '5-7': 'He took six hundred of his best chariots, along with all the other chariots of Egypt, with army leaders over them.',
    '8-10': 'He took six hundred chosen chariots and all the other chariots of Egypt, with army leaders over all of them.',
  },
  'Exodus 15:26': {
    '5-7': 'The Lord said, "If you carefully listen to the voice of the Lord your God, do what is right in his sight, pay attention to his commands, and keep all his instructions, I will not put on you the diseases I put on the Egyptians. I am the Lord who heals you."',
    '8-10': 'The Lord said, "If you carefully listen to the voice of the Lord your God, do what is right in his sight, pay attention to his commands, and keep all his instructions, I will put none of the diseases on you that I put on the Egyptians, for I am the Lord who heals you."',
  },
  'Exodus 15:4': {
    '5-7': 'He threw Pharaoh\'s chariots and army into the sea. Pharaoh\'s best army leaders sank in the Red Sea.',
    '8-10': 'He has thrown Pharaoh\'s chariots and army into the sea. Pharaoh\'s chosen army leaders were drowned in the Red Sea.',
  },
  'Exodus 14:19': {
    '5-7': 'Then the angel of God, who had been leading Israel from the front, moved behind them. The pillar of cloud moved too and stood behind them.',
    '8-10': 'Then the angel of God, who had been going in front of Israel\'s camp, moved behind them. The pillar of cloud also moved from the front and stood behind them.',
  },
  'Exodus 14:20': {
    '5-7': 'The cloud stood between Egypt\'s camp and Israel\'s camp. On one side it made darkness, and on the other side it gave light, so the two camps could not reach each other all night.',
    '8-10': 'The cloud came between the Egyptian camp and the Israelite camp. It brought darkness to one side and light to the other, so the two camps did not come near each other all night.',
  },
  'Exodus 14:21': {
    '5-7': 'Then Moses stretched his hand over the sea. All night the Lord drove the water back with a strong east wind. The sea split open, and the ground became dry.',
    '8-10': 'Then Moses stretched his hand over the sea. All night the Lord drove the sea back with a strong east wind and made the ground dry. The waters were divided.',
  },
  'Exodus 16:13': {
    '5-7': 'That evening quail flew in and covered the camp. In the morning, dew lay all around the camp.',
    '8-10': 'That evening quail came and covered the camp, and in the morning dew lay all around the camp.',
  },
  'Exodus 16:14': {
    '5-7': 'When the dew dried up, thin flaky pieces were left on the ground in the wilderness, like frost spread over the earth.',
    '8-10': 'When the dew lifted, thin flakes were left on the surface of the wilderness, as fine as frost on the ground.',
  },
  'Exodus 8:16': {
    '5-7': 'The Lord said to Moses, "Tell Aaron, \'Stretch out your staff and strike the dust of the ground. The dust will become tiny biting bugs all over Egypt.\'"',
    '8-10': 'The Lord said to Moses, "Tell Aaron, \'Stretch out your staff and strike the dust of the land, so it becomes tiny biting bugs throughout all the land of Egypt.\'"',
  },
  'Exodus 8:17': {
    '5-7': 'They did what the Lord said. Aaron stretched out his hand with his staff and struck the dust of the ground. Tiny bugs came on people and animals, and the dust all over Egypt became tiny bugs.',
    '8-10': 'They did so. Aaron stretched out his hand with his staff and struck the dust of the earth. Tiny biting bugs came on people and animals, and all the dust of the land became tiny bugs throughout Egypt.',
  },
  'Exodus 8:18': {
    '5-7': 'The magicians tried to make tiny bugs with their magic arts, but they could not. The tiny bugs were on people and animals.',
    '8-10': 'The magicians tried with their magic arts to bring out tiny bugs, but they could not. The bugs were on people and animals.',
  },
  'Exodus 8:24': {
    '5-7': 'The Lord did what he said. Thick swarms of flies came into Pharaoh\'s house, into his servants\' houses, and all over Egypt. The land was ruined by the flies.',
    '8-10': 'The Lord did so. Heavy swarms of flies came into Pharaoh\'s house, his servants\' houses, and all the land of Egypt. The land was ruined because of the flies.',
  },
  'Exodus 8:31': {
    '5-7': 'The Lord did what Moses asked and took the flies away from Pharaoh, his servants, and his people. Not one fly remained.',
    '8-10': 'The Lord did what Moses asked and removed the flies from Pharaoh, his servants, and his people. Not one fly remained.',
  },
  'Exodus 17:11': {
    '5-7': 'As Moses held his hand up high, Israel was winning. But whenever his hand came down, Amalek started winning.',
    '8-10': 'Whenever Moses held up his hand, Israel gained the advantage. But whenever his hand dropped, Amalek gained the advantage.',
  },
  'Exodus 17:12': {
    '5-7': 'But Moses\' hands got heavy, and he grew tired. So Aaron and Hur brought a stone for him to sit on. Then they stood beside him, one on each side, and held up his hands until the sun went down.',
    '8-10': 'But Moses\' hands became heavy, and he grew tired. So Aaron and Hur brought a stone and put it under him, and Moses sat on it. They stood beside him, one on each side, and held up his hands until sunset.',
  },
  'Exodus 17:13': {
    '5-7': 'So Joshua defeated Amalek and his people with the sword.',
    '8-10': 'So Joshua defeated Amalek and his people with the sword.',
  },
  'Exodus 19:13': {
    '5-7': '"No one may touch that person. The person must be put to death with stones or arrows. Whether it is an animal or a person, it must not live. When the trumpet sounds long, the people may come near the mountain."',
    '8-10': '"No hand may touch that person. The person must be put to death with stones or arrows. Whether animal or human, it must not live. When the trumpet sounds long, they may come near the mountain."',
  },
  'Exodus 19:5': {
    '5-7': '"Now, if you truly obey my voice and keep my covenant, my serious promise relationship with you, you will be my special treasure among all peoples, because all the earth is mine."',
    '8-10': '"Now if you carefully obey my voice and keep my covenant, my serious promise relationship with you, you will be my treasured possession among all peoples, for all the earth is mine."',
  },
  'Exodus 20:5': {
    '5-7': '"You must not bow down to them or serve them. I, the Lord your God, am jealous for the worship that belongs only to me. I bring the guilt of fathers on children to the third and fourth generation of those who hate me."',
    '8-10': '"You must not bow down to them or serve them, because I, the Lord your God, am jealous for the worship that belongs only to me. I bring the guilt of fathers on children to the third and fourth generation of those who hate me."',
  },
  'Exodus 20:14': {
    '5-7': '"You must not break marriage faithfulness."',
    '8-10': '"You must not commit adultery, which breaks marriage faithfulness."',
  },
  'Exodus 20:17': {
    '5-7': '"You must not set your heart on taking your neighbor\'s house. You must not set your heart on taking your neighbor\'s wife, his male servant, his female servant, his ox, his donkey, or anything that belongs to your neighbor."',
    '8-10': '"You must not covet your neighbor\'s house, setting your heart on taking it for yourself. You must not covet your neighbor\'s wife, his male servant, his female servant, his ox, his donkey, or anything that belongs to your neighbor."',
  },
  'Exodus 21:20': {
    '5-7': '"If a man hits his male or female servant with a stick, and the servant dies right away, the man must surely be punished."',
    '8-10': '"If a man strikes his male or female servant with a stick, and the servant dies under his hand, he must surely be punished."',
  },
  'Exodus 22:18': {
    '5-7': '"A woman who practices evil magic must not be allowed to live."',
    '8-10': '"A woman who practices evil magic must not be allowed to live."',
  },
};

main();

function main() {
  polishExodusAgeText();

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

  console.log(`Reviewed Exodus chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishExodusAgeText() {
  for (const chapterNumber of CHAPTERS) {
    for (const ageRange of AGE_RANGES) {
      const filePath = ageTextPath(chapterNumber, ageRange);
      const content = fs.readFileSync(filePath, 'utf8');
      const verses = extractVerses(content).map(verse => ({
        ...verse,
        body: polishExodusText(verse.body, ageRange, verse.reference),
      }));

      const parts = [
        `# Exodus ${chapterNumber}`,
        '',
        '## Book',
        'Exodus',
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
  }
}

function polishExodusText(text, ageRange, reference) {
  let result = polishKidReadableText(text, ageRange);

  result = result
    .replace(/\bomers\b/g, 'basket measures')
    .replace(/\bomer\b/g, 'basket measure')
    .replace(/\btalents\b/g, 'large weight measures')
    .replace(/\btalent\b/g, 'large weight measure')
    .replace(/\bone fourth of a hin of beaten olive oil\b/g, 'one fourth-measure of beaten olive oil')
    .replace(/\bone fourth of a hin of wine\b/g, 'one fourth-measure of wine')
    .replace(/\bone hin of olive oil\b/g, 'one liquid measure of olive oil')
    .replace(/\bbekah\b/g, 'half-silver weight')
    .replace(/\brods\b/g, 'staffs')
    .replace(/\brod\b/g, 'staff')
    .replace(/\bRods\b/g, 'Staffs')
    .replace(/\bRod\b/g, 'Staff')
    .replace(/\bserpents\b/g, 'snakes')
    .replace(/\bserpent\b/g, 'snake')
    .replace(/\bSerpents\b/g, 'Snakes')
    .replace(/\bSerpent\b/g, 'Snake')
    .replace(/\btaskmasters\b/g, 'harsh work bosses')
    .replace(/\btaskmaster\b/g, 'harsh work boss')
    .replace(/\bTaskmasters\b/g, 'Harsh work bosses')
    .replace(/\bTaskmaster\b/g, 'Harsh work boss')
    .replace(/\bstatutes\b/g, 'instructions')
    .replace(/\bstatute\b/g, 'instruction')
    .replace(/\bStatutes\b/g, 'Instructions')
    .replace(/\bStatute\b/g, 'Instruction')
    .replace(/\bordinances\b/g, 'laws')
    .replace(/\bordinance\b/g, 'law')
    .replace(/\bOrdinances\b/g, 'Laws')
    .replace(/\bOrdinance\b/g, 'Law')
    .replace(/\bdungeon\b/g, 'dark prison')
    .replace(/\bDungeon\b/g, 'Dark prison')
    .replace(/\bephod\b/g, 'priestly vest')
    .replace(/\bEphod\b/g, 'Priestly vest')
    .replace(/\bbreastpiece\b/g, 'chest piece')
    .replace(/\bBreastpiece\b/g, 'Chest piece')
    .replace(/\bmercy seat\b/g, 'atonement cover')
    .replace(/\bMercy seat\b/g, 'Atonement cover')
    .replace(/\bveil\b/g, 'curtain')
    .replace(/\bVeil\b/g, 'Curtain')
    .replace(/\bgarments\b/g, 'clothes')
    .replace(/\bGarments\b/g, 'Clothes')
    .replace(/\btunic\b/g, 'long shirt')
    .replace(/\btunics\b/g, 'long shirts')
    .replace(/\bturban\b/g, 'head wrap')
    .replace(/\bsash\b/g, 'waistband')
    .replace(/\bsashes\b/g, 'waistbands')
    .replace(/\bconsecrate\b/g, 'set apart')
    .replace(/\bconsecrated\b/g, 'set apart')
    .replace(/\bconsecration\b/g, 'setting apart')
    .replace(/\bordain\b/g, 'set apart')
    .replace(/\bordained\b/g, 'set apart')
    .replace(/\bordination\b/g, 'setting apart')
    .replace(/\bsanctuary weight\b/g, 'holy tent weight')
    .replace(/\bholy place silver piece\b/g, 'holy place weight')
    .replace(/\baccording to the holy place weight\b/g, 'by the holy place weight')
    .replace(/\barticles of silver and gold\b/g, 'silver and gold items')
    .replace(/\bfalse witness\b/g, 'false testimony')
    .replace(/\bsorcerers\b/g, 'magic workers')
    .replace(/\bSorcerers\b/g, 'Magic workers')
    .replace(/\bpledge\b/g, 'promise item')
    .replace(/\bno bloodguilt is counted for him\b/g, 'the person is not guilty of bloodshed')
    .replace(/\bbloodguilt is counted\b/g, 'the person is guilty of bloodshed')
    .replace(/\bmust make full restitution\b/g, 'must pay back everything')
    .replace(/\bmust make restitution to its owner\b/g, 'must pay the owner back')
    .replace(/\bmust surely make restitution\b/g, 'must surely pay back what was lost')
    .replace(/\bmust make restitution from\b/g, 'must pay back from')
    .replace(/\bmust make restitution\b/g, 'must pay back what was lost')
    .replace(/\bmake restitution\b/g, 'pay back what was lost')
    .replace(/\bFeast of Unleavened Bread\b/g, 'Feast of Bread Made Without Yeast')
    .replace(/\bfeast of unleavened bread\b/g, 'feast of bread made without yeast')
    .replace(/\bunleavened wafers\b/g, 'thin wafers made without yeast')
    .replace(/\bunleavened wafer\b/g, 'thin wafer made without yeast')
    .replace(/\bunleavened cakes\b/g, 'cakes made without yeast')
    .replace(/\bunleavened cake\b/g, 'cake made without yeast')
    .replace(/\bunleavened bread\b/g, 'bread made without yeast')
    .replace(/\bUnleavened bread\b/g, 'Bread made without yeast')
    .replace(/\bleavened bread\b/g, 'bread made with yeast')
    .replace(/\banything leavened\b/g, 'anything made with yeast')
    .replace(/\bnothing leavened\b/g, 'nothing made with yeast')
    .replace(/\bbefore it was leavened\b/g, 'before it had risen')
    .replace(/\bhandbreadth\b/g, 'palm-width')
    .replace(/\bCast\b/g, 'Make')
    .replace(/\bcast\b/g, 'make')
    .replace(/\bOverlay\b/g, 'Cover')
    .replace(/\boverlay\b/g, 'cover')
    .replace(/\boverlaid\b/g, 'covered')
    .replace(/\bshall\b/g, 'will');

  if (ageRange === '5-7') {
    result = result
      .replace(/\btabernacle\b/g, 'holy tent')
      .replace(/\bTabernacle\b/g, 'Holy tent')
      .replace(/\bcherubim\b/g, 'mighty heavenly guardians')
      .replace(/\bCherubim\b/g, 'Mighty heavenly guardians')
      .replace(/\bcherub\b/g, 'mighty heavenly guardian')
      .replace(/\bCherub\b/g, 'Mighty heavenly guardian')
      .replace(/\banointing oil\b/g, 'special setting-apart oil')
      .replace(/\banointing\b/g, 'setting apart')
      .replace(/\banoint\b/g, 'set apart with oil')
      .replace(/\banointed\b/g, 'set apart with oil')
      .replace(/\batonement cover\b/g, 'cover of the ark')
      .replace(/\bfragrant\b/g, 'sweet-smelling')
      .replace(/\bcommit adultery\b/g, 'break marriage faithfulness')
      .replace(/\bcovet\b/g, 'want to take')
      .replace(/\bnakedness\b/g, 'body uncovered')
      .replace(/\blivestock\b/g, 'farm animals');
  } else {
    result = result
      .replace(/\banointing oil\b/g, 'special anointing oil')
      .replace(/\banoint\b/g, 'set apart with oil')
      .replace(/\banointed\b/g, 'set apart with oil')
      .replace(/\bcommit adultery\b/g, 'commit adultery, which breaks marriage faithfulness')
      .replace(/\bnakedness\b/g, 'body being uncovered');
  }

  result = result
    .replace(/\bbreaking marriage faithfulness(?:, breaking marriage faithfulness)+\b/g, 'breaking marriage faithfulness')
    .replace(/\bcommit adultery, which breaks marriage faithfulness(?:, breaking marriage faithfulness)+\b/g, 'commit adultery, which breaks marriage faithfulness')
    .replace(/\ba bunch of leafy hyssop branch\b/g, 'a small bunch of leafy hyssop branches')
    .replace(/\bTake a small bunch of leafy hyssop branch\b/g, 'Take a small bunch of leafy hyssop branches')
    .replace(/\bsweet-smelling sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\bfragrant sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\b(?:special\s+)+anointing oil\b/g, 'special anointing oil')
    .replace(/\bholy special anointing oil\b/g, 'holy anointing oil')
    .replace(/\b(?:special\s+)+setting-apart oil\b/g, 'special setting-apart oil')
    .replace(/\bspecial setting-apart oil oil\b/g, 'special setting-apart oil')
    .replace(/\bspecial anointing oil oil\b/g, 'special anointing oil')
    .replace(/\bset apart with oiling\b/g, 'setting apart')
    .replace(/\bset apart with oiling oil\b/g, 'anointing oil')
    .replace(/\bset apart with oil him\b/g, 'set him apart with oil')
    .replace(/\bset apart with oil them\b/g, 'set them apart with oil')
    .replace(/\bset apart with oil it\b/g, 'set it apart with oil')
    .replace(/\bset apart them\b/g, 'set them apart')
    .replace(/\bset apart themselves\b/g, 'prepare themselves as holy')
    .replace(/\bto bring him apart\b/g, 'to set him apart')
    .replace(/\bbring him apart with oil\b/g, 'set him apart with oil')
    .replace(/\bUse it to set apart with oil the tent of meeting\b/g, 'Use it to set the tent of meeting apart with oil')
    .replace(/\bUse it to set the tent of meeting apart with oil and the ark of the testimony\b/g, 'Use it to set the tent of meeting and the ark of the testimony apart with oil')
    .replace(/\bset apart with oil the tabernacle and everything in it\b/g, 'set the tabernacle and everything in it apart with oil')
    .replace(/\bset apart with oil the holy tent and everything inside it\b/g, 'set the holy tent and everything inside it apart with oil')
    .replace(/\bSet the altar apart with oil for burned offerings and all its tools\b/g, 'Set the altar for burned offerings and all its tools apart with oil')
    .replace(/\bSet the altar apart with oil for burned offerings and all its utensils\b/g, 'Set the altar for burned offerings and all its utensils apart with oil')
    .replace(/\bSet the basin apart with oil and its stand, and set it apart\b/g, 'Set the basin and its stand apart with oil')
    .replace(/\bThey will be set apart with oil and set apart in those clothes\b/g, 'They will be set apart with oil while wearing those clothes')
    .replace(/\bAnoint them, set apart them, and set them apart\b/g, 'Set them apart with oil, appoint them, and make them holy')
    .replace(/\bAnoint Aaron and his sons\b/g, 'Set Aaron and his sons apart with oil')
    .replace(/\bAnoint the altar\b/g, 'Set the altar apart with oil')
    .replace(/\bAnoint the basin\b/g, 'Set the basin apart with oil')
    .replace(/\bAnoint him and bring him apart\b/g, 'Set him apart with oil')
    .replace(/\bAnoint them as you set apart with oil their father\b/g, 'Set them apart with oil as you set their father apart with oil')
    .replace(/\bsetting apart meat\b/g, 'meat from the setting-apart ceremony')
    .replace(/\bcover their body uncovered\b/g, 'cover their lower bodies')
    .replace(/\bcover their body being uncovered\b/g, 'cover their lower bodies')
    .replace(/\bso your body uncovered is not uncovered on it\b/g, 'so your body stays covered there')
    .replace(/\bso your body being uncovered is not exposed on it\b/g, 'so your body stays covered there')
    .replace(/\bserve Me\b/g, 'serve me')
    .replace(/\btwo male sheep with nothing wrong with it\b/g, 'two male sheep with nothing wrong with them')
    .replace(/\bsetting apart male sheep\b/g, 'male sheep used to set them apart')
    .replace(/\bto set apart them and set them apart\b/g, 'to set them apart')
    .replace(/\bOrdain them\b/g, 'Set them apart')
    .replace(/\bwave them as an offering lifted before the Lord\b/g, 'lift them before the Lord as an offering')
    .replace(/\bwaved them as an offering lifted before the Lord\b/g, 'lifted them before the Lord as an offering')
    .replace(/\bthe parts waved and lifted\b/g, 'the parts lifted before the Lord')
    .replace(/\bwill not surely\b/g, 'will not')
    .replace(/\bone-fourth of a hin of beaten olive oil\b/g, 'one-fourth measure of beaten olive oil')
    .replace(/\bone-fourth of a hin of wine\b/g, 'one-fourth measure of wine')
    .replace(/\bWave them as an offering lifted before the Lord\b/g, 'Lift them before the Lord as an offering')
    .replace(/\bwave them as an offering lifted before the Lord\b/g, 'lift them before the Lord as an offering')
    .replace(/\ban basket measure\b/g, 'a basket measure')
    .replace(/\bAn basket measure\b/g, 'A basket measure')
    .replace(/\ban priestly vest\b/g, 'a priestly vest')
    .replace(/\bAn priestly vest\b/g, 'A priestly vest')
    .replace(/\ba atonement cover\b/g, 'an atonement cover')
    .replace(/\bA atonement cover\b/g, 'An atonement cover')
    .replace(/\ba instruction\b/g, 'an instruction')
    .replace(/\bA instruction\b/g, 'An instruction')
    .replace(/\ban law\b/g, 'a law')
    .replace(/\bAn law\b/g, 'A law')
    .replace(/\bgroups out of Egypt\b/g, 'people out of Egypt')
    .replace(/\bshot through\b/g, 'shot with arrows')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return STORY_REVISIONS[reference]?.[ageRange] || result;
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

function readAgeChapter(chapterNumber, ageRange) {
  return extractVerses(fs.readFileSync(ageTextPath(chapterNumber, ageRange), 'utf8'));
}

function extractVerses(content) {
  const verseSection = extractSection(content, '## Verses') || content;
  const verseRegex = /^###\s+(Exodus\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+Exodus\s+\d+:\d+\s*$|(?![\s\S]))/gm;
  return [...verseSection.matchAll(verseRegex)].map(match => ({
    reference: match[1].trim(),
    body: cleanText(match[2]),
  }));
}

function extractOriginals(content) {
  const regex = /^###\s+Exodus\s+(\d+):(\d+)[\s\S]*?\*\*Original Reference\*\*:\s*Exodus\s+\d+:\d+\s+-\s*(.*)$/gm;
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
    `# Exodus Chapter ${chapterNumber}`,
    '',
    '## Book Overview',
    `Exodus ${chapterNumber} continues the rescue-and-covenant story. ${data.summary}`,
    '',
    '## Important Keywords',
    ...data.keywords.map(keyword => `- ${keyword}: ${VOCABULARY[keyword] || 'A key word that helps explain this chapter.'}`),
    '',
    '## Verse-by-Verse Translation',
    '',
  ];

  for (let verseNumber = 1; verseNumber <= verseCount; verseNumber += 1) {
    const reference = `Exodus ${chapterNumber}:${verseNumber}`;
    const original = originals.get(verseNumber) || '';
    const age57 = findVerse(ageTexts['5-7'], reference);
    const age810 = findVerse(ageTexts['8-10'], reference);
    const note = getNote(chapterNumber, verseNumber);
    const keywords = verseKeywords(`${original} ${age57} ${age810}`, data.keywords);
    const crossRefs = CROSS_REFS[`${chapterNumber}:${verseNumber}`] || [];

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
        parts.push(`- ${keyword}: ${VOCABULARY[keyword] || 'A key word that helps explain this chapter.'}`);
      }
      parts.push('');
    }

    if (crossRefs.length) {
      parts.push('**Cross-References**:');
      for (const crossRef of crossRefs) parts.push(`- ${crossRef}`);
      parts.push('');
    }

    parts.push('---');
    parts.push('');
  }

  parts.push('## Chapter Summary');
  parts.push(data.summary);
  parts.push('');
  parts.push('## Key Lessons for Children');
  getLessons(chapterNumber).forEach(([title, body], index) => {
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
  parts.push('1. What did the Lord say, show, or do in this chapter?');
  parts.push('2. What picture did the chapter help you see?');
  parts.push('');
  parts.push('### Ages 8-10');
  parts.push('1. How does this chapter show rescue, covenant, worship, or God\'s presence?');
  parts.push('2. Which detail should be explained carefully so the meaning stays true?');
  parts.push('');
  parts.push('## Prayer');
  parts.push(`Lord, help us read Exodus ${chapterNumber} truthfully. Teach us to remember your rescue, honor your covenant words, and worship you with humble hearts. Amen.`);
  parts.push('');

  return `${parts.join('\n').replace(/\n+$/g, '')}\n`;
}

function getChapterData(chapterNumber) {
  const entry = CHAPTER_DATA[chapterNumber];
  if (!entry) throw new Error(`Missing Exodus ${chapterNumber} review data.`);
  return { summary: entry[0], keywords: entry[1], memory: entry[2] };
}

function getLessons(chapterNumber) {
  if (chapterNumber <= 15) {
    return [
      ['The Lord rescues', 'Exodus shows that the Lord sees suffering, keeps his covenant, and saves his people.'],
      ['The Lord judges evil', 'Pharaoh\'s hardness and Egypt\'s oppression are answered by God\'s righteous power.'],
      ['The Lord makes himself known', 'The signs and wonders show Israel and Egypt who the Lord is.'],
    ];
  }
  if (chapterNumber <= 24) {
    return [
      ['Rescued people learn God\'s ways', 'The Lord gives commands after rescue so his people know how to live with him and one another.'],
      ['God is holy', 'Sinai teaches that God is near to his people and must be honored with reverence.'],
      ['Covenant words matter', 'Israel hears, answers, and is called to keep the words God has spoken.'],
    ];
  }
  if (chapterNumber === 32 || chapterNumber === 33 || chapterNumber === 34) {
    return [
      ['Idols cannot replace the Lord', 'The golden calf shows how serious false worship is.'],
      ['Mercy is needed after sin', 'Moses pleads for the people, and the Lord reveals his mercy and justice.'],
      ['God\'s presence is precious', 'Moses asks for the Lord himself to go with his people.'],
    ];
  }
  return [
    ['God provides a way to dwell with his people', 'The holy tent details show that worship and nearness to God happen by his command.'],
    ['Willing gifts can serve holy work', 'The people bring materials and skills for the tabernacle.'],
    ['God\'s glory leads his people', 'Exodus ends with the Lord filling the tabernacle and guiding Israel.'],
  ];
}

function getNote(chapterNumber, verseNumber) {
  const key = `${chapterNumber}:${verseNumber}`;
  if (NOTES[key]) return NOTES[key];
  const data = getChapterData(chapterNumber);
  if (verseNumber === data.memory) {
    return 'This is a good memory verse for the chapter. Preserve the exact rescue, command, promise, or worship focus of the verse.';
  }
  return null;
}

function verseKeywords(text, chapterKeywords) {
  const normalized = text.toLowerCase();
  return chapterKeywords
    .filter(keyword => normalized.includes(keyword.toLowerCase()))
    .slice(0, 5);
}

function findVerse(verses, reference) {
  return verses.find(verse => verse.reference === reference)?.body || '';
}

function formatMemory(chapterNumber, verseNumber, verses) {
  const reference = `Exodus ${chapterNumber}:${verseNumber}`;
  const verse = findVerse(verses, reference);
  return `${verse} - ${reference}`;
}

function extractSection(content, heading) {
  const regex = new RegExp(`${escapeRegex(heading)}\\s*\\r?\\n+([\\s\\S]*?)(?=\\r?\\n##\\s|(?![\\s\\S]))`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
