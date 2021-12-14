<template>
  <div class="container-box">
    <div style="height: 74vh;">
      <div class="friend-search">
        <div class="mr-2">
          <img src="/image/search.svg" width="20" height="20" alt="探す">
        </div>
        <input type="text"
        placeholder="キーワード検索"
        v-model="search_name">
      </div>
      <div class="scroll-y" style="height: 90%">
        <table class="table table-hover mb-0" v-if="friends.length > 0">
          <tbody v-for="friend in searchFriends"  :key="friend.id">
            <tr>
              <th style="width: 40px;">
                <a :href="userHref(friend.id)">
                  <img :src="profileImg(friend.image)"
                  class="profile-image tweet-profile-image"
                  :class="{'active': friend.image}"
                  :alt="friend.username">
                </a>
              </th>
              <td>
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span class="text-black">{{ friend.username }}</span>
                  </div>
                  <FriendToggleButton :your_id="friend.id" :is_friend="true"></FriendToggleButton>
                </div>
                <p class="text-black mb-1" v-text="lineBreaksText(friend.bio)"></p>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-center align-items-center h-100" v-else>
          <span>お友達がいません...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Common from '../common/Common.vue'
import FriendToggleButton from './FriendToggleButton.vue'
import SubContents from '../common/SubContents.vue'

export default {
  props: ['friends'],
  mixins: [Common],
  data(){
    return {
      'search_name': ''
    }
  },
  components: {
    FriendToggleButton, SubContents
  },
  computed: {
    searchFriends(){
      var friends = []
      for(var i in this.friends){
        var friend = this.friends[i]
        if(this.search_name == '' || friend.username.indexOf(this.search_name) !== -1 || friend.username_kana.indexOf(this.search_name) !== -1){
          friends.push(friend);
        }
      }
      return friends;
    },
  },
  methods: {
  }
}
</script>
