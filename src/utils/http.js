const request = (url, options) =>
  fetch(url, options)
    .then((response) => response.json())
    .catch((err) => ({ error: true, message: err.message }))

export const get = (url) => request(url)
