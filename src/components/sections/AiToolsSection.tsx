
import { AiToolClientWrapper } from '@/components/ai/AiToolClientWrapper';
import { handleSummarizeText, handleGenerateHeadline } from '@/app/actions';
// Removed ListCollapse, PenTool imports as they are now passed by name

export function AiToolsSection() {
  return (
    <section id="ai-tools" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-screen-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Explore AI Pilot's Capabilities</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Interact with our AI tools directly. Experience the power of AI Pilot.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <AiToolClientWrapper
            title="Text Summarizer"
            description="Provide a block of text, and AI Pilot will generate a concise summary."
            iconName="ListCollapse" // Pass icon name as string
            inputLabel="Text to Summarize"
            inputName="textToSummarize"
            inputPlaceholder="Paste your long text here..."
            inputType="textarea"
            action={handleSummarizeText}
            ctaText="Summarize Text"
          />
          <AiToolClientWrapper
            title="Headline Generator"
            description="Enter a topic or a short description, and AI Pilot will craft a catchy headline."
            iconName="PenTool" // Pass icon name as string
            inputLabel="Topic / Description"
            inputName="topicForHeadline"
            inputPlaceholder="e.g., 'New AI powered productivity app for developers'"
            inputType="text"
            action={handleGenerateHeadline}
            ctaText="Generate Headline"
          />
        </div>
      </div>
    </section>
  );
}
