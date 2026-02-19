import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { TranslationProvider } from '@/contexts/translation-context';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
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
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider initialTranslations={enTranslations}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
