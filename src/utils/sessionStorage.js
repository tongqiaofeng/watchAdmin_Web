// sessionStorage
const _sessionStorage = {};
_sessionStorage.set = function (key, value) {
  if (!key) {
    return null;
  }
  // 复合类型转为json
  if (typeof value === 'object') {
    // console.log(value)
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
}

_sessionStorage.get = function (key) {
  let value = sessionStorage.getItem(key);
  if (isJson(value)) {
    value = JSON.parse(value);
  }
  return value;
}

_sessionStorage.remove = function(key) {
  sessionStorage.removeItem(key);
}

_sessionStorage.clear = function() {
  sessionStorage.clear();
}


/**
 * 验证json
 * @param {*} str 
 * @returns Boolean
 */
 export function isJson(str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str);
      if (obj && typeof obj === 'object') {
        return true;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}
export default _sessionStorage;