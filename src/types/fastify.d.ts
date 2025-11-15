import "fastify";
import { TokenPayload } from "./jwt";

declare module "fastify" {
  interface FastifyRequest {
    authUser?: {
      token: string;
      payload: TokenPayload;
    };
  }
}