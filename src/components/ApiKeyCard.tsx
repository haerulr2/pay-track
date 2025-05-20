"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ApiKeyCardProps {
  publishableKey: string;
  secretKey: string;
  className?: string;
}

export default function ApiKeyCard({ publishableKey, secretKey, className }: ApiKeyCardProps) {
  const [, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, keyType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyType);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const maskKey = (key: string) => `${key.slice(0, 12)}...${key.slice(-4)}`;

  return (
    <Card className={cn("border-none shadow-none bg-gray-100", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">API keys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Publishable key</span>
              <code
                className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm cursor-pointer"
                onClick={() => copyToClipboard(publishableKey, "publishable")}
              >
                {maskKey(publishableKey)}
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Secret key</span>
              <code
                className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm cursor-pointer"
                onClick={() => copyToClipboard(secretKey, "secret")}
              >
                {maskKey(secretKey)}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 