import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"], // Ajoute le domaine Unsplash
  },
  async headers() {
    return [
      {
        source: "/(.*)", // Applique à toutes les routes
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // Permet l'ouverture des popups
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless", // Option pour éviter les blocages
          },
        ],
      },
    ];
  },
};

export default nextConfig;
