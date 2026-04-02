---
name: investigative-narrative-writer
description: Transform raw investigative evidence and timelines into scene-driven, legally defensible long-form journalism. Activate when writing or revising any investigative article, especially when elevating drafts from evidence-catalog mode to narrative mode. Works alongside write-article and ai-writing-detox skills.
argument-hint: "[file-path or topic]"
---

# Investigative Narrative Writing Skill

Write scene-driven, legally defensible, emotionally forceful long-form investigative journalism. The goal is not theatrical condemnation. The goal is maximum factual force with minimum unnecessary editorializing.

This skill is the HIGHER-ORDER companion to `/write-article`. The write-article skill covers voice, formatting, and OPSEC. This skill covers *narrative architecture* -- the difference between an evidence catalog and a story built to withstand legal scrutiny while landing with full emotional weight.

**Before writing, read these companion files:**
- `examples/good-vs-bad.md` -- side-by-side examples of what to do and what not to do
- `references/audit-checklist.md` -- the self-audit that must run before returning any draft
- `template.md` -- the structural template for each section/chapter

---

## Working Modes

There are three distinct modes. Keeping them separate prevents editorial scaffolding from contaminating the final text.

1. **Planning Mode** -- Used for outlining, sequencing, section order, chapter maps. Output looks like notes, bullet points, structural sketches.

2. **Editorial Diagnosis Mode** -- Used for critique: what is weak, what should move, what should be cut, what needs sourcing. Output looks like margin comments, revision notes, quality assessments.

3. **Publishable Prose Mode** -- Used only for final-reader text. This is the only mode that produces content a reader would see.

**The rule:** Never let Planning Mode or Editorial Diagnosis language appear inside Publishable Prose output. If a sentence reads like a note to the writer, a structural observation, or an editorial diagnosis, it does not belong in the draft. These modes exist to serve the prose, not to appear in it.

---

## 0. Hard Bans

### 0a. No Meta Prose

Do not write about the writing. Do not explain the chapter to the reader. Do not narrate what the section is doing. Do not tell the reader how to interpret a scene if the scene already does the work.

**Forbidden patterns:**
- "This chapter is about..."
- "That is where the story begins."
- "What makes this scene powerful..."
- "The reader can see..."
- "In hindsight..."
- "The next chapter..."
- "Think about what that means."
- "Listen to him."
- "I want you to count them."
- "What follows is..."
- "That is what capture changes."
- "I need you to understand..."
- "Consider what that means."

If a sentence sounds like workshop commentary, delete it. If a sentence sounds like notes to the writer, delete it. If a sentence sounds like a professor explaining the narrative to a student, delete it. Only output publishable prose.

The reason this matters: meta prose is the single most common failure mode. The model defaults to explaining what the writing is doing instead of letting the writing do it. Every meta sentence weakens the prose around it because it signals to the reader that the writer doesn't trust the material to land on its own.

### 0b. No Direct Address Unless Quoting

Do not address the reader directly. No "you," "I want you to notice," "think about this," or similar rhetorical steering unless quoting a source verbatim.

The first-person narrator voice ("I've read the records") is acceptable because it establishes the journalist's presence. But second-person commands ("Think about that," "Listen to him," "I need you to sit with that") are prosecutorial stage direction. They tell the reader how to process what they're reading instead of letting the material work.

### 0c. No Rhetorical Abstraction Loops

Do not build paragraphs around repeated abstract verdicts:
- "That is what..."
- "This is where..."
- "That is why..."
- "This is the point..."
- "The meaning is..."
- "What matters is..."

If a line summarizes the paragraph's thesis instead of advancing scene, fact, or contradiction, cut it. Prefer concrete action over abstract naming.

### 0d. Limit Generalized Institutional Voice

Do not open body sections with generalized claims about "systems," "the public," "institutions," or "stories like this" unless the section is explicitly a conclusion or reckoning.

Stay inside the reported case as long as possible. Move broad interpretive language to the back third of the chapter or the final chapter.

### 0e. Concrete-to-Abstract Ratio

For every abstract interpretive paragraph, include at least two paragraphs rooted in:
- scene
- quote
- physical action
- documented event
- specific contradiction
- material object

If the prose goes more than two paragraphs without a concrete anchor, re-ground it.

### 0f. No Structural Self-Reference

Do not refer to chapter numbers, section names, or the structure of the work inside final prose. The reader should never be reminded that they are reading an assembled chapter plan.

