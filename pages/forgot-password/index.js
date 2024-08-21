import { Formik } from 'formik';
import Head from 'next/head';
import router from 'next/router';
import { useState } from 'react';
import * as Yup from 'yup';
import api from '../../api/api';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormikInput from '../../components/formik/FormikInput';
import {
  __page_title_end,
  __reset_password_data_key,
} from '../../config/globalConfig';
import routes from '../../config/routes';
import { getErrors } from '../../helpers/helpers';
import { setSession } from '../../lib/localStorage';
import Recaptcha from 'react-recaptcha';
const initialValues = {
  identity: '',
};

const validationSchema = Yup.object().shape({
  identity: Yup.string().required().label('Email or phone').trim(),
});

function ForgotPasswordPage() {
  const [serverError, setServerError] = useState(null);
  const [capchaToken, setCapchaToken] = useState('');

  var callback = function () {
    console.log('Done!!!!');
  };

  // specifying verify callback function
  var verifyCallback = function (response) {
    setServerError(null);
    setCapchaToken(response);
  };

  return (
    <>
      <Head>
        <title>Forgot password {__page_title_end}</title>
      </Head>
      <section className="container flex-grow _flex_center">
        <div className="w-full sm:w-[380px] relative _form_wrapper">
          <h3 className="_h3">Forgot Password?</h3>
          <div className="mt-5">
            {serverError && (
              <Alert type="error" title={serverError} className="mb-4" />
            )}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, action) => {
                const { setSubmitting } = action;
                setServerError(null);
                if (!capchaToken) {
                  setServerError(['Complete Recapcha']);
                  setSubmitting(false);
                  return;
                }

                api
                  .post('/reset-password-direct', {
                    identity: values.identity,
                    captcha_token: capchaToken,
                  })
                  .then((res) => {
                    setSession(__reset_password_data_key, res.data.data);
                    router.push(routes.verifyOtp.name);
                  })
                  .catch((err) => {
                    setSubmitting(false);
                    setServerError(getErrors(err));
                  });
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <FormikInput
                    name="identity"
                    label="Email or Phone"
                    placeholder="Enter email or phone"
                  />
                  <Recaptcha
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                    render="explicit"
                    verifyCallback={verifyCallback}
                    onloadCallback={callback}
                  />
                  <Button
                    loading={isSubmitting}
                    type="submit"
                    text="Find account"
                    className="w-full"
                  />
                </form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </>
  );
}

export default ForgotPasswordPage;
