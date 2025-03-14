# Postman MCP Server Examples

This document provides examples of how to use the Postman MCP Server with Claude AI in your applications.

## Prerequisites

1. Ensure you have the Postman MCP Server deployed on Cloudflare Workers
2. Configure your Postman API key in the server environment
3. Make sure your application can make requests to the MCP server

## Basic Methods

These examples demonstrate the basic utility functions available in the MCP server.

### Greeting Method

```
Claude, please use the mcp-postman server to say hello to me.
```

Claude will respond with a greeting by calling the `mcp__sayHello` method.

```
Claude, please use the mcp-postman server to reverse the string "Project X".
```

Claude will respond with "X tcejorP" by calling the `mcp__reverseString` method.

## Postman Collection Methods

### Get All Collections

To retrieve all collections from your Postman account:

```
Claude, please use the mcp-postman server to get all my Postman collections.
```

Claude will call the `mcp__get_collections` method, which will return a list of your collections including their IDs and names.

### Get Collection Details

To retrieve details for a specific collection, you'll need its ID (obtained from the previous step):

```
Claude, please use the mcp-postman server to get details for my Postman collection with ID "12345abc-67de-89fg-hijk-lmnopqrstuv".
```

Replace the ID with an actual collection ID from your Postman account. Claude will call the `mcp__get_collection` method with the provided ID.

### Create a New Collection

To create a new collection in your Postman account:

```
Claude, please use the mcp-postman server to create a new collection named "Project X API Tests" with a description explaining that it contains tests for my Project X API endpoints.
```

### Add a Request to a Collection

To add a new request to an existing collection:

```
Claude, please use the mcp-postman server to add a request to test the user authentication endpoint to my "Project X API Tests" collection. It should be a POST request to /api/auth/login with appropriate tests to verify the response.
```

## Postman Environment Methods

### Get All Environments

To retrieve all environments from your Postman account:

```
Claude, please use the mcp-postman server to get all my Postman environments.
```

Claude will call the `mcp__get_environments` method, which will return a list of your environments.

### Get Environment Details

To retrieve details for a specific environment:

```
Claude, please use the mcp-postman server to get details for my Postman environment with ID "98765zyx-wvut-srqp-onml-kjihgfedcba".
```

Replace the ID with an actual environment ID from your Postman account. Claude will call the `mcp__get_environment` method with the provided ID.

### Create a New Environment

To create a new environment with variables:

```
Claude, please use the mcp-postman server to create a new environment named "Project X Development" with variables for baseUrl, apiKey, and testUserId.
```

## Running Collections

### Run a Collection

To run a collection and get test results:

```
Claude, please use the mcp-postman server to run my "Project X API Tests" collection using the "Project X Development" environment and show me the results.
```

## Complete Workflow Examples

### Create a Test Suite for Project X API

This example demonstrates how to create a complete test suite for your Project X API:

1. First, create a new collection:

```
Claude, please use the mcp-postman server to create a new collection named "Project X API Tests" with a description explaining that it contains tests for my Project X API endpoints.
```

2. Then, create a development environment:

```
Claude, please use the mcp-postman server to create a new environment named "Project X Development" with variables for baseUrl, apiKey, and testUserId.
```

3. Add requests with tests to the collection:

```
Claude, please use the mcp-postman server to add a request to test the user authentication endpoint to my "Project X API Tests" collection. It should be a POST request to /api/auth/login with appropriate tests to verify the response.
```

4. Run the collection to execute the tests:

```
Claude, please use the mcp-postman server to run my "Project X API Tests" collection using the "Project X Development" environment and show me the results.
```

### API Documentation Generation

You can use the Postman MCP server to create comprehensive API documentation for Project X:

1. Create a documentation collection:

```
Claude, please create a new Postman collection called "Project X API Documentation" that will serve as our API reference.
```

2. Add documented requests for each endpoint:

```
Claude, please add a detailed request for the user registration endpoint to our documentation collection, including all parameters, request body format, and response examples.
```

3. Organize the collection with folders:

```
Claude, please organize our documentation collection by adding folders for Authentication, User Management, and Data Operations.
```

## Integration with Project X CI/CD

You can integrate the Postman MCP server with your Project X CI/CD pipeline:

1. Create environment configurations for each deployment stage
2. Run automated tests against each environment after deployment
3. Generate test reports for quality assurance 