# KYC Platform

Full-stack Know Your Customer application with a React/Vite frontend, a TypeScript/Express backend, AI-powered summarization, and an async PDF/email worker.

## Development

```bash
npm install
npm run dev      # frontend
cd backend && npm install && npm run dev
```

## Docker

1. Place real credentials in `backend/.env` (same shape as `.env.example`), making sure `RABBITMQ_URL=amqp://rabbitmq:5672`.
2. Build and start the stack:

```bash
docker compose up --build
```

Services:

- `frontend` (Nginx serving Vite build) on http://localhost:5173
- `backend` API on http://localhost:5000
- `worker` processes PDF/email jobs
- `rabbitmq` management UI at http://localhost:15672 (guest/guest)

Stop with `docker compose down`.
