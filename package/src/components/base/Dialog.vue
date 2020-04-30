<template>
    <div class="dialog">
        <slot></slot>
    </div>
</template>
<style lang="scss" scoped>
.dialog {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>