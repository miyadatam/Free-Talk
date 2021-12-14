<script>
export default {
  methods: {
    userHref(user_id){
      return '/' + user_id
    },
    profileImg(profile_image){
      if(profile_image){
        return '/storage/' + profile_image;
      }else{
        return '/image/person-black.svg';
      }
    },
    groupImg(group_image){
      if(group_image){
        return '/storage/' + group_image
      }else{
        return '/image/group_default.svg'
      }
    },
    csrfToken(){
      return document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    // 改行
    lineBreaksText(msg){
      if(!!(msg)){
        return msg.replace(/\r?\n/g, '<br>')
      }
    },
    errorCheck(res){
      if(res.error){
        window.location = '/error'
      }
    },
  }
}
</script>
