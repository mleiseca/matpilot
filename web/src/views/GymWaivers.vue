<template>
  <v-container fill-height fluid grid-list-xl pt-0>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          title="Waivers"
          text="">

          <v-container class="lighten-5">
            <v-row no-gutters>

              <v-data-table
                :headers="headers"
                :items="gymWaivers"
                hide-default-footer>
                <template
                  slot="headerCell"
                  slot-scope="{ header }">
              <span
                class="subheading font-weight-light text--darken-3"
                v-text="header.text"
              />
                </template>

                <template
                  v-slot:item=" {item } "
                >
                  <tr @click="navigateToWaiver"
                      :data-gym-waiver-id="item.id">
                    <td>{{ item.name }}</td>
                  </tr>
                </template>
              </v-data-table>

            </v-row>
            <v-row no-gutters>
              <v-btn @click="navigateToAddWaiver" fab
                     color="success">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-row>

          </v-container>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import fetchWaivers from '../mixins/fetchWaivers'

export default {
  name: 'GymWaivers',

  mixins: [fetchWaivers],
  props: ['gymId'],
  data () {
    return {
      headers: [
        {
          sortable: false,
          text: 'Name'
        }
      ]

    }
  },
  methods: {
    navigateToAddWaiver: function () {
      this.$router.push({ name: 'gym-waivers-add', params: { gymId: this.gymId } })
    },
    navigateToWaiver: function (event) {
      const gymWaiverId = event.currentTarget.dataset['gymWaiverId']
      this.$router.push({ name: 'gym-waivers-view', params: { gymId: this.gymId, gymWaiverId: gymWaiverId } })
    }
  }
}
</script>

<style scoped>

</style>
