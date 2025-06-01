export type Transaction = {
  id: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  paymentIcon: string;
  description: string;
  customer: string;
  date: string;
  refundedDate?: string;
  declineReason?: string;
  status: "Succeeded" | "Failed" | "Disputed" | "Refunded" | "Uncaptured";
};

export const transactions: Transaction[] = [
  {
    id: "TX1001",
    amount: "2.00",
    currency: "USD",
    paymentMethod: "Amazon Pay",
    paymentIcon: "amazon",
    description: "Payment for Invoice",
    customer: "testaccount@example.com",
    date: "May 21, 4:16 PM",
    status: "Succeeded",
  },
  {
    id: "TX1002",
    amount: "2.00",
    currency: "USD",
    paymentMethod: "**** 4424",
    paymentIcon: "visa",
    description: "Payment for Invoice",
    customer: "Jenny Rosen",
    date: "May 21, 4:10 PM",
    declineReason: "Other",
    status: "Failed",
  },
  {
    id: "TX1003",
    amount: "1.00",
    currency: "USD",
    paymentMethod: "Stripe balance",
    paymentIcon: "stripe",
    description: "Subscription creation",
    customer: "testaccount@example.com",
    date: "May 21, 3:48 PM",
    status: "Succeeded",
  },
  {
    id: "TX1004",
    amount: "5.00",
    currency: "USD",
    paymentMethod: "**** 5555",
    paymentIcon: "mastercard",
    description: "One-time payment",
    customer: "john.smith@example.com",
    date: "May 20, 2:30 PM",
    status: "Succeeded",
  },
  {
    id: "TX1005",
    amount: "15.50",
    currency: "USD",
    paymentMethod: "PayPal",
    paymentIcon: "paypal",
    description: "Product purchase",
    customer: "sarah.johnson@example.com",
    date: "May 19, 11:24 AM",
    status: "Succeeded",
  },
  {
    id: "TX1006",
    amount: "7.99",
    currency: "USD",
    paymentMethod: "**** 1234",
    paymentIcon: "amex",
    description: "Monthly subscription",
    customer: "mike.williams@example.com",
    date: "May 18, 9:15 AM",
    refundedDate: "May 19, 10:20 AM",
    status: "Refunded",
  },
  {
    id: "TX1007",
    amount: "24.99",
    currency: "USD",
    paymentMethod: "**** 9876",
    paymentIcon: "discover",
    description: "Premium plan",
    customer: "emma.davis@example.com",
    date: "May 17, 3:45 PM",
    status: "Disputed",
  },
  {
    id: "TX1008",
    amount: "3.50",
    currency: "USD",
    paymentMethod: "Apple Pay",
    paymentIcon: "apple",
    description: "In-app purchase",
    customer: "david.miller@example.com",
    date: "May 16, 5:30 PM",
    status: "Succeeded",
  },
  {
    id: "TX1009",
    amount: "12.00",
    currency: "USD",
    paymentMethod: "Google Pay",
    paymentIcon: "google",
    description: "Service fee",
    customer: "olivia.garcia@example.com",
    date: "May 15, 1:20 PM",
    declineReason: "Insufficient funds",
    status: "Failed",
  },
  {
    id: "TX1010",
    amount: "8.75",
    currency: "USD",
    paymentMethod: "**** 6789",
    paymentIcon: "visa",
    description: "Add-on purchase",
    customer: "noah.rodriguez@example.com",
    date: "May 14, 11:05 AM",
    status: "Uncaptured",
  },
];
