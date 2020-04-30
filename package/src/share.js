import Vue from 'vue'
import ShareComponent from './components/Share'

let mainConstructor = Vue.extend(ShareComponent);

let instance = null;

class Share {

    constructor(option) {
        this.option = option;
    }

    /**
     * 配置微信分享
     * @param {} option
     *  
     */
    wechatInit(shareConfigData, callback) {
        this.option.initJsApi && this.option.initJsApi((data) => {

            let {
                appId, timestamp, nonceStr, signature
            } = data;
            console.log('config data' , data)
            window.wx.config({
                debug: false,
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline',
                    'onMenuShareQQ'
                ]
            });

            let share_config = {
                'share': {
                    ...shareConfigData,
                    'success': function (rr) {
                        callback && callback({
                            err: false
                        });
                    },
                    'cancel': function (tt) {
                        callback && callback({
                            err: true,
                            msg: '取消了分享'
                        });
                    }
                }, 'shares': {
                    ...shareConfigData,
                    'success': function (rr) {
                        callback && callback({
                            err: false
                        });
                    },
                    'cancel': function (tt) {
                        callback && callback({
                            err: true,
                            msg: '取消了分享'
                        });
                    }
                }
            };

            window.wx.ready(() => {
                wx.onMenuShareAppMessage(share_config.share); // 微信好友
                wx.onMenuShareTimeline(share_config.shares); // 微信朋友圈
                wx.onMenuShareQQ(share_config.share); // QQ
            });


        });
    }


    /**
     * 打开分享
     * 
     * @parma setting 参数
     * @param callback 操作回调
     * 
     */
    open(setting, callback) {

        this.openWechatShareShadow(setting, callback);
    }

    /**
     * 微信公众号分享遮罩层
     * 
     * @param  callback 操作事件回调
     * 
     */
    openWechatShareShadow(setting, callback) {
        if (!instance) {
            //组件实例
            instance = new mainConstructor({
                data: {
                    ...setting
                }
            });
            //挂载
            instance.$mount();
            document.body.appendChild(instance.$el);
        }
        //显示
        instance.visible = true;
    }
}


export default function (option) {
    option = option || {}
    return new Share(option);
}