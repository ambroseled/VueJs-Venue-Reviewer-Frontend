<template>
  <div id="venues">
    <NavBar></NavBar>
    <div>
      <b-jumbotron id="jumbotron" header="Profiles" lead="View Other Users in the System">
      </b-jumbotron>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
  import NavBar from './NavBar'

  export default {
    name: "Users",
    components: {NavBar},
  }
</script>

<style scoped>

</style>
