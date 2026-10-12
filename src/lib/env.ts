/**
 * Server-only environment. This (with `env.public.ts`) is the ONLY place
 * allowed to read `process.env` — enforced by ESLint.
 */
import 'server-only';

import { parseEnv, serverEnvSchema, type ServerEnv } from './env.schema';

export const serverEnv: ServerEnv = parseEnv(serverEnvSchema, process.env, 'server');

export { publicEnv } from './env.public';
