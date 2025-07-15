import { Router, Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { databaseManager } from '../services/database.service';
import { logger } from '../utils/logger';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
    try {
        const { queryDescription } = req.body;
        const sqlQuery = await aiService.generateSQLQuery(queryDescription);
        res.json({ sqlQuery });
    } catch (error) {
        console.log(error);
        res.json({
            sqlQuery: 'Great question. I have not been trained on that. Ask me something else.'
        });
    }
});

router.post('/ask-database', async (req: Request, res: Response) => {
    try {
        const { queryDescription } = req.body;
        const response = await aiService.generateNaturalLanguageResponse(queryDescription);
        console.log("response:>>>>", response)
        res.json({ response });
    } catch (error) {
        console.log(error);
        res.json({
            response: 'Great question. I have not been trained on that. Ask me something else.'
        });
    }
});

router.post('/add-database', async (req: Request, res: Response) => {
    try {
        const { databaseUrl, databaseName } = req.body;

        if (!databaseUrl || !databaseName) {
            return res.status(400).json({
                error: 'Both databaseUrl and databaseName are required'
            });
        }

        const connection = await databaseManager.addCustomDatabase(databaseUrl, databaseName);
        await databaseManager.initializeDefaultDatabase();
        res.json({
            message: 'Database added successfully',
            databaseName: connection.name
        });
    } catch (error) {
        logger.error('Error adding custom database:', error);
        res.status(500).json({
            error: 'Failed to add custom database',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.get('/databases', (req: Request, res: Response) => {
    try {
        const databases = databaseManager.listConnections();
        res.json({ databases });
    } catch (error) {
        logger.error('Error listing databases:', error);
        res.status(500).json({
            error: 'Failed to list databases',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export { router as sqlRouter };