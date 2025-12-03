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

#### Arquivos de Configuração Docker
O projeto inclui dois arquivos principais de configuração Docker:

1. `Dockerfile` - Define como construir o container da aplicação Next.js
2. `docker-compose.yml` - Orquestra os serviços de frontend e API

#### Construindo e Executando com Docker Compose

Para construir e iniciar a aplicação:

```bash
# Construir e iniciar todos os serviços em modo detached
docker-compose up -d

# Visualizar logs
docker-compose logs -f
```

Para parar a aplicação:

```bash
docker-compose down
```

#### Personalizando o Serviço de API

O arquivo `docker-compose.yml` inclui um placeholder para o serviço de API. Você deve substituí-lo pela configuração real do seu serviço de API:

```yaml
api:
  # Substitua pela configuração real do seu serviço de API
  image: sua-imagem-api:latest
  # Ou construa a partir de um Dockerfile
  # build:
  #   context: ../caminho-para-api
  #   dockerfile: Dockerfile
  ports:
    - "4000:4000"
  environment:
    - NODE_ENV=production
    # Adicione outras variáveis de ambiente conforme necessário
  restart: unless-stopped
  networks:
    - app-network
```

#### Desenvolvimento vs Produção

A configuração Docker fornecida está configurada para uso em produção. Para desenvolvimento:

1. Use o servidor de desenvolvimento:
   ```yaml
   # No docker-compose.yml, altere o comando para o serviço frontend
   command: npm run dev
   ```

2. Monte seu código local como um volume para hot reloading:
   ```yaml
   # No docker-compose.yml, adicione volumes ao serviço frontend
   volumes:
     - ./:/app
     - /app/node_modules
     - /app/.next
   ```

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

### Solução de Problemas

#### Container falha ao iniciar

Verifique os logs para erros:
```bash
docker-compose logs frontend
```

#### Problemas de conexão com a API

Certifique-se de que o serviço de API está em execução e acessível a partir do container frontend:
```bash
docker-compose exec frontend curl http://api:4000/api
```

#### Problemas de desempenho

Para melhor desempenho em máquinas de desenvolvimento, você pode adicionar o seguinte ao seu arquivo Docker Compose:

```yaml
volumes:
  node_modules:
  next_cache:

services:
  frontend:
    # ... outras configurações
    volumes:
      - ./:/app
      - node_modules:/app/node_modules
      - next_cache:/app/.next
```

Isso usa volumes nomeados para node_modules e o cache de build do Next.js para melhorar o desempenho.
