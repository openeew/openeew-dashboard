import React, { useContext, useState } from 'react';
import { Modal, TextInput } from 'carbon-components-react';
import AppContext from '../../context/app';

function Login() {
  const { currentUser, setCurrentUser } = useContext(AppContext)
  const [model, setModel] = useState(currentUser)

  const handleChange = (field, { value }) =>
    setModel(model => ({ ...model, [field]: value }))

  return (
    <div className="login">
      <Modal
        open={!currentUser.authenticated}
        primaryButtonText="Login"
        modalLabel="Welcome to OpenEEW Network Monitoring!"
        modalHeading="Please sign in to continue"
        shouldSubmitOnEnter={true}
        size="xs"
        // TODO: actually authenticate the user against something on submit
        onRequestSubmit={() => setCurrentUser({ ...model, password: null, authenticated: true })}
      >
        <TextInput
          invalidText="Invalid error message."
          id="username"
          labelText="Username"
          onChange={event => handleChange('username', event.target)}
        />
        <TextInput.PasswordInput
          id="password"
          labelText="Password"
          onChange={event => handleChange('password', event.target)}
        />
      </Modal>
    </div>
  );
}

export default Login;
