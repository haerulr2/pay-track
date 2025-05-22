'use client';

import { Bell, HelpCircle, LayoutGrid, Plus, Search, Settings } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenu } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export default function Topbar() {
  return (
    <header className="fixed top-0 right-0 left-64 z-40 h-16 bg-white dark:bg-zinc-900 hidden md:block max-w-7xl mx-auto z-50">
      <div className="flex items-center justify-between h-full">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              className={cn(
                "w-full pl-10 pr-4 py-2 text-sm rounded-lg text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <Plus className="text-white bg-blue-500 rounded-full" />
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
