<template>
  <div id="venues">
    <NavBar></NavBar>
    <div>
      <b-jumbotron id="jumbotron" header="Your Profile">
      </b-jumbotron>
    </div>
    <div>
      <div v-if="this.$cookies.get('auth_Id') === this.$route.params.userId">
        {{profile.username}}
      </div>
      
    </div>
  </div>
</template>

<script>
  import NavBar from './NavBar'

  export default {
    name: "YourProfile",
    components: {NavBar},
    data() {
      return {
        error: "",
        profile: []
      }
    },
    mounted: function () {
      this.getProfile();
    },
    methods: {
      getProfile: function () {
        this.$http.get('http://localhost:4941/api/v1/users/users' + this.cookies.get("auth_Id"), {}, {
          headers: {
            'X-Authorization': this.$cookies.get('auth_token')
          }
        })
          .then(function (response) {
            this.profile = response.data;
          }, function (error) {
            this.error = error;
          });
      }
    }
  }
</script>

<style scoped>

</style>
