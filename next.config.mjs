import withBundleAnalyzer from '@next/bundle-analyzer';
/* eslint-disable @typescript-eslint/no-var-requires */
// Importing consola for logging.
import consola from 'consola';
import withPlugins from 'next-compose-plugins';

import { env } from './env.mjs';

consola
  .withDefaults({
    fancy: true,
    badge: true,
  })
  .withTag('ChatGPT')
  .wrapConsole();

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({ enabled: env.ANALYZE })]], {
  reactStrictMode: true,
  experimental: { instrumentationHook: true },
  rewrites() {
    return [
      { source: '/healthz', destination: '/api/health' },
      { source: '/api/healthz', destination: '/api/health' },
      { source: '/health', destination: '/api/health' },
      { source: '/ping', destination: '/api/health' },
    ];
  },
});

export default config;
