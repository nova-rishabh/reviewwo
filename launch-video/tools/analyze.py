"""Tempo + energy profile of audio files. Usage: python -I analyze.py file1 [file2 ...]"""
import subprocess, sys
import numpy as np

SR = 22050


def decode(path):
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def stft_mag(x, n=2048, hop=512):
    win = np.hanning(n).astype(np.float32)
    frames = 1 + (len(x) - n) // hop
    idx = np.arange(n)[None, :] + hop * np.arange(frames)[:, None]
    return np.abs(np.fft.rfft(x[idx] * win, axis=1)), hop


def tempo(x):
    S, hop = stft_mag(x)
    flux = np.maximum(0, np.diff(np.log1p(S), axis=0)).sum(1)
    flux -= flux.mean()
    fps = SR / hop
    ac = np.correlate(flux, flux, 'full')[len(flux) - 1:]
    lo, hi = int(fps * 60 / 180), int(fps * 60 / 70)
    lag = lo + np.argmax(ac[lo:hi])
    return 60 * fps / lag


def profile(x, seg=2.0):
    n = int(SR * seg)
    out = []
    S, hop = stft_mag(x)
    freqs = np.fft.rfftfreq(2048, 1 / SR)
    bass = S[:, freqs < 150].sum(1)
    fps = SR / hop
    for i in range(0, len(x) // n):
        rms = np.sqrt(np.mean(x[i * n:(i + 1) * n] ** 2))
        b = bass[int(i * seg * fps):int((i + 1) * seg * fps)].mean()
        out.append((i * seg, rms, b))
    return out


for p in sys.argv[1:]:
    x = decode(p)
    print(f'\n{p.split("/")[-1].split(chr(92))[-1][:20]}  dur={len(x)/SR:.1f}s  tempo~{tempo(x):.1f}')
    prof = profile(x)
    mx = max(r for _, r, _ in prof) or 1
    mb = max(b for _, _, b in prof) or 1
    print('  ' + ' '.join(f'{int(t):>3}' for t, _, _ in prof))
    print('  ' + ' '.join(f'{int(9 * r / mx):>3}' for _, r, _ in prof) + '   <- loudness 0-9')
    print('  ' + ' '.join(f'{int(9 * b / mb):>3}' for _, _, b in prof) + '   <- bass 0-9')
