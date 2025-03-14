# Development Guidelines

This document outlines the development guidelines for the Postman MCP Server. Following these guidelines ensures a consistent, maintainable, and high-quality codebase.

## Critical Development Rules

The following rules are to be strictly followed without exception:

1. **Avoid Code Duplication at All Costs**: 
   - Before implementing new logic, thoroughly check if similar functionality already exists
   - Refactor and reuse existing code even if it requires modification
   - Functionality duplication is considered a violation even if the implementation is different
   - Create utility functions for commonly used functionality

2. **Strict File Size Limit**:
   - No file may exceed 150 lines of code under ANY circumstances
   - If a file approaches this limit, it must be split into multiple files with focused responsibilities
   - This rule enforces the Single Responsibility Principle (see SOLID_PRINCIPLES.md)
   - For services, split by domain or specific functionality
   - For interfaces, split by related capabilities

3. **Comprehensive Testing Requirements**:
   - All code must have associated tests with proper test coverage
   - Minimum test coverage for new code: 95%
   - Every feature must include both unit and integration tests
   - Use Vitest for testing (already set up in the project)

4. **Documentation Requirements**:
   - All public methods must have JSDoc comments
   - All interfaces must be documented
   - Complex logic must have inline comments
   - Keep the README.md up to date

5. **No Extraneous Code**:
   - Do not add code that isn't directly related to the requirements
   - Remove console.log statements before committing (except for intentional logging)
   - Keep functions small and focused

## Code Organization

For Cloudflare Worker MCP projects, we use a slightly different organization than traditional Express apps, but the principles remain the same:

- **Main Worker Class**: The main entry point extends `WorkerEntrypoint` and provides the MCP interface
- **Interfaces**: Define TypeScript interfaces for all data structures and service contracts
- **Services**: Contain business logic, interact with models and external APIs
- **Utils**: Contain reusable utility functions

## Error Handling

- All errors should be properly caught and handled
- Use custom error classes for different types of errors
- Return meaningful error messages that can be understood by the user
- Log errors appropriately
- Don't expose sensitive information in error messages

## Naming Conventions

- **Files**: Use camelCase for files (e.g., postmanService.ts)
- **Classes**: Use PascalCase for classes (e.g., PostmanService)
- **Interfaces**: Use PascalCase with "I" prefix for interfaces (e.g., IPostmanCollection)
- **Functions and Methods**: Use camelCase for functions and methods (e.g., createMockServer)
- **Variables**: Use camelCase for variables (e.g., collectionData)
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., DEFAULT_TIMEOUT)

## Documentation

- All public methods must have JSDoc comments
- Include @param and @returns tags in JSDoc comments
- Document complex logic with inline comments
- Each method in the MCP server must have clear documentation about:
  - What it does
  - Required parameters
  - Return values
  - Possible errors

## MCP-Specific Guidelines

For Model Context Protocol servers:

1. **Method Structure**:
   - Each public method should have a clear, single responsibility
   - Methods should be designed to be easily understood by AI assistants
   - Provide meaningful parameter names and clear return values

2. **Error Handling**:
   - Return user-friendly error messages that can be relayed by the AI assistant
   - Handle edge cases gracefully to avoid confusing the user
   - Validate inputs thoroughly to prevent unexpected behavior

3. **Documentation**:
   - Document all methods with JSDoc comments that will be exposed as MCP tool documentation
   - Include examples of how to use each method
   - Make documentation clear enough for both AI assistants and human users 