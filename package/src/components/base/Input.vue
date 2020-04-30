<template>
  <input
    :value="value"
    :type="type"
    @blur="onBlur"
    @input="input"
    @compositionstart="compositionstart"
    @compositionend="compositionend"
  />
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },
  name: "zoo-input",
  props: {
    type: {
      type: String,
      default: "text"
    },
    maxlength: {
      default: 0
    },
    value: {
      default: ""
    }
  },
  data() {
    return {
      composition: false
    };
  },
  methods: {
    input(e) {
      let value = e.target.value;

      let maxlength = parseInt(this.maxlength) || 0;
      //拼音输入中
      if (this.composition) {
        return;
      }
      if (maxlength) {
        value = value.substr(0, maxlength);
        e.target.value = value;
      }
      this.$emit("change", value);
    },
    onBlur() {
      setTimeout(function() {
        var scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    },
    //input 拼音输入bug处理
    compositionstart(e) {
      this.composition = true;
    },
    compositionend(e) {
      this.composition = false;
      this.input(e);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>