import { saveMovement, reverseMovement, history } from "./mutations.js";
import { Router } from "express";
import { stockController } from "./controller.js";

export const stockRouter = Router();

stockRouter.get("/", stockController.list);
stockRouter.get("/alerts", stockController.alerts);

stockRouter.get("/history", async (req, res, next) => { try { res.json({ data: await history() }); } catch (error) { next(error); } });
stockRouter.post("/movements", async (req, res, next) => { try { res.status(201).json({ data: await saveMovement(req.body) }); } catch (error) { next(error); } });
stockRouter.post("/movements/:id/reverse", async (req, res, next) => { try { res.json({ data: await reverseMovement(req.params.id) }); } catch (error) { next(error); } });
