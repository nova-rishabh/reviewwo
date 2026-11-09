"""Download chosen CC0 sounds from Openverse into ../sounds and write sounds/CREDITS.json.
Only files whose Openverse license is exactly 'cc0' are kept. Files are data only."""
import json, os, subprocess, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'sounds')
UA = {'User-Agent': 'reviewwo-video-builder/1.0'}

PICKS = {
    'click': 'ea9dc47e-7f07-45dd-8aa6-8c9e25609251',
    'click2': 'd3ab488b-dee1-4c40-89ab-67837664b616',
    'pop': '7b1f829e-4a99-41bc-9b65-50e39c074751',
    'pop2': '57fc1a1b-320c-4c70-a52c-fee4442d2272',
    'whoosh': 'b7ae7822-8ec5-4a82-b6f8-d539b51caa61',
    'whoosh2': 'f1dc6045-7965-41de-87f8-4731d2583fd2',
    'blip': '3b463c68-1165-4e27-8878-77ceb6cbc52c',
    'shutter': '3290f0e3-a217-48c9-bafb-06401b961c21',
    'chime': 'adb6e260-e493-43fd-a56e-8ceb4f477fe2',
    'buzz': 'c3af46e7-e083-4dcf-a373-4e645078a5c9',
    'hit': '7f3dc6f7-0aca-436c-828c-11670ee8b47f',
    'boom': '4c99d7d3-4987-46f3-9637-bfd9b4cc66b9',
    'magic': '4beec0d4-ef0f-4969-beef-f329da2b5538',
    'tick': 'b9e2d017-ac1a-4118-8b05-b9bd184858eb',
    'ding': 'c78d2cd0-20ba-4b48-a7eb-f1fa716aca1d',
    'key': '96ab6888-981f-42f9-a228-10f36dcce446',
    'key2': 'ac715c8d-3010-45a2-a939-e110a14da389',
}

os.makedirs(OUT, exist_ok=True)
credits = {}
for name, oid in PICKS.items():
    req = urllib.request.Request(f'https://api.openverse.org/v1/audio/{oid}/', headers=UA)
    meta = json.load(urllib.request.urlopen(req, timeout=30))
    if meta.get('license') != 'cc0':
        print('SKIP (not cc0):', name, meta.get('license'))
        continue
    src = os.path.join(OUT, f'{name}.src')
    with urllib.request.urlopen(urllib.request.Request(meta['url'], headers=UA), timeout=60) as r, open(src, 'wb') as f:
        f.write(r.read())
    wav = os.path.join(OUT, f'{name}.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '2', '-ar', '48000', wav], check=True)
    os.remove(src)
    credits[name] = {
        'file': f'{name}.wav',
        'title': meta.get('title'),
        'creator': meta.get('creator'),
        'openverse_id': oid,
        'landing_url': meta.get('foreign_landing_url'),
        'license': meta.get('license'),
        'source': meta.get('source'),
    }
    print('ok', name, '|', meta.get('title'), '|', meta.get('creator'))

with open(os.path.join(OUT, 'CREDITS.json'), 'w', encoding='utf8') as f:
    json.dump(credits, f, indent=2, ensure_ascii=False)
