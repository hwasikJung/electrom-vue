import { createApp } from 'vue';
import App from './App.vue';
import VueECharts from 'vue-echarts';
import 'echarts'; // 전체 패키지 가져오기

// Font Awesome 설정
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faWindowMinimize,
  faWindowMaximize,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons';

// 사용할 아이콘 추가
library.add(faWindowMinimize, faWindowMaximize, faWindowClose);

// Vue 앱 생성 및 설정
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('v-chart', VueECharts);

app.mount('#app');
