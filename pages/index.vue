<template>
  <div class="container">
    <PageHeader :title="title" :items="items" />
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-8"></div>
          <div class="col-lg-4">
            <div class="text-lg-right mt-3 mt-lg-0">
              <NuxtLink :to="localePath({ name: 'device-new' })">
                <a class="btn text-white btn-primary"><i class="mdi mdi-plus-circle mr-1"></i> Add New </a>
              </NuxtLink>
            </div>
          </div>
          <!-- end col-->
        </div>
        <p class="sub-header"></p>

        <b-table fixed class="minimal text-left" :items="devices" :fields="fields" show-empty>
          <template #empty>
            <h5>登録済デバイスは無いです。</h5>
          </template>
          <template #cell(name)="data">
            <NuxtLink :to="localePath({ name: 'thing-id', params: { id: data.item.clientId } })">{{ data.item.clientName }}</NuxtLink>
          </template>
          <template #cell(created)="data">
            {{ tsToString(data.item.creationTs) }}
          </template>
          <template #cell(delete)="data">
            <a href="javascript:void(0);" class="action-icon px-1" v-b-modal="'delModal'" @click="openDelModal(data.item.clientId, data.item.clientName)"> <i class="fe-x"></i></a>
          </template>
        </b-table>
      </div>
      <b-modal id="delModal" @hidden="resetDelModal" @ok="executeDelete" title="削除を確認">
        <p>以下のでアイスを消しますか ? 付いている証明書とキーは無効にします。</p>
        <h5>{{ toDelete.name }}</h5>
      </b-modal>
    </div>
  </div>
</template>
<script>
/**
 * Basic Tables component
 */
export default {
  mounted() {
    this.isLoading = true;
    this.$store.dispatch("service/refreshDevices");
  },
  head() {
    return {
      title: `${this.title}`
    };
  },
  watch: {
    "$store.state.service": {
      handler() {
        const devices = this.$store.state.service.devices;
        this.devices = devices;
        this.isEmpty = devices.length == 0;
        return devices;
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      title: "ダッシュボード",
      items: [],
      fields: [
        { key: "name", label: "Name", sortable: true },
        { key: "created", label: "Date", sortable: true },
        { key: "delete", label: "", sortable: false, tdClass: "text-right" }
      ],
      devices: [],
      // isEmpty: false,
      toDelete: {
        id: null,
        name: null
      }
    };
  },
  methods: {
    tsToString(ts) {
      var options = { weekday: "short", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", timeZone: "Asia/Tokyo" };
      const dtFormat = new Intl.DateTimeFormat("ja-JP", options);

      return dtFormat.format(new Date(ts * 1000));
    },
    openDelModal(id, name) {
      this.toDelete.id = id;
      this.toDelete.name = name;
    },
    resetDelModal() {
      this.toDelete.id = null;
      this.toDelete.name = null;
    },
    async executeDelete() {
      const id = this.toDelete.id.slice();
      const name = this.toDelete.name.slice();
      this.$store.dispatch("service/removeDeviceFromState", { clientId: id });
      const x = await this.$store.dispatch("service/deleteDevice", { clientId: id });
      if (x) this.$store.dispatch("notification/success", `${name}が削除されました。`);
    }
  },
  middleware: "router-auth"
};
</script>
