# Text to Voice -- Convert Articles to Audio

Convert written articles to spoken audio (.mp3) using Google Cloud TTS with Chirp 3: HD Algieba voice.

## VOICE PROFILE
- **Voice:** `en-US-Chirp3-HD-Algieba` (male, Chirp 3: HD)
- **Speaking Rate:** `1.0` | **Volume Gain:** `0.0` dB
- **Audio Encoding:** MP3, 44100 Hz, 192k bitrate (final stitch)
- **API Version:** `texttospeech_v1beta1` (Chirp 3 HD requires v1beta1)
- **Google Cloud Project:** `valorinvestigates`

## THE TWO-STEP PROCESS

1. **Rewrite the article for the ear** -- See [references/rewrite-rules.md](references/rewrite-rules.md)
2. **Render the audio** -- See [scripts/render_audio.py](scripts/render_audio.py)

## HOW TO USE

When Levi says "convert to audio", "make the audio", "text to voice", "TTS", or "read this":

1. Identify the source file (finished articles in `D:\Bingaman Master Files Old\Home Base Claude\The Bingaman Case\`)
2. Read the gold standard TTS file to calibrate: `C:\Users\Big Levi\Desktop\DHS Stories\the Canary FINAL.txt`
3. Rewrite for the ear following [references/rewrite-rules.md](references/rewrite-rules.md)
4. Save TTS-ready file with `_TTS.txt` suffix alongside the original
5. Render using auth + API code from [scripts/render_audio.py](scripts/render_audio.py)
6. Report: file path, total duration, file size

## IMPORTANT: Algieba needs nothing but clean text
Do not add pronunciation hacks, phonetic spellings, or period-separated acronyms. Algieba handles names and natural speech fine on its own.

## REQUIRED PACKAGES
- `pydub` (audio stitching)
- `ffmpeg` (pydub dependency, must be on PATH)

## INPUT
$ARGUMENTS -- Path to article file to convert, or instructions on which article to render.
