#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = 'joshua';
const BOOK_NAME = 'Joshua';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 24 }, (_, index) => index + 1);

const BOOK_OVERVIEW =
  'Joshua tells how the Lord brought Israel into the promised land, kept his promises, judged wicked cities, gave Israel their land, and called his people to serve him faithfully.';

const RESOURCE_DATA = {
  1: {
    summary: 'After Moses dies, the Lord speaks to Joshua and commands him to lead Israel across the Jordan into the land he promised. The Lord tells Joshua to be strong and courageous, to keep the Book of the Law close, and promises to be with him as he was with Moses.',
    lessons: [
      ['God keeps leading his people', 'Moses has died, but the Lord continues his promise through Joshua.'],
      ['Courage comes from God being near', 'Joshua can be strong because the Lord promises to be with him.'],
    ],
  },
  2: {
    summary: 'Joshua sends two spies into Jericho, where Rahab hides them and confesses that the Lord has given Israel the land. She asks for mercy for her family, and the spies promise safety if the red cord is in her window and her family stays inside.',
    lessons: [
      ['Faith can appear in unexpected places', 'Rahab believes the Lord is God in heaven above and on earth below.'],
      ['Mercy is remembered', 'Rahab protects the spies, and her household is promised rescue.'],
    ],
  },
  3: {
    summary: 'Israel follows the Lord\'s covenant chest toward the Jordan River, and the priests step into the floodwater. The Lord stops the river, the priests stand on dry ground, and all Israel crosses over safely.',
    lessons: [
      ['God goes before his people', 'The covenant chest leads Israel toward the river.'],
      ['God opens the way', 'The flooded Jordan stops because the Lord acts for his people.'],
    ],
  },
  4: {
    summary: 'The Lord tells Joshua to choose twelve stones from the Jordan as a sign for future children. The stones remind Israel that the Lord dried up the Jordan just as he dried up the Red Sea, so all the earth may know his hand is mighty.',
    lessons: [
      ['Children need the story of God\'s works', 'The stones help parents answer when children ask what happened.'],
      ['God wants his mighty acts remembered', 'The crossing becomes a witness to Israel and the nations.'],
    ],
  },
  5: {
    summary: 'After crossing the Jordan, Israel receives the covenant sign of circumcision, keeps the Passover, and eats food from the land as the manna stops. Joshua then meets the commander of the Lord\'s army and learns that the place is holy.',
    lessons: [
      ['God renews covenant identity', 'Israel is marked again as the people of the Lord before entering battle.'],
      ['The Lord is the true commander', 'Joshua must take off his sandals because he stands on holy ground.'],
    ],
  },
  6: {
    summary: 'The Lord gives Joshua instructions for Jericho: Israel must march around the city, the priests must blow trumpets, and the people must shout. The walls fall, the city comes under judgment, and Rahab and her family are rescued as promised.',
    lessons: [
      ['Victory belongs to the Lord', 'Jericho falls because the Lord gives the city into Israel\'s hand.'],
      ['God remembers mercy in judgment', 'Rahab and her family are brought safely out.'],
    ],
  },
  7: {
    summary: 'Achan takes things from Jericho that were set apart for the Lord, and Israel is defeated at Ai. The Lord exposes the hidden sin, Achan confesses, and judgment comes so Israel can again stand rightly before the Lord.',
    lessons: [
      ['Hidden sin is not hidden from God', 'Achan\'s secret disobedience affects the whole camp.'],
      ['God\'s holiness matters', 'Israel cannot treat what belongs to the Lord as ordinary treasure.'],
    ],
  },
  8: {
    summary: 'The Lord tells Joshua not to fear and gives Israel victory over Ai through a hidden battle plan. Afterward Joshua builds an altar on Mount Ebal, writes the law on stones, and reads the blessings and curses to all Israel.',
    lessons: [
      ['God gives a new start after repentance', 'After judgment in chapter 7, the Lord again leads Israel.'],
      ['God\'s word shapes God\'s people', 'Joshua reads the law to everyone, including children and foreigners.'],
    ],
  },
  9: {
    summary: 'The Gibeonites deceive Israel by pretending to come from a faraway land. Israel makes a covenant without asking counsel from the Lord, and when the truth is found out, the Gibeonites are spared but assigned servant work for the altar.',
    lessons: [
      ['God\'s counsel must be sought', 'Israel makes a serious decision without asking the Lord.'],
      ['Promises must be kept', 'Even after deception, Israel keeps the covenant they made.'],
    ],
  },
  10: {
    summary: 'Five Amorite kings attack Gibeon, and the Lord gives Israel victory as Joshua comes to help. The Lord sends hailstones, Joshua asks for the sun and moon to stand still, and Israel defeats many southern cities.',
    lessons: [
      ['The Lord fights for his people', 'The victory is described as the Lord giving enemies into Israel\'s hand.'],
      ['God rules creation and battle', 'Even the sun and moon serve the Lord\'s purpose.'],
    ],
  },
  11: {
    summary: 'Northern kings gather against Israel with many soldiers, horses, and chariots, but the Lord tells Joshua not to fear. Joshua obeys, the Lord gives victory, and the land has rest from war.',
    lessons: [
      ['Numbers do not frighten God', 'A huge army cannot stop the Lord\'s promise.'],
      ['Obedience follows God\'s command', 'Joshua does what the Lord commanded Moses.'],
    ],
  },
  12: {
    summary: 'Joshua 12 lists the kings defeated east and west of the Jordan. The list remembers the victories the Lord gave through Moses and Joshua as Israel received the promised land.',
    lessons: [
      ['God remembers every victory', 'The list of kings shows that the Lord gave real victories in real places.'],
      ['God keeps promises over time', 'The victories under Moses and Joshua belong to one covenant story.'],
    ],
  },
  13: {
    summary: 'When Joshua is old, the Lord tells him there is still land to be possessed, but also commands him to divide the land as an inheritance. The chapter describes land east of the Jordan and reminds Israel that Levi\'s inheritance is the Lord.',
    lessons: [
      ['God\'s work continues across generations', 'Joshua is old, but the Lord\'s promise still moves forward.'],
      ['The Lord is the Levites\' inheritance', 'Levi receives holy service and the Lord himself as their portion.'],
    ],
  },
  14: {
    summary: 'The land west of the Jordan begins to be divided, and Caleb asks Joshua for Hebron. Caleb remembers the Lord\'s promise through Moses and trusts the Lord for strength even in old age.',
    lessons: [
      ['Faith can stay strong for many years', 'Caleb still trusts the Lord after forty-five years.'],
      ['God\'s promises are worth waiting for', 'Caleb asks for what the Lord promised him.'],
    ],
  },
  15: {
    summary: 'Judah receives its land, including boundaries, cities, and villages. Caleb takes Hebron, Othniel captures Kiriath Sepher, and Achsah asks her father Caleb for springs of water.',
    lessons: [
      ['God gives particular places', 'The land is named in detail because the promise is concrete.'],
      ['Families live inside God\'s promise', 'Caleb, Othniel, and Achsah appear within the story of Judah\'s inheritance.'],
    ],
  },
  16: {
    summary: 'The descendants of Joseph receive their inheritance, beginning with the land for Ephraim. The chapter names boundary lines and notes that the Canaanites in Gezer were not driven out but lived among Ephraim as forced labor.',
    lessons: [
      ['God gives land by family', 'Joseph\'s descendants receive a real share in the promise.'],
      ['Incomplete obedience matters', 'The note about Gezer shows a problem left unresolved.'],
    ],
  },
  17: {
    summary: 'Manasseh receives land, including an inheritance for Zelophehad\'s daughters because the Lord had commanded it through Moses. Joseph\'s descendants ask for more space, and Joshua tells them to clear the forested hill country.',
    lessons: [
      ['God keeps just commands', 'Zelophehad\'s daughters receive land as the Lord had said.'],
      ['God\'s gifts call for faithful work', 'Joshua tells Joseph\'s descendants to use the land before them.'],
    ],
  },
  18: {
    summary: 'The tabernacle is set up at Shiloh, and Joshua sends men to describe the land that remains. Lots are cast before the Lord, and Benjamin receives its inheritance with named boundaries and cities.',
    lessons: [
      ['Worship stands at the center', 'The tent of meeting is set up as the land is divided.'],
      ['God orders his people\'s place', 'The remaining land is divided before the Lord.'],
    ],
  },
  19: {
    summary: 'The remaining tribes receive their inheritances: Simeon, Zebulun, Issachar, Asher, Naphtali, and Dan. When the land is divided, Israel gives Joshua his own city, Timnath Serah, as the Lord commanded.',
    lessons: [
      ['Every tribe has a place', 'The Lord provides land for tribe after tribe.'],
      ['Faithful leaders receive care too', 'Joshua receives a city after serving the people.'],
    ],
  },
  20: {
    summary: 'The Lord commands Israel to appoint cities of refuge. These cities protect someone who killed another person without meaning to until there can be a fair hearing before the community.',
    lessons: [
      ['God cares about justice', 'The cities protect life while guilt or innocence is judged.'],
      ['God provides refuge', 'The Lord makes a safe place for someone in danger before a fair hearing.'],
    ],
  },
  21: {
    summary: 'The Levites receive towns and pasturelands among the tribes of Israel. The chapter ends by declaring that the Lord gave Israel all the land he swore to give, gave them rest, and kept every good promise.',
    lessons: [
      ['God provides for worship servants', 'The Levites receive towns throughout Israel.'],
      ['God keeps every good word', 'Not one of the Lord\'s good promises fails.'],
    ],
  },
  22: {
    summary: 'Joshua sends the eastern tribes home after they have helped their brothers. When they build a large altar by the Jordan, the other tribes fear rebellion, but the eastern tribes explain it is a witness that they too belong to the Lord.',
    lessons: [
      ['God\'s people must guard true worship', 'Israel takes possible rebellion seriously.'],
      ['Peacemaking asks and listens', 'The tribes talk before fighting and learn the altar is a witness.'],
    ],
  },
  23: {
    summary: 'Joshua, now old, calls Israel\'s leaders and reminds them that the Lord fought for them and gave them the land. He warns them to hold fast to the Lord and not cling to the gods of the nations around them.',
    lessons: [
      ['Remember what the Lord has done', 'Joshua points Israel back to God\'s victories.'],
      ['Faithfulness must continue', 'Israel must keep clinging to the Lord after the battles.'],
    ],
  },
  24: {
    summary: 'Joshua gathers Israel at Shechem and retells the story of God\'s grace from Abraham to Egypt, the wilderness, and the land. He calls the people to serve the Lord, renews the covenant, sets up a witness stone, and the book closes with burials of Joshua, Joseph\'s bones, and Eleazar.',
    lessons: [
      ['God\'s grace comes first', 'Joshua tells what the Lord did before calling Israel to serve him.'],
      ['Choose whom you will serve', 'Joshua calls Israel to put away false gods and serve the Lord faithfully.'],
    ],
  },
};

