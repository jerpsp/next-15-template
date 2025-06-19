import type { NextConfig } from "next"
import path, { dirname } from "path"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  turbopack: {
    resolveAlias: {
      "@": path.resolve(dirname("./")),
    },
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack", "url-loader"],
      },
    },
  },
}

const withNextIntl = createNextIntlPlugin("./locales/request.ts")

export default withNextIntl(nextConfig)
