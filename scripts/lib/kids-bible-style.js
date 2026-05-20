const path = require('path')

const ENFORCED_BIBLE_TEXT_BOOKS = new Set(['genesis', 'leviticus', 'numbers', 'deuteronomy'])

const hardBlockedTerms = [
  {
    pattern: /\bearthen vessel\b/i,
    message: 'Use child-readable concrete wording such as "clay bowl" instead of "earthen vessel".',
  },
  {
    pattern: /\b(ephah|hin|gerah|gerahs|homer|homers)\b/,
    message: 'Replace ancient measure names with simple measured amounts.',
  },
  {
    pattern: /\blog of oil\b/i,
    message: 'Use "small measure of oil" instead of "log of oil".',
  },
  {
    pattern: /\bscarlet\b/i,
    message: 'Use a concrete object such as "red thread" instead of the bare color term "scarlet".',
  },
  {
    pattern: /\bewe lamb\b/i,
    message: 'Use "female lamb" instead of "ewe lamb".',
  },
  {
    pattern: /\bheifer\b/i,
    message: 'Use "young cow" instead of "heifer".',
  },
  {
    pattern: /\bwithout any blemish\b/i,
    message: 'Use simple health wording such as "with nothing wrong with it".',
  },
  {
    pattern: /\bhyssop\b(?! branch)/i,
    message: 'Use "leafy hyssop branch" so children can picture the plant.',
  },
  {
    pattern: /\bvessel\b/i,
    message: 'Use "container", "bowl", or another concrete word instead of "vessel".',
  },
  {
    pattern: /\bcubit(s)?\b/i,
    message: 'Use "arm-length" or another child-readable measure instead of "cubit".',
  },
  {
    pattern: /\bwhich ever\b/i,
    message: 'Use the child-readable spelling "whichever".',
  },
  {
    pattern: /\bcast it\b/i,
    message: 'Use "put it", "throw it", or another plain action instead of "cast it".',
  },
  {
    pattern: /\b(wave|waved|waving)\b/i,
    message: 'Use "lift before the Lord" language instead of unclear ritual "wave" phrasing.',
  },
  {
    pattern: /\bpronounce\b/i,
    message: 'Use "say" instead of "pronounce" in child-facing Bible text.',
  },
  {
    pattern: /\bpersons\b/i,
    message: 'Use "people" instead of "persons" in child-facing Bible text.',
  },
  {
    pattern: /\b(being made clean impurity|sweet sweet-smelling|Holy Holy|person loathes|made holy (it|them)|make holy (it|them)|sweet-smelling incense pan|a incense pan|afflict your people)\b/i,
    message: 'Fix generated phrasing so the verse reads naturally for children.',
  },
  {
    pattern: /\b(bastard|harlot|whore|sodomite)\b/i,
    message: 'Use child-readable wording for sexual-law terms instead of older adult vocabulary.',
  },
  {
    pattern: /\byour person\b/i,
    message: 'Use plain whole-self wording such as "all your life" instead of "your person".',
  },
  {
    pattern: /\bpledges?\b/i,
    message: 'Use child-readable promise or loan-security wording instead of "pledge".',
  },
  {
    pattern: /\babominable\b/i,
    message: 'Use "detestable" wording instead of the older word "abominable".',
  },
  {
    pattern: /\bis who goes\b/i,
    message: 'Fix generated phrasing such as "is who goes" so it reads naturally.',
  },
  {
    pattern: /\bstiff neck\b/i,
    message: 'Use child-readable stubbornness wording instead of "stiff neck".',
  },
]

function polishKidReadableText(text, ageRange) {
  let result = text

  result = replaceAncientMeasures(result)
  result = replaceRitualObjects(result)
  result = replaceAnimalTerms(result)
  result = replaceAwkwardRitualPhrases(result)

  if (ageRange === '5-7') {
    result = replaceYoungerCeremonyTerms(result)
  } else {
    result = replaceOlderCeremonyTerms(result)
  }

  return finalPolish(result)
}

