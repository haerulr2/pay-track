// Application constants for Pay-Track

// API Configuration
export const API_ENDPOINTS = {
  USERS: "/api/users",
  AUTH: "/api/auth",
  PAYMENTS: "/api/payments",
  ANALYTICS: "/api/analytics",
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "Pay-Track",
  VERSION: "1.0.0",
  DESCRIPTION: "Professional payment tracking application",
} as const;

// UI Constants
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_EMAIL_LENGTH: 254,
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  RETRY_DELAY: 1000,
} as const;

// Status Types
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE: "Changes saved successfully!",
  DELETE: "Item deleted successfully!",
  CREATE: "Item created successfully!",
  UPDATE: "Item updated successfully!",
} as const;
