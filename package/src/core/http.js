import axios from 'axios'
import qs from 'qs'


/**
 * 
 * @param {*} option vue.use-option.api
 * @param {*} apiConfig option.auth
 */
export default function (option, apiConfig) {

    option = option || {};
    option = Object.assign({
        baseUrl: '',
    }, option)


    const instance = axios.create({
        baseURL: option.baseUrl,
        timeout: 10000,
        headers: {},
    });




    console.log(instance, option)

    //访问拦截器  添加用户认证领令牌
    instance.interceptors.request.use(function (config) {
        //数据修改为fromdata模式提交
        if (apiConfig.formData) {
            if (config['data'] && config['method'] == 'post') {
                config.headers['Content-Type'] = `application/x-www-form-urlencoded; charset=UTF-8`;
                config['data'] = qs.stringify(config['data'])
            }
        }


        if (!config.params)
            config.params = {};
        var token = localStorage.getItem(apiConfig.authTokenLocalName);
        var mobile = localStorage.getItem(apiConfig.authMobileLocalName);

        if (token || mobile) {
            config.headers[apiConfig.authTokenName] = `${token || ''}`;
            config.headers[apiConfig.authMobileName] = `${mobile || ''}`;
        }

        //请求附带用户认证令牌
        // var TOKEN = localStorage.getItem(apiConfig.authTokenLocalName);
        // if (TOKEN) {
        //   config.headers[apiConfig.authTokenName] = `${TOKEN}`;
        // }

        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    instance.interceptors.response.use(function (response) {
        // Do something with response data


        //TODO 判断登录状态
        if (response.data && response.data.code) {
            if (option.tokenExpired) {
                option.tokenExpired(response.data);
            }
        }
        return response.data;
    }, function (error) {
        // Do something with response error
        return Promise.reject(error);
    });

    return instance

}


