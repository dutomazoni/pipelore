# Rodando as duas aplicações com Docker Compose

```bash
# Navegar até a pasta do frontend
cd pipelore-frontend-next

# Construir e iniciar o container
docker-compose up -d

# Visualizar logs
docker-compose logs -f

# Parar o container
docker-compose down
```

# Pipelore Backend (Fastify)

API backend baseada em Fastify para gerenciamento de ordens de reparo.

## Funcionalidades

- API RESTful para gerenciamento de ordens de reparo
- Construída com Fastify para alta performance
- ORM Prisma com banco de dados SQLite
- TypeScript para segurança de tipos
- Documentação Swagger
- Suite de testes abrangente com Jest

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (para implantação em container)

## Desenvolvimento Local

### Instalação

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate
```

### Executando a Aplicação

```bash
# Modo de desenvolvimento com recarga automática
npm run dev

# Compilar a aplicação
npm run build

# Executar em modo de produção
npm run start
```

### Testes

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo de observação
npm run test:watch
```

## Implantação com Docker

A aplicação pode ser executada em um container Docker usando o Dockerfile e docker-compose.yml fornecidos.

### Configuração do Docker

O setup do Docker inclui:

- Node.js 20 Alpine como imagem base
- Geração automática do cliente Prisma
- Persistência do banco de dados SQLite usando volumes Docker
- Verificações de saúde para garantir a disponibilidade da aplicação
- Porta 4000 exposta para acesso à API

### Construindo e Executando com Docker Compose

```bash
# Construir e iniciar o container
docker-compose up -d

# Visualizar logs
docker-compose logs -f

# Parar o container
docker-compose down
```

### Volumes e Persistência de Dados

O Docker Compose configura um volume nomeado `sqlite-data` que é montado em `/app/prisma` para garantir que os dados do SQLite sejam persistidos mesmo quando o container é reiniciado ou recriado.

## Documentação da API

Uma vez que a aplicação esteja em execução, você pode acessar a documentação Swagger em:

```
http://localhost:4000/documentation
```

## Variáveis de Ambiente

- `PORT`: A porta na qual o servidor irá escutar (padrão: 4000)
- `NODE_ENV`: O modo de ambiente (development, production, test)

## Estrutura do Projeto

```
├── prisma/                # Schema Prisma e migrações
├── src/
│   ├── controllers/       # Manipuladores de requisições
│   ├── dtos/              # Objetos de Transferência de Dados
│   ├── generated/         # Cliente Prisma gerado
│   ├── middlewares/       # Funções de middleware
│   ├── plugins/           # Plugins Fastify
│   ├── repositories/      # Camada de acesso a dados
│   ├── routes/            # Rotas da API
│   ├── services/          # Lógica de negócios
│   ├── utils/             # Funções utilitárias
│   └── server.ts          # Ponto de entrada da aplicação
├── test/                  # Arquivos de teste
├── Dockerfile             # Configuração Docker
├── docker-compose.yml     # Configuração Docker Compose
└── package.json           # Dependências e scripts do projeto
```

# Pipelore Frontend

Sistema de gerenciamento de ordens de reparo desenvolvido com Next.js, React 19 e TypeScript.

## Índice

- [Requisitos](#requisitos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração e Execução](#configuração-e-execução)
    - [Instalação Local](#instalação-local)
    - [Configuração com Docker](#configuração-com-docker)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando Testes](#executando-testes)
- [Arquitetura do Projeto](#arquitetura-do-projeto)

## Requisitos

Para executar este projeto, você precisará:

- **Instalação Local**:
    - Node.js 20.x ou superior
    - npm 10.x ou superior

- **Instalação com Docker**:
    - [Docker](https://docs.docker.com/get-docker/)
    - [Docker Compose](https://docs.docker.com/compose/install/)

## Estrutura do Projeto

```
pipelore-frontend-next/
├── public/                  # Arquivos estáticos
├── src/
│   ├── app/                 # Componentes e páginas da aplicação
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── repair-orders/   # Páginas de ordens de reparo
│   │   │   ├── [id]/        # Página de detalhes da ordem
│   │   │   └── new/         # Página de criação de ordem
│   │   └── page.tsx         # Página inicial
│   ├── __tests__/           # Testes automatizados
│   │   ├── components/      # Testes de componentes
│   │   └── utils/           # Testes de utilitários
│   ├── styles/              # Estilos globais
│   └── utils/               # Funções utilitárias
│       ├── api.ts           # Funções de API
│       ├── formatters.ts    # Formatadores de dados
│       ├── translations.ts  # Traduções
│       └── types.ts         # Definições de tipos
├── Dockerfile               # Configuração do Docker
├── docker-compose.yml       # Configuração do Docker Compose
├── vitest.config.ts         # Configuração de testes
└── vitest.setup.ts          # Configuração de ambiente de testes
```

## Configuração e Execução

### Instalação Local

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd pipelore-frontend-next
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

### Configuração com Docker

#### Pré-requisitos
- Docker instalado
- Docker Compose instalado

#### Arquivo de Configuração Docker
`Dockerfile` - Define como construir o container da aplicação Next.js


## Variáveis de Ambiente

A configuração Docker usa as seguintes variáveis de ambiente:

### Serviço Frontend

- `NODE_ENV` - Definido como "production" por padrão
- `NEXT_PUBLIC_API_BASE_URL` - URL para o serviço de API, definido como "http://api:4000/api" por padrão

Você pode personalizar essas variáveis no arquivo `docker-compose.yml` ou criando um arquivo `.env`.

Para desenvolvimento local sem Docker, crie um arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

## Executando Testes

O projeto utiliza Vitest para testes. Os testes estão localizados no diretório `src/__tests__/`.

Para executar os testes:

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Estrutura de Testes

- `src/__tests__/components/` - Testes para componentes React
- `src/__tests__/utils/` - Testes para funções utilitárias

## Arquitetura do Projeto

### Principais Componentes

- **RepairOrderCard**: Exibe informações de uma ordem de reparo
- **RepairOrderForm**: Formulário para criar/editar ordens de reparo
- **RepairOrdersTable**: Tabela que lista todas as ordens de reparo

### Utilitários

- **api.ts**: Funções para comunicação com a API
- **formatters.ts**: Funções para formatação de dados (datas, status, etc.)
- **translations.ts**: Traduções para status e prioridades
- **types.ts**: Definições de tipos TypeScript para o projeto

### Fluxo de Dados

1. Os dados são buscados da API através das funções em `api.ts`
2. Os componentes consomem esses dados e os exibem na interface
3. As ações do usuário (criar, editar, excluir) são processadas pelos componentes e enviadas de volta para a API
