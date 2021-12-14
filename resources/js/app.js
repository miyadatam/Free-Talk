/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import VueTextareaAutosize from 'vue-textarea-autosize'
import DropdownMenu from '@innologica/vue-dropdown-menu'
import FlashMessage from './components/common/FlashMessage.vue'
import PasswordEdit from './components/users/PasswordEdit.vue'
import SubContents from './components/common/SubContents.vue'
import Home from './components/home/Home.vue'
import FriendList from './components/friends/List.vue'
import UserShow from './components/users/Show.vue'
import UserIndex from './components/users/Index.vue'

require('./bootstrap');

window.Vue = require('vue');
Vue.use(VueTextareaAutosize)
Vue.use(DropdownMenu)

Vue.component('flash-message', FlashMessage);
const flashMessage = new Vue({}).$mount('#flashMessage')

Vue.component('sub-contents', SubContents);

Vue.component('home', Home);

Vue.component('friend-list', FriendList);

Vue.component('user-show', UserShow);
Vue.component('user-index', UserIndex);
Vue.component('password-edit', PasswordEdit);

const app = new Vue({}).$mount('#app');
