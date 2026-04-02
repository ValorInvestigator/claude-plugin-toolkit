---
name: suno-songwriter
description: >
  Write complete, production-ready songs for Suno AI -- generates both the Style Prompt and
  fully structured Lyrics with proper meta tags, ready to paste into Suno's Custom Mode.
  Use this skill whenever the user mentions Suno, wants to write a song, create music,
  generate lyrics for AI music, or asks about song writing for any AI music platform.
  Also trigger when the user says "write me a song about...", "make a song", "I want a
  track about...", or references any music creation task.
---

# Suno AI Songwriter

Generate complete, paste-ready song packages for Suno AI's Custom Mode. Every output includes a Style Prompt, fully tagged Lyrics, and an Extension Plan for songs targeting 3-4+ minutes.

## Why This Skill Exists

Suno AI is powerful but unforgiving. Feed it a wall of text and it garbles vocals, rushes tempo, or dies at 90 seconds. Feed it properly structured input -- tight lyrics, exact BPM, clear meta tags, pacing built into the architecture -- and it produces album-quality tracks up to 4 minutes on a single pass. This skill encodes every rule, limit, and technique so the output works on first generation.

## The Interview (Gather Before Writing)

Before writing anything, collect these from the user. If they give you a topic and nothing else, make smart defaults and confirm:

1. **Topic / Story**: What is the song about? A person, an event, an emotion, an argument?
2. **Mood / Emotion**: Angry, mournful, defiant, tender, triumphant, haunted, hopeful?
3. **Genre Preference**: Or describe a vibe. "Sounds like Johnny Cash meets Nine Inch Nails" is valid.
4. **Vocal Style**: Male/female, rough/smooth, whispered/belted, any specific character?
5. **Duration Target**: Default to ~4 minutes (full song). Could be 2 min (short), 3 min (standard), 4 min (full).
6. **Special Requests**: Specific instruments, a phrase that must appear, a dedication, spoken word sections?

## Suno's Architecture: The Dual Brain

Suno Custom Mode has two input fields. They serve completely different purposes:

**Style of Music Box (The Global Brain)**
- Sets the sonic world: genre, mood, instruments, tempo, vocal character
- Limit: 1,000 characters (but 200-400 chars with comma-separated tags works best)
- Think of this as the producer's brief -- it tells the AI what KIND of song to make

**Lyrics Box (The Local Brain)**
- Controls the timeline: what happens when, structural shifts, performance cues
- Limit: 3,000-5,000 characters
- Think of this as the director's script -- it tells the AI what to DO moment by moment

Never mix these roles. Style stays about sound. Lyrics stay about structure and words.

## Writing the Style Prompt

### The 7-Ingredient Formula

Every Style Prompt should contain these elements, comma-separated:

```
[GENRE], [TEMPO as BPM], [KEY optional], [MOOD], [INSTRUMENTS], [VOCAL STYLE], [ERA/REFERENCE optional]
```

**Rules:**
- Always specify exact BPM (e.g., "92 BPM"). Never write "fast" or "slow" -- the AI needs a number to lock its rhythm grid.
- Use 4-7 descriptors. Fewer than 4 = generic output. More than 7 = confused output.
- Describe vocals with stacked specifics: "Male singer, early 30s, weathered baritone, emotionally raw, lazy drawl" beats "male voice."
- Use the Exclude field (Advanced Options) to ban unwanted elements: "no synth pads, no auto-tune, no female backing vocals."

### Style Prompt Examples

**Country/Americana (mournful):**
```
Outlaw country, 85 BPM, D minor, mournful, acoustic guitar, pedal steel, upright bass, male baritone weathered vocals, emotionally raw, 1970s Nashville outlaw
```

**Post-Punk (driving):**
```
Post-punk indie, 110 BPM, E minor, clean electric guitar, melodic driving bass, tight drums, male tenor-baritone, dry rhythmic vocals, introspective, melancholic
```

**Epic Cinematic (dark):**
```
Epic post-hardcore requiem, dark R&B, hybrid cinematic ambient rock, 8-string riffs, mournful clean guitars, pulsing sub-bass, male lead falsetto to anguished screams, tragic, intense
```

**Folk/Singer-Songwriter (intimate):**
```
Indie folk, singer-songwriter, 78 BPM, G major, warm acoustic guitar, soft fingerpicking, cello, female alto, breathy intimate vocals, nostalgic, bittersweet
```

## Writing the Lyrics

### The Cardinal Rules

1. **80-120 words per generation block.** This is the golden limit. Cramming 150+ words causes the AI to panic -- it speeds up tempo, garbles vocals, or skips lines entirely.

2. **6-12 syllables per line.** Short, punchy lines are easier for the AI to articulate. Long sentences get swallowed.

