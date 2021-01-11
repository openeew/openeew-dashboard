let base_url

if (process.env.NODE_ENV === 'production') {
  base_url = process.env.REACT_APP_DEPLOY_URL
} else {
  base_url = ''
}

const env = {
  base_url,
}

export default env
