<template>
  <div class="container">
    <div class="title-bar">
      <div class="title prevent-select draggable">부서별 매출 차트</div>
      <div class="control prevent-select">
        <button id="min" @click="minimize">
          <font-awesome-icon icon="window-minimize" />
        </button>
        <button id="max" @click="maximize">
          <font-awesome-icon icon="window-maximize" />
        </button>
        <button id="close" @click="close">
          <font-awesome-icon icon="window-close" />
        </button>
      </div>
    </div>
    <div class="content">
      <div class="chart-container">
        <div v-if="loading" class="loading">데이터 로딩 중...</div>
        <v-chart v-else class="chart" :option="option" />
      </div>
      <div class="controls">
        <button @click="loadData" class="refresh-btn">데이터 새로고침</button>
        <button @click="insertData" class="insert-btn">
          테스트 데이터 생성
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

// ECharts 컴포넌트 등록
use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent
]);

const loading = ref(true);
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
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '2023년',
      type: 'bar',
      data: []
    },
    {
      name: '2024년',
      type: 'bar',
      data: []
    }
  ]
});

// 창 컨트롤 함수
const minimize = () => {
  window.electronAPI.minimize();
};

const maximize = () => {
  window.electronAPI.maximize();
};

const close = () => {
  window.electronAPI.close();
};

// 데이터 로드 함수
const loadData = async () => {
  loading.value = true;
  try {
    const data = await window.electronAPI.getSalesData();

    if (data.length > 0) {
      // 데이터 가공
      const departments = [...new Set(data.map((item) => item.department))];
      const years = [...new Set(data.map((item) => item.year))].sort();

      // 각 연도별 데이터 추출
      const seriesData = years.map((year) => {
        return {
          name: `${year}년`,
          type: 'bar',
          data: departments.map((dept) => {
            const item = data.find(
              (d) => d.department === dept && d.year === year
            );
            return item ? item.amount : 0;
          })
        };
      });

      // 차트 업데이트
      option.value = {
        ...option.value,
        legend: {
          data: years.map((year) => `${year}년`)
        },
        xAxis: {
          ...option.value.xAxis,
          data: departments
        },
        series: seriesData
      };
    }
  } catch (error) {
    console.error('데이터 로드 오류:', error);
  } finally {
    loading.value = false;
  }
};

// 테스트 데이터 생성 함수
const insertData = async () => {
  const success = await window.electronAPI.insertTestData();
  if (success) {
    await loadData();
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await loadData();
});
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
  position: relative;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
}

.chart {
  width: 100%;
  height: 100%;
}

.container {
  height: 100vh;
  padding: 0;
  display: grid;
  grid-template-rows: auto 1fr;
}

.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.controls {
  display: flex;
  gap: 10px;
}

.refresh-btn,
.insert-btn {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.insert-btn {
  background-color: #2196f3;
}

.refresh-btn:hover,
.insert-btn:hover {
  opacity: 0.8;
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
