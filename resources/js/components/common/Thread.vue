<template>
  <tr>
    <!-- グループ -->
    <td style="width: 40px;" v-if="type == 'グループ'">
      <a :href="threadHref(thread.id)">
        <img :src="groupImg(thread.group_image)"
        class="profile-image tweet-profile-image"
        :class="{'active': thread.group_image}"
        :alt="thread.group_name">
      </a>
    </td>
    <!-- 自分 -->
    <td style="width: 40px;" v-else>
      <form action="" method="post" ref="talk_form">
        <input type="hidden" name="_token" :value="csrfToken()">
      </form>
      <a @click.stop="redirectUser">
        <img :src="profileImg(thread.image)"
        class="profile-image tweet-profile-image"
        :class="{'active': thread.image}"
        :alt="thread.username">
      </a>
    </td>
    <td v-if="type == 'グループ'">
      {{ thread.group_name }}
    </td>
    <td v-else>
      {{ thread.username }}
      <form method="post" ref="favorite_form" class="d-inline cursor-pointer"
      v-if="type != 'グループ' && type != '自分'" @click.stop="toggleFavorite">
        <input type="hidden" name="_token" :value="csrfToken()">
        <img src="/image/friend-favorite-on.svg" alt="" width="12" height="21" v-if="isFavoriteFriend()">
        <img src="/image/friend-favorite-off.svg" alt="" width="12" height="21" v-else>
      </form>
    </td>
  </tr>
</template>

<script>
import Common from './Common.vue'

export default {
  props: ['type', 'thread', 'is_favorite', 'favorite_friend_ids'],
  mixins: [Common],
  methods: {
    toggleFavorite(){
      this.$refs.favorite_form.action = '/toggle/friend/favorite/' + this.thread.id
      this.$refs.favorite_form.submit()
    },
    redirectUser(){
      window.location = "/" + this.thread.id
    },
    isFavoriteFriend(){
      if(this.favorite_friend_ids && String(this.favorite_friend_ids).indexOf(this.thread.id) !== -1){
        return true
      }else{
        return false
      }
    }
  }
}
</script>
