class Github {
  /**
   * Handles error if success is not present on response object.
   * @param {Object} response
   */
  async handleError(response) {
    if (!response.ok) {
      const json = await response.json()

      throw new Error(json.clientCode ? json.clientCode : 'generic')
    }

    return response
  }

  getCurrentFirmwareVer() {
    return new Promise((resolve, reject) => {
      fetch(`https://api.github.com/repos/openeew/openeew-firmware/releases`, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      })
        .then(this.handleError)
        .then((response) => response.json())
        .then((data) => {
          if (!data[0] || !data[0].tag_name) {
            return reject('Firmware version not found.')
          }

          return resolve(data[0].tag_name)
        })
        .catch((e) => {
          return reject(e.message)
        })
    })
  }
}

const githubClient = new Github()

export default githubClient
