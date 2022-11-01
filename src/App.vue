<template>
  <router-view />
</template>

<script setup></script>

<style lang="scss" scoped>
#app {
  font-family: "微软雅黑";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>

<style lang="scss">
.el-message {
  z-index: 99999 !important;
}

.font-warp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tooltipWarp {
  max-width: 300px;
}

.el-input-number .el-input__inner {
  text-align: left;
}

.el-dialog--center .el-dialog__footer {
  text-align: right !important;
}

.el-textarea__inner {
  min-height: 40px !important;
}

.el-dialog .el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
}

.el-pagination button:disabled {
  color: #c0c4cc;
  background-color: transparent;
  cursor: not-allowed;
}

.el-pagination .btn-next,
.el-pagination .btn-prev {
  background: center center no-repeat transparent;
}

.el-pager li {
  background: transparent;
}

img {
  object-fit: cover;
}

.el-dialog {
  border-radius: 10px !important;
}

.el-dialog__header {
  margin-right: 0 !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: $base-color-main;
}

.el-dialog__title {
  color: #fff !important;
  font-weight: bold;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #fff !important;
  font-size: inherit;
}

.el-dialog__headerbtn {
  font-size: 18px;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}

.el-dialog__headerbtn .el-dialog__close:hover {
  color: #000;
}

[class*=" el-icon-"],
[class^="el-icon-"] {
  font-weight: bolder;
}

.el-dialog__body {
  text-align: left;
}

.el-button + .el-button {
  margin-left: 20px !important;
}

.el-drawer__header {
  text-align: left;
}

.el-drawer__header > :first-child {
  flex: 1;
  outline: 0;
}

.el-drawer {
  overflow: scroll;
}
</style>
