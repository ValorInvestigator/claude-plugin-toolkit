#!/usr/bin/env python3
"""
Chirp 3 HD Text-to-Speech -- Valor Investigations
Converts a plain text article to MP3 using Google Cloud TTS.

Two modes:
  --long (default): synthesizeLongAudio -- entire article in one API call, no chunking,
                    no voice resets. Output goes to GCS then downloads locally.
                    Plain text only (no markup pause tags).
  --chunked:        Chunked synthesis via v1beta1 markup field. Supports [pause] tags
                    but splits text into paragraphs (potential voice resets between chunks).

Usage:
    python tts_article.py "path/to/article.txt" "path/to/output.mp3"
    python tts_article.py "path/to/article.txt"                 # output next to input
    python tts_article.py "path/to/article.txt" --chunked       # use chunked mode
    python tts_article.py --check-auth
    python tts_article.py --list-voices

Exit codes: 0=success, 1=auth error, 2=synthesis error, 3=other error
"""

import sys
import io
import os
import json
import base64
import urllib.request
import urllib.error
import argparse
import shutil
import time

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# --- Configuration ---
SERVICE_ACCOUNT_KEY = r'C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json'
PROJECT_NUMBER = '989102413038'
GCS_BUCKET = 'valor-investigation-files'
GCS_TTS_PREFIX = 'tts-output'

# Endpoints
TTS_ENDPOINT_V1BETA1 = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize'
TTS_ENDPOINT_V1 = 'https://texttospeech.googleapis.com/v1/text:synthesize'
LONG_AUDIO_ENDPOINT = f'https://texttospeech.googleapis.com/v1beta1/projects/{PROJECT_NUMBER}/locations/global:synthesizeLongAudio'
LRO_BASE = 'https://texttospeech.googleapis.com/v1beta1'
VOICES_ENDPOINT = 'https://texttospeech.googleapis.com/v1/voices?languageCode=en-US'

CHUNK_DIR = r'C:\Temp\tts_chunks'
MAX_CHUNK_BYTES = 4800
MIN_CHUNK_BYTES = 200

# Levi's approved voice settings
DEFAULT_VOICE = 'en-US-Chirp3-HD-Algieba'
AUDIO_ENCODING = 'MP3'
SAMPLE_RATE = 44100
SPEAKING_RATE = 1.0
VOLUME_GAIN = 0.0

# Custom pronunciation overrides (IPA) -- for future use when REST API supports it
CUSTOM_PRONUNCIATIONS = [
    {
        'phrase': 'La Grande',
        'phoneticEncoding': 'PHONETIC_ENCODING_IPA',
        'pronunciation': 'l\u0259 \u0261\u0279\u00e6nd'
    },
]


def get_token():
    """Get auth token from service account key."""
    try:
        import google.oauth2.service_account as sa
        import google.auth.transport.requests as tr
        creds = sa.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_KEY,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        creds.refresh(tr.Request())
        if creds.token:
            return creds.token
        print('AUTH ERROR: Token refresh returned empty token.', file=sys.stderr)
        return None
    except FileNotFoundError:
        print(f'AUTH ERROR: Key file not found at {SERVICE_ACCOUNT_KEY}', file=sys.stderr)
        return None
    except Exception as e:
        print(f'AUTH ERROR: {e}', file=sys.stderr)
        return None


# ============================================================
# LONG AUDIO SYNTHESIS (default mode)
# ============================================================

