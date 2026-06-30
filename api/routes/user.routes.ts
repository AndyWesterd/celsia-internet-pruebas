import { Router } from "express";

import { clienteController } from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const clienteRouter = Router();

clienteRouter.get("/", asyncHandler(clienteController.list));
clienteRouter.get("/:identificacion", asyncHandler(clienteController.detail));
clienteRouter.post("/", asyncHandler(clienteController.create));
clienteRouter.post("/:identificacion/servicios", asyncHandler(clienteController.createServicio));
clienteRouter.put("/:identificacion", asyncHandler(clienteController.update));
clienteRouter.delete("/:identificacion", asyncHandler(clienteController.remove));
