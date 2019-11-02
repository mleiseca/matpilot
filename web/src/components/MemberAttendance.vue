<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="headline">Attendance</div>
      </v-flex>
      <!--<v-flex xs2>-->
        <!--<v-btn flat>-->
          <!--<v-icon>mdi-pencil</v-icon>-->
        <!--</v-btn>-->
      <!--</v-flex>-->

      <!--<v-flex xs12 v-if="member.email">-->
        <!--<div class="leadingIcon">-->
          <!--<v-icon >mdi-email-outline</v-icon>-->
        <!--</div>-->
        <!--<div class="dataElement">{{ member.email }}</div>-->
      <!--</v-flex>-->

      <!--<v-flex xs12 v-if="member.phone">-->
        <!--<div class="leadingIcon">-->
          <!--<v-icon>mdi-phone-outline</v-icon>-->
        <!--</div>-->
        <!--<div class="dataElement">{{ member.phone }}</div>-->
      <!--</v-flex>-->

      <!--<v-flex xs12 v-if="member.dateOfBirth ">-->
        <!--<div class="leadingIcon">-->
          <!--<v-icon>mdi-cake-variant</v-icon>-->
        <!--</div>-->
        <!--<div class="dataElement">{{ formatBirthday(member.dateOfBirth)  }}</div>-->
      <!--</v-flex>-->

      <!--&lt;!&ndash;{{ gym.memberTags }}&ndash;&gt;-->

      <!--&lt;!&ndash;<div v-if="member.tags && member.tags.length > 0">&ndash;&gt;-->
      <!--&lt;!&ndash;{{ member.tags }}&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->

      <!--<v-flex xs12 v-if="emergencyContactName">-->
        <!--<div class="leadingIcon">-->
          <!--<v-icon>mdi-account-alert</v-icon>-->
        <!--</div>-->
        <!--<div class="dataElement">{{ emergencyContactName }}</div>-->
        <!--<div class="dataElement">&bull;</div>-->
        <!--<div class="dataElement">{{ emergencyContactPhone }}</div>-->
      <!--</v-flex>-->

      <!--<v-flex xs12 v-if="guardianContactName">-->
        <!--<div class="leadingIcon">-->
          <!--<v-icon>mdi-human-male-boy</v-icon>-->
        <!--</div>-->
        <!--<div class="dataElement">{{ guardianContactName }}</div>-->
        <!--<div class="dataElement">&bull;</div>-->
        <!--<div class="dataElement">{{ guardianContactPhone }}</div>-->
      <!--</v-flex>-->

      <!--<v-flex xs12 v-if="member.waiverSignedUrl">-->
        <!--<div class="leadingIcon">-->
          <!--<v-icon>mdi-file-document-box-outline</v-icon>-->
        <!--</div>-->
        <!--<div class="dataElement">-->
          <!--<a :href="member.waiverSignedUrl" target="_blank">-->
            <!--Signed waiver-->
          <!--</a>-->
        <!--</div>-->
      <!--</v-flex>-->
    </v-layout>
  </v-container>

</template>

<script>
// import moment from 'moment'

export default {
  name: 'MemberAttendance',
  props: {
    member: { type: Object },
    gym: { type: Object }
  },
  data () {
    return {
      //        emergencyContactName: null,
      //        emergencyContactPhone: null,
      //        guardianContactName: null,
      //        guardianContactPhone: null
    }
  },
  mounted: function () {
    this.$watch('member', m => {
      //        if (m.emergencyContacts && m.emergencyContacts.length > 0) {
      //          this.emergencyContactName = m.emergencyContacts[0].name
      //          this.emergencyContactPhone = m.emergencyContacts[0].phone
      //        }
      //        if (m.guardianContacts && m.guardianContacts.length > 0) {
      //          this.guardianContactName = m.guardianContacts[0].name
      //          this.guardianContactPhone = m.guardianContacts[0].phone
      //        }
    })
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
