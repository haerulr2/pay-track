"use client";

import { Store } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { navItems, productItems, shortCutItems } from "@/lib/sidebar-items";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-gray-200 bg-white md:block dark:border-zinc-500 dark:bg-zinc-900">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link
            href="/dashboard"
            className="flex items-center text-xl font-semibold dark:text-white"
          >
            <Store className="mr-2 h-6 w-6" />
            PayTrack
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-3 py-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-0 flex h-[30px] items-center rounded-lg px-2 text-sm font-light",
                "text-default-800 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
                "transition-colors duration-150 ease-in-out"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Shortcuts */}
        <nav className="space-y-1 px-3 py-6">
          <h3 className="text-default-800 px-2 text-xs font-light dark:text-zinc-400">Shortcuts</h3>
          {shortCutItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-0 flex h-[30px] items-center rounded-lg px-2 text-sm font-light",
                "text-default-800 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
                "transition-colors duration-150 ease-in-out"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Product */}
        <nav className="space-y-1 px-3 py-6">
          <h3 className="text-default-800 px-2 text-xs font-light dark:text-zinc-400">Product</h3>
          <Accordion type="single" collapsible className="w-full">
            {productItems.map((item) => (
              <AccordionItem
                key={item.title}
                value={item.title}
                className="border-none shadow-none"
              >
                <AccordionTrigger
                  className={cn(
                    "mb-0 flex h-[30px] items-center justify-start rounded-lg px-2 text-sm font-light hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
                    "cursor-pointer transition-colors duration-150 ease-in-out"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      href={child.href}
                      className={cn(
                        "mb-0 flex h-[30px] items-center rounded-lg px-2 text-sm font-light",
                        "text-default-800 pl-9 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
                        "transition-colors duration-150 ease-in-out"
                      )}
                    >
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
