/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
// import 'sweetalert2/src/sweetalert2.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import api from '../api/api';
import Layout from '../components/layout/Layout';
import { __access_token_key, __user_key } from '../config/globalConfig';
import routes from '../config/routes';
import {
  getLocal,
  getSession,
  removeBoth,
  setLocal,
  setSession,
} from '../lib/localStorage';
import '../styles/globals.scss';
import '../styles/why-choose.scss';

const queryClient = new QueryClient();

Nprogress.configure({
  showSpinner: false,
});

Router.events.on('routeChangeStart', () => Nprogress.start());
Router.events.on('routeChangeComplete', () => Nprogress.done());
Router.events.on('routeChangeError', () => Nprogress.done());

// Global context api
export const globalContext = React.createContext();

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const user = getLocal(__user_key) || getSession(__user_key);
  const access_token =
    getLocal(__access_token_key) || getSession(__access_token_key);

  const [authUser, setAuthUser] = useState(user);
  const [accessToken, setAccessToken] = useState(access_token);
  const [isAuth, setIsAuth] = useState(authUser && accessToken ? true : false);

  const setWhereItHas = (key, value) => {
    if (getSession(key)) return setSession(key, value);
    setLocal(key, value);
  };

  const signOut = () => {
    removeBoth(__user_key);
    removeBoth(__access_token_key);

    router.push(routes.login.name).then(() => {
      setIsAuth(false);
      setAuthUser(null);
      setAccessToken(null);
    });
  };

  const saveAuthUser = (userObj, accessToken, rememberMe, redirectUrl) => {
    removeBoth(__user_key);
    removeBoth(__access_token_key);

    if (rememberMe) {
      setLocal(__user_key, userObj);
      setLocal(__access_token_key, accessToken);
    } else {
      setSession(__user_key, userObj);
      setSession(__access_token_key, accessToken);
    }

    // Adding accessToken to api interceptor
    api.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });

    setAuthUser(userObj);
    setAccessToken(accessToken);
    setIsAuth(true);

    router.push(redirectUrl || routes.profile.name);
  };

  const updateAuthUserInfo = (userObj) => {
    setWhereItHas(__user_key, userObj);
    setAuthUser(userObj);
  };

  const glovalContextData = {
    authUser,
    accessToken,
    isAuth,
    signOut,
    saveAuthUser,
    updateAuthUserInfo,
  };

  return (
    <>
      <Head>
        <title>RRR TOPUP | RRR TOPUP is a top-up website in Bangladesh</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Chicle&family=Poppins&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#fff" />
        <meta
          name="description"
          content="Free fire, free fire Topup, free fire Daimond Topup, garena free fire, Call of duty, 
          TopUp  Bangladesh, free fire diamond topup bd, free fire diamond top up bd bkash, 
          free fire diamond top up bd 2024, free fire diamond top up bd server, 
          free fire diamond top up bd bkash, free fire diamond top up bd nagad, 
          free fire diamond top up bangladesh nagad, free fire diamond top up business bd, 
          free fire diamond top up app bd, free fire diamond top up low price bd, 
          free fire diamond top up visa card bangladesh, google play gift card free fire diamond top up bd"
        />
        <meta property="og:image" content="/logo.png" />
      </Head>
      <globalContext.Provider value={glovalContextData}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <ToastContainer />
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </globalContext.Provider>
    </>
  );
}

export default MyApp;
