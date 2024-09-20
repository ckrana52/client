const withPwa = require('next-pwa');
module.exports = withPwa({
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com', 'pay.rrrtopup.com'],
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off', // Disable the missing dependency warning
    '@next/next/no-img-element': 'off', // Disable the <img> element warning
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});
