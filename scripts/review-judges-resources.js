#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = 'judges';
const BOOK_NAME = 'Judges';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 21 }, (_, index) => index + 1);

const BOOK_OVERVIEW =
  'Judges shows Israel turning from the Lord again and again, and the Lord raising rescuers while exposing how badly his people needed faithful covenant leadership.';

const RESOURCE_DATA = {
  1: {
    summary: 'After Joshua dies, Israel asks the Lord who should go first against the Canaanites. Judah leads, several tribes receive victories, but many tribes leave Canaanite people in the land instead of fully obeying the Lord.',
    lessons: [
      ['God leads after leaders die', 'The Lord still answers Israel after Joshua is gone.'],
      ['Incomplete obedience matters', 'The chapter shows victories, but also warns that leaving sin in place brings trouble later.'],
    ],
  },
  2: {
    summary: 'The angel of the Lord rebukes Israel at Bochim because the people have not kept covenant faithfulness. A new generation grows up that does not know the Lord, and Judges describes the repeated cycle of sin, suffering, crying out, and the Lord raising judges to rescue them.',
    lessons: [
      ['Children need to know the Lord', 'The next generation forgets the Lord and his works.'],
      ['The Lord is merciful and just', 'He disciplines sin, yet raises rescuers when his people groan.'],
    ],
  },
  3: {
    summary: 'Israel serves false gods and suffers under enemy rulers, but the Lord raises Othniel, Ehud, and Shamgar to rescue them. Ehud uses a hidden plan to defeat Eglon king of Moab, and Israel receives rest.',
    lessons: [
      ['Sin brings bitter trouble', 'Israel suffers when they turn from the Lord.'],
      ['God can rescue through unexpected people', 'The Lord uses Othniel, Ehud, and Shamgar in different ways.'],
    ],
  },
  4: {
    summary: 'Israel is treated harshly by Jabin and Sisera, but the Lord speaks through Deborah and calls Barak to battle. The Lord throws Sisera\'s army into confusion, and Jael kills Sisera, so Israel is rescued.',
    lessons: [
      ['The Lord gives his word', 'Deborah speaks the Lord\'s command to Barak.'],
      ['Victory belongs to the Lord', 'The battle turns because the Lord acts for Israel.'],
    ],
  },
  5: {
    summary: 'Deborah and Barak sing a song praising the Lord for rescuing Israel. The song remembers the tribes that helped, the tribes that stayed back, the defeat of Sisera, and the blessing of those who love the Lord.',
    lessons: [
      ['God\'s works should be remembered', 'The song teaches Israel to remember the Lord\'s victory.'],
      ['Love for the Lord matters', 'The song ends by blessing those who love him.'],
    ],
  },
  6: {
    summary: 'Midian crushes Israel, and the people cry to the Lord. The Lord calls Gideon while he is hiding grain, promises to be with him, commands him to tear down Baal\'s altar, and patiently gives signs as Gideon struggles with fear.',
    lessons: [
      ['God sees fearful people', 'The Lord meets Gideon while he feels weak.'],
      ['The Lord must be worshiped alone', 'Gideon must tear down the altar of Baal.'],
    ],
  },
  7: {
    summary: 'The Lord reduces Gideon\'s army so Israel cannot boast that they saved themselves. With only three hundred men, trumpets, jars, and torches, Gideon obeys the Lord, and the Midianite camp falls into panic.',
    lessons: [
      ['God receives the glory', 'The small army shows that victory comes from the Lord.'],
      ['Faith obeys while afraid', 'Gideon is strengthened and then acts on the Lord\'s word.'],
    ],
  },
  8: {
    summary: 'Gideon finishes the battle against Midian but also shows weakness afterward. He refuses to be king because the Lord should rule Israel, yet he makes an ephod that becomes a snare, and after his death Israel turns back to Baal.',
    lessons: [
      ['The Lord is king', 'Gideon says the Lord should rule over Israel.'],
      ['Good victories do not excuse later sin', 'Gideon\'s ephod becomes a danger to Israel.'],
    ],
  },
  9: {
    summary: 'Abimelech violently makes himself king after killing his brothers, but Jotham warns that treachery will bring judgment. Abimelech and Shechem destroy each other, and God repays their wickedness.',
    lessons: [
      ['Power without righteousness destroys', 'Abimelech grabs rule through violence.'],
      ['God sees wickedness', 'The chapter says God repaid Abimelech and Shechem for evil.'],
    ],
  },
  10: {
    summary: 'After Tola and Jair, Israel again serves many false gods and falls under harsh treatment from enemies. The people cry to the Lord, confess their sin, remove foreign gods, and the Lord is grieved by Israel\'s misery.',
    lessons: [
      ['False gods cannot rescue', 'Israel serves many idols, but they cannot save.'],
      ['Repentance turns from idols', 'Israel puts away foreign gods and serves the Lord.'],
    ],
  },
  11: {
    summary: 'Jephthah is rejected by his family but later called to lead Gilead against Ammon. The Spirit of the Lord comes upon him, but Jephthah makes a rash vow that brings deep sorrow to his daughter and his house.',
    lessons: [
      ['Rejected people are not forgotten', 'Jephthah becomes the leader people ask for in trouble.'],
      ['Words before God are serious', 'Jephthah\'s vow is a warning, not an example to copy.'],
    ],
  },
  12: {
    summary: 'Jephthah fights with Ephraim after the Ammonite victory, and many people die in tribal conflict. The chapter then briefly records Ibzan, Elon, and Abdon judging Israel.',
    lessons: [
      ['Pride can turn brothers against brothers', 'Ephraim and Gilead fight each other after a rescue.'],
      ['Judges were temporary leaders', 'The short lists show leadership passing from one judge to another.'],
    ],
  },
  13: {
    summary: 'The angel of the Lord announces Samson\'s birth to Manoah\'s wife. Samson is to be set apart to God from birth, and he will begin to save Israel from the Philistines.',
    lessons: [
      ['God begins rescue before people see it', 'Samson is promised before he is born.'],
      ['Children belong to the Lord', 'Samson\'s life is set apart for God\'s purpose.'],
    ],
  },
  14: {
    summary: 'Samson goes to Timnah, kills a lion by the Spirit of the Lord, and gives a riddle at his wedding feast. The Philistines pressure his wife, and Samson\'s anger brings conflict.',
    lessons: [
      ['Strength is from the Lord', 'Samson\'s power comes by the Spirit of the Lord.'],
      ['Desire without wisdom brings trouble', 'Samson\'s choices lead into conflict.'],
    ],
  },
  15: {
    summary: 'Samson fights the Philistines after they wrong him and his wife. The Spirit of the Lord rushes on him, he strikes many Philistines with a donkey\'s jawbone, and the Lord gives him water when he cries out.',
    lessons: [
      ['The Lord can strengthen the weak and thirsty', 'After victory, Samson still needs God to keep him alive.'],
      ['Sinful conflict grows destructive', 'Personal revenge and Philistine cruelty lead to more violence.'],
    ],
  },
  16: {
    summary: 'Samson is betrayed by Delilah after he tells the secret connected to his Nazirite hair. The Philistines blind him and imprison him, but the Lord hears Samson\'s final prayer and brings judgment on the Philistines.',
    lessons: [
      ['Sin can make strong people weak', 'Samson\'s choices lead to capture and suffering.'],
      ['The Lord still hears prayer', 'Samson cries to the Lord at the end.'],
    ],
  },
  17: {
    summary: 'Micah makes an idol shrine in his house and hires a Levite as his priest. The chapter shows spiritual confusion in Israel when everyone does what seems right in his own eyes.',
    lessons: [
      ['Worship must follow the Lord\'s word', 'Micah uses religious words while making idols.'],
      ['Doing what seems right is not enough', 'The chapter warns against life without faithful obedience.'],
    ],
  },
  18: {
    summary: 'The tribe of Dan searches for land, steals Micah\'s carved image, and takes his Levite priest. They capture Laish and set up idol worship, showing Israel\'s deep spiritual disorder.',
    lessons: [
      ['Idols spread trouble', 'Micah\'s idol becomes a snare for a whole tribe.'],
      ['Success is not the same as faithfulness', 'Dan takes a city but sets up false worship.'],
    ],
  },
  19: {
    summary: 'A Levite travels with his secondary wife, and terrible wickedness happens in Gibeah. Her death shocks Israel, and the chapter shows how dark life becomes when people reject God\'s ways.',
    lessons: [
      ['God\'s word names evil as evil', 'The chapter does not pretend wickedness is normal or good.'],
      ['People need righteous leadership', 'The horror prepares for the book\'s repeated warning that Israel had no king.'],
    ],
  },
  20: {
    summary: 'Israel gathers to judge the evil done in Gibeah, but Benjamin refuses to hand over the guilty men. A terrible civil war follows, and Israel seeks the Lord as many people die.',
    lessons: [
      ['Sin can wound a whole people', 'One city\'s wickedness becomes a national crisis.'],
      ['Judgment is serious and sorrowful', 'Israel weeps before the Lord during the war.'],
    ],
  },
  21: {
    summary: 'After the war with Benjamin, Israel grieves because one tribe is almost lost. The people try to fix the problem through more broken plans, and the book ends by saying everyone did what was right in his own eyes.',
    lessons: [
      ['Broken plans cannot heal rebellion', 'Israel tries to repair disaster without true covenant health.'],
      ['God\'s people need faithful rule', 'The final verse shows the need for righteous leadership under the Lord.'],
    ],
  },
};

const MEMORY_REFERENCES = {
  1: 'Judges 1:2',
  2: 'Judges 2:16',
  3: 'Judges 3:9',
  4: 'Judges 4:14',
  5: 'Judges 5:31',
  6: 'Judges 6:12',
  7: 'Judges 7:2',
  8: 'Judges 8:23',
  9: 'Judges 9:56',
  10: 'Judges 10:16',
  11: 'Judges 11:29',
  12: 'Judges 12:7',
  13: 'Judges 13:5',
  14: 'Judges 14:6',
  15: 'Judges 15:18',
  16: 'Judges 16:28',
  17: 'Judges 17:6',
  18: 'Judges 18:31',
  19: 'Judges 19:30',
  20: 'Judges 20:26',
  21: 'Judges 21:25',
};

