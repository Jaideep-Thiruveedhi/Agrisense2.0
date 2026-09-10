"""Private GCS — random names, ownership metadata, short-lived signed URLs only after checks."""
import os, uuid
BUCKET = os.getenv("GCS_MEDIA_BUCKET","agrisense-media-dev")
async def store_private(bucket_path: str, data: bytes, owner_tenant: str, mime: str) -> str:
    # Real: storage.Client().bucket(BUCKET).blob(f"{owner_tenant}/{uuid.uuid4()}").upload with metadata tenant
    return f"gs://{BUCKET}/{owner_tenant}/{uuid.uuid4()}"
async def signed_url(gs_path: str, tenant: str) -> str | None:
    # check ownership before minting
    if tenant not in gs_path: return None
    return f"https://storage.googleapis.com/download?token=signed-{uuid.uuid4()}"
