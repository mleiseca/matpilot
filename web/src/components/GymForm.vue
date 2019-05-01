<template>
  <v-form>
    <v-container py-0>
      <v-layout wrap>

        <v-flex
          xs12
          md12
        >
          <v-text-field
            class="purple-input"
            label="Gym Name"
            v-model="form.name"
          />
        </v-flex>

        <v-flex
          xs12
          md12
        >
          <v-text-field
            class="purple-input"
            label="Description"
            v-model="form.description"
          />
        </v-flex>

        <!--<v-flex-->
          <!--xs12-->
          <!--md4-->
        <!--&gt;-->
          <!--<v-text-field-->
            <!--label="Email Address"-->
            <!--class="purple-input"/>-->
        <!--</v-flex>-->
        <!--<v-flex-->
          <!--xs12-->
          <!--md6-->
        <!--&gt;-->
          <!--<v-text-field-->
            <!--label="First Name"-->
            <!--class="purple-input"/>-->
        <!--</v-flex>-->
        <!--<v-flex-->
          <!--xs12-->
          <!--md6-->
        <!--&gt;-->
          <!--<v-text-field-->
            <!--label="Last Name"-->
            <!--class="purple-input"/>-->
        <!--</v-flex>-->
        <!--<v-flex-->
          <!--xs12-->
          <!--md12-->
        <!--&gt;-->
          <!--<v-text-field-->
            <!--label="Adress"-->
            <!--class="purple-input"/>-->
        <!--</v-flex>-->
        <!--<v-flex-->
          <!--xs12-->
          <!--md4>-->
          <!--<v-text-field-->
            <!--label="City"-->
            <!--class="purple-input"/>-->
        <!--</v-flex>-->
        <!--<v-flex-->
          <!--xs12-->
          <!--md4>-->
          <!--<v-text-field-->
            <!--label="Country"-->
            <!--class="purple-input"/>-->
        <!--</v-flex>-->
        <!--<v-flex-->
          <!--xs12-->
          <!--md4>-->
          <!--<v-text-field-->
            <!--class="purple-input"-->
            <!--label="Postal Code"-->
            <!--type="number"/>-->
        <!--</v-flex>-->
        <!--<v-flex xs12>-->
          <!--<v-textarea-->
            <!--class="purple-input"-->
            <!--label="About Me"-->
            <!--value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."-->
          <!--/>-->
        <!--</v-flex>-->
        <v-flex
          xs12
          text-xs-right
        >
          <v-btn
            class="mx-0 font-weight-light"
            color="success"
            @click="save"
          >
            Save
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
  <!---->
  <!--<div>-->
    <!--<mdc-textfield v-model="form.name" label="Gym Name" fullwidth/>-->
    <!--<mdc-textfield v-model="form.description" label="Description" fullwidth/>-->

    <!--<div>-->
    <!--<mdc-button @click="save" raised>Save</mdc-button>-->
    <!--</div>-->

  <!--</div>-->
</template>

<script>
export default {
  name: 'GymForm',
  //    props: {
  //      name: String
  //    },
  data: function () {
    return {
      form: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    save: function (event) {
      event.preventDefault()
      // TODO: validation
      console.log('Gym saved!', this.form)
      this.$emit('gym-save', this.form)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
