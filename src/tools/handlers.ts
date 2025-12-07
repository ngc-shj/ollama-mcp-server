import { ollamaRequest, ollamaRequestLong } from "../ollama/client.js";
import {
  OllamaGenerateResponseSchema,
  OllamaChatResponseSchema,
  OllamaListResponseSchema,
  OllamaShowResponseSchema,
  OllamaEmbeddingsResponseSchema,
  OllamaPullResponseSchema,
} from "../ollama/types.js";
import {
  OllamaGenerateSchema,
  OllamaChatSchema,
  OllamaShowSchema,
  OllamaPullSchema,
  OllamaEmbeddingsSchema,
  type OllamaGenerateArgs,
  type OllamaChatArgs,
  type OllamaShowArgs,
  type OllamaPullArgs,
  type OllamaEmbeddingsArgs,
} from "./schemas.js";
import { assertValidModelName } from "./validators.js";

/**
 * Generate text using an Ollama model
 */
export async function handleOllamaGenerate(raw: unknown): Promise<string> {
  const args: OllamaGenerateArgs = OllamaGenerateSchema.parse(raw);
  assertValidModelName(args.model);

  const data = await ollamaRequest(
    "/api/generate",
    {
      method: "POST",
      body: JSON.stringify({
        model: args.model,
        prompt: args.prompt,
        system: args.system,
        stream: false,
        options: {
          temperature: args.temperature,
          num_predict: args.max_tokens,
        },
      }),
    },
    undefined,
    OllamaGenerateResponseSchema
  );

  return data.response;
}

/**
 * Have a multi-turn chat conversation with an Ollama model
 */
export async function handleOllamaChat(raw: unknown): Promise<string> {
  const args: OllamaChatArgs = OllamaChatSchema.parse(raw);
  assertValidModelName(args.model);

  const data = await ollamaRequest(
    "/api/chat",
    {
      method: "POST",
      body: JSON.stringify({
        model: args.model,
        messages: args.messages,
        stream: false,
        options: {
          temperature: args.temperature,
        },
      }),
    },
    undefined,
    OllamaChatResponseSchema
  );

  return data.message.content;
}

/**
 * List all locally available Ollama models
 */
export async function handleOllamaList(): Promise<string> {
  const data = await ollamaRequest(
    "/api/tags",
    {},
    undefined,
    OllamaListResponseSchema
  );

  if (!data.models || data.models.length === 0) {
    return "No models found. Use ollama_pull to download a model.";
  }

  const modelList = data.models.map((m) => {
    const sizeGB = (m.size / (1024 * 1024 * 1024)).toFixed(2);
    return `- ${m.name} (${sizeGB} GB)`;
  });

  return `Available models:\n${modelList.join("\n")}`;
}

/**
 * Show detailed information about a specific model
 */
export async function handleOllamaShow(raw: unknown): Promise<string> {
  const args: OllamaShowArgs = OllamaShowSchema.parse(raw);
  assertValidModelName(args.model);

  const data = await ollamaRequest(
    "/api/show",
    {
      method: "POST",
      body: JSON.stringify({ name: args.model }),
    },
    undefined,
    OllamaShowResponseSchema
  );

  return JSON.stringify(data, null, 2);
}

/**
 * Pull (download) a model from the Ollama library
 */
export async function handleOllamaPull(raw: unknown): Promise<string> {
  const args: OllamaPullArgs = OllamaPullSchema.parse(raw);
  assertValidModelName(args.model);

  // Use extended timeout for model pull operations
  await ollamaRequestLong(
    "/api/pull",
    {
      method: "POST",
      body: JSON.stringify({
        name: args.model,
        stream: false,
      }),
    },
    OllamaPullResponseSchema
  );

  return `Successfully pulled model: ${args.model}`;
}

/**
 * Generate embeddings for text using an Ollama model
 */
export async function handleOllamaEmbeddings(raw: unknown): Promise<string> {
  const args: OllamaEmbeddingsArgs = OllamaEmbeddingsSchema.parse(raw);
  assertValidModelName(args.model);

  const data = await ollamaRequest(
    "/api/embed",
    {
      method: "POST",
      body: JSON.stringify({
        model: args.model,
        input: args.input,
      }),
    },
    undefined,
    OllamaEmbeddingsResponseSchema
  );

  return JSON.stringify(
    {
      model: args.model,
      dimensions: data.embeddings[0]?.length || 0,
      embeddings: data.embeddings,
    },
    null,
    2
  );
}
