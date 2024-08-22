import { Formik } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { useQuery } from 'react-query';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import api, {
  getTopupPackage,
  getUserProfile,
  getTopupPaymentMethod,
} from '../../api/api';
import ActivityIndicator from '../../components/ActivityIndicator';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormikErrorMessage from '../../components/formik/FormikErrorMessage';
import FormikInput from '../../components/formik/FormikInput';
import SelectedRadio from '../../components/SelectedRadio';
import ShowErrorAfterSubmit from '../../components/ShowErrorAfterSubmit';
import { __page_title_end } from '../../config/globalConfig';
import reactQueryConfig from '../../config/reactQueryConfig';
import routes from '../../config/routes';
import {
  addRedirectQuery,
  getErrors,
  hasData,
  imgPath,
  scrollTopWindow,
  setFlashMessage,
} from '../../helpers/helpers';
import { globalContext } from '../_app';
import SelectedRadioPackage from '../../components/SelectedRadioPackage';

function TopupOrderPage({ productData }) {
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('pay');
  const [isLogin, setIsLogin] = useState(false);

  // const [isSubmitting, setisSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { isAuth, updateAuthUserInfo, authUser } = useContext(globalContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      setIsLogin(true);
    }
  }, [isAuth]);

  // Refetching User Data On Every Time user visit this page
  const { data: userProfileData } = useQuery('user-profile', getUserProfile, {
    ...reactQueryConfig,
    enabled: !!isAuth,
  });
  useEffect(() => {
    if (userProfileData) {
      updateAuthUserInfo(userProfileData);
    }
  }, [userProfileData, updateAuthUserInfo]);

  const userWallet = authUser?.wallet;

  const { data: topupPaymentMethod } = useQuery(
    'topup-payment-method',
    getTopupPaymentMethod,
    {
      ...reactQueryConfig,
    }
  );

  const productInfo = productData?.product;
  const packages = productData?.packages;

  const isGmailSelected = selectedAccountType === 'gmail' ? true : false;
  const isActiveForTopup = productInfo?.topup_type === 'id_code' ? true : false;

  // Form Initial values
  const initialValues = {
    playerid: '',
    selectedpackage: null,
    payment_method: 'wallet',
  };

  // Form Validation Schema
  const validationSchema = Yup.object().shape({
    selectedpackage: Yup.object().nullable().required('Select a package'),
    payment_method: Yup.string().required().trim().label('Payment method'),
    ...(['id_code', 'in_game'].includes(productInfo?.topup_type) && {
      playerid: Yup.string()
        .required(
          isActiveForTopup
            ? 'Player id is requierd'
            : 'Account info is required'
        )
        .trim(),
    }),
  });

  const getUserWallet = () => {
    return authUser ? `(৳: ${authUser?.wallet})` : '';
  };

  return (
    <>
      <Head>
        <title>
          {productInfo?.name} {__page_title_end}
        </title>

        <meta name="description" content={productInfo.name} key="desc" />
        <meta property="og:image" content={imgPath(productInfo?.logo)} />
      </Head>
      <section
        className={`py-7 bg-gray-50 ${
          !hasData(productData)
            ? 'flex-grow items-center flex justify-center flex-col'
            : ''
        }`}
      >
        <div className="container">
          {hasData(productData) && (
            <div className="w-full md:w-[750px] md:mx-auto">
              <h1 className="_h3 mb-4">{productInfo?.name}</h1>
              <div className="relative">
                {/* Server Error */}
                {serverError && (
                  <Alert className="mb-4" type="error" title={serverError} />
                )}
                {/* Topup Order Form --Start-- */}
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(values, actions) => {
                    const { setSubmitting } = actions;
                    let isConfirmed = false;

                    setSubmitting(false);

                    setServerError(null);
                    const {
                      accounttype,
                      playerid,
                      ingamepassword,
                      securitycode,
                      selectedpackage,
                    } = values;

                    Swal.fire({
                      title: false,
                      html:
                        selectedPaymentMethod === 'uddoktapay'
                          ? `<div class="_confirm_order_body">
                      <h4 class="_h4">Confirm Order</h4>
                      <p className="modal_sub_title">You need pay <span class="_bold_it">৳${selectedpackage.price}</span></p>
                    </div>`
                          : `
                            <div class="_confirm_order_body">
                              <h4 class="_h4">Confirm Order</h4>
                              <p className="modal_sub_title">Your current wallet is <span class="_bold_it">৳${userWallet}</span></p>
                              <p className="modal_sub_title">You need <span class="_bold_it">৳${selectedpackage.price}</span> to purchase this product.</p>
                            </div>`,
                      customClass: {
                        popup: '_confirm_order_modal_popup',
                        cancelButton: '_cancel_btn',
                        confirmButton: '_confirm_btn',
                      },
                      cancelButtonText: 'Cancel',
                      confirmButtonText: 'Confirm order',
                      showCancelButton: true,
                      cancelButtonColor: 'red',
                    }).then((e) => {
                      if (e.isConfirmed && !isConfirmed) {
                        isConfirmed = true;
                        setSubmitting(true);
                        api
                          .post('/packageorder', {
                            topuppackage_id: selectedpackage.id,
                            product_id: selectedpackage.product_id,
                            name: selectedpackage.name,
                            accounttype,
                            playerid,
                            ingamepassword: isActiveForTopup
                              ? 'IDCODE'
                              : ingamepassword,
                            securitycode: isActiveForTopup
                              ? 'IDCODE'
                              : securitycode,
                            payment_method:
                              selectedPaymentMethod === 'uddoktapay' ? 2 : 1,
                            // payment_mathod,
                          })
                          .then((data) => {
                            if (selectedPaymentMethod === 'uddoktapay') {
                              window.location.href = data.data.data.payment_url;
                              return;
                            }

                            setFlashMessage(
                              'Your order has been placed successfully.'
                            );
                            router.push(routes.myOrder.name);
                          })
                          .catch((err) => {
                            setSubmitting(false);
                            const error = getErrors(err);
                            setServerError(error);
                            scrollTopWindow();
                          });
                      } else {
                        isConfirmed = false;
                      }
                    });
                  }}
                >
                  {({
                    setFieldValue,
                    setFieldTouched,
                    handleChange,
                    errors,
                    touched,
                    values,
                    initialValues,
                    isSubmitting,
                    handleSubmit,
                  }) => {
                    const isAccountTypeError =
                      errors['accounttype'] && touched['accounttype'];

                    const isPackageIdError =
                      errors['selectedpackage'] && touched['selectedpackage'];

                    const isPaymentError =
                      errors['payment_mathod'] && touched['payment_mathod'];

                    const isNotEnoughMoney =
                      values.selectedpackage?.price > authUser?.wallet;

                    return (
                      <div>
                        {isSubmitting && (
                          <div className="_absolute_full z-50"></div>
                        )}
                        {/* Account Info Form --Start-- */}
                        {['id_code', 'in_game'].includes(
                          productInfo?.topup_type
                        ) && (
                          <div className="_order_box_wrapper">
                            <div className="_order_box_header">
                              <div className="_order_header_step_circle">1</div>
                              <h5 className="_order_header_title">
                                Account Info
                              </h5>
                            </div>

                            <div className="order_box_body">
                              {isActiveForTopup ? (
                                // Visible If Product is Active For Topup --Start--
                                <div className="_grid_2">
                                  <FormikInput
                                    label="Player Id"
                                    placeholder="Enter player id"
                                    className="small"
                                    name="playerid"
                                  />
                                  {/* Visible If Product is Active For Topup --End-- */}
                                </div>
                              ) : (
                                // Visible If Product is Inactive For Topup --Start--
                                <>
                                  <div className="grid grid-cols-1 gap-4">
                                    <textarea
                                      rows={8}
                                      cols={50}
                                      placeholder="id : info@example.com
                                      pass : 1234
                                      Backup : 090270608, 99547821"
                                      onChange={(e) => {
                                        setFieldValue(
                                          'playerid',
                                          e.target.value
                                        );
                                      }}
                                      name="playerid"
                                      className="border p-1 border-black rounded-md"
                                    />
                                  </div>
                                  <div>
                                <div>
                                  <p className="flex _body2 mt-1.5">
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={
                                        "#"
                                      }
                                      className="blink_me flex gap-2"
                                    >
                                      <span className="text-lg">
                                        <HiOutlineExternalLink size={22} />
                                        কিভাবে এয়ার ড্রপ অর্ডার করবেন ?
                                      </span>
                                    </a>
                                  </p>
                                </div>
                              </div>
                                </>
                                // Visible If Product is Inactive For Topup --End--
                              )}
                            </div>
                          </div>
                        )}
                        {/* Account Info Form --End-- */}

                        {/* Select Recharge --Start-- */}
                        <div className="_order_box_wrapper">
                          <div className="_order_box_header">
                            <div className="_order_header_step_circle">2</div>
                            <h5 className="_order_header_title">
                              Select Recharge
                            </h5>
                          </div>

                          <div className="order_box_body">
                            <div className={`grid ${
                                productInfo?.topup_type === 'voucher'
                                  ? 'grid-cols-2 md:grid-cols-2'
                                  : 'grid-cols-2 md:grid-cols-3'
                              } gap-2.5`}>
                              {/* Single Recharge --Start-- */}
                              {packages.map((pack, index) => {
                                return (
                                  <SelectedRadioPackage
                                  key={index}
                                  index={index}
                                  packageItem={pack}
                                  outOfStock={parseInt(pack?.in_stock) === 0}
                                  onChange={() => {
                                    setSelectedPackage(index);
                                    setFieldValue("selectedpackage", pack);
                                  }}
                                  isError={isPackageIdError ? true : false}
                                  isChecked={parseInt(selectedPackage) === index}
                                  />
                                );
                              })}
                              {/* Single Recharge --End-- */}
                            </div>
                            <FormikErrorMessage name="selectedpackage" />
                            <FormikErrorMessage
                              showError={
                                isNotEnoughMoney &&
                                selectedPaymentMethod !== 'uddoktapay'
                              }
                              msg={
                                <p>
                                  You do not have enough money to order this
                                  package, Please{' '}
                                  {
                                    <Link
                                      href={
                                        routes.addMoney.name +
                                        addRedirectQuery(router)
                                      }
                                    >
                                      <a className="_link">Add Money</a>
                                    </Link>
                                  }{' '}
                                  or choose another package.
                                </p>
                              }
                            />
                          </div>
                          {productInfo.video_link && (
                            <div className="order_box_body">
                            <div>
                              <p className="flex _body2 mt-1.5">
                                <a
                                  target="_blank"
                                  rel="noreferrer"
                                  href={productInfo.video_link}
                                  className="blink_me flex gap-2"
                                >
                                  <span className="text-lg">
                                    <HiOutlineExternalLink
                                      className="inline"
                                      size={24}
                                    />{" "}
                                    {'কিভাবে Voucher Redeem করবেন ভিডিও দেখুন?'}
                                  </span>
                                </a>
                              </p>
                            </div>
                          </div>
                        )}
                        </div>
                        {/* Select Recharge --End-- */}

                        {/* Select Payment Option --Start-- */}
                        <div className="_order_box_wrapper">
                          <div className="_order_box_header">
                            <div className="_order_header_step_circle">3</div>
                            <h5 className="_order_header_title">
                              Select Payment
                            </h5>
                          </div>

                          <div className="order_box_body">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
                              <SelectedRadio
                                // isSelected={true}
                                bottomComponent={`Wallet Pay ${getUserWallet()}`}
                                topComponent={
                                  <div className="p-1.5 bg-white pb-2.5">
                                    <img
                                      className="w-full h-auto"
                                      src="/wallet-logo.JPG"
                                    />
                                  </div>
                                }
                                isSelected={selectedPaymentMethod === 'pay'}
                                isError={isPaymentError}
                                onClick={() => {
                                  setSelectedPaymentMethod('pay');
                                  setFieldValue('payment_mathod', 'pay');
                                }}
                              />

                              {topupPaymentMethod?.includes('uddoktapay') && (
                                <SelectedRadio
                                  bottomComponent="Instant Pay"
                                  topComponent={
                                    <div className="p-1.5 bg-white pb-2.5">
                                      <img
                                        className="w-full h-auto"
                                        src="/bkash_pay.png"
                                      />
                                    </div>
                                  }
                                  isSelected={
                                    selectedPaymentMethod === 'uddoktapay'
                                  }
                                  isError={isPaymentError}
                                  onClick={() => {
                                    setSelectedPaymentMethod('uddoktapay');
                                    setFieldValue(
                                      'payment_mathod',
                                      'uddoktapay'
                                    );
                                  }}
                                />
                              )}
                            </div>
                            <FormikErrorMessage name="payment_mathod" />
                          </div>
                        </div>
                        {/* Select Payment Option --End-- */}

                        {/* Show Error After Submit Form --Start-- */}
                        <ShowErrorAfterSubmit
                          errors={errors}
                          initialValues={initialValues}
                          touched={touched}
                        />
                        {/* Show Error After Submit Form --End-- */}
                        {selectedPaymentMethod == 'uddoktapay' && (
                          <p className="flex text-lg _body2 mt-1.5 mb-1.5">
                            {/*<a
                              target="_blank"
                              rel="noreferrer"
                              href={'https://youtu.be/eTelPQfCr_o'}
                              className="_link flex gap-2"
                            >
                              <HiOutlineExternalLink
                                size={21}
                                className="flex-shrink-0"
                              />
                              {'কিভাবে Add Money করা ছাড়া অর্ডার করবেন?'}
                        </a>*/}
                          </p>
                        )}
                        <div className="flex mb-2 justify-end gap-3">
                          {!isAuth && (
                            <Link
                              href={
                                routes.login.name + addRedirectQuery(router)
                              }
                            >
                              <a>
                                <Button type="button" className="outlined">
                                  Login
                                </Button>
                              </a>
                            </Link>
                          )}
                          {((isAuth && !userWallet) || isNotEnoughMoney) &&
                            selectedPaymentMethod !== 'uddoktapay' && (
                              <Link
                                href={
                                  routes.addMoney.name +
                                  addRedirectQuery(router)
                                }
                              >
                                <a>
                                  <Button type="button" className="outlined">
                                    Add Money
                                  </Button>
                                </a>
                              </Link>
                            )}
                          <Button
                            disabled={
                              !isLogin ||
                              (!userWallet &&
                                selectedPaymentMethod !== 'uddoktapay') ||
                              (isNotEnoughMoney &&
                                selectedPaymentMethod !== 'uddoktapay')
                            }
                            onClick={handleSubmit}
                            type="submit"
                            loading={isSubmitting}
                          >
                            { selectedPaymentMethod == 'uddoktapay' ? 'Pay now' :  'Buy Now'}

                          </Button>
                        </div>

                        <div className="_order_box_wrapper">
                          <div className="_order_box_header">
                            <div className="_order_header_step_circle">4</div>
                            <h5 className="_order_header_title">
                              Description
                            </h5>
                          </div>

                          <div className="order_box_body">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: productData.product.rules,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Formik>
                {/* Topup Order Form --End-- */}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default TopupOrderPage;

export async function getServerSideProps(ctx) {
  const productId = ctx?.query?.id;

  let product = null;

  // Fetching Single Product
  try {
    const res = await api.get(`/topuppackage/${productId}`);
    product = res?.data?.data;
  } catch (error) {
    product = null;
  }

  return {
    props: {
      productData: product,
    },
  };
}
