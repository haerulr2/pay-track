'use client';

import { Bell, HelpCircle, LayoutGrid, Plus, Search, Settings } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenu } from "./ui/dropdown-menu";

export default function Topbar() {
  return (
    <header className="fixed top-0 right-0 left-64 z-40 h-16 bg-white hidden md:block max-w-7xl mx-auto z-50">
      <div className="flex items-center justify-between h-full">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Plus className="w-5 h-5 text-white bg-blue-500 rounded-full" />
              </button>
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
