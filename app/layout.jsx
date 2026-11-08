import './globals.css';
import { SITE_URL, SITE_NAME } from '../src/lib/seo';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Reviewwo | Google Review QR Codes',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Google review QR codes that make it easy for customers to review your business, with private feedback and instant manager alerts.',
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B3D3B',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
