# Pay-Track Project Rules & Guidelines

> **Project**: Pay-Track Payment Tracking Application
> **Version**: 1.0
> **Last Updated**: December 2024
> **Scope**: Professional Next.js development standards for consistency, maintainability, and scalability
> **Location**: `.cursor/rules/pay-track-project-rules.md`

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Code Style & Formatting](#code-style--formatting)
3. [TypeScript Guidelines](#typescript-guidelines)
4. [Component Architecture](#component-architecture)
5. [File Naming Conventions](#file-naming-conventions)
6. [Import Organization](#import-organization)
7. [Performance Best Practices](#performance-best-practices)
8. [Error Handling](#error-handling)
9. [Security Guidelines](#security-guidelines)
10. [Documentation Standards](#documentation-standards)
11. [Git Workflow](#git-workflow)
12. [Testing Requirements](#testing-requirements)

---

## 🎯 Project Overview

**Pay-Track** is a professional payment tracking application built with Next.js 15, TypeScript, and Tailwind CSS. This document establishes coding standards and best practices specific to this project to ensure consistency, maintainability, and scalability.

---

## 🏗️ Project Structure

### Directory Organization

```
pay-track/
├── .cursor/                   # Cursor IDE configuration
│   └── rules/                # Project-specific rules and guidelines
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (dashboard)/     # Route groups for dashboard layout
│   │   ├── api/             # API routes
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (shadcn/ui)
│   │   ├── forms/           # Form-specific components
│   │   ├── layout/          # Layout components (Header, Footer, etc.)
│   │   └── features/        # Feature-specific components
│   ├── lib/                 # Utility functions and configurations
│   │   ├── utils.ts         # General utilities
│   │   ├── validations.ts   # Zod schemas
│   │   ├── constants.ts     # App constants
│   │   └── hooks/           # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # Additional CSS files
│   └── __tests__/           # Test files
├── public/                   # Static assets
├── .vscode/                 # VSCode workspace settings
└── node_modules/            # Dependencies
```

### Rules

- **Keep related files close**: Group components by feature/domain
- **Single responsibility**: Each directory should have a clear purpose
- **Avoid deep nesting**: Maximum 3 levels deep for better navigation
- **Use route groups**: Organize app router with `(groupName)` for cleaner URLs
- **Follow the established structure**: Don't create new top-level directories without team consensus

---

## 🎨 Code Style & Formatting

### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### ESLint Rules

- **Always use ESLint**: Follow `next/core-web-vitals` and `next/typescript`
- **No unused variables**: Clean up imports and variables
- **Consistent formatting**: Use Prettier for automatic formatting
- **React hooks rules**: Follow hooks linting rules strictly

### Code Style Rules

- **Use double quotes** for strings
- **Use semicolons** at the end of statements
- **Use trailing commas** in objects and arrays
- **2 spaces** for indentation
- **100 characters** max line length
- **Consistent naming**: Use descriptive, meaningful names

---

## 📘 TypeScript Guidelines

### Type Definitions

```typescript
// ✅ Good: Explicit interface definitions
interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ✅ Good: Use specific types over 'any'
type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

// ❌ Bad: Using 'any'
const handleSubmit = (data: any) => { ... }
```

### Rules

- **Strict mode enabled**: Always use strict TypeScript
- **No implicit any**: Explicitly type all parameters and returns
- **Use interfaces** for object shapes, **types** for unions/primitives
- **Prefer type inference** where TypeScript can determine types
- **Use generics** for reusable components and functions
- **Organize types**: Keep types in dedicated `types/` directory for complex ones

### Component Props

```typescript
// ✅ Good: Well-typed component props extending BaseComponentProps
interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className,
  ...props
}: ButtonProps) {
  // Implementation
}
```

---

## 🧩 Component Architecture

### Component Structure (Follow `_ComponentTemplate.tsx.example`)

```typescript
"use client"; // Only when necessary (client components)

import React from "react";
import { type ComponentProps } from "react";
// ... other imports

interface ComponentNameProps extends BaseComponentProps {
  // Props definition
}

function ComponentName({ prop1, prop2, className, children, ...props }: ComponentNameProps) {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Derived state
  const computedValue = useMemo(() => {
    // computation
  }, [dependencies]);

  // 3. Event handlers
  const handleClick = useCallback(() => {
    // handler logic
  }, [dependencies]);

  // 4. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);

  // 5. Early returns
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorBoundary error={error} />;

  // 6. Main render
  return (
    <div className={cn("base-styles", className)}>
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### Component Rules

- **Use function declarations** over arrow functions for components
- **Single responsibility**: One component per file
- **Composition over inheritance**: Prefer composition patterns
- **Use React.memo** only when performance testing shows benefits
- **Keep components small**: Max 150 lines, split if larger
- **Use compound components** for complex UI patterns
- **Always extend BaseComponentProps** for consistency

### Custom Hooks

```typescript
// ✅ Good: Custom hook with proper naming and return
function useApiData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch logic
  }, [url]);

  return { data, loading, error, refetch };
}
```

---

## 📁 File Naming Conventions

### Files

- **Components**: `PascalCase.tsx` (e.g., `ApiKeyCard.tsx`, `UserProfile.tsx`)
- **Pages**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Utilities**: `camelCase.ts` (e.g., `formatCurrency.ts`)
- **Constants**: `camelCase.ts` (e.g., `constants.ts`)
- **Types**: `index.ts` in `types/` directory
- **Hooks**: `use[HookName].ts` (e.g., `useLocalStorage.ts`)

### Variables & Functions

- **Variables**: `camelCase` (e.g., `userName`, `isLoading`)
- **Functions**: `camelCase` (e.g., `handleSubmit`, `fetchUserData`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_ENDPOINTS`, `TIME_CONSTANTS`)
- **Components**: `PascalCase` (e.g., `ApiKeyCard`, `UserProfile`)

### CSS Classes

- **Use Tailwind utilities** as primary styling method
- **Custom classes**: `kebab-case` (e.g., `user-profile`, `data-table`)
- **Use `cn()` utility** for conditional classes

---

## 📦 Import Organization

### Order (Automatically enforced by VSCode settings)

```typescript
// 1. React and Next.js
import React from "react";
import { NextPage } from "next";
import Link from "next/link";

// 2. External libraries
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// 3. Internal utilities and hooks
import { cn } from "@/lib/utils";
import { TIME_CONSTANTS } from "@/lib/constants";

// 4. Internal components
import { Button } from "@/components/ui/button";
import { ApiKeyCard } from "@/components/ApiKeyCard";

// 5. Types
import type { User, BaseComponentProps } from "@/types";

// 6. Relative imports (avoid when possible)
import "./ComponentName.css";
```

### Rules

- **Use absolute imports** with `@/` alias for `src/`
- **Group imports** by category with blank lines
- **Sort alphabetically** within each group
- **Import types** with `type` keyword when possible
- **No unused imports**: Remove automatically with linting

---

## ⚡ Performance Best Practices

### React Performance

- **Use `React.memo`** judiciously, only when profiling shows benefits
- **Optimize re-renders** with `useCallback` and `useMemo` for expensive computations
- **Code splitting** with `next/dynamic` for large components
- **Lazy load images** using Next.js `Image` component

### Next.js Optimizations

```typescript
// ✅ Dynamic imports for client-heavy components
const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

// ✅ Image optimization
import Image from "next/image";

<Image
  src="/payment-hero.jpg"
  alt="Payment tracking dashboard"
  width={800}
  height={600}
  priority={true} // Above the fold
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle Optimization

- **Tree shaking**: Import only what you need from libraries
- **Bundle analysis**: Use `npm run build` to check bundle size
- **External scripts**: Use `next/script` for third-party scripts

---

## 🚨 Error Handling

### Error Boundaries

```typescript
// app/error.tsx
"use client";

import { useEffect } from "react";
import { ERROR_MESSAGES } from "@/lib/constants";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="error-container p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">{ERROR_MESSAGES.GENERIC}</p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
```

### API Error Handling

```typescript
// Use consistent error handling with types from @/types
import type { ApiError } from "@/types";
import { ERROR_MESSAGES } from "@/lib/constants";

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message || ERROR_MESSAGES.GENERIC,
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    };
  }
  return {
    message: ERROR_MESSAGES.GENERIC,
    code: "UNKNOWN_ERROR",
    statusCode: 500,
  };
};
```

### Rules

- **Always handle errors**: No silent failures
- **User-friendly messages**: Use constants from `@/lib/constants`
- **Log errors**: Use proper logging for debugging
- **Graceful degradation**: Provide fallbacks when possible

---

## 🔒 Security Guidelines

### Environment Variables

```typescript
// ✅ Good: Proper environment variable handling
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SECRET_KEY = process.env.SECRET_KEY; // Server-side only

// Validation
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is required");
}
```

### Security Rules

- **Validate all inputs**: Use Zod or similar for validation
- **Sanitize data**: Clean user inputs before processing
- **Use HTTPS**: Always use secure connections in production
- **Environment variables**:
  - Prefix client-side vars with `NEXT_PUBLIC_`
  - Keep sensitive data server-side only
- **API Keys**: Always mask API keys in UI (see `ApiKeyCard` component)
- **Content Security Policy**: Implement proper CSP headers

---

## 📖 Documentation Standards

### Component Documentation

````typescript
/**
 * A reusable API key display component with copy functionality.
 *
 * @example
 * ```tsx
 * <ApiKeyCard
 *   publishableKey="pk_test_..."
 *   secretKey="sk_test_..."
 * />
 * ```
 */
interface ApiKeyCardProps extends BaseComponentProps {
  /** The publishable API key to display */
  publishableKey: string;
  /** The secret API key to display */
  secretKey: string;
}
````

### Rules

- **JSDoc comments** for all public functions and components
- **README files** for complex features or modules
- **Code comments** for complex business logic only
- **Type documentation**: Use TypeScript for self-documenting code
- **Examples**: Provide usage examples in documentation

---

## 🔄 Git Workflow

### Commit Messages

```
type(scope): description

feat(payments): add payment tracking dashboard
fix(api-keys): resolve copy functionality on mobile
docs(readme): update installation instructions
style(components): improve responsive design for cards
refactor(constants): organize API endpoints
test(components): add unit tests for ApiKeyCard
```

### Branch Naming

- **Features**: `feature/payment-dashboard`
- **Bug fixes**: `fix/api-key-copy-mobile`
- **Hotfixes**: `hotfix/security-patch`
- **Releases**: `release/v1.0.0`

### Rules

- **Small, focused commits**: One logical change per commit
- **Descriptive messages**: Clear, present-tense descriptions
- **No direct main commits**: Always use pull requests
- **Review required**: All code must be reviewed before merging

---

## 🧪 Testing Requirements

### Testing Strategy

```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from "@testing-library/react";
import { ApiKeyCard } from "./ApiKeyCard";

describe("ApiKeyCard", () => {
  const mockProps = {
    publishableKey: "pk_test_1234567890abcdef",
    secretKey: "sk_test_abcdef1234567890",
  };

  it("renders masked API keys", () => {
    render(<ApiKeyCard {...mockProps} />);
    expect(screen.getByText(/pk_test_123\.\.\.cdef/)).toBeInTheDocument();
    expect(screen.getByText(/sk_test_abc\.\.\.7890/)).toBeInTheDocument();
  });

  it("copies key to clipboard when clicked", async () => {
    const mockWriteText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText: mockWriteText } });

    render(<ApiKeyCard {...mockProps} />);
    fireEvent.click(screen.getByText(/pk_test_123\.\.\.cdef/));

    expect(mockWriteText).toHaveBeenCalledWith(mockProps.publishableKey);
  });
});
```

### Testing Rules

- **Test user behavior**: Focus on what users do, not implementation
- **Accessible queries**: Use Testing Library's accessibility-focused queries
- **Mock external dependencies**: Mock API calls and third-party services
- **Coverage targets**: Aim for 80%+ coverage on critical paths
- **Test file naming**: `ComponentName.test.tsx`

---

## 🔧 Tools & Automation

### Required Tools (Already configured)

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting with Tailwind CSS plugin
- **TypeScript**: Type checking
- **VSCode**: Workspace settings for consistency

### Available Scripts

```bash
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run check-all    # Run all checks (type, lint, format)
npm run clean        # Clean build cache
```

### Automation

- **Pre-commit hooks**: Use `npm run check-all` before commits
- **VSCode settings**: Auto-format on save, organize imports
- **Bundle analysis**: Monitor bundle size changes

---

## 📊 Performance Monitoring

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Monitoring Tools

- **Next.js built-in analytics**: Monitor performance metrics
- **Lighthouse**: Regular performance audits
- **Bundle size**: Monitor with each build

---

## 🎯 Code Review Checklist

### Before Submitting PR

- [ ] Code follows Pay-Track style guidelines
- [ ] All tests pass (`npm run check-all`)
- [ ] TypeScript compiles without errors
- [ ] No console.log statements in production code
- [ ] Performance implications considered
- [ ] Accessibility standards met (ARIA attributes, keyboard navigation)
- [ ] Security considerations addressed (API key masking, input validation)

### Review Criteria

- [ ] Code readability and maintainability
- [ ] Proper error handling with constants
- [ ] Performance optimizations applied
- [ ] Component structure follows template
- [ ] Documentation updated if needed
- [ ] No breaking changes without migration path

---

## 🚀 Deployment Guidelines

### Production Checklist

- [ ] Environment variables configured
- [ ] Error boundaries implemented
- [ ] Performance optimized (images, bundles)
- [ ] Security headers configured
- [ ] API keys properly masked in UI
- [ ] Bundle size within reasonable limits
- [ ] Accessibility tested across devices
- [ ] Cross-browser compatibility verified

---

## 🔄 Project-Specific Patterns

### API Key Management

- Always use the `ApiKeyCard` component for displaying API keys
- Mask keys using the established pattern: `key.slice(0, 12) + "..." + key.slice(-4)`
- Implement copy-to-clipboard with user feedback

### Constants Usage

- Import constants from `@/lib/constants`
- Use `TIME_CONSTANTS` for timeouts and delays
- Use `ERROR_MESSAGES` and `SUCCESS_MESSAGES` for user feedback

### Component Extension

- Always extend `BaseComponentProps` for new components
- Use the `cn()` utility for conditional CSS classes
- Follow the component template structure

---

## 📝 Notes

- **Review regularly**: Update these rules as Pay-Track evolves
- **Team consensus**: All team members should agree on rule changes
- **Tooling enforcement**: Use automated tools to enforce rules
- **Documentation**: Keep this document updated with new decisions
- **Location**: This file should remain in `.cursor/rules/` for project-specific access

---

## 🔗 Quick Links

- **Component Template**: `src/components/_ComponentTemplate.tsx.example`
- **Type Definitions**: `src/types/index.ts`
- **Constants**: `src/lib/constants.ts`
- **VSCode Settings**: `.vscode/settings.json`
- **Prettier Config**: `.prettierrc`

---

_Last updated: December 2024_
_Version: 1.0_
_Project: Pay-Track Payment Tracking Application_
