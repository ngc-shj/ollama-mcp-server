import { z } from "zod";

/**
 * Zod schemas for tool input validation
 */

export const OllamaGenerateSchema = z.object({
  model: z.string().min(1, "Model name is required"),
  prompt: z.string().min(1, "Prompt is required"),
  system: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().max(131072).optional(),
});
export type OllamaGenerateArgs = z.infer<typeof OllamaGenerateSchema>;

export const OllamaChatSchema = z.object({
  model: z.string().min(1, "Model name is required"),
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })
    )
    .min(1, "At least one message is required"),
  temperature: z.number().min(0).max(2).optional(),
});
export type OllamaChatArgs = z.infer<typeof OllamaChatSchema>;

export const OllamaShowSchema = z.object({
  model: z.string().min(1, "Model name is required"),
});
export type OllamaShowArgs = z.infer<typeof OllamaShowSchema>;

export const OllamaPullSchema = z.object({
  model: z.string().min(1, "Model name is required"),
});
export type OllamaPullArgs = z.infer<typeof OllamaPullSchema>;

export const OllamaEmbeddingsSchema = z.object({
  model: z.string().min(1, "Model name is required"),
  input: z.string().min(1, "Input text is required"),
});
export type OllamaEmbeddingsArgs = z.infer<typeof OllamaEmbeddingsSchema>;
