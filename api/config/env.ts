import dotenv from "dotenv";

dotenv.config();

// Centraliza la lectura de variables para evitar process.env disperso por la app.
export const env = {
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    name: process.env.DB_NAME ?? "ptcrud",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
  },
  syncAlter: process.env.DB_SYNC_ALTER === "true",
};
