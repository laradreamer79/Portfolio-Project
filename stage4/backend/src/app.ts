import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/not-found.middleware.js';
import { healthRouter } from './routes/health.routes.js';
import { authRouter } from "./auth/auth.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { centersRouter } from "./routes/centers.routes.js";
import { tripsRouter } from "./routes/trips.routes.js";
import { coursesRouter } from "./routes/courses.routes.js";

import { bookingsRouter } from "./bookings/bookings.routes.js";
import { reviewsRouter } from "./reviews/reviews.routes.js";
import { paymentsRouter } from "./payments/payments.routes.js";

export const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/centers", centersRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/courses", coursesRouter);

app.use(
  "/api/bookings",
  bookingsRouter
);


app.use(
  "/api/reviews",
  reviewsRouter
);

app.use(
  "/api/payments",
  paymentsRouter,
);

app.use(notFound);
app.use(errorHandler);
