<template>
  <div class="app-container">
    <div class="title-bar">
      <div class="title prevent-select draggable">부서별 매출 차트</div>
    </div>
    <div class="app-content">
      <chart-component></chart-component>
      <chart-component></chart-component>
    </div>
  </div>
</template>

<script setup>
import ChartComponent from '/src/components/charts/ChartComponent.vue';
</script>

<style scoped>
.app-container {
  height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.title-bar {
  background: #000000;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  color: #ffffff;
  font-size: 15px;
  flex-shrink: 0;
}

.title {
  height: auto;
  padding: 10px;
  display: inline-block;
}

.app-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.prevent-select {
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}

.draggable {
  -webkit-app-region: drag;
}
</style>
