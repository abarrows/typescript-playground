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
    CONFLUENCE_API_QUERY: z.string().optional(),
    JIRA_DOMAIN: z.string().optional(),
    JIRA_USERNAME: z.string().optional(),
    JIRA_API_TOKEN: z.string().optional(),
    JIRA_API_QUERY: z.string().optional(),
  },
  client: { NEXT_PUBLIC_BASE_URL: z.string().optional() },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    CONFLUENCE_DOMAIN: process.env.CONFLUENCE_DOMAIN,
    CONFLUENCE_API_TOKEN: process.env.CONFLUENCE_API_TOKEN,
    CONFLUENCE_USERNAME: process.env.CONFLUENCE_USERNAME,
    CONFLUENCE_API_QUERY: process.env.CONFLUENCE_API_QUERY,
    JIRA_DOMAIN: process.env.JIRA_DOMAIN,
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN,
    JIRA_USERNAME: process.env.JIRA_USERNAME,
    JIRA_API_QUERY: process.env.JIRA_API_QUERY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
