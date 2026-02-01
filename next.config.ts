import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname: "sea1.ingest.uploadthing.com",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "6sn8pk7mrd.ufs.sh",
        port: "",
        protocol: "https"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
