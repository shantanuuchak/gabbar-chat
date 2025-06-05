import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlayCircle, Rocket } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background to-secondary">
      <div className="container max-w-screen-xl grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight">
            Meet Your AI Pair Programmer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            AI Pilot uses advanced AI models to suggest code and entire functions in real-time, right from your editor. Boost your productivity and focus on building great software.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" className="transition-transform hover:scale-105">
              <Rocket className="mr-2 h-5 w-5" /> Get Started with AI Pilot
            </Button>
            <Button variant="outline" size="lg" className="transition-transform hover:scale-105">
              <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
            </Button>
          </div>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            alt="AI Pilot in action"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl object-cover"
            data-ai-hint="futuristic code interface"
          />
        </div>
      </div>
    </section>
  );
}
