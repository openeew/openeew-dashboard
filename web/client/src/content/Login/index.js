import React, { useContext, useMemo, useEffect, useState } from 'react';
import { Modal, TextInput } from 'carbon-components-react';
import AppContext from '../../context/app';

function Login() {
  const { currentUser, setCurrentUser } = useContext(AppContext)
  const [model, setModel] = useState(currentUser)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [isNewUser, setIsNewUser] = useState(true)
  const isValid = useMemo(() => (
    !Object.values(errors).some(invalid => invalid)
  ), [errors])

  const handleChange = (field, { value }) => {
    setErrors({})
    setModel(model => ({ ...model, [field]: value }))
  }

  useEffect(() => {
    if (!submitting) { return }

    if (isValid) {
      // TODO: actually authenticate the user against something on submit
      setCurrentUser({ ...model, password: null, confirmPassword: null, authenticated: true })
    }
    setSubmitting(false)
  }, [submitting, isValid, model, setCurrentUser])

  return (
    <div className="login">
      <Modal
        open={!currentUser.authenticated}
        primaryButtonText={isNewUser ? 'Sign Up' : 'Log In'}
        secondaryButtonText={isNewUser ? 'Use existing account' : 'Create an account'}
        modalLabel="Welcome to OpenEEW Network Monitoring!"
        modalHeading={isNewUser ? 'Create an account' : 'Please sign in to continue'}
        shouldSubmitOnEnter={true}
        size="sm"
        onSecondarySubmit={() => {
          setErrors({})
          setIsNewUser(!isNewUser)
        }}
        onRequestSubmit={() => {
          setErrors({
            name: isNewUser && model.name.length === 0,
            email: model.email.length === 0,
            password: model.password.length === 0,
            confirmPassword: isNewUser && model.password !== model.confirmPassword
          })
          setSubmitting(true)
        }}
      >
        {isNewUser && <TextInput
          id="name"
          labelText="Name"
          invalid={errors.name}
          invalidText="Name must be present"
          onChange={event => handleChange('name', event.target)}
        />}
        <TextInput
          id="email"
          type="email"
          labelText="Email"
          invalid={errors.email}
          invalidText="Email must be present"
          onChange={event => handleChange('email', event.target)}
        />
        <TextInput.PasswordInput
          id="password"
          labelText="Password"
          invalid={errors.password}
          invalidText="Password must be present"
          onChange={event => handleChange('password', event.target)}
        />
        {isNewUser && <TextInput.PasswordInput
          id="confirmPassword"
          labelText="Confirm Password"
          invalid={errors.confirmPassword}
          invalidText="Passwords must match"
          onChange={event => handleChange('confirmPassword', event.target)}
        />}
      </Modal>
    </div>
  );
}

export default Login;
