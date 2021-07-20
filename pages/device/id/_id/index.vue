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
  mounted() {},
  async created() {
    window.addEventListener("beforeunload", this.beforeWindowUnload);
    // window.onbeforeunload = function(e) {
    //   console.log("9888");
    //   return undefined;
    // };
    await this.$store.dispatch("iot/connect", { deviceId: this.$route.params.id });
    // const deviceIot = awsIot.device({
    //   region: "us-west-2",
    //   clientId: "b2f187c3-c806-4c08-afc0-2f00070c0fe8",
    //   accessKeyId: creds.accessKey,
    //   secretKey: creds.secretKey,
    //   sessionToken: creds.sessionToken,
    //   protocol: "wss",
    //   port: 443,
    //   host: "azyj6m3vu5398-ats.iot.us-west-2.amazonaws.com"
    // });
    // deviceIot.subscribe("b2f187c3-c806-4c08-afc0-2f00070c0fe8", undefined, function(err, granted) {
    //   if (err) {
    //     console.log("subscribe error: " + err);
    //   } else {
    //     console.log("subscribe success");
    //   }
    // });

    // deviceIot.on("message", function(_topic, payload) {
    //   console.log("> " + payload.toString());
    // });
  },
  beforeRouteLeave(to, from, next) {
    console.log("asdasdas");
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
    },
    beforeWindowUnload(e) {
      console.log("babababa");
      // if (this.confirmStayInDirtyForm()) {
      //   // Cancel the event
      //   e.preventDefault();
      //   // Chrome requires returnValue to be set
      //   e.returnValue = "";
      // }
      e.returnValue = undefined;
      return undefined;
    }
  },
  middleware: "router-auth"
};
</script>
