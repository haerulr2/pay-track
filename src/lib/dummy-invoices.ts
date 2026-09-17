export type InvoiceStatus = "Paid" | "Open" | "Past Due" | "Draft";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  customer: string;
  customerEmail: string;
  customerCompany: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  items: InvoiceLineItem[];
  memo?: string;
}

export const dummyInvoices: Invoice[] = [
  {
    id: "INV-2026-001",
    customer: "Elena Rostova",
    customerEmail: "elena@acmecorp.com",
    customerCompany: "Acme Corp",
    status: "Paid",
    issueDate: "May 10, 2026",
    dueDate: "May 24, 2026",
    paidDate: "May 21, 2026",
    subtotal: 12500.0,
    tax: 1125.0,
    total: 13625.0,
    currency: "USD",
    memo: "Quarterly Enterprise SaaS platform license & premium support SLA.",
    items: [
      {
        id: "item-1",
        description: "Enterprise Platform License (100 seats)",
        quantity: 100,
        unitPrice: 100.0,
        amount: 10000.0,
      },
      {
        id: "item-2",
        description: "Dedicated 24/7 SLA & TAM Support",
        quantity: 1,
        unitPrice: 2500.0,
        amount: 2500.0,
      },
    ],
  },
  {
    id: "INV-2026-002",
    customer: "Marcus Vance",
    customerEmail: "finance@linear.app",
    customerCompany: "Linear Technologies",
    status: "Open",
    issueDate: "May 15, 2026",
    dueDate: "May 30, 2026",
    subtotal: 6800.0,
    tax: 612.0,
    total: 7412.0,
    currency: "USD",
    memo: "API Integration pipelines and webhook streaming endpoints.",
    items: [
      {
        id: "item-1",
        description: "High-Throughput Webhook Cluster",
        quantity: 4,
        unitPrice: 1200.0,
        amount: 4800.0,
      },
      {
        id: "item-2",
        description: "Data Export Sync Engine",
        quantity: 1,
        unitPrice: 2000.0,
        amount: 2000.0,
      },
    ],
  },
  {
    id: "INV-2026-003",
    customer: "Sarah Jenkins",
    customerEmail: "accounting@supabase.io",
    customerCompany: "Supabase Inc",
    status: "Past Due",
    issueDate: "Apr 28, 2026",
    dueDate: "May 12, 2026",
    subtotal: 4200.0,
    tax: 0.0,
    total: 4200.0,
    currency: "USD",
    memo: "Secondary database replication nodes & compute extensions.",
    items: [
      {
        id: "item-1",
        description: "Postgres Read Replicas (x3 Nodes)",
        quantity: 3,
        unitPrice: 1400.0,
        amount: 4200.0,
      },
    ],
  },
  {
    id: "INV-2026-004",
    customer: "Devon Chen",
    customerEmail: "billing@vercel.com",
    customerCompany: "Vercel Enterprise",
    status: "Paid",
    issueDate: "May 02, 2026",
    dueDate: "May 16, 2026",
    paidDate: "May 14, 2026",
    subtotal: 18400.0,
    tax: 1656.0,
    total: 20056.0,
    currency: "USD",
    memo: "Global Edge Network bandwidth allocation & DDoS protection tier.",
    items: [
      {
        id: "item-1",
        description: "Edge Cache Bandwidth Allocation (TB)",
        quantity: 20,
        unitPrice: 700.0,
        amount: 14000.0,
      },
      {
        id: "item-2",
        description: "Advanced WAF Custom Rulesets",
        quantity: 2,
        unitPrice: 2200.0,
        amount: 4400.0,
      },
    ],
  },
  {
    id: "INV-2026-005",
    customer: "Chloe Martin",
    customerEmail: "finance@figma.com",
    customerCompany: "Figma Design Inc",
    status: "Open",
    issueDate: "May 18, 2026",
    dueDate: "Jun 01, 2026",
    subtotal: 9500.0,
    tax: 855.0,
    total: 10355.0,
    currency: "USD",
    memo: "Asset rendering compute instances & storage pipeline.",
    items: [
      {
        id: "item-1",
        description: "Vector Rendering Compute Nodes",
        quantity: 5,
        unitPrice: 1500.0,
        amount: 7500.0,
      },
      {
        id: "item-2",
        description: "Real-time Collaboration Bridge",
        quantity: 1,
        unitPrice: 2000.0,
        amount: 2000.0,
      },
    ],
  },
  {
    id: "INV-2026-006",
    customer: "Arjun Nair",
    customerEmail: "payments@snowflake.com",
    customerCompany: "Snowflake Data",
    status: "Draft",
    issueDate: "May 22, 2026",
    dueDate: "Jun 06, 2026",
    subtotal: 15000.0,
    tax: 1350.0,
    total: 16350.0,
    currency: "USD",
    memo: "Data warehouse connector & automated staging transforms.",
    items: [
      {
        id: "item-1",
        description: "Snowflake High-Throughput Warehouse Pipe",
        quantity: 1,
        unitPrice: 15000.0,
        amount: 15000.0,
      },
    ],
  },
  {
    id: "INV-2026-007",
    customer: "Liam O'Connor",
    customerEmail: "ops@stripe.com",
    customerCompany: "Stripe Atlas",
    status: "Paid",
    issueDate: "May 05, 2026",
    dueDate: "May 19, 2026",
    paidDate: "May 18, 2026",
    subtotal: 8200.0,
    tax: 738.0,
    total: 8938.0,
    currency: "USD",
    memo: "Incorporation workflow verification webhooks & registry feeds.",
    items: [
      {
        id: "item-1",
        description: "Corporate Compliance Validation API",
        quantity: 1,
        unitPrice: 8200.0,
        amount: 8200.0,
      },
    ],
  },
  {
    id: "INV-2026-008",
    customer: "Aria Takahashi",
    customerEmail: "aria@openai.com",
    customerCompany: "OpenAI Labs",
    status: "Open",
    issueDate: "May 19, 2026",
    dueDate: "Jun 02, 2026",
    subtotal: 24500.0,
    tax: 2205.0,
    total: 26705.0,
    currency: "USD",
    memo: "Fine-tuning compute instances and cluster interconnect bandwidth.",
    items: [
      {
        id: "item-1",
        description: "Inference Proxy Load Balancers (HA)",
        quantity: 7,
        unitPrice: 2500.0,
        amount: 17500.0,
      },
      {
        id: "item-2",
        description: "Latency Monitoring & Logging Ingestion",
        quantity: 1,
        unitPrice: 7000.0,
        amount: 7000.0,
      },
    ],
  },
];
