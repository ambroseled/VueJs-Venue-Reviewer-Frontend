<template>
  <div id="venues">
    <NavBar></NavBar>
    <div>
      <b-jumbotron id="jumbotron" header="Your Profile">
        <b-button v-b-modal.editProfileModal>Edit Profile</b-button>
        <b-button v-b-modal.profilePhotoModal>Update Profile Photo</b-button>
      </b-jumbotron>
    </div>
    <div>
      <div v-if="this.$cookies.get('auth_Id') === this.$route.params.userId">
        <ol>
          <li>Username: {{profile.username}}</li>
          <li v-if="profile.email">Email: {{profile.email}}</li>
          <li>Given Name: {{profile.givenName}}</li>
          <li>Family Name: {{profile.familyName}}</li>
        </ol>
      </div>


      <b-modal id="editProfileModal" hide-footer title="Sign Up">
        <a v-if="this.error">{{error}}</a>
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
                <input v-model="currentPassword" placeholder="Current Password" type="password">
                <!--a v-if="!$v.currentPassword.checkCurrent">Current password required to change password</a-->
              </form-group>
            </div>
            <div class="row">
              <form-group>
                <input v-model="password" placeholder="Password" type="password">
              </form-group>
            </div>
          </div>

          <button type="submit" class="btn btn-secondary" @click.prevent="saveEdit" :disabled="!$v.username.maxLength &&
          $v.familyName.required && $v.givenName.required && $v.repeatPassword.sameAsPassword">Save</button>
          <button class="btn btn-secondary">Cancel</button>
        </form>
      </b-modal>

      <b-modal id="profilePhotoModal" hide-footer title="Profile Photo">
        <div v-if="this.image">
          <b-img thumbnail fluid rounded="circle" :src="this.image" alt="Display Failed"></b-img>
        </div>
        <div v-else>
          <h2>Please Upload a Profile Picture</h2>
        </div>

        <input type="file" @change="onFileChanged" accept="image/png, image/jpeg">
        <b-button>Save</b-button>
        <b-button>Cancel</b-button>
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
        image: null
      }
    },
    mounted: function () {
      this.getProfile();
    },
    methods: {
      getProfile: function () {
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$cookies.get("auth_Id"), {}, {
          headers: {
            'X-Authorization': this.$cookies.get('auth_token')
          }
        })
          .then(function (response) {
            this.profile = response.data;
            this.email = response.data.email;
            this.username = response.data.username;
            this.givenName = response.data.givenName;
            this.familyName = response.data.familyName;
          }, function (error) {
            this.error = error;
          });
      },
      saveEdit: function () {
        this.$http.patch("http://localhost:4941/api/v1/users/" +  this.$cookies.get("auth_Id"), JSON.stringify({
          "givenName": this.givenName,
          "familyName": this.familyName,
          "password": this.password
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function (res) {

        }, function (error) {
          this.error = error.statusText;
        });
      },
      onFileChanged (event) {
        const file = event.target.files[0];
        var image = new Image();
        var reader = new FileReader();

        reader.onload = (e) => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      onUpload() {
        // upload file
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
