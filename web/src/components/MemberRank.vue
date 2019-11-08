<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs9 md10>
        <div class="headline">Rank</div>
      </v-flex>
      <v-flex xs3 md2 pt-1>
        <v-btn flat @click="addRank">
          <v-icon >mdi-plus</v-icon>
        </v-btn>
        <v-dialog v-model="addRankDialog" max-width="500px" :persistent=true>
          <v-card>
            <v-card-title>
              <div class="headline">Add Rank</div>
            </v-card-title>
            <v-card-text>
              <v-form ref="newRankForm" :lazyValidation=true>
                <v-text-field
                  class="purple-input"
                  label="Rank"
                  :rules="[rules.required]"
                  autocomplete="off"
                  v-model="newRank"/>

                <v-menu
                  ref="promotionDateMenu"
                  v-model="promotionDateMenu"
                  :close-on-content-click="true"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="promotionDate"
                      label="Promotion Date"
                      prepend-icon="mdi-calendar"
                      :rules="[rules.required]"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="promotionDatePicker"
                    v-model="promotionDate"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1990-01-01"
                    @change="savePromotionDate"
                  ></v-date-picker>
                </v-menu>
              </v-form>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" flat @click="addRankDialog = false">Cancel</v-btn>
              <v-btn color="primary" flat @click="saveNewRank">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>

      <v-flex xs12 v-if="rankHistory && rankHistory.length > 0" >
        <div v-for="r in rankHistory" v-bind:key="r.id" class="rankHistoryWrapper">
          {{ formatAwardDate(r.awardDate) }} - {{ r.newRank }}
        </div>
      </v-flex>
        <!--<div class="headline">Rank</div>-->
      <!--</v-flex>-->

      <!--<v-flex xs12 v-if="!member.rank">-->
        <!--<div class="leadingIcon">-->
          <!--<v-icon >mdi-email-outline</v-icon>-->
        <!--</div>-->

        <!--<div class="dataElement">{{ member.rank }}</div>-->
        <!--<div class="dataElement">{{ member.rankAwardDate }}</div>-->
      <!--</v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { EventBus } from './../event-bus.js'

export default {
  name: 'MemberRank',
  props: {
    member: { type: Object },
    gym: { type: Object }
  },
  data () {
    return {
      addRankDialog: false,
      newRank: null,
      promotionDate: null,
      promotionDateMenu: false,
      newPromotionDate: null,
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  computed: {
    ...mapGetters('member-rank-history', {
      findMemberRankHistoryInStore: 'find'
    }),
    rankHistory () {
      return this.findMemberRankHistoryInStore({
        query: {
          memberId: this.member.id,
          $sort: {
            awardDate: -1
          }
        }
      }).data
    }
  },
  mounted: async function () {
    await this.findMemberRankHistory({
      query: {
        $limit: 50,
        memberId: this.member.id,
        gymId: this.gym.id
      }
    })
  },
  methods: {
    ...mapActions('member-rank-history', {
      findMemberRankHistory: 'find'
    }),
    addRank: function () {
      this.addRankDialog = true
      this.newRank = null
      this.promotionDate = null
      this.$refs.newRankForm.resetValidation()
      //      this.addRankDialog = true
    },
    savePromotionDate (date) {
      this.newPromotionDate = moment(date).format('YYYY-MM-DD') + 'T00:00:00'
    },
    formatAwardDate: function (date) {
      return moment(date).format('MMM D, YYYY')
    },
    saveNewRank: function () {
      console.log(this.$refs)
      if (!this.$refs.newRankForm.validate()) {
        EventBus.$emit('user-message', { message: 'Please correct the errors above', type: 'error' })
        return
      }

      this.addRankDialog = false

      console.log('saving new rank')
      EventBus.$emit('loading', { message: 'Adding Rank' })
      this.$store.dispatch('member-rank-history/create', {
        gymId: this.gym.id,
        memberId: this.member.id,
        awardDate: this.newPromotionDate,
        newRank: this.newRank
      })
        .then((result) => {
          console.log('Got result for new rank:', result)
          EventBus.$emit('loading', { done: true })
        }).catch((e) => {
          EventBus.$emit('loading', { done: true })
          EventBus.$emit('user-message', { message: `Error saving new rank: ${e.message}`, type: 'error' })
        })
    }
  }
}
</script>

<style scoped>
.rankHistoryWrapper:first-child{
  font-weight: bold;
  font-size: large;
  padding-bottom: 10px;
}
</style>
