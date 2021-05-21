import React, { useEffect, useState, useContext, useCallback } from 'react'
import { InlineNotification } from 'carbon-components-react'
import qs from 'qs'

import Header from '../../components/Header'
import AppContext from '../../context/app'
import AuthClient from '../../rest/auth'
import { ReactComponent as Logo } from '../../assets/openeew_logo.svg'
import OnboardInput from '../../components/OnboardInput'

import history from '../../history'

const Onboard = ({ location }) => {
  const { t } = useContext(AppContext)
  const [user, setUser] = useState({})
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const verifyToken = async () => {
      const _token = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      }).token

      if (!_token) {
        setPageLoading(false)

        return setError('onboardTokenNotFound')
      }

      try {
        const user = await AuthClient.getCurrentUserByToken(_token)

        setUser({ ...user })
        setToken(_token)
        setPageLoading(false)
      } catch (e) {
        setPageLoading(false)

        return setError(e)
      }
    }

    verifyToken()
  }, [location.search])

  const submitOnboard = useCallback(
    async (password, setSubmitting) => {
      setSubmitting(true)

      try {
        const result = await AuthClient.onboardUser(token, password)

        setSubmitting(false)

        if (!result.emailVerified) {
          return setStep(2)
        }

        return history.push('/login')
      } catch (e) {
        return setError(e)
      }
    },
    [token]
  )

  return (
    <>
      {error && !pageLoading ? (
        <div className="onboard__notification onboard__error">
          <InlineNotification
            kind="error"
            subtitle={<p>{t(`content.onboard.errors.${error}`)}</p>}
            tabIndex={0}
            title={t('content.onboard.errors.errorHeading')}
            hideCloseButton={true}
          />
        </div>
      ) : null}

      {!error && !pageLoading ? (
        <>
          <Header removeLogin />

          <div className="onboard__container">
            <div className="onboard__spacer" />

            <Logo width={50} className="marb-2" />

            {step === 1 ? (
              <>
                {user.givenName ? (
                  <h1 className="onboard__welcome">
                    {t('content.onboard.welcome')}, {user.givenName}
                  </h1>
                ) : null}
                <h2 className="onboard__instruction marb-1">
                  {t('content.onboard.finalize')}
                </h2>

                <OnboardInput submitOnboard={submitOnboard} />
              </>
            ) : (
              <div className="onboard__notification">
                <InlineNotification
                  kind="success"
                  subtitle={<p>{t('content.onboard.pleaseVerify')}</p>}
                  tabIndex={0}
                  title={t('content.onboard.success')}
                  hideCloseButton={true}
                />
              </div>
            )}
          </div>
        </>
      ) : null}
    </>
  )
}

export default Onboard
