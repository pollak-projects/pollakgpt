import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    APIKEY: process.env.APIKEY,
    NEXT_PUBLIC_APIKEY: process.env.NEXT_PUBLIC_APIKEY,
  },
  publicRuntimeConfig: {
    APIKEY: process.env.APIKEY,
    NEXT_PUBLIC_APIKEY: process.env.NEXT_PUBLIC_APIKEY,
  },
};

export default nextConfig;
