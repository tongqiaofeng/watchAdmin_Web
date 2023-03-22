import { request } from "@/utils/request";

// 添加、修改客服
export const customerServiceSave = (data) => {
  return request({
    url: "/customerServiceSave",
    method: "POST",
    data,
  });
};

// 客服列表
export const customerServiceList = () => {
  return request({
    url: `/customerServiceList`,
    method: "GET",
  });
};

/**
 * 删除客服
 */
export const customerServiceDel = (id) => {
  return request({
    url: "/customerServiceDel?id=" + id,
    method: "GET",
  });
};
