#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { polishKidReadableText } = require('./lib/kids-bible-style');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BOOK = 'leviticus';
const BOOK_NAME = 'Leviticus';
const TESTAMENT = 'old-testament';
const AGE_RANGES = ['5-7', '8-10'];
const CHAPTERS = Array.from({ length: 27 }, (_, index) => index + 1);

const STORY_REVISIONS = {
  'Leviticus 2:1': {
    '5-7': '"When someone brings a grain gift to the Lord, the gift must be fine flour. He must pour oil on it and put sweet-smelling incense on it.',
    '8-10': '"When someone brings a grain offering to the Lord, the offering must be fine flour. He must pour oil on it and put sweet-smelling incense on it.',
  },
  'Leviticus 2:2': {
    '5-7': 'He must bring it to Aaron\'s sons, the priests. The priest must take a handful of the flour and oil, with all the sweet-smelling incense, and burn that part on the altar. It is an offering burned on the altar, a pleasing smell to the Lord.',
    '8-10': 'He must bring it to Aaron\'s sons, the priests. The priest must take a handful of the flour and oil, with all the sweet-smelling incense, and burn that part on the altar. It is an offering burned on the altar, a pleasing aroma to the Lord.',
  },
  'Leviticus 2:3': {
    '5-7': 'The rest of the grain gift belongs to Aaron and his sons. It is a most holy part of the offerings burned for the Lord.',
    '8-10': 'The rest of the grain offering belongs to Aaron and his sons. It is a most holy part of the offerings burned for the Lord.',
  },
  'Leviticus 2:4': {
    '5-7': '"If you bring a grain gift baked in an oven, it must be made of fine flour mixed with oil and no yeast. It may be flat cakes or thin wafers spread with oil.',
    '8-10': '"If you bring a grain offering baked in an oven, it must be made of fine flour mixed with oil and no yeast. It may be flat cakes or thin wafers spread with oil.',
  },
  'Leviticus 2:5': {
    '5-7': 'If your grain gift is cooked on a griddle, it must be made of fine flour mixed with oil and no yeast.',
    '8-10': 'If your grain offering is cooked on a griddle, it must be made of fine flour mixed with oil and no yeast.',
  },
  'Leviticus 2:6': {
    '5-7': 'You must break it into pieces and pour oil on it. It is a grain gift.',
    '8-10': 'You must break it into pieces and pour oil on it. It is a grain offering.',
  },
  'Leviticus 2:7': {
    '5-7': 'If your grain gift is cooked in a pan, it must be made of fine flour with oil.',
    '8-10': 'If your grain offering is cooked in a pan, it must be made of fine flour with oil.',
  },
  'Leviticus 2:8': {
    '5-7': 'You must bring the grain gift made from these things to the Lord. It must be given to the priest, and he must bring it to the altar.',
    '8-10': 'You must bring the grain offering made from these things to the Lord. It must be given to the priest, and he must bring it to the altar.',
  },
  'Leviticus 2:9': {
    '5-7': 'The priest must take from the grain gift the part burned before the Lord and burn it on the altar. It is an offering burned on the altar, a pleasing smell to the Lord.',
    '8-10': 'The priest must take from the grain offering the part burned before the Lord and burn it on the altar. It is an offering burned on the altar, a pleasing aroma to the Lord.',
  },
  'Leviticus 2:10': {
    '5-7': 'The rest of the grain gift belongs to Aaron and his sons. It is a most holy part of the offerings burned for the Lord.',
    '8-10': 'The rest of the grain offering belongs to Aaron and his sons. It is a most holy part of the offerings burned for the Lord.',
  },
  'Leviticus 2:11': {
    '5-7': '"No grain gift you bring to the Lord may be made with yeast. You must not burn any yeast or honey as an offering burned on the altar to the Lord.',
    '8-10': '"No grain offering you bring to the Lord may be made with yeast. You must not burn any yeast or honey as an offering burned on the altar to the Lord.',
  },
  'Leviticus 2:12': {
    '5-7': 'You may bring yeast and honey to the Lord as a firstfruits gift, but they must not be burned on the altar as a pleasing smell.',
    '8-10': 'You may bring yeast and honey to the Lord as a firstfruits offering, but they must not be burned on the altar as a pleasing aroma.',
  },
  'Leviticus 2:13': {
    '5-7': 'You must put salt on every grain gift. Do not leave out the salt of God\'s covenant from your grain gift. Bring salt with all your offerings.',
    '8-10': 'You must put salt on every grain offering. Do not leave out the salt of God\'s covenant from your grain offering. Bring salt with all your offerings.',
  },
  'Leviticus 2:14': {
    '5-7': '"If you bring a grain gift of firstfruits to the Lord, bring fresh heads of grain roasted by fire and crushed.',
    '8-10': '"If you bring a grain offering of firstfruits to the Lord, bring fresh heads of grain roasted by fire and crushed.',
  },
  'Leviticus 2:15': {
    '5-7': 'You must put oil on it and lay sweet-smelling incense on it. It is a grain gift.',
    '8-10': 'You must put oil on it and lay sweet-smelling incense on it. It is a grain offering.',
  },
  'Leviticus 2:16': {
    '5-7': 'The priest must burn part of the crushed grain and oil, with all the sweet-smelling incense, as the part burned before the Lord. It is an offering burned on the altar to the Lord.',
    '8-10': 'The priest must burn part of the crushed grain and oil, with all the sweet-smelling incense, as the part burned before the Lord. It is an offering burned on the altar to the Lord.',
  },
  'Leviticus 5:1': {
    '5-7': 'If someone hears a public call to tell the truth, and he saw what happened or knows about it, he must speak up. If he stays quiet, he is guilty.',
    '8-10': 'If someone hears a public call to testify, and he has seen or knows what happened, he must tell the truth. If he does not speak up, he carries guilt.',
  },
  'Leviticus 5:2': {
    '5-7': 'Or if someone touches something not clean for worship, such as the dead body of an animal, a farm animal, or a small crawling thing that is not clean for worship, and he did not realize it at first, he is guilty when he finds out.',
    '8-10': 'Or if someone touches something unclean, such as the dead body of an unclean animal, livestock, or small crawling thing, and he did not realize it at first, he is guilty when he finds out.',
  },
  'Leviticus 5:3': {
    '5-7': 'Or if someone touches anything from a person that makes him not clean for worship, even if he did not know it at first, he is guilty when he finds out.',
    '8-10': 'Or if someone touches human uncleanness, whatever kind of uncleanness it is, and he did not know it at first, he is guilty when he finds out.',
  },
  'Leviticus 5:4': {
    '5-7': 'Or if someone makes a careless promise out loud, whether to do something bad or something good, and he did not understand what he had done at first, he is guilty when he finds out.',
    '8-10': 'Or if someone makes a careless oath with his lips, whether to do evil or good, and he did not understand what he had done at first, he is guilty when he finds out.',
  },
  'Leviticus 5:5': {
    '5-7': 'When he is guilty in one of these ways, he must tell the truth about the sin he did.',
    '8-10': 'When he is guilty in one of these ways, he must confess the sin he has committed.',
  },
  'Leviticus 5:6': {
    '5-7': 'Then he must bring the Lord a guilt offering for the sin he did: a female lamb or goat from the flock as an offering for sin. The priest must make atonement for him before the Lord.',
    '8-10': 'Then he must bring his guilt offering to the Lord for the sin he committed: a female lamb or goat from the flock as a sin offering. The priest must make atonement for him concerning his sin.',
  },
  'Leviticus 5:7': {
    '5-7': 'If he cannot afford a lamb, he must bring the Lord two doves or two young pigeons as his guilt offering for the sin he did. One bird is for an offering for sin, and the other is for a burned offering.',
    '8-10': 'If he cannot afford a lamb, he must bring the Lord two doves or two young pigeons as his guilt offering for the sin he committed. One bird is for a sin offering, and the other is for a burned offering.',
  },
  'Leviticus 5:8': {
    '5-7': 'He must bring them to the priest. First the priest must offer the bird for the offering for sin. He must remove its head at the neck, but not pull it completely away.',
    '8-10': 'He must bring them to the priest. First the priest must offer the bird for the sin offering. He must remove its head at the neck, but not separate it completely.',
  },
  'Leviticus 5:9': {
    '5-7': 'The priest must sprinkle some of the blood from the offering for sin on the side of the altar. The rest of the blood must be poured out at the base of the altar. It is an offering for sin.',
    '8-10': 'The priest must sprinkle some of the blood from the sin offering on the side of the altar. The rest of the blood must be poured out at the base of the altar. It is a sin offering.',
  },
  'Leviticus 5:10': {
    '5-7': 'Then the priest must offer the second bird as a burned offering, in the way God commanded. The priest must make atonement for him before the Lord for the sin he did, and he will be forgiven.',
    '8-10': 'Then the priest must offer the second bird as a burned offering, according to the rule. The priest must make atonement for him concerning the sin he committed, and he will be forgiven.',
  },
  'Leviticus 5:11': {
    '5-7': 'If he cannot afford two doves or two young pigeons, he must bring a small measured amount of fine flour as his offering for the sin he did. He must not put oil or sweet-smelling incense on it, because it is an offering for sin.',
    '8-10': 'If he cannot afford two doves or two young pigeons, he must bring a tenth-measure of fine flour as his offering for the sin he committed. He must not put oil or sweet-smelling incense on it, because it is a sin offering.',
  },
  'Leviticus 5:12': {
    '5-7': 'He must bring it to the priest. The priest must take a handful as the part burned before the Lord and burn it on the altar with the offerings burned to the Lord. It is an offering for sin.',
    '8-10': 'He must bring it to the priest. The priest must take a handful as the part burned before the Lord and burn it on the altar with the offerings burned to the Lord. It is a sin offering.',
  },
  'Leviticus 5:13': {
    '5-7': 'The priest must make atonement for him before the Lord for any of these sins, and he will be forgiven. The rest of the flour belongs to the priest, like the grain gift.',
    '8-10': 'The priest must make atonement for him concerning any of these sins, and he will be forgiven. The rest belongs to the priest, like the grain offering.',
  },
  'Leviticus 5:15': {
    '5-7': 'If someone acts unfaithfully and sins without knowing it in the Lord\'s holy things, he must bring the Lord a guilt offering: a male sheep from the flock with nothing wrong with it. Its value must be counted in silver by the weight used at the holy place.',
    '8-10': 'If someone acts unfaithfully and sins without knowing it regarding the Lord\'s holy things, he must bring the Lord a guilt offering: a male sheep from the flock with nothing wrong with it, valued in silver by the holy-place weight.',
  },
  'Leviticus 5:16': {
    '5-7': 'He must pay back what he did wrong with the holy thing and add one fifth more. He must give it to the priest. The priest must make atonement for him before the Lord with the male sheep of the guilt offering, and he will be forgiven.',
    '8-10': 'He must pay back what he did wrong regarding the holy thing and add one fifth more. He must give it to the priest. The priest must make atonement for him with the male sheep of the guilt offering, and he will be forgiven.',
  },
  'Leviticus 5:17': {
    '5-7': 'If someone sins by doing anything the Lord commanded not to be done, even if he did not know it at first, he is still guilty and carries his guilt.',
    '8-10': 'If someone sins by doing anything the Lord commanded not to be done, even if he did not know it at first, he is still guilty and carries his guilt.',
  },
  'Leviticus 5:18': {
    '5-7': 'He must bring the priest a male sheep from the flock with nothing wrong with it as a guilt offering, according to its value. The priest must make atonement for him before the Lord for the sin he did without knowing it, and he will be forgiven.',
    '8-10': 'He must bring the priest a male sheep from the flock with nothing wrong with it as a guilt offering, according to its value. The priest must make atonement for him concerning the sin he committed without knowing it, and he will be forgiven.',
  },
  'Leviticus 5:19': {
    '5-7': 'It is a guilt offering. He truly is guilty before the Lord.',
    '8-10': 'It is a guilt offering. He is certainly guilty before the Lord.',
  },
  'Leviticus 7:20': {
    '5-7': 'But if someone is not clean for worship and still eats meat from the Lord\'s peace offering, that person must be removed from his people.',
    '8-10': 'But if someone is unclean and still eats meat from the Lord\'s peace offering, that person must be removed from his people.',
  },
  'Leviticus 7:21': {
    '5-7': 'If someone touches anything not clean for worship, whether from a person, an animal, or something God calls detestable, and then eats meat from the Lord\'s peace offering, that person must be removed from his people.\' "',
    '8-10': 'If someone touches anything unclean, whether from a person, an animal, or something God calls detestable, and then eats meat from the Lord\'s peace offering, that person must be removed from his people.\' "',
  },
  'Leviticus 11:43': {
    '5-7': 'You must not make yourselves detestable with any small crawling thing that crawls. Do not let those creatures make you not clean for worship.',
    '8-10': 'You must not make yourselves detestable with any small crawling thing that crawls. Do not make yourselves unclean with them.',
  },
  'Leviticus 11:44': {
    '5-7': 'For I am the Lord your God. Keep yourselves holy, and be holy, because I am holy. Do not let any small crawling thing on the earth make you not clean for worship.',
    '8-10': 'For I am the Lord your God. Keep yourselves holy, and be holy, because I am holy. Do not make yourselves unclean with any small crawling thing on the earth.',
  },
  'Leviticus 16:12': {
    '5-7': 'He must take an incense pan full of fiery coals from the altar before the Lord. He must also take two handfuls of finely crushed sweet-smelling incense and bring them inside the curtain.',
    '8-10': 'He must take an incense pan full of fiery coals from the altar before the Lord. He must also take two handfuls of finely crushed sweet-smelling incense and bring them inside the curtain.',
  },
  'Leviticus 16:13': {
    '5-7': 'He must put the sweet-smelling incense on the fire before the Lord. The cloud of incense must cover the atonement cover over the covenant chest, so that he will not die.',
    '8-10': 'He must put the sweet-smelling incense on the fire before the Lord. The cloud of incense must cover the atonement cover over the covenant chest, so that he will not die.',
  },
  'Leviticus 16:16': {
    '5-7': 'He must make atonement for the Holy Place because the people of Israel were not clean for worship, and because of all their wrongs and sins. He must do the same for the Tent of Meeting, which stands among them.',
    '8-10': 'He must make atonement for the Holy Place because the people of Israel were unclean, and because of all their wrongs and sins. He must do the same for the Tent of Meeting, which stands with them among their uncleanness.',
  },
  'Leviticus 16:19': {
    '5-7': 'He must sprinkle some of the blood on the altar with his finger seven times. In this way he must make it clean and holy from what was not clean for worship among the people.',
    '8-10': 'He must sprinkle some of the blood on the altar with his finger seven times. In this way he must make it clean and holy from the uncleanness of the people.',
  },
  'Leviticus 18:19': {
    '5-7': '"You must not come near a woman to act as only a husband and wife should while she is not clean because of her monthly bleeding.',
    '8-10': '"You must not come near a woman to have sexual relations with her while she is unclean because of her monthly period.',
  },
  'Leviticus 18:20': {
    '5-7': '"You must not act as only a husband and wife should with your neighbor\'s wife, because that would make you not clean for worship with her.',
    '8-10': '"You must not have sexual relations with your neighbor\'s wife, because that would make you unclean with her.',
  },
  'Leviticus 18:23': {
    '5-7': '"You must not act as only a husband and wife should with any animal, because that would make you not clean for worship. No woman may go to an animal to act in that way. It is a perversion.',
    '8-10': '"You must not have sexual relations with any animal, because that would make you unclean. No woman may go to an animal to have sexual relations with it. It is a perversion.',
  },
  'Leviticus 18:24': {
    '5-7': '"Do not do any of these things, because they make people not clean for worship. The nations I am driving out before you did these things and became not clean for worship.',
    '8-10': '"Do not make yourselves unclean in any of these things. The nations I am driving out before you did these things and became unclean.',
  },
  'Leviticus 18:25': {
    '5-7': 'Even the land became not clean because of their sin. So I punished its sin, and the land vomited out its people.',
    '8-10': 'Even the land became unclean because of their sin. So I punished its sin, and the land vomited out its people.',
  },
  'Leviticus 18:27': {
    '5-7': 'The people who lived in the land before you did all these detestable things, and the land became not clean.',
    '8-10': 'The people who lived in the land before you did all these detestable things, and the land became unclean.',
  },
  'Leviticus 18:28': {
    '5-7': 'If you make the land not clean, it may vomit you out too, just as it vomited out the nation before you.',
    '8-10': 'If you make the land unclean, it may vomit you out too, just as it vomited out the nation before you.',
  },
  'Leviticus 18:30': {
    '5-7': 'So keep my requirements. Do not practice any of the detestable customs that were practiced before you, and do not let them make you not clean for worship. I am the Lord your God.\' "',
    '8-10': 'So keep my requirements. Do not practice any of the detestable customs that were practiced before you, and do not make yourselves unclean with them. I am the Lord your God.\' "',
  },
  'Leviticus 19:31': {
    '5-7': '"Do not turn to people who try to talk to spirits or seek out people who use magic. Do not let them make you not clean for worship. I am the Lord your God.',
    '8-10': '"Do not turn to mediums or wizards. Do not seek them out, to be made unclean by them. I am the Lord your God.',
  },
  'Leviticus 13:2': {
    '5-7': '"If a man has a swelling, a scab, or a bright spot on his skin, and it looks like a serious skin disease, he must be brought to Aaron the priest or to one of Aaron\'s sons, the priests.',
    '8-10': '"If a man has a swelling, a scab, or a bright spot on his skin, and it looks like a serious skin disease, he must be brought to Aaron the priest or to one of Aaron\'s sons, the priests.',
  },
  'Leviticus 13:3': {
    '5-7': 'The priest must look closely at the mark on the skin. If the hair in the mark has turned white, and the mark looks deeper than the skin around it, it is a serious skin disease. The priest must say the man is not clean for worship.',
    '8-10': 'The priest must examine the mark on the skin. If the hair in the mark has turned white, and the mark looks deeper than the skin around it, it is a serious skin disease. The priest must say the man is unclean.',
  },
  'Leviticus 13:4': {
    '5-7': 'But if the bright spot is white and does not look deeper than the skin, and the hair has not turned white, the priest must keep the person with the mark away from others for seven days.',
    '8-10': 'But if the bright spot is white and does not look deeper than the skin, and the hair has not turned white, the priest must keep the person with the mark apart for seven days.',
  },
  'Leviticus 13:5': {
    '5-7': 'On the seventh day, the priest must look at him again. If the mark has stopped spreading, the priest must keep him away from others for seven more days.',
    '8-10': 'On the seventh day, the priest must examine him again. If the mark has stopped spreading, the priest must keep him apart for seven more days.',
  },
  'Leviticus 13:6': {
    '5-7': 'On the next seventh day, the priest must look at him again. If the mark has faded and has not spread, the priest must say he is clean for worship. It was only a scab. The man must wash his clothes, and he will be clean for worship.',
    '8-10': 'On the next seventh day, the priest must examine him again. If the mark has faded and has not spread, the priest must say he is clean. It was only a scab. The man must wash his clothes, and he will be clean.',
  },
  'Leviticus 13:7': {
    '5-7': 'But if the scab spreads on the skin after the man has shown himself to the priest to be made clean, he must show himself to the priest again.',
    '8-10': 'But if the scab spreads on the skin after the man has shown himself to the priest to be made clean, he must show himself to the priest again.',
  },
  'Leviticus 13:8': {
    '5-7': 'The priest must look at him. If the scab has spread on the skin, the priest must say he is not clean for worship. It is a serious disease.',
    '8-10': 'The priest must examine him. If the scab has spread on the skin, the priest must say he is unclean. It is a serious disease.',
  },
  'Leviticus 13:9': {
    '5-7': '"When a man has a serious skin disease, he must be brought to the priest.',
    '8-10': '"When a man has a serious skin disease, he must be brought to the priest.',
  },
  'Leviticus 13:10': {
    '5-7': 'The priest must look closely. If there is a white swelling on the skin, and it has turned the hair white, and there is raw skin in the swelling,',
    '8-10': 'The priest must examine him. If there is a white swelling on the skin, and it has turned the hair white, and there is raw skin in the swelling,',
  },
  'Leviticus 13:11': {
    '5-7': 'it is a long-lasting serious disease in his skin. The priest must say he is not clean for worship. The priest must not keep him away for more watching, because the disease is already clear.',
    '8-10': 'it is a long-lasting serious disease in his skin. The priest must say he is unclean. The priest must not keep him apart for more watching, because the disease is already clear.',
  },
  'Leviticus 13:12': {
    '5-7': '"But if the serious disease breaks out all over the skin, and it covers the person from head to foot, as far as the priest can see,',
    '8-10': '"But if the serious disease breaks out all over the skin, and it covers the person from head to foot, as far as the priest can see,',
  },
  'Leviticus 13:13': {
    '5-7': 'then the priest must look closely. If the disease has covered all his body and the skin has all turned white, the priest must say the person is clean for worship.',
    '8-10': 'then the priest must examine him. If the disease has covered all his body and the skin has all turned white, the priest must say the person is clean.',
  },
  'Leviticus 13:14': {
    '5-7': 'But whenever raw skin appears on him, he is not clean for worship.',
    '8-10': 'But whenever raw skin appears on him, he is unclean.',
  },
  'Leviticus 13:15': {
    '5-7': 'The priest must look at the raw skin and say he is not clean for worship, because the raw skin is not clean for worship. It is a serious disease.',
    '8-10': 'The priest must examine the raw skin and say he is unclean, because the raw skin is unclean. It is a serious disease.',
  },
  'Leviticus 13:16': {
    '5-7': 'But if the raw skin turns white again, the person must come back to the priest.',
    '8-10': 'But if the raw skin turns white again, the person must come back to the priest.',
  },
  'Leviticus 13:17': {
    '5-7': 'The priest must look at him. If the mark has turned white, the priest must say the person is clean for worship.',
    '8-10': 'The priest must examine him. If the mark has turned white, the priest must say the person is clean.',
  },
  'Leviticus 13:31': {
    '5-7': 'If the priest looks at the itchy mark and it does not look deeper than the skin, and there is no black hair in it, the priest must keep the person with the itch away from others for seven days.',
    '8-10': 'If the priest examines the itchy mark and it does not look deeper than the skin, and there is no black hair in it, the priest must keep the person with the itch apart for seven days.',
  },
  'Leviticus 13:33': {
    '5-7': 'Then the person must shave, but he must not shave the itchy place. The priest must keep the person with the itch away from others for seven more days.',
    '8-10': 'Then the person must shave, but he must not shave the itchy place. The priest must keep the person with the itch apart for seven more days.',
  },
  'Leviticus 13:35': {
    '5-7': 'But if the itch spreads on the skin after the priest said he was clean for worship,',
    '8-10': 'But if the itch spreads on the skin after the priest said he was clean,',
  },
  'Leviticus 13:47': {
    '5-7': '"A mark like mildew can also appear in a piece of clothing, whether the clothing is made from wool or linen.',
    '8-10': '"A mark like mildew can also appear in a garment, whether the garment is made from wool or linen.',
  },
  'Leviticus 13:48': {
    '5-7': 'It may appear in woven threads of linen or wool, in leather, or in anything made from leather.',
    '8-10': 'It may appear in woven threads of linen or wool, in leather, or in anything made from leather.',
  },
  'Leviticus 13:49': {
    '5-7': 'If the mark is greenish or reddish in the clothing, the leather, the woven threads, or anything made from leather, it is a serious mildew mark. It must be shown to the priest.',
    '8-10': 'If the mark is greenish or reddish in the garment, the leather, the woven threads, or anything made from leather, it is a serious mildew mark. It must be shown to the priest.',
  },
  'Leviticus 13:50': {
    '5-7': 'The priest must look at the mark and keep the thing with the mark separate for seven days.',
    '8-10': 'The priest must examine the mark and keep the thing with the mark apart for seven days.',
  },
  'Leviticus 13:51': {
    '5-7': 'On the seventh day, he must look at the mark again. If the mark has spread in the clothing, the woven threads, the leather, or anything made from leather, it is a destructive mildew. It is not clean for worship.',
    '8-10': 'On the seventh day, he must examine the mark again. If the mark has spread in the garment, the woven threads, the leather, or anything made from leather, it is a destructive mildew. It is unclean.',
  },
  'Leviticus 13:52': {
    '5-7': 'He must burn the clothing, the woven cloth, or the leather thing where the mark is found, because it is a destructive mildew. It must be burned in the fire.',
    '8-10': 'He must burn the garment, the woven cloth, or the leather thing where the mark is found, because it is a destructive mildew. It must be burned in the fire.',
  },
  'Leviticus 13:53': {
    '5-7': '"But if the priest looks at it and the mark has not spread in the clothing, the woven threads, or the leather thing,',
    '8-10': '"But if the priest examines it and the mark has not spread in the garment, the woven threads, or the leather thing,',
  },
  'Leviticus 13:54': {
    '5-7': 'then the priest must tell them to wash the thing with the mark. Then he must keep it separate for seven more days.',
    '8-10': 'then the priest must tell them to wash the thing with the mark. Then he must keep it apart for seven more days.',
  },
  'Leviticus 13:55': {
    '5-7': 'After the thing is washed, the priest must look at it again. If the mark has not changed color, even if it has not spread, it is not clean for worship. It must be burned in the fire, whether the mildew is on the inside or the outside.',
    '8-10': 'After the thing is washed, the priest must examine it again. If the mark has not changed color, even if it has not spread, it is unclean. It must be burned in the fire, whether the mildew is on the inside or the outside.',
  },
  'Leviticus 13:56': {
    '5-7': 'But if the priest looks and the mark has faded after washing, he must tear the marked part out of the clothing, the leather, or the woven cloth.',
    '8-10': 'But if the priest looks and the mark has faded after washing, he must tear the marked part out of the garment, the leather, or the woven cloth.',
  },
  'Leviticus 13:57': {
    '5-7': 'If the mark appears again in the clothing, the woven cloth, or anything made from leather, it is spreading. Whatever has the mark must be burned in the fire.',
    '8-10': 'If the mark appears again in the garment, the woven cloth, or anything made from leather, it is spreading. Whatever has the mark must be burned in the fire.',
  },
  'Leviticus 13:58': {
    '5-7': 'But if the mark leaves the clothing, woven cloth, or leather thing after it is washed, it must be washed a second time, and it will be clean for worship."',
    '8-10': 'But if the mark leaves the garment, woven cloth, or leather thing after it is washed, it must be washed a second time, and it will be clean."',
  },
  'Leviticus 13:59': {
    '5-7': 'This is the law for mildew marks in clothing made from wool or linen, in woven cloth, or in leather things. It teaches when to say something is clean for worship and when to say it is not clean for worship.',
    '8-10': 'This is the law for mildew marks in garments made from wool or linen, in woven cloth, or in leather things. It teaches when to say something is clean and when to say it is unclean.',
  },
  'Leviticus 14:4': {
    '5-7': 'then the priest must tell them to bring these things for the person being made clean for worship: two live birds that were clean for worship, a piece of cedar wood, red thread, and a leafy hyssop branch.',
    '8-10': 'then the priest must tell them to bring these things for the person being made clean: two live birds that were clean, a piece of cedar wood, red thread, and a leafy hyssop branch.',
  },
  'Leviticus 14:6': {
    '5-7': 'The priest must take the living bird, the cedar wood, the red thread, and the leafy hyssop branch. He must dip them, along with the living bird, into the blood of the bird killed over the fresh flowing water.',
    '8-10': 'The priest must take the living bird, the cedar wood, the red thread, and the leafy hyssop branch. He must dip them, along with the living bird, into the blood of the bird killed over the fresh flowing water.',
  },
  'Leviticus 14:19': {
    '5-7': 'The priest must offer the offering for sin and make atonement for the man as he is being made clean. Afterward, the priest must kill the burned offering.',
    '8-10': 'The priest must offer the sin offering and make atonement for the person being made clean. Afterward, the priest must kill the burned offering.',
  },
  'Leviticus 14:31': {
    '5-7': 'He must offer what the man can afford: one bird for an offering for sin, and the other for a burned offering, along with the grain gift. The priest must make atonement before the Lord for the person being made clean."',
    '8-10': 'He must offer what the man can afford: one bird for a sin offering, and the other for a burned offering, along with the grain offering. The priest must make atonement before the Lord for the person being made clean."',
  },
  'Leviticus 14:36': {
    '5-7': 'Before the priest goes in to look at the mark, he must tell them to empty the house. Then the things in the house will not be counted as not clean for worship. After that, the priest must go in and inspect the house.',
    '8-10': 'Before the priest goes in to examine the mark, he must tell them to empty the house. Then the things in the house will not become unclean. After that, the priest must go in and inspect the house.',
  },
  'Leviticus 14:40': {
    '5-7': 'then the priest must tell them to take out the stones with the mark and throw them into a place outside the city for things not clean for worship.',
    '8-10': 'then the priest must tell them to take out the stones with the mark and throw them into an unclean place outside the city.',
  },
  'Leviticus 14:41': {
    '5-7': 'The inside of the house must be scraped all over. The scraped-off plaster must be poured out in a place outside the city for things not clean for worship.',
    '8-10': 'The inside of the house must be scraped all over. The scraped-off plaster must be poured out in an unclean place outside the city.',
  },
  'Leviticus 14:45': {
    '5-7': 'The house must be torn down. Its stones, wood, and plaster must be carried out of the city to a place for things not clean for worship.',
    '8-10': 'The house must be torn down. Its stones, wood, and plaster must be carried out of the city to an unclean place.',
  },
  'Leviticus 14:51': {
    '5-7': 'He must take the cedar wood, the leafy hyssop branch, the red thread, and the living bird. He must dip them in the blood of the bird that was killed and in the fresh flowing water, and then sprinkle the house seven times.',
    '8-10': 'He must take the cedar wood, the leafy hyssop branch, the red thread, and the living bird. He must dip them in the blood of the bird that was killed and in the fresh flowing water, and then sprinkle the house seven times.',
  },
  'Leviticus 14:52': {
    '5-7': 'He must make the house clean with the bird\'s blood, the fresh flowing water, the living bird, the cedar wood, the leafy hyssop branch, and the red thread.',
    '8-10': 'He must make the house clean with the bird\'s blood, the fresh flowing water, the living bird, the cedar wood, the leafy hyssop branch, and the red thread.',
  },
  'Leviticus 14:53': {
    '5-7': 'Then he must let the living bird go out of the city into the open field. In this way he must make atonement for the house, and it will be clean for worship."',
    '8-10': 'Then he must let the living bird go out of the city into the open field. In this way he must make atonement for the house, and it will be clean."',
  },
  'Leviticus 15:2': {
    '5-7': '"Speak to the people of Israel and tell them, \'When a man has an unusual flow from his body, that flow makes him not clean for worship.',
    '8-10': '"Speak to the people of Israel and tell them, \'When a man has an unusual discharge from his body, that discharge makes him unclean.',
  },
  'Leviticus 15:3': {
    '5-7': 'This is the rule about that body flow: whether the flow keeps coming or has stopped, it still makes him not clean for worship.',
    '8-10': 'This is the rule about that discharge: whether it keeps flowing or has stopped, it still makes him unclean.',
  },
  'Leviticus 15:4': {
    '5-7': 'Every bed the man with the flow lies on will not be clean for worship, and everything he sits on will not be clean for worship.',
    '8-10': 'Every bed the man with the discharge lies on will be unclean, and everything he sits on will be unclean.',
  },
  'Leviticus 15:5': {
    '5-7': 'Whoever touches his bed must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'Whoever touches his bed must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:6': {
    '5-7': 'Whoever sits on anything the man with the flow sat on must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'Whoever sits on anything the man with the discharge sat on must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:7': {
    '5-7': 'Whoever touches the body of the man with the flow must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'Whoever touches the body of the man with the discharge must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:8': {
    '5-7': 'If the man with the flow spits on someone who is clean for worship, that person must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'If the man with the discharge spits on someone who is clean, that person must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:9': {
    '5-7': 'Any saddle the man with the flow rides on will not be clean for worship.',
    '8-10': 'Any saddle the man with the discharge rides on will be unclean.',
  },
  'Leviticus 15:10': {
    '5-7': 'Whoever touches anything that was under him will not be clean for worship until evening. Whoever carries those things must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'Whoever touches anything that was under him will be unclean until evening. Whoever carries those things must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:11': {
    '5-7': 'If the man with the flow touches someone without first rinsing his hands in water, that person must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'If the man with the discharge touches someone without first rinsing his hands in water, that person must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:12': {
    '5-7': 'If the man with the flow touches a clay bowl, it must be broken. If he touches a wooden container, it must be rinsed with water.',
    '8-10': 'If the man with the discharge touches a clay bowl, it must be broken. If he touches a wooden container, it must be rinsed with water.',
  },
  'Leviticus 15:13': {
    '5-7': 'When the man is clean from his flow, he must count seven days. Then he must wash his clothes and wash his body in fresh flowing water, and he will be clean for worship.',
    '8-10': 'When the man is clean from his discharge, he must count seven days. Then he must wash his clothes and bathe his body in fresh flowing water, and he will be clean.',
  },
  'Leviticus 15:15': {
    '5-7': 'The priest must offer one bird as an offering for sin and the other as a burned offering. The priest must make atonement for him before the Lord because of his flow.',
    '8-10': 'The priest must offer one bird as a sin offering and the other as a burned offering. The priest must make atonement for him before the Lord because of his discharge.',
  },
  'Leviticus 15:16': {
    '5-7': '"If fluid comes from a man\'s body, he must wash his whole body in water and not be clean for worship until evening.',
    '8-10': '"If semen comes from a man\'s body, he must bathe his whole body in water and be unclean until evening.',
  },
  'Leviticus 15:17': {
    '5-7': 'Any clothing or leather that the fluid touches must be washed with water and will not be clean for worship until evening.',
    '8-10': 'Any clothing or leather that the semen touches must be washed with water and will be unclean until evening.',
  },
  'Leviticus 15:18': {
    '5-7': 'If a man and a woman come together in the way husbands and wives do, and fluid comes from him, they must both wash themselves in water and not be clean for worship until evening.',
    '8-10': 'If a man and a woman have sexual relations and semen comes from him, they must both bathe in water and be unclean until evening.',
  },
  'Leviticus 15:19': {
    '5-7': '"When a woman has her monthly bleeding, she will not be clean for worship for seven days. Whoever touches her will not be clean for worship until evening.',
    '8-10': '"When a woman has her monthly period, she will be unclean for seven days. Whoever touches her will be unclean until evening.',
  },
  'Leviticus 15:20': {
    '5-7': 'Everything she lies on during that time will not be clean for worship, and everything she sits on will not be clean for worship.',
    '8-10': 'Everything she lies on during that time will be unclean, and everything she sits on will be unclean.',
  },
  'Leviticus 15:21': {
    '5-7': 'Whoever touches her bed must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'Whoever touches her bed must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:22': {
    '5-7': 'Whoever touches anything she sat on must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'Whoever touches anything she sat on must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:23': {
    '5-7': 'If someone touches anything on the bed or on the seat where she sat, he will not be clean for worship until evening.',
    '8-10': 'If someone touches anything on the bed or on the seat where she sat, he will be unclean until evening.',
  },
  'Leviticus 15:24': {
    '5-7': 'If a man comes together with her in the way husbands and wives do during her monthly bleeding, he will not be clean for worship for seven days. Every bed he lies on will not be clean for worship.',
    '8-10': 'If a man has sexual relations with her during her monthly period, he will be unclean for seven days. Every bed he lies on will be unclean.',
  },
  'Leviticus 15:25': {
    '5-7': '"If a woman has bleeding for many days when it is not her monthly time, or if her bleeding lasts longer than her monthly time, she will not be clean for worship for all those days, just as during her period.',
    '8-10': '"If a woman has bleeding for many days when it is not her monthly period, or if her bleeding lasts longer than her period, she will be unclean for all those days, just as during her period.',
  },
  'Leviticus 15:26': {
    '5-7': 'Every bed she lies on during those days will be like the bed of her period, and everything she sits on will not be clean for worship.',
    '8-10': 'Every bed she lies on during those days will be like the bed of her period, and everything she sits on will be unclean.',
  },
  'Leviticus 15:27': {
    '5-7': 'Whoever touches those things will not be clean for worship. He must wash his clothes, wash his body in water, and not be clean for worship until evening.',
    '8-10': 'Whoever touches those things will be unclean. He must wash his clothes, bathe in water, and be unclean until evening.',
  },
  'Leviticus 15:28': {
    '5-7': 'When she is clean from her flow, she must count seven days. After that she will be clean for worship.',
    '8-10': 'When she is clean from her discharge, she must count seven days. After that she will be clean.',
  },
  'Leviticus 15:30': {
    '5-7': 'The priest must offer one bird as an offering for sin and the other as a burned offering. The priest must make atonement for her before the Lord because of her flow.',
    '8-10': 'The priest must offer one bird as a sin offering and the other as a burned offering. The priest must make atonement for her before the Lord because of her discharge.',
  },
  'Leviticus 15:31': {
    '5-7': '"In this way you must keep the people of Israel away from what is not clean for worship, so they do not die by bringing it near my holy tent among them.\' "',
    '8-10': '"In this way you must separate the people of Israel from their uncleanness, so they do not die in their uncleanness by making my holy tent among them unclean.\' "',
  },
  'Leviticus 15:32': {
    '5-7': 'This is the law for a man with an unusual flow from his body, and for a man when fluid comes from his body and makes him not clean for worship;',
    '8-10': 'This is the law for a person with a discharge, and for a man when semen comes from his body and makes him unclean;',
  },
  'Leviticus 15:33': {
    '5-7': 'and for a woman during her period, and for any man or woman with a flow, and for a man who comes together with a woman who is not clean for worship.',
    '8-10': 'and for a woman during her period, and for any man or woman with a discharge, and for a man who has sexual relations with a woman who is unclean.',
  },
  'Leviticus 21:1': {
    '5-7': 'The Lord said to Moses, "Speak to the priests, Aaron\'s sons, and say to them, \'A priest must not touch a dead person among his people in a way that makes him not clean for worship,',
    '8-10': 'The Lord said to Moses, "Speak to the priests, Aaron\'s sons, and say to them, \'A priest must not make himself unclean by touching a dead person among his people,',
  },
  'Leviticus 21:3': {
    '5-7': 'or for his unmarried sister who is close to him and has never had a husband. For her, he may do what makes him not clean for worship.',
    '8-10': 'or for his unmarried sister who is close to him and has never had a husband. For her, he may make himself unclean.',
  },
  'Leviticus 21:4': {
    '5-7': 'As a leader among his people, he must not do this for others in a way that dishonors himself.',
    '8-10': 'As a leader among his people, he must not make himself unclean in a way that dishonors himself.',
  },
  'Leviticus 21:6': {
    '5-7': 'They must be holy to their God and must not dishonor God\'s name. They bring the Lord\'s offerings burned on the altar, the food offerings of their God, so they must be holy.',
    '8-10': 'They must be holy to their God and must not dishonor God\'s name. They bring the Lord\'s offerings burned on the altar, the food offerings of their God, so they must be holy.',
  },
  'Leviticus 21:8': {
    '5-7': 'You must treat the priest as holy, because he offers the food of your God. He must be holy to you, because I, the Lord who makes you holy, am holy.',
    '8-10': 'You must treat the priest as holy, because he offers the food of your God. He must be holy to you, because I, the Lord who makes you holy, am holy.',
  },
  'Leviticus 21:9': {
    '5-7': '"If a priest\'s daughter dishonors herself through sexual sin, she dishonors her father. She must be burned with fire.',
    '8-10': '"If a priest\'s daughter dishonors herself through sexual sin, she dishonors her father. She must be burned with fire.',
  },
  'Leviticus 21:11': {
    '5-7': 'He must not go near any dead body in a way that makes him not clean for worship, not even for his father or mother.',
    '8-10': 'He must not go near any dead body or make himself unclean, not even for his father or mother.',
  },
  'Leviticus 21:12': {
    '5-7': 'He must not leave the holy place or dishonor the holy place of his God, because the special anointing oil of his God is on him. I am the Lord.',
    '8-10': 'He must not leave the holy place or dishonor the holy place of his God, because the special anointing oil of his God is on him. I am the Lord.',
  },
  'Leviticus 21:13': {
    '5-7': '"He must marry a woman who has never been married.',
    '8-10': '"He must marry a virgin from his own people.',
  },
  'Leviticus 21:14': {
    '5-7': 'He must not marry a widow, a divorced woman, a woman who has been dishonored, or a woman living in sexual sin. He must marry a woman from his own people who has never been married.',
    '8-10': 'He must not marry a widow, a divorced woman, a woman who has been dishonored, or a woman living in sexual sin. He must marry a virgin from his own people.',
  },
  'Leviticus 21:15': {
    '5-7': 'He must not dishonor his children among his people, because I am the Lord who makes him holy.\' "',
    '8-10': 'He must not dishonor his children among his people, because I am the Lord who makes him holy.\' "',
  },
  'Leviticus 21:17': {
    '5-7': '"Say to Aaron, \'In every generation, none of your descendants who has a serious physical condition may come near to offer the food of his God.',
    '8-10': '"Say to Aaron, \'In every generation, none of your descendants who has a serious physical condition may come near to offer the food of his God.',
  },
  'Leviticus 21:18': {
    '5-7': 'A man with a serious physical condition must not come near: a blind man, a man who cannot walk well, a man with a face shaped differently, or a man with another body difference,',
    '8-10': 'A man with a serious physical condition must not come near: a blind man, a lame man, a man with a face shaped differently, or a man with another body difference,',
  },
  'Leviticus 21:20': {
    '5-7': 'or a man with a bent back, a very short body, an eye problem, an itching disease, scabs, or damaged male body parts.',
    '8-10': 'or a man with a bent back, a very short body, an eye problem, an itching disease, scabs, or damaged male body parts.',
  },
  'Leviticus 21:21': {
    '5-7': 'No descendant of Aaron the priest who has a serious physical condition may come near to offer the Lord\'s offerings burned on the altar. Since he has that condition, he must not come near to offer the food of his God.',
    '8-10': 'No descendant of Aaron the priest who has a serious physical condition may come near to offer the Lord\'s offerings burned on the altar. Since he has that condition, he must not come near to offer the food of his God.',
  },
  'Leviticus 21:22': {
    '5-7': 'He may still eat the food of his God, both the most holy food and the holy food.',
    '8-10': 'He may still eat the food of his God, both the most holy food and the holy food.',
  },
  'Leviticus 21:23': {
    '5-7': 'But he must not come near the curtain or the altar, because of his physical condition, so that he does not dishonor my holy places. I am the Lord who makes them holy.\' "',
    '8-10': 'But he must not come near the curtain or the altar, because of his physical condition, so that he does not dishonor my holy places. I am the Lord who makes them holy.\' "',
  },
  'Leviticus 22:18': {
    '5-7': '"Speak to Aaron, his sons, and all the people of Israel. Say to them, \'If any Israelite or foreigner living in Israel brings a burned offering to the Lord, whether it is for a special promise or a gift he chooses to bring,',
    '8-10': '"Speak to Aaron, his sons, and all the people of Israel. Say to them, \'If any Israelite or foreigner living in Israel brings a burned offering to the Lord, whether it is for a vow or a freewill gift,',
  },
  'Leviticus 22:3': {
    '5-7': '"Tell them, \'If any of your descendants, now or in future generations, comes near the holy things of the Lord while he is not clean for worship, that person must be removed from before me. I am the Lord.',
    '8-10': '"Tell them, \'If any of your descendants, now or in future generations, comes near the holy things of the Lord while he is unclean, that person must be removed from before me. I am the Lord.',
  },
  'Leviticus 22:4': {
    '5-7': '"If any of Aaron\'s descendants has a serious skin disease or an unusual flow from his body, he must not eat the holy things until he is clean for worship. The same is true if he touches something not clean for worship because of a dead body, or touches a man who has fluid from his body,',
    '8-10': '"If any of Aaron\'s descendants has a serious skin disease or a discharge, he must not eat the holy things until he is clean. The same is true if he touches something made unclean by a dead body, or touches a man who has semen from his body,',
  },
  'Leviticus 22:5': {
    '5-7': 'or if he touches a small crawling thing that makes him not clean for worship, or touches a person whose condition can make him not clean for worship.',
    '8-10': 'or if he touches a small crawling thing that makes him unclean, or touches a person whose uncleanness can make him unclean.',
  },
  'Leviticus 22:8': {
    '5-7': 'He must not eat an animal that died by itself or was torn by wild animals, because that would make him not clean for worship. I am the Lord.',
    '8-10': 'He must not eat an animal that died by itself or was torn by wild animals, because that would make him unclean. I am the Lord.',
  },
  'Leviticus 22:20': {
    '5-7': 'You must not offer an animal that has something wrong with it, because it will not be accepted for you.',
    '8-10': 'You must not offer an animal that has a defect, because it will not be accepted for you.',
  },
  'Leviticus 22:21': {
    '5-7': 'If someone brings a peace offering to the Lord to keep a special promise or as a gift he chooses to bring from the herd or flock, the animal must be whole and healthy to be accepted. It must have nothing wrong with it.',
    '8-10': 'If someone brings a peace offering to the Lord to keep a vow or as a freewill gift from the herd or flock, the animal must be whole and healthy to be accepted. It must have no defect.',
  },
  'Leviticus 22:22': {
    '5-7': 'You must not offer the Lord an animal that is blind, injured, crippled, has sores, or has a skin disease. You must not put any such animal on the altar as an offering burned to the Lord.',
    '8-10': 'You must not offer the Lord an animal that is blind, injured, crippled, has sores, or has a skin disease. You must not put any such animal on the altar as an offering burned to the Lord.',
  },
  'Leviticus 22:23': {
    '5-7': 'You may bring a bull or lamb with one body part too long or too short as a gift you choose to bring, but it will not be accepted for a special promise.',
    '8-10': 'You may bring a bull or lamb with one body part too long or too short as a freewill gift, but it will not be accepted for a vow.',
  },
  'Leviticus 22:24': {
    '5-7': 'You must not offer the Lord an animal whose male body parts are bruised, crushed, torn, or cut. You must not do this in your land.',
    '8-10': 'You must not offer the Lord an animal whose male body parts are bruised, crushed, torn, or cut. You must not do this in your land.',
  },
  'Leviticus 22:25': {
    '5-7': 'You must not accept any such animal from a foreigner to offer as the food of your God. Because something is wrong with the animal, it will not be accepted for you.\' "',
    '8-10': 'You must not accept any such animal from a foreigner to offer as the food of your God. Because it has a defect, it will not be accepted for you.\' "',
  },
  'Leviticus 20:25': {
    '5-7': '"You must therefore know the difference between animals clean for worship and animals not clean for worship, and between birds not clean for worship and birds clean for worship. You must not make yourselves detestable by eating any animal, bird, or crawling thing that I have separated from you as not clean for worship.',
    '8-10': '"You must therefore know the difference between clean animals and unclean animals, and between unclean birds and clean birds. You must not make yourselves detestable by eating any animal, bird, or crawling thing that I have separated from you as unclean.',
  },
  'Leviticus 13:45': {
    '5-7': 'The person with the serious skin disease must wear torn clothes, leave his hair loose, cover his upper lip, and call out, "Not clean for worship! Not clean for worship!"',
    '8-10': 'The person with the serious skin disease must wear torn clothes, leave the hair of his head loose, cover his upper lip, and call out, "Unclean! Unclean!"',
  },
  'Leviticus 13:46': {
    '5-7': 'As long as the mark of disease is on him, he is not clean for worship. He must live alone outside the camp.',
    '8-10': 'As long as the mark of disease is on him, he is unclean. He must live alone outside the camp.',
  },
};

