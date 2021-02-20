// import * as Vue from 'vue';
// import ReportsPage from '../../components/ReportsPage.vue';

// const app = Vue.createApp(ReportsPage);
//
// app.mount('#vue-root');

import format from 'date-fns/format';
import Chart from 'chart.js';

import 'purecss/build/pure-min.css';
import '../../main.css';

const data = window.__articlesData;

const ctx = document.getElementById('chart').getContext('2d');

const byMonth = new Map();

data.forEach(article => {
  const dateAdded = new Date(article.time_added * 1000);
  const monthAddedFormatted = format(dateAdded, 'yyyy-MM');

  if (byMonth.has(monthAddedFormatted)) {
    byMonth.get(monthAddedFormatted).add(article);
  } else {
    const articlesSet = new Set([article]);
    byMonth.set(monthAddedFormatted, articlesSet);
  }
});

const countByMonth = [];

for(let [month, articles] of byMonth.entries()) {
  countByMonth.push({month, count: articles.size});
}

countByMonth.sort((first, second ) => first.month > second.month ? 1 : -1);

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: countByMonth.map(item => item.month),
    datasets: [{
      backgroundColor: 'rgb(54, 162, 235)',
      label: 'Unread articles',
      data: countByMonth.map(item => item.count),
    }]
  },
});
