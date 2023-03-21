import axios from "axios";
import { useUserStore } from "@/store/userStore";
import _sessionStorage from "@/utils/sessionStorage";
import router from "@/router/index";
import { ElMessage } from "element-plus";

const base_file_request_url = "http://192.168.0.164:80";
// const base_request_url = 'https://hk.wistechx.cn/WatchExApi/api/watch/stock' // 正式

const base_request_url = base_file_request_url + "/api/watch/stock";

const request = axios.create({
  baseURL: base_request_url,
  timeout: "",
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

// 请求拦截
request.interceptors.request.use((config) => {
  let userStore = useUserStore();
  if (userStore.token) {
    config.headers.common["token"] = userStore.token;
  }
  console.log(config);
  let url = "";
  url = config.url.indexOf("?") === -1 ? config.url : config.url.split("?")[0];
  switch (url) {
    case "/articleList":
      config.baseURL = base_file_request_url + "/article/api";
      break;
    case "/articleDel":
      config.baseURL = base_file_request_url + "/article/api";
      break;
    case "/articleInfo":
      config.baseURL = base_file_request_url + "/article/api";
      break;
    case "/articleSave":
      config.baseURL = base_file_request_url + "/article/api";
      break;
    default:
      config.baseURL = base_request_url;
  }

  return config;
});

// 请求响应
request.interceptors.response.use(
  (response) => {
    // 认证未通过,非法登录
    if (response.data.code == 300) {
      ElMessage.warning("认证失败");
      _sessionStorage.remove("token");
      _sessionStorage.remove("admin_info");
      setTimeout(() => {
        router.replace({
          path: "/",
        });
      }, 400);
    } else {
      return response;
    }
  },
  (error) => {
    console.log("请求错误", error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          _sessionStorage.remove("token");
          _sessionStorage.remove("admin_info");

          router.replace({
            path: "/",
            query: {
              redirect: router.currentRoute.fullPath, //登录成功后跳入浏览的当前页面
            },
          });
      }
    }
    return Promise.reject(error);
  }
);

export { request, base_request_url, base_file_request_url };
