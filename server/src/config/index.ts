import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

interface Config {
    NODE_ENV: string;
    PORT: number;
    DB_DIR: string;
    DB_NAME: string;
    TOGETHERAI_API_KEY: string;
    TOGETHERAI_MODEL_NAME: string;
    LANGCHAIN_TRACING_V2: boolean;
    LANGCHAIN_CALLBACKS_BACKGROUND: boolean;
    LANGSMITH_ENDPOINT: string;
    LANGSMITH_API_KEY: string;
    LANGSMITH_PROJECT: string;
    CORS_ORIGINS: string[];
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
}

const config: Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    // SQLite database configuration
    DB_DIR: process.env.DB_DIR || 'sqlite_data',
    DB_NAME: process.env.DB_NAME || 'cars.db',
    // TogetherAI configuration
    TOGETHERAI_API_KEY: process.env.TOGETHERAI_API_KEY || "b5de1296c945a49db7a2097bd1cb2946ed87a2423e206ae0fd512fb74769896d",
    TOGETHERAI_MODEL_NAME: process.env.TOGETHERAI_MODEL_NAME || 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    // LangChain tracing and callbacks configuration
    LANGCHAIN_TRACING_V2: process.env.LANGCHAIN_TRACING_V2 === 'true',
    LANGCHAIN_CALLBACKS_BACKGROUND: process.env.LANGCHAIN_CALLBACKS_BACKGROUND === 'true',
    LANGSMITH_ENDPOINT: process.env.LANGSMITH_ENDPOINT || 'https://api.smith.langchain.com',
    LANGSMITH_API_KEY: process.env.LANGSMITH_API_KEY || '',
    LANGSMITH_PROJECT: process.env.LANGSMITH_PROJECT || 'sql-assistant',
    CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(','),
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
};

// Validate required environment variables
const requiredEnvVars = ['TOGETHERAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !config[envVar as keyof Config]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;