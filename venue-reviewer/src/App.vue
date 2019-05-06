<template>
  <div id="app">
    <NavBar></NavBar>
  </div>
</template>

<script>
  import NavBar from './components/NavBar'


export default {
  name: 'app',
  components: {NavBar},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  comments: {
    'NavBar': NavBar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
