import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../service/prisma";

export async function registerProfessores(app: FastifyInstance) {
  app.post(
    "/professores",
    {
      schema: {
        description: "Cria um novo professor",
        tags: ["Professores"], // Categoria no Swagger
        body: {
          type: "object",
          required: ["nome", "cpf", "email", "senha"],
          properties: {
            nome: { type: "string", description: "Nome do professor" },
            cpf: { type: "string", description: "CPF do professor" },
            email: { type: "string", description: "Email do professor" },
            senha: { type: "string", description: "Senha do professor" },
          },
        },
        response: {
          201: {
            description: "Professor criado com sucesso",
            type: "object",
            properties: {
              professorId: {
                type: "integer",
                description: "ID do professor criado",
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // Validação dos dados usando Zod
      const createProfessorSchema = z.object({
        nome: z.string(),
        cpf: z.string(),
        email: z.string(),
        senha: z.string(),
      });

      const { nome, cpf, email, senha } = createProfessorSchema.parse(
        request.body
      );

      // Criar professor no banco de dados
      const professor = await prisma.professor.create({
        data: {
          nome,
          cpf,
          email,
          senha,
        },
      });

      return reply.status(201).send({ professorId: professor.id });
    }
  );
}


export async function getProfessor(app: FastifyInstance) {
  app.get(
    "/professores/:id",
    {
      schema: {
        description: "Obtém um professor pelo ID",
        tags: ["Professores"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID do professor" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Professor retornado com sucesso",
            type: "object",
            properties: {
              id: { type: "integer" },
              nome: { type: "string" },
              cpf: { type: "string" },
              email: { type: "string" },
            },
          },
          404: {
            description: "Professor não encontrado",
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

      const professor = await prisma.professor.findUnique({
        where: { id: Number(id) },
      });

      if (!professor) {
        return reply.status(404).send({ message: "Professor não encontrado" });
      }

      return professor;
    }
  );
}

export async function listProfessores(app: FastifyInstance) {
  app.get(
    "/professores",
    {
      schema: {
        description: "Lista todos os professores",
        tags: ["Professores"],
        response: {
          200: {
            description: "Lista de professores retornada com sucesso",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                nome: { type: "string" },
                cpf: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const professores = await prisma.professor.findMany();
      return professores;
    }
  );
}

export async function updateProfessor(app: FastifyInstance) {
  app.put(
    "/professores/:id",
    {
      schema: {
        description: "Atualiza um professor pelo ID",
        tags: ["Professores"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID do professor" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            nome: { type: "string", description: "Nome do professor" },
            cpf: { type: "string", description: "CPF do professor" },
            email: { type: "string", description: "Email do professor" },
            senha: { type: "string", description: "Senha do professor" },
          },
        },
        response: {
          200: {
            description: "Professor atualizado com sucesso",
            type: "object",
            properties: {
              id: { type: "integer" },
              nome: { type: "string" },
              cpf: { type: "string" },
              email: { type: "string" },
            },
          },
          404: {
            description: "Professor não encontrado",
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
      const { nome, cpf, email, senha } = z
        .object({
          nome: z.string(),
          cpf: z.string(),
          email: z.string(),
          senha: z.string(),
        })
        .parse(request.body);

      const professor = await prisma.professor.findUnique({
        where: { id: Number(id) },
      });

      if (!professor) {
        return reply.status(404).send({ message: "Professor não encontrado" });
      }

      const updatedProfessor = await prisma.professor.update({
        where: { id: Number(id) },
        data: {
          nome,
          cpf,
          email,
          senha,
        },
      });

      return updatedProfessor;
    }
  );
}

export async function deleteProfessor(app: FastifyInstance) {
  app.delete(
    "/professores/:id",
    {
      schema: {
        description: "Deleta um professor pelo ID",
        tags: ["Professores"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID do professor" },
          },
          required: ["id"],
        },
        response: {
          204: {
            description: "Professor deletado com sucesso",
          },
          404: {
            description: "Professor não encontrado",
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

      const professor = await prisma.professor.delete({
        where: { id: Number(id) },
      });

      return reply.status(204).send();
    }
  );
}
