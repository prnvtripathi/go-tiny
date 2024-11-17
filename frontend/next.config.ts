import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/home',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
