import 'dotenv/config'; 
import { fastifyApp } from "./app";

const fastify = await fastifyApp();
const PORT = Number(process.env.PORT);
const HOST = String(process.env.HOST);

fastify.listen({ host: HOST, port: PORT}, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Server listening on ${address}`)
})