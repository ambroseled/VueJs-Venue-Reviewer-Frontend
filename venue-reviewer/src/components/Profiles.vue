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
    data() {
      return {
        users: []
      }
    },
    mounted() {
      this.getUsers();
    },
    methods: {
      getUsers: function () {
        this.$http.get('http://localhost:4941/api/v1/users')
          .then(function (response) {
            this.users = response.data;
          }, function (error) {
            console.log(error);
          });
      }
    }
  }
</script>

<style scoped>

</style>
