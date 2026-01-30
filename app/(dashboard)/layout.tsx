import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PublicUserMenu } from './public-user-menu';
import { getUser } from '@/lib/supabase/get-session';

async function Header() {
  const user = await getUser();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Logo - Left */}
          <Link href={user ? '/app/dashboard' : '/'} className="flex items-center group">
            <Image 
              src="/logo.svg" 
              alt="Bossy" 
              width={375} 
              height={140}
              className="h-[90px] w-auto transition-all duration-300 group-hover:brightness-0 group-hover:saturate-100 group-hover:[filter:brightness(0)_saturate(100%)_invert(34%)_sepia(85%)_saturate(3038%)_hue-rotate(250deg)_brightness(93%)_contrast(94%)]"
              priority
            />
          </Link>
          
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          
          {/* Actions - Right */}
          <div className="flex items-center gap-3 ml-auto">
            {user ? (
              <PublicUserMenu user={user} />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