function replaceAncientMeasures(text) {
  return text
    .replace(/\bjust balances, just weights, a just ephah, and a just hin\b/g, 'honest scales, honest weights, an honest dry measure, and an honest liquid measure')
    .replace(/\bthree tenths of an ephah of fine flour\b/g, 'three tenth-measures of fine flour')
    .replace(/\btwo tenths of an ephah of fine flour\b/g, 'two tenth-measures of fine flour')
    .replace(/\bone tenth of an ephah of fine flour\b/g, 'one tenth-measure of fine flour')
    .replace(/\bthree tenths of an ephah\b/g, 'three tenth-measures')
    .replace(/\btwo tenths of an ephah\b/g, 'two tenth-measures')
    .replace(/\bone tenth of an ephah\b/g, 'one tenth-measure')
    .replace(/\ba just ephah\b/g, 'an honest dry measure')
    .replace(/\ba just hin\b/g, 'an honest liquid measure')
    .replace(/\ban ephah of fine flour\b/g, 'a dry measure of fine flour')
    .replace(/\ban ephah\b/g, 'a dry measure')
    .replace(/\bone fourth of a hin of oil\b/g, 'one fourth-measure of oil')
    .replace(/\bone third of a hin of oil\b/g, 'one third-measure of oil')
    .replace(/\bhalf a hin of oil\b/g, 'a half-measure of oil')
    .replace(/\bone fourth of a hin\b/g, 'one fourth-measure')
    .replace(/\bone third of a hin\b/g, 'one third-measure')
    .replace(/\bhalf a hin\b/g, 'a half-measure')
    .replace(/\bthe fourth part of a hin\b/g, 'one fourth-measure')
    .replace(/\bthe third part of a hin\b/g, 'one third-measure')
    .replace(/\bone log of oil\b/g, 'one small measure of oil')
    .replace(/\ba log of oil\b/g, 'a small measure of oil')
    .replace(/\bthe log of oil\b/g, 'the small measure of oil')
    .replace(/\bsome of the log of oil\b/g, 'some of the small measure of oil')
    .replace(/\bten homers\b/g, 'a huge amount')
    .replace(/\bhomers\b/g, 'large measures')
    .replace(/\bhomer\b/g, 'large measure')
    .replace(/\baccording to the shekel of the sanctuary, which weighs twenty gerahs\b/g, 'by the sanctuary weight')
    .replace(/\bshekel of the sanctuary\b/g, 'sanctuary weight')
    .replace(/\bshekels of silver\b/g, 'silver pieces')
    .replace(/\bshekels of money\b/g, 'silver pieces')
    .replace(/\bshekels\b/g, 'silver pieces')
    .replace(/\bshekel\b/g, 'silver piece')
    .replace(/\bgerahs\b/g, 'small weight units')
    .replace(/\bgerah\b/g, 'small weight unit')
    .replace(/\bcubits\b/g, 'arm-lengths')
    .replace(/\bcubit\b/g, 'arm-length')
    .replace(/\btenth parts\b/g, 'tenth-measures')
    .replace(/\btwo tenth parts\b/g, 'two tenth-measures')
    .replace(/\bone tenth part\b/g, 'one tenth-measure')
}

function replaceRitualObjects(text) {
  return text
    .replace(/\bearthen vessel\b/g, 'clay bowl')
    .replace(/\bearthen vessels\b/g, 'clay bowls')
    .replace(/\brunning water\b/g, 'fresh flowing water')
    .replace(/\bcedar wood\b/g, 'a piece of cedar wood')
    .replace(/\bthe a piece of cedar wood\b/g, 'the piece of cedar wood')
    .replace(/\bscarlet\b/g, 'red thread')
    .replace(/\bhyssop\b/g, 'leafy hyssop branch')
    .replace(/\bvessels of the sanctuary\b/g, 'holy tent tools')
    .replace(/\bvessels of ministry\b/g, 'service tools')
    .replace(/\bvessels\b/g, 'containers')
    .replace(/\bvessel\b/g, 'container')
    .replace(/\bveil\b/g, 'curtain')
    .replace(/\bmercy seat\b/g, 'atonement cover')
    .replace(/\bcenser\b/g, 'incense pan')
    .replace(/\bincense\b/g, 'sweet-smelling incense')
    .replace(/\bsanctuary\b/g, 'holy place')
    .replace(/\bSanctuary\b/g, 'Holy Place')
}

