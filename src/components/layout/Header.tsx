import Link from 'next/link';
import { Bot, Github, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NavLinks = ({ className }: { className?: string }) => (
  <>
    <Link href="#features" className={className}>Features</Link>
    <Link href="#ai-tools" className={className}>AI Tools</Link>
    <Link href="#pricing" className={className}>Pricing</Link>
    <Link href="#blog" className={className}>Blog</Link>
  </>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">AI Pilot</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <NavLinks className="transition-colors hover:text-foreground/80 text-foreground/60" />
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="outline" size="sm">
            <Github className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <Link href="/" className="mb-6 flex items-center space-x-2">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">AI Pilot</span>
              </Link>
              <div className="flex flex-col space-y-4">
                <NavLinks className="text-foreground transition-colors hover:text-primary" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
