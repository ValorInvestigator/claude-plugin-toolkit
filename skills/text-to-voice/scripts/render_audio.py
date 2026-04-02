"""
Valor TTS Renderer -- Chirp 3 HD Algieba
Renders a TTS-ready text file to MP3 using Google Cloud TTS.

Each paragraph gets its own API call. --- lines become 2500ms silence gaps.
Chirp 3 HD silently truncates text that is too long in a single call,
so one paragraph per call is safest.

Usage:
    python render_audio.py <input_tts_file> <output_mp3> [chunks_dir]
"""

import os
import sys
import json
import sqlite3
import urllib.request
import urllib.parse
import base64
from pydub import AudioSegment

SECTION_SILENCE_MS = 2500
VOICE_NAME = "en-US-Chirp3-HD-Algieba"
SAMPLE_RATE = 44100
SPEAKING_RATE = 1.0
VOLUME_GAIN = 0.0
PROJECT = "valorinvestigates"


def get_access_token():
    """Get OAuth2 access token from gcloud credentials.db refresh token."""
    conn = sqlite3.connect(
        r'C:\Users\Big Levi\AppData\Roaming\gcloud\credentials.db'
    )
    row = conn.execute(
        'SELECT value FROM credentials WHERE account_id = ?',
        ('levi@valorinvestigates.com',)
    ).fetchone()
    conn.close()
    creds = json.loads(row[0])

    refresh_data = urllib.parse.urlencode({
        'client_id': creds['client_id'],
        'client_secret': creds['client_secret'],
        'refresh_token': creds['refresh_token'],
        'grant_type': 'refresh_token',
    }).encode()
    req = urllib.request.Request(
        'https://oauth2.googleapis.com/token',
        data=refresh_data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    return json.loads(urllib.request.urlopen(req).read())['access_token']


def render_tts(input_file, output_mp3, chunks_dir=None):
    """Render a TTS text file to a stitched MP3."""
    if chunks_dir is None:
        chunks_dir = os.path.splitext(output_mp3)[0] + "_chunks"
    os.makedirs(chunks_dir, exist_ok=True)

    token = get_access_token()

    with open(input_file, "r", encoding="utf-8") as f:
        raw_text = f.read()

    # Split on --- for major sections, then paragraphs within sections
    major_sections = [s.strip() for s in raw_text.split('---') if s.strip()]

    all_chunks = []  # (section_index, text)
    for si, section in enumerate(major_sections):
        paragraphs = [p.strip() for p in section.split('\n\n') if p.strip()]
        for text in paragraphs:
            all_chunks.append((si, text))

    # Render each chunk
    chunk_files = []  # (section_index, filepath)
    for i, (si, text) in enumerate(all_chunks):
        print(f"[{i+1}/{len(all_chunks)}] {len(text)} chars")

        body = json.dumps({
            "input": {"text": text},
            "voice": {"languageCode": "en-US", "name": VOICE_NAME},
            "audioConfig": {
                "audioEncoding": "MP3",
                "sampleRateHertz": SAMPLE_RATE,
                "speakingRate": SPEAKING_RATE,
                "volumeGainDb": VOLUME_GAIN
            }
        }).encode('utf-8')

        url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize"
        req = urllib.request.Request(url, data=body, headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'x-goog-user-project': PROJECT
        })

        resp = urllib.request.urlopen(req)
        result = json.loads(resp.read())
        audio_bytes = base64.b64decode(result['audioContent'])
        filepath = os.path.join(chunks_dir, f"p{i:03d}.mp3")
        with open(filepath, 'wb') as f:
            f.write(audio_bytes)
        chunk_files.append((si, filepath))

    # Stitch with silence between major sections
    section_silence = AudioSegment.silent(duration=SECTION_SILENCE_MS)
    combined = AudioSegment.empty()
    prev_section = -1
    for si, filepath in chunk_files:
        seg = AudioSegment.from_mp3(filepath)
        if si != prev_section and prev_section >= 0:
            combined += section_silence
        combined += seg
        prev_section = si

    combined.export(output_mp3, format="mp3", bitrate="192k")
    total = len(combined) / 1000
    print(f"\nDone: {output_mp3}")
    print(f"Duration: {total:.1f}s ({total/60:.1f} min)")
    print(f"Size: {os.path.getsize(output_mp3)/1024/1024:.2f} MB")
    return output_mp3


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python render_audio.py <input_tts.txt> <output.mp3> [chunks_dir]")
        sys.exit(1)
    input_file = sys.argv[1]
    output_mp3 = sys.argv[2]
    chunks_dir = sys.argv[3] if len(sys.argv) > 3 else None
    render_tts(input_file, output_mp3, chunks_dir)
