import fp from 'fastify-plugin';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';
import { FastifyPluginAsync } from 'fastify';

const zodPluginFn: FastifyPluginAsync = async (app) => {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
};

export default fp(zodPluginFn, { name: 'zod-plugin' });