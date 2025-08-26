// ... imports e código já existente

// Listar mensagens para o aluno logado
router.get("/mensagens", async (req, res) => {
  const email = req.user.email;
  const aluno = await prisma.aluno.findUnique({ where: { email } });
  if (!aluno) return res.status(401).json({ error: "Aluno não encontrado" });

  const msgs = await prisma.mensagem.findMany({
    where: {
      ativa: true,
      OR: [
        { destinatarios: null },
        {
          destinatarios: {
            contains: aluno.id
          }
        }
      ]
    },
    orderBy: [{ destaque: "desc" }, { dataEnvio: "desc" }]
  });

  const lidas = await prisma.leituraMensagem.findMany({
    where: { alunoId: aluno.id }
  });

  res.json(msgs.map(msg => ({
    ...msg,
    lida: lidas.some(lm => lm.mensagemId === msg.id)
  })));
});

// Marcar mensagem como lida
router.post("/mensagens/:id/lida", async (req, res) => {
  const email = req.user.email;
  const aluno = await prisma.aluno.findUnique({ where: { email } });
  if (!aluno) return res.status(401).json({ error: "Aluno não encontrado" });
  const mid = req.params.id;
  await prisma.leituraMensagem.upsert({
    where: { mensagemId_alunoId: { mensagemId: mid, alunoId: aluno.id } },
    update: {},
    create: { mensagemId: mid, alunoId: aluno.id }
  });
  res.json({ ok: true });
});