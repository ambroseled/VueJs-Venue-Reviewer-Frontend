<template>
  <div id="venues">
    <NavBar></NavBar>
    <div>
      <b-jumbotron id="jumbotron" header="Venues" lead="Explore Venues in the System">
        <b-button variant="primary">Add Venue</b-button>
        <b-form-select v-model="selected" :options="cities" size="sm"></b-form-select>
      </b-jumbotron>
      <div class="row">
        <div class="w-25">
          <b-card
            title="Venue Name"
            img-src="https://picsum.photos/600/300/?image=25"
            img-alt="Image">
            <b-card-body>
              <h5>Description</h5>
              <b-table striped hover :items="venueData"></b-table>
            </b-card-body>
          </b-card>
        </div>
      </div>

    </div>

    <div id="content">

    </div>
  </div>
</template>

<script>
  import NavBar from './NavBar'

  export default {
    name: "Venues",
    components: {NavBar},
    data() {
      return {
        selected: null,
        cities: [
          {value: null, text: 'Select a City'},
          {value: 'test', text: "test"}
        ],
        venueData: [
          {header: "Category", data:"Cafe"},
          {header: "City", data:"Christchurch"},
          {header: "Latitude", data:"78.56"},
          {header: "Longitude", data:"120.34"},
          {header: "Mean Star Rating", data:"3"},
          {header: "Mode Cost Rating", data:"4"}
        ]
      }
    }
  }
</script>

<style scoped>

</style>