main();

function main() {
  for (const chapterNumber of CHAPTERS) {
    const ageTexts = {};

    for (const ageRange of AGE_RANGES) {
      const filePath = ageTextPath(chapterNumber, ageRange);
      const verses = extractVerses(fs.readFileSync(filePath, 'utf8')).map(verse => ({
        ...verse,
        body: polishLeviticusText(verse.body, ageRange, verse.reference),
      }));

      ageTexts[ageRange] = verses;
      writeAgeChapter(filePath, chapterNumber, verses);
    }

    updateResourceChapter(chapterNumber, ageTexts);
  }

  console.log(`Reviewed Leviticus chapters ${CHAPTERS[0]}-${CHAPTERS[CHAPTERS.length - 1]}.`);
}

function polishLeviticusText(text, ageRange, reference) {
  let result = polishKidReadableText(text, ageRange);

  result = result
    .replace(/\bofferings? made by fire\b/g, match => match.startsWith('offerings') ? 'offerings burned on the altar' : 'offering burned on the altar')
    .replace(/\bofferings of the Lord made by fire\b/g, 'offerings burned for the Lord')
    .replace(/\bofferings of the Lord burned on the altar\b/g, 'offerings burned for the Lord')
    .replace(/\boffering of an offering burned on the altar\b/g, 'offering burned on the altar')
    .replace(/\boffering of an offering burned\b/g, 'offering burned')
    .replace(/\bFrankincense\b/g, 'Sweet-smelling incense')
    .replace(/\bfrankincense\b/g, 'sweet-smelling incense')
    .replace(/\bmemorial portion\b/g, 'part burned before the Lord')
    .replace(/\baccording to your estimation\b/g, 'according to its value')
    .replace(/\baccording to the holy place weight\b/g, 'by the weight used at the holy place')
    .replace(/\bholy place weight\b/g, 'weight used at the holy place')
    .replace(/\bmake restitution\b/g, 'pay back')
    .replace(/\brestitution\b/g, 'payment back')
    .replace(/\badd a fifth part\b/g, 'add one fifth more')
    .replace(/\bthe fifth part\b/g, 'one fifth more')
    .replace(/\bfifth part\b/g, 'one fifth')
    .replace(/\bmust bear his guilt\b/g, 'carries his guilt')
    .replace(/\bmust bear her guilt\b/g, 'carries her guilt')
    .replace(/\bmust bear their guilt\b/g, 'carry their guilt')
    .replace(/\bbears his guilt\b/g, 'carries his guilt')
    .replace(/\bbears her guilt\b/g, 'carries her guilt')
    .replace(/\bbears their guilt\b/g, 'carry their guilt')
    .replace(/\bsin which he has sinned\b/g, 'sin he committed')
    .replace(/\bsin that he has sinned\b/g, 'sin he committed')
    .replace(/\bconcerning his sin which he has sinned\b/g, 'concerning his sin')
    .replace(/\bconcerning her sin which she has sinned\b/g, 'concerning her sin')
    .replace(/\bconcerning his sin he committed\b/g, 'concerning his sin')
    .replace(/\bconcerning her sin she committed\b/g, 'concerning her sin')
    .replace(/\bIt must be, when\b/g, 'When')
    .replace(/\bconfess that in which he has sinned\b/g, 'confess the sin he committed')
    .replace(/\bwhatever his being unclean is with which he is unclean\b/g, 'whatever made him unclean')
    .replace(/\ba person's being unclean\b/g, "a person's uncleanness")
    .replace(/\bbeing unclean\b/g, 'uncleanness')
    .replace(/\bin the day he is made clean\b/g, 'on the day he is made clean')
    .replace(/\bin the day she is made clean\b/g, 'on the day she is made clean')
    .replace(/\bthe person being made clean\b/g, 'the person being made clean for worship')
    .replace(/\bfor the person being made clean\b/g, 'for the person being made clean for worship')
    .replace(/\bto be made clean from\b/g, 'to be made clean from')
    .replace(/\braw flesh\b/g, 'raw skin')
    .replace(/\bwarp or woof\b/g, 'woven threads running one way or the other')
    .replace(/\bwarp, or in the woof\b/g, 'woven threads running one way or the other')
    .replace(/\bwarp, or the woof\b/g, 'woven threads running one way or the other')
    .replace(/\bwarp or in the woof\b/g, 'woven threads running one way or the other')
    .replace(/\bthe warp\b/g, 'the woven threads')
    .replace(/\bthe woof\b/g, 'the woven threads')
    .replace(/\bbareness\b/g, 'worn place')
    .replace(/\bdwell outside\b/g, 'live outside')
    .replace(/\bdwelling\b/g, 'home')
    .replace(/\bchronic serious disease\b/g, 'long-lasting serious disease')
    .replace(/\bmust not sever it completely\b/g, 'must not separate it completely')
    .replace(/\bsever it completely\b/g, 'separate it completely')
    .replace(/\bmust isolate him\b/g, 'must keep him apart')
    .replace(/\bmust isolate her\b/g, 'must keep her apart')
    .replace(/\bmust isolate it\b/g, 'must keep it apart')
    .replace(/\bisolate him\b/g, 'keep him apart')
    .replace(/\bisolate her\b/g, 'keep her apart')
    .replace(/\bisolate it\b/g, 'keep it apart')
    .replace(/\bpiece of a piece of cedar wood\b/g, 'piece of cedar wood')
    .replace(/\bthe piece of a piece of cedar wood\b/g, 'the piece of cedar wood')
    .replace(/\bunclean place outside of the city\b/g, 'place outside the city for things not clean for worship')
    .replace(/\bunclean place outside the city\b/g, 'place outside the city for things not clean for worship')
    .replace(/\bnot be made unclean\b/g, 'not become unclean')
    .replace(/\bbe made unclean\b/g, 'become unclean');

  if (ageRange === '5-7') {
    result = result
      .replace(/\bguilt offering\b/g, 'guilt offering')
      .replace(/\bone tenth-measure of fine flour\b/g, 'a small measured amount of fine flour')
      .replace(/\bone tenth-measure\b/g, 'a small measured amount')
      .replace(/\bmust isolate him\b/g, 'must keep him away from others')
      .replace(/\bmust isolate her\b/g, 'must keep her away from others')
      .replace(/\bmust isolate it\b/g, 'must keep it separate')
      .replace(/\bmust isolate the person\b/g, 'must keep the person away from others')
      .replace(/\bmust isolate the one\b/g, 'must keep the one away from others')
      .replace(/\bmust isolate the disease mark\b/g, 'must keep the thing with the mark separate')
      .replace(/\bisolate him\b/g, 'keep him away from others')
      .replace(/\bisolate her\b/g, 'keep her away from others')
      .replace(/\bisolate it\b/g, 'keep it separate')
      .replace(/\bisolate the person\b/g, 'keep the person away from others')
      .replace(/\bisolate the one\b/g, 'keep the one away from others')
      .replace(/\bisolate the disease mark\b/g, 'keep the thing with the mark separate')
      .replace(/\binfected person\b/g, 'person with the mark')
      .replace(/\bthe person infected with itching\b/g, 'the person with the itch')
      .replace(/\bmust say he is unclean\b/g, 'must say he is not clean for worship')
      .replace(/\bmust say she is unclean\b/g, 'must say she is not clean for worship')
      .replace(/\bmust say it is unclean\b/g, 'must say it is not clean for worship')
      .replace(/\bmust say he is clean\b/g, 'must say he is clean for worship')
      .replace(/\bmust say she is clean\b/g, 'must say she is clean for worship')
      .replace(/\bmust say it is clean\b/g, 'must say it is clean for worship')
      .replace(/\bHe is unclean\b/g, 'He is not clean for worship')
      .replace(/\bShe is unclean\b/g, 'She is not clean for worship')
      .replace(/\bIt is unclean\b/g, 'It is not clean for worship')
      .replace(/\bhe is unclean\b/g, 'he is not clean for worship')
      .replace(/\bshe is unclean\b/g, 'she is not clean for worship')
      .replace(/\bit is unclean\b/g, 'it is not clean for worship')
      .replace(/\bwill be unclean\b/g, 'will not be clean for worship')
      .replace(/\bbe unclean\b/g, 'not be clean for worship')
      .replace(/\bis unclean\b/g, 'is not clean for worship')
      .replace(/\bunclean animal\b/g, 'animal not clean for worship')
      .replace(/\bunclean animals\b/g, 'animals not clean for worship')
      .replace(/\bunclean thing\b/g, 'thing not clean for worship')
      .replace(/\bunclean things\b/g, 'things not clean for worship')
      .replace(/\bunclean small crawling things\b/g, 'small crawling things not clean for worship')
      .replace(/\bwill be clean\b/g, 'will be clean for worship')
      .replace(/\bbe clean\b/g, 'be clean for worship')
      .replace(/\bis clean\b/g, 'is clean for worship')
      .replace(/\bHe is clean\b/g, 'He is clean for worship')
      .replace(/\bShe is clean\b/g, 'She is clean for worship')
      .replace(/\bIt is clean\b/g, 'It is clean for worship')
      .replace(/\bThey are unclean to you\b/g, 'They are not clean for worship for you')
      .replace(/\bthey are unclean to you\b/g, 'they are not clean for worship for you')
      .replace(/\bare unclean to you\b/g, 'are not clean for worship for you')
      .replace(/\bThey are unclean\b/g, 'They are not clean for worship')
      .replace(/\bthey are unclean\b/g, 'they are not clean for worship')
      .replace(/\bare unclean\b/g, 'are not clean for worship')
      .replace(/\bthe unclean and the clean\b/g, 'what is not clean for worship and what is clean for worship')
      .replace(/\bbetween the unclean and the clean\b/g, 'between what is not clean for worship and what is clean for worship')
      .replace(/\bclean animal and the unclean\b/g, 'animal clean for worship and the animal not clean for worship')
      .replace(/\bthe unclean bird and the clean\b/g, 'the bird not clean for worship and the bird clean for worship')
      .replace(/\bmake yourselves unclean\b/g, 'make yourselves not clean for worship')
      .replace(/\bmake yourself unclean\b/g, 'make yourself not clean for worship')
      .replace(/\bmake himself unclean\b/g, 'make himself not clean for worship')
      .replace(/\bmake herself unclean\b/g, 'make herself not clean for worship')
      .replace(/\bmake my holy place unclean\b/g, 'make my holy place not clean for worship')
      .replace(/\bmake it unclean\b/g, 'make it not clean for worship')
      .replace(/\bbecame unclean\b/g, 'became not clean for worship')
      .replace(/\bwere made unclean\b/g, 'were made not clean for worship')
      .replace(/\bwas made unclean\b/g, 'was made not clean for worship')
      .replace(/\bbecome unclean\b/g, 'become not clean for worship')
      .replace(/\bmade unclean\b/g, 'made not clean for worship')
      .replace(/\bhas sexual relations with\b/g, 'acts as only a husband and wife should with')
      .replace(/\bhave sexual relations with\b/g, 'act as only a husband and wife should with')
      .replace(/\bhad sexual relations with\b/g, 'acted as only a husband and wife should with')
      .replace(/\bto have sexual relations with\b/g, 'to act as only a husband and wife should with')
      .replace(/\bcommits adultery with another man's wife\b/g, "takes another man's wife as if she were his own wife")
      .replace(/\bcommits adultery with his neighbor's wife\b/g, "takes his neighbor's wife as if she were his own wife")
      .replace(/\bthe adulterer and the adulteress\b/g, 'the man and the woman')
      .replace(/\btabernacle\b/g, 'holy tent')
      .replace(/\bTabernacle\b/g, 'Holy Tent')
      .replace(/\bfree will offerings\b/g, 'gifts people choose to bring')
      .replace(/\bfree will offering\b/g, 'gift someone chooses to bring')
      .replace(/\bvows\b/g, 'special promises')
      .replace(/\bvow\b/g, 'special promise')
      .replace(/\bewe\b/g, 'female sheep')
      .replace(/\bgarment\b/g, 'piece of clothing')
      .replace(/\bgarments\b/g, 'clothes')
      .replace(/\bthe serious mark on the skin\b/g, 'the serious skin-disease mark')
      .replace(/\bserious mark on the skin\b/g, 'serious skin-disease mark')
      .replace(/\bmark of disease in the skin\b/g, 'disease mark on the skin')
      .replace(/\bmark of disease\b/g, 'disease mark')
      .replace(/\bmark on the skin\b/g, 'skin-disease mark')
      .replace(/\bdisease skin-disease mark\b/g, 'disease mark')
      .replace(/\bclean for worship of the disease mark\b/g, 'clean for worship')
      .replace(/\balready unclean\b/g, 'already not clean for worship')
      .replace(/\bhis being made clean\b/g, 'the priest said he was clean for worship')
      .replace(/\bthe offering for guilt\b/g, 'the guilt offering')
      .replace(/\bhis offering for guilt\b/g, 'his guilt offering')
      .replace(/\ban offering for guilt\b/g, 'a guilt offering');
  }

  result = result
    .replace(/\b(?:sweet-smelling\s+)+incense\b/g, 'sweet-smelling incense')
    .replace(/\bwill be not clean for worship\b/g, 'will not be clean for worship')
    .replace(/\bwill become not clean for worship\b/g, 'will not be clean for worship')
    .replace(/\bmade not clean for worship\b/g, 'made not clean for worship')
    .replace(/\bnot clean for worship to you\b/g, 'not clean for worship for you')
    .replace(/\bwill not be clean for worship to you\b/g, 'will not be clean for worship for you')
    .replace(/\bmust burn its memorial\b/g, 'must burn the part that belongs on the altar')
    .replace(/\bas its memorial part\b/g, 'as the part burned before the Lord')
    .replace(/\bits memorial part\b/g, 'the part burned before the Lord')
    .replace(/\bits memorial\b/g, 'the part burned before the Lord')
    .replace(/\bfor a memorial\b/g, 'as a reminder offering')
    .replace(/\bnot be clean for worship(?: for worship)+\b/g, 'not be clean for worship')
    .replace(/\bnot clean for worship(?: for worship)+\b/g, 'not clean for worship')
    .replace(/\bclean for worship(?: for worship)+\b/g, 'clean for worship')
    .replace(/\ba small measured amount of of\b/g, 'a small measured amount of')
    .replace(/\ban place outside\b/g, 'a place outside')
    .replace(/\ban place for\b/g, 'a place for')
    .replace(/\ban small\b/g, 'a small')
    .replace(/\ba offering\b/g, 'an offering')
    .replace(/\ban guilt offering\b/g, 'a guilt offering')
    .replace(/\bthe the\b/g, 'the')
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

  fs.writeFileSync(resourcePath, content, 'utf8');
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
  const verseRegex = /^###\s+(Leviticus\s+\d+:\d+)\s*\r?\n([\s\S]*?)(?=^###\s+Leviticus\s+\d+:\d+\s*$|(?![\s\S]))/gm;
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