function replaceAnimalTerms(text) {
  return text
    .replace(/\bewe lamb\b/g, 'female lamb')
    .replace(/\bewe lambs\b/g, 'female lambs')
    .replace(/\brams\b/g, 'male sheep')
    .replace(/\bram\b/g, 'male sheep')
    .replace(/\bheifer\b/g, 'young cow')
    .replace(/\bheifers\b/g, 'young cows')
    .replace(/\bturtledoves\b/g, 'doves')
    .replace(/\bturtledove\b/g, 'dove')
    .replace(/\byoung pigeons\b/g, 'young pigeons')
    .replace(/\bkid of the goats\b/g, 'young goat')
    .replace(/\bmale goat\b/g, 'male goat')
    .replace(/\bone female goat\b/g, 'one female goat')
    .replace(/\bwithout any blemish\b/g, 'with nothing wrong with it')
    .replace(/\bwithout blemish\b/g, 'with nothing wrong with it')
    .replace(/\bwithout defect\b/g, 'with nothing wrong with it')
    .replace(/\btwo male lambs with nothing wrong with it\b/g, 'two male lambs with nothing wrong with them')
    .replace(/\btwo lambs with nothing wrong with it\b/g, 'two lambs with nothing wrong with them')
    .replace(/\bseven lambs with nothing wrong with it a year old\b/g, 'seven year-old lambs with nothing wrong with them')
    .replace(/\bseven lambs with nothing wrong with them a year old\b/g, 'seven year-old lambs with nothing wrong with them')
    .replace(/\bmale lambs a year old with nothing wrong with it\b/g, 'male lambs a year old with nothing wrong with them')
    .replace(/\bseven male lambs a year old with nothing wrong with it\b/g, 'seven male lambs a year old with nothing wrong with them')
    .replace(/\bfourteen male lambs a year old with nothing wrong with it\b/g, 'fourteen male lambs a year old with nothing wrong with them')
    .replace(/\blambs a year old with nothing wrong with it\b/g, 'lambs a year old with nothing wrong with them')
    .replace(/\bone male lamb a year old with nothing wrong with them\b/g, 'one male lamb a year old with nothing wrong with it')
    .replace(/\bone female lamb a year old with nothing wrong with them\b/g, 'one female lamb a year old with nothing wrong with it')
    .replace(/\bThey must be with nothing wrong with it\b/g, 'They must have nothing wrong with them')
    .replace(/\bthey must be with nothing wrong with it\b/g, 'they must have nothing wrong with them')
    .replace(/\bSee that they are with nothing wrong with it\b/g, 'See that they have nothing wrong with them')
    .replace(/\bsee that they are with nothing wrong with it\b/g, 'see that they have nothing wrong with them')
    .replace(/\ball with nothing wrong with it\b/g, 'all with nothing wrong with them')
}

