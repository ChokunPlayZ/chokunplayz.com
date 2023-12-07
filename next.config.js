/** @type {import('next').NextConfig} */
module.exports = {
  runtime: 'edge',
  reactStrictMode: true,
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
