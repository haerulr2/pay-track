"use client";

import TabsMenu from "@/components/TabsMenu";
import FilterTabs from "@/components/transactions/FilterTabs";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import { Button } from "@/components/ui/button";
import { FilterTabItem, filterTabsMenus } from "@/lib/filterTabs-menu";
import { TabMenuItem, tabMenus } from "@/lib/tab-menus";
import { Plus } from "lucide-react";

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
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4"
            >
              <path
                d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 7L12 13L21 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="mb-1 text-lg font-medium">No collected fees yet</h3>
            <p>Fees collected from your payments will appear here.</p>
          </div>
        );
      case "Transfers":
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="mb-1 text-lg font-medium">No transfers yet</h3>
            <p>Your transfers to connected bank accounts will appear here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 bg-white px-1 py-8 dark:bg-zinc-900">
      <div className="mb-0 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>

        <div className="flex items-center space-x-2">
          <Button className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
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
              <path
                d="M8 12L12 8L8 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12L8 8L4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