const STORY_REVISIONS = {
  'Judges 1:1': {
    all: 'After Joshua died, the people of Israel asked the Lord, "Who should go up first for us against the Canaanites to fight them?"',
  },
  'Judges 1:2': {
    all: 'The Lord said, "Judah must go up. Look, I have given the land into Judah\'s hand."',
  },
  'Judges 1:3': {
    all: 'Judah said to Simeon his brother, "Come up with me into the land given to me. Let us fight the Canaanites together, and then I will go with you into your land." So Simeon went with him.',
  },
  'Judges 1:27': {
    all: 'Manasseh did not drive out the people living in Beth Shean, Taanach, Dor, Ibleam, Megiddo, or their villages. The Canaanites were determined to stay in that land.',
  },
  'Judges 1:28': {
    all: 'When Israel grew strong, they forced the Canaanites to work for them, but they did not completely drive them out.',
  },
  'Judges 2:1': {
    all: 'The angel of the Lord went up from Gilgal to Bochim and said, "I brought you up out of Egypt and into the land I swore to give your ancestors. I said, \'I will never break my covenant with you.',
  },
  'Judges 2:2': {
    all: 'You must not make a covenant with the people of this land. You must tear down their altars.\' But you have not listened to my voice. What is this you have done?',
  },
  'Judges 2:3': {
    all: 'So now I say that I will not drive them out before you. They will become trouble at your sides, and their gods will become a trap for you."',
  },
  'Judges 2:10': {
    all: 'After Joshua\'s generation died, another generation grew up. They did not know the Lord or the work he had done for Israel.',
  },
  'Judges 2:11': {
    all: 'Then the people of Israel did what was evil in the Lord\'s sight and served the Baals.',
  },
  'Judges 2:12': {
    all: 'They left the Lord, the God of their ancestors, who had brought them out of Egypt. They followed false gods from the peoples around them, bowed down to them, and stirred the Lord to anger.',
  },
  'Judges 2:16': {
    all: 'Then the Lord raised up judges, leaders and rescuers, who saved them from the power of those who were taking from them.',
  },
  'Judges 2:18': {
    all: 'Whenever the Lord raised up a judge for them, the Lord was with that judge. He saved them from their enemies all the days of that judge, because the Lord had compassion when they groaned under those who treated them harshly.',
  },
  'Judges 2:19': {
    all: 'But when the judge died, the people turned back and acted even worse than their ancestors. They followed false gods, served them, and bowed down to them. They would not give up their stubborn and evil ways.',
  },
  'Judges 3:7': {
    all: 'The people of Israel did what was evil in the Lord\'s sight. They forgot the Lord their God and served the Baals and the Asherahs.',
  },
  'Judges 3:9': {
    all: 'When the people of Israel cried out to the Lord, the Lord raised up a rescuer for them: Othniel son of Kenaz, Caleb\'s younger brother.',
  },
  'Judges 3:10': {
    all: 'The Spirit of the Lord came on Othniel. He judged Israel and went out to battle. The Lord gave Cushan Rishathaim king of Aram into his hand, and Othniel was stronger than him.',
  },
  'Judges 3:12': {
    all: 'Again the people of Israel did what was evil in the Lord\'s sight. Because they did evil, the Lord allowed Eglon king of Moab to become strong against Israel.',
  },
  'Judges 3:15': {
    all: 'Then the people of Israel cried out to the Lord, and the Lord raised up Ehud son of Gera as a rescuer. Ehud was from Benjamin and was left-handed. Israel sent him to bring forced payment to Eglon king of Moab.',
  },
  'Judges 3:16': {
    all: 'Ehud made a short two-edged sword and strapped it under his clothes on his right thigh.',
  },
  'Judges 3:20': {
    all: 'Ehud came near while Eglon was sitting alone in his cool upper room. Ehud said, "I have a message from God for you." Eglon rose from his seat.',
  },
  'Judges 3:21': {
    all: 'Then Ehud reached with his left hand, drew the sword from his right thigh, and pushed it into Eglon\'s belly.',
  },
  'Judges 3:22': {
    all: 'The handle went in after the blade, and the fat closed over the blade because Ehud did not pull the sword out. Eglon died.',
  },
  'Judges 3:28': {
    all: 'Ehud said to them, "Follow me, because the Lord has given your enemies, the Moabites, into your hand." So they followed him and took the Jordan River crossings against Moab. They did not let anyone cross.',
  },
  'Judges 3:31': {
    all: 'After Ehud came Shamgar son of Anath. He struck down six hundred Philistines with an ox goad, a long tool for guiding oxen, and he also rescued Israel.',
  },
  'Judges 4:4': {
    all: 'Deborah was a prophetess, the wife of Lappidoth. She was judging Israel at that time.',
  },
  'Judges 4:5': {
    all: 'She would sit under Deborah\'s palm tree between Ramah and Bethel in the hill country of Ephraim, and the people of Israel came up to her for judgment.',
  },
  'Judges 4:6': {
    all: 'Deborah sent for Barak son of Abinoam from Kedesh in Naphtali. She said to him, "Hasn\'t the Lord, the God of Israel, commanded you? Go to Mount Tabor. Take ten thousand men from Naphtali and Zebulun with you.',
  },
  'Judges 4:7': {
    all: 'The Lord says, \'I will draw Sisera, the commander of Jabin\'s army, to you at the Kishon River with his chariots and army, and I will give him into your hand.\'"',
  },
  'Judges 4:8': {
    all: 'Barak said to Deborah, "If you will go with me, I will go. But if you will not go with me, I will not go."',
  },
  'Judges 4:9': {
    all: 'Deborah said, "I will surely go with you. But the honor of the victory will not be yours, because the Lord will give Sisera into the hand of a woman." Then Deborah went with Barak to Kedesh.',
  },
  'Judges 4:14': {
    all: 'Deborah said to Barak, "Get up! This is the day the Lord has given Sisera into your hand. Hasn\'t the Lord gone out before you?" So Barak went down from Mount Tabor, and ten thousand men followed him.',
  },
  'Judges 4:15': {
    all: 'The Lord threw Sisera, all his chariots, and all his army into confusion before Barak. Sisera got down from his chariot and ran away on foot.',
  },
  'Judges 4:21': {
    all: 'While Sisera slept deeply from tiredness, Jael took a tent peg and hammer. She went quietly to him and struck the peg through his temple into the ground, and he died.',
  },
  'Judges 4:23': {
    all: 'So on that day God humbled Jabin king of Canaan before the people of Israel.',
  },
  'Judges 5:3': {
    all: 'Deborah and Barak sang, "Hear this, you kings. Listen, you rulers. I will sing to the Lord. I will sing praise to the Lord, the God of Israel.',
  },
  'Judges 5:31': {
    all: 'So let all your enemies die, Lord. But let those who love him be like the sun when it rises in its strength." Then the land had rest for forty years.',
  },
  'Judges 6:1': {
    all: 'The people of Israel did what was evil in the Lord\'s sight, and the Lord gave them into the power of Midian for seven years.',
  },
  'Judges 6:2': {
    all: 'Midian\'s power was heavy on Israel. Because of Midian, the people of Israel made hiding places in mountains, caves, and strongholds.',
  },
  'Judges 6:6': {
    all: 'Israel became very poor because of Midian, and the people of Israel cried out to the Lord.',
  },
  'Judges 6:11': {
    all: 'The angel of the Lord came and sat under the oak at Ophrah, which belonged to Joash the Abiezrite. Joash\'s son Gideon was beating wheat in a winepress to hide it from Midian.',
  },
  'Judges 6:12': {
    all: 'The angel of the Lord appeared to Gideon and said, "The Lord is with you, mighty warrior."',
  },
  'Judges 6:13': {
    all: 'Gideon said, "Please, my lord, if the Lord is with us, why has all this happened? Where are all his wonderful works that our ancestors told us about, saying, \'Didn\'t the Lord bring us up from Egypt?\' But now the Lord has left us and given us into Midian\'s hand."',
  },
  'Judges 6:14': {
    all: 'The Lord turned to Gideon and said, "Go in this strength of yours and save Israel from Midian\'s hand. Am I not sending you?"',
  },
  'Judges 6:15': {
    all: 'Gideon said, "Please, Lord, how can I save Israel? My family is the weakest in Manasseh, and I am the least in my father\'s house."',
  },
  'Judges 6:16': {
    all: 'The Lord said to him, "Surely I will be with you, and you will strike Midian as one man."',
  },
  'Judges 6:25': {
    all: 'That night the Lord told Gideon, "Take your father\'s bull and a second bull seven years old. Tear down your father\'s altar to Baal, and cut down the Asherah pole beside it.',
  },
  'Judges 6:27': {
    all: 'So Gideon took ten of his servants and did what the Lord told him. But because he feared his family and the men of the city, he did it at night instead of during the day.',
  },
  'Judges 6:36': {
    all: 'Gideon said to God, "If you will save Israel by my hand, just as you have spoken,',
  },
  'Judges 7:2': {
    all: 'The Lord said to Gideon, "You have too many people with you for me to give Midian into their hand. Israel might boast against me and say, \'My own hand saved me.\'',
  },
  'Judges 7:7': {
    all: 'The Lord said to Gideon, "With the three hundred men who lapped the water, I will save you and give Midian into your hand. Let all the others go home."',
  },
  'Judges 7:13': {
    all: 'When Gideon came near, a man was telling his friend a dream. He said, "I dreamed that a loaf of barley bread rolled into Midian\'s camp. It struck a tent so hard that the tent fell flat."',
  },
  'Judges 7:15': {
    all: 'When Gideon heard the dream and its meaning, he worshiped. Then he returned to Israel\'s camp and said, "Get up, because the Lord has given Midian\'s camp into your hand!"',
  },
  'Judges 7:20': {
    all: 'The three groups blew the trumpets, smashed the jars, held the torches in their left hands, and held the trumpets in their right hands to blow them. They shouted, "A sword for the Lord and for Gideon!"',
  },
  'Judges 7:22': {
    all: 'When the three hundred trumpets sounded, the Lord made the men in the camp turn their swords against one another. The army ran away toward Beth Shittah, Zererah, and the border of Abel Meholah near Tabbath.',
  },
  'Judges 8:22': {
    all: 'The men of Israel said to Gideon, "Rule over us, you, your son, and your grandson too, because you have saved us from Midian\'s hand."',
  },
  'Judges 8:23': {
    all: 'Gideon said to them, "I will not rule over you, and my son will not rule over you. The Lord will rule over you."',
  },
  'Judges 8:27': {
    all: 'Gideon made the gold into an ephod, a special priestly object, and put it in his city, Ophrah. All Israel went after it there, and it became a snare to Gideon and his family.',
  },
  'Judges 8:33': {
    all: 'After Gideon died, the people of Israel turned back and chased after the Baals. They made Baal Berith their god.',
  },
  'Judges 9:5': {
    all: 'Abimelech went to his father\'s house at Ophrah and killed his brothers, the sons of Jerubbaal, seventy men, on one stone. But Jotham, Jerubbaal\'s youngest son, hid and escaped.',
  },
  'Judges 9:7': {
    all: 'When Jotham heard what had happened, he stood on top of Mount Gerizim and cried out, "Listen to me, leaders of Shechem, so God may listen to you.',
  },
  'Judges 9:56': {
    all: 'In this way God repaid the wickedness Abimelech had done to his father by killing his seventy brothers.',
  },
  'Judges 9:57': {
    all: 'God also brought back on the men of Shechem all their wickedness. The curse of Jotham son of Jerubbaal came on them.',
  },
  'Judges 10:6': {
    all: 'The people of Israel again did what was evil in the Lord\'s sight. They served the Baals, the Ashtaroth, and the gods of Aram, Sidon, Moab, Ammon, and the Philistines. They left the Lord and did not serve him.',
  },
  'Judges 10:10': {
    all: 'The people of Israel cried out to the Lord, "We have sinned against you, because we have left our God and served the Baals."',
  },
  'Judges 10:13': {
    all: 'The Lord said, "Yet you left me and served false gods. Therefore I will not save you again.',
  },
  'Judges 10:15': {
    all: 'The people of Israel said to the Lord, "We have sinned. Do to us whatever seems good to you, but please rescue us today."',
  },
  'Judges 10:16': {
    all: 'Then they removed the foreign gods from among them and served the Lord. And the Lord was grieved by Israel\'s misery.',
  },
  'Judges 11:1': {
    all: 'Jephthah the Gileadite was a brave fighting man. His father was Gilead, but his mother was a woman whose life had been sinful.',
  },
  'Judges 11:2': {
    all: 'Gilead\'s wife also had sons. When they grew up, they drove Jephthah away and said, "You will not receive a share in our father\'s house, because you are the son of another woman."',
  },
  'Judges 11:29': {
    all: 'Then the Spirit of the Lord came on Jephthah. He passed through Gilead and Manasseh, through Mizpah of Gilead, and from there he went on toward the Ammonites.',
  },
  'Judges 11:30': {
    all: 'Jephthah made a vow to the Lord and said, "If you will truly give the Ammonites into my hand,',
  },
  'Judges 11:31': {
    all: 'then whatever comes out from the doors of my house to meet me when I return in peace from the Ammonites will belong to the Lord, and I will offer it up as a burned offering."',
  },
  'Judges 11:34': {
    all: 'When Jephthah came home to Mizpah, his daughter came out to meet him with tambourines and dancing. She was his only child. He had no other son or daughter.',
  },
  'Judges 11:35': {
    all: 'When Jephthah saw her, he tore his clothes and said, "Oh no, my daughter! You have brought me very low. I have opened my mouth to the Lord with a vow, and I cannot take it back."',
  },
  'Judges 11:36': {
    all: 'She said to him, "My father, you have opened your mouth to the Lord. Do to me according to what you promised, because the Lord has given you victory over your enemies, the Ammonites."',
  },
  'Judges 11:39': {
    all: 'At the end of two months, she returned to her father, and he did with her according to the vow he had made. She had never married. From then on, this became a custom in Israel:',
  },
  'Judges 11:40': {
    all: 'Every year the daughters of Israel went for four days to remember the daughter of Jephthah the Gileadite.',
  },
  'Judges 13:3': {
    all: 'The angel of the Lord appeared to the woman and said, "Look, you have not been able to have children, but you will become pregnant and have a son.',
  },
  'Judges 13:5': {
    all: 'You will become pregnant and have a son. No razor may touch his head, because the child will be set apart to God from birth. He will begin to save Israel from the power of the Philistines."',
  },
  'Judges 13:18': {
    all: 'The angel of the Lord said to him, "Why do you ask my name? It is wonderful."',
  },
  'Judges 13:24': {
    all: 'The woman gave birth to a son and named him Samson. The boy grew, and the Lord blessed him.',
  },
  'Judges 14:5': {
    all: 'Samson went down to Timnah with his father and mother. When they came to the vineyards of Timnah, a young lion came roaring toward him.',
  },
  'Judges 14:6': {
    all: 'The Spirit of the Lord rushed on Samson, and he tore the lion apart as easily as someone might tear a young goat. He had nothing in his hand, but he did not tell his father or mother what he had done.',
  },
  'Judges 14:14': {
    all: 'Samson said to them, "Out of the eater came something to eat. Out of the strong came something sweet." For three days they could not explain the riddle.',
  },
  'Judges 15:14': {
    all: 'When Samson came to Lehi, the Philistines shouted as they came toward him. Then the Spirit of the Lord rushed on him. The ropes on his arms became like burned flax, and the ropes fell from his hands.',
  },
  'Judges 15:15': {
    all: 'Samson found a fresh jawbone of a donkey, reached out, took it, and struck down a thousand men with it.',
  },
  'Judges 15:18': {
    all: 'Samson became very thirsty and cried out to the Lord, "You have given this great victory by your servant\'s hand. Now must I die of thirst and fall into the hands of the uncircumcised?"',
  },
  'Judges 16:1': {
    all: 'Samson went to Gaza and saw a woman whose life was sinful. He went in to her.',
  },
  'Judges 16:4': {
    all: 'After this, Samson loved a woman in the Valley of Sorek. Her name was Delilah.',
  },
  'Judges 16:17': {
    all: 'Finally Samson told Delilah everything in his heart. He said, "No razor has ever touched my head, because I have been set apart to God from my mother\'s womb. If my hair is shaved, my strength will leave me, and I will become weak like any other man."',
  },
  'Judges 16:19': {
    all: 'Delilah let Samson fall asleep on her knees. Then she called for a man to shave off the seven locks of his hair. She began to bring him down, and his strength left him.',
  },
  'Judges 16:20': {
    all: 'She said, "The Philistines are on you, Samson!" He woke up and thought, "I will go out as before and shake myself free." But he did not know that the Lord had left him.',
  },
  'Judges 16:21': {
    all: 'The Philistines seized Samson, blinded him, and took him down to Gaza. They bound him with bronze chains, and he ground grain in the prison.',
  },
  'Judges 16:28': {
    all: 'Samson called to the Lord and said, "Lord God, please remember me. Please strengthen me only this once, God, so I may be avenged on the Philistines for my two eyes."',
  },
  'Judges 16:30': {
    all: 'Samson said, "Let me die with the Philistines." Then he pushed with all his strength, and the house fell on the rulers and all the people inside. So the dead he killed at his death were more than those he killed during his life.',
  },
  'Judges 17:6': {
    all: 'In those days there was no king in Israel. Everyone did what was right in his own eyes.',
  },
  'Judges 18:30': {
    all: 'The people of Dan set up the carved image for themselves. Jonathan son of Gershom, son of Moses, and his sons were priests for the tribe of Dan until the day the land was captured.',
  },
  'Judges 18:31': {
    all: 'They kept Micah\'s carved image set up for themselves the whole time God\'s house was in Shiloh.',
  },
  'Judges 19:1': {
    all: 'In those days, when there was no king in Israel, a Levite lived far back in the hill country of Ephraim. He took a secondary wife from Bethlehem in Judah.',
  },
  'Judges 19:22': {
    all: 'While they were making their hearts glad, wicked men from the city surrounded the house and beat on the door. They said to the old man who owned the house, "Bring out the man who came into your house, so we may do evil to him."',
  },
  'Judges 19:23': {
    all: 'The man who owned the house went out to them and said, "No, my brothers, please do not act so wickedly. Since this man has come into my house, do not do this disgraceful thing.',
  },
  'Judges 19:25': {
    all: 'But the men would not listen. The Levite took his secondary wife and brought her out to them. The men of the city did terrible violence to her through the night, and at dawn they let her go.',
  },
  'Judges 19:26': {
    all: 'As morning came, the woman came and fell down at the door of the house where her master was, and she lay there until daylight.',
  },
  'Judges 19:27': {
    all: 'Her master got up in the morning, opened the doors of the house, and went out to continue his journey. There was the woman, his secondary wife, lying at the door of the house with her hands on the threshold.',
  },
  'Judges 19:28': {
    all: 'He said to her, "Get up. Let us go." But there was no answer. Then he put her on the donkey, and the man went home.',
  },
  'Judges 19:30': {
    all: 'Everyone who saw it said, "Nothing like this has happened or been seen from the day the people of Israel came up from Egypt until now. Think about it, take counsel, and speak."',
  },
  'Judges 20:12': {
    all: 'The tribes of Israel sent men through all the tribe of Benjamin, saying, "What is this evil that has happened among you?',
  },
  'Judges 20:13': {
    all: 'Now give up the wicked men of Gibeah, so we may put them to death and remove evil from Israel." But Benjamin would not listen to the voice of their brothers, the people of Israel.',
  },
  'Judges 20:18': {
    all: 'The people of Israel went up to Bethel and asked God, "Who should go up first for us to fight the people of Benjamin?" The Lord said, "Judah must go first."',
  },
  'Judges 20:26': {
    all: 'Then all the people of Israel, the whole army, went up to Bethel. They sat there and wept before the Lord. They fasted that day until evening and offered burned offerings and peace offerings before the Lord.',
  },
  'Judges 21:2': {
    all: 'The people came to Bethel and sat there before God until evening. They lifted their voices and wept bitterly.',
  },
  'Judges 21:3': {
    all: 'They said, "Lord, God of Israel, why has this happened in Israel, that one tribe is missing from Israel today?"',
  },
  'Judges 21:25': {
    all: 'In those days there was no king in Israel. Everyone did what was right in his own eyes.',
  },
};

