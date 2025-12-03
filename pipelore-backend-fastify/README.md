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
- Docker e Docker Compose (para implantação em contêiner)

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

A aplicação pode ser executada em um contêiner Docker usando o Dockerfile e docker-compose.yml fornecidos.

### Configuração do Docker

O setup do Docker inclui:

- Node.js 20 Alpine como imagem base
- Geração automática do cliente Prisma
- Persistência do banco de dados SQLite usando volumes Docker
- Verificações de saúde para garantir a disponibilidade da aplicação
- Porta 4000 exposta para acesso à API

### Construindo e Executando com Docker Compose

```bash
# Construir e iniciar o contêiner
docker-compose up -d

# Visualizar logs
docker-compose logs -f

# Parar o contêiner
docker-compose down
```

### Volumes e Persistência de Dados

O Docker Compose configura um volume nomeado `sqlite-data` que é montado em `/app/prisma` para garantir que os dados do SQLite sejam persistidos mesmo quando o contêiner é reiniciado ou recriado.

### Verificações de Saúde

O contêiner inclui verificações de saúde que testam a disponibilidade da API a cada 30 segundos. Isso ajuda a garantir que a aplicação esteja funcionando corretamente.

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

## Executando Testes no Docker

Para executar os testes dentro do contêiner Docker:

```bash
# Acessar o shell do contêiner
docker exec -it pipelore-backend sh

# Executar os testes
npm test
```

## Solução de Problemas Comuns

### Banco de Dados

Se você encontrar problemas com o banco de dados SQLite:

```bash
# Regenerar o cliente Prisma
docker exec -it pipelore-backend npx prisma generate

# Verificar o status do banco de dados
docker exec -it pipelore-backend ls -la prisma/
```

### Logs da Aplicação

Para depurar problemas, verifique os logs da aplicação:

```bash
# Ver logs em tempo real
docker-compose logs -f
```

### Reiniciar o Contêiner

Se a aplicação não estiver respondendo corretamente:

```bash
# Reiniciar o contêiner
docker-compose restart
```