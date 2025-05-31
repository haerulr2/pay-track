# Pay-Track Project Rules & Guidelines

> **Version**: 1.0  
> **Last Updated**: December 2024  
> **Scope**: Professional Next.js development standards for consistency, maintainability, and scalability

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

## 🏗️ Project Structure

### Directory Organization
```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Route groups for layout organization
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── forms/            # Form-specific components
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions and configurations
│   ├── utils.ts          # General utilities
│   ├── validations.ts    # Zod schemas
│   ├── constants.ts      # App constants
│   └── hooks/            # Custom React hooks
├── types/                # TypeScript type definitions
├── styles/               # Additional CSS files
└── __tests__/            # Test files
```

### Rules
- **Keep related files close**: Group components by feature/domain
- **Single responsibility**: Each directory should have a clear purpose
- **Avoid deep nesting**: Maximum 3 levels deep for better navigation
- **Use route groups**: Organize app router with `(groupName)` for cleaner URLs

---

## 🎨 Code Style & Formatting

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
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
// ✅ Good: Well-typed component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = "primary", 
  size = "md", 
  isLoading, 
  children, 
  ...props 
}) => {
  // Implementation
};
```

---

## 🧩 Component Architecture

### Component Structure
```typescript
"use client"; // Only when necessary (client components)

import React from "react";
import { type ComponentProps } from "react";
// ... other imports

interface ComponentNameProps {
  // Props definition
}

function ComponentName({ prop1, prop2, ...props }: ComponentNameProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Derived state
  const computedValue = useMemo(() => {
    // computation
  }, [dependencies]);
  
  // Event handlers
  const handleClick = useCallback(() => {
    // handler logic
  }, [dependencies]);
  
  // Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);
  
  // Early returns
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorBoundary error={error} />;
  
  // Main render
  return (
    <div>
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
- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Pages**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Utilities**: `camelCase.ts` (e.g., `formatCurrency.ts`)
- **Constants**: `SCREAMING_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)
- **Types**: `camelCase.types.ts` (e.g., `user.types.ts`)

### Variables & Functions
- **Variables**: `camelCase` (e.g., `userName`, `isLoading`)
- **Functions**: `camelCase` (e.g., `handleSubmit`, `fetchUserData`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`)
- **Components**: `PascalCase` (e.g., `UserProfile`, `DataTable`)

### CSS Classes
- **Use Tailwind utilities** as primary styling method
- **Custom classes**: `kebab-case` (e.g., `user-profile`, `data-table`)
- **BEM methodology** for complex custom CSS when needed

---

## 📦 Import Organization

### Order
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
import { useLocalStorage } from "@/lib/hooks";

// 4. Internal components
import { Button } from "@/components/ui/button";
import { UserCard } from "@/components/features/user";

// 5. Types
import type { User } from "@/types/user";

// 6. Relative imports
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
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority={true} // Above the fold
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle Optimization
- **Tree shaking**: Import only what you need from libraries
- **Bundle analysis**: Regularly check bundle size with `@next/bundle-analyzer`
- **External scripts**: Use `next/script` for third-party scripts

---

## 🚨 Error Handling

### Error Boundaries
```typescript
// app/error.tsx
"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### API Error Handling
```typescript
// Consistent API error handling
type ApiError = {
  message: string;
  code: string;
  statusCode: number;
};

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    };
  }
  // Handle other error types
};
```

### Rules
- **Always handle errors**: No silent failures
- **User-friendly messages**: Don't expose technical details to users
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
- **Use HTTPS**: Always use secure connections
- **Environment variables**: 
  - Prefix client-side vars with `NEXT_PUBLIC_`
  - Keep sensitive data server-side only
- **Content Security Policy**: Implement proper CSP headers
- **CSRF protection**: Use proper authentication patterns

---

## 📖 Documentation Standards

### Component Documentation
```typescript
/**
 * A reusable button component with multiple variants and sizes.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** The visual style variant of the button */
  variant?: "primary" | "secondary" | "outline";
  /** The size of the button */
  size?: "sm" | "md" | "lg";
  /** Whether the button is in a loading state */
  isLoading?: boolean;
}
```

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

feat(auth): add user authentication with JWT
fix(ui): resolve button spacing issue on mobile
docs(readme): update installation instructions
style(header): improve responsive navigation
refactor(utils): simplify date formatting functions
test(api): add unit tests for user endpoints
```

### Branch Naming
- **Features**: `feature/user-authentication`
- **Bug fixes**: `fix/mobile-navigation-issue`
- **Hotfixes**: `hotfix/critical-security-patch`
- **Releases**: `release/v1.2.0`

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
import { Button } from "./Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
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

### Required Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files only

### Automation
- **Pre-commit hooks**: Lint, format, and type-check
- **CI/CD pipeline**: Automated testing and deployment
- **Bundle analysis**: Regular bundle size monitoring
- **Performance monitoring**: Track Core Web Vitals

---

## 📊 Performance Monitoring

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Monitoring Tools
- **Next.js Analytics**: Built-in performance monitoring
- **Lighthouse**: Regular performance audits
- **Bundle Analyzer**: Monitor bundle size changes

---

## 🎯 Code Review Checklist

### Before Submitting PR
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] No console.log statements in production code
- [ ] Performance implications considered
- [ ] Accessibility standards met
- [ ] Security considerations addressed

### Review Criteria
- [ ] Code readability and maintainability
- [ ] Proper error handling
- [ ] Performance optimizations
- [ ] Test coverage adequate
- [ ] Documentation updated
- [ ] No breaking changes without migration path

---

## 🚀 Deployment Guidelines

### Production Checklist
- [ ] Environment variables configured
- [ ] Error boundaries implemented
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Analytics and monitoring setup
- [ ] Bundle size within limits
- [ ] Accessibility tested
- [ ] Cross-browser compatibility verified

---

## 📝 Notes

- **Review regularly**: Update these rules as the project evolves
- **Team consensus**: All team members should agree on rule changes
- **Tooling enforcement**: Use automated tools to enforce rules
- **Documentation**: Keep this document updated with new decisions

---

*Last updated: December 2024*
*Version: 1.0* 