const MEMORY_REFERENCES = {
  1: 'Joshua 1:9',
  2: 'Joshua 2:11',
  3: 'Joshua 3:17',
  4: 'Joshua 4:24',
  5: 'Joshua 5:15',
  6: 'Joshua 6:25',
  7: 'Joshua 7:19',
  8: 'Joshua 8:34',
  9: 'Joshua 9:14',
  10: 'Joshua 10:14',
  11: 'Joshua 11:23',
  12: 'Joshua 12:1',
  13: 'Joshua 13:1',
  14: 'Joshua 14:12',
  15: 'Joshua 15:19',
  16: 'Joshua 16:4',
  17: 'Joshua 17:4',
  18: 'Joshua 18:1',
  19: 'Joshua 19:49',
  20: 'Joshua 20:3',
  21: 'Joshua 21:45',
  22: 'Joshua 22:5',
  23: 'Joshua 23:8',
  24: 'Joshua 24:15',
};

const STORY_REVISIONS = {
  'Joshua 1:1': {
    all: 'After Moses, the servant of the Lord, died, the Lord spoke to Joshua son of Nun. Joshua had been Moses\' helper.',
  },
  'Joshua 1:2': {
    all: 'The Lord said, "Moses my servant is dead. Now get up and lead all these people across the Jordan River into the land I am giving to the people of Israel.',
  },
  'Joshua 1:3': {
    all: 'Every place where your feet step will be land I have given you, just as I promised Moses.',
  },
  'Joshua 1:4': {
    all: 'Your land will stretch from the wilderness and Lebanon to the great Euphrates River, across the land of the Hittites, and all the way to the Great Sea where the sun goes down.',
  },
  'Joshua 1:5': {
    all: 'No one will be able to stand against you all the days of your life. As I was with Moses, I will be with you. I will not leave you or give you up.',
  },
  'Joshua 1:6': {
    all: 'Be strong and courageous, because you will lead this people to receive the land I swore to give their ancestors.',
  },
  'Joshua 1:7': {
    all: 'Only be strong and very courageous. Carefully do everything in the law that Moses my servant commanded you. Do not turn away from it to the right or to the left, so you may do wisely wherever you go.',
  },
  'Joshua 1:8': {
    all: 'Keep this Book of the Law on your lips. Think about it day and night, so you will carefully do everything written in it. Then your way will be blessed, and you will do wisely.',
  },
  'Joshua 1:9': {
    all: 'Have I not commanded you? Be strong and courageous. Do not be afraid or discouraged, because the Lord your God is with you wherever you go.',
  },
  'Joshua 1:11': {
    all: 'He told them, "Go through the camp and tell the people, \'Get your food ready. In three days you will cross the Jordan River and go in to receive the land the Lord your God is giving you.\'"',
  },
  'Joshua 1:13': {
    all: 'Joshua said, "Remember what Moses, the servant of the Lord, commanded you: \'The Lord your God is giving you rest, and he has given you this land.\'',
  },
  'Joshua 1:14': {
    all: 'Your wives, your little ones, and your animals may stay in the land Moses gave you east of the Jordan River. But your brave fighting men must cross over in front of your brothers and help them.',
  },
  'Joshua 1:15': {
    all: 'Keep helping them until the Lord gives your brothers rest as he has given you rest, and until they too receive the land the Lord your God is giving them. Then you may return to the land Moses gave you east of the Jordan River, toward the sunrise.',
  },
  'Joshua 1:18': {
    all: 'Anyone who rebels against your command and refuses to listen to your words must be put to death. Only be strong and courageous.',
  },
  'Joshua 2:1': {
    all: 'From Shittim, Joshua son of Nun secretly sent out two men as spies. He said, "Go look over the land, especially Jericho." So they went to Jericho and came to the house of Rahab, and they stayed there.',
  },
  'Joshua 2:2': {
    all: 'Someone told the king of Jericho, "Men from the people of Israel came here tonight to spy out the land."',
  },
  'Joshua 2:4': {
    all: 'But Rahab had taken the two men and hidden them. She said, "Yes, the men came to me, but I did not know where they were from.',
  },
  'Joshua 2:5': {
    all: 'When it was getting dark and the city gate was about to close, the men went out. I do not know where they went. Chase after them quickly. You may still catch them."',
  },
  'Joshua 2:6': {
    all: 'But Rahab had taken the spies up to the flat roof of her house. She hid them under bundles of flax stalks that were spread out there to dry.',
  },
  'Joshua 2:7': {
    all: 'The king\'s men chased after them on the road toward the places where people crossed the Jordan River. As soon as the pursuers went out, the city gate was shut.',
  },
  'Joshua 2:8': {
    all: 'Before the spies lay down for the night, Rahab went up to them on the roof.',
  },
  'Joshua 2:9': {
    all: 'She said, "I know the Lord has given you this land. Fear of you has fallen on us, and everyone living in the land is trembling because of you.',
  },
  'Joshua 2:10': {
    all: 'We heard how the Lord dried up the Red Sea before you when you came out of Egypt. We also heard what you did to Sihon and Og, the two Amorite kings east of the Jordan River, when you completely destroyed them.',
  },
  'Joshua 2:11': {
    all: 'When we heard it, our hearts melted with fear, and no courage was left in anyone because of you. The Lord your God is God in heaven above and on earth below.',
  },
  'Joshua 2:12': {
    all: 'Now please promise me by the Lord: I have shown kindness to you, so show kindness to my father\'s family. Give me a sure sign.',
  },
  'Joshua 2:13': {
    all: 'Promise that you will spare my father, my mother, my brothers, my sisters, and everyone who belongs to them. Save our lives from death."',
  },
  'Joshua 2:14': {
    all: 'The men said to her, "Our lives for yours, if you do not tell anyone what we are doing. When the Lord gives us the land, we will show you kindness and keep our promise."',
  },
  'Joshua 2:15': {
    all: 'Then Rahab let them down by a cord through the window, because her house was built into the city wall and she lived in the wall.',
  },
  'Joshua 2:16': {
    all: 'She told them, "Go to the hills, or the men chasing you will find you. Hide there for three days, until they come back. After that, you can go on your way."',
  },
  'Joshua 2:17': {
    all: 'The men said to her, "We will be free from the promise you made us swear unless you do this:',
  },
  'Joshua 2:18': {
    all: 'When we come into the land, tie this red cord in the window you used to let us down. Bring your father, your mother, your brothers, and all your father\'s family into your house.',
  },
  'Joshua 2:19': {
    all: 'If anyone goes outside your house into the street, his death will be his own fault. But if anyone inside the house is harmed, the blame will be on us.',
  },
  'Joshua 2:20': {
    all: 'If you tell anyone what we are doing, then we will be free from the promise you made us swear."',
  },
  'Joshua 2:21': {
    all: 'Rahab said, "Let it be just as you have said." She sent them away, and they left. Then she tied the red cord in the window.',
  },
  'Joshua 2:24': {
    all: 'They told Joshua, "The Lord has truly given the whole land into our hands. Everyone living there is trembling because of us."',
  },
  'Joshua 3:13': {
    all: 'As soon as the priests carrying the Lord\'s covenant chest set their feet in the Jordan River, the water flowing down from upstream will stop and stand in a heap."',
  },
  'Joshua 3:15': {
    all: 'It was harvest time, and the Jordan River was overflowing its banks. The priests carrying the covenant chest came to the river, and their feet touched the edge of the water.',
  },
  'Joshua 3:16': {
    all: 'Then the water flowing from upstream stopped. It stood up in a heap far away near the city of Adam, beside Zarethan. The water flowing down toward the Salt Sea was cut off, and the people crossed near Jericho.',
  },
  'Joshua 3:17': {
    all: 'The priests carrying the Lord\'s covenant chest stood firmly on dry ground in the middle of the Jordan River. All Israel crossed over on dry ground until the whole nation had finished crossing.',
  },
  'Joshua 4:6': {
    all: 'Joshua said, "These stones will be a sign among you. In days to come, when your children ask, \'What do these stones mean?\'',
  },
  'Joshua 4:7': {
    all: 'you will tell them, \'The water of the Jordan River stopped before the Lord\'s covenant chest. When the chest crossed the Jordan River, the water stopped.\' These stones will help Israel remember this forever."',
  },
  'Joshua 4:10': {
    all: 'The priests carrying the covenant chest stood in the middle of the Jordan River until everything the Lord commanded Joshua to tell the people was finished, just as Moses had commanded Joshua. The people hurried across.',
  },
  'Joshua 4:23': {
    all: 'The Lord your God dried up the water of the Jordan River before you until you crossed, just as he dried up the Red Sea before us until we crossed.',
  },
  'Joshua 4:24': {
    all: 'He did this so all the peoples of the earth would know that the hand of the Lord is mighty, and so you would fear the Lord your God forever.',
  },
  'Joshua 5:2': {
    all: 'At that time the Lord told Joshua, "Make sharp stone knives and give the covenant body sign called circumcision to the sons of Israel again."',
  },
  'Joshua 5:8': {
    all: 'After all the men had received the covenant body sign called circumcision, they stayed in their places in the camp until they were healed.',
  },
  'Joshua 5:9': {
    all: 'Then the Lord said to Joshua, "Today I have rolled away the shame of Egypt from you." That is why the place was called Gilgal from then on.',
  },
  'Joshua 5:12': {
    all: 'The manna stopped the day after they ate food from the land. The people of Israel no longer had manna, but that year they ate what grew in the land of Canaan.',
  },
  'Joshua 5:13': {
    all: 'When Joshua was near Jericho, he looked up and saw a man standing in front of him with a drawn sword in his hand. Joshua went to him and asked, "Are you for us or for our enemies?"',
  },
  'Joshua 5:14': {
    all: 'The man said, "No. I have come as commander of the Lord\'s army." Joshua bowed with his face to the ground and worshiped. He said, "What does my lord say to his servant?"',
  },
  'Joshua 5:15': {
    all: 'The commander of the Lord\'s army said to Joshua, "Take your sandals off your feet, because the place where you are standing is holy." Joshua did so.',
  },
  'Joshua 6:17': {
    all: 'Joshua said, "The city and everything in it must be set apart for the Lord\'s judgment. Only Rahab and everyone with her in her house will live, because she hid the messengers we sent.',
  },
  'Joshua 6:18': {
    all: 'But keep away from the things set apart for judgment. If you take any of them, you will bring trouble on Israel\'s camp.',
  },
  'Joshua 6:20': {
    all: 'So the people shouted, and the priests blew the trumpets. When the people heard the trumpet sound, they gave a great shout. Then the wall fell down flat, and the people went straight into the city and took it.',
  },
  'Joshua 6:22': {
    all: 'Joshua told the two men who had spied out the land, "Go into Rahab\'s house. Bring her out, and bring out everyone who belongs to her, just as you promised her."',
  },
  'Joshua 6:25': {
    all: 'Joshua spared Rahab, her father\'s family, and everyone who belonged to her. She lived among Israel, because she hid the messengers Joshua sent to spy out Jericho.',
  },
  'Joshua 7:1': {
    all: 'But the people of Israel acted unfaithfully with the things set apart for the Lord\'s judgment. Achan, from the tribe of Judah, took some of those things. Then the Lord\'s anger burned against Israel.',
  },
  'Joshua 7:11': {
    all: 'The Lord said, "Israel has sinned. They have broken my covenant that I commanded them. They have taken things set apart for judgment. They have stolen, lied, and hidden those things among their own belongings.',
  },
  'Joshua 7:12': {
    all: 'That is why the people of Israel cannot stand before their enemies. They turn and run because they themselves have come under judgment. I will not be with you anymore unless you remove from among you what was set apart for judgment.',
  },
  'Joshua 7:13': {
    all: 'Get up. Make the people ready before the Lord. Tell them, "Prepare yourselves for tomorrow, because the Lord, the God of Israel, says, \'Something set apart for judgment is hidden among you, Israel. You cannot stand before your enemies until you remove it.\'"',
  },
  'Joshua 7:15': {
    all: 'The person found with the thing set apart for judgment must be burned with fire, along with all he has, because he broke the Lord\'s covenant and did a disgraceful thing in Israel."',
  },
  'Joshua 7:21': {
    all: 'Achan said, "Among the things taken from Jericho, I saw a beautiful robe from Babylon, two hundred silver pieces, and a bar of gold weighing fifty silver pieces. I wanted them, so I took them. They are hidden in the ground inside my tent, with the silver underneath."',
  },
  'Joshua 8:2': {
    all: 'The Lord said, "Do to Ai and its king as you did to Jericho and its king. But this time you may keep the animals and goods for yourselves. Set hidden soldiers behind the city."',
  },
  'Joshua 8:4': {
    all: 'Joshua commanded them, "Hide behind the city and wait there. Do not go very far from the city. All of you must be ready.',
  },
  'Joshua 8:14': {
    all: 'When the king of Ai saw Israel, he and all the men of the city hurried out early in the morning to fight. They went to the meeting place near the Arabah, but he did not know hidden soldiers were waiting behind the city.',
  },
  'Joshua 8:20': {
    all: 'When the men of Ai looked back, they saw smoke rising from their city into the sky. They had no way to run this way or that, and the Israelites who had fled toward the wilderness turned back against them.',
  },
  'Joshua 8:31': {
    all: 'He built it just as Moses, the servant of the Lord, had commanded the people of Israel and as it was written in the Book of the Law of Moses: an altar of uncut stones that no iron tool had shaped. On it they offered burned offerings to the Lord and peace offerings.',
  },
  'Joshua 8:35': {
    all: 'Joshua read every word Moses had commanded before the whole group of Israel, including the women, the little ones, and the foreigners living among them.',
  },
  'Joshua 9:12': {
    all: 'The Gibeonites said, "Look at our bread. It was warm when we packed it from our houses on the day we left to come to you, but now it is dry and moldy.',
  },
  'Joshua 9:13': {
    all: 'These wineskins were new when we filled them, but now they are cracked and torn. Our clothes and sandals are worn out because the journey has been so long."',
  },
  'Joshua 9:20': {
    all: 'They said, "This is what we will do: we will let them live, so anger will not come on us because of the oath we swore to them."',
  },
  'Joshua 9:24': {
    all: 'They answered Joshua, "Your servants were clearly told that the Lord your God commanded Moses his servant to give you all this land and to destroy all its people before you. We were very afraid for our lives, so we did this.',
  },
  'Joshua 9:25': {
    all: 'Now we are in your hand. Do to us what seems good and right to you."',
  },
  'Joshua 10:20': {
    all: 'Joshua and the people of Israel struck them with a great defeat. Some survivors ran into strong cities with walls.',
  },
  'Joshua 10:27': {
    all: 'At sunset, Joshua commanded the men to take the kings down from the trees. They threw them into the cave where they had hidden and placed large stones over the cave\'s opening. The stones remained there for a long time.',
  },
  'Joshua 10:40': {
    all: 'So Joshua struck the whole land: the hill country, the Negev, the lowland, and the slopes. He struck all their kings and left no one alive, just as the Lord, the God of Israel, had commanded.',
  },
  'Joshua 11:15': {
    all: 'Joshua did everything the Lord had commanded Moses. Moses had commanded Joshua, and Joshua left nothing undone.',
  },
  'Joshua 12:2': {
    all: 'Sihon king of the Amorites lived in Heshbon. He ruled from Aroer on the edge of the Arnon Valley, across the middle of the valley, and over half of Gilead as far as the Jabbok River, the land edge of the Ammonites.',
  },
  'Joshua 12:9': {
    all: 'the king of Jericho, one; the king of Ai near Bethel, one;',
  },
  'Joshua 14:1': {
    all: 'These are the land shares the people of Israel received in Canaan. Eleazar the priest, Joshua son of Nun, and the heads of the family houses of Israel divided them.',
  },
  'Joshua 14:6': {
    all: 'Then the people of Judah came to Joshua at Gilgal. Caleb son of Jephunneh the Kenizzite said to him, "You know what the Lord told Moses, the man of God, about you and me at Kadesh Barnea.',
  },
  'Joshua 14:10': {
    all: 'Now look: the Lord has kept me alive, just as he said. Forty-five years have passed since the Lord spoke this word to Moses, while Israel walked in the wilderness. Today I am eighty-five years old.',
  },
  'Joshua 20:3': {
    all: 'These cities will be safe places for someone who kills another person by accident, without meaning to. He may run there and be protected from the family protector seeking justice.',
  },
  'Joshua 20:4': {
    all: 'When he runs to one of those cities, he must stand at the city gate and explain what happened to the elders. Then they must bring him into the city, give him a place, and let him live among them.',
  },
  'Joshua 20:5': {
    all: 'If the family protector seeking justice chases him, the people of the city must not hand him over, because he killed the other person by accident and had not hated him before.',
  },
  'Joshua 20:6': {
    all: 'He must stay in that city until he stands before the community for a fair hearing, and until the high priest serving at that time dies. After that, he may return to his own city and his own house, to the city he ran from."',
  },
  'Joshua 21:45': {
    all: 'Not one good thing failed from all the good words the Lord had spoken to the house of Israel. Every word came to pass.',
  },
  'Joshua 22:4': {
    all: 'Now the Lord your God has given your brothers rest, just as he promised them. So return to your tents and to the land Moses, the servant of the Lord, gave you east of the Jordan River.',
  },
  'Joshua 22:5': {
    all: 'Only be very careful to obey the command and the law Moses, the servant of the Lord, gave you: love the Lord your God, walk in all his ways, keep his commands, hold fast to him, and serve him with all your heart and all your soul.',
  },
  'Joshua 22:8': {
    all: 'He said, "Return to your tents with much wealth, many animals, silver, gold, bronze, iron, and many clothes. Share the goods taken from your enemies with your brothers."',
  },
  'Joshua 22:9': {
    all: 'So the people of Reuben, the people of Gad, and the half-tribe of Manasseh left the people of Israel at Shiloh in Canaan. They went back to Gilead, the land they owned, as the Lord had commanded through Moses.',
  },
  'Joshua 22:16': {
    all: 'They said, "The whole community of the Lord asks this: What is this unfaithful thing you have done against the God of Israel? Why have you turned away from following the Lord by building an altar for yourselves and rebelling against him today?',
  },
  'Joshua 22:17': {
    all: 'Was the sin at Peor not enough for us? Even now we are not fully clean from it, and a terrible sickness came on the Lord\'s community.',
  },
  'Joshua 22:18': {
    all: 'Are you turning away from following the Lord today? If you rebel against the Lord today, tomorrow he may be angry with the whole community of Israel.',
  },
  'Joshua 22:20': {
    all: 'Did not Achan son of Zerah act unfaithfully with the thing set apart for judgment? Anger fell on the whole community of Israel, and that man did not die alone because of his sin."',
  },
  'Joshua 22:27': {
    all: 'It is a witness between us and you, and between our children after us, that we may serve the Lord before him with our burned offerings, sacrifices, and peace offerings. Then your children will not be able to say to our children, "You have no share in the Lord."',
  },
  'Joshua 22:28': {
    all: 'We said, "If they say that to us or to our children in days to come, we will answer, \'Look at this copy of the Lord\'s altar. Our ancestors made it, not for burned offerings or sacrifices, but to be a witness between us and you.\'"',
  },
  'Joshua 22:30': {
    all: 'When Phinehas the priest, the leaders of the community, and the heads of Israel heard what the people of Reuben, Gad, and Manasseh said, they were pleased.',
  },
  'Joshua 22:31': {
    all: 'Phinehas son of Eleazar the priest said to them, "Today we know the Lord is among us, because you have not been unfaithful to the Lord. You have kept the people of Israel from the Lord\'s judgment."',
  },
  'Joshua 22:32': {
    all: 'Then Phinehas son of Eleazar the priest and the leaders returned from the people of Reuben and Gad in Gilead back to the land of Canaan. They brought the answer to the people of Israel.',
  },
  'Joshua 22:33': {
    all: 'The answer pleased the people of Israel. They blessed God and spoke no more about going to war against Reuben and Gad to destroy the land where they lived.',
  },
  'Joshua 23:14': {
    all: 'Joshua said, "Now I am going the way of all the earth. You know with all your heart and all your soul that not one good thing has failed from everything the Lord your God promised you. Every word has come to pass. Not one word has failed.',
  },
  'Joshua 23:15': {
    all: 'But just as every good word the Lord your God promised has come to pass for you, the Lord can also bring every warning on you until he removes you from this good land he has given you.',
  },
  'Joshua 24:12': {
    all: 'I sent the hornet ahead of you, and it drove them out before you, including the two Amorite kings. It was not your sword or your bow that did it.',
  },
  'Joshua 24:14': {
    all: 'Now fear the Lord and serve him with honest and faithful hearts. Put away the false gods your ancestors served beyond the River and in Egypt, and serve the Lord.',
  },
  'Joshua 24:15': {
    all: 'If serving the Lord seems wrong to you, choose today whom you will serve: the gods your ancestors served beyond the River, or the gods of the Amorites in whose land you live. But as for me and my house, we will serve the Lord.',
  },
  'Joshua 24:17': {
    all: 'The people said, "The Lord our God brought us and our ancestors up out of Egypt, out of the land where we were slaves. He did great signs before our eyes and kept us safe all along the way, through all the peoples we passed among.',
  },
  'Joshua 24:23': {
    all: 'Joshua said, "Then put away the foreign gods among you, and turn your hearts to the Lord, the God of Israel."',
  },
  'Joshua 24:29': {
    all: 'After these things, Joshua son of Nun, the servant of the Lord, died at one hundred ten years old.',
  },
  'Joshua 24:30': {
    all: 'They buried him in his land share at Timnath Serah, in the hill country of Ephraim, north of Mount Gaash.',
  },
  'Joshua 24:32': {
    all: 'The people of Israel buried Joseph\'s bones at Shechem, in the piece of ground Jacob had bought from the sons of Hamor, Shechem\'s father, for a hundred silver pieces. That land became part of the share for Joseph\'s descendants.',
  },
  'Joshua 24:33': {
    all: 'Eleazar son of Aaron died too. They buried him at Gibeah, the hill of his son Phinehas, in the hill country of Ephraim.',
  },
};

