import React, { useContext } from 'react'
import { Formik } from 'formik'
import { TextInput, Button, Form, InlineLoading } from 'carbon-components-react'
import AppContext from '../../context/app'

const OnboardInput = ({ submitOnboard, setError }) => {
  const { t } = useContext(AppContext)

  return (
    <Formik
      initialValues={{ password: '', confirm: '' }}
      validate={(values) => {
        const errors = {}

        if (!values.password) {
          errors.password = t('content.onboard.errors.passwordRequired')
        } else if (values.password.length < 8) {
          errors.password = t('content.onboard.errors.passwordTooShort')
        }

        if (!values.confirm) {
          errors.confirm = t('content.onboard.errors.confirmRequired')
        } else if (values.password !== values.confirm) {
          errors.confirm = t('content.onboard.errors.passwordNoMatch')
        }

        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        submitOnboard(values.password, setSubmitting)
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        touched,
      }) => {
        return (
          <Form
            onSubmit={(e) => {
              e.preventDefault()

              handleSubmit()
            }}
          >
            <TextInput
              id={'password'}
              type={'password'}
              className="onboard_textInput"
              aria-label="Enter your password"
              labelText={
                <p className="login__instructions">
                  <span>{t('content.onboard.createPassword')}</span>
                </p>
              }
              placeholder={t('content.login.form.labels.password')}
              onBlur={handleBlur}
              invalid={errors.password && touched.password}
              onChange={handleChange}
              value={values.password}
              autoComplete="new-password"
            />
            <TextInput
              id={'confirm'}
              type={'password'}
              className="onboard_textInput"
              aria-label="Confirm your password"
              labelText={<span></span>}
              placeholder={t('content.onboard.confirm')}
              onBlur={handleBlur}
              invalid={errors.confirm && touched.confirm}
              onChange={handleChange}
              value={values.confirm}
              autoComplete="new-password"
            />
            <Button
              className={`onboard__createButton ${
                isSubmitting ? 'display-none' : ''
              }`}
              type="submit"
            >
              {t('content.onboard.createAccount')}
            </Button>

            {isSubmitting ? (
              <InlineLoading
                className="space-t-2"
                description={'Finalizing account'}
                status={'active'}
                aria-live={'polite'}
              />
            ) : null}

            <div className="onboard__errors">
              {errors.password && touched.password ? (
                <p>{errors.password}</p>
              ) : null}

              {errors.confirm && touched.confirm ? (
                <p>{errors.confirm}</p>
              ) : null}
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default OnboardInput
