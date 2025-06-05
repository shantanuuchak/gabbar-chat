
"use client";

import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal } from 'lucide-react'; // Terminal is used locally, fine.
import type { AiActionResult } from '@/app/actions';

interface AiToolClientWrapperProps {
  title: string;
  description: string;
  iconName: string; // Changed from icon: LucideIcon
  inputLabel: string;
  inputName: string;
  inputPlaceholder: string;
  inputType?: "text" | "textarea";
  action: (formData: FormData) => Promise<AiActionResult>;
  ctaText: string;
}

export function AiToolClientWrapper({
  title,
  description,
  iconName, // Changed from icon
  inputLabel,
  inputName,
  inputPlaceholder,
  inputType = "textarea",
  action,
  ctaText,
}: AiToolClientWrapperProps) {
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const Icon = (LucideIcons as any)[iconName] as React.ComponentType<LucideProps>;

  if (!Icon) {
    // Basic fallback if icon is not found, or you could throw an error / use a default
    console.error(`Icon "${iconName}" not found. Please check the icon name.`);
    const FallbackIcon = LucideIcons.HelpCircle; // Default fallback
     return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <FallbackIcon className="h-8 w-8 text-destructive" />
            <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          </div>
          <CardDescription>{description} (Error: Icon not found)</CardDescription>
        </CardHeader>
        <CardContent>
          <p>There was an issue loading this tool's icon.</p>
        </CardContent>
      </Card>
     );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
      const { output: actionResult, error: actionError } = await action(formData);
      if (actionError) {
        setError(actionError);
      } else {
        setResult(actionResult);
      }
    });
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={inputName} className="text-sm font-medium">
              {inputLabel}
            </Label>
            {inputType === 'textarea' ? (
              <Textarea
                id={inputName}
                name="inputText" // Name must match what action expects from FormData
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mt-1 min-h-[120px] focus:ring-accent focus:border-accent"
                required
              />
            ) : (
              <Input
                id={inputName}
                name="inputText" // Name must match what action expects from FormData
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mt-1 focus:ring-accent focus:border-accent"
                required
              />
            )}
          </div>
          {error && (
             <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}
           {result && (
             <Alert variant="default" className="bg-primary/5 border-primary/20">
                <Icon className="h-4 w-4 text-primary" />
               <AlertTitle className="text-primary font-semibold">Result</AlertTitle>
               <AlertDescription className="whitespace-pre-wrap text-foreground/90">{result}</AlertDescription>
             </Alert>
           )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-colors">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icon className="mr-2 h-4 w-4" />}
            {isPending ? 'Processing...' : ctaText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
