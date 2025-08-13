import { createRouter, createWebHistory } from 'vue-router'
import ContactList from '@/views/List.vue'
import ContactDetails from '@/views/Detail.vue'
import ContactForm from '@/views/Form.vue'

const routes = [
  { path: '/', component: ContactList },
  { path: '/contacts/:id', component: ContactDetails },
  { path: '/edit/:id', component: ContactForm },
  { path: '/create', component: ContactForm }
]

export default createRouter({
  history: createWebHistory(),
  routes
})