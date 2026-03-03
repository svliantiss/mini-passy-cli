# @mini-passy/cli

CLI tool for Mini-Passy AI Gateway. Run a local LLM gateway with simple commands.

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

## Commands

### `mini-passy start` (default)

Start the gateway server.

```bash
# Start on default port 3333
mini-passy start

# Start on custom port
mini-passy start -p 8080

# Start in background (detached)
mini-passy start -d

# Just 'mini-passy' also starts the server
mini-passy
```

**Example output:**
```
Server running on http://127.0.0.1:3333
```

### `mini-passy models`

List available models from the running gateway.

```bash
# Pretty print models
mini-passy models

# JSON output
mini-passy models --json
```

**Example output:**
```
Available Models:
=================
  gpt4o
  gpt4o_mini
  claude_sonnet
  llama33_70b
  kimi_k2
```

**JSON output example:**
```json
{
  "object": "list",
  "data": [
    { "id": "gpt4o", "object": "model" },
    { "id": "claude_sonnet", "object": "model" }
  ]
}
```

### `mini-passy config`

Manage configuration and environment variables.

#### `mini-passy config init`

Create a new `.env` file with a template.

```bash
mini-passy config init
```

**Example output:**
```
Created .env file. Edit it to add your API keys.
```

**Created `.env` file:**
```env
# Mini-Passy Configuration
# Add your API keys below:

# Provider URLs and Keys
PROVIDER_OPENAI_URL=https://api.openai.com
PROVIDER_OPENAI_KEY=sk-your-openai-key

PROVIDER_ANTHROPIC_URL=https://api.anthropic.com
PROVIDER_ANTHROPIC_KEY=sk-your-anthropic-key

# Port (default: 3333)
PORT=3333
```

#### `mini-passy config show`

Display current configuration.

```bash
mini-passy config show
```

**Example output:**
```
# Mini-Passy Configuration
PROVIDER_OPENAI_URL=https://api.openai.com
PROVIDER_OPENAI_KEY=sk-xxx
PORT=3333
```

#### `mini-passy config set <key> <value>`

Set a configuration value.

```bash
mini-passy config set PORT 8080
mini-passy config set PROVIDER_OPENAI_KEY sk-xxx
```

**Example output:**
```
Set PORT=8080
```

### `mini-passy doctor`

Diagnose setup issues and verify everything is working.

```bash
mini-passy doctor
```

**Example output (everything OK):**
```
Mini-Passy Doctor

✓ Node.js version: v20.10.0
✓ .env file exists
✓ Found API keys: PROVIDER_OPENAI_KEY, PROVIDER_ANTHROPIC_KEY
✓ Gateway is running on port 3333
```

**Example output (issues found):**
```
Mini-Passy Doctor

✓ Node.js version: v20.10.0
✗ No .env file found
  Run: mini-passy config init
✗ No API keys configured
  Add at least one provider API key to .env
⚠ Gateway not running (run: mini-passy start)
```

## Configuration

The CLI uses a `.env` file in your current directory. Example:

```env
# Required: At least one provider
PROVIDER_OPENAI_URL=https://api.openai.com
PROVIDER_OPENAI_KEY=sk-your-openai-key

PROVIDER_ANTHROPIC_URL=https://api.anthropic.com
PROVIDER_ANTHROPIC_KEY=sk-ant-your-anthropic-key

PROVIDER_NEBIUS_URL=https://api.studio.nebius.ai
PROVIDER_NEBIUS_KEY=your-nebius-key

PROVIDER_DEEPINFRA_URL=https://api.deepinfra.com
PROVIDER_DEEPINFRA_KEY=your-deepinfra-key

# Optional: Port (default: 3333)
PORT=3333
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
    "model": "gpt4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Streaming chat
```bash
curl -X POST http://localhost:3333/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer any-key" \
  -d '{
    "model": "gpt4o",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```

## Troubleshooting

### "Gateway not running"
Make sure you started the server:
```bash
mini-passy start
```

### "No API keys configured"
Create a `.env` file and add at least one provider:
```bash
mini-passy config init
# Then edit .env to add your keys
```

### Port already in use
Use a different port:
```bash
mini-passy start -p 8080
```

## License

MIT
