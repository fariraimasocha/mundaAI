import { RequestHandler } from "express";

export const middleware: RequestHandler = (_req, res) => {
  res.send("mundaAI up");
};
