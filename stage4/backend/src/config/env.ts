const DEFAULT_PORT = 3000;

function getPort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export const env = {
  port: getPort(process.env.PORT),

  moyasarApiKey: requireEnv("MOYASAR_API_KEY"),

  moyasarBaseUrl:
    process.env.MOYASAR_BASE_URL ??
    "https://api.moyasar.com/v1",
};
