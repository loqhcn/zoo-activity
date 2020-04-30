<template>
  <transition name="fade" @after-leave="handleAfterLeave">
    <div v-if="visible" class="mulo-toast flex center center-line">{{ msg }}</div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      msg: "msg",
      duration: 1500,
      visible: false
    };
  },
  methods: {
    //显示完成后移除组件
    handleAfterLeave() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    //关闭
    close() {
      this.visible = false;
    },
    show() {
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
      }, this.duration);
    }
  }
};
</script>

<style lang="scss" scoped>
.mulo-toast {
  color: white;
  font-size: 16px;
  padding: 2px 5px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);

  width: 12rem;
  height: 2.17rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0rem;
  font-size: 0.75rem;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 1rem;

  z-index: 1001;
}
</style>