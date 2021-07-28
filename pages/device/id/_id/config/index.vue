<template>
  <div class="container">
    <PageHeader :title="title" :items="items" />
    <content-placeholders v-if="!device.id">
      <content-placeholders-text :lines="4" />
    </content-placeholders>
    <div class="card" v-else>
      <div class="card-body">
        <div class="media mb-3">
          <div class="media-body">
            <p class="mb-1">デバイス名</p>
            <h5 class="mt-0">
              {{ device.name }}
            </h5>
          </div>
        </div>
        <div class="media mb-3">
          <div class="media-body">
            <p class="mb-1">デバイスID</p>
            <h5 class="mt-0">
              {{ device.id }}
            </h5>
          </div>
        </div>
        <div class="media mb-3">
          <div class="media-body">
            <p class="mb-1">トピック</p>
            <h5 class="mt-0">
              <code>{{ device.topic }}</code>
            </h5>
          </div>
        </div>
        <div class="media mb-3">
          <div class="media-body">
            <p class="mb-1">証明書</p>
            <div class="mt-0">
              <p>
                <a href="javascript:void(0);" @click="dowloadCert"> デバイスの証明書<i class="mdi mdi-download"></i></a>
              </p>
              <p>
                <a href="https://www.amazontrust.com/repository/AmazonRootCA1.pem" target="_blank" download>Root CA (RSA 2048)<i class="mdi mdi-file"></i></a>,

                <a href="https://www.amazontrust.com/repository/AmazonRootCA3.pem" target="_blank">Root CA (ECC 256) <i class="mdi mdi-file"></i></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const FileSaver = require("file-saver");

export default {
  async mounted() {
    let x = await this.$store.dispatch("service/getDevice", { deviceId: this.$route.params.id });
    this.device.name = x.deviceName;
    this.device.id = x.deviceId;
    this.device.topic = x.topic;
    this.device.pem = x.pem;
  },
  head() {
    return {
      title: `${this.title}`
    };
  },
  data() {
    return {
      title: "デバイス",
      items: [
        {
          text: "ダッシュボード",
          href: "/"
        },
        {
          text: "デバイス",
          href: "/"
        }
      ],
      device: {
        name: null,
        id: null,
        topic: null,
        pem: null
      }
    };
  },
  methods: {
    dowloadCert() {
      var blob = new Blob([this.device.pem], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${this.device.name}.pem.crt`);
    }
  },
  middleware: "router-auth"
};
</script>
