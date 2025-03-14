# Postman MCP Server

A Model Context Protocol (MCP) server built with Cloudflare Workers that provides Postman/Newman capabilities to AI assistants like Claude.

## Overview

The Postman MCP Server is a Cloudflare Worker that provides a simple interface for AI assistants to:

1. **Test Scenario Management** - Create and manage test scenarios using Postman collections
2. **Mock Server Generation** - Generate mock servers based on Postman collections
3. **API Testing** - Run tests against APIs using Newman (Postman's command-line collection runner)

This server is designed to be used with Claude and other AI assistants that support the Model Context Protocol (MCP).

## Features

- **Seamless AI Integration**: Connect directly with Claude AI to execute Postman operations
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

## Getting Started

### Prerequisites

- Node.js and npm
- Cloudflare account with Workers access
- Claude Desktop (for testing)
- Postman API key

### Environment Setup

1. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Cloudflare API token and Postman API key.

3. Install dependencies:
   ```bash
   npm install
   ```

## Development

```bash
# Start local development server
npm run dev
```

## Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## Documentation

For detailed information on:
- [Setting up an MCP server](./docs/comprehensive-guide.md#1-prerequisites)
- [API Token Configuration](./docs/comprehensive-guide.md#4-api-token-configuration)
- [Claude Desktop Integration](./docs/comprehensive-guide.md#6-claude-desktop-integration)
- [Extending the Server](./docs/comprehensive-guide.md#8-extending-your-mcp-server)
- [Troubleshooting](./docs/comprehensive-guide.md#9-common-issues-and-troubleshooting)

See our [Comprehensive Guide](./docs/comprehensive-guide.md).

## Project Structure

```
mcp-postman/
├── docs/               # Documentation
│   ├── README.md            # Docs overview
│   └── comprehensive-guide.md # Detailed setup guide
├── src/                # Source code
│   ├── interfaces/     # TypeScript interfaces
│   ├── services/       # Business logic services
│   └── index.ts        # Main worker entry point
├── test/               # Tests
├── .env                # Environment variables (not in git)
├── .env.example        # Example environment variables
├── DEVELOPMENT_GUIDELINES.md # Development guidelines
├── SOLID_PRINCIPLES.md # SOLID principles guide
└── package.json        # Project dependencies
```

## Development Guidelines

This project follows strict development guidelines and SOLID principles to ensure maintainability and high-quality code. Please refer to the following documents before contributing:

- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md)
- [SOLID Principles Guide](./SOLID_PRINCIPLES.md)

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