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
              <div class="headline" v-if="!selectedRank">Add Rank</div>
              <div class="headline" v-if="selectedRank">Edit Rank</div>
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

      <div class="rankHistoryWrapper">
        <div v-for="r in rankHistory" v-bind:key="r.id"
             v-bind:class="getRankClass(r.id)"
             class="rankRow" @click="selectedRank = r">
          <span class="rankDescription">{{ r.newRank }}</span> - <span class="rankDate">{{ formatAwardDate(r.awardDate) }}</span>

          <div v-if="selectedRank && r.id == selectedRank.id" class="action">
            <v-btn flat @click="editRank(r)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn flat @click="deleteConfirmDialog = true">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </v-layout>
    <v-dialog
      v-model="deleteConfirmDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Delete rank?</v-card-title>

        <v-card-text>
          Are you sure you want to delete this rank?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="grey darken-1"
            flat="flat"
            @click="deleteConfirmDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click="deleteSelected()"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      deleteConfirmDialog: null,
      selectedRank: null,
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
      this.newRank = null
      this.promotionDate = moment().format('YYYY-MM-DD')
      this.$refs.newRankForm.resetValidation()
      this.selectedRank = null
      this.addRankDialog = true
    },
    savePromotionDate (date) {
      this.newPromotionDate = moment(date).format('YYYY-MM-DD') + 'T00:00:00'
    },
    formatAwardDate: function (date) {
      return moment(date).format('MMM D, YYYY')
    },
    getRankClass(id) {
      return this.selectedRank !== null && id === this.selectedRank.id ? 'selectedRankRow' : ''
    },
    deleteSelected: function() {
      this.selectedRank.remove()
      this.deleteConfirmDialog = null
    },
    editRank: function(rank) {
      console.log('editing rank', rank)
      this.newRank = this.selectedRank.newRank
      this.promotionDate = moment(this.selectedRank.awardDate).format('YYYY-MM-DD')
      this.savePromotionDate(this.selectedRank.awardDate)

      this.addRankDialog = true
    },
    saveNewRank: function () {
      console.log(this.$refs)
      if (!this.$refs.newRankForm.validate()) {
        EventBus.$emit('user-message', { message: 'Please correct the errors above', type: 'error' })
        return
      }

      this.addRankDialog = false
      if (this.selectedRank) {
        EventBus.$emit('loading', { message: 'Saving Rank' })
        const copyRank = this.selectedRank.clone()
        copyRank.awardDate = this.newPromotionDate
        copyRank.newRank = this.newRank
        copyRank.save()
          .then((result) => {
            console.log('Got result for new rank:', result)
            EventBus.$emit('loading', { done: true })
          }).catch((e) => {
          EventBus.$emit('loading', { done: true })
          EventBus.$emit('user-message', { message: `Error saving rank: ${e.message}`, type: 'error' })
        })
      } else {
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
}
</script>

<style scoped>

.rankHistoryWrapper{
  padding: 10px;
  width: 100%;
}

.rankDescription{
  font-size: large;
}
.rankDate {
  font-style: italic;
  white-space: nowrap;
}
.rankHistoryWrapper .rankRow:first-child {
  padding-bottom: 10px;
}
.rankHistoryWrapper .rankRow:first-child .rankDescription {
  font-size: larger;
  font-weight: bold;
}

.selectedRankRow {
  background-color: #dadada;
  border-radius: 25px;
  padding: 20px;
}

.action {
  display: inline;
  white-space: nowrap;
}

</style>
