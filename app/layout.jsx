import './globals.css';

export const metadata = {
  title: 'Reviewwo — Autonomous Google Review Velocity Platform',
  description: 'Turn in-store foot traffic into 5-star Google reviews. 1-tap copy & Google Maps deep link, private negative review shield with instant manager WhatsApp alerts, and premium NFC acrylic standees.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  openGraph: {
    title: 'Reviewwo — 5-Star Review Acceleration Platform',
    description: 'Autonomous in-store review engine: 1-tap copy & Google deep-link, instant manager grievance alerts via sovereign WhatsApp socket, and dual-tap NFC standees.',
    type: 'website',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-sans antialiased text-[#234745] bg-[#F8FFFE]">
        {children}
      </body>
    </html>
  );
}
