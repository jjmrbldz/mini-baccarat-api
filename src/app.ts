import Fastify from "fastify";
import { zodPlugin, corsPlugin } from "./plugins";
import { authRoutes, baccaratRoutes, betHistoryRoutes, tournamentRoutes, userRoutes } from "./routes";

export async function fastifyApp() {
  const fastify = Fastify({ logger: true });

  await fastify.register(corsPlugin);
  fastify.register(zodPlugin);

  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(userRoutes, { prefix: "/user" });
  fastify.register(baccaratRoutes, { prefix: "/baccarat" });
  fastify.register(betHistoryRoutes, { prefix: "/bet-history" });
  fastify.register(tournamentRoutes, { prefix: "/tournament" });

  fastify.get('/', (request, reply) => {
    reply.send({ 
      ok: true,
      message: 'Welcome to Mini Baccarat API' 
    })
  });


  return fastify;
}
