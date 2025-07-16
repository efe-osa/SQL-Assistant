import { ChatTogetherAI } from '@langchain/community/chat_models/togetherai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { logger } from '../utils/logger';
import { databaseManager } from './database.service';
import config from '../config';

class AIService {
    private static instance: AIService;
    private llm!: ChatTogetherAI;
    private sqlQueryPrompt!: PromptTemplate;
    private naturalLanguagePrompt!: PromptTemplate;
    private sqlQueryGeneratorChain!: RunnableSequence;
    private schemaCache: Map<string, string> = new Map();
    private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes

    private constructor() {
        this.initializeLLM();
        this.initializePrompts();
        this.initializeChains();
    }

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private initializeLLM(): void {
        this.llm = new ChatTogetherAI({
            togetherAIApiKey: config.TOGETHERAI_API_KEY,
            modelName: config.TOGETHERAI_MODEL_NAME,
            temperature: 0.1,
            maxTokens: 1000
        });
    }

    private initializePrompts(): void {
        this.sqlQueryPrompt = PromptTemplate.fromTemplate(
            `Act as a SQL expert and use the table schemas as a reference to generate the exact SQL query structure that would answer the user's question. Again, consider the table schemas and entity relationships and return only the SQL query and nothing else:

            Table Schemas:
            {schema}

            Question: {question}
            SQL Query:`
        );

        this.naturalLanguagePrompt = PromptTemplate.fromTemplate(
            `Based on the table schema below, question, sql query, and sql response, write and return a natural language response and the sql response:

            Table Schemas:
            {schema}

            Question: {question}
            SQL Query: {query}
            SQL Response: {response}

            Response:`
        );
    }

    private initializeChains(): void {
        this.sqlQueryGeneratorChain = RunnableSequence.from([
            RunnablePassthrough.assign({
                schema: async () => await this.getCachedSchema()
            }),
            this.sqlQueryPrompt,
            this.llm,
            new StringOutputParser()
        ]);
    }

    private async getCachedSchema(): Promise<string> {
        const cacheKey = 'default_schema';
        const cachedSchema = this.schemaCache.get(cacheKey);

        if (cachedSchema) {
            return cachedSchema;
        }

        try {
            const schema = await databaseManager.getDefaultConnection().sqlDb.getTableInfo();
            this.schemaCache.set(cacheKey, schema);

            // Clear cache after TTL
            setTimeout(() => {
                this.schemaCache.delete(cacheKey);
            }, this.CACHE_TTL);

            return schema;
        } catch (error) {
            logger.error('Error fetching schema:', error);
            throw new Error('Failed to fetch database schema');
        }
    }

    async generateSQLQuery(userPrompt: string): Promise<string> {
        // TODO: debug why this is returning an error
        try {
            const chainResult = await this.sqlQueryGeneratorChain.invoke({
                question: userPrompt,
            });
            const sqlQuery = chainResult.trim();
            logger.info('Generated SQL Query:', sqlQuery);
            return sqlQuery;
        } catch (error) {
            logger.error('Error generating SQL query:', error);
            throw new Error('Failed to generate SQL query. Please try again with a different question.');
        }
    }

    async generateNaturalLanguageResponse(queryDescription: string): Promise<string> {
        try {
            const fullChain = RunnableSequence.from([
                RunnablePassthrough.assign({
                    query: this.sqlQueryGeneratorChain
                }),
                {
                    schema: async () => await this.getCachedSchema(),
                    question: (input: { question: string }) => input.question,
                    query: (input: { query: string }) => input.query.trim(),
                    response: async (input: { query: string }) => {
                        try {
                            const result = await databaseManager.getDefaultConnection().sqlDb.run(input.query);
                            console.log("DB query result:>>>>", result)
                            return result;
                        } catch (error) {
                            logger.error('Error executing SQL query:', error);
                            throw new Error('Failed to execute SQL query');
                        }
                    }
                },
                this.naturalLanguagePrompt,
                this.llm,
                new StringOutputParser()
            ]);

            const finalResponse = await fullChain.invoke({
                question: queryDescription.endsWith('?') ? queryDescription : `${queryDescription}?`
            });

            return finalResponse.trim();
        } catch (error) {
            logger.error('Error generating natural language response:', error);
            throw new Error('Failed to generate response. Please try again with a different question.');
        }
    }
}

export const aiService = AIService.getInstance();