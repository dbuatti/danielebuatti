import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  title?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, title }) => {
  return (
    <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary dark:border-brand-secondary/50 p-6 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <Quote className="h-8 w-8 text-brand-primary mb-4" />
      <CardContent className="text-lg italic text-brand-dark dark:text-brand-light mb-4 p-0">
        "{quote}"
      </CardContent>
      <p className="font-semibold text-brand-primary text-md">{author}</p>
      {title && <p className="text-sm text-brand-dark/70 dark:text-brand-light/70">{title}</p>}
    </Card>
  );
};

export default TestimonialCard;