
import { blobToString } from './utils'

const strategies = Object.assign(Object.create({}), {
  'isMp4': async file => {
    const unit8Str = await blobToString(file.slice(0, 8))
    return unit8Str === '00 00 00 18 66 74 79 70' || unit8Str === '00 00 00 20 66 74 79 70'
  },
  'isMov': async file => {
    const unit8Str = await blobToString(file.slice(0, 8))
    return unit8Str === '00 00 00 14 66 74 79 70'
  },
  'isJpg': async file => {
    const [unit8StrBefore, unit8StrAfter] = await Promise.all([blobToString(file.slice(0, 2)), blobToString(file.slice(-2, file.size))])
    return unit8StrBefore === 'FF D8' && unit8StrAfter === 'FF D9'
  },
  'isPng': async file => {
    const unit8Str = await blobToString(file.slice(0, 8))
    return unit8Str === '89 50 4E 47 0D 0A 1A 0A'
  },
  'isGif': async file => {
    const [unit8StrBefore, unit8StrAfter] = await Promise.all([blobToString(file.slice(0, 7)), blobToString(file.slice(0, 6))])
    return unit8StrBefore === '47 49 46 38 39 61' || unit8StrAfter === '47 49 46 38 37 61'
  }
})

const isVideo = async file => ['video/mp4', 'video/quicktime'].includes(file.type) && (await Promise.all([strategies['isMp4'](file), strategies['isMov'](file)])).some(boolean => boolean)
const isImage = async file => ['image/png', 'image/jpeg', 'image/gif'].includes(file.type) && (await Promise.all([strategies['isJpg'](file), strategies['isPng'](file), strategies['isGif'](file)])).some(boolean => boolean)

/**
 * 文件规则校验
 * @param {String} type 文件类型
 * @param {Array} files 文件对象
 */
const validator = async (type, files) => {
  const result = (await Promise.all(files.map(file => (type === 'video' && isVideo(file)) || (type === 'image' && isImage(file))))).every(boolean => boolean)
  return result ? { valid: true } : Promise.reject({ valid: false })
}

export default validator
