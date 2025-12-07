import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools } from "./tools/definitions.js";
import { dispatchTool } from "./tools/dispatcher.js";
import { formatErrorMessage } from "./utils/errors.js";

/**
 * Create and configure the Ollama MCP server
 * Separated for easier testing
 */
export function createOllamaServer(): Server {
  const server = new Server(
    {
      name: "ollama-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  // Register tool execution handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await dispatchTool(name, args);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      const errorMessage = formatErrorMessage(error);

      // Log detailed error for debugging (server-side only)
      console.error(`[tool error] ${name}:`, error);

      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
