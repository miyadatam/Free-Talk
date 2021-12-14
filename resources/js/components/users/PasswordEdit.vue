<template>
  <div class="mb-2" v-if="is_password">
    <label :for="label_for" class="mr-1">パスワード</label>
    <i class="fas cursor-pointer" :class="icon_class" @click="togglePassword"></i>
    <span class="text-danger ml-3" v-if="error">{{ error }}</span>
    <input :type="input_type" id="password"
    name="password" placeholder="password"
    class="form-control-original">
  </div>
  <div class="mb-2" v-else>
    <label for="password-confirmation" class="mr-1">パスワード(再)</label>
    <i class="fas cursor-pointer" :class="icon_class" @click="togglePassword"></i>
    <input :type="input_type" id="password-confirmation"
    name="password_confirmation" placeholder="password confirmation"
    class="form-control-original">
  </div>
</template>

<script>
  export default {
    props: ['is_password', 'error'],
    data(){
      return {
        'is_password_hide': true,
        'icon_class': 'fa-eye-slash',
        'input_type': 'password',
      }
    },
    methods: {
      togglePassword(){
        this.is_password_hide = !this.is_password_hide
        this.input_type = this.is_password_hide ? 'password' : 'text'
        this.icon_class = this.is_password_hide ? 'fa-eye-slash' :'fa-eye'
      }
    }
  }
</script>