Object.assign(STORY_REVISIONS, {
  'Joshua 3:1': {
    all: 'Early in the morning, Joshua and all the people of Israel left Shittim and came to the Jordan River. They camped there before crossing over.',
  },
  'Joshua 3:2': {
    all: 'After three days, the officers went through the camp.',
  },
  'Joshua 3:3': {
    all: 'They commanded the people, "When you see the Lord\'s covenant chest and the Levitical priests carrying it, leave your place and follow it.',
  },
  'Joshua 3:4': {
    all: 'Keep a wide space between you and the covenant chest. Do not come close to it. Then you will know the way to go, because you have never gone this way before."',
  },
  'Joshua 3:5': {
    all: 'Joshua said to the people, "Prepare yourselves before the Lord, because tomorrow the Lord will do wonders among you."',
  },
  'Joshua 3:6': {
    all: 'Joshua told the priests, "Pick up the covenant chest and cross over ahead of the people." So they picked up the covenant chest and went before the people.',
  },
  'Joshua 3:7': {
    all: 'The Lord said to Joshua, "Today I will begin to make you great in the sight of all Israel. They will know that I will be with you just as I was with Moses.',
  },
  'Joshua 3:8': {
    all: 'Command the priests who carry the covenant chest, \'When you reach the edge of the Jordan River, stand still in the river.\'"',
  },
  'Joshua 3:10': {
    all: 'Joshua said, "By this you will know that the living God is among you. He will surely drive out the Canaanites, Hittites, Hivites, Perizzites, Girgashites, Amorites, and Jebusites before you.',
  },
  'Joshua 3:11': {
    all: 'Look, the covenant chest of the Lord of all the earth is crossing the Jordan River ahead of you.',
  },
  'Joshua 3:12': {
    all: 'Now choose twelve men from the tribes of Israel, one man from each tribe.',
  },
  'Joshua 3:14': {
    all: 'The people left their tents to cross the Jordan River, and the priests carrying the covenant chest went ahead of them.',
  },
  'Joshua 4:1': {
    all: 'When the whole nation had finished crossing the Jordan River, the Lord spoke to Joshua.',
  },
  'Joshua 4:2': {
    all: 'The Lord said, "Choose twelve men from the people, one man from each tribe.',
  },
  'Joshua 4:3': {
    all: 'Tell them to take twelve stones from the middle of the Jordan River, from the place where the priests\' feet stood firm. Carry the stones with you and set them down where you camp tonight."',
  },
  'Joshua 4:4': {
    all: 'So Joshua called the twelve men he had chosen from the people of Israel, one man from each tribe.',
  },
  'Joshua 4:5': {
    all: 'Joshua said to them, "Go into the middle of the Jordan River before the Lord\'s covenant chest. Each of you must lift one stone onto his shoulder, one stone for each tribe of Israel.',
  },
  'Joshua 4:8': {
    all: 'The people of Israel did as Joshua commanded. They took twelve stones from the middle of the Jordan River, just as the Lord told Joshua, one for each tribe of Israel. They carried the stones to the place where they camped and set them down there.',
  },
  'Joshua 4:9': {
    all: 'Joshua also set up twelve stones in the middle of the Jordan River, at the place where the priests carrying the covenant chest had stood. The stones remained there for a long time.',
  },
  'Joshua 4:12': {
    all: 'The people of Reuben, Gad, and the half-tribe of Manasseh crossed over armed in front of the people of Israel, just as Moses had told them.',
  },
  'Joshua 4:13': {
    all: 'About forty thousand armed men crossed before the Lord, ready for battle on the plains of Jericho.',
  },
  'Joshua 4:14': {
    all: 'That day the Lord made Joshua great in the sight of all Israel. The people honored Joshua as they had honored Moses all the days of his life.',
  },
  'Joshua 4:15': {
    all: 'Then the Lord spoke to Joshua again.',
  },
  'Joshua 4:16': {
    all: 'He said, "Command the priests carrying the covenant chest to come up out of the Jordan River."',
  },
  'Joshua 4:18': {
    all: 'When the priests carrying the Lord\'s covenant chest came up from the middle of the Jordan River and their feet stepped onto dry ground, the waters of the Jordan River returned to their place and overflowed its banks as before.',
  },
  'Joshua 4:19': {
    all: 'The people came up from the Jordan River on the tenth day of the first month. They camped at Gilgal, east of Jericho.',
  },
  'Joshua 4:20': {
    all: 'At Gilgal, Joshua set up the twelve stones they had taken from the Jordan River.',
  },
  'Joshua 4:21': {
    all: 'He said to the people of Israel, "In days to come, when your children ask their fathers, \'What do these stones mean?\'',
  },
  'Joshua 4:22': {
    all: 'tell your children, \'Israel crossed this Jordan River on dry ground.\'',
  },
  'Joshua 6:2': {
    all: 'The Lord said to Joshua, "See, I have given Jericho into your hand, along with its king and its brave fighting men.',
  },
  'Joshua 6:3': {
    all: 'All your soldiers must march around the city one time each day. Do this for six days.',
  },
  'Joshua 6:4': {
    all: 'Seven priests must carry seven trumpets made from ram horns in front of the covenant chest. On the seventh day, march around the city seven times, and let the priests blow the trumpets.',
  },
  'Joshua 6:5': {
    all: 'When they blow one long blast on the ram horn and you hear the trumpet sound, all the people must shout with a great shout. Then the city wall will fall down flat, and the people will go straight in."',
  },
  'Joshua 6:6': {
    all: 'Joshua son of Nun called the priests and said, "Pick up the covenant chest, and let seven priests carry seven trumpets made from ram horns in front of the Lord\'s covenant chest."',
  },
  'Joshua 6:7': {
    all: 'Then Joshua said to the people, "Move forward. March around the city, and let the armed men go in front of the Lord\'s covenant chest."',
  },
  'Joshua 6:8': {
    all: 'After Joshua spoke to the people, the seven priests carrying the seven trumpets made from ram horns went forward before the Lord and blew the trumpets. The Lord\'s covenant chest followed them.',
  },
  'Joshua 6:10': {
    all: 'Joshua commanded the people, "Do not shout. Do not let your voices be heard. Do not let one word come out of your mouth until the day I tell you to shout. Then you must shout."',
  },
  'Joshua 6:11': {
    all: 'So the Lord\'s covenant chest was carried around the city one time. Then the people went back to the camp and stayed there.',
  },
  'Joshua 6:12': {
    all: 'Early the next morning, Joshua got up, and the priests picked up the Lord\'s covenant chest.',
  },
  'Joshua 6:13': {
    all: 'The seven priests carrying the seven trumpets made from ram horns went in front of the Lord\'s covenant chest and kept blowing the trumpets. Armed men walked ahead of them, and the rear guard followed behind the covenant chest as the trumpets sounded.',
  },
  'Joshua 6:15': {
    all: 'On the seventh day, they got up at dawn and marched around the city the same way seven times. That was the only day they marched around the city seven times.',
  },
  'Joshua 6:16': {
    all: 'The seventh time around, when the priests blew the trumpets, Joshua said to the people, "Shout, because the Lord has given you the city!"',
  },
  'Joshua 6:17': {
    all: 'Joshua said, "The city, and everything inside it, is set apart for the Lord\'s judgment. Only Rahab and everyone with her in her house will live, because she hid the messengers we sent.',
  },
  'Joshua 6:21': {
    all: 'They completely destroyed all that was in the city: men and women, young and old, oxen, sheep, and donkeys. Judgment came with the sword.',
  },
  'Joshua 6:23': {
    all: 'The young spies went in and brought out Rahab, her father, her mother, her brothers, and everyone who belonged to her. They brought out all her relatives and placed them outside Israel\'s camp.',
  },
  'Joshua 6:24': {
    all: 'Then Israel burned the city and everything in it. Only the silver, gold, bronze containers, and iron containers were put into the treasury of the Lord\'s house.',
  },
  'Joshua 6:26': {
    all: 'At that time Joshua made a serious oath before the Lord: "The man who rises up and rebuilds Jericho will face great loss. When he lays its foundation, he will lose his firstborn son. When he sets up its gates, he will lose his youngest son."',
  },
  'Joshua 6:27': {
    all: 'The Lord was with Joshua, and people throughout the land heard about him.',
  },
  'Joshua 7:2': {
    all: 'Joshua sent men from Jericho to Ai, near Beth Aven on the east side of Bethel. He told them, "Go up and spy out the land." So the men went up and looked over Ai.',
  },
  'Joshua 7:3': {
    all: 'They came back to Joshua and said, "Do not send all the people. Send only about two or three thousand men to strike Ai, because there are only a few people there."',
  },
  'Joshua 7:4': {
    all: 'So about three thousand men went up, but they ran away from the men of Ai.',
  },
  'Joshua 7:5': {
    all: 'The men of Ai struck down about thirty-six of them. They chased Israel from the city gate as far as Shebarim and struck them on the slope. The people\'s hearts melted and became like water.',
  },
  'Joshua 7:6': {
    all: 'Joshua tore his clothes and fell facedown before the Lord\'s covenant chest until evening. The elders of Israel were with him, and they put dust on their heads.',
  },
  'Joshua 7:7': {
    all: 'Joshua said, "Oh no, Lord God! Why did you bring this people across the Jordan River? Was it to hand us over to the Amorites so we would die? We would rather have stayed on the other side of the Jordan River!',
  },
  'Joshua 7:8': {
    all: 'Lord, what can I say now that Israel has turned its back and run from its enemies?',
  },
  'Joshua 7:9': {
    all: 'The Canaanites and all the people living in the land will hear about it. They will surround us and wipe our name from the earth. What will you do for your great name?"',
  },
  'Joshua 7:10': {
    all: 'The Lord said to Joshua, "Get up. Why are you lying facedown?',
  },
  'Joshua 7:14': {
    all: 'In the morning, Israel must come near tribe by tribe. The tribe the Lord points out must come near family by family. The family the Lord points out must come near household by household. The household the Lord points out must come near man by man.',
  },
  'Joshua 7:16': {
    all: 'Early the next morning, Joshua brought Israel near by tribes, and the tribe of Judah was pointed out.',
  },
  'Joshua 7:17': {
    all: 'Then he brought Judah\'s families near, and the family of the Zerahites was pointed out. He brought the Zerahites near man by man, and Zabdi was pointed out.',
  },
  'Joshua 7:18': {
    all: 'Then Joshua brought Zabdi\'s household near man by man, and Achan was pointed out. Achan was the son of Carmi, son of Zabdi, son of Zerah, from the tribe of Judah.',
  },
  'Joshua 7:20': {
    all: 'Achan answered Joshua, "It is true. I have sinned against the Lord, the God of Israel. This is what I did.',
  },
  'Joshua 7:22': {
    all: 'So Joshua sent messengers, and they ran to Achan\'s tent. The robe, silver, and gold were hidden in the tent, with the silver underneath.',
  },
  'Joshua 7:23': {
    all: 'They took the things from the tent and brought them to Joshua and all the people of Israel. Then they laid them out before the Lord.',
  },
  'Joshua 7:24': {
    all: 'Joshua and all Israel took Achan son of Zerah, along with the silver, the robe, the gold bar, his sons, his daughters, his animals, his tent, and everything he had. They brought them up to the Valley of Achor.',
  },
  'Joshua 7:25': {
    all: 'Joshua said, "Why have you brought trouble on us? The Lord will bring trouble on you today." Then all Israel stoned Achan. They burned what belonged to him and covered the place with stones.',
  },
  'Joshua 7:26': {
    all: 'They raised a large heap of stones over him, and it remained there for a long time. Then the Lord turned away from his fierce anger. That is why the place is called the Valley of Achor.',
  },
  'Joshua 8:1': {
    all: 'The Lord said to Joshua, "Do not be afraid or discouraged. Take all the warriors with you and go up to Ai. See, I have given the king of Ai, his people, his city, and his land into your hand.',
  },
  'Joshua 8:3': {
    all: 'So Joshua and all the warriors got ready to go up to Ai. Joshua chose thirty thousand brave fighting men and sent them out at night.',
  },
  'Joshua 8:5': {
    all: 'I and the people with me will go near the city. When the men of Ai come out against us as they did before, we will run away from them.',
  },
  'Joshua 8:6': {
    all: 'They will chase us until we draw them away from the city, because they will say, "They are running from us like before." So we will run from them.',
  },
  'Joshua 8:7': {
    all: 'Then you must rise up from your hiding place and take the city, because the Lord your God will give it into your hand.',
  },
  'Joshua 8:8': {
    all: 'When you have taken the city, set it on fire. Do this according to the Lord\'s word. See, I have commanded you."',
  },
  'Joshua 8:9': {
    all: 'Joshua sent them out, and they hid between Bethel and Ai, west of Ai. Joshua stayed among the people that night.',
  },
  'Joshua 8:10': {
    all: 'Early in the morning, Joshua got up, called the people together, and went up to Ai with the elders of Israel in front of the people.',
  },
  'Joshua 8:11': {
    all: 'All the soldiers with him went up near the city and camped north of Ai. A valley lay between them and the city.',
  },
  'Joshua 8:12': {
    all: 'Joshua took about five thousand men and hid them between Bethel and Ai, west of the city.',
  },
  'Joshua 8:13': {
    all: 'The main army camped north of the city, and the hidden soldiers waited west of the city. That night Joshua went down into the valley.',
  },
  'Joshua 8:15': {
    all: 'Joshua and all Israel acted as if they had been beaten, and they ran away toward the wilderness.',
  },
  'Joshua 8:16': {
    all: 'All the men in Ai were called out to chase them. They chased Joshua and were drawn away from the city.',
  },
  'Joshua 8:17': {
    all: 'No man was left in Ai or Bethel who did not go out after Israel. They left the city open and chased Israel.',
  },
  'Joshua 8:18': {
    all: 'Then the Lord said to Joshua, "Stretch the short spear in your hand toward Ai, because I will give the city into your hand." Joshua stretched the short spear toward the city.',
  },
  'Joshua 8:19': {
    all: 'As soon as Joshua stretched out his hand, the hidden soldiers quickly rose from their place, ran into the city, took it, and hurried to set it on fire.',
  },
  'Joshua 8:21': {
    all: 'When Joshua and all Israel saw that the hidden soldiers had taken the city and that smoke was rising, they turned back and struck the men of Ai.',
  },
  'Joshua 8:22': {
    all: 'The hidden soldiers came out of the city against them too. The men of Ai were caught in the middle, with Israelites on both sides. Israel struck them, and none remained or escaped.',
  },
  'Joshua 8:24': {
    all: 'Israel finished striking all the people of Ai who had chased them into the field and wilderness. Then all Israel returned to Ai and struck the city.',
  },
  'Joshua 8:25': {
    all: 'All who fell that day, men and women together, were twelve thousand, all the people of Ai.',
  },
  'Joshua 8:26': {
    all: 'Joshua kept his hand stretched out with the short spear until all the people living in Ai had been completely destroyed.',
  },
  'Joshua 8:28': {
    all: 'Joshua burned Ai and made it a heap of ruins. It remained that way for a long time.',
  },
  'Joshua 8:29': {
    all: 'He hung the king of Ai on a tree until evening. At sunset, Joshua commanded them to take the body down from the tree. They threw it at the entrance of the city gate and raised a large heap of stones over it. The stones remained there for a long time.',
  },
  'Joshua 8:32': {
    all: 'There, in the presence of the people of Israel, Joshua wrote on the stones a copy of the law Moses had written.',
  },
  'Joshua 8:33': {
    all: 'All Israel stood on both sides of the covenant chest before the Levitical priests who carried the Lord\'s covenant chest. Foreigners and Israelites stood there together. Half stood in front of Mount Gerizim, and half stood in front of Mount Ebal, just as Moses had first commanded when Israel was to be blessed.',
  },
  'Joshua 8:34': {
    all: 'Afterward Joshua read all the words of the law, the blessings and the curses, exactly as they were written in the Book of the Law.',
  },
  'Joshua 9:1': {
    all: 'Kings west of the Jordan River heard what had happened. They lived in the hill country, the lowland, and along the shore of the Great Sea toward Lebanon. They were Hittites, Amorites, Canaanites, Perizzites, Hivites, and Jebusites.',
  },
  'Joshua 9:2': {
    all: 'Those kings gathered together with one purpose: to fight Joshua and Israel.',
  },
  'Joshua 9:3': {
    all: 'But the people of Gibeon heard what Joshua had done to Jericho and Ai.',
  },
  'Joshua 9:4': {
    all: 'So they made a tricky plan. They pretended to be messengers from far away. They loaded old sacks on their donkeys and took old wineskins that were cracked and patched.',
  },
  'Joshua 9:5': {
    all: 'They wore old patched sandals and old clothes. All the bread in their food bags was dry and moldy.',
  },
  'Joshua 9:6': {
    all: 'They came to Joshua at the camp in Gilgal and said to him and the men of Israel, "We have come from a faraway country. Now make a covenant with us."',
  },
  'Joshua 9:9': {
    all: 'They said, "Your servants have come from a very far country because we heard the name of the Lord your God. We heard about his fame and everything he did in Egypt.',
  },
  'Joshua 9:11': {
    all: 'Our elders and all the people of our country told us, \'Take food for the journey. Go meet Israel and say, "We are your servants. Now make a covenant with us."\'',
  },
  'Joshua 9:14': {
    all: 'The men of Israel looked at their food supplies, but they did not ask the Lord for counsel.',
  },
  'Joshua 9:15': {
    all: 'Joshua made peace with them and made a covenant to let them live. The leaders of the community swore an oath to them.',
  },
  'Joshua 9:18': {
    all: 'The people of Israel did not strike them, because the leaders of the community had sworn to them by the Lord, the God of Israel. But the whole community complained against the leaders.',
  },
  'Joshua 9:19': {
    all: 'The leaders said to the whole community, "We have sworn to them by the Lord, the God of Israel, so now we must not touch them.',
  },
  'Joshua 9:21': {
    all: 'The leaders said, "Let them live." So the Gibeonites became people who cut wood and carried water for the whole community, just as the leaders said.',
  },
  'Joshua 9:22': {
    all: 'Joshua called the Gibeonites and said, "Why did you trick us by saying, \'We are very far away from you,\' when you actually live among us?',
  },
  'Joshua 9:23': {
    all: 'Now you are under a curse. Some of you will always serve as people who cut wood and carry water for the house of my God."',
  },
  'Joshua 9:26': {
    all: 'So Joshua protected them from the hand of the people of Israel, and Israel did not kill them.',
  },
  'Joshua 9:27': {
    all: 'That day Joshua made them people who cut wood and carried water for the community and for the Lord\'s altar, in the place the Lord would choose.',
  },
  'Joshua 10:26': {
    all: 'Afterward Joshua struck the five kings, put them to death, and hung their bodies on five trees until evening.',
  },
  'Joshua 11:23': {
    all: 'So Joshua took the whole land, just as the Lord had spoken to Moses. Joshua gave it to Israel as a share of land, divided by their tribes. Then the land had rest from war.',
  },
  'Joshua 13:1': {
    all: 'Joshua was now very old. The Lord said to him, "You are very old, and there is still much land to be received.',
  },
  'Joshua 13:6': {
    all: 'I myself will drive out all the people living in the hill country from Lebanon to Misrephoth Maim, including all the Sidonians. Just divide the land for Israel as a share, as I have commanded you.',
  },
  'Joshua 13:7': {
    all: 'Now divide this land as a share for the nine tribes and the half-tribe of Manasseh."',
  },
  'Joshua 14:9': {
    all: 'That day Moses swore, "The land where your feet walked will belong to you and your children forever, because you followed the Lord my God with your whole heart."',
  },
  'Joshua 14:12': {
    all: 'Now give me this hill country that the Lord spoke about that day. You heard then that the Anakim were there, with great cities protected by walls. Perhaps the Lord will be with me, and I will drive them out, just as the Lord said."',
  },
  'Joshua 17:4': {
    all: 'They came to Eleazar the priest, Joshua son of Nun, and the leaders. They said, "The Lord commanded Moses to give us a share of land among our brothers." So Joshua gave them a share among their father\'s brothers, just as the Lord commanded.',
  },
  'Joshua 17:6': {
    all: 'The daughters of Manasseh received a share of land among his sons. The land of Gilead belonged to the rest of Manasseh\'s sons.',
  },
  'Joshua 17:12': {
    all: 'Yet the descendants of Manasseh could not drive out the people living in those cities. The Canaanites stayed in that land.',
  },
  'Joshua 17:14': {
    all: 'The descendants of Joseph said to Joshua, "Why have you given us only one lot and one share of land? We are many people, because the Lord has blessed us so much."',
  },
  'Joshua 17:17': {
    all: 'Joshua said to the house of Joseph, to Ephraim and Manasseh, "You are many people, and you have great strength. You will not have only one lot.',
  },
  'Joshua 17:18': {
    all: 'The hill country will be yours too. It is a forest, but you will clear it, and its farthest edges will belong to you. You will drive out the Canaanites, even though they have iron chariots and are strong."',
  },
  'Joshua 18:3': {
    all: 'Joshua said to the people of Israel, "How long will you wait before going in to receive the land the Lord, the God of your ancestors, has given you?',
  },
  'Joshua 18:7': {
    all: 'The Levites have no land share among you, because serving as priests of the Lord is their share. Gad, Reuben, and the half-tribe of Manasseh have already received their share east of the Jordan River, the land Moses, the servant of the Lord, gave them."',
  },
  'Joshua 19:49': {
    all: 'When they finished dividing the land by its boundaries, the people of Israel gave Joshua son of Nun a share of land among them.',
  },
  'Joshua 19:51': {
    all: 'These were the land shares that Eleazar the priest, Joshua son of Nun, and the heads of the family houses of Israel divided by lot at Shiloh before the Lord, at the entrance of the Tent of Meeting. So they finished dividing the land.',
  },
  'Joshua 20:2': {
    all: 'The Lord said, "Tell the people of Israel, \'Choose the safe cities I spoke about through Moses.',
  },
  'Joshua 21:4': {
    all: 'The first lot came out for the Kohathite families. Aaron\'s descendants, who were Levites, received thirteen cities from Judah, Simeon, and Benjamin.',
  },
  'Joshua 21:5': {
    all: 'The rest of Kohath\'s descendants received ten cities from the families of Ephraim, Dan, and the half-tribe of Manasseh.',
  },
  'Joshua 21:6': {
    all: 'Gershon\'s descendants received thirteen cities from the families of Issachar, Asher, Naphtali, and the half-tribe of Manasseh in Bashan.',
  },
  'Joshua 21:8': {
    all: 'The people of Israel gave these cities and their pasturelands to the Levites by lot, just as the Lord had commanded through Moses.',
  },
  'Joshua 21:41': {
    all: 'Altogether, the Levites received forty-eight cities with their pasturelands among the land of the people of Israel.',
  },
  'Joshua 22:1': {
    all: 'Then Joshua called the Reubenites, the Gadites, and the half-tribe of Manasseh to him.',
  },
  'Joshua 22:2': {
    all: 'He said, "You have done everything Moses, the servant of the Lord, commanded you, and you have listened to everything I commanded you.',
  },
  'Joshua 22:3': {
    all: 'For many days, all the way to this day, you have not left your brothers. You have kept the duty the Lord your God commanded you.',
  },
  'Joshua 22:7': {
    all: 'Moses had given one half of Manasseh a share of land in Bashan. Joshua gave the other half a share with their brothers west of the Jordan River. When Joshua sent them home, he blessed them.',
  },
  'Joshua 22:10': {
    all: 'When they came to the region near the Jordan River in Canaan, the people of Reuben, Gad, and the half-tribe of Manasseh built a large altar by the Jordan River. It was big and easy to see.',
  },
  'Joshua 22:11': {
    all: 'The people of Israel heard, "Look, the people of Reuben, Gad, and the half-tribe of Manasseh have built an altar near the Jordan River, on Israel\'s side of Canaan."',
  },
  'Joshua 22:12': {
    all: 'When the people of Israel heard this, the whole community gathered at Shiloh to go up and fight against them.',
  },
  'Joshua 22:13': {
    all: 'The people of Israel sent Phinehas son of Eleazar the priest to the people of Reuben, Gad, and the half-tribe of Manasseh in Gilead.',
  },
  'Joshua 22:14': {
    all: 'Ten leaders went with him, one leader from each family house of Israel. Each one was a head among the thousands of Israel.',
  },
  'Joshua 22:15': {
    all: 'They came to the people of Reuben, Gad, and the half-tribe of Manasseh in Gilead and spoke with them.',
  },
  'Joshua 22:19': {
    all: 'If your land is unclean, cross over into the Lord\'s land, where the Lord\'s holy tent stands, and receive land among us. But do not rebel against the Lord or against us by building another altar besides the altar of the Lord our God.',
  },
  'Joshua 22:20': {
    all: 'Did not Achan son of Zerah act unfaithfully with the thing set apart for judgment? Anger fell on the whole community of Israel, and that man did not die alone because of his sin."',
  },
  'Joshua 22:21': {
    all: 'Then the people of Reuben, Gad, and the half-tribe of Manasseh answered the heads of Israel.',
  },
  'Joshua 22:22': {
    all: 'They said, "The Mighty One, God, the Lord! The Mighty One, God, the Lord! He knows, and Israel must know too. If we built this altar in rebellion or unfaithfulness against the Lord, do not spare us today.',
  },
  'Joshua 22:23': {
    all: 'If we built this altar to turn away from following the Lord, or to offer burned offerings, grain offerings, or peace offerings on it, may the Lord himself call us to account.',
  },
  'Joshua 22:24': {
    all: 'No, we did it because we were worried. We thought that someday your children might say to our children, "What do you have to do with the Lord, the God of Israel?',
  },
  'Joshua 22:25': {
    all: 'The Lord has made the Jordan River a boundary between us and you, people of Reuben and Gad. You have no share in the Lord." Then your children might make our children stop fearing the Lord.',
  },
  'Joshua 22:26': {
    all: 'So we said, "Let us build an altar for ourselves, not for burned offerings and not for sacrifices.',
  },
  'Joshua 22:27': {
    all: 'This altar is a witness between us and you, and between our children after us, that we may serve the Lord before him with burned offerings, sacrifices, and peace offerings. Then your children will not be able to say to our children, "You have no share in the Lord."',
  },
  'Joshua 22:29': {
    all: 'Far be it from us to rebel against the Lord or turn away from following him today by building an altar for burned offerings, grain offerings, or sacrifices, besides the altar of the Lord our God that stands before his holy tent!"',
  },
  'Joshua 22:34': {
    all: 'The people of Reuben and Gad named the altar "Witness," because they said, "It is a witness between us that the Lord is God."',
  },
  'Joshua 23:1': {
    all: 'After many days, the Lord had given Israel rest from all their enemies around them. Joshua was now very old.',
  },
  'Joshua 23:2': {
    all: 'Joshua called all Israel, including their elders, heads, judges, and officers. He said to them, "I am old and very old.',
  },
  'Joshua 23:4': {
    all: 'Look, I have divided the land for your tribes, including the nations that remain and all the nations I have cut off, from the Jordan River to the Great Sea where the sun goes down.',
  },
  'Joshua 23:6': {
    all: 'Be very courageous. Keep and do everything written in the Book of the Law of Moses. Do not turn away from it to the right or to the left.',
  },
  'Joshua 23:9': {
    all: 'The Lord has driven out great and strong nations before you. No one has been able to stand against you to this day.',
  },
  'Joshua 23:12': {
    all: 'But if you turn back, hold tight to the nations that still remain among you, marry among them, and join yourselves to them,',
  },
  'Joshua 23:13': {
    all: 'Then know for certain that the Lord your God will no longer drive these nations out before you. They will become a trap and a danger to you, like whips on your sides and thorns in your eyes, until you are removed from this good land the Lord your God has given you.',
  },
  'Joshua 23:16': {
    all: 'If you break the covenant of the Lord your God, serve other gods, and bow down to them, the Lord\'s anger will burn against you, and you will quickly be removed from the good land he has given you."',
  },
  'Joshua 24:1': {
    all: 'Joshua gathered all the tribes of Israel at Shechem. He called the elders, heads, judges, and officers of Israel, and they stood before God.',
  },
  'Joshua 24:2': {
    all: 'Joshua said to all the people, "The Lord, the God of Israel, says, \'Long ago your ancestors lived beyond the River. Terah, the father of Abraham and Nahor, lived there, and they served other gods.',
  },
  'Joshua 24:3': {
    all: 'But I took your father Abraham from beyond the River and led him through all the land of Canaan. I gave him many descendants, and I gave him Isaac.',
  },
  'Joshua 24:4': {
    all: 'I gave Jacob and Esau to Isaac. I gave Mount Seir to Esau as his land, but Jacob and his children went down into Egypt.',
  },
  'Joshua 24:5': {
    all: 'Then I sent Moses and Aaron. I struck Egypt with the things I did there, and afterward I brought you out.',
  },
  'Joshua 24:6': {
    all: 'I brought your ancestors out of Egypt, and you came to the sea. The Egyptians chased your ancestors with chariots and horsemen to the Red Sea.',
  },
  'Joshua 24:7': {
    all: 'When your ancestors cried out to the Lord, he put darkness between you and the Egyptians. He brought the sea over the Egyptians and covered them. Your own eyes saw what I did in Egypt. Then you lived in the wilderness for many days.',
  },
  'Joshua 24:8': {
    all: 'I brought you into the land of the Amorites east of the Jordan River. They fought against you, but I gave them into your hand. You received their land, and I destroyed them before you.',
  },
  'Joshua 24:9': {
    all: 'Then Balak son of Zippor, king of Moab, came to fight against Israel. He called Balaam son of Beor to curse you.',
  },
  'Joshua 24:10': {
    all: 'But I would not listen to Balaam. Instead, he blessed you again and again. So I rescued you from Balak\'s hand.',
  },
  'Joshua 24:11': {
    all: 'Then you crossed the Jordan River and came to Jericho. The people of Jericho fought against you, along with the Amorites, Perizzites, Canaanites, Hittites, Girgashites, Hivites, and Jebusites. I gave them into your hand.',
  },
  'Joshua 24:13': {
    all: 'I gave you a land you had not worked for, and cities you had not built. Now you live in them. You eat from vineyards and olive trees you did not plant.',
  },
  'Joshua 24:16': {
    all: 'The people answered, "Far be it from us to leave the Lord and serve other gods.',
  },
  'Joshua 24:18': {
    all: 'The Lord drove out before us all the peoples who lived in the land, including the Amorites. We also will serve the Lord, because he is our God."',
  },
  'Joshua 24:19': {
    all: 'Joshua said to the people, "You cannot serve the Lord lightly. He is a holy God. He is a jealous God. He will not treat rebellion and sin as if they do not matter.',
  },
  'Joshua 24:20': {
    all: 'If you leave the Lord and serve foreign gods, he will turn against you and bring disaster on you, even after he has done good for you."',
  },
  'Joshua 24:25': {
    all: 'So Joshua made a covenant with the people that day at Shechem, and he gave them a rule and command.',
  },
  'Joshua 24:26': {
    all: 'Joshua wrote these words in the Book of the Law of God. Then he took a large stone and set it up under the oak tree near the Lord\'s holy place.',
  },
  'Joshua 24:27': {
    all: 'Joshua said to all the people, "Look, this stone will be a witness against us. It has heard all the words the Lord spoke to us. It will be a witness against you, so you do not deny your God."',
  },
  'Joshua 24:31': {
    all: 'Israel served the Lord all the days of Joshua and all the days of the elders who lived after Joshua, the elders who had known all the work the Lord had done for Israel.',
  },
});

