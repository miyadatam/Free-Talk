@extends('layouts.app')

@section('title', $user->username . 'さん')

@section('main')

<div id="app" class="content-area">
  <h2 class="font-weight-bold">{{ $user->username }}</h2>
  <user-show :auth_user="{{ json_encode(Auth::user()) }}"
  :user="{{ $user }}"
  :friend_count="{{ json_encode($user->friends->count()) }}"
  :is_friend="{{ json_encode(Auth::user()->isFriend($user->id)) }}"
  :favorite_ids="{{ json_encode(Auth::user()->favoriteIds()) }}"
  :posts="{{ $posts }}"
  :is_favorite="{{ $is_favorite ? 'true' : 'false' }}"
  :is_modal_show="{{ json_encode(!empty($errors->first())) }}"
  :old_bio="{{ json_encode(old('bio')) }}">
    <template #username="data">
      <div class="mb-2">
        <label for="username">名前</label>
        @if($errors->has('username'))
        <span class="text-danger ml-3">{{ $errors->first('username') }}</span>
        @endif
        <input type="text" id="username" name="username" class="form-control-original" placeholder="ユーザー名" value="{{ old('username', Auth::user()->username) }}">
      </div>
    </template>
    <template #username_kana="data">
      <div class="mb-2">
        <label for="username">ふりがな</label>
        @if($errors->has('username_kana'))
        <span class="text-danger ml-3">{{ $errors->first('username_kana') }}</span>
        @endif
        <input type="text" id="username_kana" name="username_kana" class="form-control-original" placeholder="ユーザー名" value="{{ old('username_kana', Auth::user()->username_kana) }}">
      </div>
    </template>
    <template #email="data">
      <div class="mb-2">
        <label for="email">メールアドレス</label>
        @if($errors->has('email'))
        <span class="text-danger ml-3">{{ $errors->first('email') }}</span>
        @endif
        <input type="text" id="email" name="email" class="form-control-original" placeholder="メールアドレス" value="{{ old('email', Auth::user()->email) }}">
      </div>
    </template>
    <template #password="data">
      @if($errors->has('password'))
      <password-edit :is_password="true" :error="{{ json_encode($errors->first('password')) }}"></password-edit>
      @else
      <password-edit :is_password="true" :error="''"></password-edit>
      @endif
    </template>
    <template #password-confirmation="data">
      <password-edit :is_password="false" :error="''"></password-edit>
    </template>
    <template #bio="data">
      <div class="mb-2">
        <label for="bio">自己紹介</label>
        @if($errors->has('bio'))
        <span class="text-danger ml-3">{{ $errors->first('bio') }}</span>
        @endif
      </div>
    </template>
  </user-show>
  <div class="container-box sub-container hidden">
    @include('layouts.sub_contents')
  </div>
  <div class="sub-container-under hidden" onclick="closeModal(this)"></div>
</div>


@endsection
