import axios from 'axios';

// http request 拦截器
axios.interceptors.request.use(
    config => {
        // console.log(config)
        // config.headers.set('user',)
        return config;
    },
    err => {
        return Promise.reject(err);
    });


    // 添加响应拦截器
axios.interceptors.response.use(
    (response)=> {
        return response
    },
    (error)=> {
        // 对响应错误进行操作
        return Promise.reject(error);
    }
);

export default axios;