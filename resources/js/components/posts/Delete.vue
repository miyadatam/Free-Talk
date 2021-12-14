<template>
  <div>
    <div @click="deletePost" @mouseover="changeImage(true)" @mouseleave="changeImage(false)"
    class="post-delete">
    <img :src="src" class="cursor-pointer" width="20" height="20" alt="投稿削除">
  </div>
  </div>
</template>

<script>
import Common from '../common/Common.vue'

export default{
  props: ['post_id'],
  mixins: [Common],
  data() {
    return {
      src: '/image/post-delete.svg',
      url: '/post/' + this.post_id,
      param: {
        post_id: this.post_id,
      }
    }
  },
  methods: {
    changeImage(is_hover){
      if(is_hover){
        this.src = '/image/post-delete-hover.svg'
      }else{
        this.src = '/image/post-delete.svg'
      }
    },
    deletePost(){
      if(confirm('削除しますか？')){
        axios.delete(this.url, this.param)
        .then(res => {
          this.errorCheck(res)
          this.$emit('post-remove')
          this.$emit('post-count-decrement')
        }).catch(() => {
          window.location = '/error'
        })
      }
    }
  }
}
</script>
