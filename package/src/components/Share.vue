<template>
  <div @click="click" v-if="visible" class="share-shadow shadow">
    <div class="sharebox">
      <div class="text">{{text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      callback: false,
      text: "点击右上角图标在浏览器里打开"
    };
  },
  methods: {
    click() {
      this.visible = false;
      this.callback &&
        this.callback({
          errno: 1,
          msg: "关闭分享弹出层"
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.share-shadow {
  background: rgba(0, 0, 0, 0.8);
}
.sharebox {
  width: 15.25rem;
  height: 10.28rem;
  position: absolute;
  top: 0.18rem;
  left: 2.05rem;
  background-image: url(./../assets/img/share.png);
  background-size: 100% 100%;

  .text {
    font-size: 0.8rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0.92rem;
    position: absolute;
    top: 8.5rem;
    left: 1.5rem;
    line-height: 1;
    text-align: center;
  }
}
</style>