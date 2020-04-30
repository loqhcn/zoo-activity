<template>
  <!--  -->
  <div>
    <div v-if="visible" class="shadow">
      <div class="login">
        <div class="title">手机号登录</div>
        <div class="inputs">
          <div class="input-row">
            <zoo-input
              v-model="mobile"
              type="number"
              class="input"
              placeholder="请输入手机号"
              maxlength="11"
            />
          </div>
          <div class="input-row">
            <zoo-input
              v-model="code"
              type="number"
              class="input code-input"
              placeholder="请输入验证码"
              maxlength="6"
            />
            <div @click="getCode" v-if="!countDownMixin_time" class="code">获取验证码</div>
            <div v-if="countDownMixin_time" class="code disable">{{countDownMixin_time}}s 后重新获取</div>
          </div>
        </div>
        <div class="btns flex space-between">
          <button @click="cancel" class="btn btn-border">取消</button>
          <button @click="login" class="btn">登录</button>
        </div>
      </div>
    </div>

    <!-- 图片验证码弹出层 -->
    <verify-img ref="vi" @success="imgChecked"></verify-img>
  </div>
</template>

<script>
import countDownMixin from "./../../mixins/countDownMixin";
import Input from "./../base/Input";
// import Validate from "./../../utils/Validate";
import Validate from "zoo-common/src/validate/Validate.js";
import VerifyImg from "./VerifyImg";

let htmltop = 0;

export default {
  mixins: [countDownMixin],
  components: {
    [Input.name]: Input,
    [VerifyImg.name]: VerifyImg
  },
  watch: {
    countDownMixin_times(newValue) {
      localStorage.countDownMixin_times = newValue;
    },
    visible(newValue, oldValue) {
      this.$popup.updateLockStatus(newValue, "login");
    }
  },
  data() {
    return {
      mobile: "",
      code: "",
      visible: false,
      //# 外部传入的参数

      //获取验证码
      getCodeCall: false,

      //登录
      doLoginCall: false,
      cancelLoginCall: false,

      //操作锁
      sendLock: false,
      loginLock: false,
      imgCodeChecked: false
    };
  },
  created() {},
  methods: {
    imgChecked() {
      this.imgCodeChecked = true;
      this.getCode();
    },
    //获取验证码
    getCode() {
      if (!this.imgCodeChecked) {
        if (this.checkShouldImgCode()) {
          this.$refs.vi.show(); // = true;
          return;
        }
      }

      if (!this.mobile) {
        this.$toast("请输入手机号");
        return;
      }
      if (!/^1[0-9]{10}$/.test(this.mobile)) {
        this.$toast("请输入正确的手机号");
        return;
      }
      if (this.sendLock) {
        console.log("快速点击拦截");
        return;
      }

      if (this.getCodeCall) {
        this.sendLock = true;
        //倒计时
        this.countDownMixin_begin();

        this.getCodeCall(
          this.mobile,
          //成功
          () => {
            this.sendLock = false;
          },
          //失败
          () => {
            this.countDownMixin_fail();
            this.sendLock = false;
          }
        );
      } else {
        console.log("getCode 未实现");
      }
    },
    checkShouldImgCode() {
      // return true;
      return this.countDownMixin_times >= 3;
    },
    cancel() {
      this.visible = false;
      this.cancelLoginCall && this.cancelLoginCall();
    },
    show() {
      this.visible = true;
    },
    login() {
      var validate = new Validate({
        "mobile|手机号": "require|mobile",
        "code|验证码": "require|min:4|max:4|integer"
      });
      if (!validate.check(this, true)) {
        console.log(this.code);
        this.$toast(validate.getError());
        return;
      }

      //操作锁
      if (this.loginLock) {
        console.log("快速点击拦截");
        return;
      }

      //登录
      if (this.doLoginCall) {
        this.loginLock = true;
        this.doLoginCall(
          {
            mobile: this.mobile,
            code: this.code
          },
          //登录成功
          () => {
            this.visible = false;
            this.loginLock = false;
          },
          //失败
          () => {
            this.loginLock = false;
          }
        );
      } else {
        console.log("login 未实现");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.code-input{
  padding-right: 5rem;;
}
</style>