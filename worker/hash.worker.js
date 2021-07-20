/**
* @description: 生成文件的MD5
*/

importScripts(`${location.origin}/lib/browser-md5-file.min.js`)

const BMF = new self.browserMD5File()

const generateMD5 = ({file, data}) => {
  return new Promise((resolve, reject) => {
    BMF.md5(file, (err, md5) => {
      data.md5 = md5
      err ? reject(err) : resolve({ file, data })
    }, progress => {
      console.log('md5 progress number:', progress)
    })
  })
}

self.addEventListener('message', ({ data }) => {
  Promise.all(data.map(item => generateMD5(item)))
    .then(result => {
      self.postMessage(result)
    })
})
