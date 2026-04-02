---
name: qwen3-tts
description: "Story to Audio — Qwen3-TTS Voice Clone in Levi's Voice"
user_invocable: true
---

# Qwen3-TTS Story to Audio

Converts written stories (.md or .txt) into high-quality narrated audio using Qwen3-TTS voice cloning in Levi's voice. Handles full preprocessing: strips markdown, optimizes text for TTS, intelligently chunks for minimal seams, cross-fades between chunks, and normalizes the final output.

## When to Use This Skill

Trigger when user:
- Says "narrate this", "make audio", "convert to audio", "story to audio", "read this aloud"
- Asks to generate voice audio from a story or article file
- Mentions "qwen3", "qwen tts", "voice clone"
- Wants to create an audiobook or podcast-style narration
- Says "do this one in my voice" about a text file

## What This Skill Does

1. Takes a story file (.md or .txt) as input
2. Preprocesses the text for TTS (strips markdown, expands abbreviations, optimizes punctuation)
3. Splits into smart chunks (targeting ~2,000-4,000 chars each for 1-3 min audio per chunk)
4. Generates audio using Qwen3-TTS with Levi's cloned voice
5. Cross-fades between chunks to eliminate seams
6. Applies EBU R128 normalization (-24 LUFS)
7. Outputs final MP3 at 192kbps

## Execution Procedure

### Step 1: Identify the input file

Ask the user which file to convert if not specified. The story files are typically in:
```
D:\Bingaman Master Files Old\Home Base Claude\new story\
```

### Step 2: Run the generation script

```bash
cd "C:\Users\Big Levi\Desktop\Claude\Chatterbox-TTS-Extended"
python story_to_audio_qwen3.py "PATH_TO_STORY_FILE"
```

**Flags:**
- `--dry-run` : Show chunks and preprocessing without generating
- `--output PATH` : Custom output path (default: same dir as input, .mp3)
- `--start-section "HEADER"` : Start narrating from a specific section header
- `--end-section "HEADER"` : Stop narrating at a specific section header (exclusive)
- `--skip-metadata` : Strip bylines, navigation, disclaimers, author bios (default: ON)
- `--chunk-chars N` : Target chunk size in characters (default: 3000)
- `--crossfade-ms N` : Cross-fade duration between chunks in ms (default: 500)

**Examples:**
```bash
# Convert entire story
python story_to_audio_qwen3.py "D:\...\new story\STORY_1_THE_REQUEST.md"

# Convert only Sections III-V
python story_to_audio_qwen3.py "D:\...\new story\STORY_2.md" --start-section "III" --end-section "VI"

# Dry run to preview chunks
python story_to_audio_qwen3.py "D:\...\new story\STORY_3.md" --dry-run
```

### Step 3: Monitor progress

The script prints chunk-by-chunk progress:
```
[1/12] (3204 chars) Section I-II... -> 142.3s audio in 165.0s (RTF 1.16x)
[2/12] (2891 chars) Section III...  -> 128.7s audio in 149.5s (RTF 1.16x)
```

At ~1.16x real-time factor on the RTX 3080, a 30-minute story takes ~35 minutes to generate.

### Step 4: Report results

Tell the user:
- Output file path and size
- Total duration
- Generation time

## Key Paths

| What | Path |
|------|------|
| **Script** | `C:\Users\Big Levi\Desktop\Claude\Chatterbox-TTS-Extended\story_to_audio_qwen3.py` |
| **Voice Reference** | `C:\Users\Big Levi\OneDrive\Documents\Sound Recordings\levi_voice_best_24k.wav` |
| **Voice Transcript** | "Now this article is just the beginning. I've mentioned I'll be exposing connections between disability rights organ and other legal networks in the next article, because what I've found suggests that even the lawyers who are" |
| **Story Files** | `D:\Bingaman Master Files Old\Home Base Claude\new story\` |
| **Model** | `Qwen/Qwen3-TTS-12Hz-1.7B-Base` (auto-downloads from HuggingFace, ~4.5 GB) |

## Voice Settings

- **Voice**: Levi Bakke (cloned from 12-second reference)
- **Model**: Qwen3-TTS-12Hz-1.7B-Base
- **GPU**: NVIDIA RTX 3080 (10 GB VRAM, uses ~5.2 GB)
- **Generation**: do_sample=True, top_k=50, temperature=0.9, repetition_penalty=1.05
- **Output**: 192kbps MP3, EBU R128 normalized (-24 LUFS, -2 TP, 7 LRA)
- **Chunking**: ~3,000 chars per chunk (1-3 min audio), sentence-boundary aware
- **Cross-fade**: 500ms between chunks to eliminate seams

## Text Preprocessing (automatic)

The script automatically:
1. Strips markdown headers, bold, italic, horizontal rules, block quotes
2. Removes metadata (bylines, navigation bars, disclaimers, author bios, footnotes)
3. Expands common abbreviations for natural speech:
   - "DHS" -> "D.H.S" (spelled out with pauses)
   - "APS" -> "A.P.S"
   - "SOQ" -> "S.O.Q"
   - "ORS" -> "O.R.S"
   - "OAR" -> "O.A.R"
   - "HIPAA" -> "H.I.P.A.A"
   - "COVID" -> "Covid"
   - "ODHS" -> "O.D.H.S"
   - "MAR" -> "M.A.R"
4. Fixes pronunciation of place names:
   - "La Grande" -> "La Grand" (prevents French pronunciation "La Grand-eh")
   - "Lagrand" -> "La Grand"
   - "Bingaman" -> "Bing-uh-min" (prevents "Bing-a-man" mispronunciation)
5. Converts em-dashes to natural pauses
5. Handles quoted speech naturally
6. Preserves paragraph/section pacing with appropriate silences

## Troubleshooting

### "SoX could not be found"
This is a cosmetic warning from librosa. It does not affect generation. Ignore it.

### "flash-attn is not installed"
This is fine. The model falls back to PyTorch SDPA attention. Uses ~6.8 GB VRAM instead of ~5.4 GB. Both fit on RTX 3080.

### CUDA out of memory
Close other GPU applications. The model needs ~5-7 GB VRAM. Check with:
```bash
python -c "import torch; print(f'{torch.cuda.mem_get_info()[0]/1024**3:.1f} GB free')"
```

### cp1252 encoding error
The script uses ASCII-safe print statements. If you still get encoding errors, set:
```bash
set PYTHONIOENCODING=utf-8
```

## Important Notes

- This skill is for Levi's voice ONLY. For other voices, use `batch_canary_qwen3_full.py` directly
- First run downloads the model (~4.5 GB). Subsequent runs load from cache in ~10 seconds
- The voice clone prompt is pre-computed once and reused for all chunks (fast)
- Each chunk generates at ~1.16x real-time on RTX 3080 (e.g., 60s audio takes ~70s to generate)
- Output chunks are saved individually in a subdirectory for easy re-generation of any section
