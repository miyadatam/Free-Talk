<template>
  <div class="h75vh scroll-y">
    <div style="padding: 0 25px;">
      <img :src="profileImg(user.image)" class="profile-image" :class="{ 'active': user.image }">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p class="profile-name">{{ user.username }}</p>
          <a :href="friends_href" class="profile-friend">
            お友達 <span class="profile-friend-num">{{ friend_num }}</span>人
          </a>
          <span style="font-size: 12px;cursor:default" v-if="is_favorite">いいね{{ post_count }}件</span>
          <span style="font-size: 12px;cursor:default" v-else>つぶやき{{ post_count }}件</span>
        </div>
        <UserEditButton v-if="user.id == auth_user.id" @toggle-modal="$emit('toggle-modal')"></UserEditButton>
        <FriendToggleButton v-else :is_friend="is_friend" :your_id="user.id"></FriendToggleButton>
      </div>
      <p class="profile-bio" v-html="lineBreaksText(user.bio)"></p>
    </div>
    <ul class="tweet-area">
      <li>
        <a :href="tweet_href">
          <span :class="{ 'active': !is_favorite }">つぶやき</span>
        </a>
      </li>
      <li>
        <a :href="favorite_tweet_href">
          <span :class="{ 'active': is_favorite }">いいね</span>
        </a>
      </li>
    </ul>
    <Post v-if="posts.length != 0"
    :posts="posts"
    :auth_user="auth_user"
    :favorite_ids="favorite_ids"
    :is_home="false"
    @post-count-decrement="PostCountDecrement"></Post>
    <div v-else
    class="d-flex align-items-center justify-content-center border-top"
    style="height: 49%;">
    <p class="font-weight-bold" v-if="is_favorite">いいねがありません</p>
    <p class="font-weight-bold" v-else>つぶやきがありません</p>
  </div>
</div>
</template>

<script>
import Common from '../common/Common.vue'
import Post from '../posts/Post.vue'
import UserEditButton from './EditStartButton.vue'
import FriendToggleButton from '../friends/FriendToggleButton.vue'

export default {
  props: ['user', 'auth_user', 'posts', 'is_friend', 'friend_count', 'favorite_ids', 'is_favorite'],
  data(){
    return {
      'friend_num': this.friend_count,
      'friends_href': '/friends/' + this.user.id,
      'tweet_href': '/' + this.user.id,
      'favorite_tweet_href': '/' + this.user.id + '/1',
      'post_count': this.posts.length
    }
  },
  mixins: [Common],
  components: {
    Post,
    UserEditButton,
    FriendToggleButton
  },
  methods: {
    PostCountDecrement(){
      this.post_count--
    }
  }
}
</script>
