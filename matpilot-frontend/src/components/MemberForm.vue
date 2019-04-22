<template>
  <div>
    <form>
      <div>
        <mdc-textfield v-model="member.firstName" label="First Name" />
      </div>
      <div>
        <mdc-textfield v-model="member.lastName" label="Last Name" />
      </div>

      <div>
        <mdc-button @click="save" raised>Save</mdc-button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  name: 'MemberForm',
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
    save: function (event) {
      event.preventDefault()
      // TODO: validation
      console.log('Member saved!', this.member)
      this.$emit('member-save', this.member)
    }
  }
}
</script>

<style scoped>

  h1 {
    padding-left: .5rem;
  }

</style>
