import { describe, expect, it } from "vitest";
import { detectBrowser } from "@/lib/browser";

const CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";

describe("detectBrowser", () => {
  it("tells Chromium browsers apart", () => {
    expect(detectBrowser(CHROME)).toBe("chrome");
    expect(detectBrowser(`${CHROME} Edg/142.0.0.0`)).toBe("edge");
    expect(detectBrowser(`${CHROME} OPR/120.0.0.0`)).toBe("opera");
    expect(detectBrowser(`${CHROME} Vivaldi/7.6`)).toBe("vivaldi");
    expect(detectBrowser(CHROME, true)).toBe("brave");
  });

  it("knows the browsers the extension doesn't run on", () => {
    expect(detectBrowser("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0")).toBe("firefox");
    expect(
      detectBrowser("Mozilla/5.0 (Macintosh; Intel Mac OS X 15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15"),
    ).toBe("safari");
    expect(detectBrowser("curl/8.0")).toBe("other");
  });
});