def synthesize_long_audio(text, token, voice, output_path):
    """
    Send entire text to synthesizeLongAudio endpoint.
    Outputs to GCS, polls for completion, downloads locally.
    Returns True on success, False on failure.
    """
    # Generate a unique GCS filename
    ts = int(time.time())
    basename = os.path.splitext(os.path.basename(output_path))[0]
    gcs_filename = f'{GCS_TTS_PREFIX}/{basename}_{ts}.mp3'
    gcs_uri = f'gs://{GCS_BUCKET}/{gcs_filename}'

    text_bytes = len(text.encode('utf-8'))
    print(f'Long Audio Synthesis mode')
    print(f'  Text size: {text_bytes:,} bytes ({len(text.split()):,} words)')
    print(f'  GCS output: {gcs_uri}')
    print(f'  Voice: {voice}')

    request_body = {
        'parent': f'projects/{PROJECT_NUMBER}/locations/global',
        'input': {'text': text},
        'voice': {'languageCode': 'en-US', 'name': voice},
        'audioConfig': {
            'audioEncoding': 'LINEAR16',
            'speakingRate': SPEAKING_RATE,
        },
        'outputGcsUri': gcs_uri
    }

    body = json.dumps(request_body).encode('utf-8')

    req = urllib.request.Request(
        LONG_AUDIO_ENDPOINT,
        data=body,
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    )

    # Submit the long-running operation
    print('Submitting to synthesizeLongAudio...')
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        lro_data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='replace')
        print(f'API ERROR: HTTP {e.code}: {err_body[:500]}', file=sys.stderr)
        return False
    except Exception as e:
        print(f'ERROR submitting: {e}', file=sys.stderr)
        return False

    operation_name = lro_data.get('name', '')
    if not operation_name:
        print(f'ERROR: No operation name in response: {json.dumps(lro_data)[:300]}', file=sys.stderr)
        return False

    print(f'  Operation: {operation_name}')

    # Poll for completion
    poll_url = f'{LRO_BASE}/{operation_name}'
    print('Waiting for synthesis to complete...')
    poll_count = 0
    max_polls = 120  # 10 minutes at 5-second intervals

    while poll_count < max_polls:
        time.sleep(5)
        poll_count += 1

        try:
            poll_req = urllib.request.Request(
                poll_url,
                headers={'Authorization': f'Bearer {token}'}
            )
            poll_resp = urllib.request.urlopen(poll_req, timeout=30)
            poll_data = json.loads(poll_resp.read())
        except Exception as e:
            print(f'  Poll error (attempt {poll_count}): {e}', file=sys.stderr)
            continue

        done = poll_data.get('done', False)
        metadata = poll_data.get('metadata', {})
        progress = metadata.get('progressPercentage', 0)

        elapsed = poll_count * 5
        print(f'  [{elapsed}s] Progress: {progress}%', end='')

        if done:
            error = poll_data.get('error')
            if error:
                print(f'\nSynthesis FAILED: {json.dumps(error)[:300]}', file=sys.stderr)
                return False
            print(' -- DONE!')
            break
        else:
            print('')
    else:
        print(f'\nERROR: Timed out after {max_polls * 5} seconds.', file=sys.stderr)
        return False

    # Download from GCS
    print(f'Downloading from GCS...')
    gcs_download_url = f'https://storage.googleapis.com/storage/v1/b/{GCS_BUCKET}/o/{urllib.request.quote(gcs_filename, safe="")}?alt=media'

    try:
        dl_req = urllib.request.Request(
            gcs_download_url,
            headers={'Authorization': f'Bearer {token}'}
        )
        dl_resp = urllib.request.urlopen(dl_req, timeout=300)
        audio_data = dl_resp.read()
    except Exception as e:
        print(f'ERROR downloading from GCS: {e}', file=sys.stderr)
        print(f'File is still available at: {gcs_uri}')
        return False

    # The long audio endpoint with LINEAR16 produces raw PCM.
    # We need to convert to MP3 or save as WAV.
    # For now, save whatever we got.
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)

    # Check if output_path ends in .mp3 but we got LINEAR16 -- save as .wav instead
    if output_path.lower().endswith('.mp3'):
        wav_path = output_path[:-4] + '.wav'
        print(f'  Note: Long audio outputs LINEAR16/WAV (not MP3).')
        print(f'  Saving as: {wav_path}')
        # Add WAV header to raw PCM data
        audio_data_with_header = add_wav_header(audio_data, sample_rate=24000, channels=1, bits_per_sample=16)
        with open(wav_path, 'wb') as f:
            f.write(audio_data_with_header)
        output_path = wav_path
    else:
        with open(output_path, 'wb') as f:
            f.write(audio_data)

    size_mb = len(audio_data) / (1024 * 1024)
    duration_est = len(audio_data) / (24000 * 2)  # 24kHz, 16-bit mono
    print(f'\nDONE.')
    print(f'Output: {output_path}')
    print(f'Size:   {size_mb:.2f} MB')
    print(f'Duration: ~{duration_est / 60:.1f} minutes')

    # Clean up GCS file
    try:
        del_url = f'https://storage.googleapis.com/storage/v1/b/{GCS_BUCKET}/o/{urllib.request.quote(gcs_filename, safe="")}'
        del_req = urllib.request.Request(
            del_url,
            method='DELETE',
            headers={'Authorization': f'Bearer {token}'}
        )
        urllib.request.urlopen(del_req, timeout=15)
        print('  GCS temp file cleaned up.')
    except Exception:
        print(f'  Note: GCS temp file remains at {gcs_uri}')

    return True


