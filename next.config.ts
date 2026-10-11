import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // iyzipay loads its resource files with a runtime fs.readdirSync() +
  // require() instead of static imports. Turbopack can't trace that at
  // build time ("server relative imports are not implemented yet") and
  // fails the whole build. Marking it external tells Next to leave it as a
  // plain Node require() at runtime instead of bundling it — which is fine,
  // since it's only ever used from server-side API routes (lib/iyzico.ts).
  serverExternalPackages: ["iyzipay"],
};

export default nextConfig;

