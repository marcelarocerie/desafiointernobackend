import { PrismaClient, StatusEnvio, Plataforma } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
  // Criação dos formatos
  const formatos = [
    "Tela Dividida", "Tela Verde", "Cine", "Palestrinha",
    "Bastidores", "Storytelling Visual", "Experimento Social", "Conflito Situacional",
    "Caixinha de perguntas (polêmica)", "Dinamismo", "Comparação", "Telepatia",
    "Diálogo", "Trivial", "Narrado", "The Office"
  ];
  const formatosDB = await Promise.all(formatos.map(nome =>
    prisma.formato.upsert({
      where: { nome },
      update: {},
      create: { nome }
    })
  ));

  // Criação das estruturas
  const estruturas = [
    "Jeito Errado X Jeito Certo",
    "Ele, Eu, Você, Futuro",
    "I. H. C.",
    "Formato de Análise Estratégica"
  ];
  const estruturasDB = await Promise.all(estruturas.map(nome =>
    prisma.estrutura.upsert({
      where: { nome },
      update: {},
      create: { nome }
    })
  ));

  // Criação dos alunos
  const alunos = [
    { nome: "Alice Souza", email: "alice@ficticio.com" },
    { nome: "Bruno Lima", email: "bruno@ficticio.com" },
    { nome: "Carla Dias", email: "carla@ficticio.com" },
    { nome: "Diego Marques", email: "diego@ficticio.com" },
    { nome: "Eva Torres", email: "eva@ficticio.com" },
  ];
  const alunosDB = await Promise.all(alunos.map(aluno =>
    prisma.aluno.upsert({
      where: { email: aluno.email },
      update: {},
      create: aluno
    })
  ));

  // 10 envios distribuídos entre os 16 formatos
  const links = [
    "https://youtu.be/video1", "https://youtu.be/video2", "https://youtu.be/video3",
    "https://youtu.be/video4", "https://youtu.be/video5", "https://youtu.be/video6",
    "https://youtu.be/video7", "https://youtu.be/video8", "https://youtu.be/video9",
    "https://youtu.be/video10"
  ];
  const plataformas = [Plataforma.YOUTUBE, Plataforma.INSTAGRAM, Plataforma.REELS, Plataforma.TIKTOK, Plataforma.SHORTS];

  for (let i = 0; i < 10; i++) {
    await prisma.envio.create({
      data: {
        alunoId: alunosDB[i % alunosDB.length].id,
        formatoId: formatosDB[i % formatosDB.length].id,
        estruturaId: i % 4 === 0 ? estruturasDB[i % estruturasDB.length].id : null,
        link: links[i],
        plataforma: plataformas[i % plataformas.length],
        dataPostagem: new Date(Date.now() - i * 86400000),
        observacoes: i % 2 === 0 ? "Primeiro envio" : null,
        status: i % 3 === 0 ? StatusEnvio.APROVADO : StatusEnvio.PENDENTE,
      }
    });
  }

  // Configuração
  await prisma.config.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      totalDesafio: 32,
      metaSemanal: 8,
      dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 14),
      dataFim: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 30),
      webhookUrl: null
    }
  });

  console.log('Seed concluído');
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect());