<template>
  <b-navbar fixed="top" variant="primary" id="navbar">
    <b-navbar-brand>VenueReviewer</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item href="/venues">Venues</b-nav-item>
      <b-nav-item href="/users">Users</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <div v-if="!this.$cookies.get('auth_token')">
        <b-button v-b-modal.signInModal>Sign In</b-button>
        <b-button v-b-modal.signUpModal>Sign Up</b-button>
      </div>
      <div v-else>
        <router-link :to="{name: 'user', params: { userId: this.$cookies.get('auth_Id')}}">
          <b-button>Your Profile</b-button>
        </router-link>
        <b-button @click="signOut">Sign Out</b-button>
      </div>
    </b-navbar-nav>

    <b-modal id="signUpModal" hide-footer title="Sign Up">
      <a v-if="signUpErr">{{signUpErr}}</a>
      <a v-if="signInErr">{{signInErr}}</a>
      <form>
        <div class="col">
          <div class="row">
            <form-group>
              <input v-model="givenName" placeholder="First Name" type="text">
              <a v-if="!$v.givenName.required">Required</a>
            </form-group>
          </div>
          <div class="row">
            <form-group>
              <input v-model="familyName" placeholder="Family Name" type="text">
              <a v-if="!$v.familyName.required">Required</a>
            </form-group>
          </div>
          <div class="row">
            <form-group>
              <input v-model="username" placeholder="Username" type="text">
              <a v-if="!$v.username.required">Required</a>
              <!-- TODO Custom Validator to check for in use email/username-->
              <a v-if="!$v.username.maxLength">Username must be under 64 characters</a>
            </form-group>
          </div>
          <div class="row">
            <form-group>
              <input v-model="email" placeholder="Email Address" type="email">
              <a v-if="!$v.email.required">Required</a>
              <a v-else-if="!$v.email.email">Invalid Email</a>
            </form-group>
          </div>
          <div class="row">
            <form-group>
              <input v-model="password" placeholder="Password" type="password">
              <a v-if="!$v.password.required">Required</a>
            </form-group>
          </div>
          <div class="row">
            <form-group>
              <input v-model="repeatPassword" placeholder="Confirm Password" type="password">
              <a v-if="!$v.repeatPassword.required">Required</a>
              <a v-else-if="!$v.repeatPassword.sameAsPassword">Passwords Must Match</a>
            </form-group>
          </div>
        </div>

        <button type="submit" class="btn btn-secondary" @click.prevent="signUp" :disabled="!($v.password.required &&
        $v.email.required && $v.username.required && $v.email.email && $v.repeatPassword.required &&
        $v.repeatPassword.sameAsPassword && $v.username.maxLength && $v.familyName.required &&
        $v.givenName.required)">Sign Up</button>
      </form>
    </b-modal>

    <b-modal id="signInModal" hide-footer title="Sign In">
      <a v-if="signInErr">{{signInErr}}</a>
      <form>
        <div class="col">
          <a>Sign in with username or email</a>
          <div class="row">
            <form-group>
              <input v-model="signInUsername" placeholder="Username" type="text">
              <a v-if="!$v.signInUsername.check">Required</a>
            </form-group>
          </div>
          <div class="row">
            <form-group>
              <input v-model="signInEmail" placeholder="Email Address" type="email">
              <a v-if="!$v.signInEmail.check">Required</a>
            </form-group>
          </div>
          <div class="row">
            <form-group>
              <input v-model="password" placeholder="Password" type="password">
              <a v-if="!$v.password.required">Required</a>
            </form-group>
          </div>
        </div>

        <button type="submit" class="btn btn-secondary" @click.prevent="signIn" :disabled="!($v.password.required &&
        ($v.signInEmail.check || $v.signInUsername.check))">Sign In</button>
      </form>
    </b-modal>
  </b-navbar>
</template>

<script>
    import * as router from "vue";
    import { required, sameAs, maxLength, email } from 'vuelidate/lib/validators'
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
          signUpValid: "false",
          signUpErr: "",
          signInErr: "",
          signOutErr: "",
          signInEmail: "",
          signInUsername: ""
        }
      },
        methods: {
          signUp: function () {
            this.signUpErr = null;
            this.$http.post("http://localhost:4942/api/v1/users", JSON.stringify({
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
              this.signInEmail = this.email;
              this.signIn();
            }, function (error) {
              if (error.statusText === "Bad Request: username or email already in use") {
                this.signUpErr = "username or email already in use";
              } else {
                this.signUpErr = error.statusText;
              }

            });
          },
          signIn: function () {
            this.signInErr = null;
            this.$http.post("http://localhost:4942/api/v1/users/login", JSON.stringify({
              "username": this.signInUsername,
              "email": this.signInEmail,
              "password": this.password
            }), {
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(function (response) {
              this.$cookies.set("auth_token", response.body.token);
              this.$cookies.set("auth_Id", response.body.userId);
              location.reload();
              this.getVenuesToSelect();
            }, function (error) {
              this.signInErr = error.statusText;
            });
          },
          signOut: function () {
            this.$http.post('http://localhost:4942/api/v1/users/logout', {}, {
              headers: {
                'X-Authorization': this.$cookies.get('auth_token')
              }
            })
              .then(function (response) {
                this.$cookies.remove("auth_Id");
                this.$cookies.remove("auth_token");
                location.reload();
              }, function (error) {
                this.signOutErr = error;
              });
          }
        },
      validations: {
          password: {
            required
          },
        repeatPassword: {
            required,
            sameAsPassword: sameAs('password')
        },
        givenName: {
            required
        },
        familyName: {
            required
        },
        username: {
            required,
            maxLength: maxLength(64)
        },
        email: {
            email,
            required
        },
        signInUsername: {
            check (v) {
              return required(v) || this.signInEmail
            }
        },
        signInEmail: {
            email,
          check (v) {
              return required(v) || this.signInUsername
          }
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