Forbidden in Publishable Prose:
- "In Chapter Three..."
- "This section covers..."
- "As discussed in the previous section..."
- "The following chapter will show..."
- Any reference to the piece as "this article," "this series," or "this chapter" unless it is a single, brief editorial aside (and even then, prefer cutting it)

### 0g. No Empty Emphasis Sentences

Delete standalone emphasis lines unless they introduce new factual meaning.

**Examples to cut:**
- "That matters."
- "That is the danger."
- "That is a serious problem."
- "Those distinctions are everything here."

If a sentence only signals importance, cut it and strengthen the sentence before it.

**Preferred transitions** (these advance the narrative instead of underlining it):
- "Two days later, the lock changed."
- "By the next visit, he was thinner."
- "The records tell a different story."
- "The house had its own version."
- "Patty heard it in the car before she saw it in the chart."

### 0h. Use Thematic Labels Sparingly

A thematic phrase may appear once as a section title or once in body prose. Do not keep repeating the chapter's conceptual label.

### 0i. First-Person Journalist Limits

First-person journalist presence is allowed only when:
- identifying reporting activity ("I've reviewed the pharmacy records")
- clarifying sourcing limits ("The recording is partially inaudible")
- marking observed contradiction ("The facility's own logs don't support that")
- establishing documentary basis ("The medication administration record shows")

Do not use first person for emotional steering, moral commentary, or literary atmosphere.

### 0j. Verdict Quarantine

Do not end sections or chapters with an abstract judgment.

End on:
- a quote
- a physical image
- a locked door
- a body fact
- a recorded line
- a documented irreversible act

If the final sentence could appear in a graduate seminar on narrative nonfiction, cut it.

---

## 1. Build Scenes, Not Timelines

Never write a "compliance timeline." Synthesize evidence into flowing narrative. Make the evidence feel *discovered* by the reader. Use rolling crises to build tension. Anchor scenes in sensory detail.

### Super-Human Senses

Go beyond visual descriptions. AI defaults to flat, purely visual scene-setting. Override that by using the "mute senses" -- sound, touch, and smell -- to bypass algorithmic blandness. Do not just say a room was tense. Describe the clack of shoes on linoleum, the chemical sweetness of hand sanitizer, the papery dryness of Russell's skin, the mechanical whir of a baby monitor cycling on.

These senses bypass the reader's analytical mind and land in their body. A reader can intellectualize a photograph. They cannot intellectualize a smell.

### Status Details

Include specific character artifacts that reveal a person's position, history, and identity: the coat and hat Russell always wore, the ironed shirts and cattle pictures on the wall, the bread pudding on Halloween. These are not decorations. They are the anchors that make the institutional violence feel real. A man with ironed shirts and cattle pictures is a specific person. A "patient" is a category. Institutional violence against a category is a policy problem. Institutional violence against a man with ironed shirts is a crime.

Do not describe characters with generic adjectives ("elderly," "frail," "kind"). Show them through what they wear, what they carry, what they keep on their walls, what they ask about when the Alzheimer's lets them surface.

See `examples/good-vs-bad.md` for side-by-side comparisons.

---

## 2. Eliminate Cross-Examination Formatting

Do not number lies or contradictions. State the lie, then immediately juxtapose it with the factual reality. Let the contradictions accumulate naturally and dramatically. Do not recap known facts at the climax. Open conclusions thematically.

See `examples/good-vs-bad.md` for side-by-side comparisons.

---

## 3. Establish the Power Dynamic

Clearly establish the level of control the subject holds. Show how they exert economic control (rent, surcharges), practical control (locked doors, police calls, baby monitors), prescribing authority (DEA number, pharmacy records), and institutional embeddedness (the agencies that depend on them are the same agencies that investigate them).

Show, rather than just state, the obedience of the system around them.

**The door is a recurring symbol.** Track it through the narrative. The door isn't a metaphor. It's a mechanism.

---

## 4. Integrate Data Seamlessly

Weave numbers directly into the horror of the physical reality. "More than 1,400 tablets were dispensed in Russell's final twenty-six days" hits harder inside a paragraph about a man who couldn't swallow than it does in a standalone data callout.

Highlight "ghost medications" (dispensed but undocumented) as evidence of systemic fraud. Weight loss is your most powerful data point. State it and move on.

### Proportional Comparisons

Numbers numb the reader unless translated into something they can see or hold. When reporting large numbers, statistics, or dosages, do not just state the data. Make the numbers visceral by comparing them to something known and concrete.

