import type { RestrictedApiKey, WebhookDeliveryLog, WebhookEndpoint } from "@/types";

export const defaultApiKeys = {
  live: {
    publishableKey: "pk_live_mock_demo_key_98a72b01c4ef",
    secretKey: "sk_live_mock_demo_key_98a72b01c4ef",
  },
  test: {
    publishableKey: "pk_test_mock_demo_key_98a72b01c4ef",
    secretKey: "sk_test_mock_demo_key_98a72b01c4ef",
  },
};

export const dummyRestrictedKeys: RestrictedApiKey[] = [
  {
    id: "rk_1",
    name: "Mobile POS Backend Integration",
    keyPrefix: "rk_live_98a2b...",
    permissions: ["charges:write", "customers:read", "tokens:create"],
    createdAt: "Jan 14, 2025",
    lastUsed: "2 mins ago",
  },
  {
    id: "rk_2",
    name: "ERP Reconciliation Worker",
    keyPrefix: "rk_live_34d91...",
    permissions: ["invoices:read", "transactions:read", "settlements:read"],
    createdAt: "Feb 02, 2025",
    lastUsed: "12 mins ago",
  },
  {
    id: "rk_3",
    name: "Automated Refunds Service",
    keyPrefix: "rk_live_77e43...",
    permissions: ["refunds:write", "disputes:read"],
    createdAt: "Mar 10, 2025",
    lastUsed: "4 hours ago",
  },
];

export const dummyWebhooks: WebhookEndpoint[] = [
  {
    id: "we_1",
    url: "https://api.acmepayments.com/v1/webhooks/paytrack",
    status: "active",
    events: ["payment.captured", "charge.disputed", "refund.succeeded"],
    secret: "whsec_mock_demo_secret_98b72df4839a8c1e",
    lastDeliveryTime: "Just now",
    successRate: "99.8%",
  },
  {
    id: "we_2",
    url: "https://ops-gateway.acmepayments.com/events/billing",
    status: "active",
    events: ["invoice.paid", "invoice.finalized", "invoice.overdue"],
    secret: "whsec_mock_demo_secret_33c14fa99120de84",
    lastDeliveryTime: "18 mins ago",
    successRate: "100%",
  },
  {
    id: "we_3",
    url: "https://staging-receiver.acmepayments.internal/hook",
    status: "failing",
    events: ["payment.failed", "dispute.created"],
    secret: "whsec_mock_demo_secret_77e92ab001948fc2",
    lastDeliveryTime: "1 hour ago",
    successRate: "84.2%",
  },
];

export const dummyDeliveryLogs: WebhookDeliveryLog[] = [
  {
    id: "evt_1092840",
    event: "payment.captured",
    status: 200,
    timestamp: "14:32:05",
    durationMs: 42,
    payload: JSON.stringify(
      {
        id: "evt_1092840",
        type: "payment.captured",
        data: {
          chargeId: "tx_98a72b",
          amount: 145000,
          currency: "usd",
          status: "succeeded",
        },
      },
      null,
      2
    ),
  },
  {
    id: "evt_1092839",
    event: "invoice.paid",
    status: 200,
    timestamp: "14:28:11",
    durationMs: 58,
    payload: JSON.stringify(
      {
        id: "evt_1092839",
        type: "invoice.paid",
        data: {
          invoiceId: "INV-2025-001",
          amountPaid: 850000,
          customer: "Acme Cloud Corp",
        },
      },
      null,
      2
    ),
  },
  {
    id: "evt_1092838",
    event: "charge.disputed",
    status: 500,
    timestamp: "14:15:42",
    durationMs: 412,
    payload: JSON.stringify(
      {
        id: "evt_1092838",
        type: "charge.disputed",
        data: {
          disputeId: "dp_49182",
          reason: "fraudulent",
          amount: 219900,
        },
      },
      null,
      2
    ),
  },
  {
    id: "evt_1092837",
    event: "payment.captured",
    status: 200,
    timestamp: "14:02:19",
    durationMs: 38,
    payload: JSON.stringify(
      {
        id: "evt_1092837",
        type: "payment.captured",
        data: {
          chargeId: "tx_98a71a",
          amount: 4900,
          currency: "usd",
          status: "succeeded",
        },
      },
      null,
      2
    ),
  },
];

export const codeSnippets = {
  curl: `curl -X POST https://api.paytrack.dev/v1/charges \\
  -u sk_live_mock_demo_key_98a72b01c4ef: \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 4900,
    "currency": "usd",
    "customer": "cus_98a72b",
    "description": "Monthly Enterprise Subscription"
  }'`,

  node: `import PayTrack from "@paytrack/node";

const paytrack = new PayTrack(process.env.PAYTRACK_SECRET_KEY);

const charge = await paytrack.charges.create({
  amount: 4900, // in cents ($49.00)
  currency: "usd",
  customer: "cus_98a72b",
  description: "Monthly Enterprise Subscription",
  metadata: { orderId: "ord_10294" }
});

console.log("Charge created:", charge.id);`,

  python: `import paytrack
import os

paytrack.api_key = os.environ["PAYTRACK_SECRET_KEY"]

charge = paytrack.Charge.create(
    amount=4900,
    currency="usd",
    customer="cus_98a72b",
    description="Monthly Enterprise Subscription"
)

print(f"Charge created: {charge.id}")`,

  go: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/paytrack/paytrack-go"
)

func main() {
	client := paytrack.NewClient(os.Getenv("PAYTRACK_SECRET_KEY"))

	charge, err := client.Charges.Create(context.Background(), &paytrack.ChargeParams{
		Amount:   4900,
		Currency: "usd",
		Customer: "cus_98a72b",
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("Charge created: %s\\n", charge.ID)
}`,
};
