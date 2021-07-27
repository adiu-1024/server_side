/**
 * 把文件的二进制数据转为16进制字符转
 * @param {Blob} blob 二进制文件数据
 */
export const blobToString = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onload = function(e) {
      resolve(new Uint8Array(e.target.result).reduce((str, item) => (str += item.toString(16).toUpperCase().padStart(2, '0') + ' ', str), '').trim())
    }
  })
}
  