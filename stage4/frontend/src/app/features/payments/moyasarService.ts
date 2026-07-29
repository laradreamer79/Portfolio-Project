const MOYASAR_TOKENS_URL = "https://api.moyasar.com/v1/tokens";

export type MoyasarCardDetails = {
  card: string;
  expiry: string;
  cvv: string;
  holder: string;
};

type MoyasarErrorResponse = {
  message?: unknown;
  error?: unknown;
  errors?: unknown;
};

export class MoyasarTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MoyasarTokenError";
  }
}

function requirePublishableKey() {
  const key = import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY?.trim();

  if (!key) {
    throw new MoyasarTokenError(
      "Payment is not configured. Please contact support.",
    );
  }

  return key;
}

function paymentErrorMessage(data: unknown) {
  if (!data || typeof data !== "object") {
    return "Moyasar could not validate the card details.";
  }

  const response = data as MoyasarErrorResponse;
  const message = response.message ?? response.error ?? response.errors;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (message) {
    return JSON.stringify(message);
  }

  return "Moyasar could not validate the card details.";
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function createMoyasarToken(card: MoyasarCardDetails) {
  const publishableKey = requirePublishableKey();
  const [month, year] = card.expiry.split("/").map((part) => part.trim());
  let response: Response;

  try {
    response = await fetch(MOYASAR_TOKENS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publishable_api_key: publishableKey,
        save_only: true,
        name: card.holder.trim(),
        number: card.card.replace(/\D/g, ""),
        month: Number(month),
        year: Number(year),
        cvc: card.cvv,
      }),
    });
  } catch {
    throw new MoyasarTokenError(
      "Unable to reach Moyasar. Please try again.",
    );
  }

  const responseData = await parseJson(response);

  if (!response.ok) {
    throw new MoyasarTokenError(paymentErrorMessage(responseData));
  }

  if (
    !responseData ||
    typeof responseData !== "object" ||
    !("id" in responseData) ||
    typeof responseData.id !== "string" ||
    !responseData.id
  ) {
    throw new MoyasarTokenError(
      "Moyasar returned an invalid payment token.",
    );
  }

  return responseData.id;
}
