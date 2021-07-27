
import COS from 'cos-js-sdk-v5'

// 获取COS配置信息
const getConf = async () => {
  const config = await fetch('/upload/tempKey', {
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Authorization': localStorage.getItem('AUTH-TOKEN')
    },
  }).then(response => {
    const { ok, status, statusText } = response
    if (!ok) {
      return Promise.reject({ status, statusText })
    } else {
      return response.json()
    }
  })
  return config
}

/**
 * 上传文件到COS
 * @param {Array} files 包含上传文件的配置
 * @param {Object} credentials 配置信息
 */
const uploadFilesToCOS = (files, credentials, callback) => {
  return new Promise((resolve, reject) => {
    const { tmpSecretId, tmpSecretKey, sessionToken } = credentials
    const cos = new COS({
      SecretId: tmpSecretId,
      SecretKey: tmpSecretKey,
      XCosSecurityToken: sessionToken,
      UploadCheckContentMd5: true
    })
    cos.uploadFiles({
      files, SliceSize: 1024 * 1024 * 20,  // 设置大于20MB采用分块上传
      AsyncLimit: 4, // 设置分块的并发量，仅在触发分块上传时有效
      StorageClass: 'STANDARD',
      onProgress({ percent, speed }) {
        const percentage = parseInt(percent * 100)
        callback({ percentage, uploadRate: ((speed / 1024 / 1024 * 100) / 100).toFixed(2) + ' Mb/s' })
        percentage === 100 && resolve({ finish: true })
      }
    })
  })
}

/**
 * 文件上传
 * @param {Array} data 文件对象
 * @param {Function} getProgress 获取文件上传中信息
 */
const upload = async (data, getProgress) => {
  const { bucket, region, requestAddress, dir, credentials } = await getConf()
  // 生成包含文件对象的COS配置
  const files = data.map(({ file, data }) => ({ Bucket: bucket, Region: region, Key: `${dir}/${data.uuid}`, Body: file }))
  // 上传文件到COS
  const result = await uploadFilesToCOS(files, credentials, progressInfo => {
    typeof getProgress === 'function' && getProgress(progressInfo)
  })
  // 上传成功后需要保存的文件相关信息
  const filesInfo = result.finish && data.map(({ file, data }) => {
    const { localUrl, ...fileInfo } = data
    URL.revokeObjectURL(localUrl)  // 销毁本地文件引用地址
    return ({ url: `${requestAddress}/${dir}/${data.uuid}`, ...fileInfo })
  })
  return Promise.resolve(filesInfo)
}

export default upload
