import Link from 'next/link';
import { Fragment } from 'react';
import { useContext } from 'react';
import { useInfiniteQuery } from 'react-query';
import { BiTransfer } from 'react-icons/bi';
import { getUserTransactions } from '../api/api';
import { useState } from 'react';
import api from '../api/api';
import routes from '../config/routes';
import useUpdateUserInfo from '../hooks/useUpdateUserInfo';
import { globalContext } from '../pages/_app';
import Badge from './Badge';
import Button from './Button';
import DataTable from './data-table/DataTable';
import FlashMessage from './FlashMessage';
import reactQueryConfig from '../config/reactQueryConfig';
import { hasData } from '../helpers/helpers';
import { setFlashMessage } from '../helpers/helpers';
import Alert from '../components/Alert';
import Shape from '../components/Shape';
import Image from 'next/image';

function WalletPage() {
  const capitalized = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const { authUser } = useContext(globalContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const repay = (id) => {
    setIsSubmitting(true);
    api
      .get(`/auto-payment-repeat/${id}`)
      .then((response) => {
        window.location.href = response.data.data.payment_url;
        return;
      })
      .catch((err) => {
        setFlashMessage('Something went wrong.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const cancelWallet = (id) => {
    setIsSubmitting(true);
    api
      .get(`/auto-payment-cancel/${id}`)
      .then((response) => {
        setFlashMessage('Success.');
        window.location.reload();
      })
      .catch((err) => {
        setFlashMessage('Something went wrong.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useInfiniteQuery('get-user-transactions', getUserTransactions, {
    ...reactQueryConfig,
    select: (res) => res.pages,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.data?.nextPage || undefined;
    },
  });

  console.log(data?.[0]?.data?.data?.data);
  // Updating User Data On Every Time user visit wallet page
  useUpdateUserInfo();

  return (
    <section className="py-5 md:py-7 bg-gray-50">
      <FlashMessage showToast />
      <div className="container">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden md:w-[600px] text-center md:mx-auto px-4 md:px-5 py-6">
          <p className="_h5 mb-1 text-primary-500 !font-bold">
            ৳ {authUser?.wallet}
          </p>
          <p className="_subtitle1 !text-sm">Available Balance</p>
          <div className="md:w-[70%] md:mx-auto mt-5">
            <Link href={routes.addMoney.name}>
              <a>
                <Button
                  className="w-full block"
                  StartIcon={<BiTransfer size={20} color="#fffff" />}
                >
                  Topup Account Balance
                </Button>
              </a>
            </Link>
          </div>
        </div>

        <h1 className="_section_title mt-2">My Transaction</h1>

        <div className="space-y-6 bg-white border border-gray-200 p-3 pb-5 rounded-md">
          {hasData(data) &&
            data.map((orderBlocks, index) => (
              <Fragment key={index}>
                {orderBlocks.data.data.data.map((order, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-stretch flex-wrap border-b border-gray-200  py-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <Shape
                        size={65}
                        className="bg-white !ring-1 !ring-gray-200"
                      >
                        <Image
                          src={`https://pay.rrrtopup.com/assets/template/images/${order?.payment_method}.png`}
                          alt="Method"
                          width={200}
                          height={200}
                          className="w-full h-auto"
                        />
                      </Shape>
                      <div>
                        {/* <h6 className='_h6'>Pending</h6> */}
                        {/* <Badge
                        type={order?.status}
                        text={order?.status === "cancel" ? "Canceled" : order?.status}
                        className="!p-0  !font-semibold !text-base"
                      /> */}
                        <p
                          className={`font-semibold ${
                            order?.status === 'cancel'
                              ? 'text-red-500'
                              : order?.status === 'completed'
                              ? 'text-green-500'
                              : order?.status === 'pending'
                              ? 'text-black'
                              : 'text-gray-500' // fallback color for other statuses
                          }`}
                        >
                          {order?.status === 'cancel'
                            ? 'Canceled'
                            : capitalized(order?.status)}
                        </p>
                        <div className="flex items-center gap-x-1">
                          
                          <p>{order?.number}</p>
                        </div>
                        <div className="flex items-center gap-x-1 ">
                          <p className="_subtitle1 !text-sm text-gray-800 ">
                            TnxID:
                          </p>
                          <p className="text-sm">
                            {' '}
                            {order?.transaction_id || '------'}
                          </p>
                        </div>
                      </div>
                      {order?.is_automated == 1 &&
                        order?.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => {
                                repay(order?.id);
                              }}
                              loading={isSubmitting}
                            >
                              Pay
                            </Button>
                            <Button
                              onClick={() => {
                                cancelWallet(order?.id);
                              }}
                              loading={isSubmitting}
                              className="bg-red-500 hover:bg-red-700"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <p className="_subtitle1 !text-sm text-gray-800">
                        {order?.created_at}
                      </p>
                      <p className="_subtitle1 !text-base font-bold ">
                        <span
                          className={`${
                            order?.status === 'cancel'
                              ? 'text-red-500'
                              : order?.status === 'completed'
                              ? 'text-green-500'
                              : order?.status === 'pending'
                              ? 'text-black'
                              : 'text-gray-500' // fallback color for other statuses
                          }`}
                        >
                          {`BDT ${order?.amount}`}
                        </span>
                      </p>
                    </div>
                    {order?.status === 'under_review' && (
                      <Alert
                        type="error"
                        title={
                          <span>
                            <strong>Note:</strong> একটি সমস্যা হয়েছে! দয়া করে
                            আমাদের Support এ যোগাযোগ করুন
                            {/* <a href="tel:01767375523">01767375523</a> */}
                          </span>
                        }
                        className="block w-full !mt-2.5"
                      />
                    )}
                  </div>
                ))}
              </Fragment>
            ))}
        </div>
      </div>
    </section>
  );
}

export default WalletPage;
