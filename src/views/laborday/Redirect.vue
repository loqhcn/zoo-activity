<template>
  <div></div>
</template>

<script>
export default {
  created() {
    let match = this.$route.fullPath.match(/restId=([0-9]+)/);
    let restId = match ? match[1] : 0;
    this.$router.replace({
      path: "/laborday.html?restId=" + restId
    });
  }
};
</script>

<style lang="scss" scoped>
</style>