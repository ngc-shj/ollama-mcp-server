# Ollama MCP Server

Ollama を Claude Code から MCP サーバーとして利用するためのブリッジです。

**[English README](README.md)**

## 機能

- **ollama_generate**: 単発のテキスト生成
- **ollama_chat**: マルチターンのチャット会話
- **ollama_list**: 利用可能なモデル一覧
- **ollama_show**: モデルの詳細情報表示
- **ollama_pull**: モデルのダウンロード
- **ollama_embeddings**: テキストのエンベディング生成

## 前提条件

1. Ollama がインストールされ、実行されていること

   ```bash
   # Ollama のインストール（macOS）
   brew install ollama

   # Ollama サーバーの起動
   ollama serve
   ```

2. 最低1つのモデルがダウンロードされていること

   ```bash
   ollama pull llama3.2
   ```

## インストール

```bash
cd ollama-mcp-server
npm install
npm run build
```

## Claude Code への設定

### 方法1: CLI を使用（推奨）

```bash
# ローカルスコープに追加（現在のプロジェクトのみ）
claude mcp add --transport stdio ollama -- node /path/to/ollama-mcp-server/dist/index.js

# ユーザースコープに追加（全プロジェクトで利用可能）
claude mcp add --transport stdio ollama --scope user -- node /path/to/ollama-mcp-server/dist/index.js
```

環境変数を追加する場合：

```bash
claude mcp add --transport stdio ollama \
  --env OLLAMA_BASE_URL=http://localhost:11434 \
  -- node /path/to/ollama-mcp-server/dist/index.js
```

### 方法2: 手動設定

**プロジェクトスコープ**（プロジェクトルートの `.mcp.json`）:

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

**ユーザースコープ**（`~/.claude.json`）:

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

### インストールの確認

```bash
# 設定済みの MCP サーバー一覧を表示
claude mcp list

# Claude Code 内で確認
/mcp
```

## 環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama サーバーの URL |

## 使用例

Claude Code から以下のように利用できます：

### モデル一覧の確認

```text
利用可能な Ollama モデルを教えて
```

### テキスト生成

```text
Ollama の llama3.2 モデルで「Rust の特徴を3つ」を生成して
```

### チャット

```text
Ollama でコードレビューをお願いしたい
```

## トラブルシューティング

### Ollama に接続できない場合

```bash
# Ollama が起動しているか確認
curl http://localhost:11434/api/tags

# 起動していない場合
ollama serve
```

### モデルがない場合

```bash
ollama pull llama3.2
```

### MCP サーバーが表示されない場合

```bash
# サーバーが登録されているか確認
claude mcp list

# サーバーの状態を確認
claude mcp get ollama
```

## ライセンス

MIT
