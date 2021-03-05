import React, { useEffect, useState, useContext } from 'react'
import { InlineNotification } from 'carbon-components-react'
import qs from 'qs'

import Header from '../../components/Header'
import AppContext from '../../context/app'
import AuthClient from '../../rest/auth'
import { ReactComponent as Logo } from '../../assets/openeew_logo.svg'

const Onboard = ({ location }) => {
  const { t } = useContext(AppContext)
  const [user, setUser] = useState({})
  const [error, setError] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const verifyToken = async () => {
      const token = qs.parse(location.search, { ignoreQueryPrefix: true }).token

      if (!token) {
        setPageLoading(false)

        return setError('onboardTokenNotFound')
      }

      try {
        const user = await AuthClient.getCurrentUserByToken(token)

        setUser({ ...user })
        setPageLoading(false)
      } catch (e) {
        setPageLoading(false)

        return setError(e)
      }
    }

    verifyToken()
  }, [location.search])

  return (
    <>
      {error && !pageLoading ? (
        <div className="onboard__error">
          <InlineNotification
            kind="error"
            subtitle={<span>{t(`content.onboard.errors.${error}`)}</span>}
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
                <h2 className="onboard__instruction">
                  {t('content.onboard.finalize')}
                </h2>
              </>
            ) : (
              <>
                <h1>Success</h1>
              </>
            )}
          </div>
        </>
      ) : null}
    </>
  )
}

export default Onboard
