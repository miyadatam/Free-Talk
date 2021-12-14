<nav id="side-bar">
  <h1 class="text-center text-white">
    <a href="{{ route('user.show', Auth::id()) }}" class="text-white">Free Talk</a>
  </h1>
  <ul>
    <li @if(request()->path() == 'home') class="current" @endif>
      <a href="{{ route('home') }}">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="r-18jsvk2 r-4qtqp9 r-yyyyoo r-lwhw9o r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M22.58 7.35L12.475 1.897c-.297-.16-.654-.16-.95 0L1.425 7.35c-.486.264-.667.87-.405 1.356.18.335.525.525.88.525.16 0 .324-.038.475-.12l.734-.396 1.59 11.25c.216 1.214 1.31 2.062 2.66 2.062h9.282c1.35 0 2.444-.848 2.662-2.088l1.588-11.225.737.398c.485.263 1.092.082 1.354-.404.263-.486.08-1.093-.404-1.355zM12 15.435c-1.795 0-3.25-1.455-3.25-3.25s1.455-3.25 3.25-3.25 3.25 1.455 3.25 3.25-1.455 3.25-3.25 3.25z" fill="#fff"></path></g></svg>
        <span>ホーム</span>
      </a>
    </li>
    <li @if(strpos(request()->url(), request()->getUriForPath('') . '/' . Auth::id()) !== false) class="current" @endif>
       <a href="{{ route('user.show', Auth::id()) }}">
        <img src="{{ asset('image/person-white.svg') }}" alt="マイページ">
        <span>マイページ</span>
      </a>
    </li>
    <li @if(request()->path() == 'users') class="current" @endif>
      <a href="{{ route('user.index') }}">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05.02.01.03.03.04.04 1.14.83 1.93 1.94 1.93 3.41V18c0 .35-.07.69-.18 1H22c.55 0 1-.45 1-1v-1.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        <span>お友達を探す</span>
      </a>
    </li>
    <li>
      <a href="{{ route('logout') }}" onClick="return confirm('ログアウトしますか？')">
        <img src="{{ asset('image/logout.svg') }}" alt="ログアウト">
        <span>ログアウト</span>
      </a>
    </li>
  </ul>
</nav>
<!-- TODO -->
<!-- スマホ用 -->
<!-- <nav id="under-nav">
  <div onclick="openMenu(this)">
    <button>
      <span></span>
      <span></span>
      <span></span>
    </button>
    <span>メニュー</span>
  </div>
  @if (strpos(request()->path(), 'users') !== false)
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg><span>検索</span>
  @endif

  @if (strpos(request()->path(), 'chats') !== false)
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg><span>グループ</span>
  @endif
</nav> -->
