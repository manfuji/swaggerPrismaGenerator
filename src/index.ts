import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { IPrismaSwaggerGenerator, PrismaSwaggerGeneratorOptions, SchemaDef } from './types/base';

/**
 * A class to generate Swagger documentation from Prisma models.
 */
export class PrismaSwaggerGenerator implements IPrismaSwaggerGenerator {
    private prisma: PrismaClient;
    private outputDir: string;

    /**
     * @param prismaClient An instance of PrismaClient.
     * @param outputDir Directory to save the generated Swagger file.
     * @default "./swagger"
     */
    constructor(prismaClient: PrismaClient, outputDir: string = './swagger') {
        if (!prismaClient || !(prismaClient instanceof PrismaClient)) {
            throw new Error('PrismaClient instance is required');
        }

        this.prisma = prismaClient;
        this.outputDir = outputDir;
    }

    /**
     * Generates schemas for the Prisma models.
     * @returns A record of model names to OpenAPI schemas.
     */
    private async generateSchemas(): Promise<Record<string, any>> {
        try {
            const models = this.prisma._dmmf.datamodel.models;
            const components: Record<string, any> = {};

            for (const model of models) {
                const schema: SchemaDef = {
                    type: 'object',
                    properties: {},
                    required: [] as string[],
                };

                for (const field of model.fields) {
                    schema.properties[field.name] = this.mapPrismaTypeToOpenAPI(field);

                    if (field.isRequired) {
                        schema.required.push(field.name);
                    }
                }

                components[model.name] = schema;
            }

            return components;
        } catch (error) {
            console.error('Error generating schemas:', error);
            throw new Error('Failed to generate schemas.');
        }
    }

    /**
     * Maps Prisma field types to OpenAPI-compatible types.
     * @param field A Prisma field definition.
     * @returns An OpenAPI-compatible schema object.
     */
    private mapPrismaTypeToOpenAPI(field: any): Record<string, any> {
        const typeMap: Record<string, Record<string, any>> = {
            String: { type: 'string' },
            Int: { type: 'integer' },
            Float: { type: 'number' },
            Boolean: { type: 'boolean' },
            DateTime: { type: 'string', format: 'date-time' },
            Json: { type: 'object' },
        };

        if (field.kind === 'enum') {
            return { type: 'string', enum: field.enumValues || [] };
        }

        if (field.kind === 'object') {
            return { $ref: `#/components/schemas/${field.type}` };
        }

        return typeMap[field.type] || { type: 'string' }; // Default to string for unknown types
    }

    /**
     * Generates a Swagger file and saves it to the specified output directory.
     * @param options Configuration options for the Swagger file.
     */
    public async generateSwaggerFile(options: PrismaSwaggerGeneratorOptions = {}): Promise<void> {
        const {
            title = 'API Documentation',
            version = '1.0.0',
            description = 'Generated API documentation',
            servers = [],
            overwrite = true,
        } = options;

        try {
            const components = await this.generateSchemas();

            const swaggerDoc = {
                openapi: '3.0.0',
                info: {
                    title,
                    version,
                    description,
                },
                servers,
                paths: {},
                components: {
                    schemas: components,
                },
            };

            if (!fs.existsSync(this.outputDir)) {
                fs.mkdirSync(this.outputDir, { recursive: true });
            }

            const filePath = path.join(this.outputDir, 'swagger.json');
            if (fs.existsSync(filePath) && !overwrite) {
                console.warn(`File ${filePath} already exists. Skipping file generation as overwrite is disabled.`);
                return;
            }

            fs.writeFileSync(filePath, JSON.stringify(swaggerDoc, null, 2));
            console.log(`Swagger file generated at ${filePath}`);
        } catch (error) {
            console.error('Error generating Swagger file:', error);
            throw new Error('Failed to generate Swagger file.');
        }
    }
}

