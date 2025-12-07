import { ZodError } from "zod";
import {
  OllamaError,
  OllamaApiError,
  OllamaNetworkError,
  OllamaResponseError,
} from "../ollama/errors.js";

/**
 * Convert an error to a user-friendly message
 * Avoids exposing internal details
 */
export function formatErrorMessage(error: unknown): string {
  // Zod validation errors
  if (error instanceof ZodError) {
    const issues = error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return `Validation error: ${issues.join(", ")}`;
  }

  // Ollama API errors
  if (error instanceof OllamaApiError) {
    switch (error.status) {
      case 404:
        return "Model not found. Use ollama_list to see available models.";
      case 400:
        return "Bad request. Please check your input parameters.";
      case 500:
        return "Ollama server error. Please check if the model is loaded correctly.";
      case 503:
        return "Ollama service unavailable. Please try again later.";
      default:
        return `Ollama API error (status: ${error.status})`;
    }
  }

  // Ollama network errors
  if (error instanceof OllamaNetworkError) {
    if (error.message.includes("timed out")) {
      return "Request timed out. The operation may take longer than expected.";
    }
    return `Connection error: ${error.message}`;
  }

  // Ollama response validation errors
  if (error instanceof OllamaResponseError) {
    return "Unexpected response from Ollama. The API may have changed.";
  }

  // Base Ollama errors
  if (error instanceof OllamaError) {
    return error.message;
  }

  // Generic errors
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
