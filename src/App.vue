<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style>
.toolbar{
  padding: 10px;
  background: #f4f4f5;
  border-left:3px solid #409EFF;
}
.el-card__body{
  padding: 10px;
}
.el-card{
  margin-bottom: 5px; 
}
</style>

