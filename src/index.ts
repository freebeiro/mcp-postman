import { WorkerEntrypoint } from 'cloudflare:workers'
import { ProxyToSelf } from 'workers-mcp'

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
export default class MyWorker extends WorkerEntrypoint<Env> {
  /**
   * A warm, friendly greeting from your new Workers MCP server.
   * @param name {string} the name of the person we are greeting.
   * @return {string} the contents of our greeting.
   */
  sayHello(name: string): string {
    return `Hello from an MCP Worker, ${name}!`
  }

  /**
   * Reverses the characters in a string.
   * @param input {string} the string to reverse.
   * @return {string} the reversed string.
   */
  reverseString(input: string): string {
    return input.split('').reverse().join('');
  }

  /**
   * Gets a Postman collection by ID.
   * @param collectionId {string} the ID of the collection to retrieve.
   * @return {Promise<string>} the collection data as a formatted string.
   * @mcp
   */
  async getCollection(collectionId: string): Promise<string> {
    const response = await fetch(`https://api.getpostman.com/collections/${collectionId}`, {
      headers: {
        'X-Api-Key': this.env.POSTMAN_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve collection with ID ${collectionId}`);
    }

    const data = await response.json();
    return JSON.stringify(data, null, 2);
  }

  /**
   * @ignore
   **/
  async fetch(request: Request): Promise<Response> {
    return new ProxyToSelf(this).fetch(request)
  }
}
