import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/not-found.middleware.js';
import { healthRouter } from "./health/health.routes.js";
import { authRouter } from "./auth/auth.routes.js";
import { adminRouter } from "./admin/admin.routes.js";
import { centersRouter } from "./centers/centers.routes.js";
import { tripsRouter } from "./trips/trips.routes.js";
import { coursesRouter } from "./courses/courses.routes.js";
import { instructorsRouter } from "./instructors/instructors.routes.js";

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
app.use("/api/instructors", instructorsRouter);

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
