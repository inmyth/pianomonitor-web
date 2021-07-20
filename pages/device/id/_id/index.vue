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
      title: `${this.title}`
    };
  },
  components: {
    LineChart
  },
  mounted() {
    this.$store.dispatch("iot/connect", { deviceId: this.$route.params.id, callback: this.callback });
  },
  async created() {
    window.addEventListener("beforeunload", this.beforeWindowUnload);
  },
  beforeRouteLeave(to, from, next) {
    this.disconnectClient();
    next();
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
  },
  data() {
    return {
      title: "Graph",
      items: [
        {
          text: "ダッシュボード",
          href: "/"
        },
        {
          text: "図",
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
  methods: {
    callback(v) {
      if (this.data.datasets[0].data.length < 600) {
        let d = [...this.data.datasets[0].data];
        d.push(v);
        this.data = {
          labels: Array(600)
            .fill()
            .map((_, i) => i + 1),
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
        d.push(v);
        this.data = {
          labels: Array(600)
            .fill()
            .map((_, i) => i + 1),
          datasets: [
            {
              label: "Data One",
              backgroundColor: "#f87979",
              data: d
            }
          ]
        };
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    beforeWindowUnload(e) {
      this.disconnectClient();
      e.returnValue = undefined;
      return undefined;
    },
    disconnectClient() {
      this.$store.dispatch("iot/disconnect");
    }
  },
  middleware: "router-auth"
};
</script>
