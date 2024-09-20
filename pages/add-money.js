/* eslint-disable @next/next/no-img-element */
import { Formik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BsCheckCircleFill } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import api, { getPaymentMethod } from '../api/api';
import ActivityIndicator from '../components/ActivityIndicator';
import Alert from '../components/Alert';
import AuthGuard from '../components/AuthGuard';
import Button from '../components/Button';
import FormikErrorMessage from '../components/formik/FormikErrorMessage';
import FormikInput from '../components/formik/FormikInput';
import SelectedRadio from '../components/SelectedRadio';
import ShowErrorAfterSubmit from '../components/ShowErrorAfterSubmit';
import { __page_title_end, __redirect_url_key } from '../config/globalConfig';
import reactQueryConfig from '../config/reactQueryConfig';
// import Recaptcha from 'react-recaptcha';
import routes from '../config/routes';
import {
  getErrors,
  hasData,
  imgPath,
  scrollTopWindow,
  setFlashMessage,
} from '../helpers/helpers';

const initialValues = {
  amount: '',
  number: '',
  paymentmethod: '',
  transaction_id: '',
};

const step1Rules = [
  'প্রথমে উপরে দেওয়া নাম্বার কপি করুণ।',
  '(bKash,Nagad,Rocket) App অথাবা Ussd কোডের মধ্যেমে',
  'সেন্ড মানি অপশন সিলেক্ট করুণ।',
  'RRR TOPUP WALLET নাম্বার (_) প্রবেশ করুণ।',
  'এম্যাউন্ট অর্থাৎ কত টাকা যোগ করবেন তার পরিমাণ প্রবেশ করুণ।',
  'রেফারেন্সে আপনার ইউজার আইডি প্রবেশ করুণ।',
  'আপনার বিকাশ পিন নাম্বার প্রবেশ করুণ।',
];
const step2Rules = [
  'নিচে যে তিনটি বক্স দেখতে পারছেন প্রথম বক্স এ কত টাকা পাঠিয়েছেন সেটা লিখুন।',
  'দ্বিতীয় বক্সে আপনি যে নাম্বার থেকে টাকা পাঠিয়েছেন সেই নাম্বারটি লিখুন।',
  'তৃতীয় বক্সে TrxID লিখুন।',
  'তারপর Add Money অপশনে ক্লিক করুণ।',
  'পাঁচ থেকে দশ মিনিটের মধ্যে টাকা যোগ হয়ে যাবে আপনার ওয়ালেটে। ',
  'অবশ্যই টাকা Send Money করার পর এই কাজটি করবেন।',
];

