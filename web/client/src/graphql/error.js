import history from '../history'

/**
 * Takes a graphQL error object and responds accordingly
 * @param {Object} e Error object
 * @param {string} type Which interaction caused the error
 * @callback setInteractionError Sets error state for the calling component
 */
export const handleGraphQLError = (e, type, setInteractionError) => {
  console.log(JSON.stringify(e))

  if (
    e.networkError &&
    e.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED'
  ) {
    return history.push('/login')
  }

  if (!setInteractionError) {
    return null
  }

  return setInteractionError({
    type,
    message: 'Connection to sensor failed',
  })
}
