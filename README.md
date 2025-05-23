# PayTrack – Stripe-Inspired Dashboard Clone

A modern, responsive, and animated dashboard clone inspired by Stripe, built with **Next.js App Router**, **TailwindCSS**, and **Recharts**.

This project is designed to simulate a production-grade dashboard for managing transactions, analytics, and user data. Built as a portfolio piece to demonstrate real-world frontend architecture.

![PayTrack Preview](https://github.com/user-attachments/assets/af5f6516-9f59-4c2b-9bf0-3211419d6e3c)


---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + Dark Mode (`next-themes`)
- **Charting**: Recharts
- **Animation**: Framer Motion
- **State & Logic**: React hooks
- **Deployment**: Vercel

---

## 📂 Folder Structure
/app
  /dashboard → Overview (metrics + chart)
  /transactions → (On Progress)
  /settings → (Upcoming)
layout.tsx → Global layout wrapper

/components
  MetricCard.tsx
  Chart.tsx
  TransactionsTable.tsx
  ThemeToggle.tsx
  Reveal.tsx

/lib
  dummy-stats.ts
  dummy-transactions.ts
