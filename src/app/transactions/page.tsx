"use client";

import TransactionsTable from "@/components/transactions/TransactionsTable";
import TabsMenu from "@/components/TabsMenu";
import FilterTabs from "@/components/transactions/FilterTabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { tabMenus } from "@/lib/tab-menus";
import { TabMenuItem } from "@/lib/tab-menus";
import { FilterTabItem, filterTabsMenus } from "@/lib/filterTabs-menu";

export default function TransactionsPage() {
  const handleFilterTabClick = (filterItem: FilterTabItem) => {
    console.log("Filter tab clicked:", filterItem);
    // Handle filter logic here
  };

  const renderTabContent = (item: TabMenuItem) => {
    switch (item.value) {
      case "Payments":
        return (
          <>
            {filterTabsMenus.transactions && (
              <FilterTabs
                items={filterTabsMenus.transactions.items}
                onTabClick={handleFilterTabClick}
              />
            )}
            <TransactionsTable />
          </>
        );
      case "Collected fees":
        return (
          <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="text-lg font-medium mb-1">No collected fees yet</h3>
            <p>Fees collected from your payments will appear here.</p>
          </div>
        );
      case "Transfers":
        return (
          <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="text-lg font-medium mb-1">No transfers yet</h3>
            <p>Your transfers to connected bank accounts will appear here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 max-w-7xl mx-auto px-1 py-8 space-y-4">
      <div className="flex justify-between items-center mb-0">
        <h1 className="text-2xl font-bold">
          Transactions
        </h1>

        <div className="flex items-center space-x-2">
          <Button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4" />
            <span>Create payment</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
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

      <TabsMenu
        items={tabMenus.transactions.items}
        defaultValue={tabMenus.transactions.defaultValue}
        renderTabContent={renderTabContent}
      />
    </div>
  );
}
