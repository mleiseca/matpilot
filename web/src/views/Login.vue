<template>
  <div>
    <mp-login-form></mp-login-form>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'login',
  components: {
    'mp-login-form': LoginForm
  },
  methods: {

  }
}
</script>
