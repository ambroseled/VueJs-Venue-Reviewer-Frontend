import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import Venues from './components/Venues.vue'
import Reviews from './components/Reviews.vue'
import NavBar from './components/NavBar.vue'


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


new Vue({
  el: "#navbar",
  router: Router,
  render: h => h(NavBar)
});
