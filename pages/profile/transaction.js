import Head from 'next/head';
import { useState } from 'react';
import { getUserTransactions } from '../../api/api';
import Badge from '../../components/Badge';
import DataTable from '../../components/data-table/DataTable';
import FlashMessage from '../../components/FlashMessage';
import Button from '../../components/Button';
import api from '../../api/api';
import { setFlashMessage } from '../../helpers/helpers';
import { __page_title_end } from '../../config/globalConfig';

function OrderPage() {
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
  return (
    <>
      <Head>
        <title>Transactions {__page_title_end}</title>
      </Head>
      <section className="mt-7 md:mt-0 border-t border-gray-200 md:border-none">
        <FlashMessage showToast />
        <div className="container !px-0 md:!px-5 md:my-7">
          <div>
            <DataTable
              apiFunc={getUserTransactions}
              title="My Transactions"
              apiKey="get-user-transactions"
              columns={['Amount', 'Number', 'Status', 'Date']}
            >
              {(data) => {
                return data.map((d, i) => (
                  <tr className={i % 2 === 0 ? 'bg-gray-200' : ''} key={i}>
                    <td className="_tr">{d?.amount}</td>
                    <td className="_tr">{d?.number}</td>
                    <td className="_tr">
                      <Badge type={d?.status} />
                      <br />
                      {d?.is_automated == 1 && d?.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => {
                              repay(d?.id);
                            }}
                            loading={isSubmitting}
                          >
                            Pay
                          </Button>
                          <Button
                            onClick={() => {
                              cancelWallet(d?.id);
                            }}
                            loading={isSubmitting}
                            className="bg-red-500 hover:bg-red-700"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </td>
                    <td className="_tr">{d?.created_at}</td>
                  </tr>
                ));
              }}
            </DataTable>
          </div>
        </div>
      </section>
    </>
  );
}

export default OrderPage;
