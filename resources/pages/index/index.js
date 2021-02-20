import moment from 'moment';
import Chart from 'chart.js';

import 'purecss/build/pure-min.css';
import '../../main.css';

const articles = window.__articlesData;

const ctx = document.getElementById('chart').getContext('2d');

const byMonth = new Map();

articles.forEach((article) => {
  const dateAddedStartOfMonth = moment(article.time_added * 1000)
    .startOf('month')
    .valueOf();

  if (byMonth.has(dateAddedStartOfMonth)) {
    byMonth.get(dateAddedStartOfMonth).add(article);
  } else {
    const articlesSet = new Set([article]);
    byMonth.set(dateAddedStartOfMonth, articlesSet);
  }
});

const countByMonth = [];

for (let [month, articles] of byMonth.entries()) {
  countByMonth.push({ month, count: articles.size });
}

countByMonth.sort((first, second) => (first.month > second.month ? 1 : -1));

const chartData = countByMonth.map((item) => ({
  x: new Date(item.month),
  y: item.count,
}));

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    datasets: [
      {
        backgroundColor: 'rgb(54, 162, 235)',
        label: 'Unread articles',
        data: chartData,
      },
    ],
  },
  options: {
    scales: {
      xAxes: [
        {
          type: 'time',
          offset: true,
          time: {
            unit: 'month',
            tooltipFormat: 'MMM YYYY',
          },
        },
      ],
    },
  },
});
