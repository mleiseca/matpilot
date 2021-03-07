<template>
  <v-main>

    <div id="core-view">
      <email-confirmation-banner></email-confirmation-banner>

      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </div>
    <!--<core-footer v-if="$route.name !== 'Maps'" />-->
  </v-main>
</template>

<script>

export default {
  metaInfo () {
    return {
      title: 'MatPilot'
    }
  }
}
</script>

<style lang="scss">
#core-view {
  padding-bottom: 100px;
}
</style>
