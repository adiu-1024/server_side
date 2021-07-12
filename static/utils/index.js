/**
* @description: 服务端文本推送
* @params {String} url: 通信地址
* @params {String} name: 事件名称
* @params {Function} callback: 回调函数，接收推送结果
*/
export const createEventSource = ({ name, url, callback }) => {
  const es = new EventSource(url)
  es.addEventListener(name, ({ data }) => callback(data))
  return es
}
