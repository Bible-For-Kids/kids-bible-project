#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = 'numbers';
const BOOK_NAME = 'Numbers';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 36 }, (_, index) => index + 1);

const BOOK_OVERVIEW =
  'Numbers follows Israel through the wilderness, showing the people counted, tested, corrected, protected, and guided by the Lord.';

const RESOURCE_DATA = {
  1: {
    summary: 'The Lord tells Moses to count the men of Israel who are old enough to serve in the army, tribe by tribe and name by name. The Levites are not counted with the army because God gives them the work of guarding and serving around the holy tent.',
    lessons: [
      ['God knows his people by name', 'The count shows ordered families and real people under God\'s care.'],
      ['God guards worship', 'The Levites are set apart so the Lord\'s holy tent is treated with reverence.'],
    ],
  },
  2: {
    summary: 'The Lord arranges Israel\'s camp around the Tent of Meeting, with each tribe under its banner and in its appointed place. When Israel camps and when Israel travels, the Lord keeps his people ordered around his presence.',
    lessons: [
      ['God gives order to his people', 'The tribes do not arrange themselves however they want; they camp as the Lord commands.'],
      ['God\'s presence is central', 'The holy tent stands at the center of Israel\'s camp.'],
    ],
  },
  3: {
    summary: 'The chapter names Aaron\'s sons and sets apart the Levites to serve the priests and guard the holy tent. The Levites are taken in place of Israel\'s firstborn, and the extra firstborn sons are redeemed with silver.',
    lessons: [
      ['Service belongs to God', 'The Levites receive holy work from the Lord, not from their own choosing.'],
      ['God provides redemption', 'The firstborn sons are counted and redeemed according to God\'s word.'],
    ],
  },
  4: {
    summary: 'The Lord gives the Kohathites, Gershonites, and Merarites their work for carrying the holy tent and its furnishings. Each family group receives a careful task so the holy things are moved with reverence.',
    lessons: [
      ['Holy things are handled carefully', 'The Lord gives exact instructions for the work near his tent.'],
      ['Every servant has a place', 'Different Levite families receive different duties from God.'],
    ],
  },
  5: {
    summary: 'The Lord teaches Israel to keep the camp clean for worship, to confess wrong and pay back what was taken, and to bring hidden marital unfaithfulness before him. God cares about holiness in the camp, truth between neighbors, and faithfulness in marriage.',
    lessons: [
      ['God lives among his people', 'The camp must be kept clean for worship because the Lord is there.'],
      ['God cares about truth', 'Wrongdoing is not hidden from him, and restitution matters.'],
    ],
  },
  6: {
    summary: 'The Lord gives rules for a Nazirite promise, when someone is specially set apart for him for a time. Then the Lord gives Aaron and his sons words of blessing to place his name on Israel.',
    lessons: [
      ['God receives special devotion', 'A Nazirite promise shows a life set apart for the Lord.'],
      ['God blesses his people', 'The priestly blessing asks the Lord to keep, shine on, and give peace to Israel.'],
    ],
  },
  7: {
    summary: 'After the holy tent is set up, the leaders of Israel bring gifts for its service and offerings for the altar. Each tribe is named, each gift is counted, and Moses hears the Lord speaking from above the cover of the ark.',
    lessons: [
      ['God receives worship from every tribe', 'The repeated offerings show all Israel bringing gifts before the Lord.'],
      ['God speaks to guide his people', 'Moses hears the Lord\'s voice at the holy place.'],
    ],
  },
  8: {
    summary: 'Aaron lights the lamps, and the Levites are cleansed and offered before the Lord for service. God says the Levites belong to him in place of Israel\'s firstborn and gives them work at the Tent of Meeting.',
    lessons: [
      ['God gives light for worship', 'The lamps burn where the Lord commands.'],
      ['God prepares his servants', 'The Levites are cleansed before they begin their holy work.'],
    ],
  },
  9: {
    summary: 'Israel keeps the Passover in the wilderness, and the Lord gives a gracious way for those who are unclean or far away to keep it later. The cloud over the holy tent shows when Israel should camp and when Israel should travel.',
    lessons: [
      ['God wants rescue remembered', 'Passover keeps the story of deliverance before Israel.'],
      ['God leads his people', 'The cloud teaches Israel to move and stop at the Lord\'s command.'],
    ],
  },
  10: {
    summary: 'The Lord gives silver trumpets to gather the people, signal travel, sound alarm in war, and mark worship days. Then Israel leaves Sinai in ordered camps, with the ark going before them as Moses prays for the Lord to rise up and be with his people.',
    lessons: [
      ['God guides movement and worship', 'The trumpets help Israel gather, travel, and remember the Lord.'],
      ['God goes before his people', 'The ark leads as Israel begins the next part of the wilderness journey.'],
    ],
  },
  11: {
    summary: 'The people complain, the Lord judges, and Moses cries out under the weight of leading them. God gives the Spirit to seventy elders and sends quail, but he also judges the greedy craving that despised his provision.',
    lessons: [
      ['Complaining against God is serious', 'Israel\'s grumbling is not treated as a small thing.'],
      ['God helps weak servants', 'The Lord shares the burden of leadership by giving elders to help Moses.'],
    ],
  },
  12: {
    summary: 'Miriam and Aaron speak against Moses, but the Lord defends Moses as his faithful servant. Miriam is struck with a serious skin disease, Moses prays for her, and the camp waits until she is restored.',
    lessons: [
      ['God defends his servant', 'Moses does not have to fight for his own honor.'],
      ['God hears humble prayer', 'Moses asks the Lord to heal Miriam after she has sinned.'],
    ],
  },
  13: {
    summary: 'Moses sends twelve men to spy out Canaan, and they return with fruit from the land. Caleb urges courage, but most of the spies frighten the people with a bad report about the strong cities and tall people in the land.',
    lessons: [
      ['God\'s promise must be trusted', 'The land is good because the Lord promised it.'],
      ['Fear can spread quickly', 'The bad report turns the people\'s eyes away from God\'s power.'],
    ],
  },
  14: {
    summary: 'Israel cries out, refuses to enter the land, and wants to turn back to Egypt. Moses intercedes, the Lord pardons yet judges that generation to wander forty years, and the people fail again when they try to go up without the Lord.',
    lessons: [
      ['Unbelief brings sorrow', 'Israel loses the joy of entering the land because they refuse to trust the Lord.'],
      ['God is merciful and just', 'He pardons at Moses\' prayer, yet his judgment still comes to pass.'],
    ],
  },
  15: {
    summary: 'The Lord gives offering laws for the day Israel enters the land, showing that his promise still stands after judgment. He also teaches about sins done by mistake, serious defiance, Sabbath holiness, and tassels that help Israel remember his commands.',
    lessons: [
      ['God keeps his promises', 'Even after rebellion, the Lord still speaks about Israel entering the land.'],
      ['God helps his people remember', 'The tassels point Israel back to the Lord\'s commands.'],
    ],
  },
  16: {
    summary: 'Korah, Dathan, Abiram, and their followers rebel against Moses and Aaron. The Lord judges the rebels, confirms Aaron\'s priestly place, and Aaron stands with incense between the living and the dead as the terrible sickness stops.',
    lessons: [
      ['God appoints holy service', 'No one may seize the priesthood for himself.'],
      ['Intercession matters', 'Aaron stands in the gap as judgment is stopped.'],
    ],
  },
  17: {
    summary: 'The Lord tells each tribe to bring a staff, and Aaron\'s staff buds, blossoms, and produces almonds. This sign confirms that the Lord has chosen Aaron\'s family for priestly service and warns Israel to stop grumbling.',
    lessons: [
      ['God confirms his choice', 'Aaron\'s living staff shows the Lord\'s decision.'],
      ['God warns to protect life', 'The sign calls Israel away from grumbling that brings death.'],
    ],
  },
  18: {
    summary: 'The Lord gives priests and Levites their duties, their boundaries, and their portions from Israel\'s offerings and tithes. Holy service is a gift, but it must be carried with responsibility before the Lord.',
    lessons: [
      ['God provides for his servants', 'Offerings and tithes support the priests and Levites.'],
      ['Holy work carries responsibility', 'Those who serve near the holy tent must follow the Lord\'s command.'],
    ],
  },
  19: {
    summary: 'The Lord gives the law of the red young cow and the cleansing water made from its ashes. Because death makes a person not clean for worship, God provides a way for Israel to be cleansed and come near rightly.',
    lessons: [
      ['Death is serious before God', 'Contact with death affects worship in Israel\'s camp.'],
      ['God provides cleansing', 'The Lord gives a way for the unclean to be restored.'],
    ],
  },
  20: {
    summary: 'Miriam dies, the people quarrel for water, and Moses strikes the rock instead of honoring the Lord as commanded. The Lord still gives water, but Moses and Aaron are told they will not bring the people into the land; later Aaron dies on Mount Hor.',
    lessons: [
      ['God is holy', 'Even Moses must honor the Lord in front of the people.'],
      ['God still provides', 'The Lord gives water to the thirsty people despite their quarrel.'],
    ],
  },
  21: {
    summary: 'Israel faces enemies, complains again, and suffers from fiery serpents. When Moses prays, the Lord provides the bronze serpent for healing, then leads Israel onward and gives victory over Sihon and Og.',
    lessons: [
      ['Sin needs rescue', 'The people cannot heal themselves from the serpents.'],
      ['God gives victory', 'The Lord leads Israel through danger and defeats powerful kings.'],
    ],
  },
  22: {
    summary: 'Balak fears Israel and sends for Balaam to curse them, but God tells Balaam to speak only the word he gives. On the road, the Lord opens the donkey\'s mouth and Balaam\'s eyes, showing that Balaam is under God\'s rule.',
    lessons: [
      ['God rules over curses and blessings', 'Balaam cannot speak against the Lord\'s command.'],
      ['God opens blind eyes', 'The donkey sees the angel before Balaam does.'],
    ],
  },
  23: {
    summary: 'Balak offers sacrifices and waits for Balaam to curse Israel, but the Lord puts blessing in Balaam\'s mouth. Balaam declares that God is not a man who lies and that what God blesses cannot be reversed by Balak.',
    lessons: [
      ['God keeps his word', 'What the Lord has spoken will come to pass.'],
      ['God blesses his people', 'Balak cannot force a curse where God has given blessing.'],
    ],
  },
  24: {
    summary: 'The Spirit of God comes on Balaam, and he blesses Israel again with words about their tents, strength, and future king. Balaam also speaks of a star and scepter coming from Jacob, pointing to a ruler God will raise from Israel.',
    lessons: [
      ['God can use unlikely speakers', 'Even Balaam must speak the Lord\'s blessing.'],
      ['God promises a ruler', 'The star and scepter point to hope from Jacob.'],
    ],
  },
  25: {
    summary: 'Israel sins at Baal Peor through idolatry and sexual unfaithfulness, and the Lord sends judgment. Phinehas acts with zeal for the Lord\'s honor, the terrible sickness stops, and God gives him a covenant of peace.',
    lessons: [
      ['Idolatry destroys faithfulness', 'Israel\'s sin joins false worship with unfaithfulness.'],
      ['God is jealous for his honor', 'Phinehas acts because the Lord\'s holiness matters.'],
    ],
  },
  26: {
    summary: 'After the terrible sickness, the Lord commands a second count of Israel. The new generation is counted for inheritance in the land, and the chapter shows that the first wilderness generation has passed away except Caleb and Joshua.',
    lessons: [
      ['God prepares the next generation', 'The new count looks toward the land God promised.'],
      ['God\'s warning came to pass', 'The unbelieving generation did not enter the land.'],
    ],
  },
  27: {
    summary: 'The daughters of Zelophehad ask for their father\'s inheritance, and the Lord says they are right. Then Moses sees the land from the mountain and asks the Lord to appoint a shepherd for the people, so Joshua is commissioned before Israel.',
    lessons: [
      ['God hears just requests', 'The daughters\' case is answered by the Lord.'],
      ['God provides leadership', 'Joshua is appointed so Israel will not be like sheep without a shepherd.'],
    ],
  },
  28: {
    summary: 'The Lord gives Israel the regular offerings for each day, each Sabbath, each new month, Passover, and the Feast of Weeks. Israel\'s calendar is shaped by worship, remembrance, and offerings brought before the Lord.',
    lessons: [
      ['Worship is steady', 'Daily, weekly, monthly, and yearly offerings keep Israel before the Lord.'],
      ['God orders Israel\'s time', 'The feasts teach the people to remember him together.'],
    ],
  },
  29: {
    summary: 'The Lord gives the offerings for the seventh month, including the day of trumpet sound, the day of atonement, and the feast with many offerings over seven days. The repeated offerings show worship that is costly, ordered, and centered on the Lord.',
    lessons: [
      ['God is worshiped with reverence', 'The offerings are carefully counted and brought as he commands.'],
      ['God gives holy seasons', 'The seventh month gathers Israel for worship, rest, and atonement.'],
    ],
  },
  30: {
    summary: 'Moses teaches Israel about serious promises made before the Lord. The chapter shows that words spoken to God matter, and it gives rules for how fathers or husbands may confirm or forbid vows in their households.',
    lessons: [
      ['Words before God matter', 'A promise to the Lord must not be treated lightly.'],
      ['God gives order in households', 'The vow laws protect responsibility within families.'],
    ],
  },
  31: {
    summary: 'The Lord commands judgment on Midian because of the sin at Peor. Israel fights, Balaam is killed, the people and spoils are purified, and a portion from the battle is given to the Lord.',
    lessons: [
      ['God judges sin that leads people away', 'Midian had drawn Israel into rebellion at Peor.'],
      ['Victory still belongs to the Lord', 'Even the spoils of battle are counted and tribute is given to him.'],
    ],
  },
  32: {
    summary: 'Reuben and Gad ask to settle east of the Jordan because they have many livestock. Moses warns them not to repeat the unbelief of the spies, and they promise to fight with the rest of Israel until the land is subdued.',
    lessons: [
      ['God\'s people must not abandon one another', 'The eastern tribes must help their brothers enter the land.'],
      ['Past unbelief is a warning', 'Moses remembers the rebellion that led to forty years in the wilderness.'],
    ],
  },
  33: {
    summary: 'Moses records Israel\'s journeys from Egypt to the plains of Moab, step by step. The Lord then commands Israel to drive out the inhabitants of Canaan, destroy their idols, and divide the land by lot.',
    lessons: [
      ['God remembers the journey', 'Each stage shows that Israel moved under the Lord\'s care.'],
      ['The land must not keep its idols', 'Israel must not settle in Canaan while clinging to false worship.'],
    ],
  },
  34: {
    summary: 'The Lord names the borders of the land Israel will inherit in Canaan and appoints leaders to help divide it among the tribes. The promised land is not vague; God marks out real places for his people.',
    lessons: [
      ['God gives real promises', 'The borders show that the inheritance is concrete.'],
      ['God appoints trustworthy order', 'Leaders are named to divide the land for the tribes.'],
    ],
  },
  35: {
    summary: 'The Lord gives towns to the Levites and appoints cities of refuge for people who kill someone without meaning to. The chapter protects justice by distinguishing murder from manslaughter and warns Israel not to make the land unclean before the Lord.',
    lessons: [
      ['God cares about justice', 'The cities of refuge protect the innocent while murder is still judged seriously.'],
      ['Life matters before God', 'Shed blood is not treated lightly in the land where the Lord dwells.'],
    ],
  },
  36: {
    summary: 'The leaders of Manasseh ask how the inheritance of Zelophehad\'s daughters can stay with their tribe. The Lord commands the daughters to marry within their father\'s tribe, so each tribe\'s inheritance remains in place.',
    lessons: [
      ['God protects inheritance', 'The land given to each tribe is guarded across generations.'],
      ['God gives wise order', 'The daughters obey the command and the inheritance remains with Manasseh.'],
    ],
  },
};

