<template>
  <b-navbar fixed="top" variant="primary" id="navbar">
    <b-navbar-brand>VenueReviewer</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item class="whiteText" href="/venues">Venues</b-nav-item>
      <b-nav-item href="/reviews">Reviews</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <!--TODO error for login-->
      <!--TODO show logged in user-->
      <!-- When logged in -->
      <!-- <div id="logid" v-if="!this.$cookie.get('authToken')"> -->
      <!-- When not logged in -->
      <!-- <div id="loggedIn" v-if="this.$cookie.get('authToken')"> -->

      <b-button v-b-modal.signInModal>Sign In</b-button>

      <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#signupModal">Sign Up
      </button>

    </b-navbar-nav>

    <b-modal id="signInModal" hide-footer title="Sign In">
      <form>
        <div class="col">
          <div class="row">
            <input v-model="givenName" placeholder="First Name" type="text" required>
          </div>
          <div class="row">
            <input v-model="familyName" placeholder="Family Name" type="text" required>
          </div>
          <div class="row">
            <input v-model="username" placeholder="Username" type="text" required>
          </div>
          <div class="row">
            <input v-model="email" placeholder="Email Address" type="email" required>
          </div>
          <div class="row">
            <input v-model="password" placeholder="Password" type="password" required>
          </div>
          <div class="row">
            <input v-model="repeatPassword" placeholder="Repeat Password" type="password" required>
          </div>
        </div>

        <button type="submit" class="btn btn-secondary" data-dismiss="modal" data-target="#signupModal" v-on:click="signUp">Sign Up</button>
      </form>
    </b-modal>


  </b-navbar>
</template>

<script>
    import * as router from "vue";
    export default {
        name: "NavBar",
      data() {
        return {
          givenName: "",
          familyName: "",
          username: "",
          email: "",
          password: "",
          repeatPassword: "",
          id: "",
          token: "",
          userId: "",
          userToken: "",
          signUpValid: "false"
        }
      },
        methods: {
          validateSignUpForm: function () {
            if (this.givenName && this.familyName && this.username && this.email && this.password && this.repeatPassword) {
              // TODO email validation on the regex given
              if (this.password === this.repeatPassword && this.username.length <= 64) {
                this.signUpValid = "true";
                return;
              }
            }
            this.signUpValid = "false";
            return;
          },
          signUp: function () {
            alert("sign up function called " + this.username);
            this.$http.post("http://localhost:4941/api/v1/users", JSON.stringify({
              "username": this.username,
              "email": this.email,
              "givenName": this.givenName,
              "familyName": this.familyName,
              "password": this.password
            }), {
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(function (res) {
              //TODO log the user in unless that happens already in sign up

            }, function (error) {
              //TODO handle errors to be displayed
            });
          }
        }
    }
</script>

<style scoped>
  input[type=text], input[type=email], input[type=password] {
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    box-sizing: border-box;
    border-color: #ca6636;
    border-width: 0 0 2px;
    outline: 0;
  }
</style>
