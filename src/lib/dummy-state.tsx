import type { CashFlowSeries, Metric } from "@/types";
import { transactions } from "./dummy-transactions";

export { transactions };

export const metrics: Metric[] = [
  {
    title: "Available Balance",
    value: "$128,420.50",
    change: "+8.4%",
    subtitle: "Next payout: Tomorrow at 09:00 AM",
    isPositive: true,
  },
  {
    title: "Gross Volume",
    value: "$342,850.00",
    change: "+14.8%",
    subtitle: "vs last month",
    isPositive: true,
  },
  {
    title: "Outflows & Fees",
    value: "$48,120.25",
    change: "-2.1%",
    subtitle: "lower than avg",
    isPositive: true,
  },
  {
    title: "Net Cash Flow",
    value: "$294,729.75",
    change: "+18.2%",
    subtitle: "Runway: 14.2 mos",
    isPositive: true,
  },
];

export const cashFlowSeries: CashFlowSeries = {
  "7D": [
    { name: "Mon", inflow: 12400, outflow: 2100, net: 10300 },
    { name: "Tue", inflow: 18200, outflow: 3400, net: 14800 },
    { name: "Wed", inflow: 14500, outflow: 1800, net: 12700 },
    { name: "Thu", inflow: 22100, outflow: 4200, net: 17900 },
    { name: "Fri", inflow: 28400, outflow: 5100, net: 23300 },
    { name: "Sat", inflow: 8900, outflow: 900, net: 8000 },
    { name: "Sun", inflow: 11200, outflow: 1400, net: 9800 },
  ],
  "30D": [
    { name: "May 1", inflow: 42000, outflow: 8500, net: 33500 },
    { name: "May 6", inflow: 58000, outflow: 11200, net: 46800 },
    { name: "May 11", inflow: 63000, outflow: 9800, net: 53200 },
    { name: "May 16", inflow: 71000, outflow: 14500, net: 56500 },
    { name: "May 21", inflow: 84000, outflow: 12300, net: 71700 },
    { name: "May 26", inflow: 92000, outflow: 15400, net: 76600 },
    { name: "May 31", inflow: 104000, outflow: 18100, net: 85900 },
  ],
  "90D": [
    { name: "Mar 1", inflow: 110000, outflow: 22000, net: 88000 },
    { name: "Mar 15", inflow: 125000, outflow: 24500, net: 100500 },
    { name: "Apr 1", inflow: 142000, outflow: 28000, net: 114000 },
    { name: "Apr 15", inflow: 168000, outflow: 31200, net: 136800 },
    { name: "May 1", inflow: 195000, outflow: 34000, net: 161000 },
    { name: "May 15", inflow: 230000, outflow: 39500, net: 190500 },
  ],
  YTD: [
    { name: "Jan", inflow: 185000, outflow: 32000, net: 153000 },
    { name: "Feb", inflow: 210000, outflow: 36500, net: 173500 },
    { name: "Mar", inflow: 248000, outflow: 41200, net: 206800 },
    { name: "Apr", inflow: 295000, outflow: 45800, net: 249200 },
    { name: "May", inflow: 342850, outflow: 48120, net: 294730 },
  ],
};

export const cashFlowChartData = cashFlowSeries;
