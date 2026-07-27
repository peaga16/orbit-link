const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Começando seed do banco de dados...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { clerkId: 'demo_user_001' },
    update: {},
    create: {
      clerkId: 'demo_user_001',
      email: 'demo@linkflow.com.br',
      name: 'Demo User',
      plan: 'starter',
    },
  });

  console.log(`✅ Usuário criado: ${user.name}`);

  // Create first demo workspace (North Studio)
  const workspace1 = await prisma.workspace.upsert({
    where: { slug: 'northstudio' },
    update: {},
    create: {
      userId: user.id,
      slug: 'northstudio',
      name: 'North Studio',
      title: 'North Studio - Agência Criativa',
      description: 'Agência especializada em design e identidade visual',
      theme: 'modern',
      primaryColor: '#FF0000',
      secondaryColor: '#000000',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Inter',
      logo: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=200&h=200&fit=crop',
      showBranding: true,
    },
  });

  console.log(`✅ Workspace criado: ${workspace1.name}`);

  // Create links for workspace 1
  const links1 = await Promise.all([
    prisma.link.create({
      data: {
        workspaceId: workspace1.id,
        title: 'Portfólio',
        url: 'https://northstudio.com',
        description: 'Veja nossos projetos e cases',
        order: 1,
        isActive: true,
      },
    }),
    prisma.link.create({
      data: {
        workspaceId: workspace1.id,
        title: 'Instagram',
        url: 'https://instagram.com/northstudio',
        description: 'Siga nossos trabalhos',
        order: 2,
        isActive: true,
      },
    }),
    prisma.link.create({
      data: {
        workspaceId: workspace1.id,
        title: 'WhatsApp',
        url: 'https://wa.me/5511999999999',
        description: 'Chat direto no WhatsApp',
        order: 3,
        isActive: true,
      },
    }),
    prisma.link.create({
      data: {
        workspaceId: workspace1.id,
        title: 'LinkedIn',
        url: 'https://linkedin.com/company/northstudio',
        description: 'Conecte conosco',
        order: 4,
        isActive: true,
      },
    }),
    prisma.link.create({
      data: {
        workspaceId: workspace1.id,
        title: 'Agendar Reunião',
        url: 'https://calendly.com/northstudio',
        description: 'Marque uma consultoria',
        order: 5,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${links1.length} links criados para North Studio`);

  // Create Pix QR Code for workspace 1
  const pix1 = await prisma.pixQRCode.create({
    data: {
      workspaceId: workspace1.id,
      title: 'Pague com Pix',
      pixKey: '123e4567-e89b-12d3-a456-426614174000',
      description: 'QR Code para pagamentos via Pix',
      isActive: true,
    },
  });

  console.log(`✅ QR Code Pix criado para North Studio`);

  // Create second demo workspace (Brena Bright)
  const workspace2 = await prisma.workspace.upsert({
    where: { slug: 'brena-bright' },
    update: {},
    create: {
      userId: user.id,
      slug: 'brena-bright',
      name: 'Brena Bright',
      title: 'Brena Bright - Limpeza Premium',
      description: 'Serviço premium de limpeza residencial em São Paulo',
      theme: 'modern',
      primaryColor: '#10B981',
      secondaryColor: '#1F2937',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Inter',
      logo: 'https://images.unsplash.com/photo-1581578731548-c64695c952952?w=200&h=200&fit=crop',
      showBranding: true,
    },
  });

  console.log(`✅ Workspace criado: ${workspace2.name}`);

  // Create links for workspace 2
  const links2 = await Promise.all([
    prisma.link.create({
      data: {
        workspaceId: workspace2.id,
        title: 'Agendar Limpeza',
        url: 'https://calendly.com/brena-bright',
        description: 'Marque sua limpeza agora',
        order: 1,
        isActive: true,
      },
    }),
    prisma.link.create({
      data: {
        workspaceId: workspace2.id,
        title: 'WhatsApp',
        url: 'https://wa.me/5511988888888',
        description: 'Dúvidas? Fale conosco',
        order: 2,
        isActive: true,
      },
    }),
    prisma.link.create({
      data: {
        workspaceId: workspace2.id,
        title: 'Avaliações',
        url: 'https://google.com/maps/place/brena-bright',
        description: 'Veja o que nossos clientes dizem',
        order: 3,
        isActive: true,
      },
    }),
    prisma.link.create({
      data: {
        workspaceId: workspace2.id,
        title: 'Planos e Preços',
        url: 'https://brena-bright.com/planos',
        description: 'Conheça nossos pacotes',
        order: 4,
        isActive: true,
      },
    }),
    prisma.link.create({
      data: {
        workspaceId: workspace2.id,
        title: 'Instagram',
        url: 'https://instagram.com/brena.bright',
        description: 'Veja nossos resultados',
        order: 5,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${links2.length} links criados para Brena Bright`);

  // Create Pix QR Code for workspace 2
  const pix2 = await prisma.pixQRCode.create({
    data: {
      workspaceId: workspace2.id,
      title: 'Pague com Pix',
      pixKey: 'brena@bright.com.br',
      description: 'QR Code para pagamentos via Pix',
      isActive: true,
    },
  });

  console.log(`✅ QR Code Pix criado para Brena Bright`);

  // Create sample analytics
  for (let i = 0; i < 50; i++) {
    await prisma.analytics.create({
      data: {
        workspaceId: workspace1.id,
        linkId: links1[0].id,
        eventType: 'click',
        referrer: 'direct',
        userAgent: 'Mozilla/5.0',
        country: 'BR',
        city: 'São Paulo',
      },
    });
  }

  console.log(`✅ 50 eventos de analytics criados`);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
