"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ServicesDropdownTriggerProps {
  children: React.ReactNode;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
}

const ServicesDropdownTrigger: React.FC<ServicesDropdownTriggerProps> = ({
  children,
  isActive,
  onMouseEnter,
  onMouseLeave,
  className,
}) => {
  const commonClasses = cn(
    "text-sm font-medium transition-colors hover:text-brand-primary",
    "px-3 py-2 rounded-md cursor-pointer", // Added cursor-pointer for better UX
    isActive
      ? "font-bold text-brand-primary dark:text-brand-primary border-b-[3px] border-brand-primary pb-2"
      : "text-brand-dark dark:text-brand-light",
    "bg-transparent hover:bg-transparent", // Ensure no background
    className
  );

  return (
    <span
      className={commonClasses}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button" // Indicate it's interactive
      tabIndex={0} // Make it focusable
    >
      {children}
    </span>
  );
};

export default ServicesDropdownTrigger;