3. **One clear job per section:**
   - [Verse] = Storytelling, exposition. Lower instrumental density so narrative is heard.
   - [Pre-Chorus] = Musical ramp-up. Build tension and anticipation.
   - [Chorus] = Emotional payoff, peak energy. Keep lyrics SHORT and repeatable.
   - [Bridge] = Contrast. Strip drums, change harmony, introduce new vocal texture.
   - [Outro] = Resolution or fade. Wind down the energy.

4. **End definitively.** Always close with [End] or [Fade Out] to prevent the AI from hallucinating trailing audio.

### Meta Tags Reference

Meta tags are bracketed instructions placed inside the Lyrics box. Keep them short (1-5 words). Place them at section transitions.

**Structural Tags:**
```
[Intro]  [Verse]  [Verse 1]  [Verse 2]  [Pre-Chorus]  [Chorus]
[Bridge]  [Outro]  [End]  [Fade Out]
```

**Energy and Dynamics:**
```
[Build]  [Drop]  [Breakdown]  [Climax]
```

**Instrumental Tags:**
```
[Instrumental]  [Instrumental Break]  [Guitar Solo]  [Piano Solo]
[Percussion Break]  [Bass Drop]  [Extended Guitar Solo: 40 seconds]
[Extended Intro]
```

**Voice Tags:**
```
[Male Vocal]  [Female Vocal]  [Choir]  [Duet]  [Boy]  [Woman]
```

**Bracket Theory (Nested Instructions):**
Embed dynamic instructions directly into structural tags:
```
[Chorus: Explosive, Anthemic, High Pitch]
[Bridge: Reflective, calm before the storm]
[Verse: Bass and drums locked tight, vocal up front, minimal guitar]
[Intro: 15 sec, bass + drums only, establish pocket]
```

**Performance Cues (Parenthetical):**
Place inside or after lyrics to direct vocal delivery:
```
(whispered)  (spoken)  (belted)  (airy)  (growled)  (crooning)
(oh yeah)  (come on)  (softly)  (screaming)  (spoken word)
```

### Vocal Style Tags for Style Prompt

**Delivery:** Whisper, Spoken Word, Rap, Harmonies, Falsetto, Belting, Growl, Crooning
**Emotional:** Vulnerable, Powerful, Soft, Aggressive, Melancholic, Defiant
**Effects:** Reverb, AutoTune, Distorted Vocals, No AutoTune

**Persona Stacking** (the best technique for consistent vocals):
Instead of "male voice," write: "Male singer, early 30s, weathered baritone, emotionally raw, lazy drawl"

### Genre Tags Quick Reference

| Category | Tags |
|----------|------|
| Electronic | Synthwave, Tech House, Trance, Ambient, Chillwave, Drum and Bass |
| Hip-Hop/R&B | Boom Bap, Lo-fi Hip Hop, Neo-Soul, Trap, Cloud Rap |
| Rock | Post-Punk, Shoegaze, Emo, Alt Metal, Post-Hardcore, Grunge |
| Pop | Dream Pop, Bedroom Pop, Synth Pop, City Pop, Indie Pop |
| Country/Folk | Indie Folk, Americana, Outlaw Country, Singer-Songwriter, Bluegrass |
| Cinematic | Epic, Orchestral Strings, Cinematic Percussion, Minimalist, Dark Ambient |
| Blues/Soul | Delta Blues, Chicago Blues, Gospel, Southern Soul, Motown |
| Latin/World | Bossa Nova, Reggaeton, Afrobeat, Cumbia, Flamenco |

## Building a 4-Minute Song

Suno v4/v4.5 can generate up to 4 minutes in a single pass (paid tiers up to 8 minutes), but the AI naturally tries to wrap up as soon as it runs out of lyrics. Two methods to hit 4 minutes:

### Method 1: Single-Pass (Structural Padding)

Force the AI to pause singing and stretch runtime with extended instrumental tags:

```
[Extended Intro: 20 seconds, atmospheric build]

[Verse 1]
(lyrics here, 4-6 lines)

[Pre-Chorus: Energy rise]
(2-3 lines)

[Chorus: Full band, soaring]
(4 lines, repeatable hook)

[Instrumental Break: 15 seconds]

[Verse 2]
(lyrics here, 4-6 lines)

[Pre-Chorus: Building higher]
(2-3 lines)

[Chorus: Full intensity]
(repeat hook)

[Bridge: Strip to minimal, contrast]
(3-4 lines, different energy)

[Extended Guitar Solo: 30 seconds]

[Final Chorus: Maximum intensity, choir joins]
(hook with variation)

[Outro: Gradual fade, 15 seconds]
[Fade Out]
```

