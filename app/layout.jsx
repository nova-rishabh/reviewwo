import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://reviewwo.divergit.com'),
  title: 'Reviewwo | NFC cards for Google reviews',
  description:
    'NFC review cards that make it easy for customers to review your business on Google, with private feedback and instant manager alerts.',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  openGraph: {
    title: 'Reviewwo | NFC cards for Google reviews',
    description: 'NFC review cards that help local businesses collect Google reviews in person.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B3D3B',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