function replaceAwkwardRitualPhrases(text) {
  return text
    .replace(/\bmust command them to take\b/g, 'must tell them to bring')
    .replace(/\bmust command them to kill\b/g, 'must tell them to kill')
    .replace(/\bmust command that they\b/g, 'must tell them to')
    .replace(/\bcommand them to take\b/g, 'tell them to bring')
    .replace(/\bcommand them to kill\b/g, 'tell them to kill')
    .replace(/\bWhoever is to be cleansed\b/g, 'Whoever is being made clean')
    .replace(/\bwho is to be cleansed\b/g, 'who is being made clean')
    .replace(/\bperson who is to be cleansed\b/g, 'person being made clean')
    .replace(/\bin the day of his being made clean\b/g, 'on the day he is made clean')
    .replace(/\bin the day of her being made clean\b/g, 'on the day she is made clean')
    .replace(/\bfor the person who is being made clean\b/g, 'for the person being made clean')
    .replace(/\bmust tell them to bring for the person\b/g, 'must tell them to bring these things for the person')
    .replace(/\btwo living clean birds\b/g, 'two live birds that were clean for worship')
    .replace(/\btwo live clean birds\b/g, 'two live birds that were clean for worship')
    .replace(/\bperson with the serious disease\b/g, 'person with the serious skin disease')
    .replace(/\bserious mark of disease\b/g, 'serious mark on the skin')
    .replace(/\bmark of disease\b/g, 'mark of disease')
    .replace(/\bpronounce him clean\b/g, 'say he is clean')
    .replace(/\bpronounce her clean\b/g, 'say she is clean')
    .replace(/\bpronounce it clean\b/g, 'say it is clean')
    .replace(/\bpronounce the house clean\b/g, 'say the house is clean')
    .replace(/\bpronounce him unclean\b/g, 'say he is unclean')
    .replace(/\bpronounce her unclean\b/g, 'say she is unclean')
    .replace(/\bpronounce it unclean\b/g, 'say it is unclean')
    .replace(/\bto be cleansed from\b/g, 'to be made clean from')
    .replace(/\bthe slain bird\b/g, 'the bird that was killed')
    .replace(/\bslain bird\b/g, 'bird that was killed')
    .replace(/\bcleanses him\b/g, 'helps make him clean')
    .replace(/\bcleanses her\b/g, 'helps make her clean')
    .replace(/\bcleanse the house\b/g, 'make the house clean')
    .replace(/\bcleanse it\b/g, 'make it clean')
    .replace(/\bfor his being made clean\b/g, 'to be made clean')
    .replace(/\bfor her being made clean\b/g, 'to be made clean')
    .replace(/\bcleansing\b/g, 'being made clean')
    .replace(/\buncleanness\b/g, 'being unclean')
    .replace(/\bmake atonement for him, helping make things right with God\b/g, 'make atonement for him, to help make things right with God')
    .replace(/\bmake atonement for her, helping make things right with God\b/g, 'make atonement for her, to help make things right with God')
    .replace(/\bmake atonement for them, helping make things right with God\b/g, 'make atonement for them, to help make things right with God')
    .replace(/\bmake atonement for you, helping make things right with God\b/g, 'make atonement for you, to help make things right with God')
    .replace(/\bmake atonement for him, to help make things right with God who is being made clean\b/g, 'make atonement for him, to help make things right with God, as he is being made clean')
    .replace(/\bmake atonement for the person being made clean before the Lord\b/g, 'make atonement before the Lord for the person being made clean')
    .replace(/\bhelping make things right with God who\b/g, 'to help make things right with God for the person who')
    .replace(/\boffer him for an offering for sin\b/g, 'offer it as an offering for sin')
    .replace(/\boffer him for a sin offering\b/g, 'offer it as a sin offering')
    .replace(/\boffer him for an offering for guilt\b/g, 'offer it as an offering for guilt')
    .replace(/\boffer him for a guilt offering\b/g, 'offer it as a guilt offering')
    .replace(/\bwave them for a wave offering\b/g, 'lift them before the Lord as an offering')
    .replace(/\bwave them for a lifted offering before the Lord\b/g, 'lift them before the Lord as a lifted offering')
    .replace(/\bwave them for an offering lifted before the Lord\b/g, 'lift them before the Lord as an offering')
    .replace(/\bset the man\b/g, 'bring the man')
    .replace(/\bset the woman\b/g, 'bring the woman')
    .replace(/\bset him\b/g, 'bring him')
    .replace(/\bset her\b/g, 'bring her')
    .replace(/\bupon the blood\b/g, 'over the blood')
    .replace(/\bin the place of the holy place\b/g, 'in the holy place')
    .replace(/\bdwell outside\b/g, 'stay outside')
    .replace(/\bdwell\b/g, 'live')
    .replace(/\bdwells\b/g, 'lives')
    .replace(/\bdwelt\b/g, 'lived')
    .replace(/\bshut up the house\b/g, 'close the house')
    .replace(/\bhollow streaks\b/g, 'sunken streaks')
    .replace(/\bcast them into\b/g, 'throw them into')
    .replace(/\bcast it into\b/g, 'throw it into')
    .replace(/\bcast it beside\b/g, 'put it beside')
    .replace(/\bcast it on him\b/g, 'threw it at him')
    .replace(/\bthe slain\b/g, 'someone who was killed')
    .replace(/\bplaster the house\b/g, 'repair the house with fresh plaster')
    .replace(/\bthe blood of the bird that was killed over the fresh flowing water\b/g, 'the blood of the bird that was killed over the fresh flowing water')
}

