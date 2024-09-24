/* eslint-disable @next/next/no-img-element */
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import api from '../api/api';
import ActivityIndicator from '../components/ActivityIndicator';
import Product from '../components/product/Product';
import Game from '../components/game';
import { hasData, imgPath } from '../helpers/helpers';
import FlatNotice from '../components/flat-notice/Notice';
import InstallApp from '../components/InstallApp';

function Home({ topup_products, products, banners }) {
  return (
    <>
      <FlatNotice />
      {hasData(banners) && (
        <section className="mb-6 md:my-8 home_slider_wrapper rounded-xl">
          <div className="container">
            <Swiper
              autoplay={{
                delay: 3000,
              }}
              loop={true}
              modules={[Navigation, Pagination, Autoplay]}
              pagination={true}
              navigation={true}
              // spaceBetween={50}
              slidesPerView={1}
            >
              {banners.map((banner, index) => (
                <SwiperSlide key={index}>
                  <div>
                    <a
                      href={banner.link}
                      target={banner.link === '#' ? '_self' : '_blank'}
                      rel="noreferrer"
                    >
                      <img
                        src={imgPath(banner.banner)}
                        alt={banner.note}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
      {/* Favourite games --Start-- */}
      <section className="container mt-5 mb-10 ">
        <h3
          style={{
            fontFamily: "'Black Ops One', cursive",
            'border-color': '#0D0D7A',
          }}
          className="_section_title border-b-4 !capitalize !text-2xl md:!text-4xl !mb-8 pt-6"
        >
          <span className="text-primary-400 rounded-lg ">GAME TOP-UP</span>
        </h3>
        <ActivityIndicator data={topup_products} error={!topup_products} />
        <div className="grid grid-cols-2 md:grid-cols-5 md:justify-center mt-[40px] gap-3 md:gap-5 gap-y-6 md:gap-y-5">
          {hasData(topup_products) &&
            topup_products.map((topup_product, index) => (
              <div key={index}>
                <Game game={topup_product} />
              </div>
            ))}
        </div>
      </section>
      {/* Favourite games --End-- */}

      <section className="mt-5 mb-10">
        <div className="mx-auto">
          <InstallApp />
        </div>
      </section>
    </>
  );
}

export default Home;

export async function getServerSideProps(ctx) {
  let topup_products = null;
  let products = null;
  let banners = null;

  // Fetching Topup Products
  try {
    const res = await api.get('/topupproduct');
    topup_products = res?.data?.data;
  } catch (error) {
    topup_products = null;
  }

  // Fetching Products
  try {
    const productRes = await api.get('/products');
    products = productRes?.data?.data;
  } catch (error) {
    products = null;
  }

  // Fetching Banners
  try {
    const bannerRes = await api.get('/banner');
    banners = bannerRes?.data?.data;
  } catch (error) {
    banners = null;
  }

  return {
    props: {
      topup_products,
      products,
      banners,
    },
  };
}
