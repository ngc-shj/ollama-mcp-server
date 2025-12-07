/**
 * Base class for all Ollama-related errors
 */
export class OllamaError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "OllamaError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Ollama API error - HTTP status error from Ollama server
 */
export class OllamaApiError extends OllamaError {
  constructor(
    public readonly status: number,
    public readonly body: string
  ) {
    super(`Ollama API error: ${status}`, { cause: body });
    this.name = "OllamaApiError";
  }
}

/**
 * Ollama network error - timeout or connection failure
 */
export class OllamaNetworkError extends OllamaError {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "OllamaNetworkError";
  }
}

/**
 * Ollama response validation error - invalid response shape
 */
export class OllamaResponseError extends OllamaError {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "OllamaResponseError";
  }
}
