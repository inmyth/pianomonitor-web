<template>
  <div class="container">
    <PageHeader :title="title" :items="items" />
    <div class="card">
      <div class="card-body">
        <h4 class="header-title">センサー</h4>
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
