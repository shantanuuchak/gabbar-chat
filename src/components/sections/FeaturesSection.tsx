import { FeatureCard } from './FeatureCard';
import { Wand2, FileCode, MessageSquareText, TerminalSquare, Puzzle, Zap } from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'AI Code Suggestions',
    description: 'Get intelligent code suggestions in real-time as you type. Supports multiple languages and frameworks.',
  },
  {
    icon: FileCode,
    title: 'Generate Code from Comments',
    description: 'Write a comment describing the logic you want, and AI Pilot will generate the code for you.',
  },
  {
    icon: MessageSquareText,
    title: 'Explain & Document Code',
    description: 'Understand complex code snippets or automatically generate documentation for your functions.',
  },
  {
    icon: TerminalSquare,
    title: 'CLI & Scripting Assistance',
    description: 'Get help with shell commands, scripting, and automating tasks directly in your terminal.',
  },
  {
    icon: Puzzle,
    title: 'Seamless IDE Integration',
    description: 'Works with your favorite IDEs, providing a familiar and productive environment.',
  },
  {
    icon: Zap,
    title: 'Boost Productivity',
    description: 'Reduce boilerplate, write code faster, and spend more time on solving complex problems.',
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container max-w-screen-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Powerful Features to Supercharge Your Workflow</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            AI Pilot is packed with features designed to make you a more efficient and effective developer.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
