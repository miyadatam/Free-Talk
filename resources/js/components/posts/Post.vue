<template>
  <div>
    <PostCreate v-if="is_home"
    :auth_user="auth_user"></PostCreate>
    <table v-if="posts.length != 0" class="table table-hover">
      <tbody v-for="(post, index) in posts">
        <OnePost :index="index" :post="post" :auth_user="auth_user"
        :favorite_ids="favorite_ids"
        :profile_img="profileImg(post.user.image)"
        :key="post.id"
        @post-count-decrement="$emit('post-count-decrement')"></OnePost>
      </tbody>
    </table>
  </div>
</template>

<script>
import Common from '../common/Common.vue'
import OnePost from './OnePost.vue'
import PostCreate from './Create.vue'

export default{
  props: ['is_home', 'posts', 'auth_user', 'favorite_ids'],
  mixins: [Common],
  components: {
    PostCreate,
    OnePost,
  },
  mounted(){

  }
}
</script>
