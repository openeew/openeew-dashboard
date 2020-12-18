import React, { useContext, useMemo, useEffect, useState } from 'react'
import { TextInput } from 'carbon-components-react'
import AppContext from '../../context/app'
import AuthClient from '../../rest/auth'

const Login = () => {
  const { t, currentUser, setCurrentUser } = useContext(AppContext)
  const [model, setModel] = useState(currentUser)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [isNewUser, setIsNewUser] = useState(true)
  const isValid = useMemo(
    () => !Object.values(errors).some((invalid) => invalid),
    [errors]
  )

  const handleChange = (field, { value }) => {
    setErrors({})
    setModel((model) => ({ ...model, [field]: value }))
  }

  useEffect(() => {
    if (!submitting) {
      return
    }

    if (isValid) {
      // TODO: actually authenticate the user against something on submit
      setCurrentUser({
        ...model,
        password: null,
        confirmPassword: null,
        authenticated: true,
      })
    }
    setSubmitting(false)
  }, [submitting, isValid, model, setCurrentUser])

  return (
    <div className="login">
      {isNewUser && (
        <TextInput
          id="name"
          labelText={t('content.login.form.name.label')}
          invalid={errors.name}
          invalidText={t('content.login.form.name.error')}
          onChange={(event) => handleChange('name', event.target)}
        />
      )}
      <TextInput
        id="email"
        type="email"
        labelText={t('content.login.form.email.label')}
        invalid={errors.email}
        invalidText={t('content.login.form.email.error')}
        onChange={(event) => handleChange('email', event.target)}
      />
      <TextInput.PasswordInput
        id="password"
        labelText={t('content.login.form.password.label')}
        invalid={errors.password}
        invalidText={t('content.login.form.password.error')}
        onChange={(event) => handleChange('password', event.target)}
      />
      {isNewUser && (
        <TextInput.PasswordInput
          id="confirmPassword"
          labelText={t('content.login.form.confirmPassword.label')}
          invalid={errors.confirmPassword}
          invalidText={t('content.login.form.confirmPassword.error')}
          onChange={(event) => handleChange('confirmPassword', event.target)}
        />
      )}
      <button onClick={() => AuthClient.login()}>Log in</button>
      <button onClick={() => AuthClient.getCurrentUser()}>Token</button>
    </div>
  )
}

export default Login
