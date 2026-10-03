import { prisma } from "../../lib/prisma.js";
import { randomUUID } from "node:crypto";
import { Router } from "express";
import { serviceController } from "./controller.js";

export const serviceRouter = Router();

serviceRouter.get("/jobs", serviceController.jobs);
serviceRouter.get("/summary", serviceController.summary);

function serviceData(body, partial = false) {
  const data = {};
  const fail = () => { throw Object.assign(new Error("Servis bilgileri geçersiz."), { statusCode: 400 }); };
  if (!body || typeof body !== "object" || Array.isArray(body)) fail();
  for (const key of ["motorcycle", "operation", "schedule", "status"]) {
    if (!partial || body[key] !== undefined) {
      if (typeof body[key] !== "string" || !body[key].trim()) fail();
      data[key] = body[key];
    }
  }
  for (const key of ["customer", "phone", "plate", "parts", "notes"]) if (body[key] !== undefined) {
    if (body[key] !== null && typeof body[key] !== "string") fail();
    data[key] = body[key];
  }
  for (const key of ["mileage", "labor"]) if (body[key] !== undefined) {
    const n = body[key] === "" || body[key] === null ? null : Number(body[key]);
    if (n !== null && (!Number.isFinite(n) || n < 0 || (key === "mileage" && (!Number.isInteger(n) || n > 2147483647)) || (key === "labor" && n > 9999999999.99))) fail();
    data[key] = n;
  }
  return data;
}
serviceRouter.post("/jobs", async (req, res, next) => { try { res.status(201).json({ data: await prisma.serviceJob.create({ data: { id: `SRV-${randomUUID()}`, ...serviceData(req.body) } }) }); } catch (error) { next(error); } });
serviceRouter.put("/jobs/:id", async (req, res, next) => { try { res.json({ data: await prisma.serviceJob.update({ where: { id: req.params.id }, data: serviceData(req.body, true) }) }); } catch (error) { next(error); } });
serviceRouter.delete("/jobs/:id", async (req, res, next) => { try { await prisma.serviceJob.delete({ where: { id: req.params.id } }); res.json({ data: { id: req.params.id } }); } catch (error) { next(error); } });