const STORY_REVISIONS = {
  'Numbers 5:2': {
    '5-7': '"Command the people of Israel to send outside the camp anyone with a serious skin disease, anyone with an unusual flow from the body, and anyone not clean for worship because of a dead body.',
    '8-10': '"Command the people of Israel to send outside the camp anyone with a serious skin disease, anyone with a discharge, and anyone unclean because of a dead body.',
  },
  'Numbers 5:3': {
    '5-7': 'Send both men and women outside the camp, so they do not make the camp not clean for worship, because I live among the people."',
    '8-10': 'Send both men and women outside the camp, so they do not make the camp unclean, because I live among the people."',
  },
  'Numbers 5:7': {
    '5-7': 'then that person must tell the truth about the sin he did. He must pay back the whole amount for the wrong, add one fifth more, and give it to the person he wronged.',
    '8-10': 'then that person must confess the sin he committed. He must pay back the whole amount for the wrong, add one fifth more, and give it to the person he wronged.',
  },
  'Numbers 5:8': {
    '5-7': 'But if the person who was wronged has no close relative to receive the payment back, then the payment belongs to the Lord and must be given to the priest, along with the male sheep used to make atonement for the guilty person.',
    '8-10': 'But if the person who was wronged has no close relative to receive the restitution, then the restitution belongs to the Lord and must be given to the priest, along with the male sheep used to make atonement for the guilty person.',
  },
  'Numbers 5:12': {
    '5-7': '"Speak to the people of Israel and tell them: If a man\'s wife turns away from faithfulness to him,',
    '8-10': '"Speak to the people of Israel and tell them: If a man\'s wife turns away from faithfulness to him,',
  },
  'Numbers 5:13': {
    '5-7': 'and another man acts with her in the way only her husband should, but it is hidden from her husband and kept secret, and there is no witness and she is not caught,',
    '8-10': 'and another man has sexual relations with her, but it is hidden from her husband and kept secret, and there is no witness and she is not caught,',
  },
  'Numbers 5:14': {
    '5-7': 'and a spirit of jealousy comes over her husband, whether she has truly made herself not clean for worship or not,',
    '8-10': 'and a spirit of jealousy comes over her husband, whether she has truly made herself unclean or not,',
  },
  'Numbers 5:15': {
    '5-7': 'then the man must bring his wife to the priest. He must also bring her offering: a small measured amount of barley flour. He must not pour oil on it or put sweet-smelling incense on it, because it is a grain gift for jealousy, a reminder gift that brings sin to mind.',
    '8-10': 'then the man must bring his wife to the priest. He must also bring her offering: a tenth-measure of barley flour. He must not pour oil on it or put sweet-smelling incense on it, because it is a grain offering for jealousy, a reminder offering that brings sin to mind.',
  },
  'Numbers 5:17': {
    '5-7': 'The priest must take holy water in a clay bowl. Then he must take some dust from the floor of the tent and put it into the water.',
    '8-10': 'The priest must take holy water in a clay bowl. Then he must take some dust from the floor of the tent and put it into the water.',
  },
  'Numbers 5:18': {
    '5-7': 'The priest must bring the woman before the Lord, loosen her hair, and put the reminder grain gift in her hands. In his own hand the priest must hold the bitter water connected with the curse.',
    '8-10': 'The priest must bring the woman before the Lord, loosen her hair, and put the reminder grain offering in her hands. In his own hand the priest must hold the bitter water connected with the curse.',
  },
  'Numbers 5:19': {
    '5-7': 'The priest must have her make an oath. He must say to her, "If no man has acted with you in the way only your husband should, and if you have not turned away and made yourself not clean for worship while married to your husband, then this bitter water connected with the curse will not harm you.',
    '8-10': 'The priest must have her make an oath. He must say to her, "If no man has had sexual relations with you, and if you have not turned away and made yourself unclean while married to your husband, then this bitter water connected with the curse will not harm you.',
  },
  'Numbers 5:20': {
    '5-7': 'But if you have turned away while married to your husband, and if another man has acted with you in the way only your husband should,',
    '8-10': 'But if you have turned away while married to your husband, and if another man has had sexual relations with you besides your husband,',
  },
  'Numbers 5:21': {
    '5-7': 'then the priest must put the woman under the oath of the curse and say, "May the Lord make your case a warning among your people if the Lord allows your thigh to waste away and your body to swell.',
    '8-10': 'then the priest must put the woman under the oath of the curse and say, "May the Lord make your case a warning among your people if the Lord allows your thigh to waste away and your body to swell.',
  },
  'Numbers 5:22': {
    '5-7': 'May this water connected with the curse go into your body, make your body swell, and make your thigh waste away." The woman must say, "Amen. Amen."',
    '8-10': 'May this water connected with the curse go into your body, make your body swell, and make your thigh waste away." The woman must say, "Amen. Amen."',
  },
  'Numbers 5:25': {
    '5-7': 'The priest must take the jealousy grain gift from the woman\'s hand, lift the grain gift before the Lord, and bring it to the altar.',
    '8-10': 'The priest must take the jealousy grain offering from the woman\'s hand, lift the grain offering before the Lord, and bring it to the altar.',
  },
  'Numbers 5:26': {
    '5-7': 'The priest must take a handful of the grain gift as the reminder part and burn it on the altar. After that, he must have the woman drink the water.',
    '8-10': 'The priest must take a handful of the grain offering as the reminder part and burn it on the altar. After that, he must have the woman drink the water.',
  },
  'Numbers 5:27': {
    '5-7': 'When he has made her drink the water, if she has made herself not clean for worship and has acted unfaithfully against her husband, the water connected with the curse will become bitter inside her. Her body will swell, her thigh will waste away, and her case will become a warning among her people.',
    '8-10': 'When he has made her drink the water, if she has made herself unclean and has acted unfaithfully against her husband, the water connected with the curse will become bitter inside her. Her body will swell, her thigh will waste away, and her case will become a warning among her people.',
  },
  'Numbers 5:28': {
    '5-7': 'But if the woman has not made herself not clean for worship and is clean, then she will be free and able to have children.',
    '8-10': 'But if the woman has not made herself unclean and is clean, then she will be free and able to have children.',
  },
  'Numbers 5:29': {
    '5-7': '"This is the law about jealousy, when a wife turns away while married to her husband and makes herself not clean for worship,',
    '8-10': '"This is the law about jealousy, when a wife turns away while married to her husband and makes herself unclean,',
  },
  'Numbers 5:31': {
    '5-7': 'The man must be free from guilt, but the woman must carry her guilt if she is guilty.\' "',
    '8-10': 'The man must be free from guilt, but the woman must carry her guilt if she is guilty.\' "',
  },
  'Numbers 6:2': {
    '5-7': '"Speak to the people of Israel and tell them: When a man or woman makes a special Nazirite promise to be set apart for the Lord,',
    '8-10': '"Speak to the people of Israel and tell them: When a man or woman makes a special Nazirite vow to be set apart for the Lord,',
  },
  'Numbers 6:3': {
    '5-7': 'that person must stay away from wine and other drink that can make someone drunk. He must not drink vinegar made from wine or another drink that can make someone drunk, and he must not drink grape juice or eat grapes, fresh or dried.',
    '8-10': 'that person must stay away from wine and other drink that can make someone drunk. He must not drink vinegar made from wine or another drink that can make someone drunk, and he must not drink grape juice or eat grapes, fresh or dried.',
  },
  'Numbers 6:4': {
    '5-7': 'During all the days of his Nazirite promise, he must eat nothing from the grapevine, not even the seeds or skins.',
    '8-10': 'During all the days of his Nazirite vow, he must eat nothing from the grapevine, not even the seeds or skins.',
  },
  'Numbers 6:5': {
    '5-7': 'During all the days of his special promise, no razor must touch his head. Until the days he promised to the Lord are finished, he must be holy and let the hair on his head grow long.',
    '8-10': 'During all the days of his special vow, no razor must touch his head. Until the days he promised to the Lord are finished, he must be holy and let the hair on his head grow long.',
  },
  'Numbers 6:7': {
    '5-7': 'He must not make himself not clean for worship for his father, mother, brother, or sister when they die, because the sign of his Nazirite promise to God is on his head.',
    '8-10': 'He must not make himself unclean for his father, mother, brother, or sister when they die, because the sign of his separation to God is on his head.',
  },
  'Numbers 6:9': {
    '5-7': '"If someone dies very suddenly beside him, his hair, the sign of his Nazirite promise, has been made not clean for worship. He must shave his head on the day he is made clean. On the seventh day, he must shave it.',
    '8-10': '"If someone dies very suddenly beside him and his special separation becomes unclean, he must shave his head on the day he is made clean. On the seventh day, he must shave it.',
  },
  'Numbers 6:11': {
    '5-7': 'The priest must offer one bird as an offering for sin and the other as a burned offering. The priest must make atonement for him because of the dead body, and the man must make his head holy again that same day.',
    '8-10': 'The priest must offer one bird as a sin offering and the other as a burned offering. The priest must make atonement for him because of the dead body, and the man must make his head holy again that same day.',
  },
  'Numbers 6:12': {
    '5-7': 'He must begin again the days of his Nazirite promise to the Lord and bring a year-old male lamb as a guilt offering. The earlier days will not count, because his Nazirite promise was no longer clean for worship.',
    '8-10': 'He must begin again the days of his separation to the Lord and bring a year-old male lamb as a guilt offering. The earlier days will not count, because his separation became unclean.',
  },
  'Numbers 6:14': {
    '5-7': 'He must bring his offering to the Lord: one year-old male lamb with nothing wrong with it as a burned offering, one year-old female lamb with nothing wrong with it as an offering for sin, and one male sheep with nothing wrong with it as a peace offering.',
    '8-10': 'He must bring his offering to the Lord: one year-old male lamb without defect as a burned offering, one year-old female lamb without defect as a sin offering, and one male sheep without defect as a peace offering.',
  },
  'Numbers 6:15': {
    '5-7': 'He must also bring a basket of bread made without yeast: cakes of fine flour mixed with oil, and thin wafers spread with oil, along with their grain gift and drink gifts.',
    '8-10': 'He must also bring a basket of bread made without yeast: cakes of fine flour mixed with oil, and thin wafers spread with oil, along with their grain offering and drink offerings.',
  },
  'Numbers 6:19': {
    '5-7': 'After the Nazirite has shaved the hair of his Nazirite promise, the priest must take the boiled shoulder of the male sheep, one cake without yeast from the basket, and one thin wafer without yeast, and put them in the Nazirite\'s hands.',
    '8-10': 'After the Nazirite has shaved the hair of his separation, the priest must take the boiled shoulder of the male sheep, one cake without yeast from the basket, and one thin wafer without yeast, and put them in the Nazirite\'s hands.',
  },
  'Numbers 6:18': {
    '5-7': 'The Nazirite must shave the hair of his Nazirite promise at the door of the Tent of Meeting. Then he must take the hair shaved from his head and put it on the fire under the peace offering.',
    '8-10': 'The Nazirite must shave the hair of his separation at the door of the Tent of Meeting. Then he must take the hair shaved from his head and put it on the fire under the peace offering.',
  },
  'Numbers 8:7': {
    '5-7': 'You must do this to make them clean for worship: sprinkle cleansing water on them, let them shave their whole bodies with a razor, let them wash their clothes, and let them cleanse themselves.',
    '8-10': 'You must do this to cleanse them: sprinkle cleansing water on them, let them shave their whole bodies with a razor, let them wash their clothes, and let them cleanse themselves.',
  },
  'Numbers 8:4': {
    '5-7': 'The lampstand was made from hammered gold. From its base to its flower shapes, it was hammered work. It was made just as the Lord had shown Moses.',
    '8-10': 'The lampstand was made from hammered gold. From its base to its flower shapes, it was hammered work. It was made according to the pattern the Lord had shown Moses.',
  },
  'Numbers 8:12': {
    '5-7': 'The Levites must lay their hands on the heads of the bulls. Then you must offer one bull as an offering for sin and the other as a burned offering to the Lord, to make atonement for the Levites.',
    '8-10': 'The Levites must lay their hands on the heads of the bulls. Then you must offer one bull as a sin offering and the other as a burned offering to the Lord, to make atonement for the Levites.',
  },
  'Numbers 8:8': {
    '5-7': 'Then they must take a young bull with its grain gift of fine flour mixed with oil. You must take another young bull as an offering for sin.',
    '8-10': 'Then they must take a young bull with its grain offering of fine flour mixed with oil. You must take another young bull as a sin offering.',
  },
  'Numbers 8:11': {
    '5-7': 'Aaron must lift the Levites before the Lord as an offering from the people of Israel, so they may do the Lord\'s service.',
    '8-10': 'Aaron must lift the Levites before the Lord as an offering from the people of Israel, so they may do the Lord\'s service.',
  },
  'Numbers 8:13': {
    '5-7': 'You must place the Levites before Aaron and his sons, and lift them before the Lord as an offering.',
    '8-10': 'You must place the Levites before Aaron and his sons, and lift them before the Lord as an offering.',
  },
  'Numbers 8:15': {
    '5-7': 'After that, the Levites may go in to serve at the Tent of Meeting. You must cleanse them and lift them before the Lord as an offering.',
    '8-10': 'After that, the Levites may go in to serve at the Tent of Meeting. You must cleanse them and lift them before the Lord as an offering.',
  },
  'Numbers 8:19': {
    '5-7': 'I have given the Levites as a gift to Aaron and his sons from among the people of Israel. They will do the people\'s service at the Tent of Meeting and make atonement for Israel, so no terrible sickness will strike the people when they come near the holy place."',
    '8-10': 'I have given the Levites as a gift to Aaron and his sons from among the people of Israel. They will do the people\'s service at the Tent of Meeting and make atonement for Israel, so no plague will strike the people when they come near the holy place."',
  },
  'Numbers 8:21': {
    '5-7': 'The Levites cleansed themselves and washed their clothes. Aaron lifted them before the Lord as an offering, and Aaron made atonement for them to cleanse them.',
    '8-10': 'The Levites cleansed themselves and washed their clothes. Aaron lifted them before the Lord as an offering, and Aaron made atonement for them to cleanse them.',
  },
  'Numbers 8:16': {
    '5-7': 'They are fully given to me from among the people of Israel. I have taken the Levites for myself instead of every firstborn son in Israel.',
    '8-10': 'They are fully given to me from among the people of Israel. I have taken the Levites for myself instead of every firstborn among the people of Israel.',
  },
  'Numbers 8:24': {
    '5-7': '"This is what belongs to the Levites: from twenty-five years old and older, they must come to serve in the work of the Tent of Meeting.',
    '8-10': '"This is what belongs to the Levites: from twenty-five years old and older, they must come to serve in the work of the Tent of Meeting.',
  },
  'Numbers 8:26': {
    '5-7': 'They may help their brothers at the Tent of Meeting and keep the duties, but they must not do the heavy service work. This is how you must have the Levites do their duties."',
    '8-10': 'They may help their brothers at the Tent of Meeting and keep the duties, but they must not do the heavy service work. This is how you must have the Levites do their duties."',
  },
  'Numbers 18:15': {
    '5-7': 'Every firstborn offered to the Lord, whether human or animal, must be yours. But firstborn sons and firstborn animals not clean for worship must be bought back.',
    '8-10': 'Every firstborn offered to the Lord, whether human or animal, must be yours. But firstborn sons and firstborn unclean animals must be redeemed.',
  },
  'Numbers 18:16': {
    '5-7': 'From one month old and older, they must be bought back for five silver pieces, by the weight used at the holy place.',
    '8-10': 'From one month old and older, they must be redeemed for five silver pieces, by the weight used at the holy place.',
  },
  'Numbers 18:18': {
    '5-7': 'Their meat must be yours too. The breast lifted before the Lord and the right thigh must be yours.',
    '8-10': 'Their meat must be yours too. The breast lifted before the Lord and the right thigh must be yours.',
  },
  'Numbers 18:19': {
    '5-7': 'All the lifted offerings from the holy things that the people of Israel offer to the Lord, I have given to you, to your sons, and to your daughters as a lasting portion. It is a lasting covenant before the Lord for you and your offspring, called a covenant of salt."',
    '8-10': 'All the lifted offerings from the holy things that the people of Israel offer to the Lord, I have given to you, to your sons, and to your daughters as a lasting portion. It is a lasting covenant before the Lord for you and your offspring, called a covenant of salt."',
  },
  'Numbers 18:8': {
    '5-7': 'The Lord spoke to Aaron, "I myself have put you in charge of my lifted offerings, all the holy things the people of Israel bring. I have given them to you and to your sons as a lasting portion.',
    '8-10': 'The Lord spoke to Aaron, "I myself have put you in charge of my lifted offerings, all the holy things the people of Israel bring. I have given them to you and to your sons as a lasting portion.',
  },
  'Numbers 18:9': {
    '5-7': 'This part of the most holy gifts from the fire must be yours: every grain gift, every offering for sin, and every offering for guilt that the people bring to me. They must be most holy for you and for your sons.',
    '8-10': 'This part of the most holy gifts from the fire must be yours: every grain offering, every sin offering, and every guilt offering that the people bring to me. They must be most holy for you and for your sons.',
  },
  'Numbers 18:11': {
    '5-7': '"This is yours too: the gifts lifted before the Lord from the people of Israel. I have given them to you, to your sons, and to your daughters as a lasting portion. Everyone in your house who is clean may eat them.',
    '8-10': '"This is yours too: the offerings lifted before the Lord from the people of Israel. I have given them to you, to your sons, and to your daughters as a lasting portion. Everyone in your house who is clean may eat them.',
  },
  'Numbers 18:21': {
    '5-7': '"To the descendants of Levi, I have given Israel\'s tithes, the one-tenth gifts, as their inheritance. This is for the service they do at the Tent of Meeting.',
    '8-10': '"To the descendants of Levi, I have given Israel\'s tithes as their inheritance. This is for the service they do at the Tent of Meeting.',
  },
  'Numbers 18:22': {
    '5-7': 'From now on, the people of Israel must not come near the Tent of Meeting, or they will carry guilt for sin and die.',
    '8-10': 'From now on, the people of Israel must not come near the Tent of Meeting, or they will carry guilt for sin and die.',
  },
  'Numbers 18:23': {
    '5-7': 'The Levites must do the service of the Tent of Meeting, and they must carry the guilt if they do wrong in that service. This will be a lasting rule for all your generations. Among the people of Israel, they must have no inheritance.',
    '8-10': 'The Levites must do the service of the Tent of Meeting, and they must carry the guilt if they do wrong in that service. This will be a lasting rule for all your generations. Among the people of Israel, they must have no inheritance.',
  },
  'Numbers 18:24': {
    '5-7': 'I have given the Levites the tithes, the one-tenth gifts, that the people of Israel lift before the Lord. That is why I said to them, "They must have no land inheritance among the people of Israel." \' "',
    '8-10': 'I have given the Levites the tithes that the people of Israel lift before the Lord. That is why I said to them, "They must have no inheritance among the people of Israel." \' "',
  },
  'Numbers 18:26': {
    '5-7': '"Speak to the Levites and tell them, \'When you receive from the people of Israel the tithe I have given you as your inheritance, you must give a tithe of that tithe back to the Lord as an offering lifted before him.',
    '8-10': '"Speak to the Levites and tell them, \'When you receive from the people of Israel the tithe I have given you as your inheritance, you must give a tithe of that tithe back to the Lord as an offering lifted before him.',
  },
  'Numbers 18:27': {
    '5-7': 'This lifted offering will be counted for you like grain from the place where grain is separated, or like wine from the place where grapes are pressed.',
    '8-10': 'This lifted offering will be counted for you like grain from the threshing floor or like the full amount from the winepress.',
  },
  'Numbers 18:28': {
    '5-7': 'In this way, you also must give the Lord an offering lifted before him from all the tithes you receive from the people of Israel. You must give the Lord\'s lifted offering to Aaron the priest.',
    '8-10': 'In this way, you also must give the Lord an offering lifted before him from all the tithes you receive from the people of Israel. You must give the Lord\'s lifted offering to Aaron the priest.',
  },
  'Numbers 18:30': {
    '5-7': '"Tell them, \'When you lift the best part before the Lord, it will be counted for the Levites like grain from the place where grain is separated and like wine from the place where grapes are pressed.',
    '8-10': '"Tell them, \'When you lift the best part before the Lord, it will be counted for the Levites like grain from the threshing floor and like wine from the winepress.',
  },
  'Numbers 10:9': {
    '5-7': 'When you go to war in your land against an enemy who presses hard against you, sound the alarm with the trumpets. Then the Lord your God will remember you and save you from your enemies.',
    '8-10': 'When you go to war in your land against an enemy who oppresses you, sound the alarm with the trumpets. Then the Lord your God will remember you and save you from your enemies.',
  },
  'Numbers 15:19': {
    '5-7': 'then when you eat the bread of the land, you must bring an offering lifted before the Lord.',
    '8-10': 'then when you eat the bread of the land, you must bring an offering lifted before the Lord.',
  },
  'Numbers 15:20': {
    '5-7': 'From the first of your dough, bring a cake as an offering lifted before the Lord. Lift it before the Lord just as you lift an offering from the grain harvest.',
    '8-10': 'From the first of your dough, bring a cake as an offering lifted before the Lord. Lift it before the Lord just as you lift an offering from the grain harvest.',
  },
  'Numbers 15:21': {
    '5-7': 'From the first of your dough, give the Lord an offering lifted before him through all your generations.',
    '8-10': 'From the first of your dough, give the Lord an offering lifted before him through all your generations.',
  },
  'Numbers 15:22': {
    '5-7': '"When you make a mistake and do not keep all these commands that the Lord spoke to Moses,',
    '8-10': '"When you err and do not keep all these commands that the Lord spoke to Moses,',
  },
  'Numbers 10:10': {
    '5-7': '"On your glad days, at your set feasts, and at the beginning of each month, blow the trumpets over your burned offerings and peace offerings. They will be a reminder for you before your God. I am the Lord your God."',
    '8-10': '"On your glad days, at your set feasts, and at the beginning of each month, blow the trumpets over your burned offerings and peace offerings. They will be a reminder for you before your God. I am the Lord your God."',
  },
  'Numbers 16:2': {
    '5-7': 'They rose up against Moses with two hundred fifty well-known leaders from Israel, men chosen from the whole group.',
    '8-10': 'They rose up against Moses with two hundred fifty well-known leaders from Israel, men chosen from the community.',
  },
  'Numbers 16:3': {
    '5-7': 'They gathered together against Moses and Aaron and said, "You have gone too far! All the people are holy, every one of them, and the Lord is among them. Why do you lift yourselves above the Lord\'s whole group?"',
    '8-10': 'They gathered together against Moses and Aaron and said, "You have gone too far! All the people are holy, every one of them, and the Lord is among them. Why do you lift yourselves above the Lord\'s community?"',
  },
  'Numbers 16:6': {
    '5-7': 'Do this: Korah and all his company must take incense pans.',
    '8-10': 'Do this: Korah and all his company must take incense pans.',
  },
  'Numbers 16:17': {
    '5-7': 'Each man must take his incense pan, put sweet-smelling incense on it, and bring it before the Lord. There will be two hundred fifty incense pans, plus yours and Aaron\'s."',
    '8-10': 'Each man must take his incense pan, put incense on it, and bring it before the Lord. There will be two hundred fifty incense pans, plus yours and Aaron\'s."',
  },
  'Numbers 16:13': {
    '5-7': 'Is it not enough that you brought us up from Egypt, a land they called full of milk and honey, to kill us in the wilderness? Must you also make yourself ruler over us?',
    '8-10': 'Is it not enough that you brought us up from Egypt, a land they called full of milk and honey, to kill us in the wilderness? Must you also make yourself ruler over us?',
  },
  'Numbers 16:14': {
    '5-7': 'You have not brought us into a land flowing with milk and honey. You have not given us fields and vineyards. Are you trying to fool these men? We will not come up."',
    '8-10': 'You have not brought us into a land flowing with milk and honey. You have not given us fields and vineyards. Are you trying to blind these men to the truth? We will not come up."',
  },
  'Numbers 16:22': {
    '5-7': 'Moses and Aaron fell facedown and said, "God, you give life to every person. If one man sins, will you be angry with all the people?"',
    '8-10': 'Moses and Aaron fell facedown and said, "God, you are the God of the spirits of all living beings. If one man sins, will you be angry with all the people?"',
  },
  'Numbers 16:21': {
    '5-7': '"Separate yourselves from this whole group, so I may destroy them in a moment!"',
    '8-10': '"Separate yourselves from this community, so I may consume them in a moment!"',
  },
  'Numbers 16:26': {
    '5-7': 'Moses told the whole group, "Please move away from the tents of these wicked men. Do not touch anything that belongs to them, or you may be swept away with them in all their sins!"',
    '8-10': 'Moses told the community, "Please move away from the tents of these wicked men. Do not touch anything that belongs to them, or you may be swept away with them in all their sins!"',
  },
  'Numbers 16:30': {
    '5-7': 'But if the Lord does something new, if the ground opens its mouth and swallows them and everything that belongs to them, and they go down alive to the place of the dead, then you will know these men have despised the Lord."',
    '8-10': 'But if the Lord does something new, if the ground opens its mouth and swallows them and everything that belongs to them, and they go down alive to Sheol, then you will know these men have despised the Lord."',
  },
  'Numbers 16:35': {
    '5-7': 'Fire came out from the Lord and burned up the two hundred fifty men who offered the sweet-smelling incense.',
    '8-10': 'Fire came out from the Lord and consumed the two hundred fifty men who offered the sweet-smelling incense.',
  },
  'Numbers 16:33': {
    '5-7': 'They and everything that belonged to them went down alive to the place of the dead. The earth closed over them, and they died from among the whole group.',
    '8-10': 'They and everything that belonged to them went down alive to Sheol. The earth closed over them, and they perished from among the community.',
  },
  'Numbers 16:37': {
    '5-7': '"Tell Eleazar son of Aaron the priest to pick up the incense pans from the burning place and scatter the fire away from the camp, because the pans are holy.',
    '8-10': '"Tell Eleazar son of Aaron the priest to pick up the incense pans from the burning place and scatter the fire away from the camp, because the pans are holy.',
  },
  'Numbers 16:38': {
    '5-7': 'The incense pans belonged to the men who sinned and lost their lives. Beat the pans into thin plates to cover the altar. They were offered before the Lord, so they are holy. They must be a sign to the people of Israel."',
    '8-10': 'The incense pans belonged to the men who sinned against their own lives. Beat the pans into thin plates to cover the altar. They were offered before the Lord, so they are holy. They must be a sign to the people of Israel."',
  },
  'Numbers 16:40': {
    '5-7': 'This became a reminder to the people of Israel. No one who was not from Aaron\'s family was to come near to burn sweet-smelling incense before the Lord, or he might become like Korah and his company, just as the Lord spoke through Moses.',
    '8-10': 'This became a reminder to the people of Israel. No one who was not from Aaron\'s family was to come near to burn sweet-smelling incense before the Lord, or he might become like Korah and his company, just as the Lord spoke through Moses.',
  },
  'Numbers 16:39': {
    '5-7': 'Eleazar the priest took the bronze incense pans offered by the men who had been burned, and they hammered the pans into a covering for the altar.',
    '8-10': 'Eleazar the priest took the bronze incense pans offered by the men who had been burned, and they hammered the pans into a covering for the altar.',
  },
  'Numbers 16:42': {
    '5-7': 'When the whole group gathered against Moses and Aaron, they looked toward the Tent of Meeting. The cloud covered it, and the Lord\'s glory appeared.',
    '8-10': 'When the community gathered against Moses and Aaron, they looked toward the Tent of Meeting. The cloud covered it, and the Lord\'s glory appeared.',
  },
  'Numbers 16:45': {
    '5-7': '"Get away from this whole group, so I may destroy them in a moment!" Then Moses and Aaron fell facedown.',
    '8-10': '"Get away from this community, so I may consume them in a moment!" Then Moses and Aaron fell facedown.',
  },
  'Numbers 16:46': {
    '5-7': 'Moses said to Aaron, "Take your incense pan. Put fire from the altar in it, lay sweet-smelling incense on it, and carry it quickly to the whole group. Make atonement for them, to help make things right with God, because the Lord\'s anger has gone out. The terrible sickness has begun."',
    '8-10': 'Moses said to Aaron, "Take your incense pan. Put fire from the altar in it, lay incense on it, and carry it quickly to the community. Make atonement for them, because wrath has gone out from the Lord. The plague has begun."',
  },
  'Numbers 16:48': {
    '5-7': 'Aaron stood between the dead and the living, and the terrible sickness stopped.',
    '8-10': 'Aaron stood between the dead and the living, and the plague stopped.',
  },
  'Numbers 25:1': {
    '5-7': 'Israel stayed at Shittim, and the people began to act as only husbands and wives should with the daughters of Moab.',
    '8-10': 'Israel stayed at Shittim, and the people began to sin sexually with the daughters of Moab.',
  },
  'Numbers 22:22': {
    '5-7': 'God\'s anger burned because Balaam went. The Lord\'s angel stood in the road against him. Balaam was riding on his donkey, and his two servants were with him.',
    '8-10': 'God\'s anger burned because Balaam went. The Lord\'s angel stood in the road against him. Balaam was riding on his donkey, and his two servants were with him.',
  },
  'Numbers 22:32': {
    '5-7': 'The Lord\'s angel said to him, "Why have you struck your donkey these three times? I have come out to stand against you, because your way is wrong before me.',
    '8-10': 'The Lord\'s angel said to him, "Why have you struck your donkey these three times? I have come out to stand against you, because your way is wrong before me.',
  },
  'Numbers 22:33': {
    '5-7': 'The donkey saw me and turned away from me these three times. If she had not turned away, I would have killed you by now and kept her alive."',
    '8-10': 'The donkey saw me and turned away from me these three times. If she had not turned away, I would have killed you by now and kept her alive."',
  },
  'Numbers 23:21': {
    '5-7': 'The Lord has not seen sin in Jacob or wrongdoing in Israel. The Lord their God is with them, and the shout of a king is among them.',
    '8-10': 'He has not seen sin in Jacob or perversity in Israel. The Lord his God is with him, and the shout of a king is among them.',
  },
  'Numbers 25:4': {
    '5-7': 'The Lord said to Moses, "Take all the chiefs of the people who joined this sin, and put them to death before the Lord in the open sunlight, so the fierce anger of the Lord may turn away from Israel."',
    '8-10': 'The Lord said to Moses, "Take all the chiefs of the people who joined this sin, and put them to death before the Lord in the open sunlight, so the fierce anger of the Lord may turn away from Israel."',
  },
  'Numbers 25:2': {
    '5-7': 'The Moabite women invited the people to the sacrifices for their gods. The people ate and bowed down to those gods.',
    '8-10': 'The Moabite women invited the people to the sacrifices for their gods. The people ate and bowed down to those gods.',
  },
  'Numbers 25:5': {
    '5-7': 'Moses said to the judges of Israel, "Each of you must put to death the men under you who joined themselves to Baal Peor."',
    '8-10': 'Moses said to the judges of Israel, "Each of you must put to death the men under you who joined themselves to Baal Peor."',
  },
  'Numbers 25:8': {
    '5-7': 'He followed the Israelite man into the tent and put both the man and the woman to death there. Then the terrible sickness stopped among the people of Israel.',
    '8-10': 'He followed the Israelite man into the tent and put both the man and the woman to death there. Then the plague stopped among the people of Israel.',
  },
  'Numbers 25:11': {
    '5-7': '"Phinehas, son of Eleazar and grandson of Aaron the priest, has turned my burning anger away from the people of Israel. He was jealous for my honor among them, so I did not destroy the people of Israel in my jealousy.',
    '8-10': '"Phinehas, son of Eleazar and grandson of Aaron the priest, has turned my wrath away from the people of Israel. He was zealous for my honor among them, so I did not destroy the people of Israel in my jealousy.',
  },
  'Numbers 25:17': {
    '5-7': '"Treat the Midianites as enemies and strike them.',
    '8-10': '"Treat the Midianites as enemies and strike them.',
  },
  'Numbers 25:18': {
    '5-7': 'They treated you as enemies with their tricks. They deceived you in the matter of Peor and in the matter of Cozbi, the daughter of a Midianite leader, their sister, who was killed on the day of the terrible sickness at Peor."',
    '8-10': 'They treated you as enemies with their tricks. They deceived you in the matter of Peor and in the matter of Cozbi, the daughter of a Midianite leader, their sister, who was killed on the day of the plague at Peor."',
  },
  'Numbers 31:3': {
    '5-7': 'Moses told the people, "Choose men from among you and arm them for battle. They must go against Midian to carry out the Lord\'s vengeance on Midian.',
    '8-10': 'Moses told the people, "Choose men from among you and arm them for battle. They must go against Midian to carry out the Lord\'s vengeance on Midian.',
  },
  'Numbers 31:5': {
    '5-7': 'So Israel gave one thousand men from each tribe, twelve thousand men armed for battle.',
    '8-10': 'So Israel gave one thousand men from each tribe, twelve thousand men armed for battle.',
  },
  'Numbers 31:14': {
    '5-7': 'Moses was angry with the army officers, the captains of thousands and hundreds, who came back from the battle.',
    '8-10': 'Moses was angry with the army officers, the captains of thousands and hundreds, who came back from the battle.',
  },
  'Numbers 31:16': {
    '5-7': 'These women followed Balaam\'s counsel and led the people of Israel to act unfaithfully against the Lord at Peor. That is why the terrible sickness came among the Lord\'s whole group.',
    '8-10': 'These women followed Balaam\'s counsel and led the people of Israel to act unfaithfully against the Lord at Peor. That is why the plague came among the Lord\'s community.',
  },
  'Numbers 31:19': {
    '5-7': '"Stay outside the camp for seven days. Whoever killed anyone, and whoever touched someone who was killed, must purify himself on the third day and on the seventh day. Your captives must do the same.',
    '8-10': '"Stay outside the camp for seven days. Whoever killed anyone, and whoever touched someone who was killed, must purify himself on the third day and on the seventh day. Your captives must do the same.',
  },
  'Numbers 31:23': {
    '5-7': 'Everything that can go through fire must pass through fire, and it will be clean. But it must also be purified with cleansing water. Everything that cannot go through fire must pass through water.',
    '8-10': 'Everything that can go through fire must pass through fire, and it will be clean. But it must also be purified with cleansing water. Everything that cannot go through fire must pass through water.',
  },
  'Numbers 31:28': {
    '5-7': 'From the soldiers who went to battle, set aside a tribute for the Lord: one out of every five hundred people, cattle, donkeys, and sheep.',
    '8-10': 'From the soldiers who went to battle, set aside a tribute for the Lord: one out of every five hundred people, cattle, donkeys, and sheep.',
  },
  'Numbers 31:49': {
    '5-7': 'They said to Moses, "Your servants have counted the soldiers under our command, and not one man of us is missing.',
    '8-10': 'They said to Moses, "Your servants have counted the soldiers under our command, and not one man of us is missing.',
  },
  'Numbers 31:54': {
    '5-7': 'Moses and Eleazar the priest took the gold from the captains of thousands and hundreds and brought it into the Tent of Meeting as a reminder for the people of Israel before the Lord.',
    '8-10': 'Moses and Eleazar the priest took the gold from the captains of thousands and hundreds and brought it into the Tent of Meeting as a reminder for the people of Israel before the Lord.',
  },
  'Numbers 35:11': {
    '5-7': 'then choose cities to be safe places for you. If someone kills another person without meaning to, he may run there.',
    '8-10': 'then appoint cities of refuge for yourselves. If someone kills another person without meaning to, he may flee there.',
  },
  'Numbers 35:12': {
    '5-7': 'These cities will be safe places from the relative who avenges the death, so the person who killed someone will not die before he stands before the whole group for judgment.',
    '8-10': 'These cities will be places of refuge from the avenger, so the person who killed someone will not die before he stands before the community for judgment.',
  },
  'Numbers 35:15': {
    '5-7': 'These six safe cities will be for the people of Israel and for people from other nations who live among them. Anyone who kills someone without meaning to may run there.',
    '8-10': 'These six cities of refuge will be for the people of Israel and for foreigners living among them. Anyone who kills someone without meaning to may flee there.',
  },
  'Numbers 35:19': {
    '5-7': 'The close relative who avenges the death must put the murderer to death when he meets him.',
    '8-10': 'The close relative who avenges the death must put the murderer to death when he meets him.',
  },
  'Numbers 35:20': {
    '5-7': 'If he shoved someone out of hatred, or threw something at him while hiding and waiting, and the person died,',
    '8-10': 'If he shoved someone out of hatred, or threw something at him while lying in wait, and the person died,',
  },
  'Numbers 35:21': {
    '5-7': 'or if he struck him with his hand in hatred and the person died, then the one who struck him must be put to death. He is a murderer. The close relative who avenges the death must put the murderer to death when he meets him.',
    '8-10': 'or if he struck him with his hand in hostility and the person died, then the one who struck him must be put to death. He is a murderer. The close relative who avenges the death must put the murderer to death when he meets him.',
  },
  'Numbers 35:22': {
    '5-7': 'But if he shoved someone suddenly without hatred, or threw something without hiding and waiting,',
    '8-10': 'But if he shoved someone suddenly without hostility, or threw something without lying in wait,',
  },
  'Numbers 35:23': {
    '5-7': 'or if he dropped or threw a stone that could kill someone, but he did not see the person, and the person died, and he was not his enemy and was not trying to harm him,',
    '8-10': 'or if he dropped or threw a stone that could kill someone, but he did not see the person, and the person died, and he was not his enemy and was not trying to harm him,',
  },
  'Numbers 35:24': {
    '5-7': 'then the whole group must judge between the person who struck him and the relative who avenges the death, according to these rules.',
    '8-10': 'then the community must judge between the person who struck him and the relative who avenges the death, according to these rules.',
  },
  'Numbers 35:25': {
    '5-7': 'The whole group must rescue the person who killed someone from the relative who avenges the death and send him back to the safe city where he had run. He must live there until the high priest dies, the priest who was set apart with holy oil.',
    '8-10': 'The community must rescue the person who killed someone from the relative who avenges the death and send him back to the city of refuge where he had fled. He must live there until the high priest dies, the priest who was anointed with holy oil.',
  },
  'Numbers 35:26': {
    '5-7': 'But if the person who killed someone goes outside the border of his safe city where he had run,',
    '8-10': 'But if the person who killed someone goes outside the border of his city of refuge where he had fled,',
  },
  'Numbers 35:27': {
    '5-7': 'and the relative who avenges the death finds him outside the border of his safe city and kills him, that relative is not guilty of bloodshed,',
    '8-10': 'and the relative who avenges the death finds him outside the border of his city of refuge and kills him, that relative is not guilty of bloodshed,',
  },
  'Numbers 35:28': {
    '5-7': 'because he should have stayed in his safe city until the high priest died. But after the high priest dies, the person who killed someone may return to the land he owns.',
    '8-10': 'because he should have stayed in his city of refuge until the high priest died. But after the high priest dies, the person who killed someone may return to the land he owns.',
  },
  'Numbers 35:29': {
    '5-7': '"These things must be a rule for you through all your generations, in all the places where you live.',
    '8-10': '"These things must be a rule for you through all your generations, in all the places where you live.',
  },
  'Numbers 35:30': {
    '5-7': '"If someone kills a person, the murderer must be put to death only when witnesses say what happened. One witness alone must not speak against a person so that he dies.',
    '8-10': '"If someone kills a person, the murderer must be put to death only when witnesses say what happened. One witness alone must not speak against a person so that he dies.',
  },
  'Numbers 35:31': {
    '5-7': '"Do not take money to spare the life of a murderer who is guilty of death. He must be put to death.',
    '8-10': '"Do not take ransom money to spare the life of a murderer who is guilty of death. He must be put to death.',
  },
  'Numbers 35:32': {
    '5-7': 'Do not take money from someone who has run to his safe city, so that he may return to the land before the priest dies.',
    '8-10': 'Do not take ransom money from someone who has fled to his city of refuge, so that he may return to the land before the priest dies.',
  },
  'Numbers 19:2': {
    '5-7': '"This is the rule the Lord commanded: Tell the people of Israel to bring you a red young cow with nothing wrong with it, one that has never worn a yoke for work.',
    '8-10': '"This is the rule the Lord commanded: Tell the people of Israel to bring you a red young cow without defect, one that has never worn a yoke for work.',
  },
  'Numbers 19:3': {
    '5-7': 'You must give her to Eleazar the priest. He must bring her outside the camp, and someone must kill her in front of him.',
    '8-10': 'You must give her to Eleazar the priest. He must bring her outside the camp, and someone must kill her in front of him.',
  },
  'Numbers 19:5': {
    '5-7': 'The young cow must be burned while Eleazar watches. Its skin, meat, blood, and waste must all be burned.',
    '8-10': 'The young cow must be burned while Eleazar watches. Its skin, meat, blood, and waste must all be burned.',
  },
  'Numbers 19:7': {
    '5-7': 'Then the priest must wash his clothes and wash his body in water. Afterward he may come into the camp, but he will not be clean for worship until evening.',
    '8-10': 'Then the priest must wash his clothes and bathe his body in water. Afterward he may come into the camp, but he will be unclean until evening.',
  },
  'Numbers 19:8': {
    '5-7': 'The person who burns the cow must wash his clothes in water and wash his body in water. He will not be clean for worship until evening.',
    '8-10': 'The person who burns the cow must wash his clothes in water and bathe his body in water. He will be unclean until evening.',
  },
  'Numbers 19:9': {
    '5-7': 'A clean person must gather the ashes of the young cow and store them outside the camp in a clean place. They must be kept for the people of Israel to make cleansing water. It is an offering for sin.',
    '8-10': 'A clean person must gather the ashes of the young cow and store them outside the camp in a clean place. They must be kept for the people of Israel to make cleansing water. It is a sin offering.',
  },
  'Numbers 19:10': {
    '5-7': 'The person who gathers the ashes of the young cow must wash his clothes and will not be clean for worship until evening. This will be a lasting rule for the people of Israel and for the foreigner who lives among them.',
    '8-10': 'The person who gathers the ashes of the young cow must wash his clothes and will be unclean until evening. This will be a lasting rule for the people of Israel and for the foreigner who lives among them.',
  },
  'Numbers 19:11': {
    '5-7': '"Whoever touches a dead body will not be clean for worship for seven days.',
    '8-10': '"Whoever touches a dead body will be unclean for seven days.',
  },
  'Numbers 19:12': {
    '5-7': 'He must purify himself with water on the third day, and on the seventh day he will be clean. But if he does not purify himself on the third day, he will not be clean on the seventh day.',
    '8-10': 'He must purify himself with water on the third day, and on the seventh day he will be clean. But if he does not purify himself on the third day, he will not be clean on the seventh day.',
  },
  'Numbers 19:13': {
    '5-7': 'Whoever touches a dead person and does not purify himself makes the Lord\'s tent not clean for worship. That person must be removed from Israel. Because the cleansing water was not sprinkled on him, he is still not clean for worship.',
    '8-10': 'Whoever touches a dead person and does not purify himself makes the Lord\'s tent unclean. That person must be removed from Israel. Because the cleansing water was not sprinkled on him, he is still unclean.',
  },
  'Numbers 19:14': {
    '5-7': '"This is the law when someone dies in a tent: everyone who comes into the tent, and everyone already in the tent, will not be clean for worship for seven days.',
    '8-10': '"This is the law when someone dies in a tent: everyone who comes into the tent, and everyone already in the tent, will be unclean for seven days.',
  },
  'Numbers 19:15': {
    '5-7': 'Every open container without a cover tied on it will not be clean for worship.',
    '8-10': 'Every open container without a cover tied on it will be unclean.',
  },
  'Numbers 19:16': {
    '5-7': 'Whoever is outside and touches someone killed with a sword, a dead body, a human bone, or a grave will not be clean for worship for seven days.',
    '8-10': 'Whoever is outside and touches someone killed with a sword, a dead body, a human bone, or a grave will be unclean for seven days.',
  },
  'Numbers 19:17': {
    '5-7': '"For the person who is not clean for worship, they must take some ashes from the burned offering for sin and pour fresh flowing water over them in a container.',
    '8-10': '"For the person who is unclean, they must take some ashes from the burned sin offering and pour fresh flowing water over them in a container.',
  },
  'Numbers 19:19': {
    '5-7': 'The clean person must sprinkle the water on the person not clean for worship on the third day and on the seventh day. On the seventh day, he must purify him. Then the person must wash his clothes, bathe in water, and be clean for worship in the evening.',
    '8-10': 'The clean person must sprinkle the water on the unclean person on the third day and on the seventh day. On the seventh day, he must purify him. Then the person must wash his clothes, bathe in water, and be clean in the evening.',
  },
  'Numbers 19:20': {
    '5-7': 'But if someone is not clean for worship and does not purify himself, that person must be removed from the whole group, because he has made the Lord\'s holy place not clean for worship. The cleansing water has not been sprinkled on him. He is not clean for worship.',
    '8-10': 'But if someone is unclean and does not purify himself, that person must be removed from the gathered people, because he has made the Lord\'s holy place unclean. The cleansing water has not been sprinkled on him. He is unclean.',
  },
  'Numbers 19:21': {
    '5-7': 'This will be a lasting rule for them. Whoever sprinkles the cleansing water must wash his clothes, and whoever touches the cleansing water will not be clean for worship until evening.',
    '8-10': 'This will be a lasting rule for them. Whoever sprinkles the cleansing water must wash his clothes, and whoever touches the cleansing water will be unclean until evening.',
  },
  'Numbers 19:22': {
    '5-7': 'Whatever the person who is not clean for worship touches will not be clean for worship, and whoever touches it will not be clean for worship until evening."',
    '8-10': 'Whatever the unclean person touches will be unclean, and whoever touches it will be unclean until evening."',
  },
  'Numbers 31:17': {
    '5-7': 'Now kill every male among the little ones, and kill every woman who has lived as a man\'s wife.',
    '8-10': 'Now kill every male among the little ones, and kill every woman who has had sexual relations with a man.',
  },
  'Numbers 31:18': {
    '5-7': 'But keep alive for yourselves all the girls who have not lived as a man\'s wife.',
    '8-10': 'But keep alive for yourselves all the girls who have not had sexual relations with a man.',
  },
  'Numbers 32:11': {
    '5-7': 'Not one of the men who came up out of Egypt, from twenty years old and older, will see the land I swore to Abraham, Isaac, and Jacob, because they have not followed me completely,',
    '8-10': 'Not one of the men who came up out of Egypt, from twenty years old and older, will see the land I swore to Abraham, Isaac, and Jacob, because they have not followed me completely,',
  },
  'Numbers 32:13': {
    '5-7': 'The Lord\'s anger burned against Israel, and he made them wander back and forth in the wilderness for forty years, until that whole generation who had done evil in the Lord\'s sight had died.',
    '8-10': 'The Lord\'s anger burned against Israel, and he made them wander back and forth in the wilderness for forty years, until that whole generation who had done evil in the Lord\'s sight had died.',
  },
  'Numbers 35:33': {
    '5-7': '"So do not make the land where you live not clean before God. When innocent blood is shed, the land becomes not clean before God. Nothing can make atonement for the land, nothing can make it right before God, except the blood of the one who shed it.',
    '8-10': '"So do not make the land where you live unclean. Shed blood makes the land unclean. No atonement can be made for the land because of blood shed in it, except by the blood of the one who shed it.',
  },
  'Numbers 35:34': {
    '5-7': 'Do not make the land where you live not clean before God, because I live there too. I, the Lord, live among the people of Israel.\' "',
    '8-10': 'Do not make the land where you live unclean, because I live there too. I, the Lord, live among the people of Israel.\' "',
  },
};

