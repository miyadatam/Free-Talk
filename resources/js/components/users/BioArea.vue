<template>
  <div>
    <textarea-autosize type="password" id="bio" name="bio"
    class="form-control-original textarea" :class="{ 'error': is_error }"
    placeholder="自己紹介" :min-height="100" :max-height="130"
    v-model="edit_bio"
    @input="maxLengthCheck"></textarea-autosize>
    <span class="d-block text-right text-muted">
      <span v-if="edit_bio">{{ edit_bio.length }}/160</span>
      <span v-else>0/160</span>
    </span>
  </div>
</template>

<script>
  export default {
    props: ['bio'],
    data(){
      return {
        'is_error': false,
        'edit_bio': this.bio
      }
    },
    methods: {
      maxLengthCheck(){
        this.is_error = this.edit_bio.length > 160 ? true : false
      },
    }
  }
</script>
