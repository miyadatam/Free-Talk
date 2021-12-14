<template>
  <div class="container-box h75vh">
    <div class="friend-search">
      <div class="mr-2">
        <img src="image/search.svg" width="20" height="20" alt="探す">
      </div>
      <form action="/users" class="w-100 h-100">
        <input type="text" name="search" class="w-100 h-100 border-0" :value="search_username" placeholder="キーワード検索">
      </form>
    </div>
    <div class="scroll-bar-none scroll-y" style="height: 88%">
      <table class="table table-hover mb-0" v-if="users.length > 0">
        <tbody v-for="(random_user, index) in users" :key="random_user.id">
          <tr>
            <th style="width: 40px;">
              <a :href="userHref(random_user.id)">
                <img :src="profileImg(random_user.image)"
                class="profile-image tweet-profile-image"
                :class="{'active': random_user.image}"
                :alt="random_user.username">
              </a>
            </th>
            <td>
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span class="text-black">{{ random_user.username }}</span>
                </div>
                <FriendToggleButton :your_id="random_user.id" :is_friend="false"></FriendToggleButton>
              </div>
              <p class="text-black mb-1" v-text="lineBreaksText(random_user.bio)"></p>
            </td>
          </tr>
          <tr v-if="index == num">
            <td colspan="2">
              <div class="text-center cursor-pointer" @click="addUsers">
                <img src="/image/reload.svg" alt="ロード" width="20" height="20">
                <span>ユーザーをさらに読み込む</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="h-100 d-flex align-items-center justify-content-center border-top" v-else>
        ユーザーがいません...
      </div>
    </div>
  </div>
</template>

<script>
import Common from '../common/Common.vue'
import FriendToggleButton from '../friends/FriendToggleButton.vue'

export default {
  props: ['random_users', 'search_username'],
  mixins: [Common],
  components: {
    FriendToggleButton
  },
  data(){
    return {
      'num': 9,
      'users': this.random_users,
      'exist_ids': {},
      'url': '/ajax/users',
      'get_user_count': 0,
    }
  },
  mounted(){
    this.setExistsIds()
  },
  methods: {
    addUsers(){
      this.getUserCount++
      let get_user_count = this.get_user_count
      let exist_ids = this.exist_ids

      axios.post(this.url, {
        'search': this.search_username,
        'num': JSON.stringify(get_user_count),
        'exist_ids': JSON.stringify(exist_ids),
      })
      .then(res => {
        this.users.push(...res.data.random_users)
        this.num += 10
        this.setExistsIds()
      })
      .catch(() => {
        window.location = '/error'
      })
    },
    setExistsIds(){
      this.users_exists_ids = {}
      this.users.forEach((user, index) => {
        this.$set(this.exist_ids, index, user.id)
      })
    }
  }
}

</script>