Object.assign(STORY_REVISIONS, {
  'Judges 2:5': {
    all: 'They named that place Bochim, which means "weepers," and they offered sacrifices there to the Lord.',
  },
  'Judges 2:6': {
    all: 'When Joshua sent the people away, each family of Israel went to its own share of land to receive it.',
  },
  'Judges 2:7': {
    all: 'The people served the Lord all the days of Joshua and all the days of the elders who lived after Joshua, the elders who had seen all the great work the Lord had done for Israel.',
  },
  'Judges 2:13': {
    all: 'They abandoned the Lord and served Baal and Ashtaroth, false gods the people around them worshiped.',
  },
  'Judges 2:14': {
    all: 'The Lord\'s anger burned against Israel. He handed them over to raiders who took their goods, and he gave them into the power of enemies all around, so they could no longer stand before their enemies.',
  },
  'Judges 2:15': {
    all: 'Whenever Israel went out, the Lord\'s hand was against them for trouble, just as the Lord had warned and sworn to them. They were in great distress.',
  },
  'Judges 2:17': {
    all: 'Yet the people did not listen to their judges. They chased after false gods and bowed down to them. They quickly turned away from the path their ancestors had walked, the path of obeying the Lord\'s commands.',
  },
  'Judges 2:20': {
    all: 'The Lord\'s anger burned against Israel. He said, "This nation has broken my covenant that I commanded their ancestors, and they have not listened to my voice.',
  },
  'Judges 2:22': {
    all: 'I will use those nations to test Israel, to see whether they will keep the Lord\'s way and walk in it as their ancestors did."',
  },
  'Judges 3:2': {
    all: 'He left them so the new generations of Israel, who had not known war before, would learn about battle.',
  },
  'Judges 5:16': {
    all: 'Why did you stay among the sheepfolds, listening to the flutes for the flocks? Among the clans of Reuben there was much searching of heart.',
  },
  'Judges 6:32': {
    all: 'So that day Gideon was called Jerubbaal, because Joash said, "Let Baal argue against him, since he tore down Baal\'s altar."',
  },
  'Judges 7:14': {
    all: 'The man\'s friend answered, "This can only be the sword of Gideon son of Joash, a man of Israel. God has given Midian and the whole camp into his hand."',
  },
  'Judges 7:16': {
    all: 'Gideon divided the three hundred men into three groups. He gave every man a trumpet and an empty jar with a torch inside the jar.',
  },
  'Judges 8:26': {
    all: 'The gold earrings Gideon asked for weighed about one thousand seven hundred pieces of gold. This did not include the crescent ornaments, pendants, purple clothes worn by Midian\'s kings, or the chains on their camels\' necks.',
  },
  'Judges 9:51': {
    all: 'But there was a strong tower inside the city. All the men and women of the city ran there, shut themselves in, and went up to the roof of the tower.',
  },
  'Judges 10:6': {
    all: 'The people of Israel again did what was evil in the Lord\'s sight. They served the Baals and the Ashtaroth, false gods the people around them worshiped. They also served the gods of Aram, Sidon, Moab, Ammon, and the Philistines. They left the Lord and did not serve him.',
  },
  'Judges 11:4': {
    all: 'After a while, the Ammonites came to make war against Israel.',
  },
  'Judges 11:5': {
    all: 'When the Ammonites made war against Israel, the elders of Gilead went to bring Jephthah back from the land of Tob.',
  },
  'Judges 11:6': {
    all: 'They said to Jephthah, "Come be our commander, so we can fight the Ammonites."',
  },
  'Judges 11:8': {
    all: 'The elders of Gilead said to Jephthah, "That is why we have come back to you now. Come with us and fight the Ammonites, and you will be head over all the people of Gilead."',
  },
  'Judges 11:9': {
    all: 'Jephthah said to the elders of Gilead, "If you bring me home to fight the Ammonites, and the Lord gives them to me, will I truly be your head?"',
  },
  'Judges 11:10': {
    all: 'The elders of Gilead said to Jephthah, "The Lord is witness between us. We will surely do what you say."',
  },
  'Judges 11:12': {
    all: 'Jephthah sent messengers to the king of Ammon. They said, "What do you have against me, that you have come to fight against my land?"',
  },
  'Judges 11:13': {
    all: 'The king of Ammon answered Jephthah\'s messengers, "Israel took my land when they came up out of Egypt, from the Arnon to the Jabbok and the Jordan. Now give it back peacefully."',
  },
  'Judges 11:15': {
    all: 'Jephthah said, "Israel did not take away the land of Moab or the land of Ammon.',
  },
  'Judges 11:18': {
    all: 'Then Israel went through the wilderness around Edom and Moab. They came to the east side of Moab and camped beyond the Arnon River. They did not enter Moab\'s border, because the Arnon was Moab\'s border.',
  },
  'Judges 11:21': {
    all: 'The Lord, the God of Israel, gave Sihon and all his people into Israel\'s hand, and Israel struck them. So Israel received all the land of the Amorites who lived in that country.',
  },
  'Judges 11:23': {
    all: 'So the Lord, the God of Israel, drove out the Amorites before his people Israel. Should you now take their land?',
  },
  'Judges 11:24': {
    all: 'Will you not take what Chemosh your god gives you? In the same way, we will hold the land the Lord our God gave us by driving out the Amorites before us.',
  },
  'Judges 11:25': {
    all: 'Are you better than Balak son of Zippor, king of Moab? Did he ever argue with Israel or fight against them over this land?',
  },
  'Judges 11:26': {
    all: 'Israel lived in Heshbon, Aroer, their towns, and the cities along the Arnon for three hundred years. Why did you not take them back during all that time?',
  },
  'Judges 11:27': {
    all: 'Jephthah said, "I have not sinned against you, but you are doing wrong by making war against me. May the Lord, the Judge, decide today between the people of Israel and the Ammonites."',
  },
  'Judges 11:32': {
    all: 'So Jephthah crossed over to fight the Ammonites, and the Lord gave them into his hand.',
  },
  'Judges 11:33': {
    all: 'He struck them from Aroer toward Minnith, twenty cities in all, and as far as Abel Keramim. It was a very great defeat, and the Ammonites were brought low before the people of Israel.',
  },
  'Judges 11:37': {
    all: 'Then she said to her father, "Please do this for me. Give me two months to go into the mountains with my friends and weep because I will never marry."',
  },
  'Judges 11:38': {
    all: 'He said, "Go." He sent her away for two months. She went with her friends and mourned in the mountains because she would never marry.',
  },
  'Judges 13:1': {
    all: 'The people of Israel again did what was evil in the Lord\'s sight, and the Lord handed them over to the Philistines for forty years.',
  },
  'Judges 13:2': {
    all: 'There was a man from Zorah, from the family of Dan. His name was Manoah. His wife had not been able to have children.',
  },
  'Judges 13:4': {
    all: 'Now be careful. Do not drink wine or any drink like it, and do not eat food God called unclean for worship.',
  },
  'Judges 13:7': {
    all: 'He said to me, "You will become pregnant and have a son. Do not drink wine or any drink like it, and do not eat food God called unclean for worship, because the child will be a Nazirite, a person set apart to God, from before birth to the day of his death."',
  },
  'Judges 13:8': {
    all: 'Then Manoah prayed to the Lord and said, "Please, Lord, let the man of God you sent come to us again. Teach us what we should do for the child who will be born."',
  },
  'Judges 13:13': {
    all: 'The angel of the Lord said to Manoah, "The woman must be careful to do everything I told her.',
  },
  'Judges 13:14': {
    all: 'She must not eat anything that comes from the grapevine. She must not drink wine or any drink like it, and she must not eat food God called unclean for worship. She must do everything I commanded her."',
  },
  'Judges 13:16': {
    all: 'The angel of the Lord said to Manoah, "Even if you keep me here, I will not eat your food. If you prepare a burned offering, offer it to the Lord." Manoah did not know he was the angel of the Lord.',
  },
  'Judges 13:19': {
    all: 'So Manoah took the young goat and the grain offering and offered them on the rock to the Lord. Then the angel did an amazing thing while Manoah and his wife watched.',
  },
  'Judges 13:20': {
    all: 'When the flame went up from the altar toward the sky, the angel of the Lord went up in the flame. Manoah and his wife watched, and they fell with their faces to the ground.',
  },
  'Judges 13:23': {
    all: 'But his wife said, "If the Lord wanted to kill us, he would not have received our burned offering and grain offering. He would not have shown us all these things or told us this now."',
  },
  'Judges 13:25': {
    all: 'The Spirit of the Lord began to stir Samson at Mahaneh Dan, between Zorah and Eshtaol.',
  },
  'Judges 14:1': {
    all: 'Samson went down to Timnah and saw a Philistine woman there.',
  },
  'Judges 14:2': {
    all: 'He came back and told his father and mother, "I saw a Philistine woman in Timnah. Get her for me as my wife."',
  },
  'Judges 14:3': {
    all: 'His father and mother said, "Is there no woman among our people, among your own relatives, that you must go take a wife from the Philistines, who are not part of Israel\'s covenant people?" But Samson said to his father, "Get her for me, because she seems right to me."',
  },
  'Judges 14:4': {
    all: 'His father and mother did not know this was from the Lord, who was seeking an opportunity against the Philistines. At that time the Philistines ruled over Israel.',
  },
  'Judges 14:8': {
    all: 'After a while Samson returned to marry her. He turned aside to look at the dead lion, and there was a swarm of bees and honey inside the lion\'s body.',
  },
  'Judges 14:12': {
    all: 'Samson said to the thirty companions, "Let me tell you a riddle. If you can explain it during the seven days of the feast, I will give you thirty fine garments and thirty sets of clothes.',
  },
  'Judges 14:13': {
    all: 'But if you cannot explain it to me, then you must give me thirty fine garments and thirty sets of clothes." They said, "Tell us your riddle so we can hear it."',
  },
  'Judges 14:15': {
    all: 'On the seventh day, the men said to Samson\'s wife, "Persuade your husband to explain the riddle to us, or we will burn you and your father\'s house with fire. Did you invite us here to make us poor?"',
  },
  'Judges 14:16': {
    all: 'Samson\'s wife wept before him and said, "You only hate me. You do not love me. You told a riddle to my people but have not told me the answer." Samson said, "I have not even told my father or mother. Why should I tell you?"',
  },
  'Judges 14:17': {
    all: 'She wept before him during the feast. On the seventh day, because she pressed him so hard, he told her the answer. Then she told it to her people.',
  },
  'Judges 14:18': {
    all: 'Before sunset on the seventh day, the men of the city said to Samson, "What is sweeter than honey? What is stronger than a lion?" Samson said, "If you had not pressured my wife, you would not have found out my riddle."',
  },
  'Judges 14:19': {
    all: 'Then the Spirit of the Lord rushed on Samson. He went down to Ashkelon, struck thirty men, took their clothes, and gave the clothes to the men who had explained the riddle. His anger burned, and he went back to his father\'s house.',
  },
  'Judges 17:10': {
    all: 'Micah said to him, "Stay with me and be like a father and priest to me. I will give you ten silver pieces a year, clothes, and food." So the Levite went in.',
  },
  'Judges 18:7': {
    all: 'The five men left and came to Laish. They saw that the people there lived safely, quiet and secure like the Sidonians. No ruler in the land troubled them, they were far from the Sidonians, and they had no dealings with anyone else.',
  },
  'Judges 18:10': {
    all: 'When you go, you will come to a people who do not expect an attack. The land is large, and God has given it into your hand. It is a place with everything people need on the earth."',
  },
  'Judges 18:12': {
    all: 'They went up and camped at Kiriath Jearim in Judah. That is why the place behind Kiriath Jearim is called Mahaneh Dan to this day.',
  },
  'Judges 19:1': {
    all: 'In those days, when there was no king in Israel, a Levite lived far back in the hill country of Ephraim. He took another wife from Bethlehem in Judah.',
  },
  'Judges 19:2': {
    all: 'His other wife was unfaithful to him and went back to her father\'s house in Bethlehem of Judah. She stayed there for four months.',
  },
  'Judges 19:3': {
    all: 'Her husband got up and went after her to speak kindly to her and bring her back. He took his servant and two donkeys with him. She brought him into her father\'s house, and her father was glad to see him.',
  },
  'Judges 19:5': {
    all: 'On the fourth day, they got up early, and the Levite rose to leave. The young woman\'s father said to his son-in-law, "Strengthen your heart with a piece of bread, and afterward you may go."',
  },
  'Judges 19:6': {
    all: 'So the two men sat down, ate, and drank together. Then the young woman\'s father said, "Please stay tonight and let your heart be glad."',
  },
  'Judges 19:8': {
    all: 'On the fifth day, the Levite got up early to leave. The young woman\'s father said, "Please strengthen your heart and stay until the day begins to fade." So they both ate.',
  },
  'Judges 19:9': {
    all: 'When the man rose to leave with his other wife and servant, his father-in-law said, "Look, the day is almost evening. Please stay tonight. Tomorrow you can go early on your way home."',
  },
  'Judges 19:11': {
    all: 'When they were near Jebus, the day was almost gone. The servant said to his master, "Please, let us go into this Jebusite city and stay there."',
  },
  'Judges 19:12': {
    all: 'His master said, "We will not go into a foreign city that does not belong to the people of Israel. We will go on to Gibeah."',
  },
  'Judges 19:15': {
    all: 'They turned aside to stay in Gibeah. The Levite went in and sat down in the city square, but no one took them into his house for the night.',
  },
  'Judges 19:17': {
    all: 'The old man looked up and saw the traveler in the city square. He asked, "Where are you going? Where did you come from?"',
  },
  'Judges 19:19': {
    all: 'We have straw and feed for our donkeys, and bread and wine for me, your female servant, and the young man with your servants. We do not lack anything."',
  },
  'Judges 19:24': {
    all: 'Look, here are my daughter and this man\'s other wife. I should not bring them out to be harmed. Do not do this shameful evil to the man."',
  },
  'Judges 19:29': {
    all: 'When he came to his house, he took a knife, cut his other wife\'s body into twelve pieces, and sent the pieces throughout all Israel.',
  },
  'Judges 20:10': {
    all: 'We will choose ten men out of every hundred from all the tribes of Israel, one hundred out of every thousand, and one thousand out of every ten thousand. They will gather food for the army, so the army can go to Gibeah of Benjamin because of the disgraceful evil done in Israel."',
  },
  'Judges 20:23': {
    all: 'The people of Israel went up and wept before the Lord until evening. They asked the Lord, "Should we again go near to fight the descendants of Benjamin our brother?" The Lord said, "Go up against him."',
  },
  'Judges 20:40': {
    all: 'When the cloud began to rise from the city in a pillar of smoke, the Benjamites looked behind them. The whole city was going up in smoke to the sky.',
  },
  'Judges 21:5': {
    all: 'The people of Israel asked, "Who among all the tribes of Israel did not come up to the Lord in the assembly?" They had made a serious oath that anyone who did not come up to the Lord at Mizpah must be put to death.',
  },
  'Judges 21:7': {
    all: 'They said, "How can we provide wives for those who remain, since we swore by the Lord not to give them our daughters as wives?"',
  },
  'Judges 21:9': {
    all: 'When the people were counted, they found that no one from Jabesh Gilead had come to the camp assembly.',
  },
  'Judges 21:10': {
    all: 'So the community sent twelve thousand brave fighting men and commanded them, "Go and strike the people of Jabesh Gilead with the sword, including women and little ones.',
  },
  'Judges 21:11': {
    all: 'This is what you must do: every male must be destroyed, along with every woman who has been married."',
  },
  'Judges 21:12': {
    all: 'They found four hundred young women in Jabesh Gilead who had never been married. They brought them to the camp at Shiloh in the land of Canaan.',
  },
  'Judges 21:17': {
    all: 'They said, "The remaining Benjamites must have heirs, so a tribe will not be wiped out from Israel.',
  },
  'Judges 21:20': {
    all: 'So they commanded the Benjamites, "Go and hide in the vineyards.',
  },
  'Judges 21:21': {
    all: 'Watch, and when the daughters of Shiloh come out to dance, come out from the vineyards. Each man may take one of the daughters of Shiloh as his wife, and then go back to the land of Benjamin.',
  },
  'Judges 21:22': {
    all: 'When their fathers or brothers come to complain to us, we will say, "Show kindness to them for our sake, because we did not take a wife for each man in battle, and you did not break your oath by giving them wives."',
  },
  'Judges 21:23': {
    all: 'The Benjamites did so. Each man took a wife from the young women who danced. Then they returned to their share of land, rebuilt the cities, and lived in them.',
  },
});

