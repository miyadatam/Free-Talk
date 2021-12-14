@extends('layouts.app')

@section('title', 'お友達を探す')

@section('main')

<div id="app" class="content-area">
  <h2 class="font-weight-bold">お友達を探す</h2>
  <user-index :random_users="{{ $random_users }}" :search_username="{{ json_encode($search_username) }}"></user-index>
  <div class="container-box sub-container hidden">
    @include('layouts.sub_contents')
  </div>
  <div class="sub-container-under hidden" onclick="closeModal(this)"></div>
</div>

@endsection
