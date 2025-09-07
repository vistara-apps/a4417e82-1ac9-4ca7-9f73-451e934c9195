import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CampusConnect - Discover Your Tribe. Ace Your Studies.',
  description: 'A niche community hub for students to discover peers with shared academic and extracurricular interests, organize study groups, and share resources on Base.',
  keywords: ['students', 'study groups', 'academic', 'community', 'base', 'blockchain'],
  authors: [{ name: 'CampusConnect Team' }],
  openGraph: {
    title: 'CampusConnect - Discover Your Tribe. Ace Your Studies.',
    description: 'Connect with like-minded students, organize study sessions, and share academic resources.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