Object.assign(STORY_REVISIONS, {
  'Judges 1:11': {
    all: 'From there Judah went against the people living in Debir. Debir had once been called Kiriath Sepher.',
  },
  'Judges 1:19': {
    all: 'The Lord was with Judah, and Judah took the hill country. But they could not drive out the people living in the valley, because those people had iron chariots.',
  },
  'Judges 1:30': {
    all: 'Zebulun did not drive out the people living in Kitron or Nahalol. The Canaanites lived among them and were forced to work.',
  },
  'Judges 1:31': {
    all: 'Asher did not drive out the people living in Acco, Sidon, Ahlab, Achzib, Helbah, Aphik, or Rehob.',
  },
  'Judges 1:32': {
    all: 'So the people of Asher lived among the Canaanites in the land, because they did not drive them out.',
  },
  'Judges 1:33': {
    all: 'Naphtali did not drive out the people living in Beth Shemesh or Beth Anath. They lived among the Canaanites in the land, and the people of Beth Shemesh and Beth Anath were forced to work.',
  },
  'Judges 3:13': {
    all: 'Eglon gathered the Ammonites and Amalekites to himself. He went and struck Israel, and they took the city of palm trees.',
  },
  'Judges 4:1': {
    all: 'After Ehud died, the people of Israel again did what was evil in the Lord\'s sight.',
  },
  'Judges 5:23': {
    all: '\'Curse Meroz,\' said the angel of the Lord. \'Yes, curse its people bitterly, because they did not come to help the Lord, to help the Lord against the mighty.\'',
  },
  'Judges 10:7': {
    all: 'The Lord\'s anger burned against Israel, and he gave them over to the Philistines and the Ammonites.',
  },
  'Judges 10:9': {
    all: 'The Ammonites crossed the Jordan River to fight against Judah, Benjamin, and the house of Ephraim, so Israel was in great distress.',
  },
  'Judges 10:11': {
    all: 'The Lord said to the people of Israel, "Did I not save you from the Egyptians, the Amorites, the Ammonites, and the Philistines?',
  },
  'Judges 10:12': {
    all: 'The Sidonians, the Amalekites, and the Maonites also treated you harshly. You cried to me, and I saved you from their hand.',
  },
  'Judges 10:17': {
    all: 'Then the Ammonites gathered and camped in Gilead. The people of Israel gathered and camped at Mizpah.',
  },
  'Judges 10:18': {
    all: 'The people, the leaders of Gilead, said to one another, "Who will begin the fight against the Ammonites? He will become head over all the people of Gilead."',
  },
  'Judges 11:14': {
    all: 'Jephthah sent messengers again to the king of Ammon.',
  },
  'Judges 11:28': {
    all: 'But the king of Ammon would not listen to the words Jephthah sent him.',
  },
  'Judges 12:1': {
    all: 'The men of Ephraim gathered and crossed northward. They said to Jephthah, "Why did you cross over to fight the Ammonites without calling us to go with you? We will burn your house over you with fire!"',
  },
  'Judges 12:2': {
    all: 'Jephthah said to them, "My people and I were in serious trouble with the Ammonites. I called you, but you did not rescue me from them.',
  },
  'Judges 12:3': {
    all: 'When I saw that you would not rescue me, I risked my life and crossed over against the Ammonites. The Lord gave them into my hand. Why have you come today to fight against me?"',
  },
  'Judges 19:4': {
    all: 'The young woman\'s father, the Levite\'s father-in-law, urged him to stay. So the Levite stayed three days, and they ate, drank, and lodged there.',
  },
  'Judges 19:10': {
    all: 'But the man would not stay that night. He got up and traveled toward Jebus, also called Jerusalem, with two saddled donkeys and his other wife.',
  },
  'Judges 19:13': {
    all: 'He said to his servant, "Come, let us go near one of these places and spend the night in Gibeah or Ramah."',
  },
  'Judges 19:14': {
    all: 'So they went on their way, and the sun went down near Gibeah, a town that belonged to Benjamin.',
  },
  'Judges 19:16': {
    all: 'That evening an old man came in from his work in the field. He was from the hill country of Ephraim and lived in Gibeah, though the men of that place were Benjamites.',
  },
  'Judges 19:18': {
    all: 'The Levite said, "We are traveling from Bethlehem in Judah to the far side of the hill country of Ephraim, where I am from. I went to Bethlehem in Judah, and now I am going to the house of the Lord, but no one has taken me into his house.',
  },
  'Judges 19:19': {
    all: 'We have straw and feed for our donkeys, and bread and wine for me, your female servant, and the young man with us. We have everything we need."',
  },
  'Judges 19:21': {
    all: 'So the old man brought him into his house and gave the donkeys feed. Then they washed their feet, ate, and drank.',
  },
  'Judges 19:23': {
    all: 'The man who owned the house went out and said, "No, my brothers, please do not act so wickedly. Since this man has come into my house, do not do this disgraceful thing.',
  },
  'Judges 19:24': {
    all: 'The old man even spoke wrongly about sending out his daughter and the man\'s other wife, but he begged the men not to do this shameful evil to his guest.',
  },
  'Judges 19:30': {
    all: 'Everyone who saw it said, "Nothing like this has happened or been seen from the day the people of Israel came up from Egypt until now. Think carefully, decide what should be done, and speak."',
  },
  'Judges 20:7': {
    all: 'Look, all you people of Israel, speak here and give your counsel.',
  },
  'Judges 20:9': {
    all: 'Now this is what we will do to Gibeah: we will go up against it as the lot directs.',
  },
  'Judges 20:15': {
    all: 'The Benjamites from the cities were counted that day: twenty-six thousand men who drew the sword, plus seven hundred chosen men from Gibeah.',
  },
  'Judges 20:16': {
    all: 'Among all these soldiers were seven hundred chosen left-handed men. Each one could sling a stone at a hair and not miss.',
  },
  'Judges 20:21': {
    all: 'The Benjamites came out of Gibeah, and that day they struck down twenty-two thousand men of Israel.',
  },
  'Judges 20:22': {
    all: 'But the men of Israel took courage and lined up for battle again in the place where they had stood the first day.',
  },
  'Judges 20:25': {
    all: 'Benjamin went out from Gibeah against them the second day and struck down eighteen thousand men of Israel. All these men carried swords.',
  },
  'Judges 20:28': {
    all: 'Phinehas son of Eleazar, son of Aaron, stood before the covenant chest in those days. The people asked, "Should we again go out to battle against Benjamin our brother, or should we stop?" The Lord said, "Go up, because tomorrow I will give him into your hand."',
  },
  'Judges 21:6': {
    all: 'The people of Israel grieved for Benjamin their brother. They said, "Today one tribe has been cut off from Israel.',
  },
  'Judges 21:8': {
    all: 'They asked, "Which tribe of Israel did not come up to the Lord at Mizpah?" They found that no one from Jabesh Gilead had come to the camp assembly.',
  },
  'Judges 21:13': {
    all: 'The whole community sent messengers to the descendants of Benjamin at the rock of Rimmon and offered peace to them.',
  },
  'Judges 21:14': {
    all: 'Benjamin returned at that time, and Israel gave them the women they had spared from Jabesh Gilead. But there still were not enough for them.',
  },
  'Judges 21:15': {
    all: 'The people grieved for Benjamin, because the Lord had made a gap in the tribes of Israel.',
  },
  'Judges 21:16': {
    all: 'The elders of the community said, "How can we provide wives for those who remain, since the women of Benjamin have been destroyed?"',
  },
  'Judges 21:18': {
    all: 'But we may not give them our daughters as wives, because the people of Israel swore, "Anyone who gives a wife to Benjamin is under a curse."',
  },
  'Judges 21:19': {
    all: 'They said, "Each year there is a feast of the Lord at Shiloh, north of Bethel, east of the road from Bethel to Shechem, and south of Lebonah."',
  },
  'Judges 21:24': {
    all: 'At that time the people of Israel left. Each man went back to his tribe, his family, and his own share of land.',
  },
});

