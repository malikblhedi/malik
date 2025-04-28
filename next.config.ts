import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  },
  // Tu peux ajouter d'autres options ici si besoin
};

export default nextConfig;
