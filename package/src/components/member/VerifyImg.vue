<template>
  <!-- 图片验证码 -->
  <div v-if="visible" class="shadow">
    <div class="login imgcode">
      <div class="inputs">
        <div class="input-row">
          <input v-model="code" type="text" class="input" placeholder="请输入图形码" />
          <div class="code">
            <div id="v_container" style="width: 3.5rem;height: 0.93rem;transform: scale(1.5);"></div>
          </div>
        </div>
      </div>
      <div class="btns flex space-between">
        <button @click="cancel" class="btn btn-border">取消</button>
        <button @click="toValidate" class="btn">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import GVerify from "./../../utils/GVerify";

export default {
  name: "verify-img",
  data() {
    return {
      code: "",
      verifyCode: false,
      visible: false
    };
  },
  created() {},
  methods: {
    toValidate() {
      var res = this.verifyCode.validate( this.code );
      if (res) {
        this.visible=false;
        this.$emit('success')
      } else {
        alert("验证码错误");
      }
    },
    cancel(){
        this.visible = false;
    },
    show() {
      console.log(GVerify);
      this.visible = true;
      this.$nextTick(() => {
        this.verifyCode = new GVerify("v_container");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>