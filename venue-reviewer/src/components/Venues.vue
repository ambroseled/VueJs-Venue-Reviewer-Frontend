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
      <b-button variant="primary" @click.prevent="filterVenues">Filter Venues</b-button>
      <b-button variant="primary" @click.prevent="getVenues">Clear Search</b-button>
      <div v-if="this.$cookies.get('auth_token')">
        <b-button variant="primary" @click.prevent="getUserVenues">Your Venues Only</b-button>
      </div>
      <div class="row">
        <div v-for="venue in venuesData" class="w-25">
          <b-card
            :title="venue.venueName">
            <b-card-body>
              <b-img fluid src="https://picsum.photos/id/1025/4951/3301" alt="Profile Photo Display Failed"></b-img>
              <h5>{{venue.shortDescription}}</h5>
              <div class="row">
                <a>City: {{venue.city}}</a>
              </div>
              <div class="row">
                <a>Category: {{venue.categoryId}}</a>
              </div>
              <div v-if="venue.meanStarRating" class="row">
                <a>Mean Star Rating: {{venue.meanStarRating}}</a>
              </div>
              <div v-else class="row">
                <a>Mean Star Rating: 3</a>
              </div>
              <div class="row" v-if="venue.modeCostRating">
                <a>Mode Cost Rating: {{venue.modeCostRating}}</a>
              </div>
              <div v-else class="row">
                <a>Mode Cost Rating: 0</a>
              </div>
              <div v-if="venue.distance" class="row">
                <a>Distance: {{venue.distance}}</a>
              </div>
              <div class="row">
                <div class="col">
                  <b-button @click.prevent="setVenue(venue, 0)">View Details</b-button>
                </div>
                <div v-if="checkAdmin(venue.venueId)" class="col">
                  <b-button @click.prevent="setVenue(venue, 1)">Edit Details</b-button>
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
                <a>Administrator: {{toView.venue.admin.username}}</a>
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
                      <a>Reviewer: {{review.reviewAuthor.username}}</a>
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
            <a>{{reviewError}}</a>
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
            <a>{{venueError}}</a>
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
            <a>{{venueError}}</a>
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
        coords: null
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
            for (var i = 0; i < response.data.length; i++) {
              this.venuesToSelect.push({"text": response.data[i].venueName, "value": response.data[i].venueId});
            }
            this.reviewVenue = response.data[0].venueId;
            this.setCities();
          }, function (error) {
            console.log(error);
          });
      },
      getPhoto: function (filename, venueId) {
        this.$http.get('http://localhost:4941/api/v1/venues/' + venueId + "/photos/" + filename)
          .then(function (response) {
            return response.data;
          }, function (error) {
            console.log(error);
          });
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
             for(let row of response.data) {
                this.categories.push({
                  "value": row.categoryId,
                  "text": row.categoryName
                });
             }
            //this.categories.push({"value": null, "text": "Select a Category"});
          }, function (error) {
            console.log(error);
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
            console.log(response.data);
          }, function (error) {
            console.log(error);
          });


      },
      setVenue: function (venue, isEdit) {
        this.clearVenue();
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
          }, function (error) {
            console.log(error);
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
            console.log(error);
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
      checkAdmin: function (venueId) {
        //TODO Implement
        return true;
      },
      updateVenue: function (venueId) {
        this.$http.patch("http://localhost:4941/api/v1/venues/" +  venueId, JSON.stringify({
          "venueName": 0,
          "categoryId": 0,
          "city": 0,
          "shortDescription": 0,
          "longDescription": 0,
          "address": 0,
          "latitude": 0,
          "longitude": 0
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.$cookies.get('auth_token')
          }
        }).then(function (res) {

        }, function (error) {
          this.error = error.statusText;
        });
      },
      clearVenue: function () {
        
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

</style>
