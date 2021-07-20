/**
* @description: 主线程 - 数据预加载
*/

const wfetch = (url, options = {}) => {
  Object.assign(options, {
    'headers': {
      'Authorization': localStorage.getItem('AUTH_TOKEN'),
      ...options.headers
    }
  })
  const sharedWorker = new SharedWorker(`${location.origin}/fetch.worker.js`, { name: 'fetch_worker' })
  const worker = sharedWorker.port
  return new Promise((resolve, reject) => {
    worker.postMessage([url, options])
    worker.onmessage = ({ data }) => resolve(data)
  })
}

export default wfetch
