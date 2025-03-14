# MCP Postman Server

This project is a Model Context Protocol (MCP) server built with Cloudflare Workers. It provides a simple API that Claude and other AI assistants can use directly.

## Current Features

The MCP server currently supports the following methods:

- `sayHello(name: string)`: Returns a greeting message with the provided name
- `reverseString(input: string)`: Reverses the characters in a string

## Getting Started

To use this MCP server with Claude Desktop:

1. Simply ask Claude to:
   - "Use mcp-postman to say hello to me"
   - "Use mcp-postman to reverse the string 'Hello World'"

## Development

### Prerequisites

- Node.js and npm
- Cloudflare account with Workers access
- Claude Desktop (for testing)

### Local Development

```bash
# Clone the repository
git clone [repository-url]
cd mcp-postman

# Install dependencies
npm install

# Run local development server
npm run dev
```

### Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## Documentation

For detailed information on setting up and extending MCP servers, see our [Comprehensive Guide](./comprehensive-guide.md).

## License

[Add license information]

## Contributing

[Add contribution guidelines] 