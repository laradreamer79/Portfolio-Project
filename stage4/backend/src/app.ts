import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { adminRouter } from './features/admin/admin.routes.js';
import { authRouter } from './features/auth/auth.routes.js';
import { healthRouter } from './features/health/health.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/not-found.middleware.js';

export const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);
