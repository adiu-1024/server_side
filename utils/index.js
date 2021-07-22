/**
* @description: 对象转为查询字符串
* @params {Object} data: 源数据
* @return {String} 目标数据
* @example
*
*   serialize({ a: 1, b: 2 })  // a=1&b=2
*/
export const serialize = data => {
  return Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&')
}

/**
* @description: 获取查询参数
* @params {String} name: 查询参数名称
* @return {String} 目标数据
* @example
*
*   getQueryString('id')
*/
export const getQueryString = (url, name) => {
  return (new URLSearchParams(location.search)).get(name)
}

/**
* @description: 列表分组，一维数组转二维数组
* @param {Array} list: 源数据
* @param {Number} num: 分组基数
* @return {Array} 目标数据
* @example
*
*   group([1, 2, 3, 4, 5, 6, 7, 8], 2)  // [[1, 2], [3, 4], [5, 6], [7, 8]]
*
*   group([1, 2, 3, 4, 5, 6, 7, 8], 3)  // [[1, 2, 3], [4, 5, 6], [7, 8]]
*/
export const group = (list, num) => {
  return Array.from({ length: Math.ceil(list.length / num) }, (_, i) => list.slice(i * num, (i + 1) * num))
}

/**
* @description: 列表归档，一维数组转二维数组
* @param {Array} list: 源数据
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
export const archive = (list, key) => {
  const values = [...new Set(list.map(item => item[key]))]
  return values.reduce((sets, value) => (sets.push(list.filter(item => item[key] === value)), sets), [])
}

/**
* @description: 列表归档并分组
* @params {Array} list: 源数据
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
export const subgroup = (list, key, groupName = 'options') => {
  const hash = new Map()
  list.forEach(item => {
    const value = item[key]
    if (hash.has(value)) {
      hash.get(value)[groupName].push(item)
    } else {
      hash.set(value, {[key]: value, [groupName]: [item]})
    }
  })
  return [...hash.values()]
}

/**
* @description: 列表转树结构
* @param {Array} list: 源数据
* @param {String} id: 父子节点关系
* @param {String} pid: 父子节点关系
* @return {Array} 目标数据
* @example
*
*   const source = [
*     { "id": 1, "name": "M1部门" },
*     { "id": 11, "pid": 1, "name": "张三" },
*     { "id": 12, "pid": 1, "name": "李四" },
*     { "id": 13, "pid": 1, "name": "王五" },
*     { "id": 2, "name": "M2部门" },
*     { "id": 21, "pid": 2, "name": "赵六" },
*     { "id": 22, "pid": 2, "name": "周七" },
*     { "id": 23, "pid": 2, "name": "吴八" },
*   ]
*
*   listToTree(source, 'id', 'pid')
*
*   [
*     {
*       "id": 1, "name": "M1部门",
*       "children": [
*         { "id": 11, "pid": 1, "name": "张三" },
*         { "id": 12, "pid": 1, "name": "李四" },
*         { "id": 13, "pid": 1, "name": "王五" },
*       ]
*     },
*     {
*       "id": 2, "name": "M2部门",
*       "children": [
*         { "id": 21, "pid": 2, "name": "赵六" },
*         { "id": 22, "pid": 2, "name": "周七" },
*         { "id": 23, "pid": 2, "name": "吴八" },
*       ]
*     }
*   ]
*/
export const listToTree = (list, id = 'id', pid = 'pid') => {
  const hash = new Map(), roots = []
  list.forEach(item => {
    hash.set(item[id], item)
    const parent = hash.get(item[pid])
    if (!parent) {
      roots.push(item)
    } else {
      !parent.children && (parent.children = [])
      parent.children.push(item)
    }
  })
  return roots
}
