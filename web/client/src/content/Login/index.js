import React, { useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InlineNotification, InlineLoading } from 'carbon-components-react'

import AppContext from '../../context/app'
import LoginInput from '../../components/LoginInput'
import Header from '../../components/Header'

import { ReactComponent as Logo } from '../../assets/openeew_logo.svg'

import AuthClient from '../../rest/auth'
import animation from './animation'

const Login = ({ history }) => {
  const { t, setCurrentUser } = useContext(AppContext)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [loginId, setLoginId] = useState('')
  const [forgotPassword, setForgotPassword] = useState({
    email: '',
    request: false,
    success: false,
    error: '',
  })
  const [activeAnimation, setActiveAnimation] = useState(() =>
    window.innerWidth < 672 ? animation.mobile : animation.desktop
  )

  useEffect(() => {
    window.addEventListener('resize', () =>
      setActiveAnimation(
        window.innerWidth < 672
          ? { ...animation.mobile }
          : { ...animation.desktop }
      )
    )
  }, [])

  /**
   * Init login and set user on success. Catch errors
   * handled by Auth client and sets error state.
   * @param {string} password
   * @param {function} setSubmitting
   */
  const initLogin = async (password, setSubmitting) => {
    setSubmitting(true)
    setError('')

    try {
      const user = await AuthClient.login(loginId, password)

      setSubmitting(false)

      setCurrentUser({
        isAuth: true,
        email: user.email,
        firstName: user.givenName,
        lastName: user.familyName,
      })

      return history.push('/events')
    } catch (e) {
      setSubmitting(false)

      return setError(e)
    }
  }

  const initForgotPassword = async () => {
    setForgotPassword({ ...forgotPassword, request: true })

    try {
      await AuthClient.resetPassword(forgotPassword.email)

      setForgotPassword({
        ...forgotPassword,
        request: false,
        success: true,
        error: '',
      })
    } catch (error) {
      setForgotPassword({
        ...forgotPassword,
        request: false,
        success: false,
        error,
      })
    }
  }

  return (
    <>
      <Header removeLogin />
      <div className="login__container">
        <div className="login__spacer" />
        <div>
          <Logo width={50} className="marb-2" />
          <h1 className="login__title" tabIndex={0}>
            {t('content.login.title')}
            <span className="login__openeew">{` OpenEEW`}</span>
          </h1>
        </div>

        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.div
            // By changing the key, React treats each step as a unique component
            key={`login-${step}`}
            {...activeAnimation}
          >
            <div className="login__supportingContainer">
              {step === 2 &&
              !forgotPassword.request &&
              !forgotPassword.success ? (
                <p
                  className="login__forgotPassword"
                  onClick={initForgotPassword}
                  tabIndex={0}
                  role="button"
                >
                  <span>{t('content.login.forgotPassword')}</span>
                </p>
              ) : null}
              {step === 2 && forgotPassword.request ? (
                <InlineLoading
                  className="login__forgotPasswordLoading"
                  description={t('content.login.forgotPasswordLoading')}
                  status={'active'}
                  aria-live={'polite'}
                />
              ) : null}
              {step === 2 && forgotPassword.success ? (
                <p className="login__forgotPasswordSuccess">
                  <span>{t('content.login.forgotPasswordSuccessShort')}</span>
                </p>
              ) : null}
            </div>

            <LoginInput
              step={step}
              setStep={setStep}
              setLoginId={setLoginId}
              initLogin={initLogin}
              loginId={loginId}
              setError={setError}
              forgotPassword={forgotPassword}
              setForgotPassword={setForgotPassword}
            />
            {error ? (
              <InlineNotification
                kind="error"
                subtitle={<span>{t(`content.login.errors.${error}`)}</span>}
                tabIndex={0}
                title={t('content.login.errors.errorHeading')}
                hideCloseButton={true}
              />
            ) : null}

            {forgotPassword.success ? (
              <InlineNotification
                kind="success"
                subtitle={
                  <span>{t(`content.login.forgotPasswordSuccessContent`)}</span>
                }
                tabIndex={0}
                title={t('content.login.forgotPasswordSuccessHeader')}
                hideCloseButton={true}
              />
            ) : null}

            {forgotPassword.error ? (
              <InlineNotification
                kind="error"
                subtitle={
                  <span>{t(`content.login.forgotPasswordErrorContent`)}</span>
                }
                tabIndex={0}
                title={t('content.login.forgotPasswordErrorHeader')}
                hideCloseButton={true}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export default Login