function AddMoneyPage() {
  const {
    data: payment_methods,
    isLoading,
    isError,
  } = useQuery('payment-methods', getPaymentMethod, reactQueryConfig);

  const router = useRouter();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnrecognizedError, setIsUnrecognizedError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // const [capchaToken, setCapchaToken] = useState('');

  // var callback = function () {
  //   console.log('callback!!!!');
  // };

  // var verifyCallback = function (response) {
  //   console.log('Captcha ', response);
  //   setIsUnrecognizedError(null);
  //   setCapchaToken(response);
  // };

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required()
      // .matches(/^([1-9])/, "Amount can't be start with 0")
      .min(10, 'Amount must be at least 10 taka')
      .max(25000, 'Amount must be less than 25000 taka')
      .label('Amount'),
    paymentmethod: Yup.string()
      .required('Please select a payment method')
      .trim(),
    ...(selectedPaymentMethod?.is_automated != 1 && {
      transaction_id: Yup.string().required().label('Transaction id').trim(),
      number: Yup.string()
        .required()
        .matches(
          /(^(\+88|0088)?(01){1}[13456789]{1}(\d){8,9})$/,
          'Sender number must be a valid phone number'
        )
        .trim()
        .label('Sender number'),
    }),
  });

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  return (
    <>
      <Head>
        <title>Add money {__page_title_end}</title>
      </Head>
      <AuthGuard>
        <section className="container">
          <div className="w-full sm:w-[600px] mx-auto my-7">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                const { setSubmitting, resetForm, setFieldError } = actions;

                setSubmitting(false);
                setIsSubmitting(true);

                // if (!capchaToken) {
                //   setSubmitting(true);
                //   setIsUnrecognizedError(['Complete Recapcha']);
                //   setIsSubmitting(false);
                //   scrollTopWindow();
                //   return;
                // }

                api
                  .post('/addwallet', {
                    ...values,
                    purpose: 'addwallet',
                    // captcha_token: capchaToken,
                  })
                  .then((response) => {
                    resetForm();
                    if (selectedPaymentMethod?.is_automated === 1) {
                      window.location.href = response.data.data.payment_url;
                      return;
                    }
                    setFlashMessage('Your add money request was successful.');
                    router.push(
                      router?.query[__redirect_url_key] || routes.myWallet.name
                    );
                  })
                  .catch((err) => {
                    setSubmitting(true);

                    const serverErrors = err?.response?.data?.errors;

                    if (serverErrors?.length > 0) {
                      serverErrors.forEach((serverError) => {
                        setFieldError(serverError.param, serverError.msg);
                      });
                    } else {
                      // window.scrollTop = 0;
                      setIsUnrecognizedError(getErrors(err));
                      scrollTopWindow();
                    }
                  })
                  .finally(() => {
                    setIsSubmitting(false);
                  });
              }}
              validate={(values) => {
                let errors = {};

                if (
                  parseInt(values.number) ===
                  parseInt(selectedPaymentMethod?.info)
                ) {
                  errors.number = 'Please enter your number, Not our number';
                }

                return errors;
              }}
            >
              {({
                handleSubmit,
                touched,
                errors,
                initialValues,
                setFieldValue,
              }) => {
                const isPaymentMethodError =
                  errors['paymentmethod'] && touched['paymentmethod'];

                // useEffect(() => {
                //   isPaymentMethodError && setFieldTouched('paymentmethod');
                // }, [isPaymentMethodError]);

                return (
                  <>
                    {isUnrecognizedError && (
                      <Alert
                        type="error"
                        className="mb-4"
                        title={isUnrecognizedError}
                      />
                    )}
                    {/* Select Payment Method --Start-- */}
                    <div className="_order_box_wrapper">
                      <div className="_order_box_header">
                        <div className="_order_header_step_circle">1</div>
                        <h5 className="_order_header_title">
                          Select Payment Method
                        </h5>
                      </div>

                      <div className="order_box_body">
                        <ActivityIndicator
                          data={payment_methods}
                          error={isError}
                          loading={isLoading}
                        />

                        {hasData(payment_methods) && (
                          <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
                              {payment_methods.map((payment_method, index) => (
                                <SelectedRadio
                                  isShadow
                                  key={index}
                                  bottomComponent={
                                    <span className="py-2 inline-block">
                                      {payment_method?.name}
                                    </span>
                                  }
                                  topComponent={
                                    <img
                                      src={imgPath(payment_method?.logo)}
                                      alt={payment_method?.name}
                                    />
                                  }
                                  isSelected={
                                    selectedPaymentMethod?.id ===
                                    payment_method?.id
                                  }
                                  isError={isPaymentMethodError}
                                  onClick={() => {
                                    setSelectedPaymentMethod(payment_method);
                                    setFieldValue(
                                      'paymentmethod',
                                      payment_method?.id
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormikErrorMessage name="paymentmethod" />
                          </>
                        )}
                      </div>
                    </div>
                    {/* Select Payment Method --End-- */}

                    {/* How to add money --Start-- */}
                    {selectedPaymentMethod != null &&
                      selectedPaymentMethod?.is_automated != 1 && (
                        <div className="_order_box_wrapper">
                          <div className="_order_box_header">
                            <div className="_order_header_step_circle">2</div>
                            <h5 className="_order_header_title">
                              How To Add Money
                            </h5>
                          </div>

                          <div className="order_box_body">
                            {/* Showing Selected Payment Method Name and Info --Start-- */}
                            {selectedPaymentMethod && (
                              <div className="mb-2 flex items-center justify-between flex-wrap gap-3 border-l-4 bg-primary-500/5 border-primary-500 py-3 px-3.5">
                                <p className="_h4">
                                  {selectedPaymentMethod?.name}:{' '}
                                  {selectedPaymentMethod?.info}
                                </p>
                                <CopyToClipboard
                                  text={selectedPaymentMethod?.info}
                                  onCopy={() => setIsCopied(true)}
                                >
                                  <Button
                                    StartIcon={
                                      isCopied ? (
                                        <BsCheckCircleFill size={18} />
                                      ) : undefined
                                    }
                                    className="small"
                                    text={
                                      isCopied ? 'Number Copied' : 'Copy Number'
                                    }
                                  />
                                </CopyToClipboard>
                              </div>
                            )}
                            {/* Showing Selected Payment Method Name and Info --End-- */}
                            <div>
                              <p className="_subtitle1 text-gray-800 font-semibold">
                                Step 1:
                              </p>
                              <div className="pl-2 mt-2 space-y-2.5">
                                {step1Rules.map((rule, index) => (
                                  <p
                                    className="_body2 flex items-start gap-2"
                                    key={index}
                                  >
                                    <GoPrimitiveDot className="text-gray-500" />{' '}
                                    {rule}
                                  </p>
                                ))}
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="_subtitle1 text-gray-800 font-semibold">
                                Step 2:
                              </p>
                              <div className="pl-2 mt-2 space-y-2.5">
                                {step2Rules.map((rule, index) => (
                                  <p
                                    className="_body2 flex items-start gap-2"
                                    key={index}
                                  >
                                    <GoPrimitiveDot className="text-gray-500" />{' '}
                                    {rule}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    {/* How to add money --End-- */}

                    {/* Add money form --Start-- */}
                    {selectedPaymentMethod != null && (
                      <div className="_order_box_wrapper">
                        <div className="_order_box_header">
                          <div className="_order_header_step_circle">2</div>
                          <h5 className="_order_header_title">
                            Request Add Money
                          </h5>
                        </div>

                        <div className="order_box_body">
                          <form className="flex flex-col gap-4">
                            <div className="_grid_2">
                              <FormikInput
                                name="amount"
                                label="Amount"
                                placeholder="Amount"
                              />
                              {selectedPaymentMethod?.is_automated != 1 && (
                                <FormikInput
                                  name="number"
                                  label="Sender Number"
                                  placeholder="Sender Number"
                                />
                              )}
                            </div>

                            <div>
                              {selectedPaymentMethod?.is_automated != 1 && (
                                <FormikInput
                                  name="transaction_id"
                                  label="Transaction Id"
                                  placeholder="Transaction Id"
                                />
                              )}
                            </div>

                            <ShowErrorAfterSubmit
                              className="mb-0"
                              touched={touched}
                              errors={errors}
                              initialValues={initialValues}
                            />

                            <Button
                              type="submit"
                              onClick={handleSubmit}
                              className="w-full"
                              loading={isSubmitting}
                            >
                              Add Money
                            </Button>
                          </form>
                        </div>
                      </div>
                    )}
                    {/* Add money form --End-- */}

                    {/* How to add money --Start-- */}
                    {selectedPaymentMethod != null &&
                      selectedPaymentMethod?.is_automated == 1 && (
                        <div className="_order_box_wrapper">
                          <div className="_order_box_header">
                            <div className="_order_header_step_circle">3</div>
                            <h5 className="_order_header_title">
                              How To Add Money
                            </h5>
                          </div>

                          {/*<div className="m-2">
                            <h5>Instant Add Money করার নিয়ম: </h5>
                            <iframe
                              width="100%"
                              height="315"
                              src="https://www.youtube.com/embed/eTelPQfCr_o?si=4dson-V5s05ahLna"
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                      </div>*/}
                        </div>
                      )}
                    {/* How to add money --End-- */}
                  </>
                );
              }}
            </Formik>
          </div>
        </section>
      </AuthGuard>
    </>
  );
}

export default AddMoneyPage;
