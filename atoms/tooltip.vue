<template>
  <div class="tooltip__container">
    <slot name="title"></slot>
    <div class="tooltip__content">
      <slot name="tooltip"></slot>
    </div>
  </div>
</template>

<style scoped>
.tooltip__container {
  position: relative;
  cursor: default;
}
.tooltip__container:hover .tooltip__content {
  display: block;
}
.tooltip__content {
  display: none;
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
}
</style>
