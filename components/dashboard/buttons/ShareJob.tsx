"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ShareJobButton({
  jobSourceUrl,
}: {
  jobSourceUrl: string;
}) {
  const [, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobSourceUrl);
      setIsCopied(true);

      toast.success("Job link copied!", {
        description: "Now go share it with your friends",
      });

      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Oops... couldn't copy that!", {
        description: "Try again or copy manually.",
      });
    }
  };
  return (
    <Button onClick={handleCopy} variant="outline" className="w-40">
      Share <ExternalLink />
    </Button>
  );
}
