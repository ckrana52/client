import Head from 'next/head';
import { useContext } from 'react';
import AuthGuard from '../components/AuthGuard';
import WalletPage from '../components/Wallet.page';
import { __page_title_end } from '../config/globalConfig';
import { globalContext } from './_app';

function Wallet() {
  const ctx = useContext(globalContext);
  return (
    <>
      <Head>
        {ctx?.authUser && <title>My wallet {__page_title_end}</title>}
      </Head>
      <AuthGuard>
        <WalletPage />
      </AuthGuard>
    </>
  );
}

export default Wallet;
