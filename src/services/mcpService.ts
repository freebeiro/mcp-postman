/**
 * Service for handling MCP function calls
 * Follows the Single Responsibility Principle by focusing only on MCP function handling
 */
import { IMcpFunctionCall, IMcpFunctionDefinition, IMcpFunctionResponse } from '../interfaces/mcp';
import { PostmanService } from './postmanService';

/**
 * MCP Service for handling MCP function calls related to Postman
 */
export class McpService {
  private postmanService: PostmanService;
  
  /**
   * MCP function definitions
   * Following the Open/Closed Principle, we can extend this array with new functions
   * without modifying existing code
   */
  private mcpFunctions: IMcpFunctionDefinition[] = [
    {
      name: 'mcp__sayHello',
      description: 'A warm, friendly greeting from your new Workers MCP server.',
      parameters: {
        properties: {
          name: {
            description: 'the name of the person we are greeting.',
            type: 'string'
          }
        },
        required: ['name'],
        type: 'object'
      }
    },
    {
      name: 'mcp__reverseString',
      description: 'Reverses the characters in a string.',
      parameters: {
        properties: {
          input: {
            description: 'the string to reverse.',
            type: 'string'
          }
        },
        required: ['input'],
        type: 'object'
      }
    },
    {
      name: 'mcp__get_collections',
      description: 'Get all Postman collections for the current user.',
      parameters: {
        properties: {},
        required: [],
        type: 'object'
      }
    },
    {
      name: 'mcp__get_collection',
      description: 'Get a specific Postman collection by ID.',
      parameters: {
        properties: {
          collectionId: {
            description: 'The ID of the collection to retrieve.',
            type: 'string'
          }
        },
        required: ['collectionId'],
        type: 'object'
      }
    },
    {
      name: 'mcp__create_collection',
      description: 'Create a new Postman collection.',
      parameters: {
        properties: {
          name: {
            description: 'The name of the collection to create.',
            type: 'string'
          },
          description: {
            description: 'Optional description for the collection.',
            type: 'string'
          }
        },
        required: ['name'],
        type: 'object'
      }
    },
    {
      name: 'mcp__add_request',
      description: 'Add a request to an existing Postman collection.',
      parameters: {
        properties: {
          collectionId: {
            description: 'The ID of the collection to add the request to.',
            type: 'string'
          },
          name: {
            description: 'The name of the request.',
            type: 'string'
          },
          method: {
            description: 'The HTTP method for the request (GET, POST, etc.).',
            type: 'string'
          },
          url: {
            description: 'The URL for the request.',
            type: 'string'
          },
          description: {
            description: 'Optional description for the request.',
            type: 'string'
          },
          headers: {
            description: 'Optional headers for the request.',
            type: 'object'
          },
          body: {
            description: 'Optional body for the request.',
            type: 'object'
          },
          tests: {
            description: 'Optional JavaScript test code for the request.',
            type: 'string'
          },
          folderPath: {
            description: 'Optional folder path where the request should be added (e.g. "Folder/Subfolder").',
            type: 'string'
          }
        },
        required: ['collectionId', 'name', 'method', 'url'],
        type: 'object'
      }
    },
    {
      name: 'mcp__get_environments',
      description: 'Get all Postman environments for the current user.',
      parameters: {
        properties: {},
        required: [],
        type: 'object'
      }
    },
    {
      name: 'mcp__get_environment',
      description: 'Get a specific Postman environment by ID.',
      parameters: {
        properties: {
          environmentId: {
            description: 'The ID of the environment to retrieve.',
            type: 'string'
          }
        },
        required: ['environmentId'],
        type: 'object'
      }
    },
    {
      name: 'mcp__create_environment',
      description: 'Create a new Postman environment.',
      parameters: {
        properties: {
          name: {
            description: 'The name of the environment to create.',
            type: 'string'
          },
          variables: {
            description: 'Array of key-value pairs for environment variables.',
            type: 'object'
          }
        },
        required: ['name', 'variables'],
        type: 'object'
      }
    },
    {
      name: 'mcp__run_collection',
      description: 'Run a Postman collection and return the results.',
      parameters: {
        properties: {
          collectionId: {
            description: 'The ID of the collection to run.',
            type: 'string'
          },
          environmentId: {
            description: 'Optional ID of the environment to use for the run.',
            type: 'string'
          }
        },
        required: ['collectionId'],
        type: 'object'
      }
    }
  ];

  /**
   * Creates a new instance of the McpService
   * @param postmanApiKey Postman API key
   */
  constructor(postmanApiKey: string) {
    if (!postmanApiKey) {
      throw new Error('Postman API key is required');
    }
    this.postmanService = new PostmanService(postmanApiKey);
  }

  /**
   * Get all available MCP function definitions
   * @returns Array of MCP function definitions
   */
  getFunctionDefinitions(): IMcpFunctionDefinition[] {
    return this.mcpFunctions;
  }

