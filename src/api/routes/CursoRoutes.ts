import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../service/prisma";

export async function registerCursos(app: FastifyInstance) {
  app.post(
    "/cursos",
    {
      schema: {
        description: "Cria um novo curso",
        tags: ["Cursos"], // Categoria no Swagger
        body: {
          type: "object",
          required: ["nomeCurso", "professorId"],
          properties: {
            nomeCurso: { type: "string", description: "Nome do curso" },
            professorId: {
              type: "integer",
              description: "ID do professor responsável pelo curso",
            },
          },
        },
        response: {
          201: {
            description: "Curso criado com sucesso",
            type: "object",
            properties: {
              cursoId: { type: "integer", description: "ID do curso criado" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // Validação dos dados usando Zod
      const createCursoSchema = z.object({
        nomeCurso: z.string(),
        professorId: z.number(),
      });

      const { nomeCurso, professorId } = createCursoSchema.parse(request.body);

      // Criar curso no banco de dados
      const curso = await prisma.curso.create({
        data: {
          nomeCurso,
          professorId,
        },
      });

      return reply.status(201).send({ cursoId: curso.id });
    }
  );
}

export async function listCursos(app: FastifyInstance) {
  // Definir rota para listar todos os cursos
  app.get(
    "/cursos",
    {
      schema: {
        description: "Lista todos os cursos",
        tags: ["Cursos"],
        response: {
          200: {
            description: "Lista de cursos retornada com sucesso",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                nomeCurso: { type: "string" },
                professorId: { type: "integer" },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const cursos = await prisma.curso.findMany();
      return cursos;
    }
  );
}

export async function getCurso(app: FastifyInstance) {
  // Definir rota para obter um curso pelo ID
  app.get(
    "/cursos/:id",
    {
      schema: {
        description: "Obtém um curso pelo ID",
        tags: ["Cursos"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID do curso" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Curso retornado com sucesso",
            type: "object",
            properties: {
              id: { type: "integer" },
              nomeCurso: { type: "string" },
              professorId: { type: "integer" },
            },
          },
          404: {
            description: "Curso não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const getCursoParams = z.object({
        id: z.string().uuid(),
      });

      const { id } = getCursoParams.parse(request.params);

      const curso = await prisma.curso.findUnique({
        where: { id: Number(id) },
      });

      if (!curso) {
        return reply.status(404).send({ message: "Curso não existe" });
      }

      return curso;
    }
  );
}

export async function updateCurso(app: FastifyInstance) {
  app.put(
    "/cursos/:id",
    {
      schema: {
        description: "Atualiza um curso pelo ID",
        tags: ["Cursos"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID do curso" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            nomeCurso: { type: "string", description: "Nome do curso" },
            professorId: {
              type: "integer",
              description: "ID do professor responsável pelo curso",
            },
          },
        },
        response: {
          200: {
            description: "Curso atualizado com sucesso",
            type: "object",
            properties: {
              id: { type: "integer" },
              nomeCurso: { type: "string" },
              professorId: { type: "integer" },
            },
          },
          404: {
            description: "Curso não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const updateCursoParams = z.object({
        id: z.string().uuid(),
      });

      const updateCursoBody = z.object({
        nomeCurso: z.string(),
        professorId: z.number(),
      });

      const { id } = updateCursoParams.parse(request.params);
      const { nomeCurso, professorId } = updateCursoBody.parse(request.body);

      const curso = await prisma.curso.findUnique({
        where: { id: Number(id) },
      });

      if (!curso) {
        return reply.status(404).send({ message: "Curso não existe" });
      }

      const updatedCurso = await prisma.curso.update({
        where: { id: Number(id) },
        data: {
          nomeCurso,
          professorId,
        },
      });

      return updatedCurso;
    }
  );
}

export async function deleteCurso(app: FastifyInstance) {
  // Definir rota para deletar um curso pelo ID
  app.delete(
    "/cursos/:id",
    {
      schema: {
        description: "Deleta um curso pelo ID",
        tags: ["Cursos"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID do curso" },
          },
          required: ["id"],
        },
        response: {
          204: {
            description: "Curso deletado com sucesso",
          },
          404: {
            description: "Curso não encontrado",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    (request, reply) => {
      const deleteCursoParams = z.object({
        id: z.string().uuid(),
      });

      const { id } = deleteCursoParams.parse(request.params);

      const curso = prisma.curso.delete({
        where: { id: Number(id) },
      });

      return reply.status(204).send();
    }
  );
}
