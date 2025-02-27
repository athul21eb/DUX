"use client";

import "client-only";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importing cn utility for class name handling


interface SubmitButtonProps {
  buttonText: string;
  loadingText: string;
  className?: string;
  loading?: boolean; // Accept loading state
}

export function SubmitButton({
  buttonText,
  loadingText,
  className = "",
  loading = false,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn("w-full", className, { "opacity-50": loading })} // Add opacity when loading
      disabled={loading}
    >
      {loading ? loadingText : buttonText}
    </Button>
  );
}

