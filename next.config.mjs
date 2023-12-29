import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"
import { env } from "./env.mjs"
/* eslint-disable @typescript-eslint/no-var-requires */
// Importing consola for logging.
import consola from "consola"

consola
  .withDefaults({
    badge: true,
    formatOptions: {
      date: true,
      colors: true,
      compact: true,
      col: 10,
    },
  })
  .withTag("ChatGPT")
  .wrapConsole()

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({ enabled: env.ANALYZE })]], {
  reactStrictMode: true,
  experimental: { instrumentationHook: true },
  rewrites() {
    return [
      { source: "/healthz", destination: "/api/health" },
      { source: "/api/healthz", destination: "/api/health" },
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" },
    ]
  },
})

export default config
