"use client";

import { FilterTabItem } from "@/lib/filterTabs-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterTabsProps {
  items: FilterTabItem[];
  onTabClick?: (item: FilterTabItem) => void;
  className?: string;
}

export default function FilterTabs({ items, onTabClick, className }: FilterTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    items.find((item) => item.isActive)?.id || items[0]?.id || ""
  );

  const handleTabClick = (item: FilterTabItem) => {
    setActiveTab(item.id);
    onTabClick?.(item);
  };

  const TabContent = ({ item, isActive }: { item: FilterTabItem; isActive: boolean }) => (
    <div
      className={cn(
        "relative flex-1 cursor-pointer rounded-md px-4 py-2 shadow-none",
        "border border-gray-200 bg-white",
        isActive && "z-10 border-2 border-blue-600"
      )}
    >
      <div
        className="flex-1 cursor-pointer text-sm font-medium"
        role="tab"
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        onClick={() => handleTabClick(item)}
      >
        <span className="mb-1 block text-sm text-gray-500">{item.label}</span>
        <span className="block text-sm font-medium">{item.count}</span>
      </div>
    </div>
  );

  return (
    <div role="tablist" className={cn("mb-1 flex gap-2 overflow-x-auto", className)}>
      {items.map((item) => (
        <TabContent key={item.id} item={item} isActive={activeTab === item.id} />
      ))}
    </div>
  );
}
