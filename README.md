# 🏘️ Plataforma Comunitária Digital

Plataforma web responsiva para conectar moradores de bairros e pequenas cidades.

## 🚀 Tecnologias

- **Frontend/Backend**: Next.js 14 + TypeScript
- **Estilização**: Tailwind CSS
- **BaaS**: Supabase (Auth, Database, Storage)
- **Banco de Dados**: PostgreSQL
- **Hospedagem**: Vercel + Supabase

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase (gratuita)
- Conta no Vercel (opcional)

## 🔧 Instalação

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No **SQL Editor**, execute o arquivo `supabase/schema.sql`
3. Em **Storage**, crie um bucket `publications` (público)
4. Em **Authentication > Providers**, habilite Email/Password

### 3. Variáveis de Ambiente

Copie `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key

### 4. Executar o Projeto
```bash
npm run dev
```

Acesse http://localhost:3000

## ✨ Funcionalidades

✅ Autenticação (email/senha + Google)  
✅ CRUD de publicações  
✅ 5 categorias (Ajuda, Serviços, Vagas, Doações, Avisos)  
✅ Upload de múltiplas imagens  
✅ Sistema de busca e filtros  
✅ Painel administrativo  
✅ Design responsivo mobile-first  
✅ Row Level Security (RLS)  

## 📁 Estrutura
```
plataforma-comunitaria/
├── app/                    # Páginas Next.js
│   ├── api/               # API Routes
│   ├── admin/             # Painel admin
│   ├── login/             # Autenticação
│   ├── cadastro/          # Registro
│   ├── publicar/          # Criar publicação
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Home (feed)
├── components/            # Componentes React
│   ├── Navbar.tsx
│   └── PublicationCard.tsx
├── lib/
│   └── supabase.ts       # Cliente Supabase
├── supabase/
│   └── schema.sql        # Schema do banco
└── ...
```

## 👤 Criar Usuário Admin

Para tornar um usuário administrador:

1. Acesse Supabase Dashboard
2. Vá em **Table Editor > profiles**
3. Encontre o usuário pelo email
4. Edite o campo `role` para `admin`
5. Salve

## 🚀 Deploy na Vercel

1. Push para GitHub
2. Importe no Vercel
3. Configure as variáveis de ambiente
4. Deploy!

## 🔒 Segurança

- Row Level Security (RLS) ativado
- Autenticação JWT segura
- Validação de dados no backend
- Upload de imagens com validação
- HTTPS obrigatório em produção

## 📝 Licença

MIT

## 🤝 Contribuindo

Pull requests são bem-vindos!

---

Desenvolvido com ❤️ para comunidades locais
