<template>
  <div class="container-box">
    <div class="h75vh scroll-y scroll-bar-none">
      <Post :posts="posts" :auth_user="auth_user" :favorite_ids="favorite_ids" :is_home="true"></Post>
    </div>
  </div>
</template>

<script>
import Post from '../posts/Post.vue'

export default {
  props: ['posts', 'auth_user', 'favorite_ids'],
  components: {
    Post
  }
}
</script>
