import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { CorsPluginOptions } from "../types";

const isRegExp = (v: unknown): v is RegExp => v instanceof RegExp;

export default fp<CorsPluginOptions>(async (fastify, opts) => {
  const {
    envVar = "CORS_ORIGINS",
    credentials = true,
    methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  } = opts;

  const envOrigins = (process.env[envVar]?.split(",").map(s => s.trim()).filter(Boolean) ?? []) as string[];

  const allowed: (string | RegExp)[] =
    opts.origins ?? (envOrigins.length > 0 ? envOrigins : [""]);

  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok = allowed.some((rule) => (isRegExp(rule) ? rule.test(origin) : rule === origin));
      cb(null, ok);
    },
    methods,
    credentials,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "Content-Range"],
  });
});