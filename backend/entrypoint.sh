#!/bin/sh
set -e

echo "⏳ Gerando o Prisma client..."
npm run db:generate

echo "⏳ Sincronizando a base de dados..."

if [ "$NODE_ENV" = "development" ]; then
    echo "--- AMBIENTE DE DESENVOLVIMENTO ---"
    echo "⏳ Migrando a base de dados..."
    npx prisma migrate reset --force
    npx prisma migrate dev --name init
    echo "🚀 Iniciando servidor em modo desenvolvimento..."
    npm run dev
else
    echo "--- AMBIENTE DE PRODUÇÃO ---"
    echo "⏳ Deployando migrações..."
    npx prisma migrate deploy
    echo "⏳ Buildando o projecto..."
    npm run build
    echo "🚀 Iniciando servidor em modo produção..."
    npm run prod
fi

echo "🚀 Servidor iniciado com sucesso!"
