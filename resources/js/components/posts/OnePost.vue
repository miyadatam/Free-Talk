<template>
  <transition name="fade">
    <tr v-if="is_show">
      <th style="width: 40px">
        <a :href="'/' + post.user_id">
          <img :src="profile_img" class="profile-image tweet-profile-image" :alt="post.user.username">
        </a>
      </th>
      <td>
        <div class="d-flex justify-content-between">
          <p class="mb-1">
            <span class="text-black mr-4">{{ post.user.username }}</span>
            <span class="text-secondary">{{ postCreatedAt(post) }}</span>
          </p>
          <PostDelete v-if="post.user_id == auth_user.id" :post_id="post.id"
          @post-remove="postRemove(index)"
          @post-count-decrement="$emit('post-count-decrement')"></PostDelete>
        </div>
        <p class="text-black mb-1" v-html="lineBreaksText(post.post)"></p>
        <div class="js-post-favorite">
          <PostFavorite :post_id="post.id" :favorite_ids="favorite_ids" :favorite_count="post.favorites_count"></PostFavorite>
        </div>
      </td>
    </tr>
  </transition>
</template>

<script>
import Common from '../common/Common.vue'
import PostDelete from './Delete.vue'
import PostFavorite from './Favorite.vue'

export default{
  props: ['index', 'post', 'auth_user', 'profile_img', 'favorite_ids'],
  data(){
    return {
      is_show: true,
    }
  },
  mixins: [Common],
  components: {
    PostDelete,
    PostFavorite,
  },
  methods:{
    postRemove(){
      this.is_show = false
    },
    postCreatedAt(post){
      // ミリ秒
      const MINUTE = 60000
      const HOUR = MINUTE * 60
      const DAY = HOUR * 24
      const WEEK = DAY * 7

      // 現在
      let now = new Date()
      let now_year = now.getFullYear()

      // 投稿日
      let created_at = new Date(post.created_at)
      let year = created_at.getFullYear()
      let month = created_at.getMonth() + 1
      let date = created_at.getDate()
      let hour = created_at.getHours()
      let minute = created_at.getMinutes()
      let second = created_at.getSeconds()

      // 差分
      let diff = now.getTime() - created_at.getTime()

      // 1分未満
      if(diff < MINUTE){
        diff = diff / 1000
        return Math.floor(diff) + '秒前'
        // 1時間未満
      }else if(diff < HOUR){
        return Math.floor(diff / MINUTE) + '分'
        // 1日未満
      }else if(diff < DAY){
        return Math.floor(diff / HOUR)+ '時間'
        // 1週間未満
      }else if(diff < WEEK){
        return Math.floor(diff / DAY)+ '日'
        // 1年未満
      }else if(now_year == year){
        return month + '月' + date + '日'
      }else{
        return year + '年' + month + '月' + date + '日'
      }
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