Object.assign(STORY_REVISIONS, {
  'Joshua 8:27': {
    all: 'Israel kept only the livestock and the goods from the city for themselves, just as the Lord had commanded Joshua.',
  },
  'Joshua 22:20': {
    all: 'Was Achan son of Zerah not unfaithful with the thing set apart for judgment? Anger fell on the whole community of Israel, and that man did not die alone because of his sin."',
  },
  'Joshua 22:29': {
    all: 'We would never rebel against the Lord or turn away from following him today by building an altar for burned offerings, grain offerings, or sacrifices, besides the altar of the Lord our God that stands before his holy tent!"',
  },
  'Joshua 23:2': {
    all: 'Joshua called all Israel, including their elders, heads, judges, and officers. He said to them, "I am very old.',
  },
  'Joshua 23:5': {
    all: 'The Lord your God will push those nations out before you and drive them away from your sight. You will receive their land, just as the Lord your God promised you.',
  },
  'Joshua 23:7': {
    all: 'Do not mix yourselves with the nations that remain among you. Do not call on the names of their gods, swear by them, serve them, or bow down to them.',
  },
  'Joshua 23:10': {
    all: 'One man from you can chase a thousand, because the Lord your God fights for you, just as he promised.',
  },
  'Joshua 23:11': {
    all: 'So guard your hearts carefully, and love the Lord your God.',
  },
  'Joshua 23:14': {
    all: 'Joshua said, "Now I am going the way of all the earth. You know with all your heart and all your soul that not one good thing has failed from everything the Lord your God promised you. Every word has come to pass. Not one word has failed.',
  },
  'Joshua 24:16': {
    all: 'The people answered, "We would never leave the Lord and serve other gods.',
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
        body: polishJoshuaText(verse.body, ageRange, verse.reference),
      }));

      ageTexts[ageRange] = verses;
      writeAgeChapter(filePath, chapterNumber, verses);
    }

    updateResourceChapter(chapterNumber, ageTexts);
  }

  console.log(`Reviewed Joshua chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishJoshuaText(text, ageRange, reference) {
  let result = polishKidReadableText(text, ageRange);

  result = result
    .replace(/\bthe Lord's covenant chest of the covenant\b/g, "the Lord's covenant chest")
    .replace(/\bthe covenant chest of the covenant\b/g, 'the covenant chest')
    .replace(/\bthe covenant chest of the Lord\b/g, "the Lord's covenant chest")
    .replace(/\bthe Lord's covenant chest of the Lord\b/g, "the Lord's covenant chest")
    .replace(/\bthe Lord's ark\b/g, "the Lord's covenant chest")
    .replace(/\bthe Lord's Ark\b/g, "the Lord's covenant chest")
    .replace(/\bLord's ark\b/g, "Lord's covenant chest")
    .replace(/\bthe ark\b/g, 'the covenant chest')
    .replace(/\bthe Ark\b/g, 'the covenant chest')
    .replace(/\bJordan River River\b/g, 'Jordan River')
    .replace(/\bthe people of the people of Israel\b/g, 'the people of Israel')
    .replace(/\bchildren of Israel\b/g, 'people of Israel')
    .replace(/\bchildren of (Judah|Simeon|Reuben|Gad|Ephraim|Manasseh|Joseph|Ammon)\b/g, 'descendants of $1')
    .replace(/\bthe land of your possession\b/g, 'the land given to you')
    .replace(/\bland of their possession\b/g, 'land given to them')
    .replace(/\bland of your possession\b/g, 'land given to you')
    .replace(/\byour possession\b/g, 'your land')
    .replace(/\btheir possession\b/g, 'their land')
    .replace(/\bpossessed the land\b/g, 'received the land')
    .replace(/\bpossess the land\b/g, 'receive the land')
    .replace(/\bpossessed\b/g, 'received')
    .replace(/\bpossess\b/g, 'receive')
    .replace(/\bgo in to take\b/g, 'go in and receive')
    .replace(/\bgives you to take\b/g, 'is giving you')
    .replace(/\bobserve to do according to all\b/g, 'carefully do everything')
    .replace(/\bobserve to do\b/g, 'carefully do')
    .replace(/\bword which\b/g, 'word that')
    .replace(/\bcommandment and the law\b/g, 'command and the law')
    .replace(/\btake diligent heed\b/g, 'be very careful')
    .replace(/\btrumpets of male sheep' horns\b/g, 'trumpets made from ram horns')
    .replace(/\bseven trumpets of male sheep' horns\b/g, 'seven trumpets made from ram horns')
    .replace(/\bmale sheep' horns\b/g, 'ram horns')
    .replace(/\bmale sheep's horn\b/g, 'ram horn')
    .replace(/\bbear seven trumpets\b/g, 'carry seven trumpets')
    .replace(/\bbore seven trumpets\b/g, 'carried seven trumpets')
    .replace(/\bbearing the seven trumpets\b/g, 'carrying the seven trumpets')
    .replace(/\bproceed out of your mouth\b/g, 'come out of your mouth')
    .replace(/\bIf when\b/g, 'When')
    .replace(/\bevery man straight in front of him\b/g, 'each person straight ahead')
    .replace(/\bcaused the Lord's covenant chest to go around\b/g, "carried the Lord's covenant chest around")
    .replace(/\bmustered the people\b/g, 'called the people together')
    .replace(/\bjavelin\b/g, 'short spear')
    .replace(/\bsoldiers hiding and waiting\b/g, 'hidden soldiers')
    .replace(/\bin soldiers hiding and waiting\b/g, 'hidden and waiting')
    .replace(/\bset up the hidden soldiers\b/g, 'hide and wait')
    .replace(/\bwith the edge of the sword\b/g, 'with the sword')
    .replace(/\bstruck it with the sword\b/g, 'struck the city')
    .replace(/\bAlas\b/g, 'Oh no')
    .replace(/\bto deliver us into the hand of\b/g, 'to hand us over to')
    .replace(/\bto cause us to perish\b/g, 'so we would die')
    .replace(/\bperish\b/g, 'die')
    .replace(/\bwe had been content and lived\b/g, 'we had stayed')
    .replace(/\bcut off our name from the earth\b/g, 'wipe our name away from the earth')
    .replace(/\bmake confession to him\b/g, 'tell the truth before him')
    .replace(/\bact unfaithfully against\b/g, 'be unfaithful to')
    .replace(/\bact unfaithfully with\b/g, 'be unfaithful with')
    .replace(/\bact unfaithfully\b/g, 'be unfaithful')
    .replace(/\bacted unfaithfully against\b/g, 'was unfaithful to')
    .replace(/\bacted unfaithfully with\b/g, 'was unfaithful with')
    .replace(/\bnot was unfaithful\b/g, 'not been unfaithful')
    .replace(/\bLevitical priests\b/g, "priests from Levi's tribe")
    .replace(/\bFar be it from us to\b/g, 'We would never')
    .replace(/\bFar be it from us that we should\b/g, 'We would never')
    .replace(/\bFar be it\b/g, 'Never')
    .replace(/\bwoman named Rahab, whose life had been sinful named Rahab, whose life had been sinful\b/g, 'Rahab')
    .replace(/\bwoman named Rahab, who had lived in sexual sin named Rahab, who had lived in sexual sin\b/g, 'Rahab')
    .replace(/\bthe woman named Rahab, whose life had been sinful\b/g, 'Rahab')
    .replace(/\bthe woman named Rahab, who had lived in sexual sin\b/g, 'Rahab')
    .replace(/\bRahab named Rahab, whose life had been sinful\b/g, 'Rahab')
    .replace(/\bRahab named Rahab, who had lived in sexual sin\b/g, 'Rahab')
    .replace(/\bshare of land of\b/g, 'share of land for')
    .replace(/\breceive as an inheritance of\b/g, 'receive as an inheritance for')
    .replace(/\breceive as an share\b/g, 'receive as a share')
    .replace(/\bto receive as an inheritance it\b/g, 'to receive it as an inheritance')
    .replace(/\bhidden soldiersment\b/g, 'ambush')
    .replace(/\bsoldiers hiding and waitingment\b/g, 'ambush')
    .replace(/\bset an hidden soldiers\b/g, 'set hidden soldiers')
    .replace(/\bset a hidden soldiers\b/g, 'set hidden soldiers')
    .replace(/\ban hidden soldiers\b/g, 'hidden soldiers')
    .replace(/\bgive the covenant sign of circumcision to again\b/g, 'give the covenant sign of circumcision to')
    .replace(/\bgiven the covenant sign of circumcision again\b/g, 'received the covenant sign of circumcision')
    .replace(/\bmust be given the covenant sign of circumcision\b/g, 'must receive the covenant sign of circumcision')
    .replace(/\bwere given the covenant sign of circumcision\b/g, 'received the covenant sign of circumcision')
    .replace(/\bwill be not clean for worship\b/g, 'will not be clean for worship')
    .replace(/\bthe thing the Lord had set apart for judgment\b/g, 'what the Lord had set apart for judgment')
    .replace(/\bthings the Lord had set apart for judgment\b/g, 'things the Lord had set apart for judgment')
    .replace(/\bmust utterly\b/g, 'must completely')
    .replace(/\butterly\b/g, 'completely')
    .replace(/\bdevoted for destruction\b/g, 'under judgment')
    .replace(/\bdevoted to destruction\b/g, 'set apart for judgment')
    .replace(/\bdevoted it\b/g, 'taken it')
    .replace(/\bdevoted\b/g, 'set apart')
    .replace(/\baccursed\b/g, 'under trouble')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look')
    .replace(/\blest\b/g, 'or else')
    .replace(/\bIt must be, when\b/g, 'When')
    .replace(/\bit must be, when\b/g, 'when')
    .replace(/\bIt must be that\b/g, 'If')
    .replace(/\bit must be that\b/g, 'if')
    .replace(/\bIt must be\b/g, 'Then')
    .replace(/\bit must be\b/g, 'then')
    .replace(/\bpublic adjuration\b/g, 'public command to tell the truth')
    .replace(/\bsanctify yourselves\b/g, 'prepare yourselves before the Lord')
    .replace(/\bSanctify the people\b/g, 'Prepare the people before the Lord')
    .replace(/\bsanctify the people\b/g, 'prepare the people before the Lord')
    .replace(/\bplague\b/g, 'terrible sickness')
    .replace(/\bthe whole group of the Lord\b/g, "the Lord's whole group")
    .replace(/\ball the whole group\b/g, 'the whole group')
    .replace(/\bwith a very great slaughter until they were consumed\b/g, 'with a great defeat')
    .replace(/\bthe remnant which remained of them\b/g, 'the survivors')
    .replace(/\bat the time of the going down of the sun\b/g, 'at sunset')
    .replace(/\bthe house of bondage\b/g, 'the land where they were slaves')
    .replace(/\bin sincerity and in truth\b/g, 'with honest and faithful hearts')
    .replace(/\bin all your souls\b/g, 'with all your soul')
    .replace(/\bin all your hearts\b/g, 'with all your heart')
    .replace(/\bpeoples through the middle of whom we passed\b/g, 'peoples we passed among')
    .replace(/\bpeople who lived there of the land\b/g, 'people living in the land')
    .replace(/\bpeople who lived there\b/g, 'people living there')
    .replace(/\bpeople living there of\b/g, 'people living in')
    .replace(/\bpeople living there\b/g, 'people living there')
    .replace(/\ban share\b/g, 'a share')
    .replace(/\bfor share of land\b/g, 'for a share of land')
    .replace(/\bof that the Lord spoke\b/g, 'that the Lord spoke about')
    .replace(/\bof that I spoke\b/g, 'that I spoke about')
    .replace(/\bthat he wrote\b/g, 'that Moses wrote')
    .replace(/\bNow therefore\b/g, 'Now')
    .replace(/\bnow therefore\b/g, 'now')
    .replace(/\bwell advanced in years\b/g, 'very old')
    .replace(/\badvanced in years\b/g, 'very old')
    .replace(/\bNow Joshua was old and very old\b/g, 'Now Joshua was very old')
    .replace(/\bresorted to a ruse\b/g, 'made a tricky plan')
    .replace(/\bmade as if they had been ambassadors\b/g, 'pretended to be messengers from far away')
    .replace(/\bprovisions\b/g, 'food supplies')
    .replace(/\bprinces\b/g, 'leaders')
    .replace(/\bmurmured against\b/g, 'complained against')
    .replace(/\bwood cutters and drawers of water\b/g, 'people who cut wood and carried water')
    .replace(/\bwood cutters\b/g, 'people who cut wood')
    .replace(/\bdrawers of water\b/g, 'water carriers')
    .replace(/\bfrom the Lord's mouth\b/g, 'from the Lord')
    .replace(/\bmeal offering\b/g, 'grain offering')
    .replace(/\bmeal offerings\b/g, 'grain offerings')
    .replace(/\bthat he should choose\b/g, 'that the Lord would choose')
    .replace(/\bfrom off this good land\b/g, 'from this good land')
    .replace(/\bthe Lord's anger will be kindled\b/g, "the Lord's anger will burn")
    .replace(/\bbow down yourselves\b/g, 'bow down')
    .replace(/\byou must die quickly\b/g, 'you will quickly be removed')
    .replace(/\bportion among\b/g, 'share among')
    .replace(/\bportion in the Lord\b/g, 'share in the Lord')
    .replace(/\bno portion among\b/g, 'no land share among')
    .replace(/\bthe thing pleased\b/g, 'the answer pleased')
    .replace(/\bbrought them word again\b/g, 'brought back the answer')
    .replace(/\bsuburbs\b/g, 'pasturelands')
    .replace(/\bsuburb\b/g, 'pastureland')
    .replace(/\bboundary line line\b/g, 'boundary line')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (ageRange === '5-7') {
    result = result
      .replace(/\bcity of refuge\b/g, 'safe city')
      .replace(/\bcities of refuge\b/g, 'safe cities')
      .replace(/\binheritance\b/g, 'share of land')
      .replace(/\breceive as an share of land\b/g, 'receive as a share of land')
      .replace(/\bmust receive as an share of land\b/g, 'must receive as a share of land')
      .replace(/\bthe Lord's covenant chest\b/g, "the Lord's covenant chest")
      .replace(/\bcovenant sign of circumcision\b/g, 'covenant body sign called circumcision')
      .replace(/\bsexual sin\b/g, 'sin');
  }

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
    .replace(/\bchildren of Israel\b/g, 'people of Israel')
    .replace(/\bchildren of (Judah|Simeon|Reuben|Gad|Ephraim|Manasseh|Joseph|Ammon)\b/g, 'descendants of $1')
    .replace(/\bthe people of the people of Israel\b/g, 'the people of Israel')
    .replace(/\bthe children of (Judah|Simeon|Reuben|Gad|Ephraim|Manasseh|Joseph|Ammon)\b/g, 'the descendants of $1')
    .replace(/\bBehold\b/g, 'Look')
    .replace(/\bbehold\b/g, 'look')
    .replace(/\bthe Lord's ark\b/g, "the Lord's covenant chest")
    .replace(/\bthe Lord's Ark\b/g, "the Lord's covenant chest")
    .replace(/\bLord's ark\b/g, "Lord's covenant chest")
    .replace(/\bthe ark\b/g, 'the covenant chest')
    .replace(/\bthe Ark\b/g, 'the covenant chest')
    .replace(/\btrumpets of male sheep' horns\b/g, 'trumpets made from ram horns')
    .replace(/\bseven trumpets of male sheep' horns\b/g, 'seven trumpets made from ram horns')
    .replace(/\bmale sheep' horns\b/g, 'ram horns')
    .replace(/\bmale sheep's horn\b/g, 'ram horn')
    .replace(/\bbear seven trumpets\b/g, 'carry seven trumpets')
    .replace(/\bbore seven trumpets\b/g, 'carried seven trumpets')
    .replace(/\bbearing the seven trumpets\b/g, 'carrying the seven trumpets')
    .replace(/\bproceed out of your mouth\b/g, 'come out of your mouth')
    .replace(/\bIf when\b/g, 'When')
    .replace(/\bevery man straight in front of him\b/g, 'each person straight ahead')
    .replace(/\bcaused the Lord's covenant chest to go around\b/g, "carried the Lord's covenant chest around")
    .replace(/\bmustered the people\b/g, 'called the people together')
    .replace(/\bjavelin\b/g, 'short spear')
    .replace(/\bsoldiers hiding and waitingment\b/g, 'hidden soldiers')
    .replace(/\bsoldiers hiding and waiting\b/g, 'hidden soldiers')
    .replace(/\bin soldiers hiding and waiting\b/g, 'hidden and waiting')
    .replace(/\bset up the hidden soldiers\b/g, 'hide and wait')
    .replace(/\bwith the edge of the sword\b/g, 'with the sword')
    .replace(/\bstruck it with the sword\b/g, 'struck the city')
    .replace(/\bAlas\b/g, 'Oh no')
    .replace(/\bto deliver us into the hand of\b/g, 'to hand us over to')
    .replace(/\bto cause us to perish\b/g, 'so we would die')
    .replace(/\bperish\b/g, 'die')
    .replace(/\bwe had been content and lived\b/g, 'we had stayed')
    .replace(/\bcut off our name from the earth\b/g, 'wipe our name away from the earth')
    .replace(/\bmake confession to him\b/g, 'tell the truth before him')
    .replace(/\bact unfaithfully against\b/g, 'be unfaithful to')
    .replace(/\bact unfaithfully with\b/g, 'be unfaithful with')
    .replace(/\bact unfaithfully\b/g, 'be unfaithful')
    .replace(/\bacted unfaithfully against\b/g, 'was unfaithful to')
    .replace(/\bacted unfaithfully with\b/g, 'was unfaithful with')
    .replace(/\bnot was unfaithful\b/g, 'not been unfaithful')
    .replace(/\bLevitical priests\b/g, "priests from Levi's tribe")
    .replace(/\bFar be it from us to\b/g, 'We would never')
    .replace(/\bFar be it from us that we should\b/g, 'We would never')
    .replace(/\bFar be it\b/g, 'Never')
    .replace(/\bdevoted for destruction\b/g, 'under judgment')
    .replace(/\bdevoted to destruction\b/g, 'set apart for judgment')
    .replace(/\bdevoted\b/g, 'set apart')
    .replace(/\baccursed\b/g, 'under trouble')
    .replace(/\butterly\b/g, 'completely')
    .replace(/\bsuburbs\b/g, 'pasturelands')
    .replace(/\bsuburb\b/g, 'pastureland')
    .replace(/\bmanslayer\b/g, 'person who killed someone')
    .replace(/\bavenger of blood\b/g, 'family protector seeking justice')
    .replace(/\bgo in to take\b/g, 'go in and receive')
    .replace(/\bgives you to take\b/g, 'is giving you')
    .replace(/\bobserve to do according to all\b/g, 'carefully do everything')
    .replace(/\bobserve to do\b/g, 'carefully do')
    .replace(/\bIt must be, when\b/g, 'When')
    .replace(/\bit must be, when\b/g, 'when')
    .replace(/\bIt must be that\b/g, 'If')
    .replace(/\bit must be that\b/g, 'if')
    .replace(/\bIt must be\b/g, 'Then')
    .replace(/\bit must be\b/g, 'then')
    .replace(/\bthat that\b/g, 'that')
    .replace(/\bthe land that that\b/g, 'the land that')
    .replace(/\bthe word that that\b/g, 'the word that')
    .replace(/\bthings set apart for judgment, or else when you have set apart it\b/g, 'things set apart for judgment. If you take any of them')
    .replace(/\ball the whole group\b/g, 'the whole group')
    .replace(/\bLord's whole group\b/g, "Lord's community")
    .replace(/\bwith all your heart and with all your soul\b/g, 'with all your heart and all your soul')
    .replace(/\bhouse of bondage\b/g, 'land where they were slaves')
    .replace(/\bthe land of your possession\b/g, 'the land given to you')
    .replace(/\bland of their possession\b/g, 'land given to them')
    .replace(/\bland of your possession\b/g, 'land given to you')
    .replace(/\byour possession\b/g, 'your land')
    .replace(/\btheir possession\b/g, 'their land')
    .replace(/\bpossessed the land\b/g, 'received the land')
    .replace(/\bpossess the land\b/g, 'receive the land')
    .replace(/\bpossessed\b/g, 'received')
    .replace(/\bpossess\b/g, 'receive')
    .replace(/\bpeople who lived there of the land\b/g, 'people living in the land')
    .replace(/\bpeople who lived there\b/g, 'people living there')
    .replace(/\bpeople living there of\b/g, 'people living in')
    .replace(/\ban share\b/g, 'a share')
    .replace(/\bfor share of land\b/g, 'for a share of land')
    .replace(/\bof that the Lord spoke\b/g, 'that the Lord spoke about')
    .replace(/\bof that I spoke\b/g, 'that I spoke about')
    .replace(/\bthat he wrote\b/g, 'that Moses wrote')
    .replace(/\bNow therefore\b/g, 'Now')
    .replace(/\bnow therefore\b/g, 'now')
    .replace(/\bwell advanced in years\b/g, 'very old')
    .replace(/\badvanced in years\b/g, 'very old')
    .replace(/\bNow Joshua was old and very old\b/g, 'Now Joshua was very old')
    .replace(/\bresorted to a ruse\b/g, 'made a tricky plan')
    .replace(/\bmade as if they had been ambassadors\b/g, 'pretended to be messengers from far away')
    .replace(/\bprovisions\b/g, 'food supplies')
    .replace(/\bprinces\b/g, 'leaders')
    .replace(/\bmurmured against\b/g, 'complained against')
    .replace(/\bwood cutters and drawers of water\b/g, 'people who cut wood and carried water')
    .replace(/\bwood cutters\b/g, 'people who cut wood')
    .replace(/\bdrawers of water\b/g, 'water carriers')
    .replace(/\bfrom the Lord's mouth\b/g, 'from the Lord')
    .replace(/\bmeal offering\b/g, 'grain offering')
    .replace(/\bmeal offerings\b/g, 'grain offerings')
    .replace(/\bthat he should choose\b/g, 'that the Lord would choose')
    .replace(/\bfrom off this good land\b/g, 'from this good land')
    .replace(/\bthe Lord's anger will be kindled\b/g, "the Lord's anger will burn")
    .replace(/\bbow down yourselves\b/g, 'bow down')
    .replace(/\byou must die quickly\b/g, 'you will quickly be removed')
    .replace(/\bportion among\b/g, 'share among')
    .replace(/\bportion in the Lord\b/g, 'share in the Lord')
    .replace(/\bno portion among\b/g, 'no land share among')
    .replace(/^the Lord\b/g, 'The Lord')
    .replace(/([.!?]\s+)the Lord\b/g, '$1The Lord')
    .replace(/(["'])the Lord\b/g, '$1The Lord')
    .replace(/;\s*and\s+/g, ', and ')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\ba ([aeiou])/gi, 'an $1')
    .replace(/\ban (one|united|useful|year|young)/gi, 'a $1')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (ageRange === '5-7') {
    result = result.replace(/\bwho had lived in sexual sin\b/g, 'whose life had been sinful');
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
    let updated = body.replace(/^(.+?)\s+-\s+(Joshua\s+\d+:\d+)$/gm, (line, text, reference) => {
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
  const verseRegex = /^###\s+(Joshua\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+Joshua\s+\d+:\d+\s*$|(?![\s\S]))/gm;
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
