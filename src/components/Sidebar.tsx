'use client';

import { cn } from "@/lib/utils";
import { navItems, productItems, shortCutItems } from "@/lib/sidebar-items";
import { Store } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6">
          <Link href="/dashboard" className="flex items-center text-xl font-semibold">
            <Store className="w-6 h-6 mr-2" />
            PayTrack
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-2 h-[30px] text-sm font-light rounded-lg mb-0",
                "text-default-800 hover:bg-gray-100 hover:text-gray-900",
                "transition-colors duration-150 ease-in-out"
              )}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Shortcuts */}
        <nav className="px-3 py-6 space-y-1">
          <h3 className="text-xs font-light text-default-800 px-2">Shortcuts</h3>
          {shortCutItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center px-2 h-[30px] text-sm font-light rounded-lg mb-0",
              "text-default-800 hover:bg-gray-100 hover:text-gray-900",
              "transition-colors duration-150 ease-in-out"
            )}>
              <item.icon className="w-4 h-4 mr-3" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Product */}
        <nav className="px-3 py-6 space-y-1">
          <h3 className="text-xs font-light text-default-800 px-2">Product</h3>
          <Accordion type="single" collapsible className="w-full">
            {productItems.map((item) => (
              <AccordionItem key={item.title} value={item.title} className="border-none shadow-none">
                <AccordionTrigger
                  className={cn(
                    "flex items-center justify-start px-2 h-[30px] text-sm font-light rounded-lg mb-0 hover:bg-gray-100 hover:text-gray-900",
                    "transition-colors duration-150 ease-in-out cursor-pointer"
                  )}>
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  {item.children.map((child) => (
                    <Link key={child.title} href={child.href} className={cn(
                      "flex items-center px-2 h-[30px] text-sm font-light rounded-lg mb-0",
                      "text-default-800 hover:bg-gray-100 hover:text-gray-900 pl-9",
                      "transition-colors duration-150 ease-in-out"
                    )}>
                      {child.title}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </div>
    </aside>
  );
}