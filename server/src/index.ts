import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import { databaseManager } from './services/database.service';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { sqlRouter } from './routes/sql.routes';
import { healthRouter } from './routes/health.routes';

const app = express();

// Middleware
app.use(compression());
app.use(cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
}));
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Routes
app.use(healthRouter);
app.use('/api/', sqlRouter)

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Initialize default database
        await databaseManager.initializeDefaultDatabase();

        app.listen(config.PORT, () => {
            logger.info(`Server is running on port ${config.PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();