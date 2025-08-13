<template>
    <div class="container">
        <div class="row mb-3">
            <div class="col">
                <h1>Contacts</h1>
                <router-link to="/create" class="btn btn-primary">Create New Contact</router-link>
            </div>
        </div>

        <div class="row">
            <div class="col-4" v-for="contact in contacts" :key="contact.id">
                <div class="card">
                    <img :src="contact.picture" :alt="contact.name" class="card-img-top" />

                    <div class="card-body">
                        <h2>{{ contact.name }}</h2>
                        <p>{{ contact.contact }}</p>
                        <p>{{ contact.email }}</p>
                        <router-link :to="`/contacts/${contact.id}`" class="btn btn-primary">Details</router-link>
                        <router-link :to="`/edit/${contact.id}`" class="btn btn-warning ms-1">Edit</router-link>
                        <button @click="deleteContact(contact.id)" class="btn btn-danger ms-1">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>

<script>
import axios from 'axios'
export default {
  data() {
    return { contacts: [] }
  },
  async mounted() {
    const res = await axios.get('https://pedroserpa-nodejs.recruitment.alfasoft.pt/contacts')
    this.contacts = res.data
  },
  methods: {
    async deleteContact(id) {
      await axios.delete(`https://pedroserpa-nodejs.recruitment.alfasoft.pt/contacts/${id}`)
      this.contacts = this.contacts.filter(c => c.id !== id)
    }
  }
}
</script>