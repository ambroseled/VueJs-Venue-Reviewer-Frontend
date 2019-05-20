<template>
  <div id="venues">
    <NavBar></NavBar>
    <div>
      <b-jumbotron id="jumbotron" header="Venues" lead="Explore Venues in the System">
      </b-jumbotron>
      <div v-if="this.$cookies.get('auth_token')">
        <b-button variant="primary" v-b-modal.createVenueModal>Add Venue</b-button>
        <b-button variant="primary" v-b-modal.reviewModal>Post Review</b-button>
      </div>
      <div class="row">
        <div class="col">
          <b-form-group
            label="Select a City"
            name="city">
            <b-form-select v-model="selected" :options="cities" size="sm"></b-form-select>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Enter a Venue Name"
            name="venueName">
            <b-input v-model="search"></b-input>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Select a Category"
            name="category">
            <b-form-select v-model="category" :options="categories" size="sm"></b-form-select>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Sort by Rating"
            name="sortBy">
            <b-form-select v-model="sortOption" :options="sorting" size="sm"></b-form-select>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Minimum Star Rating"
            name="minStarRating">
            <b-input type="number" min="1" max="5" v-model="minStar"></b-input>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Max Cost Rating"
            name="maxCostRating">
            <b-form-select v-model="maxCost" :options="costRatings" size="sm"></b-form-select>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <a>
            Viewing: {{batches.get(currentBatch).start + 1}} - {{batches.get(currentBatch).end + 1}} of {{venuesData.length}}
          </a>
          <b-button variant="primary" @click.prevent="currentBatch -= 1" :disabled="!(currentBatch > 0)">Previous</b-button>
          <b-button variant="primary" @click.prevent="currentBatch += 1" :disabled="currentBatch > batches.values.length">Next</b-button>
        </div>
        <div class="col">

          <b-button variant="primary" @click.prevent="filterVenues">Filter Venues</b-button>
          <b-button variant="primary" @click.prevent="getVenues">Reset Filtering</b-button>
          <b-button v-if="this.$cookies.get('auth_token')" variant="primary" @click.prevent="getUserVenues">Your Venues Only</b-button>
        </div>
      </div>

      <div class="row">
        <div v-for="(n, i) in (batches.get(currentBatch).end - batches.get(currentBatch).start) + 1" class="w-50">
          <b-card
            :title="venuesData[i + batches.get(currentBatch).start].venueName">
            <b-card-body>
              <div v-if="venuesData[i + batches.get(currentBatch).start].primaryPhoto">
               <img class="img-fill" :src="venuesData[i + batches.get(currentBatch).start].primaryPhoto" onerror="this.onerror=null; this.src='../assets/venueDefault.png'" alt="Image display failed">
              </div>
              <div v-else>
                <img class="img-fill" src="../assets/venueDefault.png" alt="Display Failed"> <!-- Get default png-->
              </div>
              <h5>{{venuesData[i + batches.get(currentBatch).start].shortDescription}}</h5>
              <div class="col">
                <div class="row">
                  <a>City: {{venuesData[i + batches.get(currentBatch).start].city}}</a>
                </div>
                <div class="row">
                  <a>Category: {{categoriesMap.get(venuesData[i + batches.get(currentBatch).start].categoryId)}}</a>
                </div>
                <div v-if="venuesData[i + batches.get(currentBatch).start].meanStarRating" class="row">
                  <a>Mean Star Rating: {{venuesData[i + batches.get(currentBatch).start].meanStarRating}}</a>
                </div>
                <div v-else class="row">
                  <a>Mean Star Rating: 3</a>
                </div>
                <div class="row" v-if="venuesData[i + batches.get(currentBatch).start].modeCostRating">
                  <a>Mode Cost Rating: {{venuesData[i + batches.get(currentBatch).start].modeCostRating}}</a>
                </div>
                <div v-else class="row">
                  <a>Mode Cost Rating: 0</a>
                </div>
                <div v-if="venuesData[i + batches.get(currentBatch).start].distance" class="row">
                  <a>Distance: {{venuesData[i + batches.get(currentBatch).start].distance}}</a>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <b-button block @click.prevent="setVenue(venuesData[i + batches.get(currentBatch).start], 0); venueError = null">More Details</b-button>
                </div>
              </div>
            </b-card-body>
          </b-card>
        </div>
      </div>

    </div>
    <div v-if="toView.venue">
      <b-modal id="venueModal" hide-footer :title="toView.venue.venueName">
        <div class="container">
          <b-tabs content-class="mt-3" justified>
            <b-tab title="Information" active>
              <div class="row">
                <a>Category: {{toView.venue.category.categoryName}}</a>
              </div>
              <div class="row">
                <a :href="'/users/' + toView.venue.admin.userId">Administrator: {{toView.venue.admin.username}}</a>
              </div>
              <div class="row">
                <a>City: {{toView.venue.city}}</a>
              </div>
              <div class="row">
                <a>Address: {{toView.venue.address}}</a>
              </div>
              <div class="row">
                <a>Date Added: {{toView.venue.dateAdded}}</a>
              </div>
              <div class="row">
                <a>Mean Star Rating: {{toView.star}}</a>
              </div>
              <div class="row">
                <a>Mode Cost Rating: {{toView.cost}}</a>
              </div>
              <div class="row">
                <div v-if="showLongDesc">
                  <a>Description: {{toView.venue.shortDescription}} {{toView.venue.shortDescription}}</a>
                </div>
                <div v-else>
                  <a>Description: {{toView.venue.shortDescription}}</a>
                </div>
              </div>
              <div class="row">
                <b-link @click.prevent="showDesc"> Toggle Long Description</b-link>
              </div>
              <div class="row" v-if="toView.venue.admin.userId == this.$cookies.get('auth_Id')">
                <div class="col">
                  <b-button v-b-modal.editVenueModal @click.prevent="venueError = null">Edit Details</b-button>
                </div>
                <div class="col">
                  <b-button v-b-modal.photoVenueModal>Add Photo</b-button>
                </div>
              </div>
            </b-tab>
            <b-tab title="Photos">
              <b-carousel
                id="carousel-1"
                v-model="slide"
                :interval="0"
                img-height="480"
                controls
                indicators
                background="#D3D3D3"
                style="text-shadow: 1px 1px 2px #333;">
                <div v-for="photo in toView.venue.photos">
                  <b-carousel-slide :text="photo.photoDescription" :img-src="photo.photoFilename.src">
                    <div class="row strip">
                      <div class="col" v-if="toView.venue.admin.userId == $cookies.get('auth_Id')">
                        <b-button v-if="!photo.isPrimary" variant="outline-primary" @click.prevent="makePrimary(photo.photoFilename.fileName)">Make Primary</b-button>
                        <b-button variant="outline-danger" @click.prevent="deletePhoto(photo.photoFilename.fileName)">Delete</b-button>
                      </div>

                    </div>
                  </b-carousel-slide>
                </div>
              </b-carousel>
            </b-tab>
            <b-tab title="Reviews">
              <b-carousel
                id="carousel-2"
                v-model="slide"
                :interval="0"
                img-height="480"
                controls
                indicators
                background="#696969"
                style="text-shadow: 1px 1px 2px #333;"
              >
                <div v-for="review in reviews">
                  <b-carousel-slide img-blank img-alt="Blank image" style="height: 30vh;">
                    <div class="row">
                      <h4>{{review.reviewBody}}</h4>
                    </div>
                    <div class="row">
                      <a>Date Posted: {{review.timePosted}}</a>
                    </div>
                    <div class="row">
                      <a>Star Rating: {{review.starRating}}</a>
                    </div>
                    <div class="row">
                      <a>Cost Rating: {{review.costRating}}</a>
                    </div>
                    <div class="row">
                      <a :href="'/users/' + review.reviewAuthor.userId">Reviewer: {{review.reviewAuthor.username}}</a>
                    </div>
                  </b-carousel-slide>
                </div>
              </b-carousel>
            </b-tab>
          </b-tabs>
        </div>
      </b-modal>
    </div>

    <b-modal id="reviewModal" hide-footer title="Post Review">
      <form>
        <div class="col">
          <div v-if="this.reviewError" class="col">
            <a class="alert alert-danger">{{reviewError}}</a>
          </div>
          <div class="col">
            <b-form-group
              label="Select Venue"
              name="reviewVenue">
              <b-form-select v-model="reviewVenue" :options="venuesToSelect" size="sm"></b-form-select>
              <a v-if="!$v.reviewVenue.required">Required</a>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
              label="Star Rating"
              name="starRating">
              <b-input type="number" min="1" max="5" v-model="starRating"></b-input>
              <a v-if="!$v.starRating.required">Required</a>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
              label="Cost Rating"
              name="costRating">
              <b-form-select v-model="costRating" :options="costRatings" size="sm"></b-form-select>
              <a v-if="!$v.costRating.required">Required</a>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
              label="Review Body"
              name="reviewBodyText">
              <b-input type="text" v-model="reviewBody"></b-input>
              <a v-if="!$v.reviewBody.required">Required</a>
            </b-form-group>
          </div>
          <div class="col">
            <b-button type="submit" @click.prevent="postReview" :disabled="!($v.starRating.required &&
              $v.costRating.required && $v.reviewVenue.required && $v.reviewBody.required)">Post Review</b-button>
          </div>
        </div>
      </form>
    </b-modal>

    <b-modal id="createVenueModal" hide-footer title="Add Venue">
      <form>
        <div class="col">
          <div v-if="this.venueError" class="col">
            <a class="alert alert-danger">{{venueError}}</a>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group
                label="Venue Name"
                name="venueName">
                <b-input type="text" v-model="venueName"></b-input>
                <a v-if="!$v.venueName.required">Required</a>
              </b-form-group>
            </div>
            <div class="col">
              <b-form-group
                label="Short Description"
                name="shortDescription">
                <b-input type="text" v-model="shortDescription"></b-input>
                <a v-if="!$v.shortDescription.required">Required</a>
              </b-form-group>
            </div>
          </div>
          <div class="col">
            <b-form-group
              label="Select a Category"
              name="venueCategory">
              <b-form-select v-model="venueCategory" :options="categories" size="sm"></b-form-select>
              <a v-if="!$v.venueCategory.required">Required</a>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
              label="Long Description"
              name="longDescription">
              <b-input type="text" v-model="longDescription"></b-input>
              <a v-if="!$v.longDescription.required">Required</a>
            </b-form-group>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group
                label="City"
                name="venueCity">
                <b-input type="text" v-model="venueCity"></b-input>
                <a v-if="!$v.venueCity.required">Required</a>
              </b-form-group>
            </div>
            <div class="col">
              <b-form-group
                label="Address"
                name="venueAddress">
                <b-input type="text" v-model="venueAddress"></b-input>
                <a v-if="!$v.venueAddress.required">Required</a>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group
                label="Latitude"
                name="latitude">
                <b-input type="number" v-model="latitude"></b-input>
                <a v-if="!$v.latitude.required">Required</a>
                <a v-if="!$v.latitude.minValue || !$v.latitude.maxValue">Latitude must be between (-90, 90)</a>
              </b-form-group>
            </div>
            <div class="col">
              <b-form-group
                label="Longitude"
                name="longitude">
                <b-input type="number" v-model="longitude" min="-90" max="90"></b-input>
                <a v-if="!$v.longitude.required">Required</a>
                <a v-if="!$v.longitude.minValue || !$v.longitude.maxValue">Longitude must be between (-90, 90)</a>
              </b-form-group>
            </div>
          </div>
          <div class="col">
            <b-button type="submit" @click.prevent="postVenue" :disabled="!($v.venueName.required &&
              $v.shortDescription.required && $v.venueCategory.required && $v.longDescription.required &&
              $v.venueCity.required && $v.venueAddress.required && $v.latitude.required && $v.longitude.required &&
              $v.latitude.minValue && $v.latitude.maxValue && $v.longitude.minValue && $v.longitude.maxValue)"
            >Add Venue</b-button>
          </div>
        </div>
      </form>
    </b-modal>

    <b-modal id="editVenueModal" hide-footer title="Edit Venue">
      <form>
        <div class="col">
          <div v-if="this.venueError" class="col">
            <a class="alert alert-danger">{{venueError}}</a>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group
                label="Venue Name"
                name="venueNameEdit">
                <b-input type="text" v-model="venueName"></b-input>
                <a v-if="!$v.venueName.required">Required</a>
              </b-form-group>
            </div>
            <div class="col">
              <b-form-group
                label="Short Description"
                name="shortDescriptionEdit">
                <b-input type="text" v-model="shortDescription"></b-input>
                <a v-if="!$v.shortDescription.required">Required</a>
              </b-form-group>
            </div>
          </div>
          <div class="col">
            <b-form-group
              label="Select a Category"
              name="venueCategoryEdit">
              <b-form-select v-model="venueCategory" :options="categories" size="sm"></b-form-select>
              <a v-if="!$v.venueCategory.required">Required</a>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
              label="Long Description"
              name="longDescriptionEdit">
              <b-input type="text" v-model="longDescription"></b-input>
              <a v-if="!$v.longDescription.required">Required</a>
            </b-form-group>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group
                label="City"
                name="venueCityEdit">
                <b-input type="text" v-model="venueCity"></b-input>
                <a v-if="!$v.venueCity.required">Required</a>
              </b-form-group>
            </div>
            <div class="col">
              <b-form-group
                label="Address"
                name="venueAddressEdit">
                <b-input type="text" v-model="venueAddress"></b-input>
                <a v-if="!$v.venueAddress.required">Required</a>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group
                label="Latitude"
                name="latitudeEdit">
                <b-input type="number" v-model="latitude"></b-input>
                <a v-if="!$v.latitude.required">Required</a>
                <a v-if="!$v.latitude.minValue || !$v.latitude.maxValue">Latitude must be between (-90, 90)</a>
              </b-form-group>
            </div>
            <div class="col">
              <b-form-group
                label="Longitude"
                name="longitudeEdit">
                <b-input type="number" v-model="longitude" min="-90" max="90"></b-input>
                <a v-if="!$v.longitude.required">Required</a>
                <a v-if="!$v.longitude.minValue || !$v.longitude.maxValue">Longitude must be between (-90, 90)</a>
              </b-form-group>
            </div>
          </div>
          <div class="col">
            <b-button type="submit" @click.prevent="patchVenue" :disabled="!($v.venueName.required &&
              $v.shortDescription.required && $v.venueCategory.required && $v.longDescription.required &&
              $v.venueCity.required && $v.venueAddress.required && $v.latitude.required && $v.longitude.required &&
              $v.latitude.minValue && $v.latitude.maxValue && $v.longitude.minValue && $v.longitude.maxValue)"
            >Update Venue</b-button>
          </div>
        </div>
      </form>
    </b-modal>

    <b-modal id="photoVenueModal" hide-footer title="Add Photo for Venue">
      <form>
        <div class="col">
          <div v-if="this.photoError" class="col">
            <a class="alert alert-danger">{{photoError}}</a>
          </div>
          <input type="file" @change="onFileChanged" accept="image/png, image/jpeg">
          <b-form-checkbox
            id="checkbox-1"
            v-model="isPrimary"
            name="checkbox-1"
            value="true"
            unchecked-value="false"
          >
            Make Photo Primary
          </b-form-checkbox>
          <input type="text" v-model="photoDescription" placeholder="Photo Description">
          <div v-if="photoUpload">
            <img class="img-fill" :src="photoUpload" alt="Display Failed">
          </div>
          <div v-else>
            <img class="img-fill" src="../assets/venueDefault.png" alt="Display Failed">
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-button @click.prevent="closePhotoModal" >Cancel</b-button>
          </div>
          <div class="col">
            <b-button @click.prevent="postPhoto">Save Photo</b-button>
          </div>

        </div>
      </form>
    </b-modal>

  </div>
