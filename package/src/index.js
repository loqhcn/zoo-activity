//axios
import getHttp from './core/http';
import getAuth from './auth.js';

import share from './share'
import popup from './popup'

// 样式全局引入
import './../style/index.scss'
// rem适配
import './utils/flexible'

import Toast from './components/toast'

//安装方法
const install = function (Vue, option) {
    option = option || {}
    option = Object.assign({

    }, option)
    console.log(option)
    //内部组件http
    let http = getHttp(option.api, option.auth)

    Vue.prototype.$http = http;

    //分享
    Vue.prototype.$share = share(option.share);
    //toast
    Vue.prototype.$toast = Toast;

    //弹出层控制
    Vue.prototype.$popup = popup;


    //常用函数
    Vue.prototype.$utils = {

    };

    //登录
    Vue.prototype.$auth = getAuth(option.auth);

    /* 浏览器上引入安装 */
    if (typeof window !== 'undefined') {

        window.$http = http;
    }

}

export default {
    install,
    version: '0.0.1'
}






