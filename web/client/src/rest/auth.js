import env from '../constants'

class Auth {
  login() {
    fetch(`${env.base_url}/api/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'hello@openeew.com',
        password: 'amockpassword',
      }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  getCurrentUser() {
    fetch(`${env.base_url}/api/user`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
}

const AuthClient = new Auth()

export default AuthClient
