import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false


// swiper
import 'swiper/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)


// ## 活动配置 集成sdk

import ZooActivity from './../package/src/index'
let vm = null;
//接口配置
let apiConfig = {
  authTokenName: 'x-auth-token',
  authMobileName: 'x-auth-mobile',
  authTokenLocalName: 'auth_token',
  authMobileLocalName: 'auth_mobile',
  baseUrl: process.env.VUE_APP_BASEURL || 'http://192.168.1.158/auth.zoocoffee.net/public/zoolifeapi/',
  wechatCallbackUrl: process.env.VUE_APP_WECHAT_CALLBACK || 'http://192.168.1.253:8080/laborday',
}

Vue.use(ZooActivity, {
  //auth配置
  api: {
    baseUrl: apiConfig.baseUrl,
    //token是否已过期 请求拦截
    tokenExpired: (res) => {
      if (res.code == -2) {
        //没有登录获取微信授权
        vm.$auth.toLogin();
      }
    },
  },
  //认证配置
  auth: {
    ...apiConfig,
    //formdata方式提交
    formData: true,
    //仅能微信中打开
    mastWeixin: true,
    //处理跳转登录
    toLogin() {
      vm.$auth.getOpenid(false);
    },
    //获取验证码
    getCode: (mobile, resolve, reject) => {
      console.log('获取验证码', mobile)
      vm.$http.post('sms/code', { mobile: mobile }).then(res => {
        if (res.code != 200) {
          vm.$toast(res.msg);
          reject();
          return;
        }
        resolve();
      }).catch(err => {
        reject();
      })
    },
    //登录 * 绑定手机号
    login: (info, resolve, reject) => {

      console.log('登录', info)
      let { openid } = localStorage;
      if (!openid) {
        vm.$toast("openid为获取到 请重新授权");
        vm.$auth.getOpenid();
        reject();
        return;
      }
      vm.$http
        .post("auth/bindPhone", {
          phone: info.mobile,
          code: info.code,
          openid: openid,
          rest_id: localStorage.rest_id ? localStorage.rest_id : 0,
        })
        .then(res => {
          if (res.code != 200) {
            vm.$toast(res.msg);
            reject();
            return;

          }
          vm.$toast("绑定成功");
          resolve();
          localStorage.setItem(apiConfig.authTokenLocalName, res.data.token);
          localStorage.setItem(apiConfig.authMobileLocalName, res.data.mobile);

        }).catch(err => {
          reject();
        });
    },
    /**
     * 跳转链接获取code
     * 
     * 
     */
    wechatGetCode: () => {
      vm.$http.get('auth/getcode', { params: { redirect_url: apiConfig.wechatCallbackUrl } }).then(res => {
        if (res.code != 200) {
          vm.$toast(res.msg);
          return;
        }
        console.log(res.data.codeUrl);
        window.location.href = res.data.codeUrl
      });
    },
    //code交换信息
    wechatLogin: (code) => {
      vm.$http.post('auth/getAccessToken', { code: code }).then(res => {
        if (res.code != 200) {
          if (res.code == -1) {
            localStorage.setItem('openid', res.data.openid)
            //显示绑定手机号弹出层
            vm.$auth.showLoginLayer();
          } else {
            // vm.$toast(res.msg);
            vm.$auth.toLogin();
          }
          return;
        }
        localStorage.setItem(apiConfig.authTokenLocalName, res.data.token);
        localStorage.setItem(apiConfig.authMobileLocalName, res.data.mobile);
      });
    },

  },
  share: {
    /**
     * 初始化jsapi
     * @param {} callback 
     * @demo callback({ appId,timestamp,nonceStr,signature })
     */
    initJsApi(callback) {
      let href = encodeURIComponent(location.href.split('#')[0]);
      vm.$http.get("https://auth.zoocoffee.net/zoolab/wechat/shar", {
        params: {
          url: href
        }
      }).then((data) => {
        //得到参数
        var appId = data.appId;
        var nonceStr = data.nonceStr;
        var signature = data.signature;
        var timestamp = data.timestamp;
        callback && callback({
          appId,
          nonceStr,
          signature,
          timestamp
        })
      })
    }
  }

});

// ## vue实例

window.vm = vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
