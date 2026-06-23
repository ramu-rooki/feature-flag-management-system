import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running"
  });
});

// Centralized error handler should be the last middleware
app.use(errorHandler);

export default app;
