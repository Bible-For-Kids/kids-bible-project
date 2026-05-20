# Agent Guide

This project is a verse-by-verse Children's Bible Version. Before editing Bible text, read:

- `docs/depth-preservation-guidelines.md`
- `docs/translation-guidelines.md`
- `docs/chapter-resource-template.md`

## Voice Policy

- Preserve the Bible's meaning, order, numbers, people, places, and theological claims.
- Ages 5-7 should use rich picture language, not flat fragments. Short sentences are good, but vivid faithful clarity is better than artificial word caps.
- Ages 8-10 may keep more biblical phrasing, but it still must be readable by a child without an adult beside them.
- Do not import later details into earlier verses. Use translation notes when a verse raises a question that later passages clarify.
- Chapter summaries must be theologically precise. Prefer "God speaks, and his words come to pass" over "creation obeys" unless the text itself uses personal obedience language.

## Child-Readable Ritual Terms

For Leviticus, Numbers, and other ceremonial or legal passages, do not leave bare ancient terms in the Bible text.

- `earthen vessel` -> `clay bowl`
- `running water` -> `fresh flowing water`
- `scarlet` -> `red thread` when the object is the thread or cord
- `hyssop` -> `leafy hyssop branch`
- `ephah`, `hin`, `log`, `homer`, `gerah`, `cubit` -> a simple measure such as `tenth-measure`, `small measure of oil`, `honest dry measure`, `honest liquid measure`, `large measure`, or `arm-length`
- `ewe lamb` -> `female lamb`
- `heifer` -> `young cow`

Do not remove ritual specificity to make the verse easier. Explain it with concrete objects and simple action.

## Chapter Resource Files

The reader uses Bible text from `content/bible-text/...`, but chapter resource files in `content/old-testament/...` should follow the Genesis 1-2 pattern:

- `Original Reference` for every verse
- age-band translations
- `Translation Notes` where wording needs explanation
- `Key Vocabulary` or important keywords when a child may need help
- `Cross-References` or related verses where helpful
- chapter summary, lessons, memory verses, questions, prayer
- illustration prompts for especially visual passages

Use `docs/chapter-resource-template.md` when starting a new resource chapter.

When draft Bible text exists but the resource chapter is missing, run:

```powershell
yarn generate:resources
```

This creates missing `content/old-testament/...` resource chapters from the age-range Bible text and WEB original-reference text. It intentionally skips hand-reviewed files such as Genesis 1-2. Use `node scripts/generate-resource-chapters.js --overwrite-generated` only to refresh files that contain the draft resource marker.

## Approval Gate

Generated or imported chapters are drafts until they are added to `content/bible-text/approved-chapters.json`. The public reader must only expose approved chapters.

- Genesis 1-2 are the current approved baseline.
- Do not add a chapter to the approved manifest until its resource chapter follows the Genesis 1-2 pattern and both age-range Bible text files have been reviewed for theological accuracy, child-readable vocabulary, and visual storytelling.
- A chapter can be complete as a draft and still be unapproved. Keep it out of the manifest until it can be read independently by a child in the target age range.
- Legal, ritual, genealogy, and measurement-heavy chapters need special review. Do not let imported adult wording such as `public adjuration`, `earthen vessel`, `ephah`, or `one log of oil` reach the public reader.

## Validation

Run these before committing:

```powershell
yarn validate:content
yarn lint
yarn build
```

The Leviticus and Numbers importers call `scripts/lib/kids-bible-style.js`, and `yarn validate:content` currently blocks known child-unfriendly terms for those reviewed books. Extend `ENFORCED_BIBLE_TEXT_BOOKS` in that helper as more books receive a careful style pass.
