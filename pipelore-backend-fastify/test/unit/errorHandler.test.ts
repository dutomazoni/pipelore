import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createFastifyErrorHandler } from '../../src/middlewares/fastifyErrorHandler.js';
import Fastify from 'fastify';

describe('Fastify Error Handler', () => {
  let app: FastifyInstance;
  let errorHandler: (error: Error, request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  
  beforeEach(() => {
    app = Fastify({ logger: false });
    errorHandler = createFastifyErrorHandler();
  });
  
  afterEach(async () => {
    await app.close();
  });
  
  it('should handle standard errors with 500 status code', async () => {
    app.get('/test-error', () => {
      throw new Error('Test error');
    });
    
    app.setErrorHandler(errorHandler);
    
    const response = await app.inject({
      method: 'GET',
      url: '/test-error'
    });
    
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toHaveProperty('status', 'error');
    expect(JSON.parse(response.payload)).toHaveProperty('message');
    expect(JSON.parse(response.payload).message).toContain('Test error');
  });
  
  it('should handle AppError with custom status code', async () => {
    // Import the AppError class directly
    const { AppError } = await import('../../src/middlewares/errors.js');
    
    app.get('/not-found', () => {
      // Create an AppError instance directly
      throw new AppError('Custom not found message', 404);
    });
    
    app.setErrorHandler(errorHandler);
    
    const response = await app.inject({
      method: 'GET',
      url: '/not-found'
    });
    
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toHaveProperty('status', 'error');
    expect(JSON.parse(response.payload).message).toContain('Custom not found message');
  });
  
  it('should handle validation errors', async () => {
    // Import Zod directly
    const { z } = await import('zod');
    
    app.get('/validation-error', () => {
      const schema = z.object({
        name: z.string(),
        email: z.string().email()
      });
      
      // This will cause a validation error
      schema.parse({ name: 123, email: 'not-an-email' });
    });
    
    app.setErrorHandler(errorHandler);
    
    const response = await app.inject({
      method: 'GET',
      url: '/validation-error'
    });
    
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toHaveProperty('status', 'error');
    expect(JSON.parse(response.payload)).toHaveProperty('message', 'Validation error');
    expect(JSON.parse(response.payload)).toHaveProperty('errors');
  });
  
  it('should not include stack trace in production environment', async () => {
    // Save original NODE_ENV
    const originalNodeEnv = process.env.NODE_ENV;
    
    try {
      // Set to production
      process.env.NODE_ENV = 'production';
      
      app.get('/error-in-production', () => {
        throw new Error('Some error message');
      });
      
      app.setErrorHandler(createFastifyErrorHandler());
      
      const response = await app.inject({
        method: 'GET',
        url: '/error-in-production'
      });
      
      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload)).toHaveProperty('status', 'error');
      expect(JSON.parse(response.payload)).toHaveProperty('message');
      expect(JSON.parse(response.payload)).not.toHaveProperty('stack');
    } finally {
      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
  
  it('should include stack trace in development environment', async () => {
    // Save original NODE_ENV
    const originalNodeEnv = process.env.NODE_ENV;
    
    try {
      // Set to development
      process.env.NODE_ENV = 'development';
      
      app.get('/error-in-development', () => {
        throw new Error('Some error message');
      });
      
      app.setErrorHandler(createFastifyErrorHandler());
      
      const response = await app.inject({
        method: 'GET',
        url: '/error-in-development'
      });
      
      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload)).toHaveProperty('status', 'error');
      expect(JSON.parse(response.payload)).toHaveProperty('message');
      expect(JSON.parse(response.payload)).toHaveProperty('stack');
    } finally {
      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
});