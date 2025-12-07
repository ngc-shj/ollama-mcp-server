import { z } from "zod";

/**
 * Ollama API response schemas and types
 */

// Generate response
export const OllamaGenerateResponseSchema = z.object({
  response: z.string(),
  done: z.boolean(),
  model: z.string().optional(),
  created_at: z.string().optional(),
  total_duration: z.number().optional(),
  load_duration: z.number().optional(),
  prompt_eval_count: z.number().optional(),
  eval_count: z.number().optional(),
  eval_duration: z.number().optional(),
});
export type OllamaGenerateResponse = z.infer<typeof OllamaGenerateResponseSchema>;

// Chat response
export const OllamaChatResponseSchema = z.object({
  message: z.object({
    role: z.string(),
    content: z.string(),
  }),
  done: z.boolean(),
  model: z.string().optional(),
  created_at: z.string().optional(),
  total_duration: z.number().optional(),
});
export type OllamaChatResponse = z.infer<typeof OllamaChatResponseSchema>;

// Model info
export const OllamaModelSchema = z.object({
  name: z.string(),
  size: z.number(),
  digest: z.string(),
  modified_at: z.string(),
  details: z
    .object({
      format: z.string().optional(),
      family: z.string().optional(),
      parameter_size: z.string().optional(),
      quantization_level: z.string().optional(),
    })
    .optional(),
});
export type OllamaModel = z.infer<typeof OllamaModelSchema>;

// List response
export const OllamaListResponseSchema = z.object({
  models: z.array(OllamaModelSchema),
});
export type OllamaListResponse = z.infer<typeof OllamaListResponseSchema>;

// Show response
export const OllamaShowResponseSchema = z.object({
  modelfile: z.string().optional(),
  parameters: z.string().optional(),
  template: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
  model_info: z.record(z.string(), z.unknown()).optional(),
});
export type OllamaShowResponse = z.infer<typeof OllamaShowResponseSchema>;

// Embeddings response
export const OllamaEmbeddingsResponseSchema = z.object({
  embeddings: z.array(z.array(z.number())),
  model: z.string().optional(),
});
export type OllamaEmbeddingsResponse = z.infer<typeof OllamaEmbeddingsResponseSchema>;

// Pull response
export const OllamaPullResponseSchema = z.object({
  status: z.string().optional(),
});
export type OllamaPullResponse = z.infer<typeof OllamaPullResponseSchema>;
