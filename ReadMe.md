
# Prisma-to-Swagger Library

A library to automate the generation of Swagger (OpenAPI) definitions for Express APIs, directly leveraging Prisma models. This eliminates repetitive boilerplate by extracting schemas directly from your Prisma schema.

## Installation

Install the library using npm:

```bash
npm install prisma-to-swagger
```

Or with Yarn:

```bash
yarn add prisma-to-swagger
```

## Features

- Automatically reads and parses your Prisma schema.
- Converts Prisma models into Swagger-compatible schemas, including support for enums and relations.
- Supports Express.js API documentation.
- Configurable file generation with options for overwriting existing files.
- TypeScript support with complete type definitions.
- Extensible for custom schemas and Swagger components.

## Usage

### Basic Example

1. Add this library to your Express project.
2. Import and use the library in your code:

#### `index.ts`

```typescript
import express from 'express';
import prismaToSwagger from 'prisma-to-swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Initialize the library
const swaggerSpec = prismaToSwagger({
  prismaSchemaPath: './prisma/schema.prisma',
  apiBasePath: '/api',
});

// Serve Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Swagger docs available at http://localhost:3000/docs');
});
```

3. Ensure your `schema.prisma` file is correctly defined:

#### `schema.prisma`

```prisma
model User {
  id    String @id @default(cuid())
  name  String
  email String @unique
}

model Post {
  id      String @id @default(cuid())
  title   String
  content String
  author  User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

The above will generate Swagger schemas for `User` and `Post` models and expose them in `/docs`.

## Advanced Configuration

You can customize the behavior by passing additional options:

```typescript
const swaggerSpec = prismaToSwagger({
  prismaSchemaPath: './prisma/schema.prisma',
  apiBasePath: '/api',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'Auto-generated API documentation.',
  },
  outputPath: './swagger.json',
  overwrite: false, // Do not overwrite existing files
});
```

### Options

| Option              | Type              | Default               | Description                                |
|---------------------|-------------------|-----------------------|--------------------------------------------|
| `prismaSchemaPath`  | `string`          | `./prisma/schema.prisma` | Path to your Prisma schema file.         |
| `apiBasePath`       | `string`          | `/api`                | Base path for your API endpoints.         |
| `info`              | `object`          | `{}`                  | Swagger info object (title, version, etc.). |
| `outputPath`        | `string`          | `null`                | File path to save the generated spec.     |
| `overwrite`         | `boolean`         | `true`                | Whether to overwrite existing files.      |

### TypeScript Definitions

The library includes TypeScript definitions for all its functions and options.

### Extending with Custom Schemas

You can extend the generated Swagger spec with custom schemas or components:

```typescript
const swaggerSpec = prismaToSwagger({
  prismaSchemaPath: './prisma/schema.prisma',
  apiBasePath: '/api',
});

// Add custom components
swaggerSpec.components.schemas.MyCustomSchema = {
  type: 'object',
  properties: {
    customField: {
      type: 'string',
    },
  },
};

// Use custom schemas in your routes
app.get('/api/custom', (req, res) => {
  res.json({ message: 'This is a custom route' });
});
```

### Output Example

The generated Swagger spec will include schemas such as:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "My API",
    "version": "1.0.0",
    "description": "Auto-generated API documentation."
  },
  "paths": {},
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "email": { "type": "string" }
        },
        "required": ["id", "name", "email"]
      },
      "Post": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "content": { "type": "string" },
          "authorId": { "type": "string" }
        },
        "required": ["id", "title", "content", "authorId"]
      }
    }
  }
}
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

### Future Improvements

- Add support for more complex Prisma relations.
- Provide CLI support for generating Swagger specs.
- Include automated tests for generated specs.

## License

This library is open-source under the MIT License. Feel free to use and modify it as needed.
