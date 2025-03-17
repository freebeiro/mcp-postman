import { WorkerEntrypoint } from 'cloudflare:workers'
import { ProxyToSelf } from 'workers-mcp'

export interface Env {
  SHARED_SECRET: string;
  POSTMAN_API_KEY: string;
}

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
   * Creates a new Postman collection.
   * @param name {string} the name of the new collection.
   * @param description {string} optional description for the collection.
   * @return {Promise<string>} the created collection data as a formatted string.
   * @mcp
   */
  async createCollection(name: string, description?: string): Promise<string> {
    const collection = {
      info: {
        name,
        description,
        schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json"
      },
      item: []
    };

    const response = await fetch('https://api.getpostman.com/collections', {
      method: 'POST',
      headers: {
        'X-Api-Key': this.env.POSTMAN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ collection })
    });

    if (!response.ok) {
      throw new Error('Failed to create collection');
    }

    const data = await response.json();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Adds a request to a Postman collection.
   * @param collectionId {string} the ID of the collection to add the request to.
   * @param name {string} name of the request.
   * @param method {string} HTTP method (GET, POST, PUT, DELETE, etc.).
   * @param url {string} the URL to send the request to.
   * @param description {string} optional description of the request.
   * @param body {object} optional request body.
   * @return {Promise<string>} the updated collection data as a formatted string.
   * @mcp
   */
  async addRequest(
    collectionId: string,
    name: string,
    method: string,
    url: string,
    description?: string,
    body?: object
  ): Promise<string> {
    // First get the current collection
    const response = await fetch(`https://api.getpostman.com/collections/${collectionId}`, {
      headers: {
        'X-Api-Key': this.env.POSTMAN_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve collection with ID ${collectionId}`);
    }

    const data = await response.json();
    const collection = data.collection;

    // Create the new request
    const request = {
      name,
      request: {
        method,
        header: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ],
        url,
        description,
        body: body ? {
          mode: 'raw',
          raw: JSON.stringify(body),
          options: {
            raw: {
              language: 'json'
            }
          }
        } : undefined
      }
    };

    // Add the request to the collection
    collection.item.push(request);

    // Update the collection
    const updateResponse = await fetch(`https://api.getpostman.com/collections/${collectionId}`, {
      method: 'PUT',
      headers: {
        'X-Api-Key': this.env.POSTMAN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ collection })
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to add request to collection');
    }

    const updateData = await updateResponse.json();
    return JSON.stringify(updateData, null, 2);
  }

  /**
   * @ignore
   **/
  async fetch(request: Request): Promise<Response> {
    return new ProxyToSelf(this).fetch(request)
  }
}
