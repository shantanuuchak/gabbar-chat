import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Senior Developer',
    testimonial: "AI Pilot has fundamentally changed how I code. It's like having a brilliant assistant available 24/7. My productivity has skyrocketed!",
    avatarUrl: 'https://placehold.co/80x80.png',
    stars: 5,
    hint: 'female developer'
  },
  {
    name: 'Mike P.',
    role: 'Tech Lead',
    testimonial: "The code suggestions are incredibly accurate, and it helps my team onboard new developers much faster. A game-changer for us.",
    avatarUrl: 'https://placehold.co/80x80.png',
    stars: 5,
    hint: 'male developer'
  },
  {
    name: 'Jessica W.',
    role: 'Full-Stack Engineer',
    testimonial: "I was skeptical at first, but AI Pilot is the real deal. It handles boilerplate, suggests complex logic, and even helps me learn new patterns.",
    avatarUrl: 'https://placehold.co/80x80.png',
    stars: 4,
    hint: 'developer portrait'
  },
];

export function TestimonialSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-screen-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Loved by Developers Worldwide</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our users are saying about AI Pilot.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex mb-2">
                  {Array(testimonial.stars).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                  {Array(5 - testimonial.stars).fill(0).map((_, i) => (
                     <Star key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.testimonial}"</p>
              </CardContent>
              <div className="bg-secondary/50 p-4 flex items-center gap-4 rounded-b-lg">
                <Image 
                  src={testimonial.avatarUrl} 
                  alt={testimonial.name} 
                  width={48} 
                  height={48} 
                  className="rounded-full" 
                  data-ai-hint={testimonial.hint}
                />
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
