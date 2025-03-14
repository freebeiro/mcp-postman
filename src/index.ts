import { WorkerEntrypoint } from 'cloudflare:workers'
import { ProxyToSelf } from 'workers-mcp'
import { PostmanService } from './services/postmanService'
import { McpService } from './services/mcpService'
import { IMcpFunctionCall, IMcpFunctionResponse } from './interfaces/mcp'

// Interface for environment variables
export interface Env {
  // Postman API key from environment variables
  POSTMAN_API_KEY: string;
  // Required by ProxyToSelf
  SHARED_SECRET: string;
}

/**
 * Postman MCP Server - Cloudflare Worker entry point
 */
export class PostmanMcpWorker {
  private mcpService: McpService;

  /**
   * Create a new PostmanMcpWorker instance
   * @param env Worker environment
   */
  constructor(env: any) {
    // Make sure the POSTMAN_API_KEY environment variable is set
    if (!env.POSTMAN_API_KEY) {
      throw new Error('POSTMAN_API_KEY environment variable is required');
    }
    
    // Initialize the MCP service with the Postman API key
    this.mcpService = new McpService(env.POSTMAN_API_KEY);
  }

  /**
   * Handle fetch requests to the Worker
   * @param request Fetch request
   * @returns Response
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    try {
      // Handle options requests for CORS
      if (request.method === 'OPTIONS') {
        return this.handleOptions();
      }

      // Route requests based on path
      switch (url.pathname) {
        case '/mcp/functions':
          // Return the available MCP functions
          return this.handleGetFunctions();
        
        case '/mcp/call':
          // Execute an MCP function call
          if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
          }
          return this.handleFunctionCall(request);
        
        default:
          // Return the home page
          return this.handleHome();
      }
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
  }

  /**
   * Handle CORS preflight requests
   * @returns Response with CORS headers
   * @private
   */
  private handleOptions(): Response {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  /**
   * Handle the home page request
   * @returns Response with home page content
   * @private
   */
  private handleHome(): Response {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Postman MCP Server</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
          }
          h1 {
            color: #FF6C37;
            border-bottom: 2px solid #FF6C37;
            padding-bottom: 0.5rem;
          }
          h2 {
            margin-top: 2rem;
            color: #333;
          }
          code {
            background-color: #f4f4f4;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: monospace;
          }
          pre {
            background-color: #f4f4f4;
            padding: 1rem;
            border-radius: 5px;
            overflow-x: auto;
          }
          .endpoint {
            margin-bottom: 1.5rem;
          }
          .method {
            font-weight: bold;
            color: #FF6C37;
          }
        </style>
      </head>
      <body>
        <h1>Postman MCP Server</h1>
        <p>Welcome to the Postman MCP Server, a Cloudflare Worker that provides access to Postman API through Claude AI.</p>
        
        <h2>Available Endpoints</h2>
        
        <div class="endpoint">
          <p><span class="method">GET</span> <code>/mcp/functions</code></p>
          <p>Returns a list of available MCP functions.</p>
        </div>
        
        <div class="endpoint">
          <p><span class="method">POST</span> <code>/mcp/call</code></p>
          <p>Executes an MCP function.</p>
          <p>Example request body:</p>
          <pre>{
  "name": "mcp__get_collections",
  "parameters": []
}</pre>
        </div>
        
        <h2>Available Functions</h2>
        <p>This server provides access to the following Postman API functions:</p>
        <ul>
          <li><code>mcp__get_collections</code> - Get all Postman collections</li>
          <li><code>mcp__get_collection</code> - Get a specific Postman collection</li>
          <li><code>mcp__create_collection</code> - Create a new Postman collection</li>
          <li><code>mcp__add_request</code> - Add a request to a collection</li>
          <li><code>mcp__get_environments</code> - Get all Postman environments</li>
          <li><code>mcp__get_environment</code> - Get a specific Postman environment</li>
          <li><code>mcp__create_environment</code> - Create a new Postman environment</li>
          <li><code>mcp__run_collection</code> - Run a Postman collection</li>
        </ul>
        
        <p>Additionally, the following utility functions are available:</p>
        <ul>
          <li><code>mcp__sayHello</code> - Simple greeting function</li>
          <li><code>mcp__reverseString</code> - Reverse a string</li>
        </ul>
        
        <h2>Documentation</h2>
        <p>For more information on how to use this server with Claude AI, refer to the <a href="https://github.com/freebeiro/mcp-postman">GitHub repository</a>.</p>
      </body>
      </html>
    `;
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  /**
   * Handle get functions request
   * @returns Response with available MCP functions
   * @private
   */
  private handleGetFunctions(): Response {
    const functions = this.mcpService.getFunctionDefinitions();
    return new Response(JSON.stringify(functions), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  /**
   * Handle MCP function call
   * @param request Fetch request
   * @returns Response with function result
   * @private
   */
  private async handleFunctionCall(request: Request): Promise<Response> {
    try {
      const data = await request.json() as {
        name?: string;
        parameters?: Array<{ name: string; value: any }> | any[];
      };
      
      if (!data.name) {
        return new Response(
          JSON.stringify({ error: 'Function name is required' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
      
      // Normalize parameters to ensure they are in the correct format
      const parameters = data.parameters || [];
      const functionCall: IMcpFunctionCall = {
        name: data.name,
        parameters: Array.isArray(parameters) ? parameters : [],
      };
      
      // Execute the function call
      const result: IMcpFunctionResponse = await this.mcpService.executeFunction(functionCall);
      
      return new Response(JSON.stringify(result), {
        status: result.status === 'error' ? 400 : 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Error handling function call:', error);
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  }
}

// Export the default Worker handler for Cloudflare Workers
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const worker = new PostmanMcpWorker(env);
    return worker.fetch(request);
  },
};
