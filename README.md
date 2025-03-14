# Postman MCP Server

A Cloudflare Worker that provides API access to Postman collections and environments via the Claude AI MCP (Model Control Plane) interface.

## Overview

This server allows Claude AI to interact with your Postman collections and environments to perform various operations, including:

- Retrieving collections and environments
- Creating new collections and environments
- Adding requests to collections
- Running collections and getting test results

This enables Claude to assist with API testing, documentation, and management tasks in your workflows.

## Current Methods

The Postman MCP Server provides the following methods:

### Basic Utility Methods
- `mcp__sayHello(name)` - Returns a greeting with the provided name
- `mcp__reverseString(input)` - Reverses the characters in a string

### Collection Methods
- `mcp__get_collections()` - Gets all collections in your Postman account
- `mcp__get_collection(collectionId)` - Gets details for a specific collection
- `mcp__create_collection(name, description)` - Creates a new collection
- `mcp__add_request(collectionId, name, method, url, ...)` - Adds a request to a collection

### Environment Methods
- `mcp__get_environments()` - Gets all environments in your Postman account
- `mcp__get_environment(environmentId)` - Gets details for a specific environment
- `mcp__create_environment(name, variables)` - Creates a new environment with variables

### Test Execution
- `mcp__run_collection(collectionId, environmentId)` - Runs a collection with an optional environment

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your Postman API key
4. Deploy to Cloudflare Workers: `wrangler deploy`

## Development

To run the server locally for development:

```bash
npm run dev
```

This will start the server locally using wrangler.

## Project Structure

- `/src` - Source code
  - `/interfaces` - TypeScript interfaces
  - `/services` - Service classes
  - `index.ts` - Main worker entry point
- `/test` - Unit tests
- `/examples` - Example usage
- `/docs` - Additional documentation

## Examples

See the [examples/postman-examples.md](examples/postman-examples.md) file for detailed examples of how to use the Postman MCP Server with Claude AI.

## Deployment

To deploy to Cloudflare Workers:

```bash
npm run deploy
```

Make sure your `wrangler.toml` file is configured properly.

## Security

This server requires a Postman API key to function. Ensure that your key is stored securely in the Cloudflare Workers environment variables and not committed to version control.

## Contributing

1. Follow the [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)
2. Adhere to [SOLID_PRINCIPLES.md](SOLID_PRINCIPLES.md) for code design

## License

MIT License 