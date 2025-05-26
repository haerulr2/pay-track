export interface FilterTabItem {
  id: string;
  label: string;
  count: number;
  href?: string;
  isActive?: boolean;
}

export interface FilterTabsConfig {
  items: FilterTabItem[];
}

export const filterTabsMenus: Record<string, FilterTabsConfig> = {
  transactions: {
    items: [
      {
        id: "all",
        label: "All",
        count: 3,
      },
      {
        id: "succeeded",
        label: "Succeeded",
        count: 2
      },
      {
        id: "refunded",
        label: "Refunded",
        count: 0
      },
      {
        id: "disputed",
        label: "Disputed",
        count: 0
      },
      {
        id: "failed",
        label: "Failed",
        count: 1
      },
      {
        id: "uncaptured",
        label: "Uncaptured",
        count: 0
      }
    ]
  }
}; 