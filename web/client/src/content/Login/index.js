import React, { useContext, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InlineNotification } from 'carbon-components-react'

import AppContext from '../../context/app'
import logo from '../../components/openeew_logo.svg'
import LoginInput from '../../components/LoginInput'
import Header from '../../components/Header'

import AuthClient from '../../rest/auth'

const Login = ({ history }) => {
  const { t, setCurrentUser } = useContext(AppContext)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [loginId, setLoginId] = useState('')

  const initLogin = useCallback(
    /**
     * Init login and set user on success. Catch errors
     * handled by Auth client and sets error state.
     * @param {string} password
     * @param {function} setSubmitting
     */
    async (password, setSubmitting) => {
      setSubmitting(true)
      setError('')

      try {
        const user = await AuthClient.login(loginId, password)

        setSubmitting(false)

        setCurrentUser({
          isAuth: true,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        })

        console.log('Login successful ', user.email)
        return history.push('/events')
      } catch (err) {
        setSubmitting(false)

        return setError(t(err))
      }
    },
    [loginId, setCurrentUser, t, history]
  )

  return (
    <>
      <Header removeLogin></Header>
      <div className="login__container">
        <div className="login__spacer"></div>
        <div>
          <img src={logo} width="50px" className="marb-2" alt="OpenEEW" />
          <h1 className="login__title">
            {t('content.login.title')}
            <span className="login__openeew">{` OpenEEW`}</span>
          </h1>
        </div>

        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.div
            // By changing the key, React treats each step as a unique component
            key={`login-${step}`}
            transition={{
              type: 'spring',
              bounce: 0.4,
              duration: 0.35,
            }}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
          >
            <div className="login__supportingContainer">
              {step === 2 ? (
                <p className="login__forgotPassword">
                  <span>{t('content.login.forgotPassword')}</span>
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
            />
            {error ? (
              <InlineNotification
                kind="error"
                subtitle={<span>{error}</span>}
                title={t('content.login.errors.errorHeading')}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export default Login
