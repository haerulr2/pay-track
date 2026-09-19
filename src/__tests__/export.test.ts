import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { analyticsSnapshots } from "@/lib/analytics-data";
import { transactions } from "@/lib/dummy-transactions";
import { exportAnalyticsToCSV, exportTransactionsToCSV } from "@/lib/export";

describe("Export functions", () => {
  let createdBlobs: Blob[] = [];
  let createdUrls: string[] = [];
  let clickedLinks: HTMLAnchorElement[] = [];

  beforeEach(() => {
    createdBlobs = [];
    createdUrls = [];
    clickedLinks = [];

    // Mock URL object methods
    globalThis.URL.createObjectURL = vi.fn((blob: Blob) => {
      createdBlobs.push(blob);
      const mockUrl = `blob:mock-url-${createdBlobs.length}`;
      createdUrls.push(mockUrl);
      return mockUrl;
    });

    globalThis.URL.revokeObjectURL = vi.fn();

    // Track anchor clicks
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      clickedLinks.push(this);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("exportTransactionsToCSV", () => {
    it("generates CSV and triggers download without crashing", async () => {
      exportTransactionsToCSV(transactions, "custom-transactions.csv");

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
      expect(clickedLinks.length).toBe(1);

      const link = clickedLinks[0];
      expect(link.getAttribute("download")).toBe("custom-transactions.csv");

      // Verify blob content
      const blob = createdBlobs[0];
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("text/csv;charset=utf-8;");

      const text = await blob.text();
      expect(text).toContain("Transaction ID");
      expect(text).toContain("Customer");
      expect(text).toContain("Gross Amount");
      expect(text).toContain("Acme Corp");
      expect(text).toContain("TX-9001");
    });

    it("uses default filename when none provided", () => {
      exportTransactionsToCSV(transactions);

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(clickedLinks.length).toBe(1);

      const link = clickedLinks[0];
      expect(link.getAttribute("download")).toMatch(/^transactions-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it("handles empty transactions list gracefully", async () => {
      exportTransactionsToCSV([]);

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      const blob = createdBlobs[0];
      const text = await blob.text();
      expect(text).toContain("Transaction ID");
    });
  });

  describe("exportAnalyticsToCSV", () => {
    it("generates analytics CSV and triggers download without crashing", async () => {
      const snapshot = analyticsSnapshots["30D"];
      exportAnalyticsToCSV(snapshot, "custom-analytics.csv");

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
      expect(clickedLinks.length).toBe(1);

      const link = clickedLinks[0];
      expect(link.getAttribute("download")).toBe("custom-analytics.csv");

      // Verify blob content
      const blob = createdBlobs[0];
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("text/csv;charset=utf-8;");

      const text = await blob.text();
      expect(text).toContain("PAY-TRACK ANALYTICS REPORT");
      expect(text).toContain("Timeframe: 30D");
      expect(text).toContain("=== EXECUTIVE KPI SUMMARY ===");
      expect(text).toContain("Gross Processing Volume");
      expect(text).toContain("=== VOLUME & CASH FLOW TREND ===");
      expect(text).toContain("=== PAYMENT METHOD DISTRIBUTION ===");
      expect(text).toContain("=== PAYMENT DECLINE BREAKDOWN ===");
    });

    it("uses default filename with snapshot timeframe", () => {
      const snapshot = analyticsSnapshots["7D"];
      exportAnalyticsToCSV(snapshot);

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(clickedLinks.length).toBe(1);

      const link = clickedLinks[0];
      expect(link.getAttribute("download")).toMatch(/^analytics-report-7d-\d{4}-\d{2}-\d{2}\.csv$/);
    });
  });
});
