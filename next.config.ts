// next.config.ts

const nextConfig = {
  images: {
    /** разрешаем любые пути на указанных хостах */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // двойная *  → любой путь/файл
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "eshop-ecommerce.s3.eu-north-1.amazonaws.com",
        pathname: "/**", // любые пути и файлы
      },
    ],
  },
};

export default nextConfig;
