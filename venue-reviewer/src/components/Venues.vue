<template>
  <div id="venues">
    <NavBar></NavBar>
    <div>
      <b-jumbotron id="jumbotron" header="Venues" lead="Explore Venues in the System">
        <b-button variant="primary">Add Venue</b-button>
      </b-jumbotron>
      <b-button variant="primary" v-b-modal.reviewModal>Post Review</b-button>
      <div class="row">
        <div class="col">
          <b-form-group
            label="Select a City">
            <b-form-select v-model="selected" :options="cities" size="sm"></b-form-select>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Enter a Venue Name">
            <b-input v-model="search"></b-input>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Select a Category">
            <b-form-select v-model="category" :options="categories" size="sm"></b-form-select>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Sort by Rating">
            <b-form-select v-model="sortOption" :options="sorting" size="sm"></b-form-select>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Minimum Star Rating">
            <b-input type="number" min="1" max="5" v-model="minStar"></b-input>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group
            label="Max Cost Rating">
            <b-form-select v-model="maxCost" :options="costRatings" size="sm"></b-form-select>
          </b-form-group>
        </div>
      </div>
      <b-button variant="primary" @click.prevent="filterVenues">Filter Venues</b-button>
      <b-button variant="primary" @click.prevent="getVenues">Clear Search</b-button>
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
              <div class="row">
              <a>Mean Star Rating: {{venue.meanStarRating}}</a>
              </div>
              <div class="row">
              <a>Mode Cost Rating: {{venue.modeCostRating}}</a>
              </div>
              <div class="row">
                <b-button @click.prevent="setVenue(venue)">View Details</b-button>
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
            <b-tab title="Photos"></b-tab>
            <b-tab title="Reviews">
              <b-carousel
                id="carousel-1"
                v-model="slide"
                :interval="0"
                img-height="480"
                controls
                indicators
                background="#696969"
                style="text-shadow: 1px 1px 2px #333;"
              >
                <div v-for="review in reviews">
                  <b-carousel-slide img-blank img-alt="Blank image" style="height: 30vh; color: black">
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
          <div class="col">
            <b-form-group
              label="Select Venue">
              <b-form-select v-model="reviewVenue" :options="venuesToSelect" size="sm"></b-form-select>
              <a v-if="!$v.reviewVenue.check">Required</a>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
              label="Star Rating">
              <b-input type="number" min="1" max="5" v-model="starRating"></b-input>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
              label="Cost Rating">
              <b-form-select v-model="costRating" :options="costRatings" size="sm"></b-form-select>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
              label="Review Body">
              <textarea class="form-control" rows="3" v-model="reviewBody"></textarea>
              <a v-if="!$v.reviewBody.check">Required</a>
            </b-form-group>
          </div>
          <div class="col">
            <b-button type="submit" @click.prevent="postReview">Post Review</b-button>
          </div>
        </div>
      </form>
    </b-modal>

  </div>
</template>

<script>
  import NavBar from './NavBar'
  import {required} from 'vuelidate/lib/validators'
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
        sortOption: null,
        sorting: ["high - low star rating",
            "low - high star rating",
          "high - low cost rating",
          "low - high cost rating"
        ],
        minStar: null,
        maxCost: null,
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
        costRating: "",
        starRating: "",
        reviewBody: ""
      }
    },
    mounted() {
      this.getVenues();
      this.setCategories();
    },
    methods: {
      getVenues: function () {
        this.$http.get('http://localhost:4941/api/v1/venues')
          .then(function (response) {
            this.venuesData = response.data;
            for (var i = 0; i < response.data.length; i++) {
              this.venuesToSelect.push({"text": response.data[i].venueName, "value": response.data[i].venueId});
            }
            console.log(this.venuesToSelect);
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
            this.categories.push({"value": null, "text": "Select a Category"});
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
          }
          if (!first) {
            url += "?sortBy=" + value + "&reverseSort=" + order;
            first = true;
          } else {
            url += "&sortBy=" + value + "&reverseSort=" + order;
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
          }, function (error) {
            console.log(error);
          });
      },
      setVenue: function (venue) {
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
            this.showLongDesc = null;
            this.$bvModal.show("venueModal");
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

        }, function (error) {
          this.signUpErr = error.statusText;
        });
      }
    },
    validations: {
      reviewVenue: {
        required
      },
      reviewBody: {
        required
      }
    }
  }
</script>

<style scoped>

</style>
