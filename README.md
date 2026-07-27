# Orbit — páginas profissionais de links

Sistema para entregar páginas de links prontas aos clientes. O administrador cria e publica cada página; o cliente acessa um painel exclusivo para editar conteúdo, imagens, links, Pix e acompanhar métricas reais.

## Instalação

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis obrigatórias

```env
DATABASE_URL="postgresql://..."

ADMIN_EMAIL="admin@orbitlink.com"
ADMIN_PASSWORD="uma-senha-segura"
ADMIN_SESSION_SECRET="uma-chave-longa-e-aleatoria"
CLIENT_SESSION_SECRET="outra-chave-longa-e-aleatoria"

CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

As credenciais do Cloudinary ficam no painel da sua conta. O `API_SECRET` permanece somente no servidor; os uploads passam por `/api/upload`.

## Rotas

- `/` — landing page do serviço
- `/clientes` — diretório público com todos os clientes
- `/admin/login` — login administrativo
- `/admin` — dashboard administrativo
- `/cliente/login` — login individual do cliente
- `/dashboard` — dashboard do cliente autenticado
- `/dashboard/editar` — edição da página, links, imagens e Pix
- `/{slug}` — página pública do cliente

## Clientes iniciais

O comando `npm run setup` cria:

```text
North Studio
Página: /northstudio
E-mail: north@orbitlink.com
Senha: North@2026

Brena Bright
Página: /brena-bright
E-mail: brena@orbitlink.com
Senha: Brena@2026
```

Troque as senhas pelo painel administrativo antes de publicar.

## Métricas

- Cada abertura de `/{slug}` registra uma visualização.
- Cada clique passa por `/api/public/link/{id}` e incrementa o link e a página.
- Admin e cliente leem os números diretamente do banco.
- Editar um link existente mantém seu ID e o histórico de cliques.

## Banco de dados

Depois de substituir os arquivos desta atualização, execute:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

`db:push` adiciona ao workspace os campos de e-mail e senha do cliente.
