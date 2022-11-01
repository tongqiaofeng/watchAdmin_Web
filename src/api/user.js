import {
  request
} from '@/utils/request';

export const login = (data) => {
  return request({
    url: '/login',
    method: 'POST',
    data
  });
}

/**
 * 修改昵称
 * @returns 
 */
export const nickSave = (keyword = '') => {
  return request({
    url: `/nickSave?nick=${keyword}`,
    method: 'GET',
  })
}

/*
修改密码
*/
export const pswSave = (data) => {
  return request({
    url: '/pswSave',
    method: 'POST',
    data
  });
}