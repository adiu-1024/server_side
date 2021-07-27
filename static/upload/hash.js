
import BMF from 'browser-md5-file'
const bmf = new BMF()

/**
* 生成文件的MD5
* @param {File} file 文件对象
* @param {Object} data 业务附加数据
*/
const getFileMD5 = ({file, data}) => {
  return new Promise((resolve, reject) => {
    bmf.md5(file, (err, md5) => {
      err ? reject(err) : resolve({ file, data: { md5, ...data } })
    }, progress => {
      console.log('md5 progress number:', progress)
    })
  })
}

const generatorHash = async data => await Promise.all(data.map(item => getFileMD5(item)))

export default generatorHash
