//短信倒计时
export default {
    data() {
        return {
            //倒计时剩余时间
            countDownMixin_time: 0,
            countDownMixin_timeSet: 60,
            countDownMixin_doing: false,
            //累计发送次数
            countDownMixin_times: 0,
        }
    },
    methods: {
        //开始倒计时
        countDownMixin_begin() {
            this.countDownMixin_time = this.countDownMixin_timeSet;
            if (this.countDownMixin_doing) {
                clearInterval(this.countDownMixin_doing);
            }
            this.countDownMixin_beginDo();
        },
        //倒计时
        countDownMixin_beginDo() {
            this.countDownMixin_times++;
            this.countDownMixin_doing = setInterval(() => {
                this.countDownMixin_time -= 1;
                if (this.countDownMixin_time <= 1) {
                    this.countDownMixin_time = 0;
                    clearInterval(this.countDownMixin_doing);
                }
            }, 1000);
        },
        //发送验证码出错等 清除倒计时
        countDownMixin_fail() {
            this.countDownMixin_doing && clearInterval(this.countDownMixin_doing);
            this.countDownMixin_time = 0;
            this.countDownMixin_doing = false;
        }

    },
}