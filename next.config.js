/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
module.exports = {
  async redirects() {
    return [
      {
        source: "/*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
module.exports = {
  async redirects() {
    return [
      {
        source: "/dashboard/*",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};
module.exports = {
  images: {
    domains: [
      "platform-lookaside.fbsbx.com",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
    ],
  },
};
