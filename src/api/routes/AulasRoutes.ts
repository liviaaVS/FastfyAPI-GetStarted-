import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../service/prisma";

export async function registerAulas(app: FastifyInstance) {
  app.post(
    "/aulas",
    {
      schema: {
        description: "Cria uma nova aula",
        tags: ["Aulas"], // Categoria no Swagger
        body: {
          type: "object",
          required: ["video", "descricao", "cursoId"],
          properties: {
            video: { type: "string", description: "URL do vídeo da aula" },
            descricao: { type: "string", description: "Descrição da aula" },
            cursoId: {
              type: "integer",
              description: "ID do curso relacionado",
            },
          },
        },
        response: {
          201: {
            description: "Aula criada com sucesso",
            type: "object",
            properties: {
              aulaId: { type: "integer", description: "ID da aula criada" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // Validação dos dados usando Zod
      const createAulaSchema = z.object({
        video: z.string(),
        descricao: z.string(),
        cursoId: z.number(),
      });

      const { video, descricao, cursoId } = createAulaSchema.parse(
        request.body
      );

      // Criar aula no banco de dados
      const aula = await prisma.aula.create({
        data: {
          video,
          descricao,
          cursoId,
        },
      });

      return reply.status(201).send({ aulaId: aula.id });
    }
  );
}

export async function listAulas(app: FastifyInstance) {
  app.get(
    "/aulas",
    {
      schema: {
        description: "Lista todas as aulas",
        tags: ["Aulas"],
        response: {
          200: {
            description: "Lista de aulas retornada com sucesso",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                video: { type: "string" },
                descricao: { type: "string" },
                cursoId: { type: "integer" },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const aulas = await prisma.aula.findMany();
      return aulas;
    }
  );
}

export async function getAula(app: FastifyInstance) {
  app.get(
    "/aulas/:id",
    {
      schema: {
        description: "Obtém uma aula pelo ID",
        tags: ["Aulas"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID da aula" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Aula retornada com sucesso",
            type: "object",
            properties: {
              id: { type: "integer" },
              video: { type: "string" },
              descricao: { type: "string" },
              cursoId: { type: "integer" },
            },
          },
          404: {
            description: "Aula não encontrada",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = z.object({ id: z.string().uuid() }).parse(request.params);

      const aula = await prisma.aula.findUnique({
        where: { id: Number(id) },
      });

      if (!aula) {
        return reply.status(404).send({ message: "Aula não encontrada" });
      }

      return aula;
    }
  );
}

export async function updateAula(app: FastifyInstance) {
  app.put(
    "/aulas/:id",
    {
      schema: {
        description: "Atualiza uma aula pelo ID",
        tags: ["Aulas"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID da aula" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            video: { type: "string", description: "URL do vídeo da aula" },
            descricao: { type: "string", description: "Descrição da aula" },
            cursoId: {
              type: "integer",
              description: "ID do curso relacionado",
            },
          },
        },
        response: {
          200: {
            description: "Aula atualizada com sucesso",
            type: "object",
            properties: {
              id: { type: "integer" },
              video: { type: "string" },
              descricao: { type: "string" },
              cursoId: { type: "integer" },
            },
          },
          404: {
            description: "Aula não encontrada",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
      const { video, descricao, cursoId } = z
        .object({
          video: z.string(),
          descricao: z.string(),
          cursoId: z.number(),
        })
        .parse(request.body);

      const aula = await prisma.aula.findUnique({
        where: { id: Number(id) },
      });

      if (!aula) {
        return reply.status(404).send({ message: "Aula não encontrada" });
      }

      const updatedAula = await prisma.aula.update({
        where: { id: Number(id) },
        data: {
          video,
          descricao,
          cursoId,
        },
      });

      return updatedAula;
    }
  );
}

export async function deleteAula(app: FastifyInstance) {
  app.delete(
    "/aulas/:id",
    {
      schema: {
        description: "Deleta uma aula pelo ID",
        tags: ["Aulas"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID da aula" },
          },
          required: ["id"],
        },
        response: {
          204: {
            description: "Aula deletada com sucesso",
          },
          404: {
            description: "Aula não encontrada",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = z.object({ id: z.string().uuid() }).parse(request.params);

      const aula = await prisma.aula.delete({
        where: { id: Number(id) },
      });

      return reply.status(204).send();
    }
  );
}
