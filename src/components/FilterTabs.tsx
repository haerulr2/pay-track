"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FilterTabItem } from "@/lib/filterTabs-menu";

interface FilterTabsProps {
  items: FilterTabItem[];
  onTabClick?: (item: FilterTabItem) => void;
  className?: string;
}

export default function FilterTabs({ items, onTabClick, className }: FilterTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    items.find(item => item.isActive)?.id || items[0]?.id || ""
  );

  const handleTabClick = (item: FilterTabItem) => {
    setActiveTab(item.id);
    onTabClick?.(item);
  };

  const TabContent = ({ item, isActive }: { item: FilterTabItem; isActive: boolean }) => (
    <div className={cn(
      "relative flex-1 px-4 py-2 cursor-pointer rounded-md shadow-none",
      "bg-white border border-gray-200",
      isActive && "z-10 border-2 border-blue-600"
    )}>
      <div
        className="flex-1 cursor-pointer text-sm font-medium"
        role="tab"
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        onClick={() => handleTabClick(item)}
      >
        <span className="text-sm text-gray-500 block mb-1">{item.label}</span>
        <span className="text-sm font-medium block">{item.count}</span>
      </div>
    </div>
  );

  return (
    <div
      role="tablist"
      className={cn(
        "flex overflow-x-auto gap-2 mb-1 p-4",
        className
      )}
    >
      {items.map((item) => (
        <TabContent
          key={item.id}
          item={item}
          isActive={activeTab === item.id}
        />
      ))}
    </div>
  );
} 