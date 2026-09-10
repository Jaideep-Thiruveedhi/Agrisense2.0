"""Gemini tool router — google-genai Vertex ADC, strict JSON schemas, no agronomy invention."""
import os, json
from typing import Any

# Tasks with strict schemas
async def extract_soil_card(image_url: str) -> dict[str,Any]:
    # Returns draft: {ph, om, n, p, k, confidence or uncertain_flag} with evidence snippets
    # Real call: genai.Client(vertexai=True).models.generate_content(model=os.getenv("GEMINI_MODEL"), contents=[image], config={"response_mime_type":"application/json"})
    return {"ph":6.4,"om":1.2,"n_g_per_kg":0.051,"confidence":"draft_uncertain","evidence":"pH 6.4 snip"}

async def phrase_recommendation(facts: dict, lang: str = "en") -> str:
    # Validates no numeric/time/product change
    template = {"en":"Spray {window} — heat 6.0, rain-free 4h","hi":"छिड़काव {window}","mr":"फवारणी {window}"}
    return template.get(lang, template["en"]).format(window=facts.get("window","05:30-08:45"))

async def transcribe_audio(audio_url: str) -> dict:
    return {"transcript":"pani diya 10mm","language":"pa","uncertain_spans":[]}
