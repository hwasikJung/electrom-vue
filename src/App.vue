<template>
  <div class="container">
    <div class="title-bar">
      <div class="title prevent-select draggable">Custom Title Bar</div>
      <div class="control prevent-select">
        <button id="min">
          <font-awesome-icon icon="window-minimize" />
        </button>
        <button id="max">
          <font-awesome-icon icon="window-maximize" />
        </button>
        <button id="close">
          <font-awesome-icon icon="window-close" />
        </button>
      </div>
    </div>
    <div>
      <div class="chart-container">
        <v-chart class="chart" :option="option" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const option = ref({
  title: {
    text: '부서별 매출 실적'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['2023년', '2024년']
  },
  xAxis: {
    type: 'category',
    data: ['영업부', '마케팅부', '개발부', '인사부', '재무부']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '2023년',
      type: 'bar',
      data: [120, 132, 101, 134, 90]
    },
    {
      name: '2024년',
      type: 'bar',
      data: [220, 182, 191, 234, 290]
    }
  ]
});

// Electron 관련 코드는 필요시 추가
</script>

<style scoped>
body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  margin: 0px;
}

body * {
  box-sizing: border-box;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}

.container {
  height: 100%;
  padding: 0;
  display: grid;
  grid-template-rows: auto 1fr;
}

.title {
  height: auto;
  padding: 10px;
  display: inline-block;
}

.control {
  float: right;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 5px;
  margin-right: 5px;
  width: 100px;
}

.control button {
  padding: 5px;
  background: #000000;
  color: #ffffff;
  outline: 0;
  border: 0;
}

.control button:hover {
  background: #444444;
}

.title-bar {
  background: #000000;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  color: #ffffff;
  font-size: 15px;
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
