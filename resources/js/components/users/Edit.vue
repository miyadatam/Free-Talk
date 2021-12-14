<template>
  <div>
    <!-- 編集モーダル開いた時用 -->
    <div class="edit-modal-bg" @click="$emit('toggle-modal')"></div>
    <!-- プロフィール編集モーダル -->
    <form action="/user/update" method="post" id="user-edit-form" class="form"
    enctype="multipart/form-data" autocomplete="off">
      <input type="hidden" name="_token" :value="csrfToken()">
      <input type="hidden" name="_method" value="PATCH">
      <div class="user-edit-form-header">
        <div class="d-flex align-items-center">
          <div class="mr-3">
            <img src="/image/x.svg" alt="X" width="15" height="15" @click="$emit('toggle-modal')">
          </div>
          <div>
            <span class="font-weight-bold">プロフィール編集</span>
          </div>
        </div>
        <div>
          <button type="submit" class="btn btn-green rounded-pill">保存</button>
        </div>
      </div>
      <div id="edit-list" class="scroll-bar-none">
        <div class="profile-image-edit">
          <img :src="profileImg(auth_user.image)" class="profile-image" :class="{'active': auth_user.image}">
          <input type="file" name="image">
          <img src="/image/camera-add.svg" alt="カメラ">
        </div>
        <slot name="username"></slot>
        <slot name="username_kana"></slot>
        <slot name="email"></slot>
        <slot name="password"></slot>
        <slot name="password-confirmation"></slot>
        <slot name="bio"></slot>
        <BioArea v-if="old_bio" :old_bio="old_bio"></BioArea>
        <BioArea v-else-if="auth_user.bio" :bio="auth_user.bio"></BioArea>
        <BioArea v-else :bio="''"></BioArea>
      </div>
    </form>
  </div>
</template>

<script>
import Common from '../common/Common.vue'
import BioArea from './BioArea.vue'

export default {
  props: ['auth_user', 'old_bio'],
  mixins: [Common],
  components: {
    BioArea,
  }
}
</script>
