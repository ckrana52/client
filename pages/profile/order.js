import Head from 'next/head';
import { Fragment, useState, useRef, useCallback, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { getUserOrders } from '../../api/api';
import ActivityIndicator from '../../components/ActivityIndicator';
import Alert from '../../components/Alert';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import FlashMessage from '../../components/FlashMessage';
import { __page_title_end } from '../../config/globalConfig';
import reactQueryConfig from '../../config/reactQueryConfig';
import { hasData } from '../../helpers/helpers';
import { BiCopy } from 'react-icons/bi';

function OrderPage() {
  // const {
  //   data: orders,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery('get-user-orders', getUserOrders, reactQueryConfig);
  const { copied, onCopy } = useClipboard({ duration: 4000 });
  const [copyId, setCopyId] = useState(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useInfiniteQuery('get-user-orders', getUserOrders, {
    ...reactQueryConfig,
    select: (res) => res.pages,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.data?.nextPage || undefined;
    },
  });

  const _hasData = data?.[0]?.data?.data?.data;

  const copyContent = (data, id) => {
    const copyData = data.replace("UPBD-", "").replace("BDMB-", "")
    window.navigator.clipboard.writeText(copyData ?? '').then(() => {
      onCopy();
      setCopyId(id);
    });
  };

  return (
    <>
      <Head>
        <title>Orders {__page_title_end}</title>
      </Head>
      <section>
        <FlashMessage showToast />
        <div className="container my-7">
          <h1 className="_section_title">My Orders</h1>
          <div className="space-y-5">
            {hasData(data) &&
              data.map((orderBlocks, index) => (
                <Fragment key={index}>
                  {orderBlocks.data.data.data.map((order, index2) => (
                    <div
                      key={order?.id || index2}
                      className="border relative border-gray-200 p-3 md:p-4 rounded-md overflow-hidden flex justify-between"
                    >
                      <div className="space-y-1.5">
                        <p className="_subtitle1">
                          <span className="font-semibold mr-1.5">
                            Order Id:
                          </span>{' '}
                          {order?.id}
                        </p>
                        <p className="_subtitle1">
                          <span className="font-semibold mr-1.5">Date:</span>{' '}
                          {order?.created_at}
                        </p>
                        <p className="_subtitle1">
                          <span className="font-semibold mr-1.5">
                            Total Price:
                          </span>{' '}
                          {order?.amount}
                        </p>
                        
                        
                        <p className="_subtitle1">
                          <span className="font-semibold mr-1.5">
                            Phone:
                          </span>{' '}
                          {order?.phone}
                        </p>
                        <p className="_subtitle1">
                          <span className="font-semibold mr-1.5">
                            Transaction ID:
                          </span>{' '}
                          {order?.transaction_id}
                        </p>
                          
                        
                        <p className="_subtitle1">
                          <span className="font-semibold mr-1.5">
                            Package Name:
                          </span>{' '}
                          {order?.name}
                        </p>
                        <p className="_subtitle1">
                          <span className="font-semibold mr-1.5">
                            {order?.TopupProduct?.topup_type === 'voucher'
                              ? 'Voucher'
                              : order?.TopupProduct?.topup_type === 'id_code' ? 'Player Id' : 'Number / Email'}
                            :
                          </span>{' '}
                          {order?.TopupProduct?.topup_type != 'voucher' && (
                            <span>{order?.playerid}</span>
                          )}
                          {order?.TopupProduct?.topup_type == 'voucher' && (
                            <span>
                              <span className="bg-[#E3FAE8] text-sm sm:text-lg p-2 sm:p-3 inline-block">
                                {order?.Voucher?.data}
                              </span>
                              <span>
                                <button
                                  className="p-2 sm:p-3 ml-3 text-sm sm:text-lg rounded-md bg-green-500"
                                  onClick={() =>
                                    copyContent(order?.Voucher?.data, order?.id)
                                  }
                                >
                                  {copied && copyId == order?.id ? (
                                    'copied!'
                                  ) : (
                                    <BiCopy />
                                  )}
                                </button>
                              </span>
                            </span>
                          )}
                        </p>
                        {order?.brief_note && (
                          <Alert
                            type="error"
                            title={
                              <span>
                                <strong>Note:</strong> {order.brief_note}
                              </span>
                            }
                            className="block w-full !mt-2.5"
                          />
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        {order?.TopupProduct?.topup_type !== 'voucher' && (
                          <Badge type={order.status} />
                        )}
                        {order?.TopupProduct?.topup_type === 'voucher' &&
                          
                            <a
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 text-sm sm:text-lg bg-green-500 p-1 rounded-md"
                              href={order?.TopupProduct?.redeem_link}
                            >
                              Reedem code
                            </a>
                          }
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
          </div>
          {/* Load More */}
          {hasData(_hasData) && hasNextPage && (
            <div className="flex justify-center mt-5">
              <Button
                text="Load More"
                loading={isFetching || isFetchingNextPage}
                disabled={!hasNextPage}
                onClick={fetchNextPage}
              />
            </div>
          )}
          {!isFetching && !isFetchingNextPage && (
            <ActivityIndicator
              data={_hasData}
              loading={isLoading}
              error={isError ? error : false}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default OrderPage;

const useClipboard = (props) => {
  const [copied, setCopied] = useState(false);
  const resetCopy = useRef();

  const onCopy = () => {
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      resetCopy.current = setTimeout(
        () => setCopied(false),
        props?.duration || 3000
      );
    }

    return () => {
      clearTimeout(resetCopy.current);
    };
  }, [copied, props.duration]);

  return { copied, onCopy };
};
