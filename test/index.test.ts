import { PrismaClient } from "@prisma/client";
import { PrismaSwaggerGenerator } from "../src";

// Example Test Case
(async () => {
    const prisma = new PrismaClient();

    try {
        const generator = new PrismaSwaggerGenerator(prisma, './test-swagger');

        await generator.generateSwaggerFile({
            title: 'Test API',
            version: '1.0.0',
            description: 'Swagger documentation for Test API',
            servers: [
                { url: 'http://localhost:3000', description: 'Development server' },
            ],
            overwrite: false, // Demonstrating the configurable overwrite behavior
        });

        console.log('Test case passed: Swagger file successfully generated.');
    } catch (error) {
        console.error('Test case failed:', error);
    } finally {
        await prisma.$disconnect();
    }
})();

/**
 * Notes:
 * - Added error handling for schema generation and file writing.
 * - Included support for enums and relations in schema generation.
 * - Provided warnings for overwriting existing files with configurable behavior.
 * - Added a basic test case to verify Swagger file generation.
 * - Encourage users to validate the generated Swagger file using tools like Swagger Editor.
 */