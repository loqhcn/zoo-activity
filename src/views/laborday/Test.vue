<template>
  <div>
    <h1>51 活动 测试</h1>

    <button @click="clear">清除缓存</button>


    <br>

    <a href="/coupon2051?restId=962">前往 restId=962</a>
  

  </div>
</template>

<script>
export default {
  methods: {
    clear() {
      localStorage.clear();
      this.$toast("success");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>