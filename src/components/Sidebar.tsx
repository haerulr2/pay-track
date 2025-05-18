import { cn } from "@/lib/utils";
import { navItems, productItems, shortCutItems } from "@/lib/sidebar-items";
import { Store } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center text-xl font-semibold">
            <Store className="w-6 h-6 mr-2" />
            PayTrack
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-1 text-sm rounded-lg mb-0",
                "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                "transition-colors duration-150 ease-in-out"
              )}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Shortcuts */}
        <nav className="px-4 py-6 space-y-1">
          <h3 className="text-xs font-medium text-gray-500 px-4">Shortcuts</h3>
          {shortCutItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center px-4 py-1 text-sm rounded-lg mb-0",
              "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              "transition-colors duration-150 ease-in-out"
            )}>
              <item.icon className="w-4 h-4 mr-3" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Product */}
        <nav className="px-4 py-6 space-y-1">
          {productItems.map((item) => (
            <div key={item.title} className={cn(
              "flex items-center px-4 py-1 text-sm rounded-lg mb-0",
              "cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              "transition-colors duration-150 ease-in-out"
            )}>
              <item.icon className="w-4 h-4 mr-3" />
              {item.title}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}