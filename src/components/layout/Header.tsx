import Link from 'next/link';
import { Bot, Settings } from 'lucide-react'; // Settings icon as a placeholder
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-foreground">Gabbar</span>
        </Link>
        {/* Placeholder for future icons like settings or help */}
        {/* <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-foreground/80" />
          <span className="sr-only">Settings</span>
        </Button> */}
      </div>
    </header>
  );
}
