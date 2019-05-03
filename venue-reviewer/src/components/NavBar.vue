<template>
    <div>
      <h2>Venue Reviewer</h2>
      <nav>
        <router-link :to="{name:'venues'}">Venues</router-link>
        <router-link :to="{name:'reviews'}">Reviews</router-link>
      </nav>
    </div>
</template>

<script>
    export default {
        name: "NavBar"
    }
</script>

<style scoped>

</style>
