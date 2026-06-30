import { app } from "./app";
import { env } from "./config/env";
import { sequelize } from "./database/sequelize";
import "./models";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    // facilita crear/actualizar la tabla sin migraciones manuales.
    await sequelize.sync({ alter: env.syncAlter });

    app.listen(env.port, () => {
      console.log(`API escuchando en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("No fue posible iniciar la API.", error);
    process.exit(1);
  }
};

void startServer();
