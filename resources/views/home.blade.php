@extends('layouts.app')

@section('title', 'ホーム')

@section('main')

<div id="app" class="content-area">
  <h2 class="font-weight-bold">ホーム</h2>
  <home :posts="{{ json_encode(Auth::user()->homePosts) }}"
  :auth_user="{{ json_encode(Auth::user()) }}"
  :favorite_ids="{{ json_encode(Auth::user()->favoriteIds()) }}"></home>
  <div class="container-box sub-container hidden">
    @include('layouts.sub_contents')
  </div>
  <div class="sub-container-under hidden" onclick="closeModal(this)"></div>
</div>

@endsection
