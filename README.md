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
# Then start the gateway
mini-passy start
```

## Commands

### `mini-passy start` (default)

Start the gateway server.

```bash
mini-passy start              # Start on default port 3333
mini-passy start -p 8080      # Start on custom port
mini-passy start -d           # Start detached (background)
mini-passy                    # Default command is start
```

### `mini-passy models`

List available models.

```bash
mini-passy models             # Pretty print models
mini-passy models --json      # JSON output
```

### `mini-passy config`

Manage configuration.

```bash
mini-passy config init                    # Create .env template
mini-passy config show                    # Show current .env
mini-passy config set PORT 8080           # Set config value
mini-passy config set PROVIDER_OPENAI_KEY sk-xxx
```

### `mini-passy doctor`

Diagnose setup issues.

```bash
mini-passy doctor
```

## Configuration

Create a `.env` file in your project root:

```env
# Provider Configuration
PROVIDER_OPENAI_URL=https://api.openai.com
PROVIDER_OPENAI_KEY=sk-your-key

PROVIDER_ANTHROPIC_URL=https://api.anthropic.com
PROVIDER_ANTHROPIC_KEY=sk-ant-your-key

# Port
PORT=3333
```

## Using the Gateway

Once running, the gateway is available at `http://localhost:3333`:

```bash
# List models
curl http://localhost:3333/v1/models

# Chat completion
curl -X POST http://localhost:3333/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-key" \
  -d '{"model": "gpt4o", "messages": [{"role": "user", "content": "Hello"}]}'
```

## License

MIT