Instead of "he lost twenty-eight pounds," write "he lost twenty-eight pounds in forty-three days -- more than half a pound a day, the kind of decline that in a hospital would trigger an immediate nutrition consult." Instead of "1,400 tablets," write "enough pills to fill a cereal bowl." Instead of "$5,500 a month," write "more than double what most Oregonians pay in rent."

The comparison should be immediate, domestic, and physical. If the reader has to do math to feel the number, the number failed.

---

## 5. The 90/10 Rule

Let the facts do the heavy lifting. Do not tell the reader what to feel. Deliver the raw, human facts and let the reader supply the outrage. Ground every claim in exact quotes or documented evidence. Never summarize the significance of a scene immediately after showing it.

**Keep:** "Patty sat in the car and said, 'It's not their right.'"
**Cut:** "That was the moment the reader understands the theft."

---

## 5a. The Quote Diet

Put all quotes on a diet. Limit direct quotes to 6 to 20 words. Only use quotation marks for words that reveal character, advance the narrative, or provide a damning admission. If a source speaks in bloated or institutional language, paraphrase it.

Most natural human speech is full of filler. Most bureaucratic language is deliberately bloated to obscure meaning. Neither belongs inside quotation marks. Paraphrase the informational bulk. Reserve the quote marks for the punch.

**Bad:** "Well, I mean, we felt at the time that it was in the best interest of the patient to, you know, make sure that the family visits were managed in a way that was consistent with his care plan and didn't cause any undue disruption to the facility environment."

**Good:** Bartell said Patricia's visits needed to be "managed" to avoid "disruption." The facility's own logs documented almost none.

The short quote inside the paraphrase does more damage than the full transcript ever could. The reader hears the bureaucratic evasion in two words instead of forty.

---

## 5b. Sentence-Level Architecture

### The To-Be Diet

Strip passive verb constructions. Search for forms of "to be" (is, was, were, are, been) paired with "-ing" verbs or past participles. Replace them with active, propulsive verbs.

**Bad:** "The mayor is planning to review the records."
**Good:** "The mayor plans to review the records."

**Bad:** "Russell was being given Chlorpromazine by Bartell."
**Good:** "Bartell prescribed Chlorpromazine for Russell."

**Bad:** "The door was locked by staff."
**Good:** "Staff locked the door."

Passive voice hides the actor. In investigative journalism, the actor is the story. Every passive construction that hides who did what to whom is a small act of institutional protection. Make the subject do the verb.

### End on a Strong Word

The last word of every sentence carries disproportionate weight. It is the word the reader's eye lands on before the period sends them forward. Place the most important, powerful, or surprising word at the end of the sentence.

**Bad:** "Russell lost twenty-eight pounds during the forty-three days he was there."
**Good:** "In forty-three days, Russell lost twenty-eight pounds."

**Bad:** "The pharmacy records were not included in the documentation that was provided."
**Good:** "The documentation they provided omitted the pharmacy records."

The strong word propels the reader into the next sentence. If the sentence dies at the end, the reader's momentum dies with it.

---

## 6. Hedge Where the Evidence Requires It

The defensible version hits harder than the aggressive version. Qualify where you must, then slam the door. Scrub anything flagged as unverified. Credibility is cumulative. One sloppy detail undoes ten solid ones.

---

## 7. The Human Anchor Rule

Every section needs a human moment before the institutional violence. The reader has to care about the person before you show them what was done to that person.

### Opening rule
Open sections and chapters with a live human fact: a spoken line, a physical action, a room, a gesture, a documented event in motion. Do not open with thesis, framing, abstraction, or explanation.

### Ending rule
End sections and chapters on an image, spoken line, or irreversible turn. Do not end with explanatory wrap-up.

---

## 8. Structural Architecture

See `template.md` for section design template.

### The Pizza Slice Strategy

The opening of a piece or section acts as a flashlight shining down into the story. Follow the pizza slice strategy: start with the small angle at the tip -- a single, surprising, human detail -- and let the scope of the story and the heavier elements get wider and heavier the deeper the reader goes.

The tip of the slice is a haircut, a joke about Patsy Cline, a man asking what his haircut costs. The wide end is a DEA number, a proxy prescribing loop, 1,400 tablets in twenty-six days. If you start at the wide end, the reader drowns in scope before they care about a human being. If you start at the tip, the reader is already invested by the time the institutional machinery appears.

