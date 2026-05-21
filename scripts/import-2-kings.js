#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const { polishKidReadableText } = require('./lib/kids-bible-style')

const BOOK = '2 Kings'
const BOOK_SLUG = '2-kings'
const SOURCE_BASE = 'https://www.canonapi.com/v1/2kings'
const EXPECTED_VERSE_COUNTS = [
  18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25,
  29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30,
]

const STORY_REVISIONS = {
  '2 Kings 1:2': {
    all: `Ahaziah fell through the lattice window in his upstairs room in Samaria and became sick. He sent messengers, saying, "Go ask Baal Zebub, the god of Ekron, whether I will recover from this sickness."`,
  },
  '2 Kings 1:3': {
    all: `But the Lord's angel said to Elijah the Tishbite, "Get up and go meet the messengers of the king of Samaria. Say to them, 'Is there no God in Israel, that you are going to ask Baal Zebub, the god of Ekron?'`,
  },
  '2 Kings 1:4': {
    all: `Now the Lord says, "You will not come down from the bed where you have gone up. You will surely die." Then Elijah went away.`,
  },
  '2 Kings 1:8': {
    all: `They answered, "He was a hairy man, wearing a leather belt around his waist." The king said, "It is Elijah the Tishbite."`,
  },
  '2 Kings 1:15': {
    all: `The Lord's angel said to Elijah, "Go down with him. Do not be afraid of him." So Elijah got up and went down with him to the king.`,
  },
  '2 Kings 1:17': {
    all: `So Ahaziah died according to the Lord's word that Elijah had spoken. Because Ahaziah had no son, Jehoram ruled in his place.`,
  },
  '2 Kings 2:1': {
    all: `When the Lord was about to take Elijah up into heaven by a whirlwind, Elijah and Elisha were walking together from Gilgal.`,
  },
  '2 Kings 2:2': {
    all: `Elijah said to Elisha, "Please stay here, for the Lord has sent me as far as Bethel." Elisha said, "As the Lord lives, and as you live, I will not leave you." So they went down to Bethel.`,
  },
  '2 Kings 2:3': {
    all: `The company of prophets at Bethel came out to Elisha and said, "Do you know that the Lord will take your master away from you today?" Elisha said, "Yes, I know. Be quiet."`,
  },
  '2 Kings 2:8': {
    all: `Elijah took his cloak, rolled it up, and struck the water. The water divided to the right and to the left, and the two men crossed on dry ground.`,
  },
  '2 Kings 2:9': {
    all: `When they had crossed over, Elijah said to Elisha, "Ask what I should do for you before I am taken from you." Elisha said, "Please let me receive a double portion of your spirit."`,
  },
  '2 Kings 2:11': {
    all: `As they walked and talked, look, a chariot of fire and horses of fire came between them. Elijah went up by a whirlwind into heaven.`,
  },
  '2 Kings 2:12': {
    all: `Elisha saw it and cried, "My father, my father! The chariots of Israel and its horsemen!" Then he saw Elijah no more. Elisha took hold of his own clothes and tore them in two in grief.`,
  },
  '2 Kings 2:14': {
    all: `Elisha took Elijah's cloak that had fallen from him and struck the water. He said, "Where is the Lord, the God of Elijah?" When he struck the water, it divided to the right and to the left, and Elisha crossed over.`,
  },
  '2 Kings 2:21': {
    all: `Elisha went out to the spring and threw salt into it. He said, "The Lord says, 'I have healed this water. From now on it will not bring death or make the land unable to grow food.'"`,
  },
  '2 Kings 2:23': {
    all: `Elisha went up from there to Bethel. As he went along the road, some boys came out of the city and mocked him, saying, "Go up, bald head! Go up, bald head!"`,
  },
  '2 Kings 2:24': {
    all: `Elisha turned around, looked at them, and pronounced the Lord's curse on them. Then two female bears came out of the woods and attacked forty-two of the boys.`,
  },
  '2 Kings 3:2': {
    all: `Jehoram did what was evil in the Lord's sight, but not in the same way as his father and mother, because he removed the pillar of Baal his father had made.`,
  },
  '2 Kings 3:3': {
    all: `Still, he clung to the sins of Jeroboam son of Nebat, the sins that had led Israel into sin. He did not turn away from them.`,
  },
  '2 Kings 3:9': {
    all: `So the king of Israel, the king of Judah, and the king of Edom set out. After they marched around for seven days, there was no water for the army or for the animals following them.`,
  },
  '2 Kings 3:16': {
    all: `Elisha said, "The Lord says, 'Make this valley full of ditches.'`,
  },
  '2 Kings 3:17': {
    all: `For the Lord says, 'You will not see wind, and you will not see rain, but this valley will be filled with water. You, your cattle, and your animals will drink.'`,
  },
  '2 Kings 3:20': {
    all: `In the morning, about the time of the offering, look, water came from the direction of Edom, and the land was filled with water.`,
  },
  '2 Kings 3:27': {
    all: `Then the king of Moab took his firstborn son, who would have ruled after him, and offered him as a burnt offering on the wall. Great anger came against Israel, so they left him and returned to their own land.`,
  },
  '2 Kings 4:1': {
    all: `A widow from the company of prophets cried out to Elisha, saying, "Your servant my husband is dead. You know that he feared the Lord. Now the man we owe money to has come to take my two children as slaves."`,
  },
  '2 Kings 4:2': {
    all: `Elisha said to her, "What should I do for you? Tell me, what do you have in the house?" She said, "Your servant has nothing in the house except a jar of oil."`,
  },
  '2 Kings 4:3': {
    all: `Then Elisha said, "Go borrow empty jars from all your neighbors. Do not borrow just a few jars.`,
  },
  '2 Kings 4:6': {
    all: `When the jars were full, she said to her son, "Bring me another jar." He said, "There is not another jar." Then the oil stopped flowing.`,
  },
  '2 Kings 4:7': {
    all: `She came and told the man of God. He said, "Go sell the oil and pay what you owe. Then you and your sons can live on the rest."`,
  },
  '2 Kings 4:8': {
    all: `One day Elisha went to Shunem. A respected woman lived there, and she urged him to eat bread. After that, whenever he passed by, he stopped there to eat.`,
  },
  '2 Kings 4:9': {
    all: `She said to her husband, "Look, I can see that this man who often passes by us is a holy man of God."`,
  },
  '2 Kings 4:10': {
    all: `Please let us make a small room on the roof for him, with a bed, table, chair, and lamp. Then when he comes to us, he can stay there."`,
  },
  '2 Kings 4:16': {
    all: `Elisha said, "About this time next year, you will hold a son in your arms." She said, "No, my lord, man of God, do not lie to your servant."`,
  },
  '2 Kings 4:20': {
    all: `The servant carried the boy to his mother. The boy sat on her lap until noon, and then he died.`,
  },
  '2 Kings 4:26': {
    all: `Elisha said, "Run now to meet her and ask, 'Is it well with you? Is it well with your husband? Is it well with the child?'" She answered, "It is well."`,
  },
  '2 Kings 4:32': {
    all: `When Elisha came into the house, look, the child was dead, lying on Elisha's bed.`,
  },
  '2 Kings 4:33': {
    all: `Elisha went in, shut the door behind the two of them, and prayed to the Lord.`,
  },
  '2 Kings 4:35': {
    all: `Then Elisha walked back and forth in the house, went up again, and stretched himself over the child. The boy sneezed seven times, and then he opened his eyes.`,
  },
  '2 Kings 4:41': {
    all: `Elisha said, "Bring flour." He threw it into the pot and said, "Serve it to the people so they may eat." Then there was nothing harmful in the pot.`,
  },
  '2 Kings 4:44': {
    all: `So the servant set the food before them. They ate, and some was left over, according to the Lord's word.`,
  },
  '2 Kings 5:1': {
    all: `Naaman was commander of the army of the king of Syria. He was an important and honored man, because the Lord had given victory to Syria through him. He was a brave soldier, but he had a serious skin disease.`,
  },
  '2 Kings 5:2': {
    all: `Syrian raiding bands had gone out and had carried away a little girl from the land of Israel. She served Naaman's wife.`,
  },
  '2 Kings 5:3': {
    all: `The girl said to her mistress, "I wish my lord were with the prophet in Samaria. Then the prophet would heal him from his skin disease."`,
  },
  '2 Kings 5:7': {
    all: `When the king of Israel read the letter, he tore his clothes and said, "Am I God, to kill and make alive? Why does this man send someone to me to heal him from his skin disease? See how he is trying to start a quarrel with me."`,
  },
  '2 Kings 5:10': {
    all: `Elisha sent a messenger to Naaman, saying, "Go wash in the Jordan seven times. Then your flesh will be restored, and you will be clean."`,
  },
  '2 Kings 5:13': {
    all: `Naaman's servants came near and said, "My father, if the prophet had told you to do some great thing, would you not have done it? How much more, then, when he says to you, 'Wash and be clean'?"`,
  },
  '2 Kings 5:14': {
    all: `So Naaman went down and dipped himself seven times in the Jordan, according to the word of the man of God. His flesh became like the flesh of a little child, and he was clean.`,
  },
  '2 Kings 5:15': {
    all: `Then Naaman and all his company returned to the man of God. Naaman stood before him and said, "Now I know there is no God in all the earth except in Israel. Please accept a gift from your servant."`,
  },
  '2 Kings 5:27': {
    all: `Elisha said, "Therefore Naaman's skin disease will cling to you and to your descendants forever." Gehazi went out from Elisha's presence with the disease, his skin white like snow.`,
  },
  '2 Kings 6:5': {
    all: `As one man was cutting down a tree, the iron ax head fell into the water. He cried out, "Oh no, my master! It was borrowed!"`,
  },
  '2 Kings 6:6': {
    all: `The man of God asked, "Where did it fall?" The man showed him the place. Elisha cut a stick, threw it there, and made the iron float.`,
  },
  '2 Kings 6:16': {
    all: `Elisha answered, "Do not be afraid, for those who are with us are more than those who are with them."`,
  },
  '2 Kings 6:17': {
    all: `Elisha prayed, "Lord, please open his eyes so he may see." The Lord opened the young man's eyes, and he saw the mountain full of horses and chariots of fire all around Elisha.`,
  },
  '2 Kings 6:20': {
    all: `When they came into Samaria, Elisha said, "Lord, open these men's eyes so they may see." The Lord opened their eyes, and they saw that they were inside Samaria.`,
  },
  '2 Kings 6:25': {
    all: `There was a terrible famine in Samaria. Food became so scarce that even a donkey's head and a small amount of dove droppings sold for high prices.`,
  },
  '2 Kings 6:28': {
    all: `The king said to her, "What is troubling you?" She answered, "This woman said to me, 'Give your son so we may eat him today, and tomorrow we will eat my son.'`,
  },
  '2 Kings 6:29': {
    all: `So we boiled my son and ate him. The next day I said to her, 'Give your son so we may eat him,' but she hid her son."`,
  },
  '2 Kings 6:30': {
    all: `When the king heard the woman's words, he tore his clothes in grief. As he passed by on the wall, the people saw that he was wearing rough cloth underneath.`,
  },
  '2 Kings 7:1': {
    all: `Elisha said, "Hear the Lord's word. The Lord says, 'Tomorrow about this time, fine flour and barley will be sold cheaply at the gate of Samaria.'"`,
  },
  '2 Kings 7:2': {
    all: `The captain whose hand the king leaned on answered the man of God, "Look, even if the Lord made windows in heaven, could this happen?" Elisha said, "You will see it with your eyes, but you will not eat any of it."`,
  },
  '2 Kings 7:3': {
    all: `Four men with serious skin disease were at the entrance of the city gate. They said to one another, "Why should we sit here until we die?`,
  },
  '2 Kings 7:5': {
    all: `At twilight they got up to go to the Syrian camp. When they reached the edge of the camp, look, no one was there.`,
  },
  '2 Kings 7:6': {
    all: `The Lord had made the Syrian army hear the sound of chariots, horses, and a great army. They said to one another, "The king of Israel has hired the kings of the Hittites and Egyptians to attack us!"`,
  },
  '2 Kings 7:9': {
    all: `Then the men said to one another, "We are not doing right. Today is a day of good news, and we are keeping silent. If we wait until morning, punishment may come on us. Come, let us go tell the king's household."`,
  },
  '2 Kings 7:16': {
    all: `Then the people went out and plundered the Syrian camp. So fine flour and barley were sold cheaply, according to the Lord's word.`,
  },
  '2 Kings 8:1': {
    all: `Elisha had spoken to the woman whose son he had restored to life. He said, "Get up and go with your household. Stay wherever you can, because the Lord has called for a famine, and it will come on the land for seven years."`,
  },
  '2 Kings 8:5': {
    all: `As Gehazi was telling the king how Elisha had restored the dead child to life, look, the woman whose son Elisha had restored came to ask the king for her house and land.`,
  },
  '2 Kings 8:11': {
    all: `Elisha stared at Hazael until Hazael felt ashamed. Then the man of God wept.`,
  },
  '2 Kings 8:12': {
    all: `Hazael said, "Why is my lord weeping?" Elisha answered, "Because I know the harm you will do to the people of Israel. You will burn their strong places, kill young men, harm little ones, and hurt mothers and unborn babies."`,
  },
  '2 Kings 8:15': {
    all: `The next day, Hazael took a thick cloth, dipped it in water, and spread it over the king's face, so the king died. Then Hazael ruled in his place.`,
  },
  '2 Kings 9:3': {
    all: `Take the flask of oil, pour it on his head, and say, "The Lord says, 'I have anointed you king over Israel.'" Then open the door and run. Do not wait."`,
  },
  '2 Kings 9:6': {
    all: `Jehu got up and went into the house. The young prophet poured the oil on Jehu's head and said, "The Lord, the God of Israel, says, 'I have anointed you king over the Lord's people, over Israel.'`,
  },
  '2 Kings 9:13': {
    all: `Then each man quickly took his cloak and spread it under Jehu on the bare steps. They blew the trumpet and said, "Jehu is king!"`,
  },
  '2 Kings 9:24': {
    all: `Jehu drew his bow with full strength and struck Joram between the shoulders. The arrow went through his heart, and he sank down in his chariot.`,
  },
  '2 Kings 9:33': {
    all: `Jehu said, "Throw her down!" So they threw Jezebel down. Some of her blood splashed on the wall and on the horses, and Jehu trampled her underfoot.`,
  },
  '2 Kings 10:6': {
    all: `Then Jehu wrote them a second letter, saying, "If you are on my side and will listen to my voice, bring the heads of your master's sons to me in Jezreel by this time tomorrow." Now the king's sons, seventy boys, were with the great men who were raising them.`,
  },
  '2 Kings 10:7': {
    all: `When the letter came to them, they killed the king's sons, seventy boys. They put their heads in baskets and sent them to Jehu at Jezreel.`,
  },
  '2 Kings 10:10': {
    all: `Know then that not one word of the Lord's word against Ahab's house will fall to the ground. The Lord has done what he spoke by his servant Elijah."`,
  },
  '2 Kings 10:28': {
    all: `So Jehu destroyed Baal worship out of Israel.`,
  },
  '2 Kings 10:29': {
    all: `But Jehu did not turn away from the sins of Jeroboam son of Nebat, the sins that led Israel into sin: the golden calves at Bethel and Dan.`,
  },
  '2 Kings 10:31': {
    all: `But Jehu was not careful to walk in the law of the Lord, the God of Israel, with all his heart. He did not turn away from the sins of Jeroboam, who had led Israel into sin.`,
  },
  '2 Kings 11:1': {
    all: `When Athaliah, Ahaziah's mother, saw that her son was dead, she rose up and destroyed the royal family.`,
  },
  '2 Kings 11:2': {
    all: `But Jehosheba, daughter of King Joram and sister of Ahaziah, took Joash son of Ahaziah and rescued him from among the king's sons who were being killed. She hid him and his nurse in a bedroom, away from Athaliah, so he was not killed.`,
  },
  '2 Kings 11:12': {
    all: `Jehoiada brought out the king's son, put the crown on him, and gave him the covenant scroll. They made him king and anointed him. They clapped their hands and said, "Long live the king!"`,
  },
  '2 Kings 11:17': {
    all: `Jehoiada made a covenant between the Lord, the king, and the people, that they should be the Lord's people. He also made a covenant between the king and the people.`,
  },
  '2 Kings 11:18': {
    all: `All the people of the land went to Baal's house and broke it down. They broke his altars and images completely and killed Mattan the priest of Baal before the altars. Then the priest set guards over the Lord's house.`,
  },
  '2 Kings 12:2': {
    all: `Jehoash did what was right in the Lord's eyes all the days that Jehoiada the priest taught him.`,
  },
  '2 Kings 12:4': {
    all: `Jehoash said to the priests, "Take all the money brought as holy gifts into the Lord's house, the money each person is counted for, the money each person promises, and all the money anyone's heart moves him to bring."`,
  },
  '2 Kings 12:15': {
    all: `They did not require an accounting from the men who received the money to pay the workers, because they dealt faithfully.`,
  },
  '2 Kings 12:18': {
    all: `Jehoash king of Judah took all the holy gifts that his fathers Jehoshaphat, Jehoram, and Ahaziah, kings of Judah, had set apart, and all his own holy gifts, and all the gold found in the treasuries of the Lord's house and the king's house. He sent them to Hazael king of Syria, and Hazael left Jerusalem.`,
  },
  '2 Kings 13:3': {
    all: `The Lord's anger burned against Israel, and for a long time he gave them into the power of Hazael king of Syria and Benhadad son of Hazael.`,
  },
  '2 Kings 13:4': {
    all: `Jehoahaz begged the Lord, and the Lord listened to him, because he saw Israel's suffering and how the king of Syria oppressed them.`,
  },
  '2 Kings 13:5': {
    all: `The Lord gave Israel a rescuer, so they escaped from the hand of the Syrians. The people of Israel lived in their homes as before.`,
  },
  '2 Kings 13:14': {
    all: `Now Elisha became sick with the sickness from which he would die. Jehoash king of Israel came down to him, wept over him, and said, "My father, my father! The chariots of Israel and its horsemen!"`,
  },
  '2 Kings 13:17': {
    all: `Elisha said, "Open the window toward the east." He opened it. Then Elisha said, "Shoot!" He shot. Elisha said, "The Lord's arrow of victory, the arrow of victory over Syria! You will strike Syria at Aphek until you finish them."`,
  },
  '2 Kings 13:21': {
    all: `As some men were burying a man, they saw a raiding band. They threw the man's body into Elisha's tomb. When the man touched Elisha's bones, he came back to life and stood on his feet.`,
  },
  '2 Kings 13:23': {
    all: `But the Lord was gracious to them, had compassion on them, and turned toward them because of his covenant with Abraham, Isaac, and Jacob. He would not destroy them or cast them from his presence yet.`,
  },
  '2 Kings 14:3': {
    all: `Amaziah did what was right in the Lord's eyes, yet not like David his father. He did everything Joash his father had done.`,
  },
  '2 Kings 14:6': {
    all: `But he did not put the children of the murderers to death, because of what is written in the book of the law of Moses: "Fathers must not be put to death for children, and children must not be put to death for fathers. Each one must die for his own sin."`,
  },
  '2 Kings 14:26': {
    all: `The Lord saw that Israel's suffering was very bitter. There was no one left to help, whether slave or free.`,
  },
  '2 Kings 14:27': {
    all: `The Lord had not said he would wipe away Israel's name from under heaven, so he saved them by the hand of Jeroboam son of Joash.`,
  },
  '2 Kings 15:3': {
    all: `Azariah did what was right in the Lord's eyes, according to all that Amaziah his father had done.`,
  },
  '2 Kings 15:5': {
    all: `The Lord struck the king, so he had a serious skin disease until the day he died. He lived in a separate house, while Jotham the king's son was over the palace and judged the people of the land.`,
  },
  '2 Kings 15:19': {
    all: `Pul king of Assyria came against the land, so Menahem gave him one thousand large weights of silver to gain his support and make his kingdom stronger.`,
  },
  '2 Kings 15:20': {
    all: `Menahem collected the silver from Israel's wealthy men, fifty silver pieces from each man, to give it to Assyria's king. Then Assyria's king turned back and did not stay in the land.`,
  },
  '2 Kings 15:29': {
    all: `In the days of Pekah king of Israel, Tiglath Pileser king of Assyria came and captured many cities and regions of Israel. He carried the people away to Assyria.`,
  },
  '2 Kings 16:2': {
    all: `Ahaz was twenty years old when he began to rule, and he ruled sixteen years in Jerusalem. He did not do what was right in the Lord's eyes, as David his father had done.`,
  },
  '2 Kings 16:3': {
    all: `Instead, he walked in the ways of the kings of Israel. He even burned his son as an offering, following the detestable practices of the nations the Lord had driven out before the people of Israel.`,
  },
  '2 Kings 16:10': {
    all: `King Ahaz went to Damascus to meet Tiglath Pileser king of Assyria. He saw the altar in Damascus and sent Uriah the priest a pattern and plan for the altar, showing exactly how it was made.`,
  },
  '2 Kings 16:18': {
    all: `Because of the king of Assyria, Ahaz removed the covered Sabbath entry and the king's outside entrance from the Lord's house.`,
  },
  '2 Kings 17:5': {
    all: `Then the king of Assyria came through the whole land, went up to Samaria, and surrounded it for three years.`,
  },
  '2 Kings 17:6': {
    all: `In Hoshea's ninth year, the king of Assyria captured Samaria. He carried Israel away to Assyria and settled them in Halah, by the Habor River of Gozan, and in the cities of the Medes.`,
  },
  '2 Kings 17:7': {
    all: `This happened because the people of Israel had sinned against the Lord their God, who had brought them up out of Egypt from under Pharaoh king of Egypt. They had feared other gods`,
  },
  '2 Kings 17:13': {
    all: `Yet the Lord warned Israel and Judah by every prophet and every seer, saying, "Turn from your evil ways. Keep my commands and laws, according to all the law I commanded your fathers and sent to you by my servants the prophets."`,
  },
  '2 Kings 17:18': {
    all: `Therefore the Lord was very angry with Israel and removed them from his sight. No one was left except the tribe of Judah only.`,
  },
  '2 Kings 17:23': {
    all: `At last the Lord removed Israel from his sight, as he had spoken by all his servants the prophets. So Israel was carried away from its own land to Assyria, where they remained.`,
  },
  '2 Kings 17:33': {
    all: `So they feared the Lord, but they also served their own gods, following the customs of the nations from which they had been carried away.`,
  },
  '2 Kings 18:3': {
    all: `Hezekiah did what was right in the Lord's eyes, according to all that David his father had done.`,
  },
  '2 Kings 18:4': {
    all: `He removed the worship places on hills, broke the stone pillars, and cut down the Asherah idol. He also broke in pieces the bronze serpent Moses had made, because the people of Israel had been burning incense to it. He called it Nehushtan.`,
  },
  '2 Kings 18:5': {
    all: `Hezekiah trusted in the Lord, the God of Israel. After him there was no king like him among all the kings of Judah, nor among the kings before him.`,
  },
  '2 Kings 18:6': {
    all: `He held fast to the Lord. He did not turn away from following him, but kept the commands the Lord had given Moses.`,
  },
  '2 Kings 18:30': {
    all: `Do not let Hezekiah make you trust in the Lord by saying, "The Lord will surely deliver us, and this city will not be given into the hand of the king of Assyria."`,
  },
  '2 Kings 18:36': {
    all: `But the people stayed silent and did not answer him a word, because the king had commanded, "Do not answer him."`,
  },
  '2 Kings 19:1': {
    all: `When King Hezekiah heard it, he tore his clothes, covered himself with rough cloth, and went into the Lord's house.`,
  },
  '2 Kings 19:6': {
    all: `Isaiah said to them, "Tell your master this: the Lord says, 'Do not be afraid of the words you have heard, the words with which the servants of the king of Assyria have insulted me.'`,
  },
  '2 Kings 19:14': {
    all: `Hezekiah received the letter from the messengers and read it. Then he went up to the Lord's house and spread it out before the Lord.`,
  },
  '2 Kings 19:15': {
    all: `Hezekiah prayed before the Lord and said, "Lord, God of Israel, who sits enthroned above the cherubim, you alone are God over all the kingdoms of the earth. You made heaven and earth.`,
  },
  '2 Kings 19:19': {
    all: `Now, Lord our God, please save us from his hand, so all the kingdoms of the earth may know that you, Lord, are God alone."`,
  },
  '2 Kings 19:32': {
    all: `Therefore the Lord says about the king of Assyria, "He will not come into this city, shoot an arrow there, come before it with a shield, or build a siege ramp against it.`,
  },
  '2 Kings 19:35': {
    all: `That night, the Lord's angel went out and struck one hundred eighty-five thousand in the Assyrian camp. When people got up early in the morning, look, they were all dead bodies.`,
  },
  '2 Kings 20:1': {
    all: `In those days Hezekiah became sick and was near death. Isaiah the prophet, son of Amoz, came to him and said, "The Lord says, 'Set your house in order, because you will die and not live.'"`,
  },
  '2 Kings 20:3': {
    all: `Hezekiah said, "Please remember, Lord, how I have walked before you in truth and with a whole heart, and have done what is good in your sight." Then Hezekiah wept bitterly.`,
  },
  '2 Kings 20:5': {
    all: `"Turn back and tell Hezekiah, the leader of my people, 'The Lord, the God of David your father, says: I have heard your prayer. I have seen your tears. Look, I will heal you. On the third day, you will go up to the Lord's house.`,
  },
  '2 Kings 20:11': {
    all: `Isaiah the prophet cried to the Lord, and the Lord made the shadow go back ten steps on the stairway of Ahaz.`,
  },
  '2 Kings 20:17': {
    all: `Look, days are coming when everything in your house, and everything your fathers have stored up until this day, will be carried to Babylon. Nothing will be left, says the Lord.`,
  },
  '2 Kings 21:2': {
    all: `Manasseh did what was evil in the Lord's sight, following the detestable practices of the nations the Lord had driven out before the people of Israel.`,
  },
  '2 Kings 21:3': {
    all: `He rebuilt the worship places on hills that Hezekiah his father had destroyed. He set up altars for Baal and made an Asherah idol, as Ahab king of Israel had done. He worshiped and served all the army of the sky.`,
  },
  '2 Kings 21:6': {
    all: `He burned his son as an offering, practiced sorcery, used forbidden signs, and dealt with people who tried to speak with spirits and with magic workers. He did much evil in the Lord's sight, making the Lord angry.`,
  },
  '2 Kings 21:12': {
    all: `therefore the Lord, the God of Israel, says, "Look, I am bringing disaster on Jerusalem and Judah. Everyone who hears about it will have tingling ears.`,
  },
  '2 Kings 21:16': {
    all: `Manasseh also shed much innocent blood, until he had filled Jerusalem from one end to the other, besides the sin he made Judah commit by doing what was evil in the Lord's sight.`,
  },
  '2 Kings 22:1': {
    all: `Josiah was eight years old when he began to rule, and he ruled thirty-one years in Jerusalem. His mother's name was Jedidah daughter of Adaiah of Bozkath.`,
  },
  '2 Kings 22:2': {
    all: `Josiah did what was right in the Lord's eyes. He walked in all the way of David his father and did not turn aside to the right or to the left.`,
  },
  '2 Kings 22:8': {
    all: `Hilkiah the high priest said to Shaphan the scribe, "I have found the book of the law in the Lord's house." Hilkiah gave the book to Shaphan, and Shaphan read it.`,
  },
  '2 Kings 22:11': {
    all: `When the king heard the words of the book of the law, he tore his clothes in grief.`,
  },
  '2 Kings 22:13': {
    all: `"Go ask the Lord for me, for the people, and for all Judah about the words of this book that has been found. The Lord's great anger burns against us because our fathers have not listened to the words of this book or done all that is written for us."`,
  },
  '2 Kings 23:2': {
    all: `The king went up to the Lord's house with all the men of Judah, all the people of Jerusalem, the priests, the prophets, and all the people, small and great. He read in their hearing all the words of the book of the covenant found in the Lord's house.`,
  },
  '2 Kings 23:3': {
    all: `The king stood by the pillar and made a covenant before the Lord, to walk after the Lord and keep his commands, covenant teachings, and laws with all his heart and all his soul. He promised to keep the words of this covenant written in the book, and all the people joined the covenant.`,
  },
  '2 Kings 23:4': {
    all: `The king commanded Hilkiah the high priest, the priests of the second order, and the doorway keepers to bring out of the Lord's temple all the objects made for Baal, the Asherah idol, and all the army of the sky. He burned them outside Jerusalem in the fields of the Kidron and carried their ashes to Bethel.`,
  },
  '2 Kings 23:7': {
    all: `He broke down the houses in the Lord's house where men and women had done sexual sin in idol worship and where women had woven hangings for the Asherah idol.`,
  },
  '2 Kings 23:10': {
    all: `Josiah made Topheth in the Valley of the Sons of Hinnom unfit for worship, so no one could burn a son or daughter there as an offering to Molech.`,
  },
  '2 Kings 23:21': {
    all: `The king commanded all the people, "Keep the Passover to the Lord your God, as it is written in this book of the covenant."`,
  },
  '2 Kings 23:25': {
    all: `Before Josiah there was no king like him, who turned to the Lord with all his heart, all his soul, and all his strength, according to all the law of Moses. After him, no one like him arose.`,
  },
  '2 Kings 23:26': {
    all: `Still, the Lord did not turn away from his great burning anger against Judah, because of all the ways Manasseh had made him angry.`,
  },
  '2 Kings 24:2': {
    all: `The Lord sent bands of Chaldeans, Syrians, Moabites, and Ammonites against Judah to destroy it, according to the Lord's word that he had spoken by his servants the prophets.`,
  },
  '2 Kings 24:3': {
    all: `Surely this came on Judah at the Lord's command, to remove them from his sight because of Manasseh's sins and all he had done,`,
  },
  '2 Kings 24:12': {
    all: `Jehoiachin king of Judah went out to the king of Babylon, he, his mother, his servants, his leaders, and his officials. The king of Babylon took him captive in the eighth year of his rule.`,
  },
  '2 Kings 24:14': {
    all: `The king of Babylon carried away all Jerusalem, all the leaders, all the mighty soldiers, ten thousand captives, and all the craftsmen and smiths. No one remained except the poorest people of the land.`,
  },
  '2 Kings 24:17': {
    all: `The king of Babylon made Mattaniah, Jehoiachin's uncle, king in his place and changed his name to Zedekiah.`,
  },
  '2 Kings 25:1': {
    all: `In the ninth year of Zedekiah's rule, in the tenth month, on the tenth day of the month, Nebuchadnezzar king of Babylon came with all his army against Jerusalem. They camped around it and built siege works all around it.`,
  },
  '2 Kings 25:3': {
    all: `By the ninth day of the fourth month, the famine was severe in the city. There was no bread for the people of the land.`,
  },
  '2 Kings 25:4': {
    all: `Then a gap was broken in the city wall. All the soldiers ran away by night through the gate between the two walls near the king's garden, while the Chaldeans were all around the city. The king went toward the Arabah.`,
  },
  '2 Kings 25:7': {
    all: `They killed Zedekiah's sons before his eyes. Then they put out Zedekiah's eyes, bound him with bronze chains, and carried him to Babylon.`,
  },
  '2 Kings 25:9': {
    all: `Nebuzaradan burned the Lord's house, the king's house, and all the houses of Jerusalem. He burned every great house with fire.`,
  },
  '2 Kings 25:21': {
    all: `The king of Babylon struck them down and put them to death at Riblah in the land of Hamath. So Judah was carried away captive out of its land.`,
  },
  '2 Kings 25:27': {
    all: `In the thirty-seventh year after Jehoiachin king of Judah was carried away, Evil Merodach king of Babylon showed kindness to Jehoiachin. In the twelfth month, on the twenty-seventh day, he lifted him out of prison.`,
  },
  '2 Kings 25:30': {
    all: `Jehoiachin was given food from the king every day, a regular portion for each day, for all the days of his life.`,
  },
}

