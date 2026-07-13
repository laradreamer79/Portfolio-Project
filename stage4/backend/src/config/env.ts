const DEFAULT_PORT = 3000;
const DEFAULT_MOYASAR_BASE_URL =
  "https://api.moyasar.com/v1";
const DEFAULT_PAYMENT_CALLBACK_URL =
  "http://localhost:5173/payment/callback";

function getPort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error(
      "PORT must be an integer between 1 and 65535",
    );
  }

  return port;
}

function getOptionalEnv(
  name: string,
): string | undefined {
  const value = process.env[name]?.trim();

  return value || undefined;
}

export const env = {
  port: getPort(process.env.PORT),

  paymentProviderMode:
    process.env.PAYMENT_PROVIDER_MODE ??
    "moyasar",

  moyasarSecretKey:
    getOptionalEnv("MOYASAR_SECRET_KEY"),

  moyasarBaseUrl:
    getOptionalEnv("MOYASAR_BASE_URL") ??
    DEFAULT_MOYASAR_BASE_URL,

  moyasarCallbackUrl:
    getOptionalEnv("MOYASAR_CALLBACK_URL") ??
    DEFAULT_PAYMENT_CALLBACK_URL,

  moyasarWebhookSecret:
    getOptionalEnv("MOYASAR_WEBHOOK_SECRET"),

  moyasarPublishableKey:
    getOptionalEnv("MOYASAR_PUBLISHABLE_KEY"),
};
