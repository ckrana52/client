import Head from 'next/head';
import ActivityIndicator from '../../components/ActivityIndicator';
import {
  __page_title_end,
  __redirect_url_key,
} from '../../config/globalConfig';
import api, { getOrderDetailsById } from '../../api/api';
import { useQuery } from 'react-query';
import reactQueryConfig from '../../config/reactQueryConfig';
import { useRouter } from 'next/router';
import { FaRegWindowClose } from 'react-icons/fa';
import { hasData } from '../../helpers/helpers';
function ShurjopaySuccess() {
  const router = useRouter();

  const orderId = router.query.id;
  const { data, isLoading, error, isError } = useQuery(
    'get-order-details',
    () => getOrderDetailsById(orderId),
    {
      ...reactQueryConfig,
      enabled: !!orderId,
    }
  );

  return (
    <>
      <Head>
        <title>Shurjopay {__page_title_end}</title>
      </Head>
      <div className="container">
        <ActivityIndicator
          data={data}
          loading={isLoading}
          errorMsg="Topup product not found"
          error={isError ? error : undefined}
        />
        {hasData(data) && (
          <div className="w-full text-center sm:w-[380px] md:w-[650px] _form_wrapper relative">
            <h3 className="_h3">
              <div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                <div className="text-red-500 mr-2">
                  <FaRegWindowClose />
                </div>
                Failed Payment.
              </div>
            </h3>

            <div className="relative flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-md py-5 pl-6 pr-8 sm:pr-6">
              <div className="max-w-2xl mx-auto">
                <div className="flow-root">
                  <ul role="list" className="divide-y ">
                    <li className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate ">
                            Order ID:
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold ">
                          {data.id}
                        </div>
                      </div>
                    </li>

                    <li className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate ">
                            Payment ID:
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold ">
                          {data.payment_data}
                        </div>
                      </div>
                    </li>

                    <li className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate ">
                            Total :
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold ">
                          {data.amount}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ShurjopaySuccess;
