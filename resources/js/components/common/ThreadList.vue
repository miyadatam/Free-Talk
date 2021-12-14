<template>
  <div v-if="type == '自分' || thread_list.length > 0">
    <div class="friend-detail-area js-arrow-toggle" v-if="type != '自分'">
      <p class="mb-0">
        {{ type }} <span>{{ searchThreads.length }}</span>
      </p>
      <span v-if="type != '自分' && thread_list.length > 0"
      class="arrow" :class="{'active': !is_open}" @click="arrowClick"></span>
    </div>
    <table class="table table-hover friend-table" :class="{'mb-0': type == 'お友達'}">
      <tbody v-if="type == '自分'">
        <Thread :type="type" :thread="thread_list"></Thread>
      </tbody>
      <tbody v-else-if="type != '自分' && is_open" v-for="thread in searchThreads" :key="thread.id">
        <Thread :type="type" :thread="thread" :favorite_friend_ids="favorite_friend_ids"></Thread>
      </tbody>
    </table>
  </div>
</template>

<script>
import Common from './Common.vue'
import Thread from './Thread.vue'

export default {
  props: ['type', 'thread_list', 'search_name', 'favorite_friend_ids'],
  data(){
    return {
      'is_open': true,
    }
  },
  mixins: [Common],
  components: {
    Thread
  },
  computed:{
    searchThreads(){
      var threads = [];
      for(var i in this.thread_list){
        var thread = this.thread_list[i];
        if(this.search_name == '' || thread.username.indexOf(this.search_name) !== -1 || thread.username_kana.indexOf(this.search_name) !== -1){
          threads.push(thread);
        }
      }
      return threads;
    },
  },
  methods:{
    arrowClick(){
      this.is_open = !this.is_open
    },
  }
}
</script>
