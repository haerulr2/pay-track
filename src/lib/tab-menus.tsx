export interface TabMenuItem {
  id: string;
  label: string;
  value: string;
  content?: React.ReactNode;
}

export interface TabMenuConfig {
  defaultValue: string;
  items: TabMenuItem[];
}

export const tabMenus: Record<string, TabMenuConfig> = {
  transactions: {
    defaultValue: "Payments",
    items: [
      {
        id: "payments",
        label: "Payments",
        value: "Payments",
      },
      {
        id: "collected-fees",
        label: "Collected fees",
        value: "Collected fees",
      },
      {
        id: "transfers",
        label: "Transfers",
        value: "Transfers",
      },
    ],
  },
  // // Add more page configurations as needed
  // dashboard: {
  //   defaultValue: "Overview",
  //   items: [
  //     {
  //       id: "overview",
  //       label: "Overview",
  //       value: "Overview"
  //     },
  //     {
  //       id: "analytics",
  //       label: "Analytics",
  //       value: "Analytics"
  //     },
  //     {
  //       id: "reports",
  //       label: "Reports",
  //       value: "Reports"
  //     }
  //   ]
  // }
};
