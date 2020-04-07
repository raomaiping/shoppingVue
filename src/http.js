import axios from "axios";
import { Toast } from 'vant'

function startLoding() {
  // 自定义加载图标
  Toast.loading({
    message: "加载中...",
    forbidClick: true,
    loadingType: "spinner"
  });
}

function endLoading() {
  Toast.clear()
}

//请求拦截
axios.interceptors.request.use(
  config => {
    //加载动画
    startLoding();
    if (localStorage.eleToken) {
      //设置统一的请求header
      config.headers.Authorization = localStorage.eleToken;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//响应拦截
axios.interceptors.response.use(
  response => {
    //结束动画
    endLoading();
    return response;
  },
  error => {
    //错误提醒
    endLoading();
    const {status} = error.response;
    if(status == 401) {
        Message.error('token失效 请重新登录!');
        //清除token
        localStorage.removeItem('eleToken');
        //跳转到登录页面
        window.location.href = "/login"
    }
    return Promise.reject(error);

  }
);

export default axios;
