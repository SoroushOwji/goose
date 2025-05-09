<template>
  <div class="tooltip-container">
    <slot name="title"></slot>
    <div class="tooltip">
      <slot name="tooltip"></slot>
    </div>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: relative;
  cursor: default;
}
.tooltip-container:hover .tooltip {
  display: block;
}
.tooltip {
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
