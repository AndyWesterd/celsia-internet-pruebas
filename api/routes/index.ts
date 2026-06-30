import { Router } from "express";

import { clienteRouter } from "./user.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ptcrud-api" });
});

apiRouter.use("/clientes", clienteRouter);
