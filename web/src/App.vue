<template>
  <v-app>
    <core-filter />
    <core-toolbar />
    <core-drawer />
    <core-view />
  </v-app>
</template>

<style lang="scss">
  @import '@/styles/index.scss';

  /* Remove in 1.2 */
  .v-datatable thead th.column.sortable i {
    vertical-align: unset;
  }
</style>

<!--<template>-->
  <!--<div id="app">-->

    <!--<template v-if="user">-->
      <!--<mdc-top-app-bar title="Title2" event="nav">-->
        <!--&lt;!&ndash;<mdc-top-app-bar-action @click="showHelp" icon="help"></mdc-top-app-bar-action>&ndash;&gt;-->
        <!--<mdc-top-app-bar-action icon="help"></mdc-top-app-bar-action>-->
      <!--</mdc-top-app-bar>-->
      <!--<mdc-drawer toggle-on="nav" temporary>-->
        <!--<div id="nav">-->
          <!--<router-link to="/">Home</router-link> |-->
          <!--<router-link to="/about">About</router-link>-->
          <!--&lt;!&ndash;<m-button>Hello</m-button>&ndash;&gt;-->
        <!--</div>-->
      <!--</mdc-drawer>-->
    <!--</template>-->

      <!--<main>-->

        <!--<div class="main-body">-->
          <!--<router-view/>-->
        <!--</div>-->
      <!--</main>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
  <!--name: 'appview',-->
  <!--computed: {-->
    <!--user () {-->
      <!--return this.$store.state.auth.user-->
    <!--}-->
  <!--}-->
<!--}-->

<!--</script>-->
<!--<style>-->

<!--</style>-->