def add_wav_header(pcm_data, sample_rate=24000, channels=1, bits_per_sample=16):
    """Add a WAV header to raw PCM data."""
    import struct
    data_size = len(pcm_data)
    byte_rate = sample_rate * channels * bits_per_sample // 8
    block_align = channels * bits_per_sample // 8

    header = struct.pack('<4sI4s', b'RIFF', 36 + data_size, b'WAVE')
    fmt = struct.pack('<4sIHHIIHH', b'fmt ', 16, 1, channels, sample_rate, byte_rate, block_align, bits_per_sample)
    data_header = struct.pack('<4sI', b'data', data_size)

    return header + fmt + data_header + pcm_data


# ============================================================
# CHUNKED SYNTHESIS (--chunked mode)
# ============================================================

def synthesize_chunk(text, token, voice, chunk_num, use_markup=True):
    """Send one chunk to the TTS API. Returns raw MP3 bytes or None on error."""
    if use_markup:
        endpoint = TTS_ENDPOINT_V1BETA1
        input_field = {'markup': text}
    else:
        endpoint = TTS_ENDPOINT_V1
        input_field = {'text': text}

    request_body = {
        'input': input_field,
        'voice': {'languageCode': 'en-US', 'name': voice},
        'audioConfig': {
            'audioEncoding': AUDIO_ENCODING,
            'sampleRateHertz': SAMPLE_RATE,
            'speakingRate': SPEAKING_RATE,
            'volumeGainDb': VOLUME_GAIN
        }
    }

    body = json.dumps(request_body).encode('utf-8')

    req = urllib.request.Request(
        endpoint,
        data=body,
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    )

    try:
        resp = urllib.request.urlopen(req, timeout=60)
        data = json.loads(resp.read())
        return base64.b64decode(data['audioContent'])
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='replace')
        if e.code in (401, 403):
            print(f'  AUTH ERROR on chunk {chunk_num}: HTTP {e.code} -- token may have expired', file=sys.stderr)
        else:
            print(f'  API ERROR on chunk {chunk_num}: HTTP {e.code}: {err_body[:500]}', file=sys.stderr)
        return None
    except Exception as e:
        print(f'  ERROR on chunk {chunk_num}: {e}', file=sys.stderr)
        return None


def split_into_chunks(text):
    """
    Split text on double newlines. Merge small paragraphs (under MIN_CHUNK_BYTES).
    Split oversized paragraphs at sentence boundaries.
    """
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]

    merged = []
    buffer = ''
    for para in paragraphs:
        if buffer:
            test = buffer + ' ' + para
            if len(test.encode('utf-8')) <= MAX_CHUNK_BYTES:
                buffer = test
            else:
                merged.append(buffer)
                buffer = para
        else:
            buffer = para

        if len(buffer.encode('utf-8')) >= MIN_CHUNK_BYTES:
            merged.append(buffer)
            buffer = ''

    if buffer:
        if merged and len((merged[-1] + ' ' + buffer).encode('utf-8')) <= MAX_CHUNK_BYTES:
            merged[-1] = merged[-1] + ' ' + buffer
        else:
            merged.append(buffer)

    chunks = []
    for para in merged:
        encoded = para.encode('utf-8')
        if len(encoded) <= MAX_CHUNK_BYTES:
            chunks.append(para)
        else:
            sentences = para.replace('. ', '.|').replace('! ', '!|').replace('? ', '?|').split('|')
            current = ''
            for sentence in sentences:
                test = (current + ' ' + sentence).strip()
                if len(test.encode('utf-8')) <= MAX_CHUNK_BYTES:
                    current = test
                else:
                    if current:
                        chunks.append(current)
                    current = sentence
            if current:
                chunks.append(current)

    return chunks


