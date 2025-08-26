// ... imports e código já existente

// Mensagens para alunos - ADMIN AREA
router.get("/mensagens", async (req, res) => {
  const msgs = await prisma.mensagem.findMany({ orderBy: { dataEnvio: "desc" } });
  res.json(msgs);
});

router.post("/mensagens", async (req, res) => {
  const { titulo, corpo, destaque, ativa, destinatarios } = req.body;
  const msg = await prisma.mensagem.create({
    data: {
      titulo,
      corpo,
      destaque: !!destaque,
      ativa: !!ativa,
      destinatarios: destinatarios ? JSON.stringify(destinatarios) : null,
    }
  });
  res.json(msg);
});

router.put("/mensagens/:id", async (req, res) => {
  const { titulo, corpo, destaque, ativa, destinatarios } = req.body;
  const msg = await prisma.mensagem.update({
    where: { id: req.params.id },
    data: {
      titulo, corpo,
      destaque: !!destaque,
      ativa: !!ativa,
      destinatarios: destinatarios ? JSON.stringify(destinatarios) : null,
    }
  });
  res.json(msg);
});

router.delete("/mensagens/:id", async (req, res) => {
  await prisma.mensagem.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});