  /**
   * Execute an MCP function call
   * @param functionCall The function call to execute
   * @returns Promise with the function response
   */
  async executeFunction(functionCall: IMcpFunctionCall): Promise<IMcpFunctionResponse> {
    try {
      const { name, parameters } = functionCall;
      
      // Convert array of named parameters to an object
      const paramsObject = parameters.reduce((obj, param) => {
        obj[param.name] = param.value;
        return obj;
      }, {} as Record<string, any>);

      switch (name) {
        case 'mcp__sayHello':
          return this.handleSayHello(paramsObject.name);
        
        case 'mcp__reverseString':
          return this.handleReverseString(paramsObject.input);
          
        case 'mcp__get_collections':
          return this.handleGetCollections();
          
        case 'mcp__get_collection':
          return this.handleGetCollection(paramsObject.collectionId);
          
        case 'mcp__create_collection':
          return this.handleCreateCollection(paramsObject.name, paramsObject.description);
          
        case 'mcp__add_request':
          return this.handleAddRequest(
            paramsObject.collectionId,
            {
              name: paramsObject.name,
              method: paramsObject.method,
              url: paramsObject.url,
              description: paramsObject.description,
              headers: paramsObject.headers,
              body: paramsObject.body,
              tests: paramsObject.tests
            },
            paramsObject.folderPath
          );
          
        case 'mcp__get_environments':
          return this.handleGetEnvironments();
          
        case 'mcp__get_environment':
          return this.handleGetEnvironment(paramsObject.environmentId);
          
        case 'mcp__create_environment':
          return this.handleCreateEnvironment(paramsObject.name, paramsObject.variables);
          
        case 'mcp__run_collection':
          return this.handleRunCollection(paramsObject.collectionId, paramsObject.environmentId);
          
        default:
          return {
            status: 'error',
            error: `Function ${name} not found`,
            content: null
          };
      }
    } catch (error) {
      console.error('Error executing MCP function:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }

  /**
   * Handle the sayHello function
   * @param name Person's name to greet
   * @returns MCP function response
   * @private
   */
  private handleSayHello(name: string): IMcpFunctionResponse {
    return {
      status: 'success',
      content: `Hello, ${name}! Welcome to the Postman MCP Server.`
    };
  }

  /**
   * Handle the reverseString function
   * @param input String to reverse
   * @returns MCP function response
   * @private
   */
  private handleReverseString(input: string): IMcpFunctionResponse {
    return {
      status: 'success',
      content: input.split('').reverse().join('')
    };
  }

  /**
   * Handle the getCollections function
   * @returns Promise with MCP function response
   * @private
   */
  private async handleGetCollections(): Promise<IMcpFunctionResponse> {
    try {
      const collections = await this.postmanService.getCollections();
      return {
        status: 'success',
        content: collections
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }

  /**
   * Handle the getCollection function
   * @param collectionId Collection ID to retrieve
   * @returns Promise with MCP function response
   * @private
   */
  private async handleGetCollection(collectionId: string): Promise<IMcpFunctionResponse> {
    try {
      if (!collectionId) {
        throw new Error('Collection ID is required');
      }
      
      const collection = await this.postmanService.getCollection(collectionId);
      return {
        status: 'success',
        content: collection
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }

  /**
   * Handle the createCollection function
   * @param name Collection name
   * @param description Collection description (optional)
   * @returns Promise with MCP function response
   * @private
   */
  private async handleCreateCollection(name: string, description?: string): Promise<IMcpFunctionResponse> {
    try {
      if (!name) {
        throw new Error('Collection name is required');
      }
      
      const result = await this.postmanService.createCollection(name, description);
      return {
        status: 'success',
        content: result
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }

  /**
   * Handle the addRequest function
   * @param collectionId Collection ID
   * @param request Request details
   * @param folderPath Folder path (optional)
   * @returns Promise with MCP function response
   * @private
   */
  private async handleAddRequest(
    collectionId: string,
    request: {
      name: string;
      method: string;
      url: string;
      description?: string;
      headers?: Array<{ key: string; value: string }>;
      body?: any;
      tests?: string;
    },
    folderPath?: string
  ): Promise<IMcpFunctionResponse> {
    try {
      if (!collectionId) {
        throw new Error('Collection ID is required');
      }
      if (!request.name || !request.method || !request.url) {
        throw new Error('Request name, method, and URL are required');
      }
      
      const result = await this.postmanService.addRequestToCollection(collectionId, request, folderPath);
      return {
        status: 'success',
        content: result
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }

  /**
   * Handle the getEnvironments function
   * @returns Promise with MCP function response
   * @private
   */
  private async handleGetEnvironments(): Promise<IMcpFunctionResponse> {
    try {
      const environments = await this.postmanService.getEnvironments();
      return {
        status: 'success',
        content: environments
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }

  /**
   * Handle the getEnvironment function
   * @param environmentId Environment ID to retrieve
   * @returns Promise with MCP function response
   * @private
   */
  private async handleGetEnvironment(environmentId: string): Promise<IMcpFunctionResponse> {
    try {
      if (!environmentId) {
        throw new Error('Environment ID is required');
      }
      
      const environment = await this.postmanService.getEnvironment(environmentId);
      return {
        status: 'success',
        content: environment
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }

  /**
   * Handle the createEnvironment function
   * @param name Environment name
   * @param variables Environment variables
   * @returns Promise with MCP function response
   * @private
   */
  private async handleCreateEnvironment(
    name: string,
    variables: Array<{ key: string; value: string; type?: string }>
  ): Promise<IMcpFunctionResponse> {
    try {
      if (!name) {
        throw new Error('Environment name is required');
      }
      
      const result = await this.postmanService.createEnvironment(name, variables);
      return {
        status: 'success',
        content: result
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }

  /**
   * Handle the runCollection function
   * @param collectionId Collection ID to run
   * @param environmentId Environment ID to use (optional)
   * @returns Promise with MCP function response
   * @private
   */
  private async handleRunCollection(collectionId: string, environmentId?: string): Promise<IMcpFunctionResponse> {
    try {
      if (!collectionId) {
        throw new Error('Collection ID is required');
      }
      
      const result = await this.postmanService.runCollection(collectionId, environmentId);
      return {
        status: 'success',
        content: result
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        content: null
      };
    }
  }
} 