function replaceYoungerCeremonyTerms(text) {
  return text
    .replace(/\bburnt offerings\b/g, 'burned offerings')
    .replace(/\bburnt offering\b/g, 'burned offering')
    .replace(/\bgrain offerings\b/g, 'grain gifts')
    .replace(/\bgrain offering\b/g, 'grain gift')
    .replace(/\bsin offerings\b/g, 'offerings for sin')
    .replace(/\bsin offering\b/g, 'offering for sin')
    .replace(/\bguilt offerings\b/g, 'offerings for guilt')
    .replace(/\bguilt offering\b/g, 'offering for guilt')
    .replace(/\bdrink offerings\b/g, 'drink gifts')
    .replace(/\bdrink offering\b/g, 'drink gift')
    .replace(/\bwave offerings\b/g, 'lifted offerings')
    .replace(/\bwave offering\b/g, 'lifted offering')
    .replace(/\bheave offering\b/g, 'special offering')
    .replace(/\bpeace offerings\b/g, 'peace offerings')
    .replace(/\bmost holy things\b/g, 'most holy gifts')
    .replace(/\bmost holy\b/g, 'most holy')
    .replace(/\bfine flour\b/g, 'fine flour')
}

function replaceOlderCeremonyTerms(text) {
  return text
    .replace(/\bburnt offerings\b/g, 'burned offerings')
    .replace(/\bburnt offering\b/g, 'burned offering')
    .replace(/\bheave offering\b/g, 'special offering')
    .replace(/\bwave offerings\b/g, 'offerings lifted before the Lord')
    .replace(/\bwave offering\b/g, 'offering lifted before the Lord')
}

