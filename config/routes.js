const routes = Object.freeze({
  settings: {
    name: 'settings'
  },
  login: {
    name: '/login',
  },
  register: {
    name: '/register',
  },
  forgotPassword: {
    name: '/forgot-password',
  },
  verifyOtp: {
    name: `/forgot-password/verify-otp`,
  },
  changePassword: {
    name: `/forgot-password/change-password`,
  },
  profile: {
    auth: true,
    name: '/profile',
  },
  addMoney: {
    name: '/add-money',
  },
  myWallet: {
    name: '/wallet',
  },
  topup: {
    name: '/topup',
  },
  shop: {
    name: '/shop',
  },
  contactUs: {
    name: '/contact-us',
  },
  myOrder: {
    name: '/profile/order',
  },
  myTransaction: {
    name: '/profile/transaction',
  },
  myShop: {
    name: '/profile/my-shop',
  },
});

export default routes;
