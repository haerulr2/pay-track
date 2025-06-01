import { Box, ChartBar, Clock4, Ellipsis, Pin, ReceiptText, Wallet } from "lucide-react";

import { ArrowRightLeft, HandCoins, Home, UserRound } from "lucide-react";

export const navItems = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Balance", href: "/balance", icon: HandCoins },
  { title: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { title: "Customers", href: "/customers", icon: UserRound },
  { title: "Product catalog", href: "/product-catalog", icon: Box },
];

export const shortCutItems = [
  { title: "Connect", href: "/connect", icon: Pin },
  { title: "Subscription", href: "/subscription", icon: Pin },
  { title: "Radar", href: "/radar", icon: Clock4 },
  { title: "Disputes", href: "/disputes", icon: Clock4 },
];

export const productItems = [
  {
    title: "Payments",
    icon: Wallet,
    children: [
      { title: "Dispute", href: "/dispute" },
      { title: "Radar", href: "/radar" },
      { title: "Payment Links", href: "/payment-links" },
      { title: "Terminal", href: "/terminal" },
    ],
  },
  {
    title: "Billing",
    icon: ReceiptText,
    children: [
      { title: "Overview", href: "/billing/overview" },
      { title: "Subscriptions", href: "/billing/subscriptions" },
      { title: "Invoices", href: "/billing/invoices" },
      { title: "Meters", href: "/billing/meters" },
      { title: "Revenue Recovery", href: "/billing/revenue-recovery" },
    ],
  },
  {
    title: "Reporting",
    icon: ChartBar,
    children: [
      { title: "Reports", href: "/reporting/reports " },
      { title: "Custom Metrics", href: "/reporting/custom-metrics" },
      { title: "Sigma", href: "/reporting/sigma" },
      { title: "Revenue Recognition", href: "/customers/revenue-recognition" },
      { title: "Data Management", href: "/customers/data-management" },
    ],
  },
  {
    title: "More",
    icon: Ellipsis,
    children: [
      { title: "Tax", href: "/tax" },
      { title: "Connect", href: "/connect" },
      { title: "Identity", href: "/identity" },
      { title: "Atlas", href: "/atlas" },
      { title: "Issuing", href: "/issuing" },
      { title: "Financial Connection", href: "/financial-connection" },
      { title: "Climate", href: "/climate" },
      { title: "Global Payouts", href: "/global-payouts" },
      { title: "Workflows", href: "/workflows" },
    ],
  },
];
