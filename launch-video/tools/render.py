"""Render the film: Playwright subframes -> ffmpeg tmix motion blur -> 60 fps H.264 segments -> concat.
Usage: python -P render.py W H OUT_DIR [workers] [--draft]
--draft: 1 subframe per frame at 30 fps (quick timing check)."""
import functools, http.server, json, os, subprocess, sys, threading
from multiprocessing import Process

HERE = os.path.dirname(os.path.abspath(__file__))
FILM = os.path.normpath(os.path.join(HERE, '..', 'film'))


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=FILM)
    handler.log_message = lambda *a, **k: None
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def open_page(p, w, h, port):
    b = p.chromium.launch(args=['--force-color-profile=srgb', '--disable-lcd-text'])
    pg = b.new_page(viewport={'width': w, 'height': h})
    pg.goto(f'http://127.0.0.1:{port}/index.html?w={w}&h={h}')
    pg.wait_for_function('window.READY === true', timeout=60000)
    return b, pg


def worker(idx, w, h, port, f0, f1, fps, sub, seg_path):
    from playwright.sync_api import sync_playwright
    vf = []
    if sub > 1:
        vf.append(f"tmix=frames={sub}:weights='{' '.join(['1'] * sub)}',select='eq(mod(n\\,{sub})\\,{sub - 1})',setpts=N/({fps}*TB)")
    vf.append('scale=out_color_matrix=bt709:out_range=tv,format=yuv420p')
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(fps * sub), '-c:v', 'mjpeg', '-i', '-',
                           '-vf', ','.join(vf), '-r', str(fps), '-c:v', 'libx264', '-preset', 'medium', '-crf', '12',
                           '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', seg_path],
                          stdin=subprocess.PIPE)
    with sync_playwright() as p:
        b, pg = open_page(p, w, h, port)
        for f in range(f0, f1):
            for k in range(sub):
                t = f / fps + ((k - (sub - 1) / 2) / (fps * sub) if sub > 1 else 0)
                for attempt in range(3):
                    try:
                        pg.evaluate(f'seek({max(0.0, t)})')
                        img = pg.screenshot(type='jpeg', quality=94)
                        break
                    except Exception:
                        try:
                            b.close()
                        except Exception:
                            pass
                        b, pg = open_page(p, w, h, port)
                ff.stdin.write(img)
            if (f - f0) % 120 == 0:
                print(f'[w{idx}] frame {f}/{f1}', flush=True)
        b.close()
    ff.stdin.close()
    ff.wait()
    os._exit(0)


def main():
    w, h, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
    args = [a for a in sys.argv[4:] if not a.startswith('--')]
    workers = int(args[0]) if args else 3
    draft = '--draft' in sys.argv
    fps, sub = (30, 1) if draft else (60, 4)
    os.makedirs(out, exist_ok=True)
    srv = serve()
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, pg = open_page(p, w, h, srv.server_port)
        info = pg.evaluate('({END: FILM.END, CUES: FILM.CUES})')
        b.close()
    json.dump(info['CUES'], open(os.path.join(out, 'cues.json'), 'w'), indent=0)
    total = int(round(info['END'] * fps))
    per = (total + workers - 1) // workers
    procs, segs = [], []
    for i in range(workers):
        f0, f1 = i * per, min(total, (i + 1) * per)
        if f0 >= f1:
            break
        seg = os.path.join(out, f'seg{i}.mp4')
        segs.append(seg)
        pr = Process(target=worker, args=(i, w, h, srv.server_port, f0, f1, fps, sub, seg))
        pr.start()
        procs.append(pr)
    for pr in procs:
        pr.join()
    lst = os.path.join(out, 'segs.txt')
    with open(lst, 'w') as f:
        for s in segs:
            f.write(f"file '{os.path.basename(s)}'\n")
    video = os.path.join(out, 'video.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', video], check=True)
    for s in segs:
        os.remove(s)
    os.remove(lst)
    print('END', info['END'], 'frames', total, '->', video)
    srv.shutdown()


if __name__ == '__main__':
    main()
