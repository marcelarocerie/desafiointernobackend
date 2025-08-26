import { Request, Response, NextFunction } from "express";
import { ADMIN_EMAILS } from "../config";

// Auth admin: token = base64(email), email deve ser admin
export function checkAuthAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Sem token" });
  try {
    const email = Buffer.from(auth.replace("Bearer ", ""), "base64").toString("utf8");
    if (!ADMIN_EMAILS.includes(email)) throw new Error();
    req.admin = { email };
    next();
  } catch {
    res.status(401).json({ error: "Token de admin inválido" });
  }
}