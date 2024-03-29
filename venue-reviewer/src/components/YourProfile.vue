<template>
  <div id="users">
    <NavBar></NavBar>
    <div>
      <b-jumbotron id="jumbotron" header="User Profile">
        <div v-if="this.$cookies.get('auth_Id') === this.$route.params.userId">
          <b-button v-b-modal.editProfileModal @click.prevent="clearError">Edit Profile</b-button>
          <b-button v-b-modal.profilePhotoModal @click.prevent="clearError">Update Profile Photo</b-button>
        </div>
      </b-jumbotron>
    </div>
    <div>
      <div class="row">
        <div class="col">
          <div v-if="this.profilePicture">
            <img class="img-fill" :src="this.profilePicture" alt="Profile Photo Display Failed">
          </div>
          <div v-else>
            <img class="img-fill" src="../assets/defaultProfile.png" alt="Photo Display Failed">
          </div>
        </div>

        <div class="col">
            <div class="row">
              <a>Username: {{profile.username}}</a>
            </div>
            <div v-if="this.$cookies.get('auth_Id') === this.$route.params.userId" class="row">
              <a>Email: {{profile.email}}</a>
            </div>
            <div class="row">
              <a>Given Name: {{profile.givenName}}</a>
            </div>
            <div class="row">
              <a>Family Name: {{profile.familyName}}</a>
            </div>
        </div>
      </div>

      <b-modal id="editProfileModal" hide-footer title="Sign Up">
        <a class="alert alert-danger" v-if="this.error">{{error}}</a>
        <form>
          <div class="col">
            <div class="row">
              <b-form-group>
                <input v-model="givenName" placeholder="First Name" type="text">
                <a v-if="!$v.givenName.required">Required</a>
              </b-form-group>
            </div>
            <div class="row">
              <b-form-group>
                <input v-model="familyName" placeholder="Family Name" type="text">
                <a v-if="!$v.familyName.required">Required</a>
              </b-form-group>
            </div>
            <div class="row">
              <b-form-group>
                <input v-model="currentPassword" placeholder="Current Password" type="password">
                <a v-if="!$v.currentPassword.required">Required</a>
              </b-form-group>
            </div>
            <div class="row">
              <b-form-group>
                <input v-model="password" placeholder="Password" type="password">
                <a v-if="!$v.password.required">Required</a>
              </b-form-group>
            </div>
          </div>

          <button type="submit" class="btn btn-secondary" @click.prevent="checkPassword" :disabled="!($v.username.maxLength &&
          $v.familyName.required && $v.givenName.required && $v.password.required && $v.currentPassword.required)">Save</button>
          <button class="btn btn-secondary">Cancel</button>
        </form>
      </b-modal>

      <b-modal id="profilePhotoModal" hide-footer title="Profile Photo">
        <a v-if="this.photoError">{{photoError}}</a>
        <input type="file" @change="onFileChanged" accept="image/png, image/jpeg">
        <div v-if="this.profilePictureUpload">
          <img class="img-fill" :src="this.profilePictureUpload" alt="Profile Photo Display Failed">
        </div>
        <div v-else-if="this.profilePicture">
          <img class="img-fill" :src="this.profilePicture" alt="Profile Photo Display Failed">
        </div>
        <div v-else>
          <img class="img-fill" src="../assets/defaultProfile.png" alt="Photo Display Failed">
        </div>
        <b-button @click.prevent="savePhoto">Save</b-button>
        <b-button @click.prevent="removeProfilePicture">Remove Profile Photo</b-button>
        <b-button @click.prevent="clearImage">Cancel</b-button>
      </b-modal>
      
    </div>
  </div>
</template>

<script>
  import NavBar from './NavBar'
  import { required, maxLength, email, sameAs } from 'vuelidate/lib/validators'
  import * as router from "vue";

  export default {
    name: "YourProfile",
    components: {NavBar},
    data() {
      return {
        error: "",
        profile: [],
        givenName: "",
        familyName: "",
        username: "",
        email: "",
        password: "",
        currentPassword: "",
        selectedFile: null,
        image: null,
        profilePictureUpload: "",
        imageType: "",
        profilePicture: "",
        passwordErr: "",
        photoError: ""
      }
    },
    mounted: function () {
      this.getProfile();
      this.getProfilePicture();
    },
    methods: {
      getProfile: function () {
        let headers = {'X-Authorization': this.$cookies.get('auth_token')};
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.userId, {
          headers: headers
        })
          .then(function (response) {
            this.profile = response.data;
            this.email = response.data.email;
            this.username = response.data.username;
            this.givenName = response.data.givenName;
            this.familyName = response.data.familyName;
            this.profilePictureUpload = null;
            this.error = null;
          }, function (error) {
            alert("Error retrieving user profile");
          });
      },
      saveEdit: function () {
        this.$http.patch("http://localhost:4941/api/v1/users/" +  this.$cookies.get("auth_Id"), JSON.stringify({
          "givenName": this.givenName,
          "familyName": this.familyName,
          "password": this.password
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.$cookies.get('auth_token')
          }
        }).then(function (res) {
          this.$bvModal.hide("editProfileModal");
          this.getProfile();
        }, function (error) {
          this.error = error.statusText;
        });
      },
      onFileChanged: function (event) {
        const file = event.target.files[0];
        if (file.size > 20971520) {
          alert('Profile image must be below 20MB');
        } else {
          var reader = new FileReader();
          this.imageType = file.type;
          reader.onload = (e) => {
            this.profilePictureUpload = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      savePhoto: function () {
        this.$http.put("http://localhost:4941/api/v1/users/" +  this.$cookies.get("auth_Id") + "/photo", this.profilePictureUpload, {
          headers: {
            'Content-Type': this.imageType,
            'X-Authorization': this.$cookies.get('auth_token')
          }
        }).then(function (res) {
          this.profilePictureUpload = null;
          location.reload();
        }, function (error) {
          this.photoError = error.statusText;
        });
      },
      getProfilePicture: function () {
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.userId + "/photo")
          .then(function (response) {
            this.profilePicture = response.body;
          }, function (error) {
          });
      },
      clearImage: function () {
        this.profilePictureUpload = null;
        this.$bvModal.hide("profilePhotoModal")
      },
      removeProfilePicture: function () {
        let headers = {'X-Authorization': this.$cookies.get('auth_token')};
        this.$http.delete('http://localhost:4941/api/v1/users/' + this.$route.params.userId + '/photo', {
          headers: headers
        })
          .then(function (response) {
            this.profilePictureUpload = null;
            this.profilePicture = null;
            this.$bvModal.hide("profilePhotoModal");
          }, function (error) {
            this.photoError = error.statusText;
          });
      },
      checkPassword: function () {
        this.error = null;
        this.$http.post("http://localhost:4941/api/v1/users/login", JSON.stringify({
          "username": this.profile.username,
          "password": this.currentPassword
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          this.$cookies.remove("auth_Id");
          this.$cookies.remove("auth_token");

          this.$cookies.set("auth_token", response.body.token);
          this.$cookies.set("auth_Id", response.body.userId);

          this.saveEdit();
        }, function (error) {
          if (error.statusText === 'Bad Request: invalid username/email/password supplied') {
            this.error = "Password Incorrect";
          }

        });
      },
      clearError: function () {
        this.error = null;
      }
    },
    validations: {
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
      password: {
        required
      },
      currentPassword: {
        required
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


  .img-fill {
    object-fit: contain;
    height: 45vh;
    width: 25vw;
  }


</style>
