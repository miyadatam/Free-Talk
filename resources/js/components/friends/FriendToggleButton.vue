<template>
  <form method="post" ref="form">
    <input type="hidden" name="_token" :value="csrfToken()">
    <button type="button" v-if="friend_flg" class="btn btn-danger rounded-pill" @click="toggleFriend">お友達やめる</button>
    <button type="button" v-else class="btn btn-green rounded-pill" @click="toggleFriend">お友達になる</button>
  </form>
</template>

<script>
import Common from '../common/Common.vue'

export default {
  props: ['is_friend', 'your_id'],
  mixins:[Common],
  data(){
    return {
      'friend_flg': this.is_friend,
      'action': '/toggle/friend/' + this.your_id,
    }
  },
  methods:{
    toggleFriend(){
      if(!this.friend_flg || this.friend_flg && confirm('お友達解除しますか?')){
        this.$refs.form.action = this.action
        this.$refs.form.submit()
      }
    },
  }
}
</script>
