<template>
  <div class="container">
    <PageHeader :title="title" :items="items" />
    <div class="card">
      <div class="card-body">
        <h4 class="header-title mb-4">温度</h4>
        <LineChart :height="350" :chart-data="chartData.temperature" :options="options.temperature" />
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <h4 class="header-title mb-4">気圧</h4>
        <LineChart :height="350" :chart-data="chartData.pressure" :options="options.pressure" />
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h4 class="header-title mb-4">湿度</h4>
        <LineChart :height="350" :chart-data="chartData.humidity" :options="options.humidity" />
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
  // async created() {
  //   window.addEventListener("beforeunload", this.beforeWindowUnload);
  // },
  beforeRouteLeave(to, from, next) {
    this.disconnectClient();
    next();
  },
  // beforeDestroy() {
  //   window.removeEventListener("beforeunload", this.beforeWindowUnload);
  // },
  data() {
    return {
      title: "",
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
      chartData: {
        temperature: {
          labels: [],
          datasets: [
            {
              label: "Temperature",
              backgroundColor: "#f87979",
              data: []
            }
          ]
        },
        pressure: {
          labels: [],
          datasets: [
            {
              label: "Pressure",
              backgroundColor: "#f87979",
              data: []
            }
          ]
        },
        humidity: {
          labels: [],
          datasets: [
            {
              label: "Humidity",
              backgroundColor: "#f87979",
              data: []
            }
          ]
        },
        maxLength: 3600
        // currentStepsIndex: 0
      },
      options: {
        temperature: {
          type: "line",
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            xAxes: [
              {
                reverse: true,
                gridLines: {
                  color: "rgba(0,0,0,0.05)"
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  stepSize: 20
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "C゜"
                },
                borderDash: [5, 5],
                gridLines: {
                  color: "rgba(0,0,0,0)",
                  fontColor: "#fff"
                }
              }
            ]
          }
        },
        pressure: {
          type: "line",
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            xAxes: [
              {
                reverse: true,
                gridLines: {
                  color: "rgba(0,0,0,0.05)"
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  stepSize: 20
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Pascal"
                },
                borderDash: [5, 5],
                gridLines: {
                  color: "rgba(0,0,0,0)",
                  fontColor: "#fff"
                }
              }
            ]
          }
        },
        humidity: {
          type: "line",
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            xAxes: [
              {
                reverse: true,
                gridLines: {
                  color: "rgba(0,0,0,0.05)"
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  stepSize: 20
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "%"
                },
                borderDash: [5, 5],
                gridLines: {
                  color: "rgba(0,0,0,0)",
                  fontColor: "#fff"
                }
              }
            ]
          }
        }
      }
    };
  },
  methods: {
    callback(v) {
      // console.log(v);

      let deviceName = "";
      let date = new Date();
      let temperature = 0;
      let pressure = 0;
      let humidity = 0;
      for (const a of v) {
        if (a.name == "datetime") {
          date = new Date(a.value);
        }
        if (a.name == "temperature") {
          temperature = a.value;
        }
        if (a.name == "pressure") {
          pressure = a.value;
        }
        if (a.name == "humidity") {
          humidity = a.value;
        }
        if (a.name == "device") {
          deviceName = a.value;
        }
      }

      this.title = deviceName;

      let dTemperature = [...this.chartData.temperature.datasets[0].data];
      let dPressure = [...this.chartData.pressure.datasets[0].data];
      let dHumidity = [...this.chartData.humidity.datasets[0].data];

      let xlabel = [];
      const steps = this.chartData.steps;
      const currentStepsIndex = this.chartData.currentStepsIndex;

      // cp labels from previous labels
      if (currentDataLength == 0) {
        xlabel.push(date);
      } else {
        xlabel = [...this.chartData.temperature.labels];
        xlabel = xlabel.slice(0, dTemperature.length);
        // console.log(dTemperature.length);
        let newLabelItem =
          date.getMinutes() == 0
            ? `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            : date.getSeconds() % 30 == 0
            ? `${date.getHours()}:${date.getMinutes()}:${date.getUTCSeconds()}`
            : date.getSeconds() % 5 == 0
            ? date.getSeconds()
            : "";
        xlabel.push(newLabelItem);
      }

      dTemperature.push(temperature);
      dPressure.push(pressure);
      dHumidity.push(humidity);

      let currentDataLength = dTemperature.length;

      if (currentDataLength > this.chartData.maxLength) {
        dTemperature.shift();
        dPressure.shift();
        dHumidity.shift();
        xlabel.shift();
      }

      this.chartData.temperature = {
        labels: xlabel,
        datasets: [
          {
            label: "温度",
            data: dTemperature,
            fill: true,
            backgroundColor: "transparent",
            borderColor: "#f672a7"
          }
        ]
      };

      this.chartData.pressure = {
        labels: xlabel,
        datasets: [
          {
            label: "気圧",
            data: dPressure,
            fill: true,
            backgroundColor: "transparent",
            borderColor: "#f672a7"
          }
        ]
      };

      this.chartData.humidity = {
        labels: xlabel,
        datasets: [
          {
            label: "湿度",
            data: dHumidity,
            fill: true,
            backgroundColor: "transparent",
            borderColor: "#f672a7"
          }
        ]
      };

      // this.chartData.source.xlabel = xlabel;
      // this.chartData.temperature.data.labels = xlabel;
      // this.chartData.source.temperature = dTemperature;
      // this.chartData.temperature.data.datasets.data = dTemperature;
      // this.chartData.temperature.data.labels = xlabel;

      // if (this.data.datasets[0].data.length < 600) {
      //   let d = [...this.data.datasets[0].data];
      //   d.push(v);
      //   this.data = {
      //     labels: Array(600)
      //       .fill()
      //       .map((_, i) => i + 1),
      //     datasets: [
      //       {
      //         label: "温度",
      //         backgroundColor: "#f87979",
      //         data: d
      //       }
      //     ]
      //   };
      // } else {
      //   let d = [...this.data.datasets[0].data];
      //   d.shift();
      //   d.push(v);
      //   this.data = {
      //     labels: Array(600)
      //       .fill()
      //       .map((_, i) => i + 1),
      //     datasets: [
      //       {
      //         label: "Data One",
      //         backgroundColor: "#f87979",
      //         data: d
      //       }
      //     ]
      //   };
      // }
    },
    // beforeWindowUnload(e) {
    //   this.disconnectClient();
    //   e.returnValue = undefined;
    //   return undefined;
    // },
    disconnectClient() {
      this.$store.dispatch("iot/disconnect");
    }
  },
  middleware: "router-auth"
};
</script>
