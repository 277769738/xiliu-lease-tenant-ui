import moment from 'moment'

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(t) {
    if (childrenListMap[t[config.id]] != null) {
     t[config.childrenList] = childrenListMap[t[config.id]];
   }
    if (t[config.childrenList]) {
      for (let c of t[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}
// 格式化时间
export function dateTimeFormat(time) {
  var date = time
  if (date === undefined || date === null) { return '' }
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  let search = params;
  // 判断params的类型
  //search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (typeof (propName) === 'undefined') {
    search['beginTime'] = dateRange[0];
    search['endTime'] = dateRange[1];
  } else {
    search['begin' + propName] = dateRange[0];
    search['end' + propName] = dateRange[1];
  }
  return search;
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof (value) !== "undefined") {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result
}
// 验证是否为blob格式
export async function blobValidate(data) {
  try {
    const text = await data.text();
    JSON.parse(text);
    return false;
  } catch (error) {
    return true;
  }
}

// 数据合并
export function mergeRecursive(source, target) {
  for (var p in target) {
    try {
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p]);
      } else {
        source[p] = target[p];
      }
    } catch (e) {
      source[p] = target[p];
    }
  }
  return source;
};

/**
 * 生成随机文件名称
 * 时间戳
 */
export const getFileNameUUID = () => {
  /*function rx() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }*/
  return `${+new Date()}`
}

