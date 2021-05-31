<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-layout wrap>
      <v-flex xs9 md10>
        <div class="text-h5">{{ member.firstName }}
          <span v-if="member.nickname">({{ member.nickname }})</span>
          {{ member.lastName }} </div>

      </v-flex>
      <v-flex xs3 md2>
        <v-btn text @click="editClick()">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs12 v-if="member.email">
        <div class="leadingIcon">
          <v-icon >mdi-email-outline</v-icon>
        </div>
        <div class="dataElement">{{ member.email }}</div>
      </v-flex>

      <v-flex xs12 v-if="member.phone">
        <div class="leadingIcon">
          <v-icon>mdi-phone-outline</v-icon>
        </div>
        <div class="dataElement">{{ member.phone }}</div>
      </v-flex>

      <v-flex xs12 v-if="member.dateOfBirth ">
        <div class="leadingIcon">
          <v-icon>mdi-cake-variant</v-icon>
        </div>
        <div class="dataElement">{{ formatBirthday(member.dateOfBirth)  }}</div>
      </v-flex>

      <v-flex xs12 v-if="emergencyContactName">
        <div class="leadingIcon">
          <v-icon>mdi-account-alert</v-icon>
        </div>
        <div class="dataElement">{{ emergencyContactName }}</div>
        <div class="dataElement">&bull;</div>
        <div class="dataElement">{{ emergencyContactPhone }}</div>
      </v-flex>

      <v-flex xs12 v-if="guardianContactName">
        <div class="leadingIcon">
          <v-icon>mdi-human-male-boy</v-icon>
        </div>
        <div class="dataElement">{{ guardianContactName }}</div>
        <div class="dataElement">&bull;</div>
        <div class="dataElement">{{ guardianContactPhone }}</div>
      </v-flex>
      <v-flex xs12 v-if="gym && gym.memberTags && gym.memberTags.length > 0">
        <div v-for="tagType in gym.memberTags" v-bind:key="tagType.tag">
          <v-checkbox class="tagDisplay" v-model="member.tags" :label="tagType.name" :value="tagType.tag" :disabled="true"></v-checkbox>
        </div>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import moment from 'moment'

export default {
  name: 'MemberView',
  props: {
    member: { type: Object },
    gym: { type: Object }
  },
  data () {
    return {
      emergencyContactName: null,
      emergencyContactPhone: null,
      guardianContactName: null,
      guardianContactPhone: null,
      tags: []
    }
  },
  mounted: function () {
    this.loadMemberIntoForm(this.member)
    this.$watch('member', m => {
      this.loadMemberIntoForm(m)
    })
  },
  methods: {
    loadMemberIntoForm (m) {
      if (m.emergencyContacts && m.emergencyContacts.length > 0) {
        this.emergencyContactName = m.emergencyContacts[0].name
        this.emergencyContactPhone = m.emergencyContacts[0].phone
      }
      if (m.guardianContacts && m.guardianContacts.length > 0) {
        this.guardianContactName = m.guardianContacts[0].name
        this.guardianContactPhone = m.guardianContacts[0].phone
      }
    },
    formatBirthday (date) { return moment.utc(date).format('MMMM D, YYYY') },
    editClick () {
      this.$emit('member-edit-mode', this.member)
    }
  }
}
</script>

<style scoped>
  /*.headline {*/
  /*padding: 0 0 0 10px;*/
  /*}*/
  .leadingIcon {
    /*padding: 0 0 0 10px;*/
    display: inline-block;
    width: 24px;
  }

  .dataElement {
    padding: 0 0 0 12px;
    display: inline-block;
  }

  .tagDisplay {
    min-height: 0;
  }

</style>
