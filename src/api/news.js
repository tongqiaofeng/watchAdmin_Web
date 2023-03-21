import { request } from "@/utils/request";

/**
 * 获取新闻资讯列表
 * @param {*} data
 * @returns
 */
export const articleListPort = (data) => {
  return request({
    url: "/articleList",
    method: "POST",
    data,
  });
};

/**
 * 删除新闻
 */
export const articleDel = (id) => {
  return request({
    url: "/articleDel?id=" + id,
    method: "GET",
  });
};

/**
 * 新闻详情
 */
export const articleInfo = (id) => {
  return request({
    url: "/articleInfo?id=" + id,
    method: "GET",
  });
};

/**
 * 添加修改新闻
 * @param {*} data
 * @returns
 */
export const articleSave = (data) => {
  return request({
    url: "/articleSave",
    method: "POST",
    data,
  });
};
