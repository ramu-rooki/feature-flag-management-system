import dotenv from "dotenv";
dotenv.config();

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  NODE_ENV: "development" | "production" | "test";
}

const getEnvVar = (key: string, required: boolean = true): string => {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value || "";
};

export const env: EnvVars = {
  PORT: parseInt(getEnvVar("PORT", false) || "5000", 10),
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  JWT_SECRET: getEnvVar("JWT_SECRET", false) || "defaultsecret",
  NODE_ENV: (getEnvVar("NODE_ENV", false) as "development" | "production" | "test") || "development",
};
