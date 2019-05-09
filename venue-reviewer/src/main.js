import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Venues from './components/Venues.vue'
import Profiles from './components/Profiles.vue'
import YourProfile from './components/YourProfile.vue'
import BootstrapVue from 'bootstrap-vue'
import VueResource from 'vue-resource'
import Vuelidate from 'vuelidate'
import VueCookies from "vue-cookies"


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Vuelidate);
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(VueCookies);



const routes = [
  {
    path: '/venues',
    name: 'venues',
    component: Venues
  },
  {
    path: '/profiles',
    name: 'profiles',
    component: Profiles
  },
  {
    path: '/profile',
    name: 'profile',
    component: YourProfile
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
