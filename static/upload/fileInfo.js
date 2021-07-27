/**
* 获取图片相关信息
* @param {File} file 文件对象
* @param {String} localUrl 文件本地引用地址
* @return {Object} 文件相关信息
*/
const getImageInfo = localUrl => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = localUrl
    img.onload = function() {
      resolve({ width: this.width, height: this.height })
    }
  })
}

/**
* 获取视频相关信息
* @param {File} file 文件对象
* @param {String} localUrl 文件本地引用地址
* @return {Object} 文件相关信息
*/
const getVideoInfo = localUrl => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    Object.assign(video, { src: localUrl, currentTime: 1 })
    video.addEventListener('loadedmetadata', function() {
      const { videoWidth: width, videoHeight: height, duration } = this
      resolve({ width, height, duration })
    })
  })
}

/**
* 获取文件相关信息
* @param {String} type 文件类别
* @param {File} file 文件对象
* @return {Object} 文件相关信息
*/
const getFileInfo = async (type, file) => {
  const localUrl = URL.createObjectURL(file)
  let fileInfo = null
  if (type === 'image') {
    fileInfo = await getImageInfo(localUrl)
  }
  if (type === 'video') {
    fileInfo = await getVideoInfo(localUrl)
  }
  const uuid = localUrl.slice(-32).replace(/-/g, '')
  const { name: filename, size: filesize, type: filetype } = file
  return Promise.resolve({ file, data: { uuid, localUrl, filename, filetype, filesize, ...fileInfo } })
}

const generatorFileInfo = async (type, files) => {
  return await Promise.all(files.map(async file => getFileInfo(type, file)))
}

export default generatorFileInfo