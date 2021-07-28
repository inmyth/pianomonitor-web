<script>
import { required, maxLength } from "vuelidate/lib/validators";
// import { FileSaver } from "file-saver";
const FileSaver = require("file-saver");

export default {
  head() {
    return {
      title: `${this.title}`
    };
  },
  data() {
    return {
      title: "新デバイスを登録",
      items: [
        {
          text: "デバイス",
          href: "/"
        },
        {
          text: "新デバイスを登録",
          active: true
        }
      ],

      form: {
        name: ""
      },

      submit: false,
      submitted: false,
      secondPage: {
        isPrivateKeyDowloaded: false,
        isPublicKeyDownloaded: false,
        publicKey: "",
        privateKey: "",
        cert: "",
        topic: ""
      },
      isProcessing: false,
      isFirstPage: true
    };
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(20)
      }
    }
  },

  methods: {
    async handleSubmit(e) {
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.isProcessing = true;
        let res = await this.$store.dispatch("service/createDevice", { name: this.form.name });
        this.isProcessing = false;
        if (res) {
          this.isFirstPage = false;
          this.secondPage.privateKey = res.privateKey;
          this.secondPage.publicKey = res.publicKey;
          this.secondPage.cert = res.certificatePem;
          this.secondPage.topic = res.topic;
        }
      }
    },
    downloadPrivateKey() {
      var blob = new Blob([this.secondPage.privateKey], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${this.form.name}-private.pem.key`);
      this.secondPage.isPrivateKeyDowloaded = true;
    },
    downloadPublicKey() {
      var blob = new Blob([this.secondPage.publicKey], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${this.form.name}-public.pem.key`);
      this.secondPage.isPublicKeyDownloaded = true;
    },
    dowloadCert() {
      var blob = new Blob([this.secondPage.cert], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${this.form.name}.pem.crt`);
    }
  },
  middleware: "router-auth"
};
</script>

<template>
  <div class="container">
    <PageHeader :title="title" :items="items" />
    <div class="card">
      <b-card-body v-if="isFirstPage">
        <p class="text-muted font-14 m-b-20"></p>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">
              デバイス名
            </label>
            <b-form-input autocomplete="off" id="name" v-model="form.name" name="name" class="form-control" :class="{ 'is-invalid': submitted && $v.form.name.$error }" type="text" placeholder="" />
            <div v-if="submitted && $v.form.name.$error" class="invalid-feedback">
              <span v-if="!$v.form.name.required">デバイス名を入力してください。</span>
              <span v-if="!$v.form.name.maxlength">２０文字以下にしてください。</span>
            </div>
          </div>

          <div class="form-group text-right m-b-0">
            <b-button variant="primary" type="submit" :disabled="isProcessing">
              発信
              <b-spinner v-if="isProcessing" small></b-spinner>
              <span v-if="isProcessing" class="sr-only">Loading...</span>
            </b-button>
          </div>
        </form>
      </b-card-body>
      <b-card-body v-else>
        <b-card-title>
          <h5 class="card-title">デバイスの登録ができました。デバイス用証明書とキーをダウンロードしてください。</h5>
        </b-card-title>
        <p>注意：キーをダウンロードする機会は今のみです。</p>
        <p>
          <b-button variant="primary" @click="downloadPrivateKey">プライベートキー <i v-if="secondPage.isPrivateKeyDowloaded" class="mdi mdi-check-bold"></i></b-button>
        </p>
        <p>
          <b-button variant="primary" @click="downloadPublicKey">パブリックキー <i v-if="secondPage.isPublicKeyDownloaded" class="mdi mdi-check-bold"></i></b-button>
        </p>
        <p>
          <b-button variant="primary" @click="dowloadCert">デバイスの証明書</b-button>
        </p>
        <p>ルート証明書はAWSが提供します。</p>
        <p>場合によって、以下のリンクを右クリックし、[Save link as... (名前を付けてリンク先を保存)] を選択して、これらの証明書をファイルとして保存する必要があります。</p>
        <p>
          RSA 2048 ビットキー: <a href="https://www.amazontrust.com/repository/AmazonRootCA1.pem" target="_blank" download>Amazon Root CA 1<i class="mdi mdi-file"></i>。</a>
        </p>

        <p>
          ECC 256 ビットキー: <a href="https://www.amazontrust.com/repository/AmazonRootCA3.pem" target="_blank">Amazon Root CA 3<i class="mdi mdi-file"></i>。</a>
        </p>
        <p>
          以下のトピックにSubscribe又はPublishをしてください。
        </p>
        <p>
          <code>{{ secondPage.topic }}</code>
        </p>
        <p>
          <NuxtLink to="/">
            <a class="btn text-white btn-success"> 終了 </a>
          </NuxtLink>
        </p>
      </b-card-body>
    </div>
  </div>
</template>