const SECOND_PASS_REVISIONS = {
  '2 Kings 1:13': {
    all: `Again the king sent a third commander with fifty men. This commander climbed up, fell on his knees before Elijah, and begged, "Man of God, please spare my life and the lives of these fifty servants.`,
  },
  '2 Kings 1:14': {
    all: `Fire came down from the sky and burned up the first two commanders and their fifty men. But now, please spare my life."`,
  },
  '2 Kings 3:10': {
    all: `The king of Israel cried, "Oh no! Has the Lord brought these three kings together to hand them over to Moab?"`,
  },
  '2 Kings 5:20': {
    all: `But Gehazi, the servant of Elisha the man of God, said, "My master has spared Naaman the Syrian by not taking what he brought. As the Lord lives, I will run after him and get something from him."`,
  },
  '2 Kings 6:8': {
    all: `Now the king of Syria was at war with Israel. He talked with his servants and said, "I will set up my camp in such and such a place."`,
  },
  '2 Kings 6:9': {
    all: `But Elisha, the man of God, sent word to Israel's king: "Be careful. Do not pass by that place, because the Syrians are coming down there."`,
  },
  '2 Kings 6:10': {
    all: `So Israel's king sent men to the place Elisha warned him about. Again and again, Elisha's warning kept the king safe.`,
  },
  '2 Kings 6:11': {
    all: `The king of Syria was deeply troubled. He called his servants and asked, "Which one of us is helping the king of Israel?"`,
  },
  '2 Kings 6:12': {
    all: `One servant answered, "No one here, my king. Elisha the prophet in Israel tells Israel's king even the words you speak in your bedroom."`,
  },
  '2 Kings 6:15': {
    all: `Early the next morning, Elisha's servant went outside and saw an army with horses and chariots all around the city. He cried, "Oh no, my master! What will we do?"`,
  },
  '2 Kings 6:18': {
    all: `As the Syrian soldiers came down toward Elisha, he prayed to the Lord, "Please strike these people with blindness." The Lord struck them with blindness, just as Elisha asked.`,
  },
  '2 Kings 6:21': {
    all: `When Israel's king saw them inside Samaria, he said to Elisha, "My father, should I strike them down? Should I strike them down?"`,
  },
  '2 Kings 6:22': {
    all: `Elisha answered, "No. You would not strike down prisoners you captured with your sword and bow. Set bread and water before them, so they may eat, drink, and go back to their master."`,
  },
  '2 Kings 6:24': {
    all: `After this, Benhadad king of Syria gathered his whole army, went up, and surrounded Samaria.`,
  },
  '2 Kings 6:27': {
    all: `The king answered, "If the Lord does not help you, where could I get help for you? From the threshing floor? From the winepress?"`,
  },
  '2 Kings 6:31': {
    all: `Then the king said, "May God punish me severely if Elisha son of Shaphat still has his head by the end of today."`,
  },
  '2 Kings 6:32': {
    all: `Elisha was sitting in his house with the elders. Before the king's messenger arrived, Elisha said, "Do you see how this son of a murderer has sent someone to take my head? When the messenger comes, shut the door and hold it shut. Listen, his master's footsteps are right behind him."`,
  },
  '2 Kings 6:33': {
    all: `While Elisha was still speaking, the messenger came down to him. Then the king said, "Look, this trouble is from the Lord. Why should I wait for the Lord any longer?"`,
  },
  '2 Kings 7:4': {
    all: `If we go into the city, the famine is there, and we will die. If we sit here, we will die too. So come, let us surrender to the Syrian army. If they spare us, we will live. If they kill us, we will only die."`,
  },
  '2 Kings 7:12': {
    all: `The king got up in the night and said to his servants, "I will tell you what the Syrians have done. They know we are hungry, so they have left the camp to hide in the field. They are saying, 'When Israel comes out of the city, we will capture them alive and enter the city.'"`,
  },
  '2 Kings 7:13': {
    all: `One servant answered, "Please let some men take five of the horses that are still left in the city. The people and animals left here are already near death. Let us send them and see."`,
  },
  '2 Kings 7:15': {
    all: `They followed the trail as far as the Jordan. The whole road was full of clothes and equipment the Syrians had thrown away as they hurried away. The messengers returned and told the king.`,
  },
  '2 Kings 11:4': {
    all: `In the seventh year, Jehoiada sent for the commanders over hundreds, the Carites, and the guards. He brought them into the Lord's house, made a covenant with them there, and showed them the king's son.`,
  },
  '2 Kings 11:5': {
    all: `He commanded them, "This is what you must do. One third of you who come in on the Sabbath must guard the king's house.`,
  },
  '2 Kings 11:6': {
    all: `One third must guard the Sur Gate, and one third must guard the gate behind the guards. You must guard the house and stand like a wall around it.`,
  },
  '2 Kings 11:7': {
    all: `The two groups who go off duty on the Sabbath must guard the Lord's house around the king.`,
  },
  '2 Kings 11:8': {
    all: `Stand around the king, each man with his weapon in his hand. Anyone who comes through the ranks must be killed. Stay with the king when he goes out and when he comes in."`,
  },
  '2 Kings 11:9': {
    all: `The commanders over hundreds did everything Jehoiada the priest commanded. Each commander brought his men, both those coming on duty and those going off duty on the Sabbath, and came to Jehoiada.`,
  },
  '2 Kings 11:10': {
    all: `The priest gave the commanders the spears and shields that had belonged to King David and had been kept in the Lord's house.`,
  },
  '2 Kings 11:11': {
    all: `The guards stood with weapons in their hands, from the right side of the house to the left side, near the altar and the house, all around the king.`,
  },
  '2 Kings 11:13': {
    all: `When Athaliah heard the noise of the guards and the people, she came to the people at the Lord's house.`,
  },
  '2 Kings 11:14': {
    all: `She looked and saw the king standing by the pillar, as kings usually did. Commanders and trumpet players stood beside him, and all the people of the land rejoiced and blew trumpets. Athaliah tore her clothes and cried, "Treason! Treason!"`,
  },
  '2 Kings 11:15': {
    all: `Jehoiada the priest commanded the commanders over hundreds, who led the army, "Bring her out between the ranks. Kill anyone who follows her with the sword." The priest had said, "Do not let her be killed in the Lord's house."`,
  },
  '2 Kings 11:16': {
    all: `So they opened a way for her. She went by the horses' entrance to the king's house, and she was killed there.`,
  },
  '2 Kings 11:19': {
    all: `Then Jehoiada took the commanders over hundreds, the Carites, the guards, and all the people of the land. They brought the king down from the Lord's house, went through the guards' gate to the king's house, and Joash sat on the throne of the kings.`,
  },
  '2 Kings 12:13': {
    all: `The money brought into the Lord's house was not used to make silver cups, wick trimmers, bowls, trumpets, or gold and silver containers.`,
  },
  '2 Kings 17:2': {
    all: `Hoshea did what was evil in the Lord's sight, though not as wickedly as the kings of Israel before him.`,
  },
  '2 Kings 17:3': {
    all: `Shalmaneser king of Assyria came against him. Hoshea became his servant and paid him required money each year.`,
  },
  '2 Kings 17:4': {
    all: `But the king of Assyria found that Hoshea had made a secret plan. Hoshea had sent messengers to So king of Egypt and had stopped paying Assyria as he had done before. So the king of Assyria seized Hoshea, bound him, and put him in prison.`,
  },
  '2 Kings 17:7': {
    all: `This happened because the people of Israel had sinned against the Lord their God. He had brought them up out of Egypt and out from under Pharaoh's power, but they honored false gods.`,
  },
  '2 Kings 17:8': {
    all: `They walked in the customs of the nations the Lord had driven out before Israel, and in the sinful ways Israel's kings had made.`,
  },
  '2 Kings 17:9': {
    all: `The people of Israel secretly did things that were not right against the Lord their God. In every city, from small watchtower towns to strong walled cities, they built worship places on hills.`,
  },
  '2 Kings 17:10': {
    all: `They set up stone pillars and Asherah poles for themselves on every high hill and under every green tree.`,
  },
  '2 Kings 17:11': {
    all: `There they burned sweet-smelling incense at all the worship places on hills, just as the nations before them had done. Their wicked actions made the Lord angry.`,
  },
  '2 Kings 17:12': {
    all: `They served idols, even though the Lord had told them, "You must not do this thing."`,
  },
  '2 Kings 17:13': {
    all: `Still, the Lord warned Israel and Judah through every prophet and seer. He said, "Turn away from your evil ways. Keep my commands and laws, the law I commanded your fathers and sent to you by my servants the prophets."`,
  },
  '2 Kings 17:14': {
    all: `But they would not listen. They were stubborn like their fathers, who had not believed in the Lord their God.`,
  },
  '2 Kings 17:15': {
    all: `They rejected the Lord's laws, his covenant with their fathers, and the warnings he had given them. They followed empty false worship, and their lives became empty. They copied the nations around them, even though the Lord had commanded them not to live that way.`,
  },
  '2 Kings 17:16': {
    all: `They abandoned all the commands of the Lord their God. They made two metal calves and an Asherah idol, worshiped the army of the sky, and served Baal.`,
  },
  '2 Kings 17:17': {
    all: `They burned their sons and daughters as offerings, used forbidden ways to tell the future, and sold themselves to do what was evil in the Lord's sight. They made him angry.`,
  },
  '2 Kings 17:18': {
    all: `So the Lord was very angry with Israel and removed them from his sight. Only the tribe of Judah was left.`,
  },
  '2 Kings 17:19': {
    all: `But Judah also did not keep the commands of the Lord their God. They walked in the sinful customs Israel had made.`,
  },
  '2 Kings 17:20': {
    all: `The Lord rejected the people of Israel, let them suffer, and gave them over to raiders until he removed them from his sight.`,
  },
  '2 Kings 17:21': {
    all: `The Lord tore Israel away from David's royal house. The people made Jeroboam son of Nebat king, and Jeroboam pulled Israel away from following the Lord and led them into a great sin.`,
  },
  '2 Kings 17:22': {
    all: `The people of Israel kept walking in all the sins Jeroboam had done. They would not turn away from them.`,
  },
  '2 Kings 17:23': {
    all: `At last the Lord removed Israel from his sight, just as he had spoken through all his servants the prophets. Israel was carried away from its own land to Assyria, where they remained.`,
  },
  '2 Kings 17:24': {
    all: `Then the king of Assyria brought people from Babylon, Cuthah, Avva, Hamath, and Sepharvaim. He settled them in the cities of Samaria in place of the people of Israel. They took Samaria and lived in its cities.`,
  },
  '2 Kings 17:25': {
    all: `When they first lived there, they did not fear the Lord. So the Lord sent lions among them, and some of the people were killed.`,
  },
  '2 Kings 17:26': {
    all: `People told the king of Assyria, "The nations you carried away and placed in Samaria do not know the law of the god of the land. He has sent lions among them, and the lions are killing them because they do not know his law."`,
  },
  '2 Kings 17:27': {
    all: `Then the king of Assyria commanded, "Send back one of the priests you carried away from Samaria. Let him live there and teach them the law of the god of the land."`,
  },
  '2 Kings 17:28': {
    all: `So one of the priests who had been carried away from Samaria came and lived in Bethel. He taught them how they should fear the Lord.`,
  },
  '2 Kings 17:29': {
    all: `But each nation still made its own gods and put them in the houses of the worship places on hills that the Samaritans had made. Each nation did this in the cities where they lived.`,
  },
  '2 Kings 17:32': {
    all: `So the people feared the Lord, but they also chose their own priests for the worship places on hills. Those priests offered sacrifices for them in those houses of worship.`,
  },
  '2 Kings 17:33': {
    all: `They feared the Lord, but they also served their own gods, following the customs of the nations from which they had been carried away.`,
  },
  '2 Kings 17:34': {
    all: `To this day they still do what they did before. They do not truly fear the Lord or follow the laws, rules, teachings, and commands the Lord gave to the descendants of Jacob, whom he named Israel.`,
  },
  '2 Kings 17:35': {
    all: `The Lord had made a covenant with them and commanded, "You must not fear false gods. You must not bow down to them, serve them, or sacrifice to them.`,
  },
  '2 Kings 17:36': {
    all: `Instead, you must fear the Lord, who brought you up out of Egypt with great power and an outstretched arm. Bow down to him and sacrifice to him.`,
  },
  '2 Kings 17:37': {
    all: `You must always be careful to keep the laws, rules, teachings, and commands he wrote for you. You must not fear false gods.`,
  },
  '2 Kings 17:38': {
    all: `You must not forget the covenant I made with you. You must not fear false gods.`,
  },
  '2 Kings 17:39': {
    all: `But you must fear the Lord your God, and he will rescue you from the power of all your enemies."`,
  },
  '2 Kings 17:40': {
    all: `But they would not listen. They kept doing what they had done before.`,
  },
  '2 Kings 17:41': {
    all: `So these nations feared the Lord, but they also served their carved idols. Their children and grandchildren did the same, just as their fathers had done.`,
  },
  '2 Kings 18:9': {
    all: `During Hezekiah's fourth year, Shalmaneser king of Assyria came against Samaria and surrounded it.`,
  },
  '2 Kings 18:10': {
    all: `After three years, Assyria captured Samaria. This happened in Hezekiah's sixth year, which was Hoshea's ninth year as king of Israel.`,
  },
  '2 Kings 18:11': {
    all: `The king of Assyria carried Israel away to Assyria. He settled them in Halah, by the Habor River of Gozan, and in the cities of the Medes.`,
  },
  '2 Kings 18:12': {
    all: `This happened because they did not obey the voice of the Lord their God. They broke his covenant and would not listen to or do all that Moses, the Lord's servant, had commanded.`,
  },
  '2 Kings 18:14': {
    all: `Hezekiah sent a message to the king of Assyria at Lachish: "I have done wrong. Leave me, and I will carry whatever payment you put on me." So the king of Assyria required three hundred large weights of silver and thirty large weights of gold from Hezekiah.`,
  },
  '2 Kings 18:17': {
    all: `Then the king of Assyria sent Tartan, Rabsaris, and Rabshakeh from Lachish to King Hezekiah at Jerusalem with a great army. They came and stood by the water channel near the upper pool, on the road to the Washer's Field.`,
  },
  '2 Kings 18:19': {
    all: `Rabshakeh said to them, "Tell Hezekiah, 'The great king, the king of Assyria, says, "What are you trusting in?`,
  },
  '2 Kings 18:20': {
    all: `You say you have advice and strength for war, but those are empty words. Whom are you trusting, that you have rebelled against me?`,
  },
  '2 Kings 18:21': {
    all: `Look, you are trusting Egypt like someone leaning on a cracked reed for a walking stick. It will pierce the hand of anyone who leans on it. That is what Pharaoh king of Egypt is like to all who trust him.`,
  },
  '2 Kings 18:22': {
    all: `But if you tell me, 'We trust in the Lord our God,' isn't he the one whose worship places on hills and altars Hezekiah removed, saying to Judah and Jerusalem, 'You must worship before this altar in Jerusalem'?`,
  },
  '2 Kings 18:23': {
    all: `Now make a deal with my master, the king of Assyria. I will give you two thousand horses, if you can put riders on them.`,
  },
  '2 Kings 18:24': {
    all: `How could you turn away even one of my master's least commanders? You are trusting Egypt for chariots and horsemen.`,
  },
  '2 Kings 18:25': {
    all: `Have I come up without the Lord against this place to destroy it? The Lord himself told me, 'Go up against this land and destroy it.'"`,
  },
  '2 Kings 18:26': {
    all: `Then Eliakim, Shebnah, and Joah said to Rabshakeh, "Please speak to us in the Syrian language, because we understand it. Do not speak in the language of Judah where the people on the wall can hear."`,
  },
  '2 Kings 18:27': {
    all: `But Rabshakeh said, "Did my master send me only to your master and to you? No, he sent me to the men sitting on the wall, who will suffer with you until they eat their own waste and drink their own urine."`,
  },
  '2 Kings 18:28': {
    all: `Then Rabshakeh stood and cried out loudly in the language of Judah, "Hear the word of the great king, the king of Assyria!`,
  },
  '2 Kings 18:31': {
    all: `Do not listen to Hezekiah. The king of Assyria says, 'Make peace with me and come out to me. Then each of you will eat from his own vine and fig tree and drink from his own water pit,`,
  },
  '2 Kings 18:32': {
    all: `until I come and take you to a land like your own land, a land of grain, new wine, bread, vineyards, olive trees, and honey. Then you will live and not die. Do not listen when Hezekiah says, "The Lord will deliver us."`,
  },
  '2 Kings 18:37': {
    all: `Then Eliakim the palace manager, Shebna the scribe, and Joah the recorder came to Hezekiah with their clothes torn in grief. They told him Rabshakeh's words.`,
  },
  '2 Kings 23:1': {
    all: `King Josiah sent for all the elders of Judah and Jerusalem, and they gathered to him.`,
  },
  '2 Kings 23:2': {
    all: `Then the king went up to the Lord's house with the men of Judah, the people of Jerusalem, the priests, the prophets, and all the people, both small and great. He read aloud all the words of the covenant book that had been found in the Lord's house.`,
  },
  '2 Kings 23:3': {
    all: `The king stood by the pillar and made a covenant before the Lord. He promised to follow the Lord and keep his commands, covenant teachings, and laws with all his heart and soul. All the people joined in the covenant.`,
  },
  '2 Kings 23:4': {
    all: `The king commanded Hilkiah the high priest, the priests next in rank, and the doorway guards to bring out of the Lord's temple every object made for Baal, the Asherah idol, and the army of the sky. Josiah burned them outside Jerusalem in the fields of the Kidron and carried their ashes to Bethel.`,
  },
  '2 Kings 23:5': {
    all: `He removed the priests for false gods, whom the kings of Judah had appointed to burn sweet-smelling incense at the worship places on hills in Judah and around Jerusalem. He also removed those who burned incense to Baal, the sun, the moon, the planets, and all the army of the sky.`,
  },
  '2 Kings 23:6': {
    all: `He brought the Asherah idol out of the Lord's house to the Kidron Brook outside Jerusalem. He burned it there, crushed it to dust, and threw the dust on the graves of the common people.`,
  },
  '2 Kings 23:7': {
    all: `He tore down the rooms in the Lord's house where men and women had done sexual sin in idol worship and where women had woven cloth hangings for the Asherah idol.`,
  },
  '2 Kings 23:8': {
    all: `Josiah brought all the priests from the cities of Judah and made the worship places on hills unfit for worship, from Geba to Beersheba. He also broke down the gate worship places near the entrance of Joshua the city governor's gate.`,
  },
  '2 Kings 23:9': {
    all: `The priests from the worship places on hills did not serve at the Lord's altar in Jerusalem, but they ate unleavened bread among their brothers.`,
  },
  '2 Kings 23:11': {
    all: `He removed the horses that Judah's kings had given to the sun at the entrance of the Lord's house, near the room of Nathan Melech the officer. He burned the chariots of the sun with fire.`,
  },
  '2 Kings 23:12': {
    all: `The king tore down the altars on the roof of Ahaz's upstairs room and the altars Manasseh had made in the two courts of the Lord's house. He crushed them there and threw their dust into the Kidron Brook.`,
  },
  '2 Kings 23:13': {
    all: `The king made unfit for worship the high places east of Jerusalem, south of the Mount of Corruption. Solomon king of Israel had built them for Ashtoreth of the Sidonians, Chemosh of Moab, and Milcom of the Ammonites.`,
  },
  '2 Kings 23:14': {
    all: `He broke the stone pillars, cut down the Asherah poles, and filled their places with human bones.`,
  },
  '2 Kings 23:15': {
    all: `Josiah also broke down the altar and high place at Bethel, which Jeroboam son of Nebat had made and which had led Israel into sin. He burned the high place, beat it to dust, and burned the Asherah idol.`,
  },
  '2 Kings 23:16': {
    all: `When Josiah turned and saw tombs on the mountain, he sent men to take bones from the tombs. He burned the bones on the altar and made it unfit for worship, according to the Lord's word spoken by the man of God.`,
  },
  '2 Kings 23:17': {
    all: `Then Josiah asked, "What is that marker I see?" The men of the city said, "It is the tomb of the man of God who came from Judah and spoke about these things you have done to the altar at Bethel."`,
  },
  '2 Kings 23:18': {
    all: `Josiah said, "Leave him alone. Let no one move his bones." So they left his bones there, along with the bones of the prophet who had come from Samaria.`,
  },
  '2 Kings 23:19': {
    all: `Josiah also removed all the houses of the worship places on hills in the cities of Samaria. Israel's kings had made them and made the Lord angry. Josiah did to them as he had done in Bethel.`,
  },
  '2 Kings 23:20': {
    all: `He killed all the priests of those worship places on their altars and burned human bones on them. Then he returned to Jerusalem.`,
  },
  '2 Kings 23:21': {
    all: `The king commanded all the people, "Keep the Passover to the Lord your God, as it is written in this covenant book."`,
  },
  '2 Kings 23:22': {
    all: `No Passover like this had been kept from the days when the judges ruled Israel, nor in all the days of the kings of Israel and Judah.`,
  },
  '2 Kings 23:23': {
    all: `But in King Josiah's eighteenth year, this Passover was kept to the Lord in Jerusalem.`,
  },
  '2 Kings 23:24': {
    all: `Josiah also removed the people who tried to speak with spirits, the magic workers, the household idols, the other idols, and all the detestable sins seen in Judah and Jerusalem. He did this to keep the words of the law written in the book Hilkiah the priest had found in the Lord's house.`,
  },
  '2 Kings 23:27': {
    all: `The Lord said, "I will remove Judah from my sight, just as I removed Israel. I will reject this city I chose, Jerusalem, and the house where I said, 'My name will be there.'"`,
  },
  '2 Kings 23:29': {
    all: `In Josiah's days, Pharaoh Necoh king of Egypt went up to the Euphrates River to meet the king of Assyria. King Josiah went out against him, and Pharaoh Necoh killed him at Megiddo when he saw him.`,
  },
  '2 Kings 23:30': {
    all: `Josiah's servants carried his body in a chariot from Megiddo to Jerusalem and buried him in his own tomb. Then the people of the land took Jehoahaz son of Josiah, anointed him, and made him king in his father's place.`,
  },
  '2 Kings 23:33': {
    all: `Pharaoh Necoh kept Jehoahaz under guard at Riblah in the land of Hamath so he could not rule in Jerusalem. He also required Judah to pay one hundred large weights of silver and one large weight of gold.`,
  },
  '2 Kings 23:35': {
    all: `Jehoiakim gave the silver and gold to Pharaoh. To pay what Pharaoh commanded, he taxed the land and collected silver and gold from each person according to what each one was required to give.`,
  },
  '2 Kings 25:15': {
    all: `The commander also took the fire pans and basins. Whatever was made of gold he took as gold, and whatever was made of silver he took as silver.`,
  },
  '2 Kings 25:11': {
    all: `Nebuzaradan the commander of the guard carried away the rest of the people left in the city, those who had surrendered to the king of Babylon, and the remaining crowd.`,
  },
  '2 Kings 25:14': {
    all: `They took away the pots, shovels, wick trimmers, spoons, and all the bronze containers used for temple service.`,
  },
  '2 Kings 25:16': {
    all: `There was so much bronze from the two pillars, the great bronze basin, and the bases Solomon had made for the Lord's house that it could not be weighed.`,
  },
  '2 Kings 25:22': {
    all: `Nebuchadnezzar king of Babylon left some people in the land of Judah, and he made Gedaliah son of Ahikam, son of Shaphan, governor over them.`,
  },
  '2 Kings 25:23': {
    all: `When the commanders of the forces and their men heard that Babylon's king had made Gedaliah governor, they came to him at Mizpah. Ishmael, Johanan, Seraiah, Jaazaniah, and their men came too.`,
  },
  '2 Kings 25:24': {
    all: `Gedaliah promised them and their men, "Do not be afraid of the Chaldean officials. Live in the land and serve the king of Babylon, and things will go well for you."`,
  },
  '2 Kings 25:25': {
    all: `But in the seventh month, Ishmael son of Nethaniah, from the royal family, came with ten men. They struck Gedaliah down, and also killed the Jews and Chaldeans who were with him at Mizpah.`,
  },
  '2 Kings 25:28': {
    all: `Evil Merodach spoke kindly to Jehoiachin and gave him a seat of honor above the other kings who were with him in Babylon.`,
  },
  '2 Kings 25:29': {
    all: `Jehoiachin changed out of his prison clothes and ate regularly at the king's table all the days of his life.`,
  },
  '2 Kings 25:17': {
    all: `One bronze pillar was eighteen arm-lengths high. A bronze capital on top of it was three arm-lengths high, with bronze latticework and pomegranates all around. The second pillar was the same, with its latticework.`,
  },
  '2 Kings 25:18': {
    all: `The commander of the guard took Seraiah the chief priest, Zephaniah the second priest, and the three doorway keepers.`,
  },
  '2 Kings 25:19': {
    all: `From the city he took one officer over the soldiers, five men who saw the king's face, the scribe who counted the people of the land for the army, and sixty men of the people of the land who were found in the city.`,
  },
  '2 Kings 25:20': {
    all: `Nebuzaradan the commander of the guard took them and brought them to the king of Babylon at Riblah.`,
  },
}

