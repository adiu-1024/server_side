/**
* @description: 封装Fetch请求
*/

const m = new Map()
m.set('GET', (url, options) => {
  const { params = {}, headers = {}, ...config } = options
  const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&')
  Object.assign(config, {
    url: queryString ? `${url}?${queryString}` : url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    }
  })
  return config
})
m.set('POST', (url, options) => {
  const { data = {}, headers = {}, ...config } = options
  Object.assign(config, {
    url,
    body: data ? JSON.stringify(data) : null,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  })
  return config
})

const request = ([url, options] = config) => {
  const { url: fetchUrl, ...aside } = m.get(options.method ? options.method.toUpperCase() : 'GET')(url, options)
  return fetch(fetchUrl, {
    mode: 'cors',
    credentials: 'same-origin',
    ...aside
  }).then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok.')
    } else {
      return res.json()
    }
  })
}

this.request = request
