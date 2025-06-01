"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TIME_CONSTANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";

import type { BaseComponentProps } from "@/types";

interface ApiKeyCardProps extends BaseComponentProps {
  publishableKey: string;
  secretKey: string;
}

export default function ApiKeyCard({ publishableKey, secretKey, className }: ApiKeyCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, keyType: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyType);
      setTimeout(() => setCopiedKey(null), TIME_CONSTANTS.DEBOUNCE_DELAY * 6);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const maskKey = (key: string): string => `${key.slice(0, 12)}...${key.slice(-4)}`;

  const handleKeyClick = (key: string, keyType: string) => {
    void copyToClipboard(key, keyType);
  };

  return (
    <Card className={cn("border-none bg-gray-100 shadow-none", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">API keys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Publishable key</span>
              <code
                className="bg-muted hover:bg-muted/80 relative cursor-pointer rounded px-[0.3rem] py-[0.2rem] font-mono text-sm transition-colors"
                onClick={() => handleKeyClick(publishableKey, "publishable")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleKeyClick(publishableKey, "publishable");
                  }
                }}
                aria-label="Click to copy publishable key"
                title={copiedKey === "publishable" ? "Copied!" : "Click to copy"}
              >
                {maskKey(publishableKey)}
                {copiedKey === "publishable" && (
                  <span className="ml-2 text-xs text-green-600">Copied!</span>
                )}
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Secret key</span>
              <code
                className="bg-muted hover:bg-muted/80 relative cursor-pointer rounded px-[0.3rem] py-[0.2rem] font-mono text-sm transition-colors"
                onClick={() => handleKeyClick(secretKey, "secret")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleKeyClick(secretKey, "secret");
                  }
                }}
                aria-label="Click to copy secret key"
                title={copiedKey === "secret" ? "Copied!" : "Click to copy"}
              >
                {maskKey(secretKey)}
                {copiedKey === "secret" && (
                  <span className="ml-2 text-xs text-green-600">Copied!</span>
                )}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
