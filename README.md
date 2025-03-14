# MCP Postman Server

This project is a Cloudflare Workers MCP (Model Context Protocol) server. It allows for executing remote procedure calls (RPCs) from clients that support the MCP protocol.

## Features

- **Seamless AI Integration**: Connect directly with Claude AI to execute API calls
- **SOLID Principles**: Built following best practices for maintainable code
- **Cloudflare Workers**: Global deployment with fast response times
- **Easy to Extend**: Simple framework for adding new API methods

## Current Methods

The server currently supports the following methods:

### `sayHello(name: string): string`
A simple greeting method that returns a welcome message with the provided name.

Example:
```json
{
  "name": "John"
}
```
Returns: `"Hello from an MCP Worker, John!"`

### `reverseString(input: string): string`
Reverses the characters in a given string.

Example:
```json
{
  "input": "Hello World"
}
```
Returns: `"dlroW olleH"`

## Usage with Claude

Simply ask Claude to use this MCP server:

- "Use mcp-postman to say hello to [name]"
- "Use mcp-postman to reverse the string '[text]'"

## Documentation

For detailed information on:
- [Setting up an MCP server](./docs/comprehensive-guide.md#1-prerequisites)
- [API Token Configuration](./docs/comprehensive-guide.md#4-api-token-configuration)
- [Claude Desktop Integration](./docs/comprehensive-guide.md#6-claude-desktop-integration)
- [Extending the Server](./docs/comprehensive-guide.md#8-extending-your-mcp-server)
- [Troubleshooting](./docs/comprehensive-guide.md#9-common-issues-and-troubleshooting)

See our [Comprehensive Guide](./docs/comprehensive-guide.md).

## Setup

1. **Prerequisites:**
   - Node.js and npm installed
   - Cloudflare account with API token

2. **Environment Setup:**
   ```bash
   # Set your Cloudflare API token
   export CLOUDFLARE_API_TOKEN=your_token_here
   
   # Install dependencies
   npm install
   ```

3. **Development:**
   ```bash
   # Start local development server
   npm run dev
   ```

4. **Deployment:**
   ```bash
   # Deploy to Cloudflare Workers
   npm run deploy
   ```

## Code Architecture

This project follows SOLID principles:

- **Single Responsibility Principle**: Each method handles one specific task
- **Open/Closed Principle**: The code is designed to be extended without modification
- **Liskov Substitution Principle**: Interfaces can be substituted for their implementations
- **Interface Segregation Principle**: Methods are grouped into specific interfaces
- **Dependency Inversion Principle**: High-level modules depend on abstractions

## Configuration

The MCP server uses a shared secret for authentication. This is stored in:
- `.dev.vars` for local development
- Cloudflare secrets for production

## License

[Add your license information here] 