const VERSE_REVISIONS = { ...STORY_REVISIONS, ...SECOND_PASS_REVISIONS }

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
  const directory = path.join(__dirname, '..', 'content', 'bible-text', `ages-${ageRange}`, 'old-testament', BOOK_SLUG)
  await fs.mkdir(directory, { recursive: true })

  const parts = [
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
  ]

  verses.forEach((verse, index) => {
    if (index > 0) parts.push('')
    parts.push(`### ${BOOK} ${chapter}:${index + 1}`)
    parts.push(verse)
  })

  await fs.writeFile(path.join(directory, `chapter-${chapter}.md`), `${parts.join('\n').replace(/\n+$/g, '')}\n`, 'utf8')
}

function adaptText(source, ageRange, reference) {
  const override = VERSE_REVISIONS[reference]?.[ageRange] || VERSE_REVISIONS[reference]?.all
  const normalized = normalizeSource(override || source)
  const replaced = applyKingsReplacements(normalized, ageRange)
  return finalPolish(polishKidReadableText(finalPolish(replaced), ageRange))
}

function applyKingsReplacements(source, ageRange) {
  let text = source
    .replace(/\bYahweh's\b/g, "the Lord's")
    .replace(/\bYahweh of Armies\b/g, 'the Lord of Armies')
    .replace(/\bYahweh\b/g, 'the Lord')
    .replace(/\bchildren of Israel\b/gi, 'people of Israel')
    .replace(/\bchildren of Judah\b/g, 'people of Judah')
    .replace(/\bchildren of Ammon\b/g, 'Ammonites')
    .replace(/\bsons of the prophets\b/g, 'company of prophets')
    .replace(/\bson of the prophets\b/g, 'prophet in training')
    .replace(/\bcompany of prophets\b/g, 'company of prophets')
    .replace(/\bmaster from your head\b/g, 'master away from you')
    .replace(/\bHold your peace\b/g, 'Be quiet')
    .replace(/\bhold your peace\b/g, 'be quiet')
    .replace(/\bmantle\b/g, 'cloak')
    .replace(/\black of bread\b/g, 'no bread')
    .replace(/\bfamine\b/g, 'famine')
    .replace(/\bbesieged\b/g, 'surrounded')
    .replace(/\bsiege\b/g, 'siege')
    .replace(/\bleprosy\b/g, 'serious skin disease')
    .replace(/\bleprous men\b/g, 'men with serious skin disease')
    .replace(/\bleprous\b/g, 'had a serious skin disease')
    .replace(/\blepers\b/g, 'men with serious skin disease')
    .replace(/\bleper\b/g, 'person with a serious skin disease')
    .replace(/\bmaidservants\b/g, 'female servants')
    .replace(/\bmaidservant\b/g, 'female servant')
    .replace(/\bmaiden\b/g, 'young girl')
    .replace(/\bdamsel\b/g, 'young woman')
    .replace(/\bslaves\b/g, 'slaves')
    .replace(/\bslave\b/g, 'slave')
    .replace(/\bconcubines\b/g, 'secondary wives')
    .replace(/\bconcubine\b/g, 'secondary wife')
    .replace(/\bharlots\b/g, 'women living in sexual sin')
    .replace(/\bharlot\b/g, 'woman living in sexual sin')
    .replace(/\bprostitutes\b/g, 'women living in sexual sin')
    .replace(/\bprostitute\b/g, 'woman living in sexual sin')
    .replace(/\bmale shrine prostitutes\b/g, 'men doing sexual sin in idol worship')
    .replace(/\bsodomites\b/g, 'people doing sexual sin in idol worship')
    .replace(/\bsodomite\b/g, 'person doing sexual sin in idol worship')
    .replace(/\bpass through the fire\b/g, 'be burned as an offering')
    .replace(/\bmade his son to pass through the fire\b/g, 'burned his son as an offering')
    .replace(/\bpracticed sorcery\b/g, 'practiced sorcery')
    .replace(/\bsorcery\b/g, 'forbidden magic')
    .replace(/\benchantments\b/g, 'forbidden signs')
    .replace(/\bfamiliar spirits\b/g, 'people who tried to speak with spirits')
    .replace(/\bwizards\b/g, 'magic workers')
    .replace(/\bmediums\b/g, 'people who tried to speak with spirits')
    .replace(/\bteraphim\b/g, 'household idols')
    .replace(/\bidolatrous priests\b/g, 'priests for false gods')
    .replace(/\bhigh places\b/g, 'high worship places')
    .replace(/\bhigh place\b/g, 'high worship place')
    .replace(/\bAsherah\b/g, 'Asherah idol')
    .replace(/\bBaalim\b/g, 'Baals')
    .replace(/\bother gods\b/g, 'false gods')
    .replace(/\bmolten images\b/g, 'metal images')
    .replace(/\bengraved image\b/g, 'carved idol')
    .replace(/\bimages\b/g, 'images')
    .replace(/\babominations\b/g, 'detestable sins')
    .replace(/\babomination\b/g, 'detestable sin')
    .replace(/\babominable\b/g, 'detestable')
    .replace(/\bstatutes\b/g, 'laws')
    .replace(/\bstatute\b/g, 'law')
    .replace(/\bordinances\b/g, 'rules')
    .replace(/\bordinance\b/g, 'rule')
    .replace(/\bcommandments\b/g, 'commands')
    .replace(/\bcommandment\b/g, 'command')
    .replace(/\btestimonies\b/g, 'covenant teachings')
    .replace(/\btestimony\b/g, 'covenant teaching')
    .replace(/\bsupplications\b/g, 'humble prayers')
    .replace(/\bsupplication\b/g, 'humble prayer')
    .replace(/\biniquity\b/g, 'sin')
    .replace(/\biniquities\b/g, 'sins')
    .replace(/\btransgressed\b/g, 'sinned')
    .replace(/\btransgression\b/g, 'sin')
    .replace(/\bprovoked him to anger\b/g, 'made him angry')
    .replace(/\bprovocation\b/g, 'anger')
    .replace(/\bperpetually\b/g, 'always')
    .replace(/\bloving kindness\b/g, 'faithful kindness')
    .replace(/\btook counsel with\b/g, 'asked advice from')
    .replace(/\btook counsel\b/g, 'asked advice')
    .replace(/\bcounsel\b/g, 'advice')
    .replace(/\bmustered\b/g, 'counted')
    .replace(/\bmuster\b/g, 'count')
    .replace(/\bseahs\b/g, 'measures')
    .replace(/\bseah\b/g, 'measure')
    .replace(/\bshekels of silver\b/g, 'silver pieces')
    .replace(/\bshekels\b/g, 'silver pieces')
    .replace(/\bshekel\b/g, 'silver piece')
    .replace(/\btalents\b/g, 'large weights')
    .replace(/\btalent\b/g, 'large weight')
    .replace(/\bcubits\b/g, 'arm-lengths')
    .replace(/\bcubit\b/g, 'arm-length')
    .replace(/\bcab\b/g, 'small measure')
    .replace(/\bsnuffers\b/g, 'wick trimmers')
    .replace(/\bsnuffer\b/g, 'wick trimmer')
    .replace(/\bdove's dung\b/g, 'dove droppings')
    .replace(/\bdung\b/g, 'animal waste')
    .replace(/\bflesh\b/g, 'body')
    .replace(/\bbosom\b/g, 'arms')
    .replace(/\bchamber\b/g, 'room')
    .replace(/\bupper room\b/g, 'upstairs room')
    .replace(/\blattice\b/g, 'lattice window')
    .replace(/\bthreshold\b/g, 'doorway')
    .replace(/\bkeepers of the threshold\b/g, 'doorway keepers')
    .replace(/\beunuchs\b/g, 'palace officials')
    .replace(/\beunuch\b/g, 'palace official')
    .replace(/\bchariots of fire\b/g, 'chariots of fire')
    .replace(/\bhorsemen\b/g, 'horsemen')
    .replace(/\bpledges\b/g, 'a promise')
    .replace(/\bpledge\b/g, 'promise')
    .replace(/\bwave his hand over\b/g, 'move his hand over')
    .replace(/\bwaved his hand over\b/g, 'moved his hand over')
    .replace(/\bmen of war\b/g, 'soldiers')
    .replace(/\bman of war\b/g, 'soldier')
    .replace(/\bcaptains\b/g, 'commanders')
    .replace(/\bcaptain\b/g, 'commander')
    .replace(/\bprinces\b/g, 'leaders')
    .replace(/\bprince\b/g, 'leader')
    .replace(/\bchiefs\b/g, 'leaders')
    .replace(/\bchief\b/g, 'leader')
    .replace(/\btribute\b/g, 'required payment')
    .replace(/\blevy\b/g, 'forced work group')
    .replace(/\bvessels\b/g, 'containers')
    .replace(/\bvessel\b/g, 'container')
    .replace(/\bbronze sea\b/g, 'great bronze basin')
    .replace(/\bsea\b/g, 'sea')
    .replace(/\bbrass\b/g, 'bronze')
    .replace(/\bbrazen\b/g, 'bronze')
    .replace(/\b fetters\b/g, ' chains')
    .replace(/\bchains\b/g, 'chains')
    .replace(/\bslain\b/g, 'killed')
    .replace(/\bslay\b/g, 'kill')
    .replace(/\bslew\b/g, 'killed')
    .replace(/\bsmote\b/g, 'struck')
    .replace(/\bsmite\b/g, 'strike')
    .replace(/\bstruck with the edge of the sword\b/g, 'struck down with the sword')
    .replace(/\bfell by the sword\b/g, 'died by the sword')
    .replace(/\bput to death\b/g, 'put to death')
    .replace(/\bslaughter\b/g, 'many deaths')
    .replace(/\bsackcloth\b/g, 'rough cloth')
    .replace(/\btore his clothes\b/g, 'tore his clothes in grief')
    .replace(/\btorn his clothes\b/g, 'torn his clothes in grief')
    .replace(/\bcovered himself with rough cloth\b/g, 'covered himself with rough cloth')
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
    .replace(/\bsojourn\b/g, 'live for a while')
    .replace(/\bsojourned\b/g, 'lived for a while')
    .replace(/\blodged\b/g, 'stayed')
    .replace(/\blodge\b/g, 'stay')
    .replace(/\bkindled\b/g, 'burned')
    .replace(/\bperadventure\b/g, 'perhaps')
    .replace(/\blest\b/g, 'or else')
    .replace(/\bthereof\b/g, 'of it')
    .replace(/\btherein\b/g, 'in it')
    .replace(/\btherewith\b/g, 'with it')
    .replace(/\bwherewith\b/g, 'with which')
    .replace(/\bwhence\b/g, 'from where')
    .replace(/\bthence\b/g, 'from there')
    .replace(/\bthither\b/g, 'there')
    .replace(/\bwhither\b/g, 'where')
    .replace(/\bhither\b/g, 'here')
    .replace(/\bshall not\b/g, 'must not')
    .replace(/\bshall\b/g, 'must')
    .replace(/\breigned\b/g, 'ruled')
    .replace(/\breign\b/g, 'rule')
    .replace(/\bslept with his fathers\b/g, 'died and was buried with his fathers')
    .replace(/\bsleep with your fathers\b/g, 'die and be buried with your fathers')
    .replace(/\bcarried away captive\b/g, 'carried away into exile')
    .replace(/\bcarried away\b/g, 'carried away')
    .replace(/\bcaptive\b/g, 'captive')
    .replace(/\bcaptivity\b/g, 'exile')

  if (ageRange === '5-7') {
    text = text
      .replace(/\bsecondary wives\b/g, 'other wives')
      .replace(/\bsecondary wife\b/g, 'other wife')
      .replace(/\bhigh worship places\b/g, 'worship places on hills')
      .replace(/\bhigh worship place\b/g, 'worship place on a hill')
      .replace(/\bcontainers\b/g, 'jars and bowls')
      .replace(/\bcontainer\b/g, 'jar or bowl')
  }

  return text
}

function normalizeSource(source) {
  return String(source)
    .replace(/\u00a0/g, ' ')
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
    .replace(/\blattice window window\b/g, 'lattice window')
    .replace(/\bthe Lord's's\b/g, "the Lord's")
    .replace(/\bsweet-smelling sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\bserious skin disease disease\b/g, 'serious skin disease')
    .replace(/\bhad a serious skin disease disease\b/g, 'had a serious skin disease')
    .replace(/\bmen with serious skin disease men\b/g, 'men with serious skin disease')
    .replace(/\btore his clothes in grief in grief\b/g, 'tore his clothes in grief')
    .replace(/\brough cloth cloth\b/g, 'rough cloth')
    .replace(/\bdoorway keepers of the doorway\b/g, 'doorway keepers')
    .replace(/\bhigh worship worship places\b/g, 'high worship places')
    .replace(/\bworship places on hills places\b/g, 'worship places on hills')
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

main().catch(err => {
  console.error(err)
  process.exit(1)
})
