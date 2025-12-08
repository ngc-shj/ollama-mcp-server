import type { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * MCP Tool definitions for Ollama
 */
export const tools: Tool[] = [
  {
    name: "ollama_generate",
    description:
      "Generate text using an Ollama model. Use this for single-turn text generation. Supports vision models (llava, llama3.2-vision, deepseek-ocr) with image input.",
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description:
            "The model to use (e.g., 'llama3.2', 'codellama', 'mistral', 'llava', 'deepseek-ocr')",
        },
        prompt: {
          type: "string",
          description: "The prompt to generate from",
        },
        system: {
          type: "string",
          description: "Optional system prompt",
        },
        temperature: {
          type: "number",
          description: "Temperature for generation (0.0-2.0, default: 0.8)",
        },
        max_tokens: {
          type: "number",
          description: "Maximum tokens to generate",
        },
        images: {
          type: "array",
          items: { type: "string" },
          description:
            "Array of image file paths or base64-encoded images for vision models",
        },
      },
      required: ["model", "prompt"],
    },
  },
  {
    name: "ollama_chat",
    description:
      "Have a multi-turn chat conversation with an Ollama model. Supports vision models (llava, llama3.2-vision, deepseek-ocr) with image input.",
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description:
            "The model to use (e.g., 'llama3.2', 'codellama', 'mistral', 'llava', 'deepseek-ocr')",
        },
        messages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: {
                type: "string",
                enum: ["system", "user", "assistant"],
              },
              content: {
                type: "string",
              },
              images: {
                type: "array",
                items: { type: "string" },
                description:
                  "Array of image file paths or base64-encoded images",
              },
            },
            required: ["role", "content"],
          },
          description: "Array of chat messages",
        },
        temperature: {
          type: "number",
          description: "Temperature for generation (0.0-2.0, default: 0.8)",
        },
      },
      required: ["model", "messages"],
    },
  },
  {
    name: "ollama_list",
    description: "List all locally available Ollama models.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "ollama_show",
    description: "Show detailed information about a specific model.",
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description: "The model name to get information about",
        },
      },
      required: ["model"],
    },
  },
  {
    name: "ollama_pull",
    description: "Pull (download) a model from the Ollama library.",
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description:
            "The model to pull (e.g., 'llama3.2', 'codellama:7b', 'mistral')",
        },
      },
      required: ["model"],
    },
  },
  {
    name: "ollama_embeddings",
    description: "Generate embeddings for text using an Ollama model.",
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description:
            "The model to use for embeddings (e.g., 'nomic-embed-text', 'mxbai-embed-large')",
        },
        input: {
          type: "string",
          description: "The text to generate embeddings for",
        },
      },
      required: ["model", "input"],
    },
  },
];

export const toolNames = [
  "ollama_generate",
  "ollama_chat",
  "ollama_list",
  "ollama_show",
  "ollama_pull",
  "ollama_embeddings",
] as const;

export type ToolName = (typeof toolNames)[number];
