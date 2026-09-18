# Technical Design: Payment Analytics & Performance Dashboard

- **Author**: Antigravity
- **Date**: 2026-09-18
- **Status**: Proposed
- **Route**: `/analytics`

---

## 1. Executive Summary & Goals
The `/analytics` route currently returns a 404 despite having an entry in the main navigation sidebar. The goal of this feature is to build a fintech-grade Payment Analytics & Performance dashboard that provides executive visibility into:
1. **Processing Volume & Inflow Trends**: Gross transaction volume, processing fees, and net settlement over dynamic timeframes (`7D`, `30D`, `90D`, `YTD`).
2. **Key Financial & Operational KPIs**: Gross Volume, Net Settlement, Authorization Success Rate (%), and Dispute/Refund Ratio (%).
3. **Payment Method Distribution**: Relative breakdown across Credit Cards (Visa, Mastercard, Amex), ACH Direct Debit, Wire Transfers, and Digital Wallets (Apple Pay, Google Pay).
4. **Payment Health & Decline Breakdown**: Categorized payment failure reasons (Insufficient Funds, Expired Card, Do Not Honor, Suspected Fraud) with recommended merchant mitigations.
5. **Data Portability**: Instant CSV export of the active analytics snapshot for accounting and audit reconciliation.

---

## 2. Architecture & File Structure

We follow a modular component architecture:

```
src/
├── app/
│   └── analytics/
│       └── page.tsx                      # Main Analytics page holding timeframe state & coordinating widgets
├── components/
│   └── analytics/
│       ├── AnalyticsKpiCards.tsx          # 4 top metric cards with trend indicators
│       ├── VolumeTrendChart.tsx           # Multi-series AreaChart (Gross & Net volume) with custom tooltip
│       ├── PaymentMethodDistribution.tsx  # Donut/Pie chart & legend with share breakdown
│       └── PaymentHealthCard.tsx          # Auth rate meter & decline reasons analysis table
├── lib/
│   ├── analytics-data.ts                 # Timeframe dataset provider and calculation helpers
│   └── export.ts                         # Extended with exportAnalyticsToCSV()
└── types/
    └── index.ts                          # Analytics domain types and interfaces
```

---

## 3. Data Models & Type Definitions

In `src/types/index.ts`:

```typescript
export type AnalyticsTimeframe = "7D" | "30D" | "90D" | "YTD";

export interface AnalyticsKpi {
  grossVolume: number;
  grossVolumeChange: number; // e.g. +14.2
  netSettlement: number;
  netSettlementChange: number; // e.g. +13.8
  authorizationRate: number; // e.g. 97.8
  authorizationRateChange: number; // e.g. +0.4
  disputeRate: number; // e.g. 0.08
  disputeRateChange: number; // e.g. -0.02
}

export interface VolumeTrendPoint {
  date: string;
  label: string;
  gross: number;
  net: number;
  fees: number;
  count: number;
}

export interface PaymentMethodShare {
  name: string;
  methodType: "card" | "wire" | "ach" | "wallet";
  volume: number;
  percentage: number;
  count: number;
  color: string;
}

export interface DeclineReason {
  reason: string;
  category: "customer" | "card_issuer" | "fraud" | "system";
  count: number;
  percentage: number;
  suggestedAction: string;
}

export interface AnalyticsSnapshot {
  timeframe: AnalyticsTimeframe;
  kpis: AnalyticsKpi;
  volumeTrend: VolumeTrendPoint[];
  methodDistribution: PaymentMethodShare[];
  declineReasons: DeclineReason[];
}
```

---

## 4. Component Details & Interactions

### 4.1. Main Page (`src/app/analytics/page.tsx`)
- **State Management**:
  - `timeframe`: `AnalyticsTimeframe` (default `"30D"`).
  - Uses `useSyncExternalStore` hydration guard pattern to avoid any SSR mismatch.
  - Dynamically retrieves `snapshot = getAnalyticsSnapshot(timeframe)`.
