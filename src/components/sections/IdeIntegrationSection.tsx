import Image from 'next/image';
import { MonitorSmartphone, Braces, Keyboard } from 'lucide-react';

const integrations = [
  { name: 'VS Code', icon: MonitorSmartphone, logoUrl: 'https://placehold.co/100x40.png', hint: 'vscode logo' },
  { name: 'JetBrains IDEs', icon: Braces, logoUrl: 'https://placehold.co/100x40.png', hint: 'jetbrains logo' },
  { name: 'Neovim', icon: Keyboard, logoUrl: 'https://placehold.co/100x40.png', hint: 'neovim logo' },
  { name: 'And More...', icon: Keyboard, logoUrl: 'https://placehold.co/100x40.png', hint: 'more ides' },
];

export function IdeIntegrationSection() {
  return (
    <section id="integrations" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-screen-lg text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Works Where You Do</h2>
        <p className="text-lg text-muted-foreground mb-12">
          AI Pilot seamlessly integrates with your favorite code editors and IDEs.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center">
          {integrations.map((ide) => (
            <div key={ide.name} className="flex flex-col items-center p-4 rounded-lg transition-transform hover:scale-105">
              <Image src={ide.logoUrl} alt={`${ide.name} logo`} width={100} height={40} data-ai-hint={ide.hint} className="mb-2 object-contain h-10"/>
              <span className="text-sm font-medium text-foreground/80">{ide.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
