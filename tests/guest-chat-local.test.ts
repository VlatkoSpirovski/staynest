import { describe, expect, it } from "vitest";
import { canAnswerLocally } from "@/components/guest-chat";

describe("instant chat answers", () => {
  it("are used for English questions in an English guide", () => {
    expect(canAnswerLocally("What time is check-out?", "en")).toBe(true);
    expect(canAnswerLocally("wifi password", "en")).toBe(true);
  });

  it("are skipped when the guest writes in another language, so the AI answers in that language", () => {
    expect(canAnswerLocally("Wann ist der Check-out?", "en")).toBe(false);
    expect(canAnswerLocally("Où est le parking ?", "en")).toBe(false);
    expect(canAnswerLocally("Dove posso parcheggiare?", "en")).toBe(false);
    expect(canAnswerLocally("Gdzie jest apteka?", "en")).toBe(false);
  });

  it("are skipped when the guide is shown in another language", () => {
    expect(canAnswerLocally("check-out", "de")).toBe(false);
  });
});
