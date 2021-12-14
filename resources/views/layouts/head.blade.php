<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <!-- <link rel="apple-touch-icon" href="{{ asset('image/apple-touch-icon.png') }}"> -->
  <title>@yield('title')</title>
  <!-- css -->
  @auth
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">
  <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  @yield('css')
  @endauth

  @guest
  <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
  @endguest
  <!-- script -->
  <script src="{{ asset('js/jquery-2.2.4.min.js') }}"></script>
  <script src="{{ asset('js/app.js') }}" defer></script>
</head>

<body class="body">
