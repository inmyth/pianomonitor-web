<script>
/**
 * File-manager component
 */
export default {
  head() {
    return {
      title: `${this.title} | Minton - Nuxtjs Responsive Admin Dashboard Template`
    };
  },
  mounted: function() {
    this.list();
  },
  data() {
    return {
      title: "File Manager",
      items: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "File Manager",
          active: true
        }
      ],
      fileManagerData: [],
      itemToDelete: null,
      uploadCompleted: ""
    };
  },
  methods: {
    async saveFile(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const name = event.target.files[i].name;
        const size = Math.round(event.target.files[i].size / 1024) + " KB";
        const date = event.target.files[i].lastModifiedDate;

        try {
          await this.$store.dispatch("storage/upload", {
            name: name,
            file: file,
            callback: c => {
              this.uploadCompleted = c;
            }
          });
          this.fileManagerData.push({
            name,
            date,
            size
            // users: [require("~/assets/images/users/avatar-1.jpg")]
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    async list() {
      try {
        let files = await this.$store.dispatch("storage/list", { prefix: "" });
        files.forEach(p => {
          this.fileManagerData.push({
            icon: require("~/assets/images/file-icons/png.svg"),
            name: p.key,
            date: p.lastModified,
            size: p.size
          });
        });
      } catch (error) {}
    },
    async delete(key) {
      await this.$store.dispatch("storage/delete", { name: key });
    },
    openDelModal(key) {
      this.itemToDelete = key;
    },
    resetDelModal() {
      this.itemToDelete = "";
    },
    async confirmDelModal() {
      try {
        await this.delete(this.itemToDelete);
        var index = this.fileManagerData.indexOf(this.itemToDelete);
        this.fileManagerData.splice(index, 1);
        this.resetDelModal();
        this.$store.dispatch("notification/success", { message: "File deleted" });
      } catch (error) {
        this.$store.dispatch("notification/error", { message: "File cannot be deleted" });
      }
    }
  },
  middleware: "router-auth"
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="fileupload btn btn-success waves-effect waves-light mb-3">
              <span> <i class="mdi mdi-cloud-upload mr-1"></i> Upload Files </span>
              <form>
                <input type="file" class="upload" @change="saveFile($event)" />
              </form>
            </div>
            <!-- Table -->
            <div class="table-responsive">
              <table class="table table-centered mb-0">
                <thead class="font-13 bg-light text-muted">
                  <tr>
                    <th class="font-weight-medium">File Name</th>
                    <th class="font-weight-medium">Date Modified</th>
                    <th class="font-weight-medium">Size</th>
                    <th class="font-weight-medium text-center" style="width: 125px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tableData in fileManagerData" :key="tableData.name">
                    <td>
                      <img v-if="tableData.icon" :src="`${tableData.icon}`" height="30" alt="icon" class="mr-2" />
                      <a href="javascript:void(0);" class="text-dark">{{ tableData.name }}</a>
                    </td>
                    <td class="text-muted font-13">{{ tableData.date }}</td>
                    <td>{{ tableData.size }}</td>
                    <td>
                      <ul class="list-inline table-action m-0">
                        <li class="list-inline-item">
                          <a href="javascript:void(0);" class="action-icon px-1" v-b-modal="'delModal'" @click="openDelModal(tableData.name)"> <i class="mdi mdi-delete"></i></a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
              <b-modal id="delModal" @hidden="resetDelModal" @ok="confirmDelModal"> Delete {{ itemToDelete }} ? </b-modal>
            </div>
            <!-- End table -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
