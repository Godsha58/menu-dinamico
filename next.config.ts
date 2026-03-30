import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* React Compiler + Zustand persist ha causado fallos de runtime en algunos entornos (p. ej. Edge). */
};

export default nextConfig;
