<template>
  <div class="zoo-radio" @click="tocheck">
    <span class="circle" :class="{active:checked==value}"></span>
    <span>
      <slot>{{value}}</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: "zoo-radio",
  data() {
    return {};
  },

  model: {
    prop: "checked",
    event: "change"
  },
  props: {
    value: {
      default: 0
    },
    checked: {
      default: false
    }
  },
  created() {},
  methods: {
    tocheck() {
      this.$emit("change", this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.zoo-radio {
  width: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
}
.circle {
  width: 0.5rem;
  height: 0.5rem;
  max-width: .5rem;
  border-radius: 50%;
  max-height: .5rem;
  border: 0.05rem solid rgba(90, 54, 68, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  &.active {
    border: 0.05rem solid rgba(51, 51, 51, 1);
    &::before {
      display: table;
      content: "";
      width: 0.3rem;
      height: 0.3rem;
      background-color: #ffb819;
      border-radius: 50%;
    }
  }
}

</style>