import React, { useContext, useState } from 'react';
import { Modal, TextInput } from 'carbon-components-react';
import AppContext from '../../context/app';

function Login() {
  const { currentUser, setCurrentUser } = useContext(AppContext)
  const [model, setModel] = useState(currentUser)
  const [isNewUser, setIsNewUser] = useState(true)

  const handleChange = (field, { value }) =>
    setModel(model => ({ ...model, [field]: value }))

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
        onSecondarySubmit={() => setIsNewUser(!isNewUser)}
        // TODO: actually authenticate the user against something on submit
        onRequestSubmit={() => setCurrentUser({ ...model, password: null, authenticated: true })}
      >
        {isNewUser && <TextInput
          invalidText="Invalid error message."
          id="name"
          labelText="Name"
          onChange={event => handleChange('name', event.target)}
        />}
        <TextInput
          invalidText="Invalid error message."
          id="email"
          type="email"
          labelText="Email"
          onChange={event => handleChange('email', event.target)}
        />
        <TextInput.PasswordInput
          id="password"
          labelText="Password"
          onChange={event => handleChange('password', event.target)}
        />
        {isNewUser && <TextInput.PasswordInput
          id="confirmPassword"
          labelText="Confirm Password"
          onChange={event => handleChange('password', event.target)}
        />}
      </Modal>
    </div>
  );
}

export default Login;
