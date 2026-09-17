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
  "Succeeded" | "Pending" | "Failed" | "Refunded" | "Disputed" | "Uncaptured";

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