This structure gives the AI enough runway to fill 3.5-4 minutes without cramming lyrics.

### Method 2: The Two-Minute Rule (Iterative Extension)

Professional creators rarely generate a full song in one click:

1. **Generate the Seed** (90-120 seconds): Write only Intro + Verse 1 + Chorus. Get a perfect-sounding first half.
2. **Extend in Blocks** (30-60 seconds each): Use the Extend button. For each extension:
   - Re-paste your EXACT original Style Prompt (the AI forgets during extension)
   - Delete all previous lyrics from the box
   - Start with a hard structural tag: [Verse 2] or [Instrumental Break]
   - Set the continuation point where the beat is still playing (not dead silence)
3. **Repeat** until you hit your target duration.

### Extension Plan Template

When generating a 4-minute song, always include an Extension Plan:

```
EXTENSION PLAN (if single-pass doesn't reach 4:00)

Seed Generation (~2:00):
  [Intro] + [Verse 1] + [Pre-Chorus] + [Chorus] + [Instrumental Break]

Extension 1 (~1:00):
  Start tag: [Verse 2]
  Content: Verse 2 + Pre-Chorus 2 + Chorus 2
  Re-paste style prompt: YES

Extension 2 (~1:00):
  Start tag: [Bridge]
  Content: Bridge + Solo + Final Chorus + Outro
  Re-paste style prompt: YES
```

## Advanced Settings Recommendations

Include these with every song package:

- **Weirdness Slider**: 35-45% for commercial/accessible sound. 70%+ for experimental/chaotic.
- **Style Influence**: 80-90% for faithful genre adherence. Lower for more AI creative liberty.
- **Personas**: If the user loves a generated voice, tell them to save it with "Make a Persona."
- **Replace Section**: If 95% of the track is perfect but one word is garbled, highlight and regenerate just that block (as small as 3 seconds).
- **Remaster**: If the composition is right but audio quality is slightly off, use Remaster to improve mixing without changing the song.

## Output Format

Every song package must include these clearly labeled sections:

```
## SONG TITLE: [Title]

### STYLE PROMPT (paste into "Style of Music" box)
[the comma-separated style string, under 1,000 chars]

### EXCLUDE (paste into Exclude field in Advanced Options)
[elements to ban, if any]

### LYRICS (paste into "Lyrics" box)
[fully tagged lyrics with all meta tags, under 3,000 chars]

### SETTINGS
- Weirdness: [value]%
- Style Influence: [value]%
- Instrumental: [Yes/No]

### EXTENSION PLAN (if targeting 4+ minutes)
[seed + extension blocks with instructions]

### GENERATION NOTES
[any tips specific to this song -- expected number of takes, tricky sections, etc.]
```

## Writing Lyrics for Storytelling and Narrative

When the song tells a story (which is often the case for Levi's investigative work), follow these additional principles:

1. **Verse = Scene Setting.** Each verse should paint a specific image or advance the narrative. Use concrete details, not abstractions. "Dried blood on the courthouse steps" hits harder than "justice was denied."

2. **Chorus = The Thesis.** The chorus is the emotional argument of the song. It should be the one line the listener walks away humming. Keep it to 2-4 lines max.

3. **Bridge = The Turn.** Use the bridge for revelation, twist, or the moment everything changes. Strip the instrumentation so the words land harder.

4. **Avoid Cliches.** AI music is drowning in "stars above" and "broken wings." Use language that is specific to the story. Real names, real places, real details (if appropriate) make songs land.

5. **Repetition is Power.** A single devastating line repeated three times in the chorus is more powerful than three clever lines. The chorus exists to be remembered.

6. **End with Weight.** The last line of the song should be the one that stays. Write it first, then build backward.

## Common Mistakes to Avoid

- **Too many lyrics**: 150+ words per block = garbled mess. Trim ruthlessly.
- **Vague style prompts**: "Rock song" gives you generic rock. "Post-punk, 118 BPM, angular guitars, baritone, Joy Division atmosphere" gives you what you want.
- **No BPM**: The AI guesses wrong. Always specify.
- **No ending tag**: Without [End] or [Fade Out], the AI hallucinates trailing noise.
- **Extending from silence**: Always set continuation point where the beat is still playing.
- **Forgetting to re-paste style**: The AI forgets your sound during extension. Copy-paste every time.
- **Long lines**: More than 12 syllables per line = AI rushes or swallows words.
- **Mixing style and lyrics concerns**: Style box = sound. Lyrics box = structure and words. Don't cross them.

## Iteration Expectation

Tell the user: generating a great song usually takes 6+ renditions. The first generation is a draft, not a final. The skill produces the best possible starting point, but the user should expect to generate multiple takes and use Replace Section / Remaster to polish.
