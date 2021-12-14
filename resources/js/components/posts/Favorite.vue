<template>
  <div class="favorite" @click="toggleFavorite">
    <img :src="src" width="16" height="16" alt="いいね">
    <span>{{ favoriteCount }}</span>
  </div>
</template>

<script>
import Common from '../common/Common.vue'

export default{
  props: ['post_id', 'favorite_ids', 'favorite_count'],
  mixins: [Common],
  data(){
    return {
      'src': '/image/post-favorite-off.svg',
      'url': '/toggle/post/favorite/' + this.post_id,
      'favoriteCount': this.favorite_count
    }
  },
  mounted(){
    this.checkFavorite()
  },
  methods: {
    checkFavorite(){
      if(this.favorite_ids && String(this.favorite_ids).indexOf(this.post_id) != -1){
        this.src = '/image/post-favorite-on.svg'
      }else{
        this.src = '/image/post-favorite-off.svg'
      }
    },
    toggleFavorite(){
      axios.post(this.url, {})
      .then(res => {
        this.errorCheck(res)
        this.favoriteCount = res.data.favorite_count

        if(res.data.is_favorite){
          this.src = '/image/post-favorite-on.svg'
        }else{
          this.src = '/image/post-favorite-off.svg'
        }
      })
      .catch(() => {
        window.location = '/error'
      })
    }
  }
}
</script>