Object.assign(STORY_REVISIONS, {
  'Judges 1:34': {
    all: 'The Amorites forced the descendants of Dan up into the hill country. They would not let them come down into the valley.',
  },
  'Judges 1:35': {
    all: 'The Amorites were determined to stay in Mount Heres, Aijalon, and Shaalbim. But the house of Joseph became stronger, and the Amorites were forced to work.',
  },
  'Judges 2:21': {
    all: 'Because of this, I will no longer drive out before them any of the nations Joshua left when he died.',
  },
  'Judges 2:23': {
    all: 'So the Lord left those nations in the land. He did not quickly drive them out or give them into Joshua\'s hand.',
  },
  'Judges 3:1': {
    all: 'These are the nations the Lord left in the land to test Israel, especially the Israelites who had not known the wars in Canaan.',
  },
  'Judges 3:3': {
    all: 'They included the five Philistine rulers, all the Canaanites, the Sidonians, and the Hivites who lived on Mount Lebanon, from Mount Baal Hermon to the entrance of Hamath.',
  },
  'Judges 3:4': {
    all: 'The Lord used those nations to test Israel, to see whether Israel would listen to the Lord\'s commands, the commands he had given their fathers through Moses.',
  },
  'Judges 3:24': {
    all: 'After Ehud had gone, Eglon\'s servants came and saw that the doors of the upstairs room were locked. They said, "He must be having privacy in the cool room."',
  },
  'Judges 3:25': {
    all: 'They waited a long time, until they were embarrassed. When he still did not open the doors, they took the key and opened them. Their lord was lying dead on the floor.',
  },
  'Judges 4:2': {
    all: 'So the Lord gave them over to Jabin king of Canaan, who ruled in Hazor. The commander of his army was Sisera, who lived in Harosheth Haggoyim.',
  },
  'Judges 4:3': {
    all: 'The people of Israel cried out to the Lord, because Sisera had nine hundred iron chariots and had treated Israel very harshly for twenty years.',
  },
  'Judges 4:10': {
    all: 'Barak called Zebulun and Naphtali together at Kedesh. Ten thousand men followed him, and Deborah went up with him.',
  },
  'Judges 4:11': {
    all: 'Heber the Kenite had moved away from the other Kenites, the descendants of Hobab, Moses\' brother-in-law. He had set up his tent near the oak of Zaanannim, by Kedesh.',
  },
  'Judges 4:12': {
    all: 'Someone told Sisera that Barak son of Abinoam had gone up to Mount Tabor.',
  },
  'Judges 4:13': {
    all: 'So Sisera gathered all nine hundred of his iron chariots and all the people with him. They came from Harosheth Haggoyim to the Kishon River.',
  },
  'Judges 4:16': {
    all: 'Barak chased the chariots and the army all the way to Harosheth Haggoyim. Sisera\'s whole army fell by the sword, and not one man was left.',
  },
  'Judges 4:17': {
    all: 'But Sisera ran away on foot to the tent of Jael, the wife of Heber the Kenite, because there was peace between King Jabin of Hazor and Heber\'s family.',
  },
  'Judges 4:18': {
    all: 'Jael went out to meet Sisera and said, "Come in, my lord. Come into my tent. Do not be afraid." So he went into her tent, and she covered him with a rug.',
  },
  'Judges 4:19': {
    all: 'He said to her, "Please give me a little water to drink, because I am thirsty." She opened a container of milk, gave him a drink, and covered him again.',
  },
  'Judges 4:20': {
    all: 'He said to her, "Stand at the door of the tent. If anyone comes and asks, \'Is anyone here?\' say, \'No.\'"',
  },
  'Judges 4:22': {
    all: 'As Barak chased Sisera, Jael came out to meet him and said, "Come, and I will show you the man you are looking for." Barak went in, and Sisera was lying there dead, with the tent peg through his temples.',
  },
  'Judges 4:24': {
    all: 'The people of Israel became stronger and stronger against Jabin king of Canaan, until they destroyed him.',
  },
  'Judges 5:2': {
    all: '"When leaders lead in Israel, and the people offer themselves willingly, bless the Lord!"',
  },
  'Judges 5:3': {
    all: 'Deborah and Barak sang, "Hear this, you kings. Listen, you rulers. I will sing to the Lord. I will sing praise to the Lord, the God of Israel.',
  },
  'Judges 5:4': {
    all: '"Lord, when you went out from Seir, when you marched from the fields of Edom, the earth trembled, the sky poured, and the clouds poured down water.',
  },
  'Judges 5:5': {
    all: 'The mountains quaked before the Lord. Sinai itself shook before the Lord, the God of Israel.',
  },
  'Judges 5:6': {
    all: '"In the days of Shamgar son of Anath, in the days of Jael, the roads were empty. Travelers took small winding paths.',
  },
  'Judges 5:7': {
    all: 'Village life in Israel grew quiet until I, Deborah, arose, until I arose like a mother in Israel.',
  },
  'Judges 5:8': {
    all: 'When Israel chose new gods, war came to the city gates. Among forty thousand in Israel, hardly a shield or spear could be seen.',
  },
  'Judges 5:9': {
    all: 'My heart is with the leaders of Israel, with those who offered themselves willingly among the people. Bless the Lord!',
  },
  'Judges 5:10': {
    all: '"Speak of it, you who ride on white donkeys, you who sit on rich saddle blankets, and you who walk along the road.',
  },
  'Judges 5:11': {
    all: 'Away from the sound of archers, at the places where people draw water, they tell the righteous acts of the Lord, the righteous acts of his rule in Israel. Then the Lord\'s people went down to the gates.',
  },
  'Judges 5:12': {
    all: 'Awake, awake, Deborah! Awake, awake, sing a song! Rise up, Barak, son of Abinoam, and lead away your captives.',
  },
  'Judges 5:13': {
    all: '"Then the remaining nobles and the people came down. The Lord brought them down for me against the mighty.',
  },
  'Judges 5:14': {
    all: 'Some came from Ephraim, whose roots were in Amalek. Benjamin followed with his people. Leaders came down from Machir, and commanders came from Zebulun.',
  },
  'Judges 5:15': {
    all: 'The leaders of Issachar were with Deborah. Issachar was with Barak, rushing into the valley behind him. But among the clans of Reuben there was much searching of heart.',
  },
  'Judges 5:17': {
    all: 'Gilead stayed beyond the Jordan. Dan stayed by the ships. Asher sat still by the seacoast and remained near his harbors.',
  },
  'Judges 5:18': {
    all: 'Zebulun risked their lives on the battlefield, and Naphtali did the same on the high places of the field.',
  },
  'Judges 5:19': {
    all: '"Kings came and fought. The kings of Canaan fought at Taanach by the waters of Megiddo, but they carried away no silver goods.',
  },
  'Judges 5:22': {
    all: 'Then the horses\' hooves pounded the ground as the strong horses galloped.',
  },
  'Judges 5:24': {
    all: '"Blessed above women is Jael, the wife of Heber the Kenite. Blessed is she among women who live in tents.',
  },
  'Judges 5:25': {
    all: 'Sisera asked for water. Jael gave him milk. In a noble bowl, she brought him curds.',
  },
  'Judges 5:28': {
    all: '"Sisera\'s mother looked out through the window lattice and cried, \'Why is his chariot so long in coming? Why are the wheels of his chariots delayed?\'',
  },
  'Judges 5:29': {
    all: 'Her wisest ladies answered her, and she answered herself too.',
  },
  'Judges 5:30': {
    all: '\'Surely they are finding and dividing the goods. Surely they are giving a young woman or two to each soldier. Surely Sisera is receiving dyed cloth, embroidered cloth, and fine cloth for his neck.\'',
  },
  'Judges 6:3': {
    all: 'Whenever Israel planted seed, the Midianites, the Amalekites, and the people from the east came up against them.',
  },
  'Judges 6:4': {
    all: 'They camped against Israel and ruined the crops all the way to Gaza. They left no food in Israel, and no sheep, ox, or donkey.',
  },
  'Judges 6:5': {
    all: 'They came with their livestock and tents, crowding the land like locusts. They and their camels could not be counted, and they came into the land to destroy it.',
  },
  'Judges 6:8': {
    all: 'the Lord sent a prophet to the people of Israel. He said, "The Lord, the God of Israel, says, \'I brought you up from Egypt and brought you out of the place where you had been slaves.',
  },
  'Judges 6:9': {
    all: 'I rescued you from the Egyptians and from everyone who treated you harshly. I drove them out before you and gave you their land.',
  },
  'Judges 6:19': {
    all: 'Gideon went in and prepared a young goat and flat bread made without yeast from a measure of flour. He put the meat in a basket and the broth in a pot, brought them out under the oak, and presented them.',
  },
  'Judges 6:20': {
    all: 'The angel of God said, "Take the meat and the flat bread, lay them on this rock, and pour out the broth." Gideon did so.',
  },
  'Judges 6:21': {
    all: 'Then the Lord\'s angel reached out the end of the staff in his hand and touched the meat and the flat bread. Fire came up from the rock and burned up the meat and the bread. Then the Lord\'s angel disappeared from Gideon\'s sight.',
  },
  'Judges 6:22': {
    all: 'Gideon realized that he had seen the Lord\'s angel. He said, "Oh no, Lord God! I have seen the Lord\'s angel face to face!"',
  },
  'Judges 6:28': {
    all: 'When the men of the city got up early in the morning, they saw that Baal\'s altar had been torn down, the Asherah pole beside it had been cut down, and the second bull had been offered on the new altar.',
  },
  'Judges 6:29': {
    all: 'They asked one another, "Who did this?" After they searched and asked around, they were told, "Gideon son of Joash did it."',
  },
  'Judges 6:30': {
    all: 'Then the men of the city said to Joash, "Bring out your son so he may die, because he tore down Baal\'s altar and cut down the Asherah pole beside it."',
  },
  'Judges 6:31': {
    all: 'Joash said to everyone standing against him, "Will you defend Baal? Will you rescue him? If Baal is a god, let him defend himself, because someone tore down his altar!"',
  },
  'Judges 6:33': {
    all: 'Then all the Midianites, Amalekites, and people from the east gathered together. They crossed over and camped in the Valley of Jezreel.',
  },
  'Judges 6:34': {
    all: 'The Spirit of the Lord came on Gideon. Gideon blew a trumpet, and the Abiezrites gathered to follow him.',
  },
  'Judges 6:35': {
    all: 'Gideon sent messengers through all Manasseh, and they gathered to follow him. He also sent messengers to Asher, Zebulun, and Naphtali, and they came up to meet them.',
  },
  'Judges 6:38': {
    all: 'That is what happened. Gideon got up early the next day, squeezed the fleece, and wrung out a bowl full of water from it.',
  },
  'Judges 6:39': {
    all: 'Then Gideon said to God, "Please do not be angry with me, but let me speak just once more. Let me test with the fleece one more time. This time let the fleece be dry, and let dew cover all the ground."',
  },
  'Judges 6:40': {
    all: 'God did that that night. The fleece was dry, but dew covered all the ground.',
  },
  'Judges 7:1': {
    all: 'Early in the morning, Jerubbaal, who is Gideon, and all the people with him camped beside the spring of Harod. Midian\'s camp lay north of them, by the hill of Moreh in the valley.',
  },
  'Judges 7:3': {
    all: 'Now announce to the people, "Anyone who is afraid and trembling may turn back from Mount Gilead." So twenty-two thousand people returned, and ten thousand remained.',
  },
  'Judges 7:4': {
    all: 'The Lord said to Gideon, "There are still too many people. Bring them down to the water, and I will test them for you there. The one I tell you to take will go with you, and the one I tell you not to take will not go."',
  },
  'Judges 7:5': {
    all: 'So Gideon brought the people down to the water. The Lord said, "Set apart everyone who laps the water with his tongue as a dog laps, and also everyone who kneels down to drink."',
  },
  'Judges 7:6': {
    all: 'Three hundred men drank by bringing water to their mouths with their hands. All the rest knelt down to drink.',
  },
  'Judges 7:8': {
    all: 'So Gideon kept the three hundred men, their food, and their trumpets. He sent all the other men of Israel back to their tents. The camp of Midian lay below him in the valley.',
  },
  'Judges 7:9': {
    all: 'That same night, the Lord said to Gideon, "Get up and go down into the camp, because I have given it into your hand.',
  },
  'Judges 7:11': {
    all: 'You will hear what they say, and afterward you will have courage to go down into the camp." So Gideon went down with Purah his servant to the edge of the armed men in the camp.',
  },
  'Judges 7:12': {
    all: 'The Midianites, Amalekites, and people from the east filled the valley like locusts. Their camels could not be counted, like sand on the seashore.',
  },
  'Judges 7:17': {
    all: 'He said to them, "Watch me and do the same. When I come to the edge of the camp, do exactly what I do.',
  },
  'Judges 7:19': {
    all: 'Gideon and the hundred men with him came to the edge of the camp at the beginning of the middle watch, just after the guards had been posted. They blew their trumpets and smashed the jars in their hands.',
  },
  'Judges 7:21': {
    all: 'Each man stood in his place around the camp. The whole Midianite army ran, cried out, and fled.',
  },
  'Judges 7:23': {
    all: 'The men of Israel gathered from Naphtali, Asher, and all Manasseh, and they chased after Midian.',
  },
  'Judges 7:24': {
    all: 'Gideon sent messengers through all the hill country of Ephraim. He said, "Come down against Midian and take the waters ahead of them as far as Beth Barah and the Jordan." So the men of Ephraim gathered and took the waters as far as Beth Barah and the Jordan.',
  },
  'Judges 7:25': {
    all: 'They captured the two leaders of Midian, Oreb and Zeeb. They killed Oreb at Oreb\'s rock and Zeeb at Zeeb\'s winepress. Then, while chasing Midian, they brought the heads of Oreb and Zeeb to Gideon beyond the Jordan.',
  },
  'Judges 8:2': {
    all: 'Gideon answered, "What have I done compared with you? Are not the leftover grapes of Ephraim better than the full grape harvest of Abiezer?',
  },
  'Judges 8:3': {
    all: 'God gave the Midianite leaders Oreb and Zeeb into your hand. What was I able to do compared with you?" When Gideon said this, their anger cooled.',
  },
  'Judges 8:4': {
    all: 'Gideon and his three hundred men came to the Jordan and crossed over. They were tired, but they kept chasing the enemy.',
  },
  'Judges 8:5': {
    all: 'He said to the men of Succoth, "Please give bread to the people who follow me. They are tired, and I am chasing Zebah and Zalmunna, the kings of Midian."',
  },
  'Judges 8:6': {
    all: 'The leaders of Succoth said, "Have you already captured Zebah and Zalmunna, that we should give bread to your army?"',
  },
  'Judges 8:8': {
    all: 'Gideon went from there to Penuel and asked the same thing. The men of Penuel answered him the same way the men of Succoth had answered.',
  },
  'Judges 8:10': {
    all: 'Zebah and Zalmunna were in Karkor with about fifteen thousand soldiers, all who were left from the army of the people from the east. One hundred twenty thousand sword-carrying men had already fallen.',
  },
  'Judges 8:14': {
    all: 'Gideon caught a young man from Succoth and asked him questions. The young man wrote down the names of Succoth\'s leaders and elders, seventy-seven men.',
  },
  'Judges 8:15': {
    all: 'Gideon came to the men of Succoth and said, "Here are Zebah and Zalmunna. You mocked me about them, saying, \'Have you already captured them, that we should give bread to your tired men?\'"',
  },
  'Judges 8:19': {
    all: 'Gideon said, "They were my brothers, my mother\'s sons. As the Lord lives, if you had spared them, I would not kill you."',
  },
  'Judges 8:20': {
    all: 'He said to Jether his firstborn, "Get up and kill them!" But the young man did not draw his sword, because he was afraid and still young.',
  },
  'Judges 8:21': {
    all: 'Then Zebah and Zalmunna said, "You get up and strike us yourself, because a man has a man\'s strength." So Gideon got up, killed Zebah and Zalmunna, and took the crescent ornaments from their camels\' necks.',
  },
  'Judges 8:24': {
    all: 'Gideon said to them, "I do have one request: each of you give me an earring from the goods you took." The Midianites had worn gold earrings because they were Ishmaelites.',
  },
  'Judges 8:25': {
    all: 'They answered, "We will gladly give them." They spread out a garment, and each man threw an earring from his goods onto it.',
  },
  'Judges 8:27': {
    all: 'Gideon made the gold into an ephod, a special priestly object, and put it in his city, Ophrah. All Israel went after it there, and it became a trap for Gideon and his family.',
  },
  'Judges 8:34': {
    all: 'The people of Israel did not remember the Lord their God, who had rescued them from the power of all their enemies around them.',
  },
  'Judges 8:35': {
    all: 'They also did not show kindness to the house of Jerubbaal, that is, Gideon, for all the good he had done for Israel.',
  },
  'Judges 9:2': {
    all: '"Please speak to all the leaders of Shechem. Ask them, \'Is it better for all seventy sons of Jerubbaal to rule over you, or for one man to rule? Remember, I am your own flesh and bone.\'"',
  },
  'Judges 9:3': {
    all: 'Abimelech\'s mother\'s brothers repeated all these words to the leaders of Shechem. Their hearts leaned toward Abimelech, because they said, "He is our brother."',
  },
  'Judges 9:4': {
    all: 'They gave him seventy pieces of silver from the house of Baal Berith. With it Abimelech hired reckless and worthless men, and they followed him.',
  },
  'Judges 9:6': {
    all: 'All the leaders of Shechem and the house of Millo gathered together. They made Abimelech king by the oak beside the pillar in Shechem.',
  },
  'Judges 9:8': {
    all: 'Jotham said, "Once the trees went out to anoint a king over themselves. They said to the olive tree, \'Reign over us.\'',
  },
  'Judges 9:9': {
    all: 'But the olive tree said, \'Should I stop giving my oil, the oil used to honor God and people, just so I can sway above the trees?\'',
  },
  'Judges 9:11': {
    all: 'But the fig tree said, \'Should I leave my sweetness and my good fruit, just so I can sway above the trees?\'',
  },
  'Judges 9:13': {
    all: 'But the vine said, \'Should I leave my new wine, which brings cheer to God and people, just so I can sway above the trees?\'',
  },
  'Judges 9:15': {
    all: 'The bramble said to the trees, \'If you truly anoint me king over you, then come and take shelter in my shade. But if not, let fire come out from the bramble and burn up the cedars of Lebanon.\'',
  },
  'Judges 9:16': {
    all: '"Now think about what you have done. If you have acted truly and rightly by making Abimelech king, and if you have treated Jerubbaal and his house well, as his hands deserved,',
  },
  'Judges 9:17': {
    all: 'remember that my father fought for you. He risked his life and rescued you from the power of Midian.',
  },
  'Judges 9:18': {
    all: 'But today you have risen against my father\'s house. You killed his seventy sons on one stone and made Abimelech, the son of his female servant, king over the leaders of Shechem because he is your brother.',
  },
  'Judges 9:19': {
    all: 'If you have acted truly and rightly toward Jerubbaal and his house today, then rejoice in Abimelech, and let him rejoice in you.',
  },
  'Judges 9:20': {
    all: 'But if not, let fire come out from Abimelech and burn up the leaders of Shechem and the house of Millo. Let fire come out from the leaders of Shechem and the house of Millo and burn up Abimelech."',
  },
  'Judges 9:23': {
    all: 'Then God sent an evil spirit between Abimelech and the leaders of Shechem, and the leaders of Shechem acted treacherously against Abimelech.',
  },
  'Judges 9:25': {
    all: 'The men of Shechem set men in ambush for Abimelech on the mountain tops. They robbed everyone who passed by on that road, and Abimelech was told about it.',
  },
  'Judges 9:31': {
    all: 'Zebul secretly sent messengers to Abimelech, saying, "Look, Gaal son of Ebed and his brothers have come to Shechem, and they are stirring up the city against you.',
  },
  'Judges 9:33': {
    all: 'In the morning, as soon as the sun is up, rise early and rush on the city. When Gaal and the people with him come out against you, do whatever your hand finds to do."',
  },
  'Judges 9:34': {
    all: 'So Abimelech and all the people with him got up at night and hid against Shechem in four groups.',
  },
  'Judges 9:35': {
    all: 'Gaal son of Ebed went out and stood at the entrance of the city gate. Then Abimelech and the people with him rose from their hiding place.',
  },
  'Judges 9:41': {
    all: 'Abimelech stayed at Arumah. Zebul drove out Gaal and his brothers, so they could no longer live in Shechem.',
  },
  'Judges 9:42': {
    all: 'The next day, the people of Shechem went out into the field, and Abimelech was told.',
  },
  'Judges 9:43': {
    all: 'He took his people, divided them into three groups, and hid in the field. When he saw the people coming out of the city, he rose against them and struck them.',
  },
  'Judges 9:44': {
    all: 'Abimelech and the group with him rushed forward and stood at the entrance of the city gate. The other two groups rushed on everyone in the field and struck them.',
  },
  'Judges 9:45': {
    all: 'Abimelech fought against the city all that day. He took the city, killed the people in it, tore the city down, and scattered salt over it.',
  },
  'Judges 9:48': {
    all: 'Abimelech went up Mount Zalmon with all the people who were with him. He took an ax, cut down a branch, lifted it onto his shoulder, and said, "Hurry and do what you have seen me do!"',
  },
  'Judges 9:49': {
    all: 'So each person cut down a branch and followed Abimelech. They piled the branches against the stronghold and set it on fire. All the people in the tower of Shechem died, about one thousand men and women.',
  },
  'Judges 9:54': {
    all: 'Abimelech quickly called the young man who carried his armor and said, "Draw your sword and kill me, so people will not say, \'A woman killed him.\'" So the young man pierced him through, and he died.',
  },
  'Judges 9:55': {
    all: 'When the men of Israel saw that Abimelech was dead, each man went back to his own place.',
  },
  'Judges 11:20': {
    all: 'But Sihon did not trust Israel to pass through his border. He gathered all his people, camped at Jahaz, and fought against Israel.',
  },
  'Judges 11:29': {
    all: 'Then the Spirit of the Lord came on Jephthah. He passed through Gilead and Manasseh, went through Mizpah of Gilead, and from there went on toward the Ammonites.',
  },
  'Judges 11:39': {
    all: 'At the end of two months, she returned to her father, and he did with her according to the vow he had made. She had never married. From then on, this became a custom in Israel.',
  },
  'Judges 12:5': {
    all: 'The Gileadites captured the Jordan River crossings before the Ephraimites. Whenever a man fleeing from Ephraim said, "Let me cross," the men of Gilead asked, "Are you an Ephraimite?" If he said, "No,"',
  },
  'Judges 12:6': {
    all: 'then they said, "Now say Shibboleth." If he said "Sibboleth," because he could not say it correctly, they seized him and killed him at the Jordan crossings. At that time, forty-two thousand Ephraimites fell.',
  },
  'Judges 12:11': {
    all: 'After him, Elon the Zebulunite judged Israel for ten years.',
  },
  'Judges 13:6': {
    all: 'Then the woman came and told her husband, "A man of God came to me. His face was like the face of the angel of God, very awesome. I did not ask where he was from, and he did not tell me his name.',
  },
  'Judges 13:9': {
    all: 'God listened to Manoah, and the angel of God came again to the woman while she sat in the field. But Manoah her husband was not with her.',
  },
  'Judges 16:2': {
    all: 'The people of Gaza were told, "Samson is here!" They surrounded the place and waited quietly all night at the city gate, saying, "Wait until morning light. Then we will kill him."',
  },
  'Judges 16:3': {
    all: 'Samson lay there until midnight. At midnight he got up, grabbed the doors of the city gate with the two posts, pulled them up with the bar still attached, put them on his shoulders, and carried them to the top of the hill facing Hebron.',
  },
  'Judges 16:5': {
    all: 'The Philistine rulers came to Delilah and said, "Persuade him to show you where his great strength comes from and how we can overpower him and tie him up. Each of us will give you eleven hundred pieces of silver."',
  },
  'Judges 16:6': {
    all: 'Delilah said to Samson, "Please tell me where your great strength comes from, and how someone could tie you up and overpower you."',
  },
  'Judges 16:7': {
    all: 'Samson said to her, "If they tie me with seven fresh bowstrings that have never been dried, then I will become weak like any other man."',
  },
  'Judges 16:9': {
    all: 'Men were hiding in the inner room, waiting. Delilah said to him, "The Philistines are on you, Samson!" But he snapped the bowstrings as easily as flax thread snaps when it touches fire. So no one knew the secret of his strength.',
  },
  'Judges 16:11': {
    all: 'He said to her, "If they tie me tightly with new ropes that have never been used, then I will become weak like any other man."',
  },
  'Judges 16:12': {
    all: 'So Delilah took new ropes and tied him with them. Then she said, "The Philistines are on you, Samson!" Men were hiding in the inner room, but Samson snapped the ropes off his arms like thread.',
  },
  'Judges 16:16': {
    all: 'Day after day she pressed him with her words and urged him, until his soul was tired to death.',
  },
  'Judges 16:18': {
    all: 'When Delilah saw that Samson had told her everything in his heart, she called for the Philistine rulers and said, "Come up this one more time, because he has told me everything in his heart." So the Philistine rulers came to her and brought the silver in their hands.',
  },
  'Judges 16:23': {
    all: 'The Philistine rulers gathered to offer a great sacrifice to Dagon their god and to celebrate. They said, "Our god has given Samson our enemy into our hand."',
  },
  'Judges 16:24': {
    all: 'When the people saw Samson, they praised their god and said, "Our god has given our enemy into our hand, the one who destroyed our land and killed many of us."',
  },
  'Judges 16:25': {
    all: 'When they were celebrating, they said, "Call for Samson, so he may perform for us." They brought Samson out of the prison, and he performed before them. Then they made him stand between the pillars.',
  },
  'Judges 16:26': {
    all: 'Samson said to the boy who held him by the hand, "Let me feel the pillars that hold up the house, so I can lean on them."',
  },
  'Judges 16:27': {
    all: 'The house was full of men and women. All the Philistine rulers were there, and about three thousand men and women were on the roof watching Samson perform.',
  },
  'Judges 16:29': {
    all: 'Samson took hold of the two middle pillars that held up the house. He leaned against them, one with his right hand and the other with his left.',
  },
  'Judges 17:3': {
    all: 'He gave the eleven hundred pieces of silver back to his mother. Then his mother said, "I dedicate this silver to the Lord for my son, to make a carved idol and a metal idol. Now I give it back to you."',
  },
  'Judges 17:4': {
    all: 'When Micah gave the money back to his mother, she took two hundred pieces of silver and gave them to a silversmith. He made a carved idol and a metal idol from it, and they were put in Micah\'s house.',
  },
  'Judges 17:5': {
    all: 'Micah had a house full of false gods. He made an ephod, a special priestly vest, and household idols. Then he set apart one of his sons to become his priest.',
  },
  'Judges 18:1': {
    all: 'In those days there was no king in Israel. The tribe of Dan was looking for a share of land to live in, because their share had not yet fully come to them among the tribes of Israel.',
  },
  'Judges 18:2': {
    all: 'The descendants of Dan sent five brave men from Zorah and Eshtaol to spy out and search the land. They said, "Go, explore the land!" The men came to the hill country of Ephraim, to Micah\'s house, and stayed there for the night.',
  },
  'Judges 18:4': {
    all: 'The Levite said to them, "Micah has done this and that for me. He hired me, and I became his priest."',
  },
  'Judges 18:5': {
    all: 'They said to him, "Please ask God for counsel, so we may know whether the journey we are taking will succeed."',
  },
  'Judges 18:8': {
    all: 'The five men returned to their brothers at Zorah and Eshtaol. Their brothers asked them, "What do you say?"',
  },
  'Judges 18:9': {
    all: 'They said, "Get up! Let us go against them. We have seen the land, and it is very good. Do not sit still or be slow to go in and receive the land.',
  },
  'Judges 18:14': {
    all: 'Then the five men who had spied out Laish said to their brothers, "Do you know that these houses have an ephod, a special priestly vest, household idols, a carved idol, and a metal idol? Now think about what you should do."',
  },
  'Judges 18:17': {
    all: 'The five men who had spied out the land went into Micah\'s house and took the carved idol, the ephod, the household idols, and the metal idol. The priest stood by the gate with the six hundred armed men.',
  },
  'Judges 18:18': {
    all: 'When the five men went into Micah\'s house and took the carved idol, the ephod, the household idols, and the metal idol, the priest said to them, "What are you doing?"',
  },
  'Judges 18:19': {
    all: 'They said to him, "Be quiet. Put your hand over your mouth and come with us. Be a father and priest to us. Is it better for you to be priest for one man\'s house, or for a tribe and family in Israel?"',
  },
  'Judges 18:20': {
    all: 'The priest was glad. He took the ephod, the household idols, and the carved idol, and went with the people.',
  },
  'Judges 18:24': {
    all: 'Micah said, "You have taken away the gods I made, and you have taken the priest too. What do I have left? How can you ask me, \'What is wrong?\'"',
  },
  'Judges 18:25': {
    all: 'The descendants of Dan said to him, "Do not keep shouting at us, or angry men may attack you, and you and your household may lose your lives."',
  },
  'Judges 18:27': {
    all: 'The Danites took what Micah had made and the priest who had belonged to him. They came to Laish, to a quiet and unsuspecting people, struck them down with the sword, and burned the city with fire.',
  },
  'Judges 18:28': {
    all: 'There was no one to rescue Laish, because it was far from Sidon and had no dealings with anyone else. It lay in the valley near Beth Rehob. Then the Danites rebuilt the city and lived in it.',
  },
  'Judges 18:29': {
    all: 'They named the city Dan after their ancestor Dan, who was born to Israel. Before that, the city had been called Laish.',
  },
  'Judges 20:6': {
    all: 'I took my wife and cut her body in pieces, then sent the pieces through all the land God gave Israel, because they had done a shameful and foolish evil in Israel.',
  },
  'Judges 20:20': {
    all: 'The men of Israel went out to battle against Benjamin and lined up for battle against them at Gibeah.',
  },
});

