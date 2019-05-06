import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Venues from './components/Venues.vue'
import Reviews from './components/Reviews.vue'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'



Vue.use(BootstrapVue);
Vue.use(VueRouter);


const routes = [
  {
    path: '/venues',
    name: 'venues',
    component: Venues
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: Reviews
  }
];

const router  =  new  VueRouter ({
  routes : routes,
  mode :  'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
