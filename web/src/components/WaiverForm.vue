<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form ref="form">

    <v-container class="grey lighten-5">
      <v-row no-gutters>

        <v-text-field
          class="purple-input"
          label="Name"
          :rules="[rules.required]"
          required
          autocomplete="off"
          v-model="waiverCopy.name"/>
      </v-row>

      <v-row no-gutters>
        <tiptap-vuetify
                      v-model="waiverCopy.contents"
                      :extensions="extensions"
                    />
      </v-row>

      <v-row>
      <v-flex xs6 md3>
        <v-btn
          color="success"
          @click="save">
          Save
        </v-btn>
      </v-flex>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { EventBus } from './../event-bus.js'
import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, Paragraph, BulletList, OrderedList, ListItem, Link, Blockquote, HardBreak, HorizontalRule, History } from 'tiptap-vuetify'

export default {
  name: 'WaiverForm',
  components: { TiptapVuetify },
  props: {
    waiver: { type: Object },
    gym: { type: Object }
  },
  data () {
    return {
      waiverCopy: {},
      rules: {
        required: value => !!value || 'Required.'
      },
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [Heading, {
          options: {
            levels: [1, 2, 3]
          }
        }],
        Bold,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak
      ],
      // starting editor's content
      content: `
      <h1>Yay Headlines!</h1>
      <p>All these <strong>cool tags</strong> are working now.</p>
    `
    }
  },

  mounted: function () {
    this.$watch('waiver', w => {
      console.log('new waiver', w)
      this.loadWaiverIntoForm(w)
    })
  },
  methods: {
    loadWaiverIntoForm (w) {
      this.waiverCopy = w.clone()
    },

    save: async function (event) {
      event.preventDefault()
      if (!this.$refs.form.validate()) {
        EventBus.$emit('user-message', { message: 'Please correct the errors above', type: 'error' })
        return
      }
      console.log('Waiver saved!', this.waiverCopy)
      this.$emit('gym-waiver-save', this.waiverCopy)
    },
    cancel: function (event) {
      event.preventDefault()
      this.$emit('gym-waiver-edit-cancel', this.waiver)
    }
  }
}
</script>

<style scoped>

  h1 {
    padding-left: .5rem;
  }

</style>
