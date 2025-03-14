import { PostmanService } from '../src/services/postmanService';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('PostmanService', () => {
  let postmanService: PostmanService;
  let fetchStub: sinon.SinonStub;
  
  const mockApiKey = 'test-api-key';
  
  beforeEach(() => {
    // Create a global fetch stub
    fetchStub = sinon.stub(global, 'fetch');
    
    // Initialize the service with mock API key
    postmanService = new PostmanService(mockApiKey);
  });
  
  afterEach(() => {
    // Restore the stub after each test
    fetchStub.restore();
  });
  
  describe('getCollections', () => {
    it('should fetch collections from Postman API', async () => {
      // Mock response
      const mockResponse = {
        collections: [
          { uid: 'col1', name: 'Collection 1' },
          { uid: 'col2', name: 'Collection 2' }
        ]
      };
      
      // Configure the fetch stub to return the mock response
      fetchStub.resolves({
        ok: true,
        json: async () => ({ data: mockResponse })
      } as Response);
      
      // Call the method
      const result = await postmanService.getCollections();
      
      // Verify the result
      expect(result.data).to.deep.equal(mockResponse);
      
      // Verify fetch was called with correct arguments
      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal('https://api.getpostman.com/collections');
      expect(fetchStub.firstCall.args[1]).to.deep.include({
        method: 'GET',
        headers: {
          'X-Api-Key': mockApiKey,
          'Content-Type': 'application/json'
        }
      });
    });
  });
  
  describe('getCollection', () => {
    it('should fetch a specific collection by ID', async () => {
      const collectionId = 'test-collection-id';
      
      // Mock response
      const mockResponse = {
        collection: {
          info: { name: 'Test Collection' },
          item: []
        }
      };
      
      // Configure the fetch stub
      fetchStub.resolves({
        ok: true,
        json: async () => ({ data: mockResponse })
      } as Response);
      
      // Call the method
      const result = await postmanService.getCollection(collectionId);
      
      // Verify the result
      expect(result.data).to.deep.equal(mockResponse);
      
      // Verify fetch was called correctly
      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal(`https://api.getpostman.com/collections/${collectionId}`);
    });
    
    it('should throw an error if collection ID is not provided', async () => {
      try {
        await postmanService.getCollection('');
        // If we reach here, the test has failed
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.an('Error');
        expect((error as Error).message).to.equal('Collection ID is required');
      }
    });
  });
  
  describe('createCollection', () => {
    it('should create a new collection', async () => {
      const name = 'New Collection';
      const description = 'Test collection description';
      
      // Mock response
      const mockResponse = {
        collection: {
          id: 'new-col-id',
          name: name,
          description: description
        }
      };
      
      // Configure the fetch stub
      fetchStub.resolves({
        ok: true,
        json: async () => ({ data: mockResponse })
      } as Response);
      
      // Call the method
      const result = await postmanService.createCollection(name, description);
      
      // Verify the result
      expect(result.data).to.deep.equal(mockResponse);
      
      // Verify fetch was called correctly
      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal('https://api.getpostman.com/collections');
      expect(fetchStub.firstCall.args[1]).to.have.property('method', 'POST');
      
      // Verify the request body
      const requestBody = JSON.parse(fetchStub.firstCall.args[1].body as string);
      expect(requestBody.collection.info.name).to.equal(name);
      expect(requestBody.collection.info.description).to.equal(description);
    });
    
    it('should throw an error if name is not provided', async () => {
      try {
        await postmanService.createCollection('');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.an('Error');
        expect((error as Error).message).to.equal('Collection name is required');
      }
    });
  });
  
  describe('addRequestToCollection', () => {
    it('should add a request to a collection', async () => {
      const collectionId = 'test-collection-id';
      const request = {
        name: 'Test Request',
        method: 'GET',
        url: 'https://api.example.com/test',
        description: 'Test request description'
      };
      
      // Mock get collection response
      const mockGetResponse = {
        collection: {
          info: { name: 'Test Collection' },
          item: []
        }
      };
      
      // Mock update collection response
      const mockUpdateResponse = {
        collection: {
          id: collectionId,
          name: 'Test Collection',
          item: [
            {
              name: request.name,
              request: {
                method: request.method,
                url: request.url,
                description: request.description
              }
            }
          ]
        }
      };
      
      // Configure the fetch stub for both calls
      fetchStub.onFirstCall().resolves({
        ok: true,
        json: async () => ({ data: mockGetResponse })
      } as Response);
      
      fetchStub.onSecondCall().resolves({
        ok: true,
        json: async () => ({ data: mockUpdateResponse })
      } as Response);
      
      // Call the method
      const result = await postmanService.addRequestToCollection(collectionId, request);
      
      // Verify the result
      expect(result.data).to.deep.equal(mockUpdateResponse);
      
      // Verify fetch was called correctly
      expect(fetchStub.calledTwice).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal(`https://api.getpostman.com/collections/${collectionId}`);
      expect(fetchStub.secondCall.args[0]).to.equal(`https://api.getpostman.com/collections/${collectionId}`);
      expect(fetchStub.secondCall.args[1]).to.have.property('method', 'PUT');
    });
    
    it('should throw an error if collection ID is not provided', async () => {
      try {
        await postmanService.addRequestToCollection('', {
          name: 'Test',
          method: 'GET',
          url: 'https://example.com'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.an('Error');
        expect((error as Error).message).to.equal('Collection ID is required');
      }
    });
    
    it('should throw an error if request details are incomplete', async () => {
      try {
        await postmanService.addRequestToCollection('col-id', {
          name: '',
          method: 'GET',
          url: 'https://example.com'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.an('Error');
        expect((error as Error).message).to.equal('Request name, method, and URL are required');
      }
    });
  });
  
  describe('createEnvironment', () => {
    it('should create a new environment with variables', async () => {
      const name = 'Test Environment';
      const variables = [
        { key: 'baseUrl', value: 'https://api.example.com' },
        { key: 'apiKey', value: '12345', type: 'secret' }
      ];
      
      // Mock response
      const mockResponse = {
        environment: {
          id: 'env-id',
          name: name,
          values: variables.map(v => ({
            key: v.key,
            value: v.value,
            enabled: true,
            type: v.type || 'default'
          }))
        }
      };
      
      // Configure the fetch stub
      fetchStub.resolves({
        ok: true,
        json: async () => ({ data: mockResponse })
      } as Response);
      
      // Call the method
      const result = await postmanService.createEnvironment(name, variables);
      
      // Verify the result
      expect(result.data).to.deep.equal(mockResponse);
      
      // Verify fetch was called correctly
      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal('https://api.getpostman.com/environments');
      expect(fetchStub.firstCall.args[1]).to.have.property('method', 'POST');
      
      // Verify the request body
      const requestBody = JSON.parse(fetchStub.firstCall.args[1].body as string);
      expect(requestBody.environment.name).to.equal(name);
      expect(requestBody.environment.values).to.have.lengthOf(variables.length);
    });
    
    it('should throw an error if name is not provided', async () => {
      try {
        await postmanService.createEnvironment('', []);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.an('Error');
        expect((error as Error).message).to.equal('Environment name is required');
      }
    });
  });
  
  describe('runCollection', () => {
    it('should run a collection with an environment', async () => {
      const collectionId = 'col-id';
      const environmentId = 'env-id';
      
      // Mock response
      const mockResponse = {
        run: {
          id: 'run-id',
          status: 'scheduled'
        }
      };
      
      // Configure the fetch stub
      fetchStub.resolves({
        ok: true,
        json: async () => ({ data: mockResponse })
      } as Response);
      
      // Call the method
      const result = await postmanService.runCollection(collectionId, environmentId);
      
      // Verify the result
      expect(result.data).to.deep.equal(mockResponse);
      
      // Verify fetch was called correctly
      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.equal('https://api.getpostman.com/collections/run');
      expect(fetchStub.firstCall.args[1]).to.have.property('method', 'POST');
      
      // Verify the request body
      const requestBody = JSON.parse(fetchStub.firstCall.args[1].body as string);
      expect(requestBody.collection).to.equal(collectionId);
      expect(requestBody.environment).to.equal(environmentId);
    });
    
    it('should throw an error if collection ID is not provided', async () => {
      try {
        await postmanService.runCollection('');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.an('Error');
        expect((error as Error).message).to.equal('Collection ID is required');
      }
    });
  });
}); 