Object.assign(STORY_REVISIONS, {
  'Judges 2:18': {
    all: 'Whenever the Lord raised up a judge, a leader and rescuer, for them, the Lord was with that judge. He saved them from their enemies all the days of that judge, because the Lord had compassion when the people groaned under those who treated them harshly.',
  },
  'Judges 3:20': {
    all: 'Ehud came near while Eglon was sitting alone in his cool upstairs room. Ehud said, "I have a message from God for you." Eglon rose from his seat.',
  },
  'Judges 3:23': {
    all: 'Then Ehud went out onto the porch, shut the doors of the upstairs room behind him, and locked them.',
  },
  'Judges 5:13': {
    all: '"Then the remaining leaders and the people came down. The Lord brought them down for me against the mighty.',
  },
  'Judges 8:18': {
    all: 'Then Gideon said to Zebah and Zalmunna, "What kind of men did you kill at Tabor?" They answered, "They were like you. Each one looked like the son of a king."',
  },
  'Judges 11:17': {
    all: 'Israel sent messengers to the king of Edom, saying, "Please let us pass through your land." But the king of Edom would not listen. Israel also sent to the king of Moab, but he refused too. So Israel stayed in Kadesh.',
  },
  'Judges 11:23': {
    all: 'So the Lord, the God of Israel, drove out the Amorites before his people Israel. Should you now take the land away?',
  },
  'Judges 20:31': {
    all: 'The Benjamites came out against the people and were drawn away from the city. As before, they began to strike down some of the people on the roads, one going up to Bethel and the other to Gibeah, and in the field. About thirty men of Israel fell.',
  },
  'Judges 20:32': {
    all: 'The Benjamites said, "They are falling before us as they did at first." But the people of Israel said, "Let us run away and draw them away from the city to the roads."',
  },
  'Judges 20:33': {
    all: 'All the men of Israel rose from their place and lined up at Baal Tamar. Then the Israelite ambushers rushed out from their place near Maareh Geba.',
  },
  'Judges 20:35': {
    all: 'The Lord struck Benjamin before Israel. That day the people of Israel struck down twenty-five thousand one hundred men of Benjamin, all men who carried swords.',
  },
  'Judges 20:36': {
    all: 'Then the Benjamites saw that they were beaten. The men of Israel had given ground to Benjamin because they trusted the ambushers they had set against Gibeah.',
  },
  'Judges 20:37': {
    all: 'The ambushers hurried and rushed into Gibeah. They spread through the city and struck it with the sword.',
  },
  'Judges 20:38': {
    all: 'The men of Israel and the ambushers had chosen a sign: a great cloud of smoke would rise from the city.',
  },
  'Judges 20:39': {
    all: 'When the men of Israel turned in the battle, Benjamin had already begun to strike down about thirty men of Israel. The Benjamites said, "Surely they are falling before us as they did in the first battle."',
  },
  'Judges 20:41': {
    all: 'Then the men of Israel turned back, and the men of Benjamin were terrified because they saw that disaster had come on them.',
  },
  'Judges 20:42': {
    all: 'They turned away from the men of Israel toward the wilderness, but the battle pressed hard after them. The men from the cities came out and struck them down.',
  },
  'Judges 20:44': {
    all: 'Eighteen thousand men of Benjamin fell, all of them brave fighting men.',
  },
  'Judges 20:45': {
    all: 'The rest turned and fled toward the wilderness to the rock of Rimmon. Israel cut down five thousand of them on the roads, followed hard after them to Gidom, and struck down two thousand more.',
  },
  'Judges 20:46': {
    all: 'In all, twenty-five thousand men of Benjamin who carried swords fell that day. All of them were brave fighting men.',
  },
  'Judges 20:47': {
    all: 'But six hundred men turned and fled toward the wilderness to the rock of Rimmon. They stayed at the rock of Rimmon for four months.',
  },
  'Judges 20:48': {
    all: 'The men of Israel turned back against the descendants of Benjamin and struck down the city, the livestock, and everything they found with the sword. They also set every city they found on fire.',
  },
});

