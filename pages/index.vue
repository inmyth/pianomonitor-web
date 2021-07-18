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

        <b-table fixed class="minimal text-left" :items="devices" :fields="fields">
          <template #cell(name)="data">
            <NuxtLink :to="localePath({ name: 'thing-id', params: { id: data.item.clientId } })">{{ data.item.clientName }}</NuxtLink>
          </template>
          <template #cell(created)="data">
            {{ tsToString(data.item.creationTs) }}
          </template>
          <template #cell(delete)>
            <a href="javascript:void(0);" class="action-icon px-1" v-b-modal="'delModal'" @click="openDelModal(tableData.name)"> <i class="fe-x"></i></a>
          </template>
        </b-table>
        <p v-if="this.isEmpty">登録されたデバイスは無しです。</p>
      </div>
      <b-modal id="delModal" @hidden="resetDelModal" @ok="executeDelete"> Delete {{ this.delete.name }} ? </b-modal>
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
      isEmpty: false,
      delete: {
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
      this.delete.id = id;
      this.delete.name = name;
    },
    resetDelModal() {
      this.delete.id = null;
      this.delete.name = null;
    },
    async executeDelete() {
      // try {
      //   await this.delete(this.itemToDelete);
      //   var index = this.fileManagerData.indexOf(this.itemToDelete);
      //   this.fileManagerData.splice(index, 1);
      //   this.resetDelModal();
      //   this.$store.dispatch("notification/success", { message: "File deleted" });
      // } catch (error) {
      //   this.$store.dispatch("notification/error", { message: "File cannot be deleted" });
      // }
    }
  },
  middleware: "router-auth"
};
</script>
