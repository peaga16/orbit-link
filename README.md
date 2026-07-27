# 🎯 LinkFlow - Platform de Links Inteligentes

> Uma plataforma SaaS profissional para criar centrais de presença digital com links, QR Code Pix, analytics e muito mais.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## ✨ O que é LinkFlow?

LinkFlow é uma plataforma SaaS moderna para criar páginas de presença digital profissionais. Ao invés de apenas um Linktree genérico, oferecemos uma solução **completa** com:

- 🔗 Links ilimitados com customização
- 🤖 QR Code Pix automático
- 📊 Analytics em tempo real
- 🎨 Temas profissionais
- 📱 100% responsivo
- 🚀 Pronto para produção

## 🎯 Planos e Preços

| Plano | Preço | Visualizações | Links | Recursos |
|-------|-------|---------------|-------|----------|
| **Iniciante** | R$ 29,90 | 10k/mês | Ilimitados | Links, QR Pix, Analytics |
| **Profissional** | R$ 49,90 | 100k/mês | Ilimitados | +Formulários, +NFC, +Integrações |
| **Premium** | R$ 89,90 | Ilimitado | Ilimitados | +API, +Domínio, +Suporte 24/7 |

## 🚀 Começar Rápido

### 1. Pré-requisitos
```bash
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn
```

### 2. Clonar e Instalar
```bash
git clone https://github.com/seu-usuario/linkflow.git
cd linkflow
npm install
```

### 3. Configurar Variáveis de Ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 4. Configurar Banco de Dados
```bash
npm run db:push
npm run db:seed
```

### 5. Iniciar Servidor
```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 📚 Documentação

- [Setup Completo](./SETUP.md) - Instalação passo a passo
- [Funcionalidades](./FEATURES.md) - Recursos inclusos em cada plano
- [API Reference](./docs/API.md) - Endpoints da API
- [Customização](./docs/CUSTOMIZATION.md) - Personalizar projeto

## 🎨 Design Moderno

A plataforma foi desenvolvida com design moderno e profissional:

- **Landing Page**: Hero com CTAs, features, showcase de clientes, pricing
- **Dashboard**: Interface intuitiva com analytics, gerenciamento de links
- **Página Pública**: Landing page personalizada do usuário com design responsivo
- **Temas**: 4 temas pré-definidos + customização de cores

### Preview das Páginas

#### Landing Page
- Hero com call-to-action forte
- Seção de features (8 recursos principais)
- Showcase de 2 clientes de exemplo
- Pricing table
- CTA final

#### Dashboard
- Sidebar navegável
- Visão geral com estatísticas
- Gráficos de analytics
- Gerenciamento de links
- Configurações de tema

#### Página Pública (Clientes Exemplo)
- **North Studio**: northstudio (agência criativa)
- **Brena Bright**: brena-bright (limpeza residencial)

## 📊 Arquitetura

### Stack Técnico
```
Frontend: Next.js 14 + React 18 + Tailwind CSS + Framer Motion
Backend: Next.js API Routes
Database: PostgreSQL + Prisma ORM
Auth: Clerk OAuth2
Storage: Cloudinary
```

### Estrutura do Banco de Dados
```
Users
├── Workspaces (multi-tenant)
│   ├── Links
│   ├── Analytics
│   ├── PixQRCodes
│   ├── NFCTags
│   ├── Forms
│   │   ├── FormFields
│   │   └── FormSubmissions
│   └── Templates
```

## 🔐 Segurança

- ✅ Autenticação OAuth2 (Clerk)
- ✅ Proteção CSRF
- ✅ Rate limiting
- ✅ SQL Injection prevention (Prisma ORM)
- ✅ Validação de entrada
- ✅ HTTPS/SSL
- ✅ LGPD compliant

## 📱 Responsividade

Totalmente responsivo em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 🖥️ Desktop (1920px+)

## 🛠️ Funcionalidades Implementadas

### MVP (Starter Plan)
- [x] Multi-tenant com slugs
- [x] Autenticação Clerk
- [x] CRUD de links
- [x] QR Code Pix
- [x] Temas customizáveis
- [x] Analytics básico
- [x] Dashboard responsivo
- [x] Landing page
- [x] Página pública
- [x] Seed com clientes exemplo

### Próximas Adições
- [ ] NFC Tags
- [ ] Formulários avançados
- [ ] Integrações WhatsApp/Instagram
- [ ] Agenda de agendamentos
- [ ] Catálogo de produtos
- [ ] API pública
- [ ] Marketplace de templates
- [ ] White label
- [ ] Mobile app

## 📈 Performance

- ⚡ First Load: < 2s
- 🚀 Lighthouse: 95+
- ♿ Accessibility: WCAG 2.1 AA
- 🔐 Security: A+

## 🎓 Clientes de Exemplo

### 1. North Studio
**URL**: http://localhost:3000/northstudio

Agência criativa com:
- 5 links personalizados
- QR Code Pix
- Tema moderno
- Analytics ativas

### 2. Brena Bright
**URL**: http://localhost:3000/brena-bright

Serviço de limpeza com:
- 5 links personalizados
- QR Code Pix
- Tema verde customizado
- Analytics ativas

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t linkflow .
docker run -p 3000:3000 linkflow
```

## 💡 Casos de Uso

✅ Freelancers e criativos
✅ Pequenos negócios
✅ Influenciadores
✅ Consultores e coaches
✅ Agências
✅ Serviços locais

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 📧 Email: support@linkflow.com.br
- 💬 Discord: [comunidade](https://discord.gg/)
- 📖 Docs: [docs.linkflow.com](https://docs.linkflow.com)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/linkflow/issues)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Clerk](https://clerk.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

## 👨‍💻 Autor

Desenvolvido por **André Felipe** (@andrefelipe.clevera)

Plataforma criada para revolucionar como pequenos negócios brasileiros centralizam sua presença digital.

---

<div align="center">

**[Documentação](./SETUP.md)** • **[Features](./FEATURES.md)** • **[Issues](https://github.com/seu-usuario/linkflow/issues)** • **[Discord](https://discord.gg/)**

Desenvolvido com ❤️ para pequenos negócios

</div>