- **Top Actions**:
  - Timeframe selector pill buttons (`7D`, `30D`, `90D`, `YTD`).
  - "Export Report" button triggering `exportAnalyticsToCSV(snapshot)`.
- **Layout Structure**:
  - Page header with Title & Subtitle.
  - Top: `<AnalyticsKpiCards />` (Responsive 4-column grid).
  - Middle: Responsive 3-column grid containing:
    - 2-column span: `<VolumeTrendChart />`
    - 1-column span: `<PaymentMethodDistribution />`
  - Bottom: `<PaymentHealthCard />` (Full width card with authorization rate gauge & failure breakdown).

### 4.2. Top Metric Cards (`AnalyticsKpiCards.tsx`)
- **Cards**:
  1. **Gross Processing Volume**: Total charged amount + percentage trend badge.
  2. **Net Settlement**: Settled bank deposits after deducting fees.
  3. **Authorization Success Rate**: Percentage of attempts approved by card networks/issuers + health badge (`Above Target 95%`).
  4. **Dispute & Refund Rate**: Percentage of charges disputed/refunded + threshold badge (`Within Threshold < 0.9%`).
- Standardized styling consistent with `src/components/MetricCard.tsx` and theme variables.

### 4.3. Volume Trend Chart (`VolumeTrendChart.tsx`)
- **Technology**: Recharts `AreaChart`, `ResponsiveContainer`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`.
- **Gradients**:
  - Gross Volume: Emerald gradient `#10b981`.
  - Net Volume: Blue dashed line `#3b82f6`.
- **Custom Tooltip**:
  - Dark backdrop-blur tooltip displaying Gross, Net, Gateway Fees, and Transaction Count.
- **Hydration Safety**:
  - Uses `useSyncExternalStore` snapshot to avoid SSR rehydration errors.

### 4.4. Payment Method Distribution (`PaymentMethodDistribution.tsx`)
- **Technology**: Recharts `PieChart`, `Pie`, `Cell`, `ResponsiveContainer`, `Tooltip`.
- **Visuals**:
  - Donut chart with inner radius 60px, outer radius 85px.
  - 4 slices: Cards (Visa/Mastercard/Amex - Emerald/Indigo), ACH Direct Debit (Cyan), Wire Transfer (Blue), Digital Wallets (Violet).
  - Clean legend below chart showing method name, volume in USD, percentage share, and transaction count.

### 4.5. Payment Health & Decline Analytics (`PaymentHealthCard.tsx`)
- **Authorization Meter**:
  - Segmented progress bar showing Succeeded (e.g. 97.8%), Declined (2.12%), and Disputed (0.08%).
- **Decline Breakdown Table**:
  - Responsive table showing reasons, frequency, percentage share of failures, and actionable merchant mitigation suggestions.

### 4.6. CSV Export (`src/lib/export.ts`)
- Introduces `exportAnalyticsToCSV(snapshot: AnalyticsSnapshot, filename?: string)`:
  - Formats KPI summary, daily volume trend, and payment method share into a clean downloadable CSV file.

---

## 5. Non-Functional Requirements & UX Polish
1. **Zero Layout Shift & Hydration Safe**: Recharts components are guarded with client-mounted check.
2. **Theming & Accessibility**: All colors, borders, and typography support both light and dark mode (`dark:bg-[#111827]`, `dark:border-slate-800/80`).
3. **Responsive Breakpoints**:
   - Desktop (`lg`): Full 4-card row, 2:1 chart layout.
   - Tablet (`md`): 2-card row, stacked charts.
   - Mobile: 1-card stack, scrollable table if needed.

---

## 6. Verification & Quality Gates
1. `npm run check-all`:
   - `npm run type-check`: Zero TypeScript diagnostics.
   - `npm run lint`: Zero ESLint warnings or errors.
   - `npm run format:check`: Zero formatting violations.
2. `npm run build`: Next.js production build succeeds, statically prerendering `/analytics`.
3. Browser verification: Navigating to `/analytics` highlights the sidebar item and allows switching timeframes and exporting CSV.
