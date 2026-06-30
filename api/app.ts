import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

import { env } from "./config/env";
import { apiRouter } from "./routes";
import { HttpError } from "./utils/httpError";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
  }),
);
app.use(express.json());

app.use("/api", apiRouter);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Ruta no encontrada."));
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || "Error interno del servidor.",
    details: error instanceof HttpError ? error.details : undefined,
  });
});
