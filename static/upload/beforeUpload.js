
import validator from './validator'
import generatorFileInfo from './fileInfo'
import generatorHash from './hash'

/**
 * 文件上传前的规则校验以及校验通过后生成相关文件信息
 * @param {Array} files 文件对象
 * @param {String} type 文件类型
 * @param {Object} event 事件对象
 */
const beforeUpload = async ({ files = [], type='video', event }) => {
  event.target.value = null
  let data = null
  // 文件的格式、大小校验
  const result = await validator(type, files)
  if (!result.valid) return Promise.reject(result)
  // 获取文件相关信息，如宽度、高度、文件名称等
  data = await generatorFileInfo(type, files)
  // 获取文件的 MD5 值
  data = await generatorHash(data)
  return Promise.resolve(data)
}

export default beforeUpload