Object.assign(STORY_REVISIONS, {
  'Judges 6:10': {
    all: 'I said to you, "I am the Lord your God. Do not fear the gods of the Amorites, in whose land you live." But you have not listened to my voice.\'"',
  },
  'Judges 8:27': {
    all: 'Gideon made the gold into a special priestly object and put it in his city, Ophrah. All Israel went after it there, and it became a trap for Gideon and his family.',
  },
  'Judges 13:10': {
    all: 'The woman hurried and ran to tell her husband. She said, "Look, the man who came to me the other day has appeared to me again!"',
  },
  'Judges 13:11': {
    all: 'Manoah got up, followed his wife, and came to the man. He asked, "Are you the man who spoke to my wife?" The man said, "I am."',
  },
  'Judges 14:9': {
    all: 'Samson scooped the honey into his hands and walked along eating it. He came to his father and mother and gave them some, and they ate. But he did not tell them he had taken the honey from the lion\'s body.',
  },
  'Judges 15:2': {
    all: 'Her father said, "I truly thought you hated her, so I gave her to your companion. Is not her younger sister more beautiful than she is? Please take her instead."',
  },
  'Judges 15:4': {
    all: 'Samson went out and caught three hundred foxes. He took torches, tied the foxes tail to tail in pairs, and fastened a torch between each pair of tails.',
  },
  'Judges 15:8': {
    all: 'Then Samson struck them with a great defeat. Afterward he went down and lived in the cave in the rock of Etam.',
  },
  'Judges 15:12': {
    all: 'They said to Samson, "We have come down to tie you up and hand you over to the Philistines." Samson said, "Swear to me that you yourselves will not attack me."',
  },
  'Judges 15:13': {
    all: 'They said to him, "No, we will only tie you up and hand you over to them. We will not kill you." So they tied him with two new ropes and brought him up from the rock.',
  },
  'Judges 15:16': {
    all: 'Samson said, "With the jawbone of a donkey, pile upon pile! With the jawbone of a donkey, I have struck down a thousand men."',
  },
  'Judges 15:17': {
    all: 'When Samson finished speaking, he threw the jawbone out of his hand. That place was called Ramath Lehi.',
  },
  'Judges 15:18': {
    all: 'Samson became very thirsty and cried out to the Lord, "You have given this great victory by your servant\'s hand. Must I now die of thirst and fall into the hands of the Philistines, who are not part of Israel\'s covenant people?"',
  },
  'Judges 15:19': {
    all: 'But God split open the hollow place at Lehi, and water came out. When Samson drank, his strength returned, and he revived. So the spring was named En Hakkore, and it is in Lehi to this day.',
  },
  'Judges 15:20': {
    all: 'Samson judged Israel for twenty years in the days when the Philistines ruled.',
  },
  'Judges 16:14': {
    all: 'Delilah fastened his hair with the pin and said, "The Philistines are on you, Samson!" He woke from sleep and pulled away the pin, the loom, and the fabric.',
  },
  'Judges 17:2': {
    all: 'Micah said to his mother, "The eleven hundred pieces of silver that were taken from you, the silver you spoke a curse about in my hearing-look, I have it. I took it." His mother said, "May the Lord bless my son!"',
  },
  'Judges 17:5': {
    all: 'Micah had a house full of false gods. He made a special priestly vest and household idols. Then he set apart one of his sons to become his priest.',
  },
  'Judges 17:7': {
    all: 'There was a young Levite from Bethlehem in Judah, from the family of Judah, and he lived there.',
  },
  'Judges 17:8': {
    all: 'The young man left Bethlehem in Judah to find another place to live. As he traveled, he came to Micah\'s house in the hill country of Ephraim.',
  },
  'Judges 17:11': {
    all: 'The Levite agreed to live with Micah, and the young man became like one of his sons.',
  },
  'Judges 18:14': {
    all: 'Then the five men who had spied out Laish said to their brothers, "Do you know that these houses have a special priestly vest, household idols, a carved idol, and a metal idol? Now think about what you should do."',
  },
  'Judges 18:21': {
    all: 'Then the Danites turned and left. They put the children, livestock, and goods in front of them.',
  },
  'Judges 18:23': {
    all: 'Micah and his neighbors called out to the descendants of Dan. The Danites turned and said to Micah, "What is wrong? Why have you gathered these men?"',
  },
  'Judges 20:1': {
    all: 'Then all the people of Israel came out together. From Dan to Beersheba, and from the land of Gilead, the whole community gathered before the Lord at Mizpah.',
  },
  'Judges 20:2': {
    all: 'The leaders of all the tribes of Israel stood in the assembly of God\'s people. There were four hundred thousand foot soldiers who carried swords.',
  },
  'Judges 20:3': {
    all: 'The descendants of Benjamin heard that the people of Israel had gone up to Mizpah. The people of Israel said, "Tell us, how did this wickedness happen?"',
  },
  'Judges 20:4': {
    all: 'The Levite, the husband of the woman who had been murdered, answered, "My wife and I came to Gibeah, a town that belongs to Benjamin, to spend the night.',
  },
  'Judges 20:5': {
    all: 'The men of Gibeah rose against me and surrounded the house at night. They meant to kill me, and they did terrible violence to my wife, and she died.',
  },
  'Judges 20:7': {
    all: 'Look, all you people of Israel, speak here and say what you think should be done."',
  },
  'Judges 20:8': {
    all: 'All the people stood together and said, "None of us will go to his tent, and none of us will turn back to his house.',
  },
  'Judges 20:11': {
    all: 'So all the men of Israel gathered against the city, joined together as one.',
  },
  'Judges 20:12': {
    all: 'The tribes of Israel sent men through the whole tribe of Benjamin, saying, "What is this evil that has happened among you?',
  },
  'Judges 20:14': {
    all: 'The descendants of Benjamin gathered from their cities to Gibeah to go out to battle against the people of Israel.',
  },
  'Judges 20:15': {
    all: 'The Benjamites from the cities were counted that day: twenty-six thousand men who carried swords, plus seven hundred chosen men from Gibeah.',
  },
  'Judges 20:17': {
    all: 'The men of Israel, not counting Benjamin, were four hundred thousand men who carried swords. All of them were soldiers.',
  },
  'Judges 20:30': {
    all: 'On the third day, the people of Israel went up against the descendants of Benjamin and lined up against Gibeah as they had before.',
  },
  'Judges 20:34': {
    all: 'Ten thousand chosen men from all Israel came against Gibeah, and the battle was fierce. But the Benjamites did not know disaster was close to them.',
  },
  'Judges 20:43': {
    all: 'Israel surrounded the Benjamites, chased them, and pressed them down near Gibeah toward the sunrise.',
  },
  'Judges 21:6': {
    all: 'The people of Israel grieved for Benjamin their brother. They said, "Today one tribe has been cut off from Israel."',
  },
  'Judges 21:10': {
    all: 'So the community sent twelve thousand brave fighting men and commanded them, "Go and strike the people of Jabesh Gilead with the sword, including women and children.',
  },
  'Judges 21:17': {
    all: 'They said, "The remaining Benjamites must have children to carry on their families, so a tribe will not be wiped out from Israel.',
  },
  'Judges 21:18': {
    all: 'But we may not give them our daughters as wives, because the people of Israel swore, \'Anyone who gives a wife to Benjamin is under a curse.\'"',
  },
  'Judges 21:20': {
    all: 'So they commanded the Benjamites, "Go and hide in the vineyards.',
  },
  'Judges 21:21': {
    all: 'Watch. When the daughters of Shiloh come out to dance, come out from the vineyards. Each man may take one of the daughters of Shiloh as his wife and go back to the land of Benjamin.',
  },
  'Judges 21:22': {
    all: 'When their fathers or brothers come to complain to us, we will say, "Show kindness to them for our sake. We did not capture a wife for each man in battle, and you did not break your oath by giving them wives."',
  },
});

