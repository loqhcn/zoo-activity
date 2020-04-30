import weixinMp from "mulo-tools/lib/WeixinMp";

export default {
    data() {
        return {
            weixinPayMixins_loading: false,
            //微信支付
            weixinPayMixins_orderInfo: false,
            weixinPayMixins_orderNumber: '',
            weixinPayMixins_payType:1,
            weixinPayMixins_activeId: 0,
        }
    },
    methods: {
        /**
         * 微信支付
         *
         * @param {function} callback 支付完成后回调
         */
        weixinPayMixins_callPay(order_number, active_id,callback) {
            this.weixinPayMixins_orderNumber = order_number;
            this.weixinPayMixins_activeId = active_id;

            this.weixinPayMixins_loading = true;
            this.$httpWithLoading
                .post("recharge/wxpay", { order_number: order_number, type: 1 })
                .then(res => {
                    if (res.code != 200) {
                        this.$toast(res.msg);
                        this.weixinPayMixins_loading = false;
                        return;
                    }
                    //触发支付
                    this.weixinPayMixins_orderInfo = res.data.payInfo;
                    this.weixinPayMixins_payType = res.data.payType
                    this.weixinPayMixins_callWeixinPay(callback);
                }).catch((err) => {
                    
                    this.weixinPayMixins_loading = false;
                })
        },
        //微信支付吊起
        weixinPayMixins_callWeixinPay(callback) {
            if (!weixinMp.isWeixin()) {
                this.$toast("当前不是微信环境");
                this.weixinPayMixins_loading = false;

            }
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener(
                        "WeixinJSBridgeReady",
                        this.weixinPayMixins_callWeixinPayDo,
                        false
                    );
                } else if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", this.weixinPayMixins_callWeixinPayDo);
                    document.attachEvent("onWeixinJSBridgeReady", this.weixinPayMixins_callWeixinPayDo);
                }
            } else {
                this.weixinPayMixins_callWeixinPayDo(callback);
            }
        },
        /**
         * 微信支付触发事件
         */
        weixinPayMixins_callWeixinPayDo(callback) {

            WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                this.weixinPayMixins_orderInfo,

                // {
                //   appId: "wx2421b1c4370ec43b", //公众号名称，由商户传入
                //   timeStamp: "1395712654", //时间戳，自1970年以来的秒数
                //   nonceStr: "e61463f8efa94090b1f366cccfbbb444", //随机串
                //   package: "prepay_id=u802345jgfjsdfgsdg888",
                //   signType: "MD5", //微信签名方式：
                //   paySign: "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
                // },
                res => {
                    this.weixinPayMixins_loading = false;
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        this.$toast("支付成功");
                        callback&&callback({
                            err:false,
                            data:{
                                orderNumber:this.weixinPayMixins_orderNumber,
                                payType:this.weixinPayMixins_payType
                            }
                        });
                        // this.appRoute.go("/member/appointment", {
                        //     order_number: this.weixinPayMixins_orderNumber,
                        //     active_id: this.weixinPayMixins_activeId,
                        // });
                        //
                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        this.$toast("您取消了支付");
                        // this.appRoute.go("/member/appointment", {
                        //     order_number: this.weixinPayMixins_orderNumber,
                        //     active_id: this.weixinPayMixins_activeId,
                        // });
                    } else {
                        this.$toast("支付调用失败");
                        // this.appRoute.go("/member/appointment", {
                        //     order_number: this.weixinPayMixins_orderNumber,
                        //     active_id: this.weixinPayMixins_activeId,
                        // });
                    }
                }
            );
        }
    },
};