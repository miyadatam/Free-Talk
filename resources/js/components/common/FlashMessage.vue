<template>
  <transition>
    <div class="flash-message" :class="(error == 'true') ? 'danger' : ''" v-if="show">{{ message }}</div>
  </transition>
</template>

<script>
  export default{
    props: ['message', 'error'],
    data(){
      return{
        'show': true,
      }
    },
    mounted(){
      this.fadeOut()
    },
    methods: {
      fadeOut(){
        setTimeout(() => {
          this.show = !this.show
        }, 3000)
      }
    }
  }
</script>
