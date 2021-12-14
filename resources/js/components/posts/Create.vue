<template>
  <div>
    <form action="/post" method="post" class="border-bottom post-create-form">
      <input type="hidden" name="_token" :value="csrfToken()">
      <label for="post" class="d-block" :class="{'error': maxLengthOver}">
        <div class="d-flex align-items-start">
          <div class="mr-4">
            <img :src="profileImg(auth_user.image)"
            class="profile-image tweet-profile-image"
            :class="{'active': auth_user.image}">
          </div>
          <textarea-autosize id="post" name="post" class="textarea tweet-textarea"
          placeholder="なにしようかな？"
          v-model="text"
          :max-height="200"
          @input="textInputEvent"></textarea-autosize>
        </div>
        <div class="d-flex justify-content-end align-items-end">
          <span class="pr-2 text-secondary"><span>{{ text.length }}</span>/140</span>
          <div>
            <button type="submit" class="btn btn-green rounded-pill mt-2"
            :disabled="disabled">つぶやく</button>
          </div>
        </div>
      </label>
    </form>
  </div>
</template>

<script>
import Common from '../common/Common.vue'

export default {
  props: ['profile_image', 'auth_user'],
  mixins: [Common],
  data(){
    return {
      'text': '',
      'disabled': true,
      'maxLengthOver': false,
    }
  },
  methods: {
    textInputEvent(){
      this.toggleDisabled()
      this.maxLengthOverCheck()
    },
    maxLengthOverCheck(){
      this.maxLengthOver = (this.text.length > 140) ? true : false
    },
    toggleDisabled(){
      this.disabled = (this.text != '' && this.text.match(/\S/g) && this.text.length > 0 && this.text.length <= 140) ? false : true
    },
  }
}
</script>
