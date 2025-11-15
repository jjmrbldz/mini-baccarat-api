
export interface CorsPluginOptions {
  /** Allowed origins. Example: ['http://localhost:5173', /.*\.mydomain\.com$/] */
  origins?: (string | RegExp)[];
  /** Default: true */
  credentials?: boolean;
  /** Default: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'] */
  methods?: string[];
  /** Comma-separated origins in env (fallback) */
  envVar?: string; // default: 'CORS_ORIGINS'
}