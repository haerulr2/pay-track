"use client";

import { useRef, useState } from "react";
import TransactionsTable from "@/components/TransactionsTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function TransactionsPage() {
  const paymentsRef = useRef<HTMLButtonElement>(null);
  const collectedFeesRef = useRef<HTMLButtonElement>(null);
  const transfersRef = useRef<HTMLButtonElement>(null);
  
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
    let targetRef = null;
    if (value === "Payments") {
      targetRef = paymentsRef.current;
    } else if (value === "Collected fees") {
      targetRef = collectedFeesRef.current;
    } else if (value === "Transfers") {
      targetRef = transfersRef.current;
    }
    
    if (targetRef) {
      targetRef.scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest",
        inline: "center" 
      });
    }
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
    <div className="bg-white dark:bg-zinc-900 max-w-7xl mx-auto px-1 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Transactions
        </h1>

        <div className="flex items-center space-x-2">
          <Button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4" />
            <span>Create payment</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1 ml-2">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-current"
            >
              <path d="M8 12L12 8L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12L8 8L4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Analyze</span>
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes tab-pulse {
          0% { background-color: transparent; }
          30% { background-color: rgba(59, 130, 246, 0.12); }
          100% { background-color: transparent; }
        }
        
        .tab-pulse {
          animation: tab-pulse 1s ease-in-out;
          border-radius: 0.375rem;
        }

        /* Hide scrollbar but allow scrolling */
        .tabs-container {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        .tabs-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>

      <Tabs defaultValue="Payments" onValueChange={handleTabChange}>
        <div className="overflow-x-auto pb-1 -mb-1 tabs-container">
          <TabsList className={cn(
            "bg-transparent w-full min-w-max justify-start border-b dark:border-zinc-500 rounded-none pb-0"
          )}>
            <TabsTrigger 
              ref={paymentsRef}
              className={cn(
                "bg-transparent !shadow-none min-w-max flex-none px-4 pb-3 rounded-none relative",
                "data-[state=active]:text-blue-600",
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full",
                "after:bg-blue-600 after:transition-transform after:duration-300 after:ease-out",
                "data-[state=active]:after:scale-x-100 data-[state=inactive]:after:scale-x-0",
                animatingTab === "Payments" && "tab-pulse"
              )} 
              value="Payments"
            >
              Payments
            </TabsTrigger>
            <TabsTrigger 
              ref={collectedFeesRef}
              className={cn(
                "bg-transparent !shadow-none min-w-max flex-none px-4 pb-3 rounded-none relative",
                "data-[state=active]:text-blue-600",
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full",
                "after:bg-blue-600 after:transition-transform after:duration-300 after:ease-out",
                "data-[state=active]:after:scale-x-100 data-[state=inactive]:after:scale-x-0",
                animatingTab === "Collected fees" && "tab-pulse"
              )} 
              value="Collected fees"
            >
              Collected fees
            </TabsTrigger>
            <TabsTrigger 
              ref={transfersRef}
              className={cn(
                "bg-transparent !shadow-none min-w-max flex-none px-4 pb-3 rounded-none relative",
                "data-[state=active]:text-blue-600",
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full",
                "after:bg-blue-600 after:transition-transform after:duration-300 after:ease-out",
                "data-[state=active]:after:scale-x-100 data-[state=inactive]:after:scale-x-0",
                animatingTab === "Transfers" && "tab-pulse"
              )} 
              value="Transfers"
            >
              Transfers
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Custom tab content with animations */}
        <div className="relative mt-6 overflow-hidden">
          {/* Payments Tab */}
          <TabsContent value="Payments" className="mt-0 outline-none">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
            >
              <TransactionsTable />
            </motion.div>
          </TabsContent>
          
          {/* Collected fees Tab */}
          <TabsContent value="Collected fees" className="mt-0 outline-none">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
            >
              <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                  <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-lg font-medium mb-1">No collected fees yet</h3>
                <p>Fees collected from your payments will appear here.</p>
              </div>
            </motion.div>
          </TabsContent>
          
          {/* Transfers Tab */}
          <TabsContent value="Transfers" className="mt-0 outline-none">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
            >
              <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-lg font-medium mb-1">No transfers yet</h3>
                <p>Your transfers to connected bank accounts will appear here.</p>
              </div>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
