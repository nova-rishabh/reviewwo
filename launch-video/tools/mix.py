"""Mix the soundtrack: song + CC0 sound effects placed by their measured peak.
Usage: python -P mix.py cues.json END_SECONDS out.wav
Each effect's loudest sample (max |x|) is placed on its cue time: start = cue - peak_offset;
if that is before 0, the head of the effect is trimmed instead."""
import json, os, subprocess, sys
import numpy as np

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..'))
SONG = os.path.join(ROOT, 'assets', 'music', 'edm-sample-2.mp3')
SND = os.path.join(ROOT, 'sounds')

# per-effect base level (effects are first normalised to peak 1)
BASE = {'click': 0.5, 'click2': 0.45, 'pop': 0.42, 'pop2': 0.4, 'whoosh': 0.5, 'whoosh2': 0.42, 'blip': 0.45,
        'shutter': 0.35, 'chime': 0.45, 'buzz': 0.4, 'hit': 0.6, 'boom': 0.75, 'magic': 0.5, 'tick': 0.3,
        'ding': 0.45, 'key': 0.3, 'key2': 0.3}


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def main():
    cues = json.load(open(sys.argv[1]))
    end = float(sys.argv[2])
    out = sys.argv[3]
    n = int(end * SR)
    song = decode(SONG)[:n]
    if len(song) < n:
        song = np.pad(song, ((0, n - len(song)), (0, 0)))
    fade = int(1.6 * SR)
    song[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
    sfx = np.zeros((n, 2), np.float32)
    cache, report = {}, []
    for c in cues:
        name = c['s']
        if name not in cache:
            x = decode(os.path.join(SND, f'{name}.wav'))
            peak_i = int(np.argmax(np.abs(x).max(1)))
            pk = np.abs(x).max() or 1
            cache[name] = (x / pk, peak_i)
            report.append((name, peak_i / SR))
        x, peak_i = cache[name]
        g = c['g'] * BASE.get(name, 0.4)
        start = int(round(c['t'] * SR)) - peak_i
        src = x
        if start < 0:
            src = x[-start:]
            start = 0
        m = min(len(src), n - start)
        if m > 0:
            sfx[start:start + m] += src[:m] * g
    mix = song * 0.62 + sfx * 0.72
    pk = np.abs(mix).max()
    mix *= 0.89 / pk  # about -1 dBFS sample peak, one static gain
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', out],
                   input=pcm.tobytes(), check=True)
    print('peak offsets (s):', ', '.join(f'{k}={v:.3f}' for k, v in sorted(report)))
    print('cues placed:', len(cues), '| wrote', out)


main()
