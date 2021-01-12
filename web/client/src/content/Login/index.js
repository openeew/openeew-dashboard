import React, { useContext, useCallback, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InlineNotification } from 'carbon-components-react'

import AppContext from '../../context/app'
import logo from '../../components/openeew_logo.svg'
import LoginInput from '../../components/LoginInput'
import Header from '../../components/Header'

import AuthClient from '../../rest/auth'

const backgroundImages = [
  'https://images.unsplash.com/photo-1486520299386-6d106b22014b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1582447702113-04667dcd1da9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1606669059257-19fc4ca49f79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1268&q=80',
  'https://images.unsplash.com/photo-1551454075-d9daea945c10?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1599775009931-5b0b46e8de2c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1555950205-ff6f06049d8b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1341&q=80',
  'https://images.unsplash.com/photo-1530936491244-4265f39516e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
  'https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
  'https://images.unsplash.com/photo-1559097622-2cff6decd452?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
  'https://images.unsplash.com/photo-1465920431246-94bf7d9d4269?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
]

const Login = ({ history }) => {
  const { t, setCurrentUser } = useContext(AppContext)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [loginId, setLoginId] = useState('')
  const [wallpaperStyle, setWallpaperStyle] = useState({})

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

  useEffect(() => {
    const index = Math.round(Math.random() * 100) % backgroundImages.length
    const url = backgroundImages[index]

    setWallpaperStyle({
      backgroundImage: `linear-gradient(90deg, rgba(22,22,22,1) 500px, rgba(0,0,0,0) 150%), url(${url})`,
    })
  }, [])

  return (
    <>
      <div className="login__background" style={wallpaperStyle} />
      <Header removeLogin />
      <div className="login__container">
        <div className="login__spacer" />
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
