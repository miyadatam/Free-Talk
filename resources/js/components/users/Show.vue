<template>
  <div class="container-box main">
    <UserEdit v-if="is_show"
    :auth_user="auth_user"
    :old_bio="old_bio"
    @toggle-modal="toggleModal">
      <!-- 参考サイト
      https://qiita.com/TomK/items/fec2ab759d2d9c22382b -->
      <template v-for="(slot, name) of $scopedSlots" #[name]="data">
        <slot :name="name" v-bind="data"></slot>
      </template>
    </UserEdit>
    <UserShowMain :auth_user="auth_user"
    :user="user"
    :friend_count="friend_count"
    :is_friend="is_friend"
    :posts="posts"
    :favorite_ids="favorite_ids"
    :is_favorite="is_favorite"
    @toggle-modal="toggleModal"></UserShowMain>
  </div>
</template>

<script>
import UserEdit from './Edit.vue'
import UserShowMain from './ShowMain.vue'

export default {
  props: ['auth_user', 'user', 'friend_count', 'is_friend', 'favorite_ids', 'posts', 'is_favorite', 'is_modal_show', 'old_bio'],
  components: {
    UserEdit,
    UserShowMain,
  },
  data(){
    return {
      'is_show': this.is_modal_show
    }
  },
  methods: {
    reload(){
      window.location = '' + this.user.id
    },
    toggleModal(){
      this.is_show = !this.is_show
      if(!this.is_show){
        this.reload()
      }
    },

  }
}
</script>
