const withPwa = require('next-pwa');
module.exports = withPwa({
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com' , 'pay.rrrtopup.com'],
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});
