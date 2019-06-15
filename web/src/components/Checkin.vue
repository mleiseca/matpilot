<template>
  <v-form>
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="First Name"
            v-model="member.firstName"/>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            class="purple-input"
            label="Last Name"
            v-model="member.lastName"/>
        </v-flex>

        <v-flex xs12 text-xs-right>
          <v-btn
            class="mx-0 font-weight-light"
            color="success"
            @click="save">
            Save
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>

  export default {
    name: 'GymEventCheckin',
    props: ['memberId', 'state'],
    name: 'Checkin',
    props: {
      //    Note: if you provide a vuex member object, the vuex object will be included with the 'member-save' event
      //    If you don't provide a member, you will get back just a data object.
      member: {
        type: Object,
        default: function () {
          return {
            firstName: '',
            lastName: ''
          }
        }
      }
    },
    data () {
      return {
        loading: false,
        errorMessage: null,
        showErrorMessage: false
      }
    },
    methods: {
      save: function () {
        this.$emit('attendance-toggle', { memberId: this.memberId, state: false} )
      }
    }
  }
</script>

<style scoped>

  h1 {
    padding-left: .5rem;
  }

</style>


