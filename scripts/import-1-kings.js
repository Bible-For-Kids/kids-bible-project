#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const { polishKidReadableText } = require('./lib/kids-bible-style')

const BOOK = '1 Kings'
const BOOK_SLUG = '1-kings'
const SOURCE_BASE = 'https://www.canonapi.com/v1/1kings'
const EXPECTED_VERSE_COUNTS = [
  53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43,
  33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53,
]

const STORY_REVISIONS = {
  '1 Kings 1:1': {
    all: 'King David was very old. Even when his servants covered him with blankets, he could not get warm.',
  },
  '1 Kings 1:2': {
    all: 'David\'s servants said to him, "Let us find a young unmarried woman to care for our lord the king. She can serve the king and help keep him warm."',
  },
  '1 Kings 1:5': {
    all: 'Adonijah, son of Haggith, lifted himself up and said, "I will be king." He prepared chariots, horsemen, and fifty men to run before him.',
  },
  '1 Kings 1:9': {
    all: 'Adonijah killed sheep, cattle, and well-fed calves by the stone of Zoheleth near En Rogel. He invited all his brothers, the king\'s sons, and all the men of Judah who served the king.',
  },
  '1 Kings 1:11': {
    all: 'Nathan spoke to Bathsheba, Solomon\'s mother. He said, "Have you not heard that Adonijah son of Haggith has made himself king, and David our lord does not know about it?',
  },
  '1 Kings 1:17': {
    all: 'Bathsheba said to David, "My lord, you swore by the Lord your God to your servant, saying, \'Solomon your son will rule after me, and he will sit on my throne.\'',
  },
  '1 Kings 1:30': {
    all: 'As I swore to you by the Lord, the God of Israel, saying, "Solomon your son will rule after me, and he will sit on my throne in my place," I will surely make it happen today."',
  },
  '1 Kings 1:39': {
    all: 'Zadok the priest took the horn of oil from the tent and anointed Solomon. They blew the trumpet, and all the people shouted, "Long live King Solomon!"',
  },
  '1 Kings 1:40': {
    all: 'All the people came up after Solomon, playing pipes and rejoicing with great joy. The ground seemed to shake from the sound of their celebration.',
  },
  '1 Kings 1:48': {
    all: 'The king also said, "Blessed be the Lord, the God of Israel, who has given someone to sit on my throne today, and my own eyes have seen it."',
  },
  '1 Kings 2:2': {
    all: 'David said, "I am going the way of all the earth. Be strong, therefore, and show yourself a man.',
  },
  '1 Kings 2:3': {
    all: 'Keep the charge of the Lord your God. Walk in his ways. Keep his statutes, commandments, rules, and testimonies, as written in the law of Moses, so that you may act wisely in all you do and wherever you turn.',
  },
  '1 Kings 2:4': {
    all: 'Then the Lord may establish his word that he spoke about me, saying, "If your children guard their way and walk before me in truth with all their heart and all their soul, you will not lack a man on the throne of Israel."',
  },
  '1 Kings 2:10': {
    all: 'Then David died and was buried with his fathers in the city of David.',
  },
  '1 Kings 2:12': {
    all: 'Solomon sat on the throne of David his father, and his kingdom was firmly established.',
  },
  '1 Kings 2:26': {
    all: 'The king said to Abiathar the priest, "Go to Anathoth, to your own fields. You deserve death, but I will not put you to death today, because you carried the Lord\'s ark before David my father and shared in all my father\'s troubles."',
  },
  '1 Kings 2:42': {
    all: 'The king sent for Shimei and said, "Did I not make you swear by the Lord and warn you clearly? I told you that on the day you left Jerusalem and went anywhere else, you would surely die. You answered me, \'What you have said is good; I will obey.\'"',
  },
  '1 Kings 3:5': {
    all: 'At Gibeon, the Lord appeared to Solomon in a dream at night. God said, "Ask for what I should give you."',
  },
  '1 Kings 3:9': {
    all: 'Give your servant a listening heart to judge your people, so I may know the difference between good and evil. For who can judge this great people of yours?"',
  },
  '1 Kings 3:10': {
    all: 'The Lord was pleased that Solomon had asked for this.',
  },
  '1 Kings 3:11': {
    all: 'God said to Solomon, "Because you asked for this, and did not ask for long life, riches, or the death of your enemies, but asked for understanding so you can do justice,',
  },
  '1 Kings 3:12': {
    all: 'Look, I have done what you asked. I have given you a wise and understanding heart. No one before you has been like you, and no one after you will be like you.',
  },
  '1 Kings 3:16': {
    all: 'Then two women who had lived in sexual sin came to the king and stood before him.',
  },
  '1 Kings 3:17': {
    all: 'One woman said, "My lord, this woman and I live in the same house. I gave birth to a child while she was there in the house.',
  },
  '1 Kings 3:18': {
    all: 'Three days after my child was born, this woman also gave birth. We were together. No stranger was with us in the house; only the two of us were there.',
  },
  '1 Kings 3:19': {
    all: 'This woman\'s child died during the night, because she lay on him.',
  },
  '1 Kings 3:20': {
    all: 'She got up at midnight and took my son from beside me while your servant was sleeping. She laid him in her arms and laid her dead child in my arms.',
  },
  '1 Kings 3:21': {
    all: 'When I got up in the morning to nurse my child, look, he was dead. But when I looked at him closely in the morning, look, he was not the son I had given birth to."',
  },
  '1 Kings 3:28': {
    all: 'All Israel heard the judgment the king had given, and they respected the king, because they saw that God\'s wisdom was in him to do justice.',
  },
  '1 Kings 3:26': {
    all: 'Then the woman whose son was alive spoke to the king, because her heart longed for her son. She said, "Oh, my lord, give her the living child, and please do not kill him!" But the other woman said, "He will not be mine or yours. Divide him."',
  },
  '1 Kings 4:29': {
    all: 'God gave Solomon wisdom, very great understanding, and a heart as wide as the sand on the seashore.',
  },
  '1 Kings 4:5': {
    all: 'Azariah son of Nathan was over the officers. Zabud son of Nathan was a priest and the king\'s close friend.',
  },
  '1 Kings 4:6': {
    all: 'Ahishar was over Solomon\'s palace, and Adoniram son of Abda was in charge of the workers who were forced to work.',
  },
  '1 Kings 4:7': {
    all: 'Solomon had twelve officers over all Israel. Each one brought food for the king and his household for one month of the year.',
  },
  '1 Kings 4:11': {
    all: 'Ben Abinadab served in all the heights of Dor. He had married Taphath, Solomon\'s daughter.',
  },
  '1 Kings 4:22': {
    all: 'Each day Solomon\'s household used thirty large measures of fine flour and sixty large measures of flour.',
  },
  '1 Kings 4:23': {
    all: 'They also used ten fat cattle, twenty cattle from the pastures, and one hundred sheep, along with deer, gazelles, roebucks, and fattened birds.',
  },
  '1 Kings 4:24': {
    all: 'Solomon ruled over all the land west of the River, from Tiphsah to Gaza, and over all the kings west of the River. Peace surrounded him on every side.',
  },
  '1 Kings 4:25': {
    all: 'Judah and Israel lived safely. Each family could sit under its own vine and fig tree, from Dan to Beersheba, all the days of Solomon.',
  },
  '1 Kings 4:26': {
    all: 'Solomon had forty thousand stalls for his chariot horses and twelve thousand horsemen.',
  },
  '1 Kings 4:27': {
    all: 'The officers brought food for King Solomon and for everyone who came to his table. Each officer served in his month, and nothing was lacking.',
  },
  '1 Kings 4:28': {
    all: 'They also brought barley and straw for the horses and fast horses, each man bringing what was needed to the right place.',
  },
  '1 Kings 4:31': {
    all: 'Solomon was wiser than all the wise men people knew, wiser than Ethan the Ezrahite and Heman, Calcol, and Darda, the sons of Mahol. His fame spread through all the nations around him.',
  },
  '1 Kings 4:32': {
    all: 'Solomon spoke three thousand proverbs, and his songs numbered one thousand five.',
  },
  '1 Kings 4:33': {
    all: 'Solomon spoke about trees, from the tall cedar in Lebanon down to the little plant that grows out of a wall. He also spoke about animals, birds, crawling things, and fish.',
  },
  '1 Kings 4:34': {
    all: 'People came from all nations to hear Solomon\'s wisdom. Kings of the earth heard about his wisdom and sent people to listen.',
  },
  '1 Kings 5:5': {
    all: 'Solomon said, "Look, I plan to build a house for the name of the Lord my God, as the Lord spoke to David my father."',
  },
  '1 Kings 5:15': {
    all: 'Solomon had seventy thousand men who carried heavy loads and eighty thousand men who cut stone in the mountains.',
  },
  '1 Kings 5:16': {
    all: 'Solomon also had three thousand three hundred supervisors over the work, directing the people who labored.',
  },
  '1 Kings 6:1': {
    all: 'In the four hundred eightieth year after the people of Israel came out of Egypt, in Solomon\'s fourth year as king, Solomon began to build the Lord\'s house.',
  },
  '1 Kings 6:2': {
    all: 'The house King Solomon built for the Lord was sixty arm-lengths long, twenty arm-lengths wide, and thirty arm-lengths high.',
  },
  '1 Kings 6:3': {
    all: 'The entry room at the front of the temple stretched across the whole width of the house. It was twenty arm-lengths long and ten arm-lengths deep.',
  },
  '1 Kings 6:4': {
    all: 'Solomon made narrow windows with fixed lattice work for the house.',
  },
  '1 Kings 6:5': {
    all: 'He built side rooms all around the walls of the house, around both the main holy room and the inner holy room.',
  },
  '1 Kings 6:6': {
    all: 'The lowest side rooms were five arm-lengths wide, the middle rooms six, and the third-floor rooms seven. The outer wall had ledges all around so the beams would rest without cutting into the temple walls.',
  },
  '1 Kings 6:7': {
    all: 'The stones were cut and prepared at the quarry before they were brought to the temple. So while the house was being built, no hammer, ax, or iron tool was heard there.',
  },
  '1 Kings 6:8': {
    all: 'The door to the middle side rooms was on the right side of the house. Winding stairs went up to the middle floor and then up to the third floor.',
  },
  '1 Kings 6:9': {
    all: 'So Solomon built the house and finished it. He covered it with cedar beams and cedar planks.',
  },
  '1 Kings 6:10': {
    all: 'He built the side rooms along the whole house, each floor five arm-lengths high, and they rested on cedar beams.',
  },
  '1 Kings 6:12': {
    all: '"About this house you are building: if you walk in my laws, do my rules, and keep all my commands, then I will establish the word I spoke to David your father.',
  },
  '1 Kings 6:13': {
    all: 'I will live among the people of Israel, and I will not forsake my people Israel."',
  },
  '1 Kings 6:15': {
    all: 'Inside the Lord\'s house, Solomon covered the stone walls with cedar boards from the floor to the ceiling. He also covered the floor with cypress boards.',
  },
  '1 Kings 6:16': {
    all: 'At the back of the house, he built an inner holy room with cedar boards from floor to ceiling. This room was the Most Holy Place.',
  },
  '1 Kings 6:17': {
    all: 'The main holy room in front of it was forty arm-lengths long.',
  },
  '1 Kings 6:18': {
    all: 'The cedar inside the house was carved with buds and open flowers. Everything inside was cedar, so no stone could be seen.',
  },
  '1 Kings 6:19': {
    all: 'Solomon prepared the inner holy room inside the house so the ark of the Lord\'s covenant could be placed there.',
  },
  '1 Kings 6:20': {
    all: 'The inner holy room was twenty arm-lengths long, twenty arm-lengths wide, and twenty arm-lengths high. Solomon covered it with pure gold, and he covered the altar with cedar.',
  },
  '1 Kings 6:21': {
    all: 'Solomon covered the inside of the house with pure gold. He stretched gold chains across in front of the inner holy room and covered that room with gold.',
  },
  '1 Kings 6:22': {
    all: 'He covered the whole house with gold until all the work was finished. He also covered the whole altar that belonged to the inner holy room with gold.',
  },
  '1 Kings 6:23': {
    all: 'In the inner holy room, Solomon made two cherubim, mighty heavenly creatures, from olive wood. Each one was ten arm-lengths high.',
  },
  '1 Kings 6:24': {
    all: 'Each cherub had two wings. One wing was five arm-lengths long, and the other wing was five arm-lengths long, ten arm-lengths from wingtip to wingtip.',
  },
  '1 Kings 6:25': {
    all: 'The second cherub was the same size and shape as the first.',
  },
  '1 Kings 6:26': {
    all: 'Each cherub was ten arm-lengths high.',
  },
  '1 Kings 6:27': {
    all: 'He set the cherubim inside the inner room. Their wings stretched out so one wing touched one wall, the other wing touched the other wall, and their wings touched each other in the middle.',
  },
  '1 Kings 6:28': {
    all: 'He covered the cherubim with gold.',
  },
  '1 Kings 6:29': {
    all: 'All around the walls, inside and outside the inner room, he carved cherubim, palm tree carvings, and open flowers.',
  },
  '1 Kings 6:30': {
    all: 'He covered the floor of the house with gold, both inside the main room and inside the inner room.',
  },
  '1 Kings 6:31': {
    all: 'For the entrance to the inner holy room, he made doors of olive wood with strong posts and a top beam.',
  },
  '1 Kings 6:32': {
    all: 'On the two olive-wood doors, he carved cherubim, palm trees, and open flowers. Then he covered the doors and carvings with gold.',
  },
  '1 Kings 6:33': {
    all: 'He also made olive-wood posts for the entrance to the main holy room.',
  },
  '1 Kings 6:34': {
    all: 'He made two folding doors of cypress wood. Each door had two folding panels.',
  },
  '1 Kings 6:35': {
    all: 'He carved cherubim, palm trees, and open flowers on them, and covered the carved work with fitted gold.',
  },
  '1 Kings 6:38': {
    all: 'In Solomon\'s eleventh year, in the eighth month, the house was finished in all its parts and according to all its plans. Solomon spent seven years building it.',
  },
  '1 Kings 7:1': {
    all: 'Solomon also built his own palace. It took thirteen years, and then all his palace work was finished.',
  },
  '1 Kings 7:2': {
    all: 'He built the House of the Forest of Lebanon. It was one hundred arm-lengths long, fifty arm-lengths wide, and thirty arm-lengths high, with four rows of cedar pillars and cedar beams resting on them.',
  },
  '1 Kings 7:3': {
    all: 'Above the pillars were forty-five cedar beams, fifteen beams in each row, and cedar covered the top.',
  },
  '1 Kings 7:4': {
    all: 'Windows were set in three rows, with one window facing another across the hall.',
  },
  '1 Kings 7:5': {
    all: 'All the doorways and posts were square, and the windows faced one another in three rows.',
  },
  '1 Kings 7:6': {
    all: 'He made an entry room with pillars. It was fifty arm-lengths long and thirty arm-lengths wide, with pillars and a doorway in front.',
  },
  '1 Kings 7:7': {
    all: 'He also made the throne room where he would judge. It was called the Hall of Judgment, and cedar covered it from floor to ceiling.',
  },
  '1 Kings 7:8': {
    all: 'Solomon\'s own house, in another court behind the entry room, was made in the same way. He also made a house like this for Pharaoh\'s daughter, whom he had married.',
  },
  '1 Kings 7:9': {
    all: 'All these buildings were made of costly stones, carefully cut to size and sawed smooth inside and outside, from the foundation up to the top edge and out to the great court.',
  },
  '1 Kings 7:10': {
    all: 'The foundation stones were costly and large, some ten arm-lengths long and some eight arm-lengths long.',
  },
  '1 Kings 7:11': {
    all: 'Above the foundation were more costly stones, cut to size, and cedar wood.',
  },
  '1 Kings 7:12': {
    all: 'The great court around it had three rows of cut stone and one row of cedar beams, like the inner court of the Lord\'s house and the temple entry room.',
  },
  '1 Kings 7:14': {
    all: 'Hiram was the son of a widow from the tribe of Naphtali, and his father had been from Tyre. Hiram was a skilled bronze worker, full of wisdom, understanding, and skill for every kind of bronze work. He came to King Solomon and did all his work.',
  },
  '1 Kings 7:15': {
    all: 'Hiram shaped two bronze pillars. Each one was eighteen arm-lengths high, and a measuring line of twelve arm-lengths went around each pillar.',
  },
  '1 Kings 7:23': {
    all: 'Hiram made a huge round bronze basin called the Sea. It was ten arm-lengths across from rim to rim, five arm-lengths high, and thirty arm-lengths around.',
  },
  '1 Kings 7:24': {
    all: 'Under the rim, small round decorations went all the way around the basin in two rows. They were made together with the basin when the bronze was poured into the mold.',
  },
  '1 Kings 7:16': {
    all: 'He made two bronze pillar tops in molds to set on the tops of the pillars. Each pillar top was five arm-lengths high.',
  },
  '1 Kings 7:17': {
    all: 'For the tops of the pillars, he made woven nets and chain-like wreaths, seven for one pillar top and seven for the other.',
  },
  '1 Kings 7:18': {
    all: 'He made two rows of pomegranate decorations around the woven work to cover the tops of the pillars. He did this for both pillar tops.',
  },
  '1 Kings 7:19': {
    all: 'The tops of the pillars in the entry room were shaped like lilies, four arm-lengths high.',
  },
  '1 Kings 7:20': {
    all: 'The two pillars had rounded tops beside the woven decorations. Around the other pillar top were two hundred pomegranate decorations in rows.',
  },
  '1 Kings 7:21': {
    all: 'Hiram set up the pillars at the entry room of the temple. He set up the right pillar and named it Jachin, and he set up the left pillar and named it Boaz.',
  },
  '1 Kings 7:22': {
    all: 'The tops of the pillars were shaped like lilies. So the work on the pillars was finished.',
  },
  '1 Kings 7:25': {
    all: 'The great basin stood on twelve bronze oxen. Three faced north, three west, three south, and three east. The basin rested on them, and their backs faced inward.',
  },
  '1 Kings 7:26': {
    all: 'The basin was a handbreadth thick. Its rim was shaped like the rim of a cup, like a lily flower, and it held two thousand large liquid measures.',
  },
  '1 Kings 7:27': {
    all: 'Hiram made ten bronze stands. Each stand was four arm-lengths long, four arm-lengths wide, and three arm-lengths high.',
  },
  '1 Kings 7:28': {
    all: 'The stands were made with panels set between the frames.',
  },
  '1 Kings 7:29': {
    all: 'On the panels were lions, oxen, and cherubim. Above them was a raised frame, and below the lions and oxen were hanging wreaths.',
  },
  '1 Kings 7:30': {
    all: 'Each stand had four bronze wheels with bronze axles. At its four corners were supports under the bowl, with wreath-shaped decorations beside them.',
  },
  '1 Kings 7:31': {
    all: 'The top opening of each stand was round, with engravings around it. The panels below were square, not round.',
  },
  '1 Kings 7:32': {
    all: 'The four wheels were under the panels, with the axles fastened to the stand. Each wheel was an arm-length and a half high.',
  },
  '1 Kings 7:33': {
    all: 'The wheels were made like chariot wheels. Their axles, rims, spokes, and hubs were all made from molded metal.',
  },
  '1 Kings 7:36': {
    all: 'On the supports and panels, Hiram engraved cherubim, lions, palm tree carvings, and wreaths wherever there was space.',
  },
  '1 Kings 7:37': {
    all: 'He made all ten stands in the same way, with the same mold, the same size, and the same shape.',
  },
  '1 Kings 7:38': {
    all: 'He made ten bronze bowls. Each bowl held forty large liquid measures, and each bowl rested on one of the ten stands.',
  },
  '1 Kings 7:39': {
    all: 'He placed five stands on the right side of the house and five on the left. He placed the great basin on the southeast side of the house.',
  },
  '1 Kings 7:40': {
    all: 'Hiram made the pots, shovels, and bowls. So Hiram finished all the work he did for King Solomon in the Lord\'s house:',
  },
  '1 Kings 7:41': {
    all: 'the two pillars, the two bowl-shaped tops on the pillars, and the two woven networks covering those tops;',
  },
  '1 Kings 7:42': {
    all: 'He made four hundred pomegranate decorations for the two woven networks, two rows for each network, to cover the two bowls on top of the pillars.',
  },
  '1 Kings 7:43': {
    all: 'the ten stands and the ten bowls on the stands;',
  },
  '1 Kings 7:44': {
    all: 'the one great basin called the Sea and the twelve oxen under it;',
  },
  '1 Kings 7:45': {
    all: 'He made the pots, shovels, and bowls. All these things that Hiram made for King Solomon in the Lord\'s house were polished bronze.',
  },
  '1 Kings 7:46': {
    all: 'The king had these bronze pieces made in clay molds in the plain of the Jordan, between Succoth and Zarethan.',
  },
  '1 Kings 7:47': {
    all: 'Solomon left all the bronze bowls and tools unweighed, because there were so many. No one counted the full weight of the bronze.',
  },
  '1 Kings 7:48': {
    all: 'Solomon also made all the gold things inside the Lord\'s house: the golden altar and the gold table for the holy bread.',
  },
  '1 Kings 7:49': {
    all: 'He made the pure gold lampstands, five on the right and five on the left before the inner holy room, and he made the flowers, lamps, and tongs of gold.',
  },
  '1 Kings 7:50': {
    all: 'He made the cups, lamp tools, bowls, spoons, fire pans, and door hinges of pure gold for the inner room, the Most Holy Place, and for the temple doors.',
  },
  '1 Kings 7:51': {
    all: 'So all the work that King Solomon did for the Lord\'s house was finished. Solomon brought in the things David his father had dedicated: the silver, the gold, and the containers. He put them in the treasuries of the Lord\'s house.',
  },
  '1 Kings 8:10': {
    all: 'When the priests came out of the holy place, the cloud filled the Lord\'s house.',
  },
  '1 Kings 8:11': {
    all: 'The priests could not stand to serve because of the cloud, for the glory of the Lord filled the Lord\'s house.',
  },
  '1 Kings 8:23': {
    all: 'Solomon said, "Lord, God of Israel, there is no God like you in heaven above or on earth below. You keep covenant and loving kindness with your servants who walk before you with all their heart.',
  },
  '1 Kings 8:27': {
    all: 'But will God truly live on the earth? Look, heaven and the highest heaven cannot hold you. How much less this house I have built!',
  },
  '1 Kings 8:35': {
    all: 'When the sky is closed and there is no rain because they have sinned against you, if they pray toward this place, confess your name, and turn from their sin because you humbled them,',
  },
  '1 Kings 8:36': {
    all: 'then hear in heaven, forgive the sin of your servants and your people Israel, teach them the good way they should walk, and send rain on your land that you gave your people as an inheritance.',
  },
  '1 Kings 8:46': {
    all: 'When they sin against you, for there is no one who does not sin, and you are angry with them and give them to an enemy, so they are carried away captive to the enemy\'s land, far or near,',
  },
  '1 Kings 8:56': {
    all: 'Blessed be the Lord, who has given rest to his people Israel according to all he promised. Not one word has failed of all his good promise, which he promised by Moses his servant.',
  },
  '1 Kings 8:61': {
    all: 'Let your heart therefore be wholly devoted to the Lord our God, to walk in his statutes and keep his commandments, as at this day."',
  },
  '1 Kings 9:4': {
    all: 'If you will walk before me as David your father walked, with a whole heart and uprightness, doing everything I commanded you, and if you keep my statutes and rules,',
  },
  '1 Kings 9:5': {
    all: 'then I will establish the throne of your kingdom over Israel forever, as I promised David your father, saying, "You will not lack a man on the throne of Israel."',
  },
  '1 Kings 9:6': {
    all: 'But if you or your children turn away from following me and do not keep my commandments and statutes, but go and serve other gods and worship them,',
  },
  '1 Kings 9:7': {
    all: 'then I will cut Israel off from the land I gave them. I will put this house, which I made holy for my name, out of my sight, and Israel will become a warning story among all peoples.',
  },
  '1 Kings 9:19': {
    all: 'Solomon also built storage cities, cities for his chariots, and cities for his horsemen. He built what he desired in Jerusalem, in Lebanon, and throughout the land he ruled.',
  },
  '1 Kings 9:21': {
    all: 'Solomon made forced workers from the children of those nations who were still left in the land, because the people of Israel had not destroyed them completely.',
  },
  '1 Kings 9:22': {
    all: 'But Solomon did not make forced workers from the people of Israel. They were his soldiers, servants, leaders, commanders, and officers over his chariots and horsemen.',
  },
  '1 Kings 10:1': {
    all: 'When the queen of Sheba heard about Solomon\'s fame, because of the name of the Lord, she came to test him with hard questions.',
  },
  '1 Kings 10:2': {
    all: 'She came to Jerusalem with a very great caravan. Camels carried spices, much gold, and precious stones. When she came to Solomon, she spoke with him about everything in her heart.',
  },
  '1 Kings 10:5': {
    all: 'She saw the food on his table, how his servants sat and served, the clothes they wore, his cupbearers, and the way he went up to the Lord\'s house. She was so amazed that it took her breath away.',
  },
  '1 Kings 10:7': {
    all: 'I did not believe the reports until I came and saw with my own eyes. Look, I had not even been told half of it! Your wisdom and wealth are greater than the report I heard.',
  },
  '1 Kings 10:8': {
    all: 'How happy are your men! How happy are these servants of yours, who stand before you continually and hear your wisdom!',
  },
  '1 Kings 10:9': {
    all: 'Blessed be the Lord your God, who delighted in you and set you on Israel\'s throne. Because the Lord loved Israel forever, he made you king to do justice and righteousness."',
  },
  '1 Kings 10:13': {
    all: 'King Solomon gave the queen of Sheba everything she desired and asked for, besides the gifts he gave her from his royal wealth. Then she and her servants turned and went back to her own land.',
  },
  '1 Kings 10:19': {
    all: 'The throne had six steps. Its back was rounded at the top, with armrests on both sides of the seat and two lions standing beside the armrests.',
  },
  '1 Kings 10:20': {
    all: 'Twelve lions stood on the six steps, one on each side of every step. No other kingdom had made anything like it.',
  },
  '1 Kings 10:25': {
    all: 'Year after year, each visitor brought gifts: silver bowls and tools, gold bowls and tools, clothing, armor, spices, horses, and mules.',
  },
  '1 Kings 11:1': {
    all: 'King Solomon loved many foreign women, along with Pharaoh\'s daughter: women from Moab, Ammon, Edom, Sidon, and the Hittites.',
  },
  '1 Kings 11:2': {
    all: 'They came from the nations about whom the Lord had told the people of Israel, "You must not marry them, and they must not marry you, because they will surely turn your heart after their gods." Solomon held fast to these women in love.',
  },
  '1 Kings 11:4': {
    all: 'When Solomon was old, his wives turned his heart after other gods. His heart was not wholly devoted to the Lord his God, as David his father\'s heart had been.',
  },
  '1 Kings 11:9': {
    all: 'The Lord was angry with Solomon, because his heart had turned away from the Lord, the God of Israel, who had appeared to him twice.',
  },
  '1 Kings 11:10': {
    all: 'The Lord had commanded Solomon not to follow false gods, but Solomon did not keep what the Lord commanded.',
  },
  '1 Kings 11:11': {
    all: 'So the Lord said to Solomon, "Because this has been in your heart, and you have not kept my covenant and my statutes that I commanded you, I will surely tear the kingdom from you and give it to your servant.',
  },
  '1 Kings 11:31': {
    all: 'Ahijah said to Jeroboam, "Take ten pieces for yourself, because the Lord, the God of Israel, says, \'Look, I will tear the kingdom out of Solomon\'s hand and give ten tribes to you.',
  },
  '1 Kings 11:33': {
    all: 'The Lord said this because they had forsaken him and worshiped Ashtoreth, the goddess of the Sidonians, Chemosh, the god of Moab, and Milcom, the god of the Ammonites. They had not walked in his ways or done what was right in his eyes, and they had not kept his laws and rules as David had done.',
  },
  '1 Kings 11:20': {
    all: 'Tahpenes\'s sister gave birth to Hadad\'s son Genubath, and Tahpenes weaned him in Pharaoh\'s house. Genubath lived in Pharaoh\'s house among Pharaoh\'s sons.',
  },
  '1 Kings 11:22': {
    all: 'Pharaoh said to Hadad, "What have you lacked while you were with me? Why do you want to go back to your own country?" Hadad answered, "Nothing, but please let me go."',
  },
  '1 Kings 11:25': {
    all: 'Rezon was an enemy of Israel all the days of Solomon, besides the trouble Hadad caused. He hated Israel and ruled over Syria.',
  },
  '1 Kings 11:29': {
    all: 'At that time, Jeroboam went out of Jerusalem. The prophet Ahijah from Shiloh met him on the road. Ahijah was wearing a new cloak, and the two of them were alone in the field.',
  },
  '1 Kings 11:30': {
    all: 'Ahijah took the new cloak he was wearing and tore it into twelve pieces.',
  },
  '1 Kings 12:4': {
    all: 'The people said, "Your father made our yoke heavy. Now lighten the hard service of your father and the heavy yoke he put on us, and we will serve you."',
  },
  '1 Kings 12:2': {
    all: 'Jeroboam son of Nebat heard about this while he was still in Egypt. He had run away from King Solomon and had been living there.',
  },
  '1 Kings 12:3': {
    all: 'The people sent for Jeroboam. Then Jeroboam and all the assembly of Israel came and spoke to Rehoboam.',
  },
  '1 Kings 12:10': {
    all: 'The young men who had grown up with Rehoboam said, "Tell the people, \'My little finger is thicker than my father\'s waist.',
  },
  '1 Kings 12:11': {
    all: 'My father put a heavy yoke on you, but I will add to your yoke. My father disciplined you with whips, but I will discipline you with scorpion-like whips.\'"',
  },
  '1 Kings 12:13': {
    all: 'The king answered the people harshly. He rejected the advice the elders had given him.',
  },
  '1 Kings 12:14': {
    all: 'He spoke to them according to the advice of the young men, saying, "My father made your yoke heavy, but I will add to your yoke. My father disciplined you with whips, but I will discipline you with scorpion-like whips."',
  },
  '1 Kings 12:15': {
    all: 'So the king did not listen to the people. This came about from the Lord, so the Lord would establish the word he had spoken by Ahijah the Shilonite to Jeroboam son of Nebat.',
  },
  '1 Kings 12:16': {
    all: 'When all Israel saw that the king did not listen to them, the people answered the king, "What share do we have in David? We have no inheritance in the son of Jesse. To your tents, Israel! Now look to your own house, David!" So Israel went to their tents.',
  },
  '1 Kings 12:20': {
    all: 'When all Israel heard that Jeroboam had returned, they called him to the assembly and made him king over all Israel. No one followed David\'s house except the tribe of Judah.',
  },
  '1 Kings 12:18': {
    all: 'Then King Rehoboam sent Adoram, who was over the forced labor. All Israel stoned him to death. King Rehoboam hurried into his chariot and ran away to Jerusalem.',
  },
  '1 Kings 12:24': {
    all: 'The Lord says, "You must not go up and fight against your brothers, the people of Israel. Everyone return to his house, because this thing is from me." So they listened to the Lord\'s word and returned home, according to the Lord\'s word.',
  },
  '1 Kings 12:28': {
    all: 'So the king took counsel and made two calves of gold. He said to the people, "It is too much for you to go up to Jerusalem. Look, Israel, here are your gods who brought you up out of Egypt."',
  },
  '1 Kings 12:30': {
    all: 'This led Israel into sin, because the people went to worship before one calf at Bethel and the other calf as far away as Dan.',
  },
  '1 Kings 12:31': {
    all: 'Jeroboam made shrines at the worship places on hills, and he made priests from among all kinds of people, not from the sons of Levi.',
  },
  '1 Kings 13:2': {
    all: 'The man cried against the altar by the Lord\'s word and said, "Altar, altar! The Lord says: Look, a son named Josiah will be born to David\'s house. On you he will sacrifice the priests of the high worship places who burn offerings on you, and human bones will be burned on you."',
  },
  '1 Kings 13:18': {
    all: 'The old prophet said to him, "I also am a prophet like you. An angel spoke to me by the Lord\'s word, saying, \'Bring him back with you into your house, so he may eat bread and drink water.\'" But he lied to him.',
  },
  '1 Kings 13:26': {
    all: 'When the prophet who had brought him back from the way heard it, he said, "It is the man of God who disobeyed the Lord\'s command. Therefore the Lord has given him to the lion, which has torn him and killed him, according to the Lord\'s word."',
  },
  '1 Kings 13:33': {
    all: 'Even after this, Jeroboam did not turn back from his evil way. He again made priests for the worship places on hills from among all the people. Whoever wanted to be a priest, Jeroboam set him apart for those worship places.',
  },
  '1 Kings 13:34': {
    all: 'This sin brought guilt on Jeroboam\'s house, and it led to his house being cut off and wiped from the earth.',
  },
  '1 Kings 14:8': {
    all: 'I tore the kingdom away from David\'s house and gave it to you. Yet you have not been like my servant David, who kept my commandments and followed me with all his heart, doing only what was right in my eyes.',
  },
  '1 Kings 14:9': {
    all: 'But you have done more evil than all who were before you. You have made other gods and metal images for yourself, making me angry, and you have pushed me behind your back.',
  },
  '1 Kings 14:10': {
    all: 'Therefore, look, I will bring disaster on Jeroboam\'s house. I will remove every male from Jeroboam\'s family in Israel, and I will sweep away Jeroboam\'s house like waste until it is all gone.',
  },
  '1 Kings 14:11': {
    all: 'Anyone from Jeroboam\'s family who dies in the city will be eaten by dogs, and anyone who dies in the field will be eaten by the birds of the sky, because the Lord has spoken it."',
  },
  '1 Kings 14:12': {
    all: 'Now get up and go to your house. When your feet enter the city, the child will die.',
  },
  '1 Kings 14:13': {
    all: 'All Israel will mourn for him and bury him. He alone from Jeroboam\'s family will be buried, because the Lord, the God of Israel, found something good in him in Jeroboam\'s house.',
  },
  '1 Kings 14:31': {
    all: 'Rehoboam died and was buried with his fathers in David\'s city. His mother\'s name was Naamah the Ammonite woman. Abijam his son ruled in his place.',
  },
  '1 Kings 14:28': {
    all: 'Whenever the king went into the Lord\'s house, the guards carried the shields and then brought them back to the guard room.',
  },
  '1 Kings 15:3': {
    all: 'Abijam walked in all the sins his father had done before him. His heart was not wholly devoted to the Lord his God, as David his father\'s heart had been.',
  },
  '1 Kings 15:11': {
    all: 'Asa did what was right in the Lord\'s eyes, as David his father had done.',
  },
  '1 Kings 15:15': {
    all: 'Asa brought into the Lord\'s house the silver, gold, bowls, and tools that his father had set apart, and the things he himself had set apart.',
  },
  '1 Kings 15:18': {
    all: 'Then Asa took all the silver and gold left in the treasuries of the Lord\'s house and the king\'s house. He placed them in the hands of his servants and sent them to Ben Hadad king of Syria, who lived in Damascus.',
  },
  '1 Kings 16:30': {
    all: 'Ahab son of Omri did what was evil in the Lord\'s sight, more than all who were before him.',
  },
  '1 Kings 16:3': {
    all: 'Look, I will sweep away Baasha and his house. I will make your house like the house of Jeroboam son of Nebat.',
  },
  '1 Kings 16:4': {
    all: 'Baasha\'s descendants who die in the city will be eaten by dogs, and those who die in the field will be eaten by the birds of the sky."',
  },
  '1 Kings 16:31': {
    all: 'As if it were a small thing for him to walk in the sins of Jeroboam son of Nebat, Ahab took Jezebel daughter of Ethbaal, king of the Sidonians, as his wife. He went and served Baal and worshiped him.',
  },
  '1 Kings 17:1': {
    all: 'Elijah the Tishbite, from the settlers of Gilead, said to Ahab, "As the Lord, the God of Israel, lives, before whom I stand, there will be no dew or rain these years except by my word."',
  },
  '1 Kings 17:6': {
    all: 'The ravens brought Elijah bread and meat in the morning and bread and meat in the evening, and he drank from the brook.',
  },
  '1 Kings 17:8': {
    all: 'The Lord\'s word came to Elijah, saying,',
  },
  '1 Kings 17:9': {
    all: '"Get up, go to Zarephath, which belongs to Sidon, and stay there. Look, I have commanded a widow there to provide food for you."',
  },
  '1 Kings 17:10': {
    all: 'So Elijah got up and went to Zarephath. When he came to the city gate, look, a widow was there gathering sticks. He called to her and said, "Please bring me a little water in a jar, so I may drink."',
  },
  '1 Kings 17:11': {
    all: 'As she was going to get it, he called to her and said, "Please bring me a small piece of bread in your hand."',
  },
  '1 Kings 17:12': {
    all: 'She said, "As the Lord your God lives, I do not have bread baked. I have only a handful of flour in a jar and a little oil in a jar. Look, I am gathering two sticks so I can go in and make it for myself and my son, that we may eat it and then die."',
  },
  '1 Kings 17:13': {
    all: 'Elijah said to her, "Do not be afraid. Go and do as you said, but first make me a little cake of bread from it and bring it to me. After that, make some for yourself and your son.',
  },
  '1 Kings 17:14': {
    all: 'For the Lord, the God of Israel, says, "The jar of flour will not run out, and the jar of oil will not become empty, until the day the Lord sends rain on the earth."',
  },
  '1 Kings 17:15': {
    all: 'She went and did what Elijah said. She, Elijah, and her household had food for many days.',
  },
  '1 Kings 17:16': {
    all: 'The jar of flour did not run out, and the jar of oil did not fail, according to the Lord\'s word that he spoke by Elijah.',
  },
  '1 Kings 17:17': {
    all: 'After these things, the widow\'s son became sick. The sickness became so heavy that he stopped breathing and died.',
  },
  '1 Kings 17:22': {
    all: 'The Lord listened to Elijah\'s voice. The child\'s life returned to him, and he lived.',
  },
  '1 Kings 17:18': {
    all: 'She said to Elijah, "What do you have against me, man of God? Have you come to remind me of my sin and to make my son die?"',
  },
  '1 Kings 17:19': {
    all: 'Elijah said to her, "Give me your son." He took him from her arms, carried him up into the room where he was staying, and laid him on his own bed.',
  },
  '1 Kings 17:20': {
    all: 'He cried to the Lord and said, "Lord my God, have you brought sorrow even on the widow I am staying with, by letting her son die?"',
  },
  '1 Kings 17:21': {
    all: 'He stretched himself over the child three times and cried to the Lord, saying, "Lord my God, please let this child\'s life return to him."',
  },
  '1 Kings 17:23': {
    all: 'Elijah took the child, brought him down from the room into the house, and gave him to his mother. Elijah said, "Look, your son is alive."',
  },
  '1 Kings 18:21': {
    all: 'Elijah came near to all the people and said, "How long will you limp between two opinions? If the Lord is God, follow him. But if Baal is God, follow him." The people did not answer him a word.',
  },
  '1 Kings 18:4': {
    all: 'When Jezebel was killing the Lord\'s prophets, Obadiah took one hundred prophets and hid them in two caves, fifty in each cave. He fed them with bread and water.',
  },
  '1 Kings 18:9': {
    all: 'Obadiah said, "How have I sinned, that you would hand me over to Ahab so he can kill me?',
  },
  '1 Kings 18:23': {
    all: 'Let them give us two bulls. Let Baal\'s prophets choose one bull for themselves, prepare it, and lay it on the wood, but put no fire under it. I will prepare the other bull and lay it on the wood, but put no fire under it.',
  },
  '1 Kings 18:24': {
    all: 'Then call on the name of your god, and I will call on the name of the Lord. The God who answers by fire, he is God." All the people answered, "That is a good word."',
  },
  '1 Kings 18:25': {
    all: 'Elijah said to the prophets of Baal, "Choose one bull for yourselves and prepare it first, because there are many of you. Call on the name of your god, but put no fire under it."',
  },
  '1 Kings 18:26': {
    all: 'They took the bull given to them, prepared it, and called on Baal from morning until noon, saying, "Baal, answer us!" But no voice came, and no one answered. They leaped around the altar they had made.',
  },
  '1 Kings 18:28': {
    all: 'They cried loudly and hurt themselves with knives and spears, as their false worship taught them to do, until blood flowed on them.',
  },
  '1 Kings 18:29': {
    all: 'After midday, they kept speaking wildly until the time of the evening offering. Still there was no voice, no answer, and no one paid attention.',
  },
  '1 Kings 18:32': {
    all: 'With the stones, Elijah built an altar in the Lord\'s name. Then he dug a trench around the altar, large enough to hold about two measures of seed.',
  },
  '1 Kings 18:36': {
    all: 'At the time of the evening offering, Elijah the prophet came near and said, "Lord, God of Abraham, Isaac, and Israel, let it be known today that you are God in Israel, that I am your servant, and that I have done all these things at your word.',
  },
  '1 Kings 18:37': {
    all: 'Answer me, Lord, answer me, so this people may know that you, Lord, are God, and that you have turned their hearts back."',
  },
  '1 Kings 18:38': {
    all: 'Then the Lord\'s fire fell. It burned up the offering, the wood, the stones, and the dust, and it licked up the water in the trench.',
  },
  '1 Kings 18:39': {
    all: 'When all the people saw it, they fell on their faces and said, "The Lord, he is God! The Lord, he is God!"',
  },
  '1 Kings 18:40': {
    all: 'Elijah said to them, "Seize the prophets of Baal! Do not let one escape!" They seized them, and Elijah brought them down to the brook Kishon and put them to death there.',
  },
  '1 Kings 18:44': {
    all: 'On the seventh time, the servant said, "Look, a little cloud like a man\'s hand is rising from the sea." Elijah said, "Go tell Ahab, \'Prepare your chariot and go down, so the rain does not stop you.\'"',
  },
  '1 Kings 18:43': {
    all: 'Elijah said to his servant, "Go up now and look toward the sea." The servant went, looked, and said, "There is nothing." Elijah said, "Go again." This happened seven times.',
  },
  '1 Kings 18:46': {
    all: 'The Lord\'s hand was on Elijah. Elijah tucked his cloak into his belt and ran ahead of Ahab to the entrance of Jezreel.',
  },
  '1 Kings 19:4': {
    all: 'Elijah went a day\'s journey into the wilderness. He sat down under a broom tree and asked that he might die, saying, "It is enough. Now, Lord, take my life, for I am no better than my fathers."',
  },
  '1 Kings 19:11': {
    all: 'The Lord said, "Go out and stand on the mountain before the Lord." Look, the Lord passed by. A great and strong wind tore the mountains and broke rocks in pieces before the Lord, but the Lord was not in the wind. After the wind came an earthquake, but the Lord was not in the earthquake.',
  },
  '1 Kings 19:12': {
    all: 'After the earthquake came a fire, but the Lord was not in the fire. After the fire came a sound of a gentle whisper.',
  },
  '1 Kings 19:13': {
    all: 'When Elijah heard it, he wrapped his face in his cloak, went out, and stood at the entrance of the cave. Look, a voice came to him and said, "What are you doing here, Elijah?"',
  },
  '1 Kings 19:14': {
    all: 'Elijah said, "I have cared deeply for the Lord, the God of Armies. The people of Israel have forsaken your covenant, thrown down your altars, and killed your prophets with the sword. I am the only one left, and they are trying to take my life."',
  },
  '1 Kings 19:18': {
    all: 'Yet I will leave seven thousand in Israel, all whose knees have not bowed to Baal and every mouth that has not kissed him."',
  },
  '1 Kings 19:17': {
    all: 'Whoever escapes from Hazael\'s sword, Jehu will put to death; and whoever escapes from Jehu\'s sword, Elisha will put to death.',
  },
  '1 Kings 19:19': {
    all: 'So Elijah left there and found Elisha son of Shaphat. Elisha was plowing with twelve pairs of oxen, and he was with the twelfth pair. Elijah went over to him and put his prophet\'s cloak on him.',
  },
  '1 Kings 20:13': {
    all: 'A prophet came near to Ahab king of Israel and said, "The Lord says, \'Have you seen all this great crowd? Look, I will give it into your hand today, and you will know that I am the Lord.\'"',
  },
  '1 Kings 20:14': {
    all: 'Ahab asked, "Who will do this?" The prophet said, "The Lord says, \'The young servants of the district leaders will do it.\'" Then Ahab asked, "Who will begin the battle?" The prophet answered, "You."',
  },
  '1 Kings 20:15': {
    all: 'Ahab counted the young servants of the district leaders. There were two hundred thirty-two. After that, he counted all the people of Israel, seven thousand in all.',
  },
  '1 Kings 20:16': {
    all: 'They went out at noon, while Ben Hadad and the thirty-two kings helping him were drinking themselves drunk in the tents.',
  },
  '1 Kings 20:17': {
    all: 'The young servants of the district leaders went out first. Ben Hadad sent scouts, and they came back saying, "Men are coming out from Samaria."',
  },
  '1 Kings 20:6': {
    all: 'But tomorrow about this time, I will send my servants to you. They will search your house and your servants\' houses, and they will take away whatever is pleasing to you."',
  },
  '1 Kings 20:23': {
    all: 'The servants of the king of Syria said to him, "Their God is a God of the hills, so they were stronger than we were. But if we fight them on the flat land, surely we will be stronger than they are.',
  },
  '1 Kings 20:24': {
    all: 'Do this: remove the kings from their places and put commanders in their places.',
  },
  '1 Kings 20:27': {
    all: 'The people of Israel were counted, given food, and went out to meet them. The people of Israel camped before them like two little flocks of goats, but the Syrians filled the land.',
  },
  '1 Kings 20:31': {
    all: 'Ben Hadad\'s servants said to him, "Look, we have heard that the kings of Israel are merciful kings. Let us put rough cloth on our bodies and ropes on our heads and go out to the king of Israel. Maybe he will spare your life."',
  },
  '1 Kings 20:10': {
    all: 'Ben Hadad sent another message to Ahab: "May the gods punish me severely if there is enough dust in Samaria for each of my followers to take a handful."',
  },
  '1 Kings 20:9': {
    all: 'Ahab said to Ben Hadad\'s messengers, "Tell my lord the king, \'Everything you first demanded from your servant I will do, but this thing I cannot do.\'" So the messengers went back and brought him the answer.',
  },
  '1 Kings 20:11': {
    all: 'The king of Israel answered, "Tell him, \'A man putting on his armor should not brag like a man taking it off after the battle.\'"',
  },
  '1 Kings 20:12': {
    all: 'Ben Hadad heard this message while he and the kings were drinking in their tents. He said to his servants, "Prepare to attack!" So they prepared to attack the city.',
  },
  '1 Kings 20:28': {
    all: 'A man of God came near and spoke to the king of Israel. He said, "The Lord says, \'Because the Arameans have said, "The Lord is a god of the hills but not a god of the valleys," I will give all this great crowd into your hand, and you will know that I am the Lord.\'"',
  },
  '1 Kings 21:3': {
    all: 'Naboth said to Ahab, "May the Lord forbid that I should give you the inheritance of my fathers."',
  },
  '1 Kings 21:7': {
    all: 'Jezebel his wife said to him, "Do you now rule the kingdom of Israel? Get up, eat bread, and let your heart be cheerful. I will give you Naboth the Jezreelite\'s vineyard."',
  },
  '1 Kings 21:4': {
    all: 'Ahab came into his house gloomy and angry because Naboth the Jezreelite had said, "I will not give you the inheritance of my fathers." Ahab lay down on his bed, turned his face away, and would not eat.',
  },
  '1 Kings 21:9': {
    all: 'In the letters she wrote, "Announce a fast, and seat Naboth in an important place among the people.',
  },
  '1 Kings 21:10': {
    all: 'Seat two evil men across from him, and let them testify against him, saying, \'You cursed God and the king!\' Then carry him out and stone him to death."',
  },
  '1 Kings 21:13': {
    all: 'The two worthless men came in and sat before Naboth. They testified against Naboth in front of the people, saying, "Naboth cursed God and the king!" Then they carried him outside the city and stoned him to death.',
  },
  '1 Kings 21:17': {
    all: 'Then the Lord\'s word came to Elijah the Tishbite, saying,',
  },
  '1 Kings 21:20': {
    all: 'Ahab said to Elijah, "Have you found me, my enemy?" Elijah answered, "I have found you, because you have sold yourself to do what is evil in the Lord\'s sight.',
  },
  '1 Kings 21:19': {
    all: 'You must speak to him, saying, \'The Lord says, "Have you killed and also taken possession?"\' Then you must say to him, \'The Lord says, "In the place where dogs licked Naboth\'s blood, dogs will also lick your blood."\'"',
  },
  '1 Kings 21:21': {
    all: 'Look, I will bring disaster on you. I will sweep you away and remove every male from Ahab\'s family in Israel.',
  },
  '1 Kings 21:22': {
    all: 'I will make your house like the house of Jeroboam son of Nebat and like the house of Baasha son of Ahijah, because you have made me angry and have made Israel sin."',
  },
  '1 Kings 21:23': {
    all: 'The Lord also spoke about Jezebel, saying, "The dogs will eat Jezebel by the wall of Jezreel.',
  },
  '1 Kings 21:24': {
    all: 'Anyone from Ahab\'s house who dies in the city will be eaten by dogs, and anyone who dies in the field will be eaten by the birds of the sky."',
  },
  '1 Kings 21:25': {
    all: 'There was no one like Ahab, who sold himself to do what was evil in the Lord\'s sight, because Jezebel his wife stirred him up.',
  },
  '1 Kings 21:26': {
    all: 'Ahab acted in a very detestable way by following idols, just like the Amorites whom the Lord drove out before the people of Israel.',
  },
  '1 Kings 21:27': {
    all: 'When Ahab heard those words, he tore his clothes, put sackcloth on his body, fasted, lay in sackcloth, and went around quietly.',
  },
  '1 Kings 21:28': {
    all: 'The Lord\'s word came to Elijah the Tishbite, saying,',
  },
  '1 Kings 21:29': {
    all: 'The Lord said, "Do you see how Ahab humbles himself before me? Because he humbles himself before me, I will not bring the disaster in his days. I will bring the disaster on his house in his son\'s days."',
  },
  '1 Kings 22:14': {
    all: 'Micaiah said, "As the Lord lives, what the Lord says to me, that I will speak."',
  },
  '1 Kings 22:3': {
    all: 'The king of Israel said to his servants, "You know Ramoth Gilead belongs to us, but we are sitting here and doing nothing to take it back from the king of Syria."',
  },
  '1 Kings 22:6': {
    all: 'Then the king of Israel gathered about four hundred prophets and asked them, "Should I go fight for Ramoth Gilead, or should I hold back?" They said, "Go up, for the Lord will give it into the king\'s hand."',
  },
  '1 Kings 22:8': {
    all: 'The king of Israel said to Jehoshaphat, "There is still one man by whom we may ask the Lord: Micaiah son of Imlah. But I hate him, because he never speaks good messages about me, only disaster." Jehoshaphat said, "The king should not say that."',
  },
  '1 Kings 22:10': {
    all: 'The king of Israel and Jehoshaphat king of Judah sat on their thrones, wearing their royal robes, in an open place at the gate of Samaria. All the prophets were speaking before them.',
  },
  '1 Kings 22:11': {
    all: 'Zedekiah son of Chenaanah made iron horns for himself and said, "The Lord says, \'With these you will push the Syrians until they are destroyed.\'"',
  },
  '1 Kings 22:12': {
    all: 'All the prophets spoke the same way, saying, "Go up to Ramoth Gilead and succeed, for the Lord will give it into the king\'s hand."',
  },
  '1 Kings 22:15': {
    all: 'When Micaiah came to the king, the king asked him, "Micaiah, should we go to Ramoth Gilead for battle, or should we hold back?" Micaiah answered, "Go up and succeed, and the Lord will give it into the king\'s hand."',
  },
  '1 Kings 22:16': {
    all: 'The king said to him, "How many times must I make you swear to tell me nothing but the truth in the Lord\'s name?"',
  },
  '1 Kings 22:17': {
    all: 'Micaiah said, "I saw all Israel scattered on the mountains like sheep with no shepherd. The Lord said, \'These people have no master. Let each one return home in peace.\'"',
  },
  '1 Kings 22:18': {
    all: 'The king of Israel said to Jehoshaphat, "Didn\'t I tell you he would not speak good messages about me, but only disaster?"',
  },
  '1 Kings 22:19': {
    all: 'Micaiah said, "Therefore hear the Lord\'s word. I saw the Lord sitting on his throne, and all heaven\'s army standing by him on his right and on his left.',
  },
  '1 Kings 22:20': {
    all: 'The Lord said, "Who will persuade Ahab, so that he will go up and fall at Ramoth Gilead?" One said one thing, and another said another.',
  },
  '1 Kings 22:21': {
    all: 'Then a spirit came out and stood before the Lord, saying, "I will persuade him."',
  },
  '1 Kings 22:22': {
    all: 'The Lord said to him, "How?" He said, "I will go out and be a lying spirit in the mouth of all his prophets." The Lord said, "You will persuade him, and you will succeed. Go out and do so."',
  },
  '1 Kings 22:23': {
    all: 'Now look, the Lord has put a lying spirit in the mouth of all these prophets of yours, and the Lord has announced disaster for you."',
  },
  '1 Kings 22:27': {
    all: 'Say, "The king says, \'Put this man in prison. Give him only hard prison bread and water until I come back in peace.\'"',
  },
  '1 Kings 22:34': {
    all: 'But a certain man drew his bow without aiming at anyone in particular and struck the king of Israel between the joints of his armor. Ahab said to the driver of his chariot, "Turn around and carry me out of the battle, for I am wounded."',
  },
  '1 Kings 22:37': {
    all: 'So the king died and was brought to Samaria. They buried the king in Samaria.',
  },
  '1 Kings 22:38': {
    all: 'They washed the chariot by the pool of Samaria, and the dogs licked up Ahab\'s blood, as the Lord\'s word had said.',
  },
  '1 Kings 22:36': {
    all: 'As the sun was going down, a cry ran through the army: "Every man back to his city! Every man back to his land!"',
  },
  '1 Kings 22:49': {
    all: 'Then Ahaziah son of Ahab said to Jehoshaphat, "Let my servants sail with your servants in the ships." But Jehoshaphat would not allow it.',
  },
  '1 Kings 22:50': {
    all: 'Jehoshaphat died and was buried with his fathers in the city of David his father. Jehoram his son ruled in his place.',
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

  text = applyKingsReplacements(text, ageRange)
  return polishKidReadableText(finalPolish(text), ageRange)
}

function applyKingsReplacements(source, ageRange) {
  let text = source
    .replace(/\bYahweh of Armies\b/g, 'the Lord of Armies')
    .replace(/\bYahweh\b/g, 'the Lord')
    .replace(/\bchildren of Israel\b/gi, 'people of Israel')
    .replace(/\bIsraelites\b/g, 'people of Israel')
    .replace(/\bIsraelite\b/g, 'person of Israel')
    .replace(/\bchildren of Ammon\b/g, 'Ammonites')
    .replace(/\bchildren of Judah\b/g, 'people of Judah')
    .replace(/\bchildren of Benjamin\b/g, 'people of Benjamin')
    .replace(/\bchildren of the east\b/g, 'people of the east')
    .replace(/\bsons of the prophets\b/g, 'company of prophets')
    .replace(/\bson of perdition\b/g, 'evil man')
    .replace(/\bman of God\b/g, 'man of God')
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
    .replace(/\blay with her\b/g, 'sinned with her as if she were his wife')
    .replace(/\blay with\b/g, 'slept with')
    .replace(/\blie with\b/g, 'sleep with')
    .replace(/\bwent in to her\b/g, 'took her as his wife')
    .replace(/\bprostitutes\b/g, 'women living in sexual sin')
    .replace(/\bprostitute\b/g, 'woman living in sexual sin')
    .replace(/\bharlots\b/g, 'women living in sexual sin')
    .replace(/\bharlot\b/g, 'woman living in sexual sin')
    .replace(/\bsodomites\b/g, 'people doing sexual sin in idol worship')
    .replace(/\bsodomite\b/g, 'person doing sexual sin in idol worship')
    .replace(/\bperverted persons\b/g, 'people doing sexual sin in idol worship')
    .replace(/\biniquity\b/g, 'sin')
    .replace(/\biniquities\b/g, 'sins')
    .replace(/\btransgressed\b/g, 'sinned')
    .replace(/\btransgression\b/g, 'sin')
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
    .replace(/\bperpetually\b/g, 'always')
    .replace(/\bloving kindness\b/g, 'faithful kindness')
    .replace(/\btook counsel with\b/g, 'asked advice from')
    .replace(/\btook counsel\b/g, 'asked advice')
    .replace(/\bcounsel\b/g, 'advice')
    .replace(/\bold men\b/g, 'elders')
    .replace(/\byet lived\b/g, 'was still alive')
    .replace(/\bDepart for\b/g, 'Go away for')
    .replace(/\bwickedness\b/g, 'evil')
    .replace(/\bwicked\b/g, 'evil')
    .replace(/\bwickedly\b/g, 'in an evil way')
    .replace(/\bdetestable things\b/g, 'hateful sins')
    .replace(/\babominations\b/g, 'detestable sins')
    .replace(/\babomination\b/g, 'detestable sin')
    .replace(/\babominable\b/g, 'detestable')
    .replace(/\bAsherah\b/g, 'Asherah idol')
    .replace(/\bAsheroth\b/g, 'Asherah idols')
    .replace(/\bBaalim\b/g, 'Baals')
    .replace(/\bhigh places\b/g, 'high worship places')
    .replace(/\bhigh place\b/g, 'high worship place')
    .replace(/\bidols\b/g, 'idols')
    .replace(/\bidol\b/g, 'idol')
    .replace(/\bother gods\b/g, 'false gods')
    .replace(/\bmolten images\b/g, 'metal images')
    .replace(/\bmolten image\b/g, 'metal image')
    .replace(/\bmolten bronze\b/g, 'bronze made in molds')
    .replace(/\bmolten sea\b/g, 'huge round bronze basin')
    .replace(/\bsea of cast metal\b/g, 'huge round bronze basin')
    .replace(/\blavers\b/g, 'large washbasins')
    .replace(/\blaver\b/g, 'large washbasin')
    .replace(/\bbasins\b/g, 'bowls')
    .replace(/\bbasin\b/g, 'bowl')
    .replace(/\bchapiters\b/g, 'pillar tops')
    .replace(/\bchapiter\b/g, 'pillar top')
    .replace(/\bcapitals\b/g, 'pillar tops')
    .replace(/\bcapital\b/g, 'pillar top')
    .replace(/\bknops\b/g, 'round decorations')
    .replace(/\bknop\b/g, 'round decoration')
    .replace(/\bpomegranates\b/g, 'pomegranate decorations')
    .replace(/\bpomegranate\b/g, 'pomegranate decoration')
    .replace(/\bpalm trees\b/g, 'palm tree carvings')
    .replace(/\bpalm tree\b/g, 'palm tree carving')
    .replace(/\bcherubims\b/g, 'cherubim')
    .replace(/\bcherubim\b/g, 'cherubim, mighty heavenly creatures')
    .replace(/\boracle\b/g, 'inner room')
    .replace(/\bOracle\b/g, 'Inner Room')
    .replace(/\bMost Holy Place\b/g, 'Most Holy Place')
    .replace(/\bHoly of Holies\b/g, 'Most Holy Place')
    .replace(/\bporch\b/g, 'entry room')
    .replace(/\bvestibule\b/g, 'entry room')
    .replace(/\bthreshold\b/g, 'doorway')
    .replace(/\bside rooms\b/g, 'side rooms')
    .replace(/\bside room\b/g, 'side room')
    .replace(/\bcedar beams\b/g, 'cedar beams')
    .replace(/\bcypress\b/g, 'cypress')
    .replace(/\bfir\b/g, 'cypress')
    .replace(/\balmug\b/g, 'special almug')
    .replace(/\bephod\b/g, 'priestly vest')
    .replace(/\bturban\b/g, 'head covering')
    .replace(/\bsashes\b/g, 'belts')
    .replace(/\bsash\b/g, 'belt')
    .replace(/\bgarments\b/g, 'clothes')
    .replace(/\bgarment\b/g, 'clothing')
    .replace(/\bmantle\b/g, 'cloak')
    .replace(/\bAmmonitess\b/g, 'Ammonite woman')
    .replace(/\bpavilions\b/g, 'tents')
    .replace(/\bpavilion\b/g, 'tent')
    .replace(/\bmustered\b/g, 'counted')
    .replace(/\bmuster\b/g, 'count')
    .replace(/\bprovinces\b/g, 'districts')
    .replace(/\bprovince\b/g, 'district')
    .replace(/\bvessels\b/g, 'containers')
    .replace(/\bvessel\b/g, 'container')
    .replace(/\bbrass\b/g, 'bronze')
    .replace(/\bbrazen\b/g, 'bronze')
    .replace(/\btalents\b/g, 'large weights')
    .replace(/\btalent\b/g, 'large weight')
    .replace(/\bshekels\b/g, 'silver pieces')
    .replace(/\bshekel\b/g, 'silver piece')
    .replace(/\bcubits\b/g, 'arm-lengths')
    .replace(/\bcubit\b/g, 'arm-length')
    .replace(/\bbaths\b/g, 'large liquid measures')
    .replace(/\bbath\b/g, 'large liquid measure')
    .replace(/\bcors\b/g, 'large dry measures')
    .replace(/\bcor\b/g, 'large dry measure')
    .replace(/\bseahs\b/g, 'small dry measures')
    .replace(/\bseah\b/g, 'small dry measure')
    .replace(/\bmeasures of fine flour\b/g, 'measured amounts of fine flour')
    .replace(/\bhyssop\b/g, 'leafy hyssop plant')
    .replace(/\bthose who urinate against a wall\b/g, 'males')
    .replace(/\bone who urinates on a wall\b/g, 'one male')
    .replace(/\bone who urinates against a wall\b/g, 'one male')
    .replace(/\beveryone who urinates on a wall\b/g, 'every male')
    .replace(/\beveryone who urinates against a wall\b/g, 'every male')
    .replace(/\bwho urinates against a wall\b/g, 'male')
    .replace(/\bdung\b/g, 'unclean waste')
    .replace(/\bflesh\b/g, 'body')
    .replace(/\bbosom\b/g, 'arms')
    .replace(/\bmorsel\b/g, 'small piece')
    .replace(/\bmeal\b/g, 'flour')
    .replace(/\bsustain\b/g, 'provide food for')
    .replace(/\bsustained\b/g, 'provided food for')
    .replace(/\bdelivered a child\b/g, 'gave birth to a child')
    .replace(/\bhad ran away\b/g, 'had run away')
    .replace(/\bchastised\b/g, 'disciplined')
    .replace(/\bchastise\b/g, 'discipline')
    .replace(/\bscorpions\b/g, 'whips that sting like scorpions')
    .replace(/\bsullen\b/g, 'gloomy')
    .replace(/\bon high among the people\b/g, 'in an important place among the people')
    .replace(/\bprovocation\b/g, 'anger')
    .replace(/\babominably\b/g, 'in a detestable way')
    .replace(/\babominable\b/g, 'detestable')
    .replace(/\bslain\b/g, 'killed')
    .replace(/\bslay\b/g, 'kill')
    .replace(/\bslew\b/g, 'killed')
    .replace(/\bsmote\b/g, 'struck')
    .replace(/\bsmite\b/g, 'strike')
    .replace(/\bstruck with the edge of the sword\b/g, 'struck down with the sword')
    .replace(/\bslaughter\b/g, 'many deaths')
    .replace(/\bwho bore burdens\b/g, 'who carried heavy loads')
    .replace(/\bwho bore the Lord's ark\b/g, "who carried the Lord's ark")
    .replace(/\bguard bore them\b/g, 'guards carried them')
    .replace(/\bcamels that bore\b/g, 'camels that carried')
    .replace(/\bbore him\b/g, 'gave birth to')
    .replace(/\bfell by the sword\b/g, 'died by the sword')
    .replace(/\bfell on his face\b/g, 'bowed with his face to the ground')
    .replace(/\bfell on their faces\b/g, 'bowed with their faces to the ground')
    .replace(/\bfell to the earth\b/g, 'bowed down to the ground')
    .replace(/\bcast lots\b/g, 'used lots')
    .replace(/\bcast in one piece\b/g, 'made in one mold')
    .replace(/\bcast metal\b/g, 'metal made in molds')
    .replace(/\bof cast metal\b/g, 'made in molds')
    .replace(/\bwere cast\b/g, 'were made in molds')
    .replace(/\bcast them\b/g, 'had them made in molds')
    .replace(/\bcast out\b/g, 'drove out')
    .replace(/\bcast away\b/g, 'threw away')
    .replace(/\bbondservants\b/g, 'forced workers')
    .replace(/\bbondservant\b/g, 'forced worker')
    .replace(/\badjure\b/g, 'make you swear')
    .replace(/\badjured\b/g, 'made you swear')
    .replace(/\bforbear\b/g, 'hold back')
    .replace(/\bentice\b/g, 'persuade')
    .replace(/\benticed\b/g, 'persuaded')
    .replace(/\baffliction\b/g, 'hard trouble')
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
    .replace(/\bthither\b/g, 'there')
    .replace(/\bwhither\b/g, 'where')
    .replace(/\bhither\b/g, 'here')
    .replace(/\blest\b/g, 'or else')
    .replace(/\bperadventure\b/g, 'perhaps')
    .replace(/\bthereof\b/g, 'of it')
    .replace(/\btherein\b/g, 'in it')
    .replace(/\btherewith\b/g, 'with it')
    .replace(/\bservants?\b/g, match => (match === 'servants' ? 'servants' : 'servant'))
    .replace(/\bchief officers\b/g, 'supervisors')
    .replace(/\bchief officer\b/g, 'supervisor')
    .replace(/\bprince\b/g, 'leader')
    .replace(/\bprinces\b/g, 'leaders')
    .replace(/\bchiefs\b/g, 'leaders')
    .replace(/\bchief\b/g, 'leader')
    .replace(/\bcaptains\b/g, 'commanders')
    .replace(/\bcaptain\b/g, 'commander')
    .replace(/\bmen of war\b/g, 'soldiers')
    .replace(/\bman of war\b/g, 'soldier')
    .replace(/\bfootmen\b/g, 'foot soldiers')
    .replace(/\bhorsemen\b/g, 'horsemen')
    .replace(/\bchariots\b/g, 'chariots')
    .replace(/\breign\b/g, 'rule')
    .replace(/\breigned\b/g, 'ruled')
    .replace(/\bslept with his fathers\b/g, 'died and was buried with his fathers')
    .replace(/\bsleep with your fathers\b/g, 'die and be buried with your fathers')
    .replace(/\bgrave\b/g, 'grave')
    .replace(/\bsepulcher\b/g, 'tomb')
    .replace(/\bsepulchre\b/g, 'tomb')
    .replace(/\brooted out\b/g, 'pulled out')
    .replace(/\bthe Lord's word\b/g, "the Lord's word")
    .replace(/\bword of the Lord\b/g, "the Lord's word")
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
      .replace(/\bsecondary wives\b/g, 'other wives')
      .replace(/\bsecondary wife\b/g, 'other wife')
      .replace(/\bcherubim, mighty heavenly creatures\b/g, 'cherubim, mighty heavenly creatures')
      .replace(/\bhigh worship places\b/g, 'worship places on hills')
      .replace(/\bhigh worship place\b/g, 'worship place on a hill')
      .replace(/\bcontainers\b/g, 'bowls and tools')
      .replace(/\bcontainer\b/g, 'bowl or tool')
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
    .replace(/\bcherubim, mighty heavenly creatures, mighty heavenly creatures\b/g, 'cherubim, mighty heavenly creatures')
    .replace(/\bsweet-smelling sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\bpomegranate decoration decorations\b/g, 'pomegranate decorations')
    .replace(/\bpalm tree carving carvings\b/g, 'palm tree carvings')
    .replace(/\blarge measured amounts\b/g, 'large measures')
    .replace(/\bmeasured amounts of fine flour\b/g, 'measures of fine flour')
    .replace(/\bburnished\b/g, 'polished')
    .replace(/\bsnuffers\b/g, 'lamp tools')
    .replace(/\brun away away\b/g, 'run away')
    .replace(/\bthe Lord the Lord\b/g, 'the Lord')
    .replace(/\bdied and was buried with his fathers, and was buried in\b/g, 'died and was buried with his fathers in')
    .replace(/\bdied and was buried with his fathers, and was buried with his fathers in\b/g, 'died and was buried with his fathers in')
    .replace(/\bdied and was buried with her fathers, and was buried in\b/g, 'died and was buried with her fathers in')
    .replace(/\bLord God of Armies\b/g, 'Lord of Armies')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bof of\b/g, 'of')
    .replace(/\bto to\b/g, 'to')
    .replace(/\band and\b/g, 'and')
    .replace(/\byoung unmarried young woman\b/g, 'young unmarried woman')
    .replace(/\bleafy leafy hyssop branch plant plant\b/g, 'little plant')
    .replace(/\bleafy hyssop branch plant plant\b/g, 'little plant')
    .replace(/\bleafy leafy hyssop branch plant\b/g, 'little plant')
    .replace(/\bBarley\b/g, 'barley')
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
