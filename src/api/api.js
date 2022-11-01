import {
  request
} from '@/utils/request';

/**
 * 店铺列表
 * @returns 
 */
export const storeList = (keyword = '') => {
  return request({
    url: `/storeList?keyword=${keyword}`,
    method: 'GET',
  })
}

/**
 * 删除店铺
 * @param {*} storeId 
 * @returns 
 */
export const storeDel = (storeId) => {
  return request({
    url: `/storeDel?id=${storeId}`,
    method: 'GET'
  })
}

/**
 * 新增修改店铺(传id修改)
 * @param {*} data 
 * @returns 
 */
export const storeSave = (data) => {
  return request({
    url: '/storeSave',
    method: 'POST',
    data
  })
}

/**
 * 品牌系列列表 
 * @returns 
 */
export const watchBrandList = () => {
  return request({
    url: '/watchBrandList',
    method: 'GET'
  })
}

/**
 * 国家列表
 * @returns 
 */
export const countryList = () => {
  return request({
    url: '/countryList',
    method: 'GET'
  })
}

/**
 * 手表多条件筛选
 * @param {*} data 
 * @returns 
 */
export const watchSearchCheck = (data) => {
  return request({
    url: '/watchSearchCheck',
    method: 'POST',
    data
  })
}

/**
 * 新增修改手表 id修改
 * @param {*} data 
 * @returns 
 */
export const watchSave = (data) => {
  return request({
    url: '/watchSave',
    method: 'POST',
    data
  })
}

/**
 * 手表详情
 * @param {*} watchId 
 * @returns 
 */
export const watchInfo = (watchId) => {
  return request({
    url: `/watchInfo?id=${watchId}`,
    method: 'GET'
  })
}

/**
 * 上传文件/图片
 * @param {*} data 
 * files array 上传文件列表
 * type 1手表图片 2其他 文件类型
 * @returns 
 */
export const uploadFile = (data) => {
  return request({
    url: '/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

/**
 * 贸易商列表
 * @returns 
 */
export const peerOrCustomerList = (keyword = '', id = null) => {
  return request({
    url: `/peerOrCustomerList?keyword=${keyword}&peerOrCustomerId=${id}`,
    method: 'GET',
  })
}

/**
 * 采购员/销售员列表
 * @returns 
 */
export const buyerOrSellerList = (type) => {
  return request({
    url: `/buyerOrSellerList?type=${type}`,
    method: 'GET',
  })
}

/**
 * 新增采购单
 * @param {*} data 
 * @returns 
 */
export const buyOrderAdd = (data) => {
  console.log('新增采购单', data);
  return request({
    url: '/buyOrderAdd',
    method: 'POST',
    data
  })
}

/**
 * 采购单详情
 * @param {*} data 
 * @returns 
 */
export const buyOrderInfo = (data) => {
  return request({
    url: '/buyOrderInfo',
    method: 'POST',
    data
  })
}

/**
 * 修改采购单
 * @param {*} data 
 * @returns 
 */
export const buyOrderUpdate = (data) => {
  return request({
    url: '/buyOrderUpdate',
    method: 'POST',
    data
  })
}

/**
 * 采购单列表
 * @param {*} data 
 * @returns 
 */
export const buyOrderSearch = (data) => {
  return request({
    url: '/buyOrderSearch',
    method: 'POST',
    data
  })
}

/**
 * 删除采购单
 * @param {*} data 
 * @returns 
 */
export const buyOrderDel = (data) => {
  return request({
    url: '/buyOrderDel',
    method: 'POST',
    data
  })
}

/**
 * 仓库列表
 * @returns 
 */
export const companyWarehouseList = () => {
  return request({
    url: '/companyWarehouseList',
    method: 'GET',
  })
}

/**
 * 接收公司仓库列表
 * @returns 
 */
export const receiveWarehouseList = () => {
  return request({
    url: '/receiveWarehouseList',
    method: 'GET',
  })
}

/**
 * 库存查询
 * @param {*} data 
 * @returns 
 */
export const stockSearch = (data) => {
  return request({
    url: '/stockSearch',
    method: 'POST',
    data
  })
}


/**
 * 新增/修改销售单
 * @param {*} data 
 * @returns 
 */
export const sellOrderSave = (data) => {
  return request({
    url: '/sellOrderSave',
    method: 'POST',
    data
  })
}

/**
 * 撤销销售单
 * @param {*} data 
 * @returns 
 */
export const sellOrderDel = (data) => {
  return request({
    url: '/sellOrderDel',
    method: 'POST',
    data
  })
}

/**
 * 获取销售单列表
 * @param {*} data 
 * @returns 
 */
export const sellOrderSearch = (data) => {
  return request({
    url: '/sellOrderSearch',
    method: 'POST',
    data
  })
}

/**
 * 状态修改
 * @param {*} data 
 * @returns 
 */
export const stateSave = (data) => {
  return request({
    url: '/stateSave',
    method: 'POST',
    data
  })
}

/**
 * 库存详情
 * @returns 
 */
export const stockInfo = (id) => {
  return request({
    url: `/stockInfo?id=${id}`,
    method: 'GET'
  })
}

/**
 * 库存记录编辑修改
 * @param {*} data 
 * @returns 
 */
export const stockSave = (data) => {
  return request({
    url: '/stockSave',
    method: 'POST',
    data
  })
}

/**
 * 库存地修改,采购中无库存地
 * @param {*} data 
 * @returns 
 */
export const warehouseSave = (data) => {
  return request({
    url: '/warehouseSave',
    method: 'POST',
    data
  })
}

/**
 * 获取已有销售单接收仓库列表
 * @param {*} data 
 * @returns 
 */
export const consignWarehouseList = () => {
  return request({
    url: '/consignWarehouseList',
    method: 'GET'
  })
}

/**
 * 根据货号/机芯号查询手表
 */
export const stockNoOrWatchSnSearch = (type, keyword) => {
  return request({
    url: '/stockNoOrWatchSnSearch?type=' + type + "&keyword=" + keyword,
    method: 'GET'
  })
}

/**
 * 账单添加/修改
 * @param {*} data 
 * @returns 
 */
export const billSave = (data) => {
  return request({
    url: '/billSave',
    method: 'POST',
    data
  })
}

/**
 * 账单删除
 * @param {*} data 
 * @returns 
 */
export const billDel = (data) => {
  return request({
    url: '/billDel?id=' + data,
    data
  })
}

/**
 * 账单查询
 * @param {*} data 
 * @returns 
 */
export const billSearch = (data) => {
  return request({
    url: '/billSearch',
    method: 'POST',
    data
  })
}

/**
 * 获取账单详情
 */
export const billInfo = (id) => {
  return request({
    url: "/billInfo?id=" + id,
    method: 'GET'
  })
}

/**
 * 账单人员列表
 */
export const billUserList = () => {
  return request({
    url: '/billUserList',
    method: 'GET'
  })
}

/**
 * 交易方式列表
 */
export const receiveTypeList = () => {
  return request({
    url: '/receiveTypeList',
    method: 'GET'
  })
}

/**
 * 首页数据获取
 */
export const indexMsg = () => {
  return request({
    url: '/indexMsg',
    method: 'GET'
  })
}

/**
 * 根据年份获取销售信息
 */
export const indexSearchMsg = (state, year) => {
  return request({
    url: '/indexSearchMsg?state=' + state + '&year=' + year,
    method: 'GET'
  })
}