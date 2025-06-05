import { Button } from '@/components/ui/button';
import { Rocket, ShieldCheck } from 'lucide-react';

export function CtaSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-gradient-to-r from-primary to-purple-700 text-primary-foreground">
      <div className="container max-w-screen-md text-center">
        <ShieldCheck className="h-16 w-16 mx-auto mb-6 text-accent" />
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
          Ready to Elevate Your Coding Experience?
        </h2>
        <p className="text-lg opacity-90 mb-8">
          Join thousands of developers who are building faster and smarter with AI Pilot. 
          Get started today and experience the future of software development.
        </p>
        <Button 
          size="lg" 
          variant="default" 
          className="bg-accent hover:bg-accent/90 text-accent-foreground transition-transform hover:scale-105 text-lg px-8 py-6 shadow-lg"
        >
          <Rocket className="mr-2 h-5 w-5" /> Start Your Free Trial
        </Button>
        <p className="mt-4 text-sm opacity-80">14-day free trial. No credit card required.</p>
      </div>
    </section>
  );
}
