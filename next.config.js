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
        source: '/git',
        destination: 'https://github.com/chokunplayz',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/chokuntweets',
        permanent: true,
      },
      {
        source: '/ig',
        destination: 'https://instagram.com/chokunplayz',
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
      },
      {
        source: '/p',
        destination: 'https://github.com/chokunplayz',
        permanent: true,
      },
      {
        source: '/p/tnixsecdbootcamp25',
        destination: 'https://jpg.ckl.moe/share/cdxKufN1cQ1jQYHausvLsUGgD3ShxnKQHUvXrvgjTX1z8qsElQ_7RZGJZFETl1kgGSI',
        permanent: true
      },
      {
        source: '/p/tniitfirstmeetco25',
        destination: 'https://jpg.ckl.moe/share/_sgM-5tfUyVe38ePxMjlZvpw_T9fn4wFu9PV6pvg59zZ7WD0IDr8Rzxy30hyJGXY4yA',
        permanent: true
      }
    ]
  },
}
