import type { z } from "zod";
import {
  OllamaApiError,
  OllamaNetworkError,
  OllamaResponseError,
  OllamaError,
} from "./errors.js";

/**
 * Validate and get the Ollama base URL
 */
function getOllamaBaseUrl(): string {
  const raw = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

  try {
    const url = new URL(raw);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error(`Invalid protocol: ${url.protocol}`);
    }

    // Remove trailing slash
    return url.toString().replace(/\/+$/, "");
  } catch {
    // Do not log raw env value - it may contain secrets
    throw new Error("Invalid OLLAMA_BASE_URL configuration");
  }
}

const OLLAMA_BASE_URL = getOllamaBaseUrl();

// Default timeout for API requests (15 seconds)
const DEFAULT_TIMEOUT_MS = 15_000;

// Extended timeout for model pull operations (10 minutes)
const PULL_TIMEOUT_MS = 600_000;

/**
 * Make a request to the Ollama API with timeout, validation, and error handling
 */
export async function ollamaRequest<T>(
  endpoint: string,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  responseSchema?: z.ZodSchema<T>
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${OLLAMA_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new OllamaApiError(response.status, body);
    }

    const raw: unknown = await response.json();

    // Validate response if schema provided
    if (responseSchema) {
      const parsed = responseSchema.safeParse(raw);
      if (!parsed.success) {
        throw new OllamaResponseError(
          `Invalid response shape: ${parsed.error.message}`,
          parsed.error
        );
      }
      return parsed.data;
    }

    return raw as T;
  } catch (error) {
    if (error instanceof OllamaError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new OllamaNetworkError("Request timed out", error);
      }
      if (
        error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED")
      ) {
        throw new OllamaNetworkError(
          `Failed to connect to Ollama: ${error.message}`,
          error
        );
      }
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Make a request with extended timeout (for model pull operations)
 */
export async function ollamaRequestLong<T>(
  endpoint: string,
  init: RequestInit = {},
  responseSchema?: z.ZodSchema<T>
): Promise<T> {
  return ollamaRequest<T>(endpoint, init, PULL_TIMEOUT_MS, responseSchema);
}
