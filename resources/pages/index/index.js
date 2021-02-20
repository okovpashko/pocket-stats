import moment from 'moment';
import Chart from 'chart.js';

import 'purecss/build/pure-min.css';
import '../../main.css';

const articles = window.__articlesData;

const ctx = document.getElementById('chart').getContext('2d');

const byMonth = new Map();

articles.forEach((article) => {
  const monthAdded = moment(article.time_added * 1000)
    .startOf('month')
    .format('MMM YYYY');

  if (byMonth.has(monthAdded)) {
    byMonth.get(monthAdded).add(article);
  } else {
    const articlesSet = new Set([article]);
    byMonth.set(monthAdded, articlesSet);
  }
});

const countByMonth = [];

for (let [month, articles] of byMonth.entries()) {
  countByMonth.push({ month, count: articles.size });
}

countByMonth.sort((first, second) => (first.month > second.month ? 1 : -1));

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: countByMonth.map((item) => item.month),
    datasets: [
      {
        backgroundColor: 'rgb(54, 162, 235)',
        label: 'Unread articles',
        data: countByMonth.map((item) => item.count),
      },
    ],
  },
});
