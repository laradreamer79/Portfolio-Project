import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/not-found.middleware.js';
import { healthRouter } from './routes/health.routes.js';
import { authRouter } from "./auth/auth.routes.js";

export const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRouter);
app.use("/api/auth", authRouter);

app.use(notFound);
app.use(errorHandler);
