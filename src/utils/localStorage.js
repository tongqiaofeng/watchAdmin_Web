// localStorage
const _localStorage = {};
_localStorage.set = function (key, value) {
  if (!key) {
    return null;
  }
  // 复合类型转为json
  if (typeof value === 'object') {
    // console.log(value)
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
}

_localStorage.get = function (key) {
  let value = localStorage.getItem(key);
  if (isJson(value)) {
    value = JSON.parse(value);
  }
  return value;
}

_localStorage.remove = function(key) {
  localStorage.removeItem(key);
}

_localStorage.clear = function() {
  localStorage.clear();
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
export default _localStorage;