Object.assign(STORY_REVISIONS, {
  'Judges 6:16': {
    all: 'The Lord said to Gideon, "Surely I will be with you, and you will strike Midian as if it were only one man."',
  },
  'Judges 9:27': {
    all: 'They went out into the field, harvested their vineyards, pressed the grapes, celebrated, and went into the house of their god. There they ate, drank, and cursed Abimelech.',
  },
  'Judges 11:11': {
    all: 'Then Jephthah went with the elders of Gilead, and the people made him their head and commander. Jephthah spoke all his words before the Lord in Mizpah.',
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
        body: polishJudgesText(verse.body, ageRange, verse.reference),
      }));

      ageTexts[ageRange] = verses;
      writeAgeChapter(filePath, chapterNumber, verses);
    }

    updateResourceChapter(chapterNumber, ageTexts);
  }

  console.log(`Reviewed Judges chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishJudgesText(text, ageRange, reference) {
  let result = polishKidReadableText(text, ageRange);

  result = result
    .replace(/\bwhich\b/g, 'that')
    .replace(/\binheritance\b/g, 'share of land')
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look')
    .replace(/\bpublic adjuration\b/g, 'public command to tell the truth')
    .replace(/\bchildren of Israel\b/g, 'people of Israel')
    .replace(/\bking of the children of Ammon\b/g, 'king of Ammon')
    .replace(/\bchildren of Ammon\b/g, 'Ammonites')
    .replace(/\bchildren of (Judah|Benjamin|Dan|Ephraim|Manasseh|Naphtali|Zebulun|Gilead)\b/g, 'descendants of $1')
    .replace(/\bthe people of the people of Israel\b/g, 'the people of Israel')
    .replace(/\bpeople who live there of\b/g, 'people living in')
    .replace(/\bpeople who live there\b/g, 'people living there')
    .replace(/\bprinces of Gilead\b/g, 'leaders of Gilead')
    .replace(/\bprinces of Succoth\b/g, 'leaders of Succoth')
    .replace(/\bgreat strife\b/g, 'serious trouble')
    .replace(/\bsave me out of their hand\b/g, 'rescue me from them')
    .replace(/\bput my life in my hand\b/g, 'risked my life')
    .replace(/\bShall I yet again\b/g, 'Should I again')
    .replace(/\bmust I cease\b/g, 'should I stop')
    .replace(/\btake counsel\b/g, 'decide what should be done')
    .replace(/\bno lack of anything\b/g, 'everything we need')
    .replace(/\bdid that was evil\b/g, 'did what was evil')
    .replace(/\bdid what was evil in the Lord's eyes\b/g, "did what was evil in the Lord's sight")
    .replace(/\bin the Lord's eyes\b/g, "in the Lord's sight")
    .replace(/\bin the sight of the Lord\b/g, "in the Lord's sight")
    .replace(/\bthe Lord's anger was kindled\b/g, "the Lord's anger burned")
    .replace(/\banger of the Lord was kindled\b/g, "Lord's anger burned")
    .replace(/\bkindled\b/g, 'burned')
    .replace(/\bforsook\b/g, 'left')
    .replace(/\bBaalim\b/g, 'the Baals')
    .replace(/\bAshtaroth\b/g, 'the Ashtaroth')
    .replace(/\bserved Baal and the Ashtaroth\b/g, 'served false gods named Baal and Ashtaroth')
    .replace(/\bserved the Baals, the Ashtaroth\b/g, 'served many false gods, the Baals and the Ashtaroth')
    .replace(/\bstrange gods\b/g, 'false gods')
    .replace(/\bother gods\b/g, 'false gods')
    .replace(/\bwhoring after\b/g, 'chasing after')
    .replace(/\bprostituted themselves after\b/g, 'chased after')
    .replace(/\bdelivered them into the hand of\b/g, 'handed them over to')
    .replace(/\bsold them into the hand of\b/g, 'gave them over to')
    .replace(/\bdelivered (him|them|it) into (his|their|your) hand\b/g, 'gave $1 into $2 hand')
    .replace(/\bhand of their enemies\b/g, 'power of their enemies')
    .replace(/\boppressors\b/g, 'cruel rulers')
    .replace(/\boppressor\b/g, 'cruel ruler')
    .replace(/\boppressed\b/g, 'treated harshly')
    .replace(/\btribute\b/g, 'forced payment')
    .replace(/\bmen of valor\b/g, 'brave fighting men')
    .replace(/\bmen of war\b/g, 'soldiers')
    .replace(/\bmighty men of valor\b/g, 'brave fighting men')
    .replace(/\bmighty man of valor\b/g, 'brave fighting man')
    .replace(/\bhidden soldiers\b/g, 'ambush')
    .replace(/\ban ambush\b/g, 'men hiding in ambush')
    .replace(/\bchildren of the east\b/g, 'people from the east')
    .replace(/\blords of the Philistines\b/g, 'Philistine rulers')
    .replace(/\blords\b/g, 'rulers')
    .replace(/\bEntice him\b/g, 'Persuade him')
    .replace(/\bentice him\b/g, 'persuade him')
    .replace(/\bafflict him\b/g, 'overpower him')
    .replace(/\bafflict you\b/g, 'overpower you')
    .replace(/\bhearts were merry\b/g, 'they were celebrating')
    .replace(/\bentertain us\b/g, 'perform for us')
    .replace(/\bperformed before them\b/g, 'performed for them')
    .replace(/\bservants\b/g, 'servants')
    .replace(/\bservant\b/g, 'servant')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bplayed the woman against him\b/g, 'was unfaithful to him')
    .replace(/\bconcubine\b/g, ageRange === '5-7' ? 'other wife' : 'secondary wife')
    .replace(/\bconcubines\b/g, ageRange === '5-7' ? 'other wives' : 'secondary wives')
    .replace(/\bharlot\b/g, ageRange === '5-7' ? 'woman' : 'woman whose life had been sinful')
    .replace(/\bprostitute\b/g, ageRange === '5-7' ? 'woman' : 'woman whose life had been sinful')
    .replace(/\bvirgins\b/g, 'unmarried young women')
    .replace(/\bvirgin\b/g, 'unmarried young woman')
    .replace(/\bvirginity\b/g, 'the sorrow that she would never marry')
    .replace(/\bstrong drink\b/g, 'any drink like wine')
    .replace(/\bunclean thing\b/g, 'anything God called unclean for worship')
    .replace(/\banything unclean for worship\b/g, 'food God called unclean for worship')
    .replace(/\bmeal offering\b/g, 'grain offering')
    .replace(/\bmeal offerings\b/g, 'grain offerings')
    .replace(/\bunleavened cakes\b/g, 'flat bread made without yeast')
    .replace(/\bdry measure of meal\b/g, 'measure of flour')
    .replace(/\bhouse of bondage\b/g, 'place where they had been slaves')
    .replace(/\blinen garments\b/g, 'fine garments')
    .replace(/\bchanges of clothing\b/g, 'sets of clothes')
    .replace(/\bmolten image\b/g, 'metal idol')
    .replace(/\bteraphim\b/g, 'household idols')
    .replace(/\bephod\b/g, 'special priestly vest')
    .replace(/\bconsecrated\b/g, 'set apart')
    .replace(/\bOutlaws\b/g, 'Troublemakers')
    .replace(/\boutlaws\b/g, 'troublemakers')
    .replace(/\buncircumcised Philistines\b/g, "Philistines who were not part of Israel's covenant people")
    .replace(/\bDwell with me\b/g, 'Stay with me')
    .replace(/\bdwell with me\b/g, 'stay with me')
    .replace(/\bDwell\b/g, 'Live')
    .replace(/\bdwell\b/g, 'live')
    .replace(/\bdetain me\b/g, 'keep me here')
    .replace(/\bentreat(?:ed)?\b/g, 'prayed to')
    .replace(/\bobserve all\b/g, 'do everything')
    .replace(/\bfrom off the altar\b/g, 'from the altar')
    .replace(/\bwithin the border\b/g, 'inside the border')
    .replace(/\bstrive against\b/g, 'argue with')
    .replace(/\brecover them\b/g, 'take them back')
    .replace(/\bwith a very great slaughter\b/g, 'with a very great defeat')
    .replace(/\bsubdued before\b/g, 'brought low before')
    .replace(/\bplunder\b/g, 'goods')
    .replace(/\bspoils\b/g, 'goods')
    .replace(/\bpitchers\b/g, 'jars')
    .replace(/\bcompanies\b/g, 'groups')
    .replace(/\bthe Lord's Spirit came mightily on him\b/g, 'the Spirit of the Lord rushed on him')
    .replace(/\bwho has lain with a man\b/g, 'who has been married')
    .replace(/\bhad not known man by lying with him\b/g, 'had never been married')
    .replace(/\byoung unmarried young women\b/g, 'young women')
    .replace(/\bcatch his wife\b/g, 'take one woman as his wife')
    .replace(/\bIt must be, when\b/g, 'When')
    .replace(/\bit must be, when\b/g, 'when')
    .replace(/\bIt must be, that\b/g, 'When')
    .replace(/\bIt must be that\b/g, 'When')
    .replace(/\bgrant them graciously to us\b/g, 'show kindness to them for our sake')
    .replace(/\bthe congregation\b/g, 'the community')
    .replace(/\bcongregation\b/g, 'community')
    .replace(/\bassembly\b/g, 'assembly')
    .replace(/\bslain\b/g, 'killed')
    .replace(/\bsmote\b/g, 'struck')
    .replace(/\bsmite\b/g, 'strike')
    .replace(/\butterly\b/g, 'completely')
    .replace(/\bdevoted to destruction\b/g, 'set apart for judgment')
    .replace(/\bdevoted\b/g, 'set apart')
    .replace(/\baccursed\b/g, 'under judgment')
    .replace(/\bavenger of blood\b/g, 'family protector seeking justice')
    .replace(/\bmanslayer\b/g, 'person who killed someone')
    .replace(/\bsuburbs\b/g, 'pasturelands')
    .replace(/\bsuburb\b/g, 'pastureland')
    .replace(/\bcubits\b/g, 'arm-lengths')
    .replace(/\bcubit\b/g, 'arm-length')
    .replace(/\bvessel\b/g, 'container')
    .replace(/\bvessels\b/g, 'containers')
    .replace(/\bprovisions\b/g, 'food supplies')
    .replace(/\bfodder\b/g, 'feed')
    .replace(/\blodged there\b/g, 'stayed there for the night')
    .replace(/\bset the battle in array\b/g, 'lined up for battle')
    .replace(/\bassembled themselves together\b/g, 'gathered together')
    .replace(/\bpassed over\b/g, 'crossed over')
    .replace(/\brose up\b/g, 'got up')
    .replace(/\bwent out from\b/g, 'left')
    .replace(/\bconsumed\b/g, 'burned up')
    .replace(/\binquired\b/g, 'asked carefully')
    .replace(/\boutermost part\b/g, 'edge')
    .replace(/\bput them to flight\b/g, 'made them run away')
    .replace(/\bfaint\b/g, 'tired')
    .replace(/\bslothful\b/g, 'slow')
    .replace(/\bjeopardized their lives to the death\b/g, 'risked their lives')
    .replace(/\baccording to what\b/g, 'just as')
    .replace(/\baccording to all\b/g, 'because of all')
    .replace(/\baccording to\b/g, 'as')
    .replace(/\bcustom in Israel:\b/g, 'custom in Israel.')
    .replace(/\bneither did they\b/g, 'They also did not')
    .replace(/\bgoodness\b/g, 'kindness')
    .replace(/\bproclaimed peace to\b/g, 'offered peace to')
    .replace(/\bsaved alive\b/g, 'spared')
    .replace(/\bmade a breach\b/g, 'made a gap')
    .replace(/\bCursed is he\b/g, 'Under a curse is anyone')
    .replace(/\bvowed a vow\b/g, 'made a vow')
    .replace(/\bNow therefore\b/g, 'Now')
    .replace(/\bnow therefore\b/g, 'now')
    .replace(/\bIt happened when\b/g, 'When')
    .replace(/\bIt happened that\b/g, 'Then')
    .replace(/\bit happened that\b/g, 'then')
    .replace(/\bby lot\b/g, 'by lot')
    .replace(/\bof that\b/g, 'that')
    .replace(/\bin that\b/g, 'where')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  const override = STORY_REVISIONS[reference]?.[ageRange] || STORY_REVISIONS[reference]?.all;
  return override ? finalPolish(override, ageRange) : finalPolish(result, ageRange);
}

function finalPolish(text, ageRange) {
  let result = String(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac[\u02dc\u2122]/g, "'")
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')
    .replace(/\bwhich\b/g, 'that')
    .replace(/\binheritance\b/g, 'share of land')
    .replace(/\bdid that was evil\b/g, 'did what was evil')
    .replace(/\bking of the children of Ammon\b/g, 'king of Ammon')
    .replace(/\bchildren of Ammon\b/g, 'Ammonites')
    .replace(/\bchildren of Israel\b/g, 'people of Israel')
    .replace(/\bchildren of (Judah|Benjamin|Dan|Ephraim|Manasseh|Naphtali|Zebulun|Gilead)\b/g, 'descendants of $1')
    .replace(/\bpeople who live there of\b/g, 'people living in')
    .replace(/\bpeople who live there\b/g, 'people living there')
    .replace(/\bprinces of Gilead\b/g, 'leaders of Gilead')
    .replace(/\bprinces of Succoth\b/g, 'leaders of Succoth')
    .replace(/\bgreat strife\b/g, 'serious trouble')
    .replace(/\bsave me out of their hand\b/g, 'rescue me from them')
    .replace(/\bput my life in my hand\b/g, 'risked my life')
    .replace(/\bShall I yet again\b/g, 'Should I again')
    .replace(/\bmust I cease\b/g, 'should I stop')
    .replace(/\btake counsel\b/g, 'decide what should be done')
    .replace(/\bno lack of anything\b/g, 'everything we need')
    .replace(/\bmen of valor\b/g, 'brave fighting men')
    .replace(/\bhidden soldiers\b/g, 'ambush')
    .replace(/\ban ambush\b/g, 'men hiding in ambush')
    .replace(/\bchildren of the east\b/g, 'people from the east')
    .replace(/\blords of the Philistines\b/g, 'Philistine rulers')
    .replace(/\blords\b/g, 'rulers')
    .replace(/\bEntice him\b/g, 'Persuade him')
    .replace(/\bentice him\b/g, 'persuade him')
    .replace(/\bafflict him\b/g, 'overpower him')
    .replace(/\bafflict you\b/g, 'overpower you')
    .replace(/\bhearts were merry\b/g, 'they were celebrating')
    .replace(/\bentertain us\b/g, 'perform for us')
    .replace(/\bperformed before them\b/g, 'performed for them')
    .replace(/\bserved Baal and the Ashtaroth\b/g, 'served false gods named Baal and Ashtaroth')
    .replace(/\bserved the Baals, the Ashtaroth\b/g, 'served many false gods, the Baals and the Ashtaroth')
    .replace(/\bplayed the woman against him\b/g, 'was unfaithful to him')
    .replace(/\bvirginity\b/g, 'the sorrow that she would never marry')
    .replace(/\bstrong drink\b/g, 'any drink like wine')
    .replace(/\bunclean thing\b/g, 'anything God called unclean for worship')
    .replace(/\banything unclean for worship\b/g, 'food God called unclean for worship')
    .replace(/\bmeal offering\b/g, 'grain offering')
    .replace(/\bmeal offerings\b/g, 'grain offerings')
    .replace(/\bunleavened cakes\b/g, 'flat bread made without yeast')
    .replace(/\bdry measure of meal\b/g, 'measure of flour')
    .replace(/\bhouse of bondage\b/g, 'place where they had been slaves')
    .replace(/\blinen garments\b/g, 'fine garments')
    .replace(/\bchanges of clothing\b/g, 'sets of clothes')
    .replace(/\bmolten image\b/g, 'metal idol')
    .replace(/\bteraphim\b/g, 'household idols')
    .replace(/\bephod\b/g, 'special priestly vest')
    .replace(/\bconsecrated\b/g, 'set apart')
    .replace(/\bOutlaws\b/g, 'Troublemakers')
    .replace(/\boutlaws\b/g, 'troublemakers')
    .replace(/\buncircumcised Philistines\b/g, "Philistines who were not part of Israel's covenant people")
    .replace(/\bDwell with me\b/g, 'Stay with me')
    .replace(/\bdwell with me\b/g, 'stay with me')
    .replace(/\bDwell\b/g, 'Live')
    .replace(/\bdwell\b/g, 'live')
    .replace(/\bdetain me\b/g, 'keep me here')
    .replace(/\bentreat(?:ed)?\b/g, 'prayed to')
    .replace(/\bobserve all\b/g, 'do everything')
    .replace(/\bfrom off the altar\b/g, 'from the altar')
    .replace(/\bwithin the border\b/g, 'inside the border')
    .replace(/\bstrive against\b/g, 'argue with')
    .replace(/\brecover them\b/g, 'take them back')
    .replace(/\bwith a very great slaughter\b/g, 'with a very great defeat')
    .replace(/\bsubdued before\b/g, 'brought low before')
    .replace(/\bplunder\b/g, 'goods')
    .replace(/\bspoils\b/g, 'goods')
    .replace(/\bpitchers\b/g, 'jars')
    .replace(/\bcompanies\b/g, 'groups')
    .replace(/\bthe Lord's Spirit came mightily on him\b/g, 'the Spirit of the Lord rushed on him')
    .replace(/\bwho has lain with a man\b/g, 'who has been married')
    .replace(/\bhad not known man by lying with him\b/g, 'had never been married')
    .replace(/\byoung unmarried young women\b/g, 'young women')
    .replace(/\bcatch his wife\b/g, 'take one woman as his wife')
    .replace(/\bIt must be, when\b/g, 'When')
    .replace(/\bit must be, when\b/g, 'when')
    .replace(/\bIt must be, that\b/g, 'When')
    .replace(/\bIt must be that\b/g, 'When')
    .replace(/\bgrant them graciously to us\b/g, 'show kindness to them for our sake')
    .replace(/\bthe congregation\b/g, 'the community')
    .replace(/\bcongregation\b/g, 'community')
    .replace(/\bthe people of the people of Israel\b/g, 'the people of Israel')
    .replace(/\bfodder\b/g, 'feed')
    .replace(/\blodged there\b/g, 'stayed there for the night')
    .replace(/\bset the battle in array\b/g, 'lined up for battle')
    .replace(/\bassembled themselves together\b/g, 'gathered together')
    .replace(/\bpassed over\b/g, 'crossed over')
    .replace(/\brose up\b/g, 'got up')
    .replace(/\bwent out from\b/g, 'left')
    .replace(/\bconsumed\b/g, 'burned up')
    .replace(/\binquired\b/g, 'asked carefully')
    .replace(/\boutermost part\b/g, 'edge')
    .replace(/\bput them to flight\b/g, 'made them run away')
    .replace(/\bfaint\b/g, 'tired')
    .replace(/\bslothful\b/g, 'slow')
    .replace(/\bjeopardized their lives to the death\b/g, 'risked their lives')
    .replace(/\baccording to what\b/g, 'just as')
    .replace(/\baccording to all\b/g, 'because of all')
    .replace(/\baccording to\b/g, 'as')
    .replace(/\bcustom in Israel:\b/g, 'custom in Israel.')
    .replace(/\bneither did they\b/g, 'They also did not')
    .replace(/\bgoodness\b/g, 'kindness')
    .replace(/\bproclaimed peace to\b/g, 'offered peace to')
    .replace(/\bsaved alive\b/g, 'spared')
    .replace(/\bmade a breach\b/g, 'made a gap')
    .replace(/\bCursed is he\b/g, 'Under a curse is anyone')
    .replace(/^the Lord\b/g, 'The Lord')
    .replace(/^"the Lord\b/g, '"The Lord')
    .replace(/([.!?]\s+)the Lord\b/g, '$1The Lord')
    .replace(/\ban special priestly vest, a special priestly object\b/g, 'a special priestly object')
    .replace(/\ban special priestly vest, a special priestly vest\b/g, 'a special priestly vest')
    .replace(/\ban special\b/g, 'a special')
    .replace(/\. therefore\b/g, '. Therefore')
    .replace(/\. with\b/g, '. With')
    .replace(/;\s+and\b/g, '. And')
    .replace(/;\s+but\b/g, '. But')
    .replace(/;\s+for\b/g, ', because')
    .replace(/;\s+then\b/g, '. Then')
    .replace(/;\s+so\b/g, '. So')
    .replace(/;\s+/g, '. ')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look')
    .replace(/\ban share\b/g, 'a share')
    .replace(/\bthat that\b/g, 'that')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\ba ([aeiou])/gi, 'an $1')
    .replace(/\ban (one|united|useful|year|young)/gi, 'a $1')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (ageRange === '5-7') {
    result = result.replace(/\bsecondary wife\b/g, 'other wife');
  }

  return result;
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

  for (let verseNumber = 1; verseNumber <= verseCount; verseNumber += 1) {
    const reference = `${BOOK_NAME} ${chapterNumber}:${verseNumber}`;
    const age57 = findVerse(ageTexts['5-7'], reference);
    const age810 = findVerse(ageTexts['8-10'], reference);

    content = replaceResourceAgeText(content, reference, '5-7', age57);
    content = replaceResourceAgeText(content, reference, '8-10', age810);
  }

  content = replaceMemoryVerseText(content, '5-7', ageTexts['5-7'], chapterNumber);
  content = replaceMemoryVerseText(content, '8-10', ageTexts['8-10'], chapterNumber);
  content = replaceResourceOverview(content, chapterNumber);
  content = replaceChapterSummary(content, chapterNumber);
  content = removeDraftResourceNote(content);
  content = content.replace(/\n{2,}$/g, '\n');

  fs.writeFileSync(resourcePath, content, 'utf8');
}

function replaceResourceOverview(content, chapterNumber) {
  const data = RESOURCE_DATA[chapterNumber];
  if (!data) return content;

  const firstSentence = data.summary.match(/^.*?\./)?.[0] || data.summary;
  const overview = `${BOOK_OVERVIEW} This chapter focuses on ${firstSentence.charAt(0).toLowerCase()}${firstSentence.slice(1)}`;

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

function replaceMemoryVerseText(content, ageRange, verses, chapterNumber) {
  const heading = ageRange === '5-7' ? '### Ages 5-7' : '### Ages 8-10';
  const nextHeading = ageRange === '5-7' ? '### Ages 8-10' : '## Discussion Questions by Age';
  const regex = new RegExp(
    `(## Memory Verses by Age[\\s\\S]*?${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(\\r?\\n\\r?\\n${escapeRegex(nextHeading)})`,
    'm'
  );

  return content.replace(regex, (match, prefix, body, suffix) => {
    const preferredReference = MEMORY_REFERENCES[chapterNumber];
    let updated = body.replace(/^(.+?)\s+-\s+(Judges\s+\d+:\d+)$/gm, (line, text, reference) => {
      const targetReference = preferredReference || reference;
      const replacement = findVerse(verses, targetReference);
      return replacement ? `${replacement} - ${targetReference}` : line;
    });

    if (preferredReference && !updated.includes(`- ${preferredReference}`)) {
      const replacement = findVerse(verses, preferredReference);
      if (replacement) updated = `${replacement} - ${preferredReference}`;
    }

    return `${prefix}${updated}${suffix}`;
  });
}

function replaceResourceAgeText(content, reference, ageRange, text) {
  if (!text) return content;

  const heading = ageRange === '5-7' ? '#### Ages 5-7' : '#### Ages 8-10';
  const nextHeading = ageRange === '5-7' ? '#### Ages 8-10' : '**Translation Notes**:';
  const regex = new RegExp(
    `(### ${escapeRegex(reference)}[\\s\\S]*?${escapeRegex(heading)}\\s*\\r?\\n)([\\s\\S]*?)(\\r?\\n\\r?\\n${escapeRegex(nextHeading)})`,
    'm'
  );

  return content.replace(regex, `$1${text}$3`);
}

function extractVerses(content) {
  const verseSection = extractSection(content, '## Verses') || content;
  const verseRegex = /^###\s+(Judges\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+Judges\s+\d+:\d+\s*$|(?![\s\S]))/gm;
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
