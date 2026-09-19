// Global type definitions for the Pay-Track application

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Financial & Transaction Models
export type TransactionStatus =
  | "Succeeded"
  | "Pending"
  | "Failed"
  | "Refunded"
  | "Disputed"
  | "Uncaptured";

export type PaymentMethodType = "card" | "wire" | "ach" | "wallet";

export interface TimelineStep {
  step: string;
  timestamp: string;
  done: boolean;
}

export interface Transaction {
  id: string;
  amount: string;
  grossAmount: number;
  fee: number;
  netAmount: number;
  currency: string;
  paymentMethod: string;
  paymentIcon: string;
  methodType: PaymentMethodType;
  description: string;
  customer: string;
  name?: string; // Backwards-compatible alias for customer in legacy views
  customerEmail: string;
  date: string;
  status: TransactionStatus;
  refundedDate?: string;
  declineReason?: string;
  timeline: TimelineStep[];
}

// Dashboard Financial Metrics & Charts
export interface Metric {
  title: string;
  value: string;
  change: string;
  subtitle?: string;
  isPositive?: boolean;
}

export interface CashFlowPoint {
  name: string;
  inflow: number;
  outflow: number;
  net: number;
}

export type CashFlowTimeframe = "7D" | "30D" | "90D" | "YTD";

export type CashFlowSeries = Record<CashFlowTimeframe, CashFlowPoint[]>;

// Analytics Dashboard Types
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

// Developer & API Credentials Models
export interface RestrictedApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  status: "active" | "failing" | "disabled";
  events: string[];
  secret: string;
  lastDeliveryTime: string;
  successRate: string;
}

export interface WebhookDeliveryLog {
  id: string;
  event: string;
  status: number;
  timestamp: string;
  durationMs: number;
  payload: string;
}
