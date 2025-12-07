import type { ToolName } from "./definitions.js";
import {
  handleOllamaGenerate,
  handleOllamaChat,
  handleOllamaList,
  handleOllamaShow,
  handleOllamaPull,
  handleOllamaEmbeddings,
} from "./handlers.js";

type ToolHandler = (args: unknown) => Promise<string>;

/**
 * Tool handler dispatch table
 */
const toolHandlers: Record<ToolName, ToolHandler> = {
  ollama_generate: handleOllamaGenerate,
  ollama_chat: handleOllamaChat,
  ollama_list: () => handleOllamaList(),
  ollama_show: handleOllamaShow,
  ollama_pull: handleOllamaPull,
  ollama_embeddings: handleOllamaEmbeddings,
};

/**
 * Dispatch a tool call to the appropriate handler
 */
export async function dispatchTool(
  name: string,
  args: unknown
): Promise<string> {
  const handler = toolHandlers[name as ToolName];

  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }

  return handler(args);
}
