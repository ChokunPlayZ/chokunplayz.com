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
      },
      {
        source: '/adobesucks',
        destination: 'https://drive.ckl.moe/d/s/r2que1RE82SDPvIoEGw3PSqcTJqbWCF8/y141ifognf67_bT2o0pdmXfF--j8kkDi-XrxAo8QZ-gk',
        permanent: true
      }
    ]
  },
}
