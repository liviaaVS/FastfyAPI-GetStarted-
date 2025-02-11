import Fastify from "fastify";

import { SwaggerConfig } from "./swagger";

import {
  registerCursos,
  listCursos,
  getCurso,
  deleteCurso,
  updateCurso,
} from "./routes/CursoRoutes";
import {
  registerAulas,
  listAulas,
  getAula,
  deleteAula,
  updateAula,
} from "./routes/AulasRoutes";

import {
  registerProfessores,
  listProfessores,
  getProfessor,
  deleteProfessor,
  updateProfessor,
} from "./routes/ProfessorRoutes";
const app = Fastify();

// Configurar o Swagger

const swaggerConfig = new SwaggerConfig(
  "API de Exemplo",
  "API de exemplo com Fastify",
  "1.0.0",
  "/docs"
);

swaggerConfig.setup(app);

app.register(registerCursos);
app.register(listCursos);
app.register(getCurso);
app.register(deleteCurso);
app.register(updateCurso);

app.register(registerAulas);
app.register(listAulas);
app.register(getAula);
app.register(deleteAula);
app.register(updateAula);

app.register(registerProfessores);
app.register(listProfessores);
app.register(getProfessor);
app.register(deleteProfessor);
app.register(updateProfessor);



// Iniciar o servidor
app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor Fastify rodando em ${address}`);
});
