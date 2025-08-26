import { Request, Response, NextFunction } from "express";

// Auth para aluno: token = base64(email)
export function checkAuthAluno(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Sem token" });
  try {
    const email = Buffer.from(auth.replace("Bearer ", ""), "base64").toString("utf8");
    if (!email?.includes("@")) throw new Error();
    req.user = { email };
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}