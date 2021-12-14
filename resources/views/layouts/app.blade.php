@include('layouts.head')

@include('layouts.header')
@auth
@include('layouts.sidebar')
@endauth

@yield('main')

@include('layouts.footer')
