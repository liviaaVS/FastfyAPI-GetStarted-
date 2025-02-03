import fastify from "fastify";

const app = fastify();

app.get("/", async (request, reply) => {
  return "Hello World!";
});

app.listen({ port: 8080 }).then(() => {
  console.log("Server is running on port 8080");
});
