import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Venues from './components/Venues'
import Reviews from './components/Reviews'


Vue.use(Router);

new Vue({
  el: '#app',
  routes: [
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
  ],
  render: h => h(App)
});
