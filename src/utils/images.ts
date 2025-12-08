import { readFile } from "node:fs/promises";

/**
 * Check if a string is already base64 encoded
 * Supports both raw base64 and data URL format
 */
function isBase64(str: string): boolean {
  // Check for data URL format (e.g., data:image/png;base64,...)
  if (str.startsWith("data:") && str.includes(";base64,")) {
    return true;
  }

  // Check if it looks like raw base64
  // - Must be reasonably long (short strings are likely paths)
  // - Must only contain valid base64 characters
  // - Must have valid padding (0, 1, or 2 '=' characters at end)
  if (str.length < 100) {
    return false;
  }

  // Valid base64 pattern with proper padding
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(str);
}

/**
 * Convert an image path or base64 string to base64
 * @param image - File path or base64-encoded string
 * @returns Base64-encoded image data
 * @throws Error if file cannot be read
 */
export async function toBase64(image: string): Promise<string> {
  // If already base64, return as-is
  if (isBase64(image)) {
    return image;
  }

  // Try to read file and convert to base64
  // Let readFile throw ENOENT if file doesn't exist (no need for separate existsSync check)
  try {
    const buffer = await readFile(image);
    return buffer.toString("base64");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`Image file not found: ${image}`);
    }
    throw error;
  }
}

/**
 * Process an array of images, converting file paths to base64
 * @param images - Array of file paths or base64-encoded strings
 * @returns Array of base64-encoded image data, or undefined if no images
 */
export async function processImages(
  images: string[] | undefined
): Promise<string[] | undefined> {
  if (!images || images.length === 0) {
    return undefined;
  }

  return Promise.all(images.map(toBase64));
}
