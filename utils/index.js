/**
* @description: 列表分组，一维数组转二维数组
* @param {Array} data: 源数据
* @param {Number} num: 分组基数
* @return {Array} 目标数据
* @example
*
*   group([1, 2, 3, 4, 5, 6, 7, 8], 2)  // [[1, 2], [3, 4], [5, 6], [7, 8]]
*
*   group([1, 2, 3, 4, 5, 6, 7, 8], 3)  // [[1, 2, 3], [4, 5, 6], [7, 8]]
*/
export const group = (data, num) => {
  return Array.from({ length: Math.ceil(data.length / num) }, (_, i) => data.slice(i * num, (i + 1) * num))
}

/**
* @description: 列表归档，一维数组转二维数组
* @param {Array} data: 源数据
* @param {String} key: 归档维度
* @return {Array} 目标数据
* @example
*
*   const source = [
*     { "date": "1月", "name": "跳舞" },
*     { "date": "1月", "name": “钢琴” },
*     { "date": "2月", "name": “游泳” },
*   ]
*
*   archive(source, 'date')
*
*   [
*     [
*       { "date": "1月", "name": "跳舞" },
*       { "date": "1月", "name": “钢琴” },
*     ],
*     [
*       { "date": "2月", "name": “游泳” },
*     ]
*   ]
*/
export const archive = (data, key) => {
  const values = [...new Set(data.map(item => item[key]))]
  return values.reduce((sets, value) => (sets.push(data.filter(item => item[key] === value)), sets), [])
}

/**
* @description: 列表归档并分组
* @params {Array} data: 源数据
* @params {String} key: 归档维度
* @params {String} groupName: 组名称
* @return {Array} 目标数据
*
* @example
*
*   const source = [
*     { "year": "2020", "month": 1, "startDate": "2020-01-01", "endDate": "2020-01-31" },
*     { "year": "2020", "month": 2, "startDate": "2020-02-01", "endDate": "2020-02-29" },
*     { "year": "2021", "month": 1, "startDate": "2021-01-01", "endDate": "2021-01-31" },
*     { "year": "2021", "month": 2, "startDate": "2021-02-01", "endDate": "2021-02-28" },
*   ]
*
*   subgroup(source, 'year', 'options')
*
*   [
*     {
*       "year": "2020",
*       "options": [
*         { "year": "2020", "month": 1, "startDate": "2020-01-01", "endDate": "2020-01-31" },
*         { "year": "2020", "month": 2, "startDate": "2020-02-01", "endDate": "2020-02-29" },
*       ]
*     },
*     {
*       "year": "2021",
*       "options": [
*         { "year": "2021", "month": 1, "startDate": "2021-01-01", "endDate": "2021-01-31" },
*         { "year": "2021", "month": 2, "startDate": "2021-02-01", "endDate": "2021-02-28" },
*       ]
*     }
*   ]
*/
export const subgroup = (data, key, groupName = 'options') => {
  const hash = new Map()
  data.forEach(item => {
    const value = item[key]
    if (hash.has(value)) {
      hash.get(value)[groupName].push(item)
    } else {
      hash.set(value, {[key]: value, [groupName]: [item]})
    }
  })
  return [...hash.values()]
}
