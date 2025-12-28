import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { TranslationProvider } from '@/contexts/translation-context';
import enTranslations from '@/dictionaries/en.json';

export const metadata: Metadata = {
  title: 'Bossy - Execution-First Accountability',
  description: 'Set goals, commit to daily tasks, and face the boss when you don\'t deliver. No excuses. No negotiations.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${inter.variable}`}
    >
      <body className="min-h-[100dvh] bg-gray-50 font-sans">
        <TranslationProvider initialTranslations={enTranslations}>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
