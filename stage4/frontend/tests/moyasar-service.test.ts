import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createMoyasarToken,
  MoyasarTokenError,
} from "../src/app/features/payments/moyasarService";

const validCard = {
  card: "4111 1111 1111 1111",
  expiry: "12 / 30",
  cvv: "123",
  holder: "Lara Diver",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Moyasar card tokenization", () => {
  it("tokenizes card details directly with Moyasar", async () => {
    vi.stubEnv("VITE_MOYASAR_PUBLISHABLE_KEY", "pk_test_example");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "token_test_123",
          status: "inactive",
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(createMoyasarToken(validCard)).resolves.toBe(
      "token_test_123",
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.moyasar.com/v1/tokens");
    expect(request.method).toBe("POST");
    expect(JSON.parse(String(request.body))).toEqual({
      publishable_api_key: "pk_test_example",
      save_only: true,
      name: "Lara Diver",
      number: "4111111111111111",
      month: 12,
      year: 30,
      cvc: "123",
    });
  });

  it("shows Moyasar validation errors", async () => {
    vi.stubEnv("VITE_MOYASAR_PUBLISHABLE_KEY", "pk_test_example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: "Invalid card number" }),
          {
            status: 422,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    await expect(createMoyasarToken(validCard)).rejects.toThrow(
      "Invalid card number",
    );
  });

  it("rejects payment when the publishable key is missing", async () => {
    vi.stubEnv("VITE_MOYASAR_PUBLISHABLE_KEY", "");

    await expect(createMoyasarToken(validCard)).rejects.toBeInstanceOf(
      MoyasarTokenError,
    );
  });

  it("rejects an invalid successful response", async () => {
    vi.stubEnv("VITE_MOYASAR_PUBLISHABLE_KEY", "pk_test_example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: "inactive" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(createMoyasarToken(validCard)).rejects.toThrow(
      "invalid payment token",
    );
  });
});
