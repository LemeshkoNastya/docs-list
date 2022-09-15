import Vue from 'vue'
import VueRouter from 'vue-router'
import Docs from '../views/Docs.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Docs',
  component: Docs
}, ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router