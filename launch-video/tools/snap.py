"""Render stills of the film. Usage: python -P snap.py W H OUTDIR t1 t2 ...  (t may be 'b12' for beat 12 + 0.12s)."""
import functools, http.server, os, sys, threading
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
FILM = os.path.normpath(os.path.join(HERE, '..', 'film'))


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=FILM)
    handler.log_message = lambda *a, **k: None
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def main():
    w, h, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
    os.makedirs(out, exist_ok=True)
    srv = serve()
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': w, 'height': h})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(f'http://127.0.0.1:{srv.server_port}/index.html?w={w}&h={h}')
        pg.wait_for_function('window.READY === true', timeout=30000)
        film = pg.evaluate('({END: FILM.END, BEAT: FILM.BEAT, T0: FILM.T0})')
        for arg in sys.argv[4:]:
            t = film['T0'] + float(arg[1:]) * film['BEAT'] + 0.12 if arg.startswith('b') else float(arg)
            pg.evaluate(f'seek({t})')
            pg.screenshot(path=os.path.join(out, f'{arg}.png'))
        if errs:
            print('PAGE ERRORS:', errs)
        print('END', film['END'])
        b.close()
    srv.shutdown()


main()
