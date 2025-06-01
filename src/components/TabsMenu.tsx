"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabMenuItem } from "@/lib/tab-menus";
import { cn } from "@/lib/utils";
import "@/styles/TabsMenu.css";
import { useRef, useState } from "react";
import Reveal from "./Reveal";

interface TabsMenuProps {
  items: TabMenuItem[];
  defaultValue: string;
  onTabChange?: (value: string) => void;
  children?: React.ReactNode;
  renderTabContent?: (item: TabMenuItem) => React.ReactNode;
}

export default function TabsMenu({
  items,
  defaultValue,
  onTabChange,
  children,
  renderTabContent,
}: TabsMenuProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Keep track of which tab was just activated for animation
  const [animatingTab, setAnimatingTab] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    // Set the animating tab
    setAnimatingTab(value);

    // Reset animation after it completes
    setTimeout(() => {
      setAnimatingTab(null);
    }, 1000);

    // Scroll the selected tab into view
    const targetRef = tabRefs.current[value];
    if (targetRef) {
      targetRef.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    // Call external handler if provided
    onTabChange?.(value);
  };

  return (
    <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="gap-0">
      <div className="tabs-container overflow-x-auto pb-1">
        <TabsList
          className={cn(
            "w-full min-w-max justify-start gap-4 rounded-none border-b bg-transparent pb-0 dark:border-zinc-500"
          )}
        >
          {items.map((item) => (
            <TabsTrigger
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.value] = el;
              }}
              className={cn(
                "relative min-w-max flex-none rounded-none !bg-transparent px-4 pb-3 !shadow-none",
                "relative bottom-[-2px] px-0 data-[state=active]:text-blue-600",
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full",
                "after:bg-blue-600 after:transition-transform after:duration-300 after:ease-out",
                "data-[state=active]:after:scale-x-100 data-[state=inactive]:after:scale-x-0",
                animatingTab === item.value && "tab-pulse"
              )}
              value={item.value}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Custom tab content with animations */}
      <div className="relative mt-2 overflow-hidden">
        {items.map((item) => (
          <TabsContent key={item.id} value={item.value} className="mt-0 outline-none">
            <Reveal>{renderTabContent ? renderTabContent(item) : item.content}</Reveal>
          </TabsContent>
        ))}
        {children}
      </div>
    </Tabs>
  );
}
