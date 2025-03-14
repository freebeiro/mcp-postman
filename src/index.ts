import { WorkerEntrypoint } from 'cloudflare:workers'
import { ProxyToSelf } from 'workers-mcp'

// Define interfaces for our service methods to follow the Interface Segregation Principle
interface GreetingService {
  sayHello(name: string): string;
}

interface StringManipulationService {
  reverseString(input: string): string;
}

// Implement a Worker that combines multiple services (Interface Segregation Principle)
export default class MyWorker extends WorkerEntrypoint<Env> implements GreetingService, StringManipulationService {
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
   * @ignore
   **/
  async fetch(request: Request): Promise<Response> {
    // Use dependency injection by passing 'this' to ProxyToSelf (Dependency Inversion Principle)
    return new ProxyToSelf(this).fetch(request)
  }
}
