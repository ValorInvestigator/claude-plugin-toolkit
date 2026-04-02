# Ingest Files to Google Cloud (Bingaman Pipeline)

## What This Does
Uploads PDFs to GCS raw bucket, submits a Document AI batch job, waits for completion, then loads extracted text into BigQuery `valor_investigations.documents`.

## Key Config
- GCS bucket: `gs://valor-investigation-files/raw/`
- Document AI project number: `623330267361`
- Document AI processor: `84a1770e2386e57f`
- Document AI location: `us`
- BigQuery project: `valorinvestigates`
- BigQuery dataset: `valor_investigations`
- BigQuery table: `documents`
- gcloud path: `C:\Users\Big Levi\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd`

## Step 1: Upload to GCS
Use gcloud storage cp to upload the PDF(s) to the raw bucket. Name them with folder prefix using underscores (e.g., `DHS_filename.pdf`).

```
gcloud.cmd storage cp "D:\path\to\file.pdf" "gs://valor-investigation-files/raw/DHS_filename.pdf"
```

## Step 2: Submit Document AI Batch Job
Call the Document AI API via Python urllib (since gcloud SDK Python libraries may not be installed):

```python
import urllib.request, json, subprocess

def get_token():
    return subprocess.run(
        [r'C:\Users\Big Levi\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd',
         'auth', 'print-access-token'],
        capture_output=True, text=True
    ).stdout.strip()

token = get_token()
project = "623330267361"
location = "us"
processor = "84a1770e2386e57f"
input_gcs = "gs://valor-investigation-files/raw/"
output_gcs = "gs://valor-investigation-files/converted/batch_new/"

body = json.dumps({
    "inputDocuments": {"gcsPrefix": {"gcsUriPrefix": input_gcs}},
    "documentOutputConfig": {"gcsOutputConfig": {"gcsUri": output_gcs}}
}).encode()

req = urllib.request.Request(
    f"https://us-documentai.googleapis.com/v1/projects/{project}/locations/{location}/processors/{processor}:batchProcess",
    data=body,
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as resp:
    result = json.loads(resp.read())
    operation_name = result["name"]
    print("Operation:", operation_name)
```

## Step 3: Poll Operation Status
Poll every 30s until done=true:

```python
op_id = operation_name.split("/")[-1]
import time
while True:
    token = get_token()
    req = urllib.request.Request(
        f"https://us-documentai.googleapis.com/v1/projects/{project}/locations/{location}/operations/{op_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    with urllib.request.urlopen(req) as resp:
        status = json.loads(resp.read())
    if status.get("done"):
        print("Done!")
        break
    print("Still processing...")
    time.sleep(30)
```

## Step 4: List output JSONs and extract text
List the output bucket folder, download each JSON, extract the `text` field.

## Step 5: Insert to BigQuery
Use the REST API to insert rows into `valor_investigations.documents`:

```python
token = get_token()
rows = [{"insertId": "unique_id", "json": {
    "doc_id": "hash_of_filename",
    "filename": "DHS_filename.pdf",
    "filepath": "D:\path\to\file.pdf",
    "category": "DHS",
    "full_text": extracted_text,
    "char_count": len(extracted_text),
    "extraction_date": "2026-02-26T00:00:00Z"
}}]
body = json.dumps({"rows": rows}).encode()
req = urllib.request.Request(
    "https://bigquery.googleapis.com/bigquery/v2/projects/valorinvestigates/datasets/valor_investigations/tables/documents/insertAll",
    data=body,
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as resp:
    print(json.loads(resp.read()))
```

## Notes
- Document AI can take 10-30 minutes for large PDFs
- The `raw/` bucket is also used for HF Jobs processing (Levi uses this pipeline regularly)
- Check `converted/batch_1` through `batch_5` to understand output format (each batch has a job ID folder, then numbered subfolders with JSON files)
- The JSON output from Document AI has a `text` field with the full extracted text
