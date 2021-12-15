@extends('layouts.app')

@section('title', 'ユーザー登録')

@section('favicon')
<link rel="icon" href="{{ asset('image/favicon/favicon-login.svg') }}">
@endsection

@section('main')

<div class="login-form">
  <h1>Free SNS</h1>
  <div class="form-group">
    <h1>登録</h1>
    <form action="{{ route('register.confirm') }}" method="post">
      @csrf
      <!-- 名前 -->
      <div class="input-group">
        <label for="username">名前</label>
        <!--バリデーションエラーメッセージ-->
        @if($errors->has('username'))
        <span class="text-danger">{{ $errors->first('username') }}</span>
        @endif
        <input id="username" name="username" type="text" value="{{ old('username') }}">
      </div>
      <!-- 名前ふりがな -->
      <div class="input-group">
        <label for="username_kana">ふりがな</label>
        @if($errors->has('username_kana'))
        <span class="text-danger">{{ $errors->first('username_kana') }}</span>
        @endif
        <input id="username_kana" name="username_kana" type="text" value="{{ old('username_kana') }}">
      </div>
      <!-- メールアドレス -->
      <div class="input-group">
        <label for="email">メールアドレス</label>
        @if($errors->has('email'))
        <span class="text-danger">{{ $errors->first('email') }}</span>
        @endif
        <input id="email" name="email" type="text" placeholder="free@sns.com" value="{{ old('email') }}">
      </div>
      <!-- パスワード -->
      <div class="input-group">
        <label for="password">パスワード</label>
        @if($errors->has('password'))
        <span class="text-danger">{{ $errors->first('password') }}</span>
        @endif
        <input id="password" name="password" type="password">
      </div>
      <!-- パスワード確認 -->
      <div class="input-group">
        <label for="password-confirmation">パスワード(再)</label>
        <input id="password-confirmation" name="password_confirmation" type="password">
      </div>
      <button type="submit">確認画面へ</button>
    </form>
  </div>
  <div class="guidance">
		アカウントをお持ちの方は<a href="{{ route('login.form') }}"><span>こちら</span></a>
	</div>
</div>
@endsection
