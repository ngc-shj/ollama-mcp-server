# Ollama MCP Server

A bridge to use Ollama as an MCP server from Claude Code.

**[日本語版 README はこちら](README.ja.md)**

## Features

- **ollama_generate**: Single-turn text generation
- **ollama_chat**: Multi-turn chat conversations
- **ollama_list**: List available models
- **ollama_show**: Show model details
- **ollama_pull**: Download models
- **ollama_embeddings**: Generate text embeddings

## Prerequisites

1. Ollama installed and running

   ```bash
   # Install Ollama (macOS)
   brew install ollama

   # Start Ollama server
   ollama serve
   ```

2. At least one model downloaded

   ```bash
   ollama pull llama3.2
   ```

## Installation

```bash
cd ollama-mcp-server
npm install
npm run build
```

## Claude Code Configuration

### Method 1: Using CLI (Recommended)

```bash
# Add to local scope (current project)
claude mcp add --transport stdio ollama -- node /path/to/ollama-mcp-server/dist/index.js

# Add to user scope (all projects)
claude mcp add --transport stdio ollama --scope user -- node /path/to/ollama-mcp-server/dist/index.js
```

To add environment variables:

```bash
claude mcp add --transport stdio ollama \
  --env OLLAMA_BASE_URL=http://localhost:11434 \
  -- node /path/to/ollama-mcp-server/dist/index.js
```

### Method 2: Manual Configuration

**Project scope** (`.mcp.json` in project root):

```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": ["/path/to/ollama-mcp-server/dist/index.js"],
      "env": {
        "OLLAMA_BASE_URL": "http://localhost:11434"
      }
    }
  }
}
```

**User scope** (`~/.claude.json`):

```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": ["/path/to/ollama-mcp-server/dist/index.js"],
      "env": {
        "OLLAMA_BASE_URL": "http://localhost:11434"
      }
    }
  }
}
```

### Verify Installation

```bash
# List configured MCP servers
claude mcp list

# Inside Claude Code
/mcp
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |

## Usage Examples

From Claude Code:

### List Models

```text
List available Ollama models
```

### Text Generation

```text
Generate "3 features of Rust" using Ollama's llama3.2 model
```

### Chat

```text
I'd like to have Ollama do a code review
```

## Troubleshooting

### Cannot connect to Ollama

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running
ollama serve
```

### No models available

```bash
ollama pull llama3.2
```

### MCP server not showing up

```bash
# Verify server is registered
claude mcp list

# Check server health
claude mcp get ollama
```

## License

MIT
