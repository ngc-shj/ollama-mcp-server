/**
 * Model name validation to prevent path traversal and injection attacks
 */

// Allow alphanumeric, dots, hyphens, underscores, colons (for tags like "llama3.2:7b")
const MODEL_NAME_REGEX = /^[a-zA-Z0-9._:-]+$/;

/**
 * Validate that a model name is safe
 * @throws Error if the model name is invalid
 */
export function assertValidModelName(name: string): asserts name is string {
  if (!name || name.length === 0) {
    throw new Error("Model name is required");
  }

  if (name.length > 256) {
    throw new Error("Model name is too long (max 256 characters)");
  }

  if (!MODEL_NAME_REGEX.test(name)) {
    throw new Error(
      `Invalid model name: "${name}". Only alphanumeric characters, dots, hyphens, underscores, and colons are allowed.`
    );
  }

  // Prevent path traversal
  if (name.includes("..") || name.startsWith("/") || name.startsWith("\\")) {
    throw new Error(`Invalid model name: "${name}". Path traversal is not allowed.`);
  }
}
