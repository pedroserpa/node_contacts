<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="mb-3">{{ isEdit ? 'Edit Contact' : 'Create Contact' }}</h1>
                <router-link to="/" class="btn btn-primary">&lt;</router-link>

                <form @submit.prevent="saveContact">
                    <div class="mb-3">
                        <label class="form-label">Name:</label>
                        <input v-model="form.name" required minlength="6" class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Contact:</label>
                        <input v-model="form.contact" required class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email:</label>
                        <input v-model="form.email" required type="email" class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Photo:</label>
                        <input type="file" @change="onFileChange" :required="!isEdit" class="form-control" />
                        <img v-if="form.picture" :src="form.picture" class="preview" />
                    </div>
                    <button type="submit" class="btn btn-primary">Save</button>
                </form>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data() {
      return {
        form: { name: '', contact: '', email: '', picture: '' },
        isEdit: false
      }
    },
    async mounted() {
      if (this.$route.params.id) {
        this.isEdit = true
        const res = await axios.get(`https://pedroserpa-nodejs.recruitment.alfasoft.pt/contacts/${this.$route.params.id}`)
        this.form = res.data
      }
    },
    methods: {
      onFileChange(e) {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            this.form.picture = reader.result
          }
          reader.readAsDataURL(file)
        }
      },
      async saveContact() {
        if (this.isEdit) {
          await axios.put(`https://pedroserpa-nodejs.recruitment.alfasoft.pt/contacts/${this.$route.params.id}`, this.form)
        } else {
          await axios.post('https://pedroserpa-nodejs.recruitment.alfasoft.pt/contacts', this.form)
        }
        this.$router.push('/')
      }
    }
  }
  </script>
  
  <style>
  .preview { width: 100px; height: auto; margin-top: 0.5rem; }
  </style>