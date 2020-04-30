import Vue from 'vue'
//登录弹出层
import Login from './components/member/Login'

let LoginConstructor = Vue.extend(Login);

let apiConfig = {
    //认证令牌
    authTokenLocalName: 'auth_token',
    authTokenName: 'x-auth-token',
}

class Auth {

    constructor(option) {
        option = option || {};

        this.loginInstance = false;
        //配置
        this.option = option;
    }

    /**
     * 获取openid,在公众号内
     * @todo 获取openid, 获取到之后保存到本地
     * @param toGet 没有openid时
     * @param callback 回调处理
     * 
     */
    getOpenid(code, callback) {
        let { openid } = localStorage
        if (openid) {
            callback && callback(openid)
        }
        if (this.isLogin()) {
            return;
        }
        if (!code) {
            if (this.isWeixin() || this.option.mastWeixin) {
                this.option.wechatGetCode && this.option.wechatGetCode();
            }
            return;
        }
        //得到code后获取授权
        this.option.wechatLogin && this.option.wechatLogin(code, callback);
    }

    //判断是否是微信浏览器的函数
    isWeixin() {
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf("micromessenger") != -1;
        return isWeixin;
    }


    /**
     * 显示手机号登录弹出层
     * @desc 通过手机号获取验证码登录, 获取验证码超过三次需要图片验证码
     * @todo 显示登录弹出层
     * 
     */
    showLoginLayer() {
        if (!this.loginInstance) {
            //组件实例
            this.loginInstance = new LoginConstructor({
                data: {
                    getCodeCall: this.option.getCode,
                    doLoginCall: this.option.login,

                }
            });
            //挂载
            this.loginInstance.$mount();
            document.body.appendChild(this.loginInstance.$el);
        }
        this.loginInstance.show();
    }


    //判断是否是微信浏览器的函数
    isWeixin() {
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf("micromessenger") != -1;
        return isWeixin;
    }

    /**
     * 前往登录
     * @logic 由接入方处理登录方式
     * @todo 清除登录信息存储
     * @todo 调用前往登录(微信授权 或者 )
     */
    toLogin() {
        //令牌清除
        localStorage.removeItem(apiConfig.authTokenLocalName)
        //清除openid
        localStorage.removeItem('openid')

        this.option.toLogin && this.option.toLogin();
    }

    getToken() {
        return localStorage[apiConfig.authTokenLocalName];
    }

    isLogin(toLogin) {
        let isLogin = !!localStorage[apiConfig.authTokenLocalName]
        if (!isLogin && toLogin) {
            this.showLoginLayer();
        }
        return isLogin
    }




    login(code, callback) {
        http.post('/wechat/auth', { code, code }).then(res => {
            if (res.errno) {
                if (confirm(`微信登录失败 ${res.msg} 是否重新登录? `)) {
                    this.toLogin();
                }
                return;
            }
            localStorage.setItem(apiConfig.authTokenLocalName, res.data.auth_token);
            callback && callback();
        });
    }


}



export default function (option) {
    return new Auth(option);
}