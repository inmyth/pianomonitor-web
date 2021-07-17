<template>
  <div class="container">
    <PageHeader :title="title" :items="items" />
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-8"></div>
          <div class="col-lg-4">
            <div class="text-lg-right mt-3 mt-lg-0">
              <NuxtLink :to="localePath({ name: 'new' })">
                <a class="btn text-white btn-primary"><i class="mdi mdi-plus-circle mr-1"></i> Add New </a>
              </NuxtLink>
            </div>
          </div>
          <!-- end col-->
        </div>
        <p class="sub-header"></p>

        <b-table class="minimal text-left" responsive :items="things" :fields="fields">
          <template #cell(name)="data">
            <NuxtLink :to="localePath({ name: 'thing-id', params: { id: data.item.id } })">{{ data.item.name }}</NuxtLink>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * Basic Tables component
 */
export default {
  mounted() {
    // let creds = await this.$store.dispatch("auth/getCurrentCredentials");
    this.$store.dispatch("service/getDevices").then(p => console.log(p.data));
  },
  head() {
    return {
      title: `${this.title} | Minton - Nuxtjs Responsive Admin Dashboard Template`
    };
  },
  data() {
    return {
      title: "ダッシュボード",
      items: [],
      fields: [
        { key: "name", label: "Name", sortable: true },
        { key: "type", sortable: true },
        { key: "certificate", sortable: true }
      ],
      things: [
        { id: "aa", name: "Bosch", type: "温度", certificate: "www.aaa.com" },
        { id: "ab", name: "Bosch", type: "温度", certificate: "www.aaa.com" }
      ]
    };
  },
  middleware: "router-auth"
};
</script>
