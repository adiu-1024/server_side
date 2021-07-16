/**
* @description: 服务端文本推送
* @param {String} action: 通信地址
* @param {String} name: 事件名称
* @param {Function} callback: 回调函数，接收推送结果
* @example
*
*   const es = createEventSource({
*     action: '/sse/notice',
*     name: 'notice',
*     callback(data) {
*       console.log(`Received data：${data}`)
*     }
*   })
*   es.close()
*/
export const createEventSource = ({ name, action, callback }) => {
  const es = new EventSource(action)
  es.addEventListener(name, ({ data }) => callback(data))
  return es
}

/**
* @description: 桌面通知
* @param {String} title: 通知标题
* @param {Object} options: 可选配置项
*   - body: 通知的主体内容，字符串
*   - icon: 通知面板的图标地址，字符串
*   - data: 和通知关联的数据，可以在实例中获取
*   - tag: 通知ID，相同tag时只会打开一个通知面板
*   - requireInteraction: 默认为 false，通知会在三四秒之后自动关闭
* @example
*
*   const notification = createNotification('通知标题', {
*     body: '通知内容',
*     icon: 'https://file2.clipworks.com/8af14f9db94d21e7ba38f12c43adb6b9/20210617/6d5fbc9cdecb4f3584c80d0d75bda070.jpg',
*     data: { redirect: 'https://www.xxx.com?key=value&key=value' },
*   })
*/
export const createNotification = (title, options) => {
  const permission = Notification.permission
  if (permission === 'granted') {
    const n = new Notification(title, {
      requireInteraction: true,
      ...options
    })
    n.onclick = function() {
      const { redirect = null } = this.data
      window.focus()
      redirect && (window.location.href = redirect)
    }
    return n
  } else {
    Notification.requestPermission()
  }
}

/**
* @description: 批量下载并发请求控制
* @param {Array} data: 任务池
* @param {Number} limit: 恒定并发数
* @param {Function} complete: 回调函数，接收下载数据及业务附加数据
* @param {Function} getProgress: 回调函数，接收下载进度及业务附加数据
* @example
*
*   invariableFetch({
*     data: [
*       { "filename": "视频A.mp4" , url: "https://file.xxx.com/3c49473f1b9c48b58978124378bd2633" },
*       { "filename": "视频B.mp4" , url: "https://file.xxx.com/66eab02549c54e5cba93d8f7a25a87f9" },
*     ],
*     limit: 4,
*     complete({ data, blob }) {
*       console.log('filename', data.filename)
*     },
*     getProgress({ data, percentage }) {
*       console.log(`Download progress: ${percentage}`)
*     }
*   })
*/
export const invariableFetch = ({ data:list = [], limit = 4, getProgress = null, complete = () => {} }) => {
  const queue = list.splice(0, limit)
  while(queue.length) {
    const { url, data } = queue.shift()
    fetch(url)
      .then(response => {
        const { headers, body: stream } = response
        return { totalSize: headers.get('Content-Length'), reader: stream.getReader() }
      })
      .then(async ({ totalSize, reader }) => {
        let receiveSize = 0, chunks = []
        while(true) {
          const { done, value } = await reader.read()
          if (!done) {
            chunks.push(value)
            receiveSize += value.length
            getProgress && getProgress({ data, percentage: Number((receiveSize / totalSize * 100).toFixed(2))})
          } else {
            complete({ data, blob: new Blob(chunks) })
            list.length && invariableFetch({ data: list, getProgress, complete, limit: 1 })
            break
          }
        }
      })
  }
}
