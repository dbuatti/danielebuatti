"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActiveServiceButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  // We don't need an isActive prop here, as this component is specifically for the active state.
  // Any additional props for the Button can be passed through.
}

const ActiveServiceButton: React.FC<ActiveServiceButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Button
      // Explicitly define all styles for the active state, without passing a 'variant' prop
      className={cn(
        "text-sm font-medium transition-colors px-3 py-2 rounded-md",
        "bg-brand-primary !text-brand-light hover:bg-brand-primary/90 hover:!text-brand-light", // Force white text on pink background, even on hover
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActiveServiceButton;