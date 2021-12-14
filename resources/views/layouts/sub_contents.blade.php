<sub-contents :auth_user="{{ json_encode(Auth::user()) }}"
:favorite_friends="{{ $favorite_friends }}"
:favorite_friend_ids="{{ json_encode(Auth::user()->favoriteFriendIds()) }}"
:friends="{{ $friends }}"
></sub-contents>
