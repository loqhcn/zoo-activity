# zoocoffee活动前端SDK

## 主要功能

- 微信公众号分享

- 登录功能 微信登录加绑定手机号 or 手机号登录 or 微信授权登录

- - 获取手机验证码错误三次后的图片验证码

- toast轻提示
  
- 弹出层锁定背景

- 常用样式

- - flex布局
- - rem适配 (18.75rem)
- - 点击区域扩大
- - 基础按钮 .btn
- - 基础输入框 .input
- - 遮罩层 .shadow

## sdk内置插件


## 使用


[引入](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#3)

```javascript
//接口 = axios
this.$http

//微信登录
let code = this.$route.query.code || false;
this.$auth.getOpenid(code);

//手机号登录 或 绑定手机号
vm.$auth.showLoginLayer();

//前往登录 *需要通过config.auth.toLogin自行实现
vm.$auth.toLogin();

//弹出层打开时锁定背景滚动
this.$popup.updateLockStatus(弹出层状态, "弹出层的名称 唯一id");

watch
detailVisible(newValue, oldValue) {
    this.$popup.updateLockStatus(newValue, "弹出层的名称 唯一id");
}

//toast轻提示
this.$toast(res.msg);

//微信等分享引导
this.$share.open({
    text: "提示文字"
});



```


## 配置说明

- 使用demo查看 51劳动节活动

```javascript

//接口配置 加载env
let apiConfig = {
    authTokenName: 'x-auth-token',
    authMobileName: 'x-auth-mobile',
    authTokenLocalName: 'auth_token',
    authMobileLocalName: 'auth_mobile',
    baseUrl: process.env.VUE_APP_BASEURL || 'http://192.168.1.158/auth.zoocoffee.net/public/zoolifeapi/',
    wechatCallbackUrl: process.env.VUE_APP_WECHAT_CALLBACK || 'http://192.168.1.253:8080/laborday',
}

//
Vue.use(ZooActivity, {

  //接口配置
  api: {
    //api默认地址
    baseUrl: String,
    //formdata方式提交
    formData: Boolean,
    //token是否已过期 function axios响应拦截
    tokenExpired:{
        type:Function,
        demo:(res)=>{
            if (res.code == -2) {
                //没有登录获取微信授权
                vm.$auth.toLogin();
            }
        }
    }
  },
  //认证配置
  auth:{
    //仅能微信中打开
    mastWeixin:Boolean,
    //处理跳转登录
    toLogin:{
        type:Function,
        demo:()=>{
            vm.$auth.getOpenid(false);
        }
    },
    //获取验证码接口
    getCode:{
        type:Function,
        demo:(mobile, resolve, reject)=>{
           //@TODO 登录接口
           //发送成功
           resolve();
           //发送失败
           reject();
        }
    },
    //登录或者绑定手机号
    login:{
        type:Function,
        demo:(info, resolve, reject)=>{
            let {
                mobile,code
            } = info;
           //@TODO 调用 登录或绑定手机号 的api
           //登录成功
           resolve();
           //登录失败
           reject();
        }
    },
    //公众号登录 跳转链接获取code 
    wechatGetCode:{
        type:Function,
        demo:()=>{
            //查看说明 https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html#0
            let codeUrl = '';
            window.location.href = codeUrl
        }
    },
    //微信公众号授权登录
    wechatLogin:{
        type:Function,
        demo:(code)=>{
            //@TODO 调用接口 通过code登录服务器

        }

    },
    //jsapi调用 配置分享
    initJsApi:{
        type:Function,
        demo:(callback)=>{
            //@TODO 调用接口 获取jsapi的签名参数
            //查看说明 https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#3
            callback({
                appId,
                nonceStr,
                signature,
                timestamp    
            });
        }
    }


  },
  //分享配置
  share:{
      
  }

});

```
## 样式开发
