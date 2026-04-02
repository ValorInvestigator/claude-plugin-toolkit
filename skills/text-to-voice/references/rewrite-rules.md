# TTS Rewrite Rules -- Converting Written Articles to Spoken Audio

The written article and the spoken version are different things. This is a genuine rewrite, not a find-and-replace.

## Gold Standard
Read this FIRST to calibrate your voice: `C:\Users\Big Levi\Desktop\DHS Stories\the Canary FINAL.txt`

## Rules (all derived from the gold standard)

**Use contractions.** "did not" becomes "didn't", "is not" becomes "isn't", "would not" becomes "wouldn't." Always. This is the single biggest difference between the written and spoken versions.

**Spell out all numbers.** "84" becomes "eighty-four." "$500" becomes "five hundred dollars." "6.7" becomes "six point seven." Dates get ordinals: "January 6" becomes "January 6th."

**Strip all markdown.** No # headers, no **bold**, no *italic*, no links, no tables.

**Strip the title block.** Remove the title, byline, and date. The audio starts with the first spoken line.

**Strip section headers.** Remove Roman numeral headers entirely. Replace each one with `---` on its own line (this becomes a silence gap in the audio). Do not convert headers to spoken form unless Levi specifically asks for it.

**Strip the footer.** Remove the "PLEASE SHARE" whistleblower invitation, the "WHAT COMES NEXT" section, the closing byline, and any navigation lines like "Next: Part 1."

**Keep the spoken flow natural.** Some short declarative fragments work great spoken ("Coral remembered everything."). Others sound robotic when read aloud by TTS. If three consecutive one-line sentences would sound choppy, join them with commas or restructure.

**Preserve the voice.** This is still Levi's voice. Keep the anger, the directness, the rhetorical questions, the "Think about that" moments. The rewrite changes the grammar for the ear, not the personality.

**Use `---` for section breaks.** Every major section transition gets `---` on its own line. This becomes a silence gap in the stitched audio.

Save the TTS-ready file alongside the original with `_TTS.txt` suffix.
