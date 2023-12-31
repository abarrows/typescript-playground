import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(['true', 'false'])
      .optional()
      .transform((value) => value === 'true'),
    CONFLUENCE_DOMAIN: z.string().optional(),
    CONFLUENCE_USERNAME: z.string().optional(),
    CONFLUENCE_API_TOKEN: z.string().optional(),
  },
  client: { NEXT_PUBLIC_BASE_URL: z.string().optional() },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    CONFLUENCE_DOMAIN: process.env.CONFLUENCE_DOMAIN,
    CONFLUENCE_API_TOKEN: process.env.CONFLUENCE_API_TOKEN,
    CONFLUENCE_USERNAME: process.env.CONFLUENCE_USERNAME,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
