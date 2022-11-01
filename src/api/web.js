import {
  request
} from '@/utils/request';

/**
 * 物流查询
 * @param {*} data 
 * @returns 
 */
export const logSearch = (data = {}) => {
  return request({
    url: '/logSearch',
    method: 'POST',
    data
  })
}

/**
 * 日期汇率
 * @param {*} date 
 * @returns 
 */
export const dateRatesGet = (date) => {
  return request({
    url: `/dateRatesGet?date=${date}`,
    method: 'GET'
  })
}

/**
 * 银联或钱庄历史汇率
 * @param {*} params 
 *  currency 币种: 如USD
 *  type类型 0银联 2钱庄
 * @returns 
 */
export const bankOrMoneyShopRateHisGet = (params = {}) => {
  return request({
    url: '/bankOrMoneyShopRateHisGet',
    method: 'GET',
    params
  })
}

/**
 * 现钞历史汇率
 * @param {*} params 
 * currency 币种: 如USD
 * @returns 
 */
export const cashRateHisGet = (currency) => {
  return request({
    url: `/cashRateHisGet?currency=${currency}`,
    method: 'GET',
  })
}

/**
 * 钱庄汇率查询
 * @param {*} date 
 * @returns 
 */
export const moneyShopRateGetWithDate = (date) => {
  return request({
    url: `/moneyShopRateGetWithDate?date=${date}`,
    method: 'GET'
  })
}

/**
 * 钱庄汇率新增修改
 * @param {*} data 
 * @returns 
 */
export const shopRateSave = (data) => {
  return request({
    url: '/shopRateSave',
    method: 'POST',
    data
  })
}

/**
 * 贸易商/客户列表
 * @param {*} keyword 
 * @returns 
 */
export const peerOrCustomerList = (keyword = '', id = null) => {
  return request({
    url: `/peerOrCustomerList?keyword=${keyword}&peerOrCustomerId=${id}`,
    method: 'GET',
  })
}

/**
 * 新增修改贸易商/客户
 * @param {*} data 
 * @returns 
 */
export const peerOrCustomerSave = (data = {}) => {
  return request({
    url: '/peerOrCustomerSave',
    method: 'POST',
    data
  })
}

/**
 * 删除贸易商或客户
 * @param {*} id 
 * @returns 
 */
export const peerOrCustomerDel = (id) => {
  return request({
    url: `/peerOrCustomerDel?id=${id}`,
    method: 'GET'
  })
}

/**
 * 手表价格列表
 * @param {*} data 
 * @returns 
 */
export const watchPriceList = (data) => {
  return request({
    url: '/watchPriceList',
    method: 'POST',
    data
  })
}

/**
 * 新增手表价格
 * @param {*} data 
 * @returns 
 */
export const watchPriceAdd = (data) => {
  return request({
    url: '/watchPriceAdd',
    method: 'POST',
    data
  })
}

/**
 * 手表价格删除
 * @param {*} id 批发价/行情价/公价记录id 
 * @returns 
 */
export const watchPriceDel = (id) => {
  return request({
    url: `/watchPriceDel?id=${id}`,
    method: 'GET'
  })
}

/**
 * 手表历史价格
 * @param {*} params 
 * @returns 
 */
export const watchPriceHis = (params = {}) => {
  return request({
    url: '/watchPriceHis',
    method: 'GET',
    params
  })
}

/**
 * 手表等级修改
 * @param {*} params 
 * @returns 
 */
export const watchLevelSave = (params = {}) => {
  return request({
    url: '/watchLevelSave',
    method: 'GET',
    params
  })
}

export const watchPublicPriceList = (id) => {
  return request({
    url: '/watchPublicPriceList?id=' + id,
    method: 'GET'
  })
}