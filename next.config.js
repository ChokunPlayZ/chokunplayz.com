/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.ckl.moe',
        port: '',
        pathname: '/guest/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/chokunplayz',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/chokuntweets',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/M8GrEeZAcz',
        permanent: true,
      }
    ]
  },
}
