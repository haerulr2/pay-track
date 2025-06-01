"use client";

import { Bell, HelpCircle, LayoutGrid, Plus, Search, Settings } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Topbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-40 z-50 mx-auto hidden h-16 max-w-7xl bg-white md:block dark:bg-zinc-900">
      <div className="flex h-full items-center justify-between">
        {/* Search */}
        <div className="max-w-lg flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              className={cn(
                "w-full rounded-lg bg-zinc-100 py-2 pl-10 pr-4 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300",
                "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" iconSize="md">
            <LayoutGrid />
          </Button>
          <Button variant="ghost" size="icon" iconSize="md">
            <HelpCircle />
          </Button>
          <Button variant="ghost" size="icon" iconSize="md">
            <Bell />
          </Button>
          <Button variant="ghost" size="icon" iconSize="md">
            <Settings />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" iconSize="md">
                <Plus className="rounded-full bg-blue-500 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Invoice</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuItem>Payment Link</DropdownMenuItem>
              <DropdownMenuItem>Payment</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
