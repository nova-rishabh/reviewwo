import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';
const dev = process.env.NODE_ENV === 'development';
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log(`> Initializing Reviewwo Next.js Production Server on ${hostname}:${port}...`);

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Reviewwo Next.js Production Server live on http://${hostname}:${port}`);
  });

  // Keep alive even if stdin closes
  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  process.exit(1);
});
