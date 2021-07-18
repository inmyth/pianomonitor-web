<template>
  <div class="container">
    <PageHeader :title="title" :items="items" />
    <div class="card">
      <div class="card-body">
        <h4 class="header-title mb-4">Line Chart</h4>
        <LineChart :height="350" :chart-data="data" :options="options" />
      </div>
    </div>
  </div>
</template>
<script>
import LineChart from "./LineChart";
export default {
  head() {
    return {
      title: `${this.title} | Minton - Nuxtjs Responsive Admin Dashboard Template`
    };
  },
  components: {
    LineChart
  },
  data() {
    return {
      title: "Graph",
      items: [
        {
          text: "Minton",
          href: "/"
        },
        {
          text: "Charts",
          href: "/"
        }
      ],
      data: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: []
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      if (this.data.datasets[0].data.length < 15) {
        let d = [...this.data.datasets[0].data];
        d.push(this.getRandomInt());
        this.data = {
          labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          datasets: [
            {
              label: "Data One",
              backgroundColor: "#f87979",
              data: d
            }
          ]
        };
      } else {
        let d = [...this.data.datasets[0].data];
        d.shift();
        d.push(this.getRandomInt());
        this.data = {
          labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          datasets: [
            {
              label: "Data One",
              backgroundColor: "#f87979",
              data: d
            }
          ]
        };
      }
      setTimeout(this.fillData, 1000);
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    }
  },
  middleware: "router-auth"
};
</script>
