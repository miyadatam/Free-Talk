@extends('layouts.app')

@section('title', 'ログイン')

@section('main')

<div class="login-form">
	<h1>Free Talk</h1>
	<div class="form-group">
		<h1>ログイン</h1>
		@if(session('login_error'))
		<span class="text-danger">{{ session('login_error') }}</span>
		@endif
		<form action="{{ route('login') }}" method="post">
			@csrf
			<div class="input-group">
				<label for="email">メールアドレス</label>
				@if(session('password'))
				<input id="email" type="text" name="email" placeholder="hogehoge@huga.com" value="{{ session('email') }}">
				@else
				<input id="email" type="text" name="email" placeholder="hogehoge@huga.com">
				@endif
			</div>
			<div class="input-group">
				<label for="password">パスワード</label>
				@if(session('password'))
				<input id="password" type="password" name="password" value="{{ session('password') }}">
				@else
				<input id="password" type="password" name="password">
				@endif
			</div>
			<div class="input-group">
				<input for="keep" type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}>
				<label id="keep">ログイン状態を保持する</label>
			</div>

			<button type="submit">ログイン</button>
		</form>
	</div>

	<div class="guidance">
		アカウントをお持ちでない方は<a href="{{ route('register.form') }}"><span>こちら</span></a>
	</div>

</div>

@endsection