This applies at every level:
- **Article opening:** Start with a person, not a system
- **Section opening:** Start with a scene, not a mechanism
- **Paragraph opening:** Start with an action, not an interpretation

### Transitions
Don't use chronological transitions ("Then, on July 13..."). Use thematic transitions that pull the reader forward.

### The soft/hard framing
Use sparingly. Best reserved for conclusions, reckonings, or major interpretive pivots. Do not use it as a repetitive section device.

---

## 9. Chapter Containment

Each chapter must do only its own job. Do not import later revelations into earlier chapters unless absolutely necessary for comprehension. Preserve escalation. Treat evidence like ammunition -- spend it where it will have maximum impact.

Brief forward references are acceptable as bridges. Full deployment of later evidence is not.

---

## 10. What to Do When Revising a Draft

When asked to elevate an existing draft:

1. Read the draft end to end before changing anything.
2. Identify every numbered list, bulleted timeline, or evidence-catalog section. Those are your rewrite targets.
3. Identify every place the draft repeats information the reader already has. Cut it.
4. Identify every section that opens with mechanism instead of a human moment. Add the anchor.
5. Identify every unhedged assertion that should be hedged. Add the qualifier, then make the following fact hit harder.
6. Identify every place where you told the reader what to feel. Cut the editorial conclusion. Replace it with the raw fact.
7. Apply the 10% Solution (see below).
8. Run the audit checklist in `references/audit-checklist.md`.

### The 10% Solution

Every draft is collapsible. When revising, aim to cut 10% of the word count. This is not optional. Stephen King's formula: 2nd draft = 1st draft minus 10%. Pulitzer winner Tom Hallman Jr. cuts 10 to 15 percent of every draft before his editor sees it.

**The hit list (search in this order):**

1. **Passive voice:** Search for "is," "was," "were," "are," "been" paired with "-ing" verbs. "The mayor is planning" becomes "The mayor plans." Every passive construction saved is a word gained and an actor revealed.

2. **Adverbs (the "-ly" search):** Search for words ending in "-ly." "Knocked lightly" becomes "tapped." "Spoke quietly" becomes "whispered." If the verb needs an adverb to do its job, the verb is wrong.

3. **Bloated quotes:** Paraphrase the bulk. Reserve quotation marks for 6-to-20-word phrases that reveal character or deliver a damning admission. (See Rule 5a.)

4. **Showing off:** If a sentence exists because it sounds pretty rather than because it advances the narrative, cut it. As Stephen Koch says: cut phoniness. If you admire the sentence more than the story needs it, the sentence is serving the writer, not the reader.

5. **The boring parts:** Follow Elmore Leonard's rule: cut the parts readers skip. If your own eyes glaze over during a dense paragraph of description, slice it and replace it with action or dialogue.

This aligns with Hemingway's iceberg theory: the power comes from what is left out. Over-report. Gather a beer keg's worth of material. Then distill it into a perfume bottle.

### Factual preservation rule

When revising user drafts:
- Preserve all factual claims unless explicitly asked to verify or correct them.
- Improve only diction, pacing, structure, repetition, sequencing, and narrative force.
- Never silently alter facts for style.

If a fact looks wrong, flag it. Do not quietly change a date, a name, a weight, or a dollar amount to make a sentence read better.

---

## 11. The Benchmark

The file that represents the standard this skill exists to achieve:

`C:\Users\Big Levi\Downloads\bartell_scorched_earth_rewritten.docx`

**The benchmark is a structural reference, not a style template.** Do not imitate its phrasing. Use it to assess pacing, escalation, and scene ordering only.

Specific passages to study for structure:
- The opening: how it establishes scope without being a thesis statement
- "The Last Good Days": how human moments precede destruction
- "The Pipeline": evidence synthesized as narrative, not timeline
- "The Lies": contradictions accumulating without numbering
- "The Reckoning": the soft/hard framing, the thematic opening
- The closing line: "They drugged him until he could not ask anymore."

---

## THE CORE PRINCIPLE: Evidence as Discovery

The reader should feel like they are discovering the facts, not being briefed on them. Every section should feel like opening a door into a room the reader didn't know existed. If your prose reads like a lawyer's closing argument, you failed. If it reads like a journalist walking the reader through a house of horrors one room at a time, you succeeded.

---

## INPUT

$ARGUMENTS -- Article to write or draft to revise. If revising, specify the file path and which sections need the most work.
