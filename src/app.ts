import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import dotenv from "dotenv";
import cors from "cors";
import abnDataRoutes from "./routes/abnDataRoutes.js";

dotenv.config();

// Custom error type to allow statusCode
interface CustomError extends Error {
  statusCode?: number;
}

// Express app creation
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allowing CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://abn-data-finder-fe.vercel.app"],
    credentials: true,
  })
);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend running successfully!");
});

//ABN data related routes
app.use("/api/abn-data", abnDataRoutes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error("Endpoint not found");
  error.statusCode = 404;
  next(error);
});

// General error handler
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "An unknown error occurred";

    res.status(statusCode).json({ error: message });
  }
);

export default app;