function finalPolish(text) {
  return text
    .replace(/\ba a /g, 'a ')
    .replace(/\ban clay bowl\b/g, 'a clay bowl')
    .replace(/\bfor the person being made clean two live\b/g, 'for the person being made clean: two live')
    .replace(/\b, red thread, and leafy hyssop branch\b/g, ', red thread, and a leafy hyssop branch')
    .replace(/\b, leafy hyssop branch, and red thread\b/g, ', a leafy hyssop branch, and red thread')
    .replace(/\btake leafy hyssop branch\b/g, 'take a leafy hyssop branch')
    .replace(/\btake a piece of cedar wood, leafy hyssop branch\b/g, 'take a piece of cedar wood, a leafy hyssop branch')
    .replace(/\bthe the\b/g, 'the')
    .replace(/\bthe a piece of cedar wood\b/g, 'the piece of cedar wood')
    .replace(/\ba piece of a piece of cedar wood\b/g, 'a piece of cedar wood')
    .replace(/\bleafy leafy hyssop branch branch\b/g, 'leafy hyssop branch')
    .replace(/\bleafy hyssop branch branch\b/g, 'leafy hyssop branch')
    .replace(/\bred thread thread\b/g, 'red thread')
    .replace(/\bclay bowl over fresh flowing water\b/g, 'clay bowl held over fresh flowing water')
    .replace(/\bwith nothing wrong with them for a burned offering\b/g, 'with nothing wrong with them as a burned offering')
    .replace(/\bwith nothing wrong with it for a burned offering\b/g, 'with nothing wrong with it as a burned offering')
    .replace(/\bwith nothing wrong with it for an offering\b/g, 'with nothing wrong with it as an offering')
    .replace(/\bwith nothing wrong with them for an offering\b/g, 'with nothing wrong with them as an offering')
    .replace(/\bwith nothing wrong with it for\b/g, 'with nothing wrong with it for')
    .replace(/\bfor his being made clean\b/g, 'to be made clean')
    .replace(/\bfor her being made clean\b/g, 'to be made clean')
    .replace(/\bfor their being made clean\b/g, 'to be made clean')
    .replace(/\bin the day of his being made clean\b/g, 'on the day he is made clean')
    .replace(/\bin the day of her being made clean\b/g, 'on the day she is made clean')
    .replace(/\boffering for guilt to be waved\b/g, 'offering for guilt to be lifted before the Lord')
    .replace(/\bguilt offering to be waved\b/g, 'guilt offering to be lifted before the Lord')
    .replace(/\bwave the sheaf before the Lord\b/g, 'lift the bundle of grain before the Lord')
    .replace(/\bwave the sheaf\b/g, 'lift the bundle of grain')
    .replace(/\bwave the grain gift before the Lord\b/g, 'lift the grain gift before the Lord')
    .replace(/\bwave the grain offering before the Lord\b/g, 'lift the grain offering before the Lord')
    .replace(/\bwave it for an offering lifted before the Lord\b/g, 'lift it before the Lord as an offering')
    .replace(/\bwave it\b/g, 'lift it')
    .replace(/\bwave them for an offering lifted before the Lord\b/g, 'lift them before the Lord as an offering')
    .replace(/\bwave them for a lifted offering\b/g, 'lift them before the Lord as a lifted offering')
    .replace(/\bwave them with the bread of the first fruits for a lifted offering before the Lord\b/g, 'lift them before the Lord with the bread from the first fruits as an offering')
    .replace(/\bwave them with the bread of the first fruits for a offering lifted before the Lord before the Lord\b/g, 'lift them before the Lord with the bread from the first fruits as an offering')
    .replace(/\bwave them with the bread of the first fruits for a offering lifted before the Lord\b/g, 'lift them before the Lord with the bread from the first fruits as an offering')
    .replace(/\bwave them with the bread of the first fruits for an offering lifted before the Lord before the Lord\b/g, 'lift them before the Lord with the bread from the first fruits as an offering')
    .replace(/\bwave them with the bread of the first fruits for an offering lifted before the Lord\b/g, 'lift them before the Lord with the bread from the first fruits as an offering')
    .replace(/\bwaved them for an offering lifted before the Lord\b/g, 'lifted them before the Lord as an offering')
    .replace(/\bwaved them for a lifted offering before the Lord\b/g, 'lifted them before the Lord as an offering')
    .replace(/\bwaved them for a offering lifted before the Lord before the Lord\b/g, 'lifted them before the Lord as an offering')
    .replace(/\bwaved them for a offering lifted before the Lord\b/g, 'lifted them before the Lord as an offering')
    .replace(/\bwaved it for an offering lifted before the Lord\b/g, 'lifted it before the Lord as an offering')
    .replace(/\bwaved it for a lifted offering before the Lord\b/g, 'lifted it before the Lord as an offering')
    .replace(/\bwaved it for a offering lifted before the Lord before the Lord\b/g, 'lifted it before the Lord as an offering')
    .replace(/\bwaved it for a offering lifted before the Lord\b/g, 'lifted it before the Lord as an offering')
    .replace(/\bwaved the breasts and the right thigh for an offering lifted before the Lord\b/g, 'lifted the breasts and the right thigh before the Lord as an offering')
    .replace(/\bwaved the breasts and the right thigh for a lifted offering before the Lord\b/g, 'lifted the breasts and the right thigh before the Lord as an offering')
    .replace(/\bwaved the breasts and the right thigh for a offering lifted before the Lord before the Lord\b/g, 'lifted the breasts and the right thigh before the Lord as an offering')
    .replace(/\bwaved the breasts and the right thigh for a offering lifted before the Lord\b/g, 'lifted the breasts and the right thigh before the Lord as an offering')
    .replace(/\bthe breast may be waved for an offering lifted before the Lord\b/g, 'the breast may be lifted before the Lord as an offering')
    .replace(/\bthe breast may be waved for a lifted offering before the Lord\b/g, 'the breast may be lifted before the Lord as an offering')
    .replace(/\bthe breast may be waved for a offering lifted before the Lord before the Lord\b/g, 'the breast may be lifted before the Lord as an offering')
    .replace(/\bthe breast may be waved for a offering lifted before the Lord\b/g, 'the breast may be lifted before the Lord as an offering')
    .replace(/\bthe breast that is waved\b/g, 'the breast lifted before the Lord')
    .replace(/\bThe waved breast\b/g, 'The breast lifted before the Lord')
    .replace(/\bthe waved breast\b/g, 'the breast lifted before the Lord')
    .replace(/\bFor the waved breast\b/g, 'For the breast lifted before the Lord')
    .replace(/\bwaved breast\b/g, 'breast lifted before the Lord')
    .replace(/\bwhen you wave the sheaf\b/g, 'when you lift the bundle of grain')
    .replace(/\bOn the day when you wave the sheaf\b/g, 'On the day when you lift the bundle of grain')
    .replace(/\blift them before the Lord as an offering before the Lord\b/g, 'lift them before the Lord as an offering')
    .replace(/\blift them before the Lord as a lifted offering before the Lord\b/g, 'lift them before the Lord as an offering')
    .replace(/\boffering lifted before the Lord before the Lord\b/g, 'offering lifted before the Lord')
    .replace(/\blifted offering before the Lord\b/g, 'offering lifted before the Lord')
    .replace(/\btouched the bone, or someone who was killed, or the dead, or the grave\b/g, 'touched a bone, someone who was killed, someone who died, or a grave')
    .replace(/\bsomeone who was killed bird\b/g, 'bird that was killed')
    .replace(/\bon all the containers, on the persons who were there\b/g, 'on all the containers, on the people who were there')
    .replace(/\bIf the priest comes in, and examine it\b/g, 'If the priest comes in and examines it')
    .replace(/\bfor use in water for being made clean impurity\b/g, 'to make cleansing water')
    .replace(/\bwater for being made clean impurity\b/g, 'cleansing water')
    .replace(/\bthe water for impurity\b/g, 'the cleansing water')
    .replace(/\bwater for impurity\b/g, 'cleansing water')
    .replace(/\bHis being unclean is yet on him\b/g, 'He is still unclean')
    .replace(/\bsweet sweet-smelling incense\b/g, 'sweet-smelling incense')
    .replace(/\bsweet-smelling incense pan\b/g, 'incense pan')
    .replace(/\ba incense pan\b/g, 'an incense pan')
    .replace(/\bHoly Holy Place\b/g, 'Most Holy Place')
    .replace(/\bbecause of the being unclean of the people of Israel\b/g, 'because the people of Israel were unclean')
    .replace(/\bfrom the being unclean of the people of Israel\b/g, "from the people's being unclean")
    .replace(/\bas the being unclean of her period\b/g, 'like her period')
    .replace(/\bfor the being unclean of her discharge\b/g, 'because of her unclean discharge')
    .replace(/\bthe being unclean of man\b/g, "a person's being unclean")
    .replace(/\bour person loathes this disgusting food\b/g, 'we hate this disgusting food')
    .replace(/\bmade holy it\b/g, 'made it holy')
    .replace(/\bmade holy them\b/g, 'made them holy')
    .replace(/\bmake holy it\b/g, 'make it holy')
    .replace(/\bmake holy them\b/g, 'make them holy')
    .replace(/\bhelping make things right with God of Israel, helping make things right with God\b/g, 'helping make things right with God for Israel')
    .replace(/\bafflict your people\b/g, 'humble yourselves')
    .replace(/\bor else he die\b/g, 'or else he will die')
    .replace(/\bwhich ever\b/g, 'whichever')
    .replace(/\bnot seeing him, and threw it at him\b/g, 'without seeing him, threw it at him')
    .replace(/\bpersons\b/g, 'people')
    .replace(/\bmust be an lasting rule\b/g, 'must be a lasting rule')
    .replace(/\ban lasting rule\b/g, 'a lasting rule')
    .replace(/\ba offering\b/g, 'an offering')
    .replace(/\ban grain\b/g, 'a grain')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function collectBibleTextStyleIssues(filePath, content) {
  const chapterPath = getBibleTextChapterPath(filePath)
  if (!chapterPath) return { errors: [], warnings: [] }

  const [, book] = chapterPath.match(/^old-testament[\\/]([^\\/]+)/) || []
  const isEnforcedBook = ENFORCED_BIBLE_TEXT_BOOKS.has(book)
  if (!isEnforcedBook) return { errors: [], warnings: [] }

  const issues = []

  for (const term of hardBlockedTerms) {
    if (term.pattern.test(content)) {
      issues.push(term.message)
    }
  }

  return {
    errors: issues,
    warnings: [],
  }
}

function getBibleTextChapterPath(filePath) {
  const contentDir = path.join(__dirname, '..', '..', 'content')
  const relativePath = path.normalize(path.relative(contentDir, filePath))
  const match = relativePath.match(new RegExp(`^${escapeRegex(path.normalize('bible-text/'))}ages-(?:5-7|8-10)[\\\\/]?(.+)$`))
  return match ? path.normalize(match[1]) : null
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

module.exports = {
  collectBibleTextStyleIssues,
  hardBlockedTerms,
  polishKidReadableText,
}
