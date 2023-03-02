/**
 * 清空对象的属性值数据
 * @param {*} obj 
 */
 export const resetObjValues = (obj) => {
  if (!obj) return false;
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        obj[key] = [];
      } else {
        obj[key] = {};
      }
    } else {
      obj[key] = null;
    }
  })
  return obj;
}

/**
 * 深拷贝
 * @param {*} targetObj 
 * @returns 
 */
export const deepCopy = (targetObj) => {
  if (typeof targetObj === 'object') {
    const result = Array.isArray(targetObj) ? [] : {};
    for (let i in targetObj) {
      if (typeof targetObj[i] === 'object') {
        result[i] = deepCopy(targetObj[i]);
      } else {
        result[i] = targetObj[i];
      }
    }
    return result;
  } else {
    return targetObj;
  }
}

/**
 * 是否是json
 * @param {*} str 
 * @returns Boolean
 */
export const isJson = (str) => {
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

/**
 * 千分价格
 * @param {*} num 
 * @returns 
 */
export const formatNumberRgx = (num) => {
  if (num !== null && num !== undefined) {
    let parts = Number(num).toFixed(2).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } else {
    return 0;
  }
}

// 負數及带小数數字的獲取
export const getPriceNum = (value) => {
  console.log(value);
  if (value != "" && value != null) {
    let reg = /(\-)?\d+[0-9]+([.]{1}[0-9]+){0,1}/g;
    let m = value.toString().replace(/,/g, '').match(reg);
    console.log(m);
    return m ? m.join("") : value;
  } else {
    return "";
  }
};
// 負數及整数数字的获取
export const getIntegerNum = (value) => {
  console.log(value);
  if (value != "" && value != null) {
    let reg = /(\-)?\d+[0-9]+([0-9]+){0,1}/g;

    let m = value.toString().replace(/,/g, '').match(reg);
    console.log(m);
    return m ? m.join("") : value;
  } else {
    return "";
  }
};

// 当前日期
export const getDateNow = () => {
  let now = new Date();
  let year = now.getFullYear(); //得到年份
  let month = now.getMonth(); //得到月份
  let date = now.getDate(); //得到日期

  month = month + 1;
  month = month.toString().padStart(2, "0");
  date = date.toString().padStart(2, "0");
  let defaultDate = `${year}-${month}-${date}`; //
  return defaultDate;
}

/**
 * 比较两个日期天数
 * @param {*} date_1 
 * @param {*} date_2 
 * @returns 
 */
export const diffDay = (date_1, date_2) => {
  let totalDays, diffDate;
  let myDate_1 = Date.parse(date_1);
  let myDate_2 = Date.parse(date_2);
  diffDate = Math.abs(myDate_1 - myDate_2);

  totalDays = Math.floor(diffDate / (1000 * 3600 * 24)); // 向下取整
  return totalDays;
}

// 交易方式
const tradeTypeList = [{
    label: '买入',
    value: 0
  },
  {
    label: '卖出',
    value: 1
  },
  {
    label: '转账',
    value: 2
  },
  {
    label: '买入退款',
    value: 3
  },
  {
    label: '卖出退款',
    value: 4
  },
  {
    label: '其他收入',
    value: 5
  },
  {
    label: '其他支出',
    value: 6
  },
  {
    label: '税金',
    value: 7
  },
  {
    label: '佣金',
    value: 8
  },
  {
    label: '小费',
    value: 9
  },
  {
    label: '运费',
    value: 10
  },
]
export const tradeTypeRgx = function (item) {
  for (let i = 0; i < tradeTypeList.length; ++i) {
    if (item == tradeTypeList[i].value)
      return tradeTypeList[i].label
  }
  return "";
};

// 库存状态
const stateList = [{
    label: "采购中",
    value: 0,
  },
  {
    label: "运输中",
    value: 1,
  },
  {
    label: "已入库",
    value: 2,
  },
  {
    label: "已售未出库",
    value: 3,
  },
  {
    label: "已售已出库",
    value: 4,
  },
  {
    label: "已寄卖",
    value: 5,
  },
]
export const stateRgx = function (item) {
  for (let i = 0; i < stateList.length; ++i) {
    if (item == stateList[i].value)
      return stateList[i].label
  }
  return "";
};

// 提取货号
export const productCodeGet = function (item, flag) {
  if (item.length > 0) {
    if (flag == 1) {
      let msg = "";
      for (const every of item) {
        msg += every.stockNo + "<br />";
      }
      return msg;
    } else if (flag == 2) {
      let msg = "";
      for (const every of item) {
        msg += every.watchSn + "<br />";
      }
      return msg;
    }
  } else {
    return "/";
  }
};