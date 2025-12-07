#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createOllamaServer } from "./server.js";

/**
 * Start the Ollama MCP server
 */
async function main() {
  const transport = new StdioServerTransport();
  const server = createOllamaServer();
  await server.connect(transport);
  console.error("Ollama MCP Server started");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
