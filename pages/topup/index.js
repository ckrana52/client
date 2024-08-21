import Head from 'next/head';
import api from '../../api/api';
import ActivityIndicator from '../../components/ActivityIndicator';
import Game from '../../components/game';
import { __page_title_end } from '../../config/globalConfig';
import { hasData } from '/helpers/helpers';

function TopupPage({ topup_products }) {
  return (
    <>
      <Head>
        <title>Topup Games {__page_title_end}</title>
      </Head>
      {/* Favourite games --Start-- */}
      <section className="container my-7">
        <h3 className="_section_title">Games Topup</h3>
        <ActivityIndicator data={topup_products} error={!topup_products} />
        <div className="_grid_2_4_6">
          {hasData(topup_products) &&
            topup_products.map((topup_product, index) => (
              <Game key={index} game={topup_product} />
            ))}
        </div>
      </section>
      {/* Favourite games --End-- */}
    </>
  );
}

export default TopupPage;

export async function getServerSideProps(ctx) {
  let topup_products = null;

  try {
    const res = await api.get('/topupproduct');
    topup_products = res?.data?.data;
  } catch (error) {
    topup_products = null;
    console.log(error);
  }

  return {
    props: {
      topup_products,
    },
  };
}