Object.assign(STORY_REVISIONS, {
  'Numbers 11:1': {
    '5-7': 'The people began to complain where the Lord could hear them. When the Lord heard, his anger burned, and the Lord\'s fire burned among them and burned up some of the edge of the camp.',
    '8-10': 'The people began to complain where the Lord could hear them. When the Lord heard, his anger burned, and the Lord\'s fire burned among them and consumed some of the edge of the camp.',
  },
  'Numbers 11:5': {
    '5-7': 'We remember the fish we used to eat in Egypt for nothing. We remember the cucumbers, melons, leeks, onions, and garlic.',
    '8-10': 'We remember the fish we ate in Egypt for nothing, along with the cucumbers, melons, leeks, onions, and garlic.',
  },
  'Numbers 11:12': {
    '5-7': 'Did I give birth to all these people? Did I bring them into the world? Why do you tell me to carry them close to me, like a nurse carries a baby, all the way to the land you promised their fathers?',
    '8-10': 'Did I conceive all these people? Did I give birth to them? Why do you tell me to carry them close to me, like a nurse carries a baby, to the land you promised their fathers?',
  },
  'Numbers 11:17': {
    '5-7': 'I will come down and talk with you there. I will take some of the Spirit who is on you and put him on them. They will help carry the heavy work of leading the people, so you will not carry it alone.',
    '8-10': 'I will come down and talk with you there. I will take some of the Spirit who is on you and put him on them. They will help carry the burden of the people with you, so you will not carry it alone.',
  },
  'Numbers 12:11': {
    '5-7': 'Aaron said to Moses, "Oh, my lord, please do not hold this sin against us. We acted foolishly and sinned.',
    '8-10': 'Aaron said to Moses, "Oh, my lord, please do not hold this sin against us. We acted foolishly and sinned.',
  },
  'Numbers 12:12': {
    '5-7': 'Please do not let her be like someone already dying, with the body wasting away."',
    '8-10': 'Please do not let her be like a child born already near death, with the body wasting away."',
  },
  'Numbers 13:1': {
    all: 'The Lord spoke to Moses, saying,',
  },
  'Numbers 13:2': {
    '5-7': '"Send men to spy out the land of Canaan, the land I am giving to the people of Israel. Send one leader from each tribe of their fathers."',
    '8-10': '"Send men to spy out the land of Canaan, the land I am giving to the people of Israel. Send one leader from each tribe of their fathers."',
  },
  'Numbers 13:24': {
    '5-7': 'That place was called the Valley of Eshcol, because the people of Israel cut down a cluster of grapes there.',
    '8-10': 'That place was called the Valley of Eshcol, because the people of Israel cut down a cluster of grapes there.',
  },
  'Numbers 13:32': {
    '5-7': 'They spread a bad report about the land they had spied out. They said, "The land we walked through to spy out seems to swallow up the people who live there. All the people we saw there were very tall.',
    '8-10': 'They spread a bad report about the land they had spied out. They said, "The land we walked through to spy out seems to swallow up the people who live there. All the people we saw there were very tall.',
  },
  'Numbers 14:7': {
    '5-7': 'They spoke to all the people of Israel and said, "The land we passed through to spy out is a very, very good land.',
    '8-10': 'They spoke to all the people of Israel and said, "The land we passed through to spy out is an exceedingly good land.',
  },
  'Numbers 14:8': {
    '5-7': 'If the Lord is pleased with us, he will bring us into that land and give it to us. It is a land flowing with milk and honey.',
    '8-10': 'If the Lord is pleased with us, he will bring us into that land and give it to us, a land flowing with milk and honey.',
  },
  'Numbers 14:9': {
    '5-7': 'Only do not rebel against the Lord, and do not be afraid of the people of the land. They are like bread for us to eat. Their protection has gone away from them, and the Lord is with us. Do not be afraid of them."',
    '8-10': 'Only do not rebel against the Lord, and do not be afraid of the people of the land. They are like bread for us to eat. Their protection has gone away from them, and the Lord is with us. Do not be afraid of them."',
  },
  'Numbers 14:33': {
    '5-7': 'Your children will wander in the wilderness for forty years. They will carry the result of your unfaithfulness until this generation has died in the wilderness.',
    '8-10': 'Your children will wander in the wilderness for forty years. They will bear your unfaithfulness until this generation has died in the wilderness.',
  },
  'Numbers 14:34': {
    '5-7': 'You spied out the land for forty days. So for forty years, one year for each day, you will carry the guilt of your sins. Then you will know what it means for me to stand against you.',
    '8-10': 'You spied out the land for forty days. So for forty years, one year for each day, you will carry the guilt of your sins. Then you will know what it means for me to stand against you.',
  },
  'Numbers 20:12': {
    '5-7': 'The Lord said to Moses and Aaron, "Because you did not trust me and show the people of Israel that I am holy, you will not bring this whole group into the land I have given them."',
    '8-10': 'The Lord said to Moses and Aaron, "Because you did not trust me and show the people of Israel that I am holy, you will not bring this community into the land I have given them."',
  },
  'Numbers 26:53': {
    '5-7': '"Divide the land among these tribes as their share, using the number of names that were counted.',
    '8-10': '"Divide the land among these tribes as their inheritance, using the number of names that were counted.',
  },
  'Numbers 26:54': {
    '5-7': 'Give a larger share of land to the larger tribe and a smaller share to the smaller tribe. Each tribe\'s share must fit the number of people counted.',
    '8-10': 'Give a larger inheritance to the larger tribe and a smaller inheritance to the smaller tribe. Each tribe\'s inheritance must fit the number of people counted.',
  },
  'Numbers 26:55': {
    '5-7': 'Even so, the land must be divided by lot. Each tribe must receive its share by its father\'s family name.',
    '8-10': 'Even so, the land must be divided by lot. Each tribe must receive its inheritance by its father\'s family name.',
  },
  'Numbers 26:56': {
    '5-7': 'The lot will help divide the land between the larger tribes and the smaller tribes."',
    '8-10': 'The lot will help divide the inheritance between the larger tribes and the smaller tribes."',
  },
  'Numbers 33:54': {
    '5-7': 'Divide the land by lot for your families. Give larger families more land and smaller families less land. Each family must receive the place the lot shows, according to its tribe.',
    '8-10': 'Divide the land by lot for your families. Give larger families more inheritance and smaller families less inheritance. Each family must receive the place the lot shows, according to its tribe.',
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
        body: polishNumbersText(verse.body, ageRange, verse.reference),
      }));

      ageTexts[ageRange] = verses;
      writeAgeChapter(filePath, chapterNumber, verses);
    }

    updateResourceChapter(chapterNumber, ageTexts);
  }

  console.log(`Reviewed Numbers chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishNumbersText(text, ageRange, reference) {
  let result = polishKidReadableText(text, ageRange);

  result = result
    .replace(/\bTake a census of\b/g, 'Count')
    .replace(/\bCount of all\b/g, 'Count all')
    .replace(/\bCount of the\b/g, 'Count the')
    .replace(/\btake a census of\b/g, 'count')
    .replace(/\btake a census\b/g, 'count the people')
    .replace(/\bcensus\b/g, 'count')
    .replace(/\bfamily houses\b/g, 'family groups')
    .replace(/\bfamily house\b/g, 'family group')
    .replace(/\bby their generations\b/g, 'by their family lines')
    .replace(/\baccording to the number of the names\b/g, 'name by name')
    .replace(/\ball who were able to go out to war\b/g, 'all who were able to serve in the army')
    .replace(/\ball who are able to go out to war\b/g, 'all who are able to serve in the army')
    .replace(/\bare able to go out to war\b/g, 'are able to serve in the army')
    .replace(/\bgo out to war in Israel\b/g, "serve in Israel's army")
    .replace(/\bserve in the army in Israel\b/g, "serve in Israel's army")
    .replace(/\bmust still count with you\b/g, 'must stand with you')
    .replace(/\bmust still count before\b/g, 'must stand before')
    .replace(/\bmust still count\b/g, 'must still be kept')
    .replace(/\bNotwithstanding\b/g, 'Even so')
    .replace(/\bmust surely be put to death\b/g, 'must be put to death')
    .replace(/\bmust surely die\b/g, 'will surely die')
    .replace(/\bmust surely give\b/g, 'must give')
    .replace(/\bSurely none\b/g, 'Not one')
    .replace(/\btravel far away\b/g, 'journey far away')
    .replace(/\bmen of great stature\b/g, 'very tall men')
    .replace(/\bevil report\b/g, 'bad report')
    .replace(/\bthe South\b/g, 'the southern land')
    .replace(/\bFrankincense\b/g, 'Sweet-smelling incense')
    .replace(/\bfrankincense\b/g, 'sweet-smelling incense')
    .replace(/\bmemorial portion\b/g, 'part burned before the Lord')
    .replace(/\bgrain offering of memorial\b/g, 'reminder grain offering')
    .replace(/\bgrain gift of memorial\b/g, 'reminder grain gift')
    .replace(/\bmemorial for you\b/g, 'reminder for you')
    .replace(/\bfor a memorial\b/g, 'as a reminder')
    .replace(/\ba memorial\b/g, 'a reminder')
    .replace(/\bmemorial\b/g, 'reminder')
    .replace(/\bmeal offerings\b/g, 'grain offerings')
    .replace(/\bmeal offering\b/g, 'grain offering')
    .replace(/\bgrain offering of jealousy\b/g, 'jealousy grain offering')
    .replace(/\bgrain gift of jealousy\b/g, 'jealousy grain gift')
    .replace(/\bbringing sin to memory\b/g, 'bringing sin to mind')
    .replace(/\bofferings? by fire\b/g, match => match.startsWith('offerings') ? 'offerings burned on the altar' : 'offering burned on the altar')
    .replace(/\bofferings? made by fire\b/g, match => match.startsWith('offerings') ? 'offerings burned on the altar' : 'offering burned on the altar')
    .replace(/\bmade by fire\b/g, 'burned on the altar')
    .replace(/\bheave it\b/g, 'lift it before the Lord')
    .replace(/\bheave its best\b/g, 'lift its best before the Lord')
    .replace(/\bheaved from it\b/g, 'lifted its best before the Lord')
    .replace(/\boffer up a cake\b/g, 'offer a cake')
    .replace(/\boffering lifted before the Lord\b/g, 'offering lifted before the Lord')
    .replace(/\blifted offering\b/g, 'offering lifted before the Lord')
    .replace(/\bwithout spot, in which is no defect\b/g, 'with nothing wrong with it')
    .replace(/\bwithout spot\b/g, 'with nothing wrong with it')
    .replace(/\bwithout defect\b/g, 'with nothing wrong with it')
    .replace(/\bwithout blemish\b/g, 'with nothing wrong with it')
    .replace(/\bno defect\b/g, 'nothing wrong with it')
    .replace(/\bdefect\b/g, 'something wrong')
    .replace(/\bdefects\b/g, 'things wrong')
    .replace(/\bwine and strong drink\b/g, 'wine and other drink that can make someone drunk')
    .replace(/\bwine or strong drink\b/g, 'wine or another drink that can make someone drunk')
    .replace(/\bstrong drink\b/g, 'drink that can make someone drunk')
    .replace(/\bseparation\b/g, 'separation')
    .replace(/\bserious disease\b/g, 'serious skin disease')
    .replace(/\bterrible sicknesses\b/g, 'terrible sicknesses')
    .replace(/\bvery great terrible sickness\b/g, 'very terrible sickness')
    .replace(/\bmade unclean\b/g, 'made unclean')
    .replace(/\bmake unclean\b/g, 'make unclean')
    .replace(/\bthigh to waste away\b/g, 'thigh to waste away')
    .replace(/\ballows your thigh to waste away\b/g, 'allows your thigh to waste away')
    .replace(/\bmust bear her sin\b/g, 'must carry her guilt')
    .replace(/\bmust bear his sin\b/g, 'must carry his guilt')
    .replace(/\bbear her sin\b/g, 'carry her guilt')
    .replace(/\bbear his sin\b/g, 'carry his guilt')
    .replace(/\brestitution\b/g, 'payment back')
    .replace(/\bmake payment back\b/g, 'pay back')
    .replace(/\badd to it the fifth part\b/g, 'add one fifth more')
    .replace(/\bthe fifth part\b/g, 'one fifth more')
    .replace(/\bfifth part\b/g, 'one fifth')
    .replace(/\bmale sheep of the atonement\b/g, 'male sheep used for atonement')
    .replace(/\bby which atonement must be made\b/g, 'by which atonement must be made')
    .replace(/\bto make atonement for you, helping make things right with God\b/g, 'to make atonement for you')
    .replace(/\bhelping make things right with God for Israel\b/g, 'for Israel')
    .replace(/\bpurified themselves from sin\b/g, 'purified themselves')
    .replace(/\bwarfare\b/g, 'service')
    .replace(/\bto the war\b/g, 'to the battle')
    .replace(/\bgo before the Lord to the war\b/g, 'go armed before the Lord to battle')
    .replace(/\bencampments\b/g, 'camps')
    .replace(/\bslain\b/g, 'killed')
    .replace(/\bmust be slain\b/g, 'must be put to death')
    .replace(/\bthe testimony of witnesses\b/g, 'what witnesses say')
    .replace(/\btestify alone\b/g, 'speak as the only witness')
    .replace(/\bpollute the land\b/g, 'make the land unclean')
    .replace(/\bblood pollutes the land\b/g, 'shed blood makes the land unclean')
    .replace(/\bNo atonement can be made for the land\b/g, 'No atonement can be made for the land')
    .replace(/\baccording to the holy place weight\b/g, 'by the weight used at the holy place')
    .replace(/\bholy place weight\b/g, 'weight used at the holy place')
    .replace(/\bUnleavened bread\b/g, 'Bread made without yeast')
    .replace(/\bUnleavened cake\b/g, 'Cake made without yeast')
    .replace(/\bUnleavened cakes\b/g, 'Cakes made without yeast')
    .replace(/\bUnleavened wafer\b/g, 'Thin wafer made without yeast')
    .replace(/\bUnleavened wafers\b/g, 'Thin wafers made without yeast')
    .replace(/\bunleavened bread\b/g, 'bread made without yeast')
    .replace(/\bunleavened cake\b/g, 'cake made without yeast')
    .replace(/\bunleavened cakes\b/g, 'cakes made without yeast')
    .replace(/\bunleavened wafer\b/g, 'thin wafer made without yeast')
    .replace(/\bunleavened wafers\b/g, 'thin wafers made without yeast')
    .replace(/\bbeing made clean water\b/g, 'cleansing water')
    .replace(/\bwater of being made clean\b/g, 'cleansing water')
    .replace(/\bthe water of being made clean\b/g, 'the cleansing water')
    .replace(/\bfree will offerings\b/g, 'gifts people choose to bring')
    .replace(/\bfree will offering\b/g, 'gift someone chooses to bring')
    .replace(/\bLord-a\b/g, 'Lord: a')
    .replace(/\bfeasts-in\b/g, 'feasts, in')
    .replace(/\bdrink gifts of it\b/g, 'its drink gifts')
    .replace(/\bleaders of the bulls\b/g, 'heads of the bulls')
    .replace(/\bone for one as an offering for sin\b/g, 'one bull as an offering for sin')
    .replace(/\ba offering lifted before the Lord\b/g, 'an offering lifted before the Lord')
    .replace(/\ba offering\b/g, 'an offering')
    .replace(/\ban offering lifted before the Lord to the Lord\b/g, 'an offering lifted before the Lord')
    .replace(/\boffering lifted before the Lord to the Lord\b/g, 'offering lifted before the Lord')
    .replace(/\bwhich was ordained\b/g, 'which was appointed')
    .replace(/\bcensers\b/g, 'incense pans')
    .replace(/\bcenser\b/g, 'incense pan')
    .replace(/\bsanctuary\b/g, 'holy place')
    .replace(/\bSanctuary\b/g, 'Holy Place');

  if (ageRange === '5-7') {
    result = result
      .replace(/\bEvery firstborn that opens the womb\b/g, 'Every firstborn offered to the Lord')
      .replace(/\bfirstborn of man\b/g, 'firstborn sons')
      .replace(/\bredeem those who are to be redeemed\b/g, 'buy back those who must be bought back')
      .replace(/\bredeem the firstborn\b/g, 'buy back the firstborn')
      .replace(/\bmust redeem\b/g, 'must buy back')
      .replace(/\bredeemed\b/g, 'bought back')
      .replace(/\bredeem\b/g, 'buy back')
      .replace(/\bdischarge\b/g, 'unusual flow')
      .replace(/\bsexual relations with\b/g, 'acts as only a husband and wife should with')
      .replace(/\bhas had sexual relations with\b/g, 'has lived as a man\'s wife with')
      .replace(/\bhad sexual relations with\b/g, 'lived as a man\'s wife with')
      .replace(/\bunclean because of\b/g, 'not clean for worship because of')
      .replace(/\bunclean by reason of\b/g, 'not clean for worship because of')
      .replace(/\bunclean by\b/g, 'not clean for worship because of')
      .replace(/\bunclean until\b/g, 'not clean for worship until')
      .replace(/\bunclean seven days\b/g, 'not clean for worship for seven days')
      .replace(/\bunclean person\b/g, 'person not clean for worship')
      .replace(/\bthe unclean\b/g, 'the person not clean for worship')
      .replace(/\bThe unclean\b/g, 'The person not clean for worship')
      .replace(/\bis unclean\b/g, 'is not clean for worship')
      .replace(/\bwas unclean\b/g, 'was not clean for worship')
      .replace(/\bare unclean\b/g, 'are not clean for worship')
      .replace(/\bbe unclean\b/g, 'be not clean for worship')
      .replace(/\bwill be unclean\b/g, 'will not be clean for worship')
      .replace(/\bmade unclean\b/g, 'made not clean for worship')
      .replace(/\bmake unclean\b/g, 'make not clean for worship')
      .replace(/\bmakes unclean\b/g, 'makes not clean for worship')
      .replace(/\bmake their camp unclean\b/g, 'make their camp not clean for worship')
      .replace(/\bmake the camp unclean\b/g, 'make the camp not clean for worship')
      .replace(/\bmake the Lord's tent unclean\b/g, "make the Lord's tent not clean for worship")
      .replace(/\bmakes the Lord's tent unclean\b/g, "makes the Lord's tent not clean for worship")
      .replace(/\bunclean animals\b/g, 'animals not clean for worship')
      .replace(/\bunclean animal\b/g, 'animal not clean for worship')
      .replace(/\buncleanness\b/g, 'what is not clean for worship')
      .replace(/\bhas had sexual relations with a man\b/g, 'has lived as a man\'s wife')
      .replace(/\bhave not had sexual relations with a man\b/g, 'have not lived as a man\'s wife')
      .replace(/\bwho have not known man by lying with him\b/g, 'who have not lived as a man\'s wife')
      .replace(/\bwithout defect\b/g, 'with nothing wrong with it')
      .replace(/\bwith nothing wrong with it as a sin offering\b/g, 'with nothing wrong with it as an offering for sin')
      .replace(/\bsin offering\b/g, 'offering for sin')
      .replace(/\bsin offerings\b/g, 'offerings for sin')
      .replace(/\bguilt offering\b/g, 'guilt offering')
      .replace(/\bgrain offering\b/g, 'grain gift')
      .replace(/\bgrain offerings\b/g, 'grain gifts')
      .replace(/\bdrink offering\b/g, 'drink gift')
      .replace(/\bdrink offerings\b/g, 'drink gifts')
      .replace(/\bpeace offering\b/g, 'peace offering')
      .replace(/\bpeace offerings\b/g, 'peace offerings')
      .replace(/\bcommunity\b/g, 'whole group')
      .replace(/\bcongregation\b/g, 'whole group')
      .replace(/\bTabernacle\b/g, 'Tent')
      .replace(/\btabernacle\b/g, 'tent')
      .replace(/\bvow\b/g, 'special promise')
      .replace(/\bvows\b/g, 'special promises')
      .replace(/\bholy convocation\b/g, 'holy gathering')
      .replace(/\bholy convocations\b/g, 'holy gatherings')
      .replace(/\bmale lamb a year old\b/g, 'year-old male lamb')
      .replace(/\bfemale lamb a year old\b/g, 'year-old female lamb');
  }

  if (ageRange === '5-7' && reference.startsWith('Numbers 6:')) {
    result = result
      .replace(/\bthe days of his separation\b/g, 'the days of his Nazirite promise')
      .replace(/\bdays of his separation\b/g, 'days of his Nazirite promise')
      .replace(/\bhis special separation\b/g, 'his special Nazirite promise')
      .replace(/\bhis separation to God\b/g, 'his Nazirite promise to God')
      .replace(/\bhis separation to the Lord\b/g, 'his Nazirite promise to the Lord')
      .replace(/\bhis separation\b/g, 'his Nazirite promise')
      .replace(/\bHis separation\b/g, 'His Nazirite promise')
      .replace(/\bthe law of his separation\b/g, 'the law of his Nazirite promise');
  }

  result = result
    .replace(/\bnot clean for worship for worship\b/g, 'not clean for worship')
    .replace(/\bclean for worship for worship\b/g, 'clean for worship')
    .replace(/\bwill be not clean for worship\b/g, 'will not be clean for worship')
    .replace(/\bbe not clean for worship\b/g, 'not be clean for worship')
    .replace(/\bmade not clean for worship\b/g, 'made not clean for worship')
    .replace(/\bmust not make not clean for worship\b/g, 'must not make')
    .replace(/\bDo not make not clean for worship\b/g, 'Do not make')
    .replace(/\bmake not clean for worship the land\b/g, 'make the land not clean for worship')
    .replace(/\b(?:sweet-smelling\s+)+incense\b/g, 'sweet-smelling incense')
    .replace(/\bsweet-smelling incense pans\b/g, 'incense pans')
    .replace(/\ba small measured amount of of\b/g, 'a small measured amount of')
    .replace(/\ban offering for sin and the other as a burned offering\b/g, 'one as an offering for sin and the other as a burned offering')
    .replace(/\ban offering for sin and the other for a burned offering\b/g, 'one as an offering for sin and the other as a burned offering')
    .replace(/\boffer one for an offering for sin\b/g, 'offer one as an offering for sin')
    .replace(/\bfor an offering for sin\b/g, 'as an offering for sin')
    .replace(/\bwith nothing wrong with it for an offering for sin\b/g, 'with nothing wrong with it as an offering for sin')
    .replace(/\bwith nothing wrong with it for peace offerings\b/g, 'with nothing wrong with it as a peace offering')
    .replace(/\bwith nothing wrong with it for a burned offering\b/g, 'with nothing wrong with it as a burned offering')
    .replace(/\bthigh waste away\b/g, 'thigh waste away')
    .replace(/\bvery great terrible sickness\b/g, 'very terrible sickness')
    .replace(/\bterrible sickness had already begun\b/g, 'terrible sickness had already begun')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return STORY_REVISIONS[reference]?.[ageRange] || STORY_REVISIONS[reference]?.all || result;
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

  content = replaceMemoryVerseText(content, '5-7', ageTexts['5-7']);
  content = replaceMemoryVerseText(content, '8-10', ageTexts['8-10']);
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
  const overview = `${BOOK_OVERVIEW} ${firstSentence}`;

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
    const updated = body.replace(/^(.+?)\s+-\s+(Numbers\s+\d+:\d+)$/gm, (line, text, reference) => {
      const replacement = findVerse(verses, reference);
      return replacement ? `${replacement} - ${reference}` : line;
    });

    return `${prefix}${updated}${suffix}`;
  });
}

function replaceResourceAgeText(content, reference, ageRange, text) {
  if (!text) return content;

  const heading = ageRange === '5-7' ? '#### Ages 5-7' : '#### Ages 8-10';
  const verseHeading = `### ${reference}`;
  const verseStart = content.indexOf(verseHeading);
  if (verseStart === -1) return content;

  const nextVerseMatch = content.slice(verseStart + verseHeading.length).match(/\r?\n### Numbers \d+:\d+\s*\r?\n/);
  const verseEnd = nextVerseMatch
    ? verseStart + verseHeading.length + nextVerseMatch.index
    : content.length;

  const before = content.slice(0, verseStart);
  let section = content.slice(verseStart, verseEnd);
  const after = content.slice(verseEnd);
  const headingMatch = section.match(new RegExp(`^${escapeRegex(heading)}\\s*$`, 'm'));
  if (!headingMatch) return content;

  const bodyStart = headingMatch.index + headingMatch[0].length;
  const rest = section.slice(bodyStart);
  const nextBlockIndex = rest.search(/\r?\n\r?\n(?:#### |\*\*|---|<!--|### |## )/);
  const bodyEnd = nextBlockIndex === -1 ? section.length : bodyStart + nextBlockIndex;
  section = `${section.slice(0, bodyStart)}\n${text}${section.slice(bodyEnd)}`;

  return `${before}${section}${after}`;
}

function extractVerses(content) {
  const verseSection = extractSection(content, '## Verses') || content;
  const verseRegex = /^###\s+(Numbers\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+Numbers\s+\d+:\d+\s*$|(?![\s\S]))/gm;
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
