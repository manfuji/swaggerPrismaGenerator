export type SchemaDef = {
    type: string;
    properties: any
    required: string[]
}


/**
 * Options for configuring the Swagger file generation.
 */
export interface PrismaSwaggerGeneratorOptions {
    /**
     * Title of the API documentation.
     * @default "API Documentation"
     */
    title?: string;

    /**
     * Version of the API.
     * @default "1.0.0"
     */
    version?: string;

    /**
     * Description of the API.
     * @default "Generated API documentation"
     */
    description?: string;

    /**
     * List of server URLs and descriptions for the API.
     */
    servers?: Array<{ url: string; description?: string }>;

    /**
     * Determines whether existing files should be overwritten.
     * @default true
     */
    overwrite?: boolean;
}

/**
 * Interface for the PrismaSwaggerGenerator class.
 */
export interface IPrismaSwaggerGenerator {
    /**
     * Generates a Swagger file based on the Prisma schema.
     * @param options Configuration options for the Swagger file.
     */
    generateSwaggerFile(options?: PrismaSwaggerGeneratorOptions): Promise<void>;
}
