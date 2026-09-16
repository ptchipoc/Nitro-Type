#!/bin/bash
# Gera certificado SSL auto-assinado pra desenvolvimento
# Roda uma vez só antes do docker compose up

# Diretório onde este script está (nginx/tools/)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Pasta certs fica um nível acima (nginx/certs/)
CERTS_DIR="$(dirname "$SCRIPT_DIR")/certs"

mkdir -p "$CERTS_DIR"

openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$CERTS_DIR/qcena.key" \
    -out "$CERTS_DIR/qcena.crt" \
    -subj "/C=AO/ST=Luanda/L=Luanda/O=Qcena/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "Certificados gerados em $CERTS_DIR"
