"use client";

import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TabMenuItem } from "@/lib/tab-menus";
import styles from "./DynamicTabs.module.css";

interface DynamicTabsProps {
  items: TabMenuItem[];
  defaultValue: string;
  onTabChange?: (value: string) => void;
  children?: React.ReactNode;
  renderTabContent?: (item: TabMenuItem) => React.ReactNode;
}

export default function DynamicTabs({ 
  items, 
  defaultValue, 
  onTabChange,
  children,
  renderTabContent 
}: DynamicTabsProps) {
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
        inline: "center" 
      });
    }
    
    // Call external handler if provided
    onTabChange?.(value);
  };

  // Animation variants for tab content
  const tabContentVariants = {
    hidden: { 
      opacity: 0,
      x: 10,
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0,
      x: -10,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      } 
    }
  };

  return (
    <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
      <div className={`overflow-x-auto pb-1 -mb-1 ${styles.tabsContainer}`}>
        <TabsList className={cn(
          "bg-transparent w-full min-w-max justify-start border-b dark:border-zinc-500 rounded-none pb-0"
        )}>
          {items.map((item) => (
            <TabsTrigger 
              key={item.id}
              ref={(el) => { tabRefs.current[item.value] = el; }}
              className={cn(
                "bg-transparent !shadow-none min-w-max flex-none px-4 pb-3 rounded-none relative",
                "data-[state=active]:text-blue-600",
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full",
                "after:bg-blue-600 after:transition-transform after:duration-300 after:ease-out",
                "data-[state=active]:after:scale-x-100 data-[state=inactive]:after:scale-x-0",
                animatingTab === item.value && styles.tabPulse
              )} 
              value={item.value}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {/* Custom tab content with animations */}
      <div className="relative mt-6 overflow-hidden">
        {items.map((item) => (
          <TabsContent key={item.id} value={item.value} className="mt-0 outline-none">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
            >
              {renderTabContent ? renderTabContent(item) : item.content}
            </motion.div>
          </TabsContent>
        ))}
        {children}
      </div>
    </Tabs>
  );
} 