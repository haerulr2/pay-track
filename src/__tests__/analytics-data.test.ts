import { describe, expect, it } from "vitest";

import { getAnalyticsData } from "@/lib/analytics-data";
import type { AnalyticsTimeframe } from "@/types";

describe("getAnalyticsData", () => {
  const timeframes: AnalyticsTimeframe[] = ["7D", "30D", "90D", "YTD"];

  timeframes.forEach((timeframe) => {
    it(`returns complete analytics snapshot for timeframe "${timeframe}"`, () => {
      const data = getAnalyticsData(timeframe);

      expect(data).toBeDefined();
      expect(data.timeframe).toBe(timeframe);

      // Assert kpis
      expect(data.kpis).toBeDefined();
      expect(typeof data.kpis.grossVolume).toBe("number");
      expect(typeof data.kpis.netSettlement).toBe("number");
      expect(typeof data.kpis.authorizationRate).toBe("number");
      expect(typeof data.kpis.disputeRate).toBe("number");
      expect(typeof data.kpis.grossVolumeChange).toBe("number");
      expect(typeof data.kpis.netSettlementChange).toBe("number");
      expect(typeof data.kpis.authorizationRateChange).toBe("number");
      expect(typeof data.kpis.disputeRateChange).toBe("number");

      // Assert volumeTrend
      expect(Array.isArray(data.volumeTrend)).toBe(true);
      expect(data.volumeTrend.length).toBeGreaterThan(0);
      data.volumeTrend.forEach((point) => {
        expect(point).toHaveProperty("date");
        expect(point).toHaveProperty("label");
        expect(point).toHaveProperty("gross");
        expect(point).toHaveProperty("net");
        expect(point).toHaveProperty("fees");
        expect(point).toHaveProperty("count");
        expect(typeof point.gross).toBe("number");
        expect(typeof point.net).toBe("number");
        expect(typeof point.fees).toBe("number");
        expect(typeof point.count).toBe("number");
      });

      // Assert methodDistribution
      expect(Array.isArray(data.methodDistribution)).toBe(true);
      expect(data.methodDistribution.length).toBeGreaterThan(0);
      data.methodDistribution.forEach((method) => {
        expect(method).toHaveProperty("name");
        expect(method).toHaveProperty("methodType");
        expect(method).toHaveProperty("volume");
        expect(method).toHaveProperty("percentage");
        expect(method).toHaveProperty("count");
        expect(typeof method.volume).toBe("number");
        expect(typeof method.percentage).toBe("number");
        expect(typeof method.count).toBe("number");
      });

      // Assert declineReasons
      expect(Array.isArray(data.declineReasons)).toBe(true);
      expect(data.declineReasons.length).toBeGreaterThan(0);
      data.declineReasons.forEach((decline) => {
        expect(decline).toHaveProperty("reason");
        expect(decline).toHaveProperty("category");
        expect(decline).toHaveProperty("count");
        expect(decline).toHaveProperty("percentage");
        expect(decline).toHaveProperty("suggestedAction");
        expect(typeof decline.count).toBe("number");
        expect(typeof decline.percentage).toBe("number");
      });
    });
  });

  it("defaults to 30D snapshot for unrecognized timeframe", () => {
    // @ts-expect-error testing invalid timeframe fallback
    const data = getAnalyticsData("UNKNOWN");
    expect(data.timeframe).toBe("30D");
    expect(data.kpis).toBeDefined();
    expect(data.volumeTrend).toBeDefined();
    expect(data.methodDistribution).toBeDefined();
    expect(data.declineReasons).toBeDefined();
  });
});
