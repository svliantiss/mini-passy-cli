# @mini-passy/cli

CLI tool for Mini-Passy AI Gateway. Run a local LLM gateway with any provider - OpenAI, Anthropic, Ollama, or custom endpoints.

## Installation

```bash
# Use via npx (no installation needed)
npx @mini-passy/cli

# Or install globally
npm install -g @mini-passy/cli
```

## Quick Start

```bash
# Initialize configuration
mini-passy config init

# Edit .env to add your API keys
nano .env

# Start the gateway
mini-passy start
```

## Configuration

Mini-Passy uses a `.env` file in your current directory. Just add provider URLs and keys:

```env
# OpenAI
PROVIDER_OPENAI_URL=https://api.openai.com
PROVIDER_OPENAI_KEY=sk-your-openai-key

# Anthropic
PROVIDER_ANTHROPIC_URL=https://api.anthropic.com
PROVIDER_ANTHROPIC_KEY=sk-ant-your-key

# Ollama (local, no key needed)
PROVIDER_OLLAMA_URL=http://localhost:11434

# Custom endpoint (like emby.ai)
PROVIDER_EMBY_URL=https://api.emby.ai
PROVIDER_EMBY_KEY=sk-your-key

# Any OpenAI-compatible endpoint
PROVIDER_MINE_URL=http://192.168.1.100:8000

# Port (default: 3333)
PORT=3333
```

That's it. The SDK auto-discovers all providers on startup and creates aliases.

## Commands

### `mini-passy start` (default)

Start the gateway server.

```bash
mini-passy start              # Start on default port 3333
mini-passy start -p 8080      # Start on custom port
mini-passy start -d           # Start in background (detached)
mini-passy                    # Just 'mini-passy' also starts the server
```

**Example output:**
```
Server running on http://127.0.0.1:3333
```

### `mini-passy models`

List available models from all configured providers.

```bash
mini-passy models             # Pretty print models
mini-passy models --json      # JSON output
```

**Example output:**
```
Available Models:
=================
  openai_gpt4o
  openai_gpt4o_mini
  anthropic_claude_sonnet
  ollama_llama3
  ollama_mistral
  emby_gpt4o
```

Aliases are created automatically: `<provider>_<model_name>`

### `mini-passy config`

Manage configuration.

#### `mini-passy config init`
Create a new `.env` file:
```bash
mini-passy config init
# Created .env file. Edit it to add your API keys.
```

#### `mini-passy config show`
Display current configuration:
```bash
mini-passy config show
```

#### `mini-passy config set <key> <value>`
Set a configuration value:
```bash
mini-passy config set PORT 8080
mini-passy config set PROVIDER_OPENAI_KEY sk-xxx
```

### `mini-passy doctor`

Diagnose setup issues.

```bash
mini-passy doctor
```

**Example output:**
```
Mini-Passy Doctor

✓ Node.js version: v20.10.0
✓ .env file exists
✓ Found API keys: PROVIDER_OPENAI_KEY, PROVIDER_OLLAMA_URL
✓ Gateway is running on port 3333
```

### `mini-passy provider`

Manage LLM providers via CLI (alternative to editing `.env`).

#### `mini-passy provider list`
Show configured providers:
```bash
mini-passy provider list
```
**Output:**
```
Configured Providers:
====================
  openai       https://api.openai.com 🔑
  ollama       http://localhost:11434
```

#### `mini-passy provider add`
Add a new provider:
```bash
# Add Ollama (local, no key)
mini-passy provider add ollama --url http://localhost:11434

# Add OpenAI
mini-passy provider add openai --url https://api.openai.com --key sk-xxx

# Add custom endpoint
mini-passy provider add emby --url https://api.emby.ai --key sk-xxx
```

#### `mini-passy provider remove`
Remove a provider:
```bash
mini-passy provider remove ollama
```

### `mini-passy alias`

Manage model aliases.

#### `mini-passy alias list`
Show all aliases:
```bash
mini-passy alias list
```
**Output:**
```
Configured Aliases:
===================
  mygpt                → openai/gpt-4o
  local_llama          → ollama/llama3.2
```

#### `mini-passy alias add`
Create a custom alias:
```bash
mini-passy alias add mygpt openai/gpt-4o
mini-passy alias add local_llama ollama/llama3.2
```

#### `mini-passy alias remove`
Remove an alias:
```bash
mini-passy alias remove mygpt
```

## Using the Gateway

Once running, the gateway is available at `http://localhost:3333`:

### List models
```bash
curl http://localhost:3333/v1/models
```

### Chat completion
```bash
curl -X POST http://localhost:3333/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer any-key" \
  -d '{
    "model": "ollama_llama3",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Streaming chat
```bash
curl -X POST http://localhost:3333/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer any-key" \
  -d '{
    "model": "openai_gpt4o",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```

## Adding Providers

### Local Ollama (No API Key)

1. Install Ollama: https://ollama.com
2. Pull a model: `ollama pull llama3.2`
3. Add to `.env`:
   ```env
   PROVIDER_OLLAMA_URL=http://localhost:11434
   ```
4. Restart: `mini-passy restart`

Models auto-discovered from `http://localhost:11434/api/tags`

### OpenAI-Compatible Endpoint

Any endpoint that follows OpenAI's API format:

```env
PROVIDER_MYAPI_URL=https://api.example.com
PROVIDER_MYAPI_KEY=sk-my-key  # Optional
```

The SDK queries `/v1/models` to discover available models.

### Custom/Local Endpoint

Self-hosted or local network:

```env
PROVIDER_LOCAL_URL=http://192.168.1.100:8000
```

No key required for local endpoints.

## Model Aliases

The SDK creates convenient aliases from your providers:

| Provider | Model | Alias |
|----------|-------|-------|
| openai | gpt-4o | openai_gpt4o |
| ollama | llama3.2 | ollama_llama3 |
| emby | gpt-4o | emby_gpt4o |

Use any alias in API calls:
```bash
curl ... -d '{"model": "ollama_llama3", ...}'
```

## How It Works

1. **On startup**, the SDK reads your `.env` file
2. **Finds all** `PROVIDER_*_URL` variables
3. **Auto-discovers** models from each provider
4. **Creates aliases** like `provider_modelname`
5. **Routes requests** to the right provider based on alias

No commands needed - just edit `.env` and restart.

## Troubleshooting

### "Gateway not running"
```bash
mini-passy start
```

### "No .env file found"
```bash
mini-passy config init
# Then edit .env to add providers
```

### Port already in use
```bash
mini-passy start -p 8080  # Use different port
```

### Ollama models not showing
Make sure Ollama is running:
```bash
ollama list  # Should show your models
```

Then restart Mini-Passy.

## Requirements

- Node.js 18+
- For Ollama: Ollama installed and running
- For cloud providers: API key

## License

MIT
