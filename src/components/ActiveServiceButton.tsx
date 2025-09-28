"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ActiveServiceButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  // We don't need an isActive prop here, as this component is specifically for the active state.
  // Any additional props for the native button can be passed through.
}

const ActiveServiceButton: React.FC<ActiveServiceButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      // Explicitly define all styles for the active state on a native button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
        "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50 h-9 px-3 py-2", // Mimic shadcn button sizing
        "bg-brand-primary hover:bg-brand-primary/90", // Background and hover background
        className
      )}
      {...props}
    >
      <span className="text-white hover:text-white"> {/* Apply text-white directly to span, and on hover */}
        {children}
      </span>
    </button>
  );
};

export default ActiveServiceButton;