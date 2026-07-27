const { PrismaClient } = require('@prisma/client');
const { randomBytes, scryptSync } = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

const clients = [
  {
    slug: 'northstudio',
    name: 'North Studio',
    title: 'Design que posiciona marcas no caminho certo.',
    description: 'Estúdio criativo especializado em identidade visual, social media e experiências digitais para empresas que querem crescer com consistência.',
    theme: 'dark',
    primaryColor: '#7C3AED',
    secondaryColor: '#3B0764',
    backgroundColor: '#0C0712',
    backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1800&auto=format&fit=crop&q=85',
    fontFamily: 'Tecna',
    logo: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop&q=85',
    headerImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1400&auto=format&fit=crop&q=85',
    showBranding: true,
    clientEmail: 'north@orbitlink.com',
    clientPassword: 'North@2026',
    views: 0,
    clicks: 0,
    links: [
      { title: 'Conheça nosso portfólio', url: 'https://www.behance.net/', description: 'Projetos de branding e social media', icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=85' },
      { title: 'Solicitar orçamento', url: 'https://wa.me/5587999999999', description: 'Fale diretamente com o estúdio', icon: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900&auto=format&fit=crop&q=85' },
      { title: 'Instagram', url: 'https://instagram.com/', description: 'Acompanhe os projetos mais recentes', icon: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=900&auto=format&fit=crop&q=85' },
      { title: 'LinkedIn', url: 'https://linkedin.com/', description: 'Conecte-se com a North Studio', icon: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=900&auto=format&fit=crop&q=85' },
    ],
    pix: {
      title: 'Pagamento via Pix',
      pixKey: 'northstudio@exemplo.com',
      description: 'Copie a chave ou escaneie o QR Code.',
    },
  },
  {
    slug: 'brena-bright',
    name: 'Brena Bright',
    title: 'Limpeza premium para uma rotina mais leve.',
    description: 'Serviços de limpeza residencial com atendimento cuidadoso, agendamento rápido e planos personalizados.',
    theme: 'modern',
    primaryColor: '#10B981',
    secondaryColor: '#065F46',
    backgroundColor: '#F3FFFA',
    backgroundImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800&auto=format&fit=crop&q=85',
    fontFamily: 'Tecna',
    logo: 'https://images.unsplash.com/photo-1581578731548-c64695c952952?w=500&auto=format&fit=crop&q=85',
    headerImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1400&auto=format&fit=crop&q=85',
    showBranding: true,
    clientEmail: 'brena@orbitlink.com',
    clientPassword: 'Brena@2026',
    views: 0,
    clicks: 0,
    links: [
      { title: 'Agendar uma limpeza', url: 'https://calendly.com/', description: 'Escolha o melhor dia e horário', icon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&auto=format&fit=crop&q=85' },
      { title: 'Falar no WhatsApp', url: 'https://wa.me/5511988888888', description: 'Tire dúvidas e peça seu orçamento', icon: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&auto=format&fit=crop&q=85' },
      { title: 'Avaliações de clientes', url: 'https://maps.google.com/', description: 'Veja experiências de outros clientes', icon: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&auto=format&fit=crop&q=85' },
      { title: 'Instagram', url: 'https://instagram.com/', description: 'Antes e depois dos nossos serviços', icon: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&auto=format&fit=crop&q=85' },
    ],
    pix: {
      title: 'Pagar serviço com Pix',
      pixKey: 'brena@bright.com.br',
      description: 'Pagamento rápido e seguro.',
    },
  },
];

async function main() {
  console.log('Preparando dados iniciais da Orbit...');

  const admin = await prisma.user.upsert({
    where: { clerkId: 'orbit_local_admin' },
    update: {
      email: process.env.ADMIN_EMAIL || 'admin@orbitlink.com',
      name: 'Administrador Orbit',
      plan: 'premium',
    },
    create: {
      clerkId: 'orbit_local_admin',
      email: process.env.ADMIN_EMAIL || 'admin@orbitlink.com',
      name: 'Administrador Orbit',
      plan: 'premium',
    },
  });

  for (const data of clients) {
    const workspace = await prisma.workspace.upsert({
      where: { slug: data.slug },
      update: {
        userId: admin.id,
        name: data.name,
        title: data.title,
        description: data.description,
        theme: data.theme,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        backgroundColor: data.backgroundColor,
        backgroundImage: data.backgroundImage,
        fontFamily: data.fontFamily,
        logo: data.logo,
        headerImage: data.headerImage,
        showBranding: data.showBranding,
        clientEmail: data.clientEmail,
        clientPasswordHash: hashPassword(data.clientPassword),
      },
      create: {
        userId: admin.id,
        slug: data.slug,
        name: data.name,
        title: data.title,
        description: data.description,
        theme: data.theme,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        backgroundColor: data.backgroundColor,
        backgroundImage: data.backgroundImage,
        fontFamily: data.fontFamily,
        logo: data.logo,
        headerImage: data.headerImage,
        showBranding: data.showBranding,
        clientEmail: data.clientEmail,
        clientPasswordHash: hashPassword(data.clientPassword),
        views: data.views,
        clicks: data.clicks,
      },
    });

    const linkCount = await prisma.link.count({ where: { workspaceId: workspace.id } });
    if (linkCount === 0) {
      await prisma.link.createMany({
        data: data.links.map((link, index) => ({
          workspaceId: workspace.id,
          title: link.title,
          url: link.url,
          description: link.description,
          icon: link.icon,
          order: index,
          isActive: true,
          clicks: 0,
        })),
      });
    }

    const pixCount = await prisma.pixQRCode.count({ where: { workspaceId: workspace.id } });
    if (pixCount === 0) {
      await prisma.pixQRCode.create({
        data: {
          workspaceId: workspace.id,
          title: data.pix.title,
          pixKey: data.pix.pixKey,
          description: data.pix.description,
          isActive: true,
        },
      });
    }

    console.log(`Cliente cadastrado: ${data.name} (/${data.slug})`);
  }

  console.log('Setup concluído. Dois clientes estão prontos para uso.');
  console.log('North Studio: north@orbitlink.com / North@2026');
  console.log('Brena Bright: brena@orbitlink.com / Brena@2026');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
