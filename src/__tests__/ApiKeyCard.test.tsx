import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ApiKeyCard from "@/components/ApiKeyCard";

describe("ApiKeyCard", () => {
  const mockProps = {
    publishableKey: "pk_test_1234567890abcdef",
    secretKey: "sk_test_abcdef1234567890",
  };

  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });
  });

  it("renders masked API keys", () => {
    render(<ApiKeyCard {...mockProps} />);
    expect(screen.getByText(/pk_test_123.*cdef/)).toBeInTheDocument();
    expect(screen.getByText(/sk_test_abc.*7890/)).toBeInTheDocument();
  });

  it("copies publishable key to clipboard when clicked", async () => {
    render(<ApiKeyCard {...mockProps} />);
    const publishableKeyElement = screen.getByText(/pk_test_123.*cdef/);
    await act(async () => {
      fireEvent.click(publishableKeyElement);
    });

    expect(writeTextMock).toHaveBeenCalledWith(mockProps.publishableKey);
  });

  it("copies secret key to clipboard when clicked", async () => {
    render(<ApiKeyCard {...mockProps} />);
    const secretKeyElement = screen.getByText(/sk_test_abc.*7890/);
    await act(async () => {
      fireEvent.click(secretKeyElement);
    });

    expect(writeTextMock).toHaveBeenCalledWith(mockProps.secretKey);
  });

  it("displays copied status upon click", async () => {
    render(<ApiKeyCard {...mockProps} />);
    const publishableKeyButton = screen.getByRole("button", {
      name: /publishable key/i,
    });
    await act(async () => {
      fireEvent.click(publishableKeyButton);
    });

    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("copies key to clipboard when Enter key is pressed", async () => {
    render(<ApiKeyCard {...mockProps} />);
    const publishableKeyButton = screen.getByRole("button", {
      name: /publishable key/i,
    });
    await act(async () => {
      fireEvent.keyDown(publishableKeyButton, {
        key: "Enter",
        code: "Enter",
      });
    });

    expect(writeTextMock).toHaveBeenCalledWith(mockProps.publishableKey);
  });
});
