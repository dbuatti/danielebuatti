"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PhilosophyStatementProps {
  className?: string;
}

const PhilosophyStatement: React.FC<PhilosophyStatementProps> = ({ className }) => {
  return (
    <div className={cn(
      "bg-brand-secondary/20 dark:bg-brand-dark-alt/50 p-6 rounded-xl shadow-inner",
      "text-center space-y-3",
      className
    )}>
      <p className="text-xl md:text-2xl font-bold text-brand-primary uppercase tracking-wide">
        THOUGHT • INTENTION • BREATH • EXPRESSION
      </p>
      <p className="text-md md:text-lg text-brand-dark/70 dark:text-brand-light/70 italic">
        "I believe expression truly happens when the thought arises to express. My therapeutic approach helps students not only inform the characters they portray but also gain a deeper understanding of their own mannerisms, expressions, and thoughts, fostering authentic connection and healing through self-awareness."
      </p>
    </div>
  );
};

export default PhilosophyStatement;