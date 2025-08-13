<template>
    <div v-if="contact" class="container">
      <h1>{{ contact.name }}</h1>
      <router-link to="/" class="btn btn-primary">&lt;</router-link>

      <div class="row">
        <img :src="contact.picture" alt="{{ contact.name }}" class="img-fluid" />
        <p><strong>Contact:</strong> {{ contact.contact }}</p>
        <p><strong>Email:</strong> {{ contact.email }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data() {
      return { contact: null }
    },
    async mounted() {
      const res = await axios.get(`https://pedroserpa-nodejs.recruitment.alfasoft.pt/contacts/${this.$route.params.id}`)
      this.contact = res.data
    }
  }
  </script>
  
  <style>
  .img-fluid { width: 200px; }
  </style>