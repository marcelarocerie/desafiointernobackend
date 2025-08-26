// Exemplo: dispara para Discord/n8n quando envio aprovado
import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function sendWebhookIfNeeded(envioId: string) {
  const envio = await prisma.envio.findUnique({
    where: { id: envioId },
    include: { aluno: true, formato: true, estrutura: true },
  });
  const config = await prisma.config.findFirst();
  if (!envio || !config?.webhookUrl) return;
  const totalAprovados = await prisma.envio.count({
    where: { alunoId: envio.alunoId, status: "APROVADO" },
  });
  const payload = {
    evento: "envio_aprovado",
    aluno: {
      id: envio.aluno.id,
      nome: envio.aluno.nome,
      email: envio.aluno.email,
    },
    envio: {
      id: envio.id,
      formato: envio.formato.nome,
      estrutura: envio.estrutura?.nome || null,
      link: envio.link,
      plataforma: envio.plataforma,
      data_postagem: envio.dataPostagem.toISOString().split("T")[0],
    },
    progresso: {
      enviados: totalAprovados,
      faltam: config.totalDesafio - totalAprovados,
      total: config.totalDesafio,
    },
  };
  try {
    await axios.post(config.webhookUrl, payload);
  } catch (err) {
    // log, mas não bloqueia
  }
}