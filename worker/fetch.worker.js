/**
* @description: 数据预加载
*/

importScripts(`${location.origin}/fetch2/index.js`)

self.addEventListener('connect', ({ ports }) => {
  const client = ports[0]
  client.onmessage = ({ data: config }) => {
    self.request(config).then(data => client.postMessage(data))
  }
})
