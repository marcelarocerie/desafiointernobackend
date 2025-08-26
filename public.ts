import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();

// Ranking público
router.get("/ranking", async (req, res) => {
  const { tipo = "total", semana } = req.query;
  const config = await prisma.config.findFirst();
  const dataInicio = config?.dataInicio ?? new Date();

  let where: any = { status: "APROVADO" };

  if (tipo === "semana") {
    const semanaNum = parseInt(semana as string, 10) || 1;
    const inicioSemana = new Date(dataInicio.getTime() + (semanaNum - 1) * 7 * 86400000);
    const fimSemana = new Date(inicioSemana.getTime() + 6 * 86400000);
    where.dataPostagem = { gte: inicioSemana, lte: fimSemana };
  }

  const envios = await prisma.envio.groupBy({
    by: ["alunoId"],
    where,
    _count: { _all: true },
  });

  const alunos = await prisma.aluno.findMany({ where: { isActive: true } });

  // milestones para badges
  const milestones = [4, 8, 12, 16, 20, 24, 28, 32];
  const total = config?.totalDesafio ?? 32;

  const ranking = envios
    .map(e => {
      const aluno = alunos.find(a => a.id === e.alunoId);
      if (!aluno) return null;
      // Badges conquistadas
      const badges = milestones.map(valor => e._count._all >= valor);
      return {
        nome: aluno.nome,
        foto: aluno.foto,
        enviados: e._count._all,
        badges,
        total,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b!.enviados - a!.enviados);

  res.json(ranking);
});

export default router;