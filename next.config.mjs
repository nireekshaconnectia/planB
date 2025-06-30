/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
      locales: ["en", "ar"], // Define supported languages
      defaultLocale: "en", // Set English as the default language
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.planbqa.shop',
        },
      ],
    },
};
  
export default nextConfig;  