def run_chunked(text, token, voice, output_path, use_markup=True):
    """Run chunked synthesis mode."""
    if use_markup:
        print('Mode: v1beta1 markup (supports [pause] tags)')
    else:
        print('Mode: v1 plain text')

    chunks = split_into_chunks(text)
    total = len(chunks)
    print(f'Split into {total} chunks.')

    for i, chunk in enumerate(chunks, 1):
        size = len(chunk.encode('utf-8'))
        preview = chunk[:60].replace('\n', ' ')
        print(f'  [{i}] {size} bytes: {preview}...')

    os.makedirs(CHUNK_DIR, exist_ok=True)

    chunk_files = []
    failed = []

    for i, chunk in enumerate(chunks, 1):
        chunk_path = os.path.join(CHUNK_DIR, f'chunk_{i:04d}.mp3')
        print(f'  Chunk {i}/{total} ({len(chunk.encode("utf-8"))} bytes)...', end=' ')

        audio = synthesize_chunk(chunk, token, voice, i, use_markup=use_markup)

        if audio:
            with open(chunk_path, 'wb') as f:
                f.write(audio)
            chunk_files.append(chunk_path)
            print(f'OK ({len(audio):,} bytes)')
        else:
            failed.append(i)
            print('FAILED')
            time.sleep(1)

    if failed:
        print(f'\nWARNING: {len(failed)} chunks failed: {failed}')

    if not chunk_files:
        print('ERROR: No chunks succeeded. Nothing to combine.')
        sys.exit(2)

    print(f'\nCombining {len(chunk_files)} chunks into: {output_path}')
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)

    total_bytes = 0
    with open(output_path, 'wb') as out:
        for chunk_path in chunk_files:
            with open(chunk_path, 'rb') as f:
                data = f.read()
                out.write(data)
                total_bytes += len(data)

    shutil.rmtree(CHUNK_DIR, ignore_errors=True)

    size_mb = total_bytes / (1024 * 1024)
    print(f'\nDONE.')
    print(f'Output: {output_path}')
    print(f'Size:   {size_mb:.2f} MB ({total_bytes:,} bytes)')
    print(f'Chunks: {len(chunk_files)}/{total} succeeded')
    if failed:
        print(f'Failed chunks (missing from audio): {failed}')


# ============================================================
# VOICE LIST AND MAIN
# ============================================================

def list_voices(token):
    """List all available Chirp 3 HD voices."""
    req = urllib.request.Request(
        VOICES_ENDPOINT,
        headers={'Authorization': f'Bearer {token}'}
    )
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read())
        chirp3 = [v['name'] for v in data.get('voices', []) if 'Chirp3-HD' in v['name']]
        print(f'Available Chirp3-HD voices ({len(chirp3)}):')
        for v in sorted(chirp3):
            marker = ' <-- DEFAULT' if v == DEFAULT_VOICE else ''
            print(f'  {v}{marker}')
    except Exception as e:
        print(f'ERROR listing voices: {e}', file=sys.stderr)
        sys.exit(3)


def main():
    parser = argparse.ArgumentParser(description='Chirp 3 HD TTS -- Valor Investigations')
    parser.add_argument('input', nargs='?', help='Input text file path')
    parser.add_argument('output', nargs='?', help='Output MP3 file path')
    parser.add_argument('--voice', default=DEFAULT_VOICE, help=f'Voice name (default: {DEFAULT_VOICE})')
    parser.add_argument('--check-auth', action='store_true', help='Test auth only')
    parser.add_argument('--list-voices', action='store_true', help='List all Chirp3-HD voices')
    parser.add_argument('--chunked', action='store_true', help='Use chunked mode with markup support')
    parser.add_argument('--plain-text', action='store_true', help='Chunked mode: use v1 text field (no markup)')
    args = parser.parse_args()

    # Auth
    print('Authenticating...', file=sys.stderr)
    token = get_token()
    if not token:
        print('AUTH FAILED: Check key file at', SERVICE_ACCOUNT_KEY)
        sys.exit(1)
    print('Auth OK.', file=sys.stderr)

    if args.check_auth:
        print('Auth check passed. Token is valid.')
        sys.exit(0)

    if args.list_voices:
        list_voices(token)
        sys.exit(0)

    if not args.input:
        parser.print_help()
        sys.exit(3)

    # Resolve paths
    input_path = os.path.abspath(args.input)
    if not os.path.exists(input_path):
        print(f'ERROR: Input file not found: {input_path}')
        sys.exit(3)

    if args.output:
        output_path = os.path.abspath(args.output)
    else:
        base = os.path.splitext(input_path)[0]
        output_path = base + '.mp3'

    # Read input
    print(f'Reading: {input_path}', file=sys.stderr)
    with open(input_path, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()

    # Strip any [pause] tags if using long audio mode (they'd be read aloud)
    if not args.chunked:
        import re
        cleaned = re.sub(r'\[pause(?:\s+(?:short|long))?\]', '', text)
        if cleaned != text:
            tag_count = len(re.findall(r'\[pause(?:\s+(?:short|long))?\]', text))
            print(f'  Stripped {tag_count} [pause] tags (not supported in long audio mode)')
            text = cleaned
        # Clean up any double spaces left behind
        text = re.sub(r'  +', ' ', text)

    if args.chunked:
        use_markup = not args.plain_text
        run_chunked(text, token, args.voice, output_path, use_markup=use_markup)
    else:
        success = synthesize_long_audio(text, token, args.voice, output_path)
        if not success:
            sys.exit(2)


if __name__ == '__main__':
    main()
