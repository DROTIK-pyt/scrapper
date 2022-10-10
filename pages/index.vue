<template>
  <v-app>
    <v-main>
      <v-container class="align-start">
        <v-row>
          <v-col
          sm="2"
          offset-sm="4"
          cols="12"
          class="text-left"
          >
            <v-treeview
              v-model="tree"
              :value="tree"
              :open="initiallyOpen"
              :items="items"
              activatable
              item-name="name"
              item-key="fullPath"
              open-on-click
              @update:active="readFile"
            >
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.file">
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else>
                  {{ files[item.file] }}
                </v-icon>
              </template>
            </v-treeview>

            <v-dialog
              v-model="isOpen"
              width="500"
            >
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  {{ dialogName }}
                </v-card-title>

                <v-card-text class="text-h4 py-4">
                  {{ text }}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="isOpen = false"
                  >
                    Закрыть
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
  
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  data: () => ({
    name: "name",
    description: "description",
    initiallyOpen: ['public'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      tree: [],
      items: [],

      isOpen: false,
      dialogName: "",
      text: "",
  }),
  components: {
    AppLogo
  },
  methods: {
    async readFile(file) {
      if(file.length) {
        const result = await fetch(`http://localhost:8888/file`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            fullPath: file[0]
          })
        })

        const responsed = await result.text()
        this.text = responsed
        this.dialogName = file[0].split(`\\`).pop()
        
        this.isOpen = true
      }
    },
  },
  async beforeMount() {
    const result = await fetch(`http://localhost:8888/get-folder`)

    const responsed = await result.json()
    this.items = responsed.result

    console.log(this.items)
  },
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

