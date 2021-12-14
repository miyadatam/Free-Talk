@extends('layouts.app')

@section('title', 'ユーザー登録確認')

@section('favicon')
<link rel="icon" href="{{ asset('image/favicon/favicon-login.svg') }}">
@endsection

@section('main')

<div class="login-form">
  <h1>Free Talk</h1>
  <div class="form-group">
    <h1>登録確認</h1>
    <form action="{{ route('register') }}" method="post">
      @csrf
      <!-- 名前 -->
      <div class="input-group">
        <label for="username">名前</label>
        <input id="username" name="username" type="text" value="{{ $data['username'] }}" readonly>
      </div>
      <!-- 名前フリガナ -->
      <div class="input-group">
        <label for="username_kana">ふりがな</label>
        <input id="username_kana" name="username_kana" type="text" value="{{ $data['username_kana'] }}" readonly>
      </div>
      <!-- メールアドレス -->
      <div class="input-group">
        <label for="email">メールアドレス</label>
        <input id="email" name="email" type="text" value="{{ $data['email'] }}" readonly>
      </div>
      <!-- パスワード -->
      <div class="input-group">
        <label for="password">パスワード</label>
        <input id="password" name="password" type="password" value="{{ $data['password'] }}" readonly>
      </div>
      <button type="submit" onclick="return confirm('登録しますか？')">登録</button>
      <button type="submit" class="back" name="back">戻る</button>
    </form>
  </div>
</div>
@endsection
