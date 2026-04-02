---
name: chirp3-tts
description: >
  Convert investigative articles to audio using Google Cloud Text-to-Speech Chirp 3 HD.
  Use this skill when Levi wants to convert a story, article, or text file to audio.
  Triggers: "convert to audio", "make audio", "tts", "text to speech", "synthesize",
  "run through tts", "make an mp3", "produce audio", "record this".
---

# Chirp 3 HD Text-to-Speech Skill -- Valor Investigations

## VOICE SETTINGS (Levi's approved settings)

- **Voice:** `en-US-Chirp3-HD-Algieba` (male, deep, authoritative -- Levi's choice)
- **Speaking rate:** 1.0
- **Volume gain:** 0.0 dB

Do NOT change these settings unless Levi explicitly asks.

---

## TWO SYNTHESIS MODES

### Long Audio Synthesis (DEFAULT -- use this)
- Sends entire article in ONE API call -- no chunking, no voice resets
- Uses `synthesizeLongAudio` endpoint (v1beta1)
- Outputs LINEAR16 to GCS bucket, downloads as WAV
- Plain text only (no markup pause tags)
- Up to 1 million bytes per request (~150K-200K words)
- GCS bucket: `valor-investigation-files` / prefix: `tts-output/`
- Project number: `989102413038`

### Chunked Markup (fallback -- use with `--chunked`)
- Splits text on paragraph breaks, one API call per chunk
- Uses v1beta1 `markup` field -- supports `[pause]`, `[pause short]`, `[pause long]` tags
- Outputs MP3 directly (no GCS needed)
- Auto-merges small chunks (under 200 bytes) to prevent voice resets
- Max chunk: 4,800 bytes
- Use when you need fine-grained pause control within sentences

---

## AUTH

Same service account key as BigQuery. No login required.

```python
import google.oauth2.service_account as sa
import google.auth.transport.requests as tr

KEY = r'C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json'
creds = sa.Credentials.from_service_account_file(
    KEY,
    scopes=['https://www.googleapis.com/auth/cloud-platform']
)
creds.refresh(tr.Request())
token = creds.token
```

Note: scope is `cloud-platform` (not `bigquery`) -- covers all Google Cloud APIs.

---

## API ENDPOINTS

### Long Audio (default)
```
POST https://texttospeech.googleapis.com/v1beta1/projects/989102413038/locations/global:synthesizeLongAudio
```

Request body:
```json
{
  "parent": "projects/989102413038/locations/global",
  "input": { "text": "..." },
  "voice": { "languageCode": "en-US", "name": "en-US-Chirp3-HD-Algieba" },
  "audioConfig": { "audioEncoding": "LINEAR16", "speakingRate": 1.0 },
  "outputGcsUri": "gs://valor-investigation-files/tts-output/filename.mp3"
}
```

Response: Long-running operation. Poll until `done: true`, then download from GCS.

### Chunked Markup (--chunked)
```
POST https://texttospeech.googleapis.com/v1beta1/text:synthesize
```

Request body (note: `markup` not `text`):
```json
{
  "input": { "markup": "Text with [pause] tags here." },
  "voice": { "languageCode": "en-US", "name": "en-US-Chirp3-HD-Algieba" },
  "audioConfig": {
    "audioEncoding": "MP3",
    "sampleRateHertz": 44100,
    "speakingRate": 1.0,
    "volumeGainDb": 0.0
  }
}
```

CRITICAL: Pause tags MUST go in the `markup` field. If passed to `text` field, the model reads "[pause long]" out loud as literal words.

---

## PRONUNCIATION FIXES

Chirp 3 HD mispronounces some words. Fix them with phonetic spellings in the text:

| Written Form | TTS Spelling | Sounds Like |
|-------------|-------------|-------------|
| La Grande | La Grand | "luh grand" (drop the e) |
| Bakke | Bockee | "bok-ee" |

Add new entries here as we find them. The `customPronunciations` API field exists but is NOT available on the REST endpoint yet.

---

## MARKUP PAUSE TAGS (chunked mode only)

These tags go in the `markup` field and produce dynamic, AI-driven pauses:

- `[pause short]` -- brief hesitation, like a comma or quick breath
- `[pause]` -- standard conversational break between thoughts
- `[pause long]` -- heavy silence for dramatic effect or major transitions

Rules:
- Only work in v1beta1 `markup` field (NOT `text` field)
- NOT supported in long audio synthesis mode
- The AI ignores tags placed in syntactically unnatural positions
- Don't overuse -- the model handles natural pacing well on its own

---

## TTS TEXT OPTIMIZATION

### Punctuation Controls Pacing
- Commas = brief pause (breath). Join short related sentences with commas for flow.
- Periods = full stop with longer pause. Use for emphasis and dramatic beats.
- Ellipsis (...) = deliberate longer pause. Use sparingly for dramatic effect.
- Hyphens (-) = brief pause or sudden break in thought.
- DO NOT over-join. Dramatic short sentences ("He tried to leave." "She collected.") are powerful as periods.

### Contractions
Use contractions for natural speech: "don't" not "do not", "wasn't" not "was not", "couldn't" not "could not", "he'd" not "he had." Exception: keep the formal form when it's used for deliberate emphasis ("He was NOT a patient. He was a revenue stream.").

### Numbers and Dates
- Dollar amounts: "$47,000" -> "forty-seven thousand dollars"
- Addresses: "605 16th Street" -> "six oh five, sixteenth street"
- Dates: "February 9, 2023" -> "February ninth, twenty twenty-three"
- Years: "2024" -> "twenty twenty-four"
- Times: "4:03 PM" -> "four oh three in the afternoon"
- Store numbers: "Store 1889" -> "store eighteen eighty-nine"
- Percentages: "77%" -> "seventy-seven percent"
- Statute numbers: "ORS 192.553" -> "Oregon Revised Statute one ninety-two point five five three"

### Acronyms
- Add periods for letter-by-letter reading: "DEA" -> "D.E.A.", "FDA" -> "F.D.A.", "DHS" -> "D.H.S."
- OR spell out on first use: "DHS" -> "the Department of Human Services"
- "ASAP" -> "as soon as possible"
- "APRN-NP" -> spell out the title or just use the person's name

### Kill Parentheticals
- Double dashes (--) used as parenthetical inserts -> restructure with commas or separate sentences
- Actual parentheses -> remove and restructure
- Side-thoughts that break flow -> make them their own sentence

### No Visual References
- Remove "as shown below", "the following list", "see above"
- Data tables and appendices -> cut or narrate the key numbers into the text
- Markdown formatting (bold, italic, headers, horizontal rules) -> strip entirely

### Section Transitions for Audio
- Remove markdown headers (## THE SECTION)
- Replace with spoken section name on its own line, surrounded by extra blank lines for pause
- Example: two blank lines, then "The Landlord." on its own line, then two blank lines

### Audio Series Framing
- Add series name, episode name, and byline at the top
- Add brief outro with contact info in spoken form
- Email: "Levi at Valor Investigates dot com"
- Phone: "nine seven one, three oh three, four nine eight two"

### Quotes and Attribution
- Strip quotation marks (TTS ignores them but they add nothing)
- Keep attribution language clear: "She said," "He told the court,"
- The listener needs to know who is speaking from context

### What NOT to Change
- Don't over-join sentences. Dramatic short sentences are powerful as-is.
- Don't add filler words ("um", "well") unless quoting someone who said them.
- Don't change the voice or word choice of the original writing.
- Don't soften the impact for audio. The writing hits harder when spoken.

---

## MAIN SCRIPT

```bash
python "C:\Users\Big Levi\.claude\skills\chirp3-tts\scripts\tts_article.py" "path\to\article.txt" "path\to\output.mp3"
```

Options:
- `--voice NAME` -- override voice (default: en-US-Chirp3-HD-Algieba)
- `--list-voices` -- print all available Chirp3-HD voices
- `--check-auth` -- verify key works
- `--chunked` -- use chunked mode with markup pause tag support
- `--plain-text` -- chunked mode only: use v1 text field (no markup)

Default mode is long audio synthesis (no chunking). Output is WAV (LINEAR16).

---

## OUTPUT

- **Long audio mode:** WAV file (LINEAR16, 24kHz mono). Saved next to input with `.wav` extension.
- **Chunked mode:** MP3 file (44.1kHz). Saved next to input with `.mp3` extension.
- Named articles go to: `D:\Bingaman Master Files Old\Home Base Claude\new story\audio\`

---

## AVAILABLE CHIRP 3 HD VOICES (confirmed 2026-03-02)

Male voices worth testing:
- `en-US-Chirp3-HD-Algieba` -- Levi's approved voice
- `en-US-Chirp3-HD-Charon` -- deeper, more dramatic
- `en-US-Chirp3-HD-Alnilam` -- neutral, clear
- `en-US-Chirp3-HD-Achird` -- warmer

Female voices (for future use):
- `en-US-Chirp3-HD-Aoede`
- `en-US-Chirp3-HD-Autonoe`
- `en-US-Chirp3-HD-Leda`
- `en-US-Chirp3-HD-Kore`

---

## ERROR HANDLING

| Error | Action |
|-------|--------|
| HTTP 401/403 | Key file issue -- check `valorinvestigates-bigquery.json` exists |
| HTTP 400 | Text too long (chunked) or bad request format |
| LRO timeout | Long audio took too long -- check operation in GCP console |
| FileNotFoundError | Key not at expected path |
| Chunk fails | Log which chunk, skip and continue, report at end |

---

## CRITICAL REMINDERS

1. Always use `cloud-platform` scope, not `bigquery` scope
2. Long audio is the default -- use it for articles, stories, full episodes
3. Chunked mode is for short tests or when you need [pause] tags
4. Apply pronunciation fixes (La Grand, Bockee) in the text before synthesis
5. Strip [pause] tags when using long audio mode (script does this automatically)
6. The text input must be plain text -- strip any markdown before synthesizing
