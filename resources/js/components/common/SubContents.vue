<template>
  <div class="pt-3 dnone h75vh">
    <input type="text" class="form-control-original mx-auto" style="width: 90%; height: 6%" placeholder="名前を検索" v-model="search_name">
    <div class="friend-area mt-3">
      <ThreadList :type="'自分'" :thread_list="auth_user"></ThreadList>
      <ThreadList :type="'お気に入り'" :thread_list="favorite_friends"
      :favorite_friend_ids="favorite_friend_ids"
      :search_name="search_name"></ThreadList>
      <ThreadList :type="'お友達'" :thread_list="friends"
      :favorite_friend_ids="favorite_friend_ids"
      :friend_num="friend_num" :search_name="search_name"></ThreadList>
    </div>
  </div>
</template>

<script>
import Common from './Common.vue'
import ThreadList from './ThreadList.vue'

export default {
  props: ['auth_user', 'favorite_friends', 'friends', 'friend_num', 'favorite_friend_ids'],
  mixins: [Common],
  data(){
    return {
      'search_name': '',
    }
  },
  components: {
    ThreadList
  },
}
</script>