</template>

<script>
  import NavBar from './NavBar'
  import {required, minValue, maxValue} from 'vuelidate/lib/validators'
  export default {
    name: "Venues",
    components: {NavBar},
    data() {
      return {
        selected: null,
        cities: [],
        venuesData: [],
        search: null,
        categories: [],
        category: null,
        sortOption: "high - low star rating",
        sorting: ["high - low star rating",
            "low - high star rating",
          "high - low cost rating",
          "low - high cost rating",
          "closet - furthest distance",
          "furthest - closet distance"
        ],
        minStar: null,
        maxCost: 0,
        costRatings: [
          {"text": "Free", "value": 0},
          {"text": "$", "value": 1},
          {"text": "$$", "value": 2},
          {"text": "$$$", "value": 3},
          {"text": "$$$$", "value": 4}
        ],
        toView: {
          venue: null,
          cost: "Free",
          star: 3
        },
        showLongDesc: 1,
        slide: 0,
        sliding: null,
        reviews: [],
        venuesToSelect: [],
        reviewVenue: "",
        costRating: 0,
        starRating: 1,
        reviewBody: "",
        reviewError: "",
        venueError: "",
        venueCategory: "",
        venueName: "",
        shortDescription: "",
        longDescription: "",
        venueCity: "",
        latitude: "",
        longitude: "",
        venueAddress: "",
        myLatitude: null,
        myLongitude: null,
        coords: null,
        venueIdEdit: "",
        photoUpload: "",
        photoError: "",
        imageType: "",
        venuePhotoId: "",
        photoDescription: "",
        isAdmin: "",
        categoriesMap: new Map(),
        isPrimary: "",
        photoToPost: "",
        batches: new Map(),
        currentBatch: 0,
        numBatches: null,
        imageValid: true,
        image: ""
      }
    },
    mounted() {
      this.getVenues();
      this.setCategories();
      this.$getLocation()
        .then(coordinates => {
          this.myLatitude = coordinates.lat;
          this.myLongitude = coordinates.lng;
        });
    },
    methods: {
      getVenues: function () {
        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            this.venuesData = response.data;
            this.venuesToSelect = [];
            for (var i = 0; i < this.venuesData.length; i++) {
              this.venuesToSelect.push({"text": this.venuesData[i].venueName, "value": this.venuesData[i].venueId});
              if (this.venuesData[i].primaryPhoto) {
                this.setPhoto(i);
              }
            }
            this.reviewVenue = response.data[0].venueId;
            this.setCities();
            this.setCategories();
            this.formBatches();
          }, function (error) {
            alert("Error retrieving venues");
          });
      },
      setPhoto: function (index) {
        if (this.venuesData[index].primaryPhoto) {
          this.venuesData[index].primaryPhoto = 'http://localhost:4941/api/v1/venues/' + this.venuesData[index].venueId + "/photos/" + this.venuesData[index].primaryPhoto;
        }
      },
      setCities: function () {
        var citySet = new Set();
        var categorySet = new Set();
        for (var i = 0; i < this.venuesData.length; i++) {
          citySet.add(this.venuesData[i].city);
          categorySet.add(this.venuesData[i].categoryId);
        }
        var temp = Array.from(citySet);
        for (var i = 0; i < temp.length; i++) {
          this.cities.push(temp[i]);
        }
        this.cities.push({"value": null, "text": "Select a City"});
      },
      setCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categoriesMap.clear();
             for(let row of response.data) {
                this.categories.push({
                  "value": row.categoryId,
                  "text": row.categoryName
                });
                this.categoriesMap.set(row.categoryId, row.categoryName);
             }
          }, function (error) {
            alert("Error retrieving categories");
          });
      },
      filterVenues: function () {
        let url = 'http://localhost:4941/api/v1/venues';
        let first = false;
        if (this.selected) {
          if (!first) {
            url += "?";
            first = true;
          }
          url += "city=" + this.selected;
        }
        if (this.search) {
          if (!first) {
            url += "?q=" + this.search;
            first = true;
          } else {
            url += "&q=" + this.search;
          }
        }
        if (this.category) {
          if (!first) {
            url += "?categoryId=" + this.category;
            first = true;
          } else {
            url += "&categoryId=" + this.category;
          }
        }
        if (this.sortOption) {
          let value = "STAR_RATING";
          let order = "false";
          if (this.sortOption === "high - low star rating") {
            value = "STAR_RATING";
            order = "false";
          } else if (this.sortOption === "low - high star rating") {
            value = "STAR_RATING";
            order = "true";
          } else if (this.sortOption === "high - low cost rating") {
            value = "COST_RATING";
            order = "true";
          } else if (this.sortOption === "low - high cost rating") {
            value = "COST_RATING";
            order = "false";
          } else if (this.sortOption === "closet - furthest distance") {
            value = "DISTANCE";
            order = "false";
          } else if (this.sortOption === "furthest - closet distance") {
            value = "DISTANCE";
            order = "true";
          }
          if (!first) {
            url += "?sortBy=" + value + "&reverseSort=" + order;
            first = true;
          } else {
            url += "&sortBy=" + value + "&reverseSort=" + order;
          }
          if (value === "DISTANCE") {
            url += "&myLatitude=" + this.myLatitude;
            url += "&myLongitude=" + this.myLongitude;
          }
        }
        if (this.minStar) {
          if (!first) {
            url += "?minStarRating=" + this.minStar;
            first = true;
          } else {
            url += "&minStarRating=" + this.minStar;
          }
        }
        if (this.maxCost) {
          if (!first) {
            url += "?maxCostRating=" + this.maxCost;
            first = true;
          } else {
            url += "&maxCostRating=" + this.maxCost;
          }
        }
        this.$http.get(url)
          .then(function (response) {
            this.venuesData = response.data;
            this.venuesToSelect = [];
            for (var i = 0; i < this.venuesData.length; i++) {
              this.venuesToSelect.push({"text": this.venuesData[i].venueName, "value": this.venuesData[i].venueId});
              if (this.venuesData[i].primaryPhoto) {
                this.setPhoto(i);
              }
            }
            this.formBatches();
          }, function (error) {
            alert("Error filtering venues, please try again");
          });


      },
      setVenue: function (venue, isEdit) {
        this.$http.get('http://localhost:4941/api/v1/venues/' + venue.venueId)
          .then(function (response) {
            this.toView.venue = response.data;
            if (venue.modeCostRating === 1) {
              this.toView.cost = "$";
            } else if (venue.modeCostRating === 2) {
              this.toView.cost = "$$";
            } else if (venue.modeCostRating === 3) {
              this.toView.cost = "$$$";
            } else if (venue.modeCostRating === 4) {
              this.toView.cost = "$$$$";
            }
            if (venue.meanStarRating) {
              this.toView.star = venue.meanStarRating;
            }
            this.getReviews(venue.venueId);
            this.venueIdEdit = venue.venueId;
            this.venuePhotoId = venue.venueId;
            this.venueName = response.data.venueName;
            this.shortDescription = response.data.shortDescription;
            this.venueCategory = response.data.category.categoryId;
            this.longDescription = response.data.longDescription;
            this.venueCity = response.data.city;
            this.venueAddress = response.data.address;
            this.latitude = response.data.latitude;
            this.longitude = response.data.longitude;
            this.setVenuePhotos();
          }, function (error) {
            if (error.status === 404) {
              alert("Venue not found");
            } else {
              alert("Error retrieving venue data");
            }
          }).then(function () {
            if (isEdit) {
              this.$bvModal.show("editVenueModal");
            } else {
              this.showLongDesc = null;
              this.$bvModal.show("venueModal");
            }
        });
      },
      showDesc: function () {
        this.showLongDesc = !this.showLongDesc;
      },
      getReviews: function (venueId) {
        this.$http.get('http://localhost:4941/api/v1/venues/' + venueId + "/reviews")
          .then(function (response) {
            this.reviews = response.data;
          }, function (error) {
            alert("Error getting venue: " + venueId + "'s reviews");
          });
      },
      postReview: function () {
        this.reviewError = null;
        if (!this.reviewVenue) {
          this.reviewError = "Venue is required"
        }
        if (!this.starRating) {
          this.reviewError = "Star Rating is required"
        }
        if (!this.costRating) {
          this.reviewError = "Cost Rating is required"
        }
        if (!this.reviewBody) {
          this.reviewError = "Review Body is required"
        }
        if (!this.reviewError) {
          this.$http.post("http://localhost:4941/api/v1/venues/" + this.reviewVenue + "/reviews", JSON.stringify({
            "reviewBody": this.reviewBody,
            "starRating": parseInt(this.starRating, 10),
            "costRating": this.costRating
          }), {
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': this.$cookies.get('auth_token')
            }
          }).then(function (res) {
            this.$bvModal.hide("reviewModal")
          }, function (error) {
            if (error.statusText === "Forbidden: cannot post a review on your own venue") {
              this.reviewError = "You cannot post a review on your own venue"
            } else if (error.statusText === "Forbidden: cannot post more than one review for the same venue") {
              this.reviewError = "You cannot post a review for a venue you have already reviewed"
            } else {
              this.reviewError = error.statusText;
            }
          });
        }
      },
      postVenue: function () {
        this.venueError = null;
        this.$http.post("http://localhost:4941/api/v1/venues", JSON.stringify({
          "venueName": this.venueName,
          "categoryId": this.venueCategory,
          "city": this.venueCity,
          "shortDescription": this.shortDescription,
          "longDescription": this.longDescription,
          "address": this.venueAddress,
          "latitude": parseFloat(this.latitude),
          "longitude": parseFloat(this.longitude)
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.$cookies.get('auth_token')
          }
        }).then(function (res) {
          this.getVenues();
          this.$bvModal.hide("createVenueModal")
        }, function (error) {
          this.venueError = error.statusText;
        });
      },
      patchVenue: function () {
        this.$http.patch("http://localhost:4941/api/v1/venues/" +  this.venueIdEdit, JSON.stringify({
          "venueName": this.venueName,
          "categoryId": this.venueCategory,
          "city": this.venueCity,
          "shortDescription": this.shortDescription,
          "longDescription": this.longDescription,
          "address": this.venueAddress,
          "latitude": this.latitude,
          "longitude": this.longitude
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.$cookies.get('auth_token')
          }
        }).then(function (res) {
          this.getVenues();
          this.$bvModal.hide("editVenueModal");
        }, function (error) {
          this.venueError = error.statusText;
        });
      },
      getUserVenues: function () {
        this.$http.get('http://localhost:4941/api/v1/venues?adminId=' + this.$cookies.get('auth_Id'))
          .then(function (response) {
            this.venuesData = response.data;
            this.venuesToSelect = [];
            for (var i = 0; i < response.data.length; i++) {
              this.venuesToSelect.push({"text": response.data[i].venueName, "value": response.data[i].venueId});
            }
            this.reviewVenue = response.data[0].venueId;
            this.setCities();
            this.setCategories();
          }, function (error) {
            alert("Error getting your venues");
          });
      },
      onFileChanged: function (event) {
        const file = event.target.files[0];
        const fileType = file['type'];
        this.imageValid = true;
        if (file.size > 20971520) {
          alert('Profile image must be below 20MB');
          this.imageValid = false;
        } else if (fileType !== "image/jpeg" && fileType !== "image/png") {
          alert('Profile image must be jpeg or png');
          this.imageValid = false;
        } else {
          this.photoToPost = file;
          var reader = new FileReader();
          this.imageType = file.type;
          reader.onload = (e) => {
            this.photoUpload = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      closePhotoModal: function () {
        this.$bvModal.hide("photoVenueModal");
      },
      postPhoto: function () {
        let formData = new FormData();
        formData.append('photo', this.photoToPost);
        formData.append('description', this.photoDescription);
        formData.append('makePrimary', this.isPrimary === 'true');
        this.$http.post("http://localhost:4941/api/v1/venues/" +  this.venuePhotoId + "/photos", formData
        , {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Authorization': this.$cookies.get('auth_token')
          }
        }).then(function (res) {
          this.profilePictureUpload = null;
          location.reload();
        }, function (error) {
          this.photoError = error.statusText;
        });
      },
      setVenuePhotos: function () {
        for (let i = 0; i < this.toView.venue.photos.length; i++) {
              let filename = this.toView.venue.photos[i].photoFilename;
              this.toView.venue.photos[i].photoFilename = {
                "src": 'http://localhost:4941/api/v1/venues/' + this.venuePhotoId + "/photos/" + this.toView.venue.photos[i].photoFilename,
                "fileName": filename,
                "description": this.toView.venue.photos[i].photoDescription
              };
        }
      },
      deletePhoto: function (filename) {
        this.$http.delete('http://localhost:4941/api/v1/venues/' + this.venuePhotoId + "/photos/" + filename, {
          headers: {
            'X-Authorization': this.$cookies.get('auth_token')
          }
        })
          .then(function (response) {
            location.reload();
          }, function (error) {
            alert("Error deleting photo: " + filename);
          });
      },
      formBatches: function () {
        this.batches.clear();
        let numVenues = this.venuesData.length;
        let numShown = 0;
        for (let i = 0; i < Math.floor(numVenues / 10); i++) {
          this.batches.set(i, {
            "start": numShown,
            "end": numShown + 9
          });
          numShown += 10;
        }
        if (numShown < numVenues) {
          this.batches.set(this.batches.values.length + 1, {
            "start": numShown,
            "end": numShown + ((numVenues - numShown) - 1)
          });
        }
        this.numBatches = this.batches.values.length;
        this.currentBatch = 0;
      },
      makePrimary: function (filename) {
        this.$http.post('http://localhost:4941/api/v1/venues/' + this.venuePhotoId + "/photos/" + filename +"/setPrimary", {
          headers: {
            'X-Authorization': this.$cookies.get('auth_token')
          }
        })
          .then(function (response) {
            location.reload();
          }, function (error) {
            alert("Error setting primary photo as: " + filename);
          });
      }
    },
    validations: {
      venueName: {
        required
      },
      shortDescription: {
        required
      },
      venueCategory: {
        required
      },
      longDescription: {
        required
      },
      venueAddress: {
        required
      },
      latitude: {
        required,
        minValue: minValue(-90),
        maxValue: maxValue(90)
      },
      longitude: {
        required,
        minValue: minValue(-180),
        maxValue: maxValue(180)
      },
      venueCity: {
        required
      },
      starRating: {
        required
      },
      costRating: {
        required
      },
      reviewBody: {
        required
      },
      reviewVenue: {
        required
      }
    }
  }
</script>

<style scoped>

  .img-fill {
    object-fit: contain;
    height: 30vh;
    width: 20vw;
  }

  .strip {
    background: rgba(1, 1, 1, 0.3);
    border-radius: 5rem;
  }
</style>
