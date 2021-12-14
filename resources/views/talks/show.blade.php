@extends('layouts.app')

@section('title', $title)

@section('main')

<div class="content-area">
  <h2 class="font-weight-bold">
    <a href="{{ route('talk.index') }}">
      <svg viewBox="0 0 24 24" aria-hidden="true" class="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03" width="24" height="24"><g><path d="M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"></path></g></svg>
    </a>
    {{ $title }}{{ $thread->is_group ? '(' . $thread->threadUsers->count() + 1 . ')' : '' }}
  </h2>
  <div class="container-box">
    <div class="position-relative h75vh">
      <!-- アナウンス -->
      <div class="modal-area d-none">
        <ul>
          <li>リプライ</li>
          <li>
            <form action="{{ route('toggle.announce', 8) }}" method="post">
              @csrf
              <button type="submit">アナウンス</button>
            </form>
          </li>
          <li>
            <form action="{{ route('talk.destroy', 5) }}" method="post">
              @csrf
              @method('DELETE')
              <button type="submit">送信取り消し</button>
            </form>
          </li>
        </ul>
      </div>
      <div id="announce-area">
        <ul class="active scroll-bar-none">
          @foreach($thread->announces as $index => $announce)
          <li>
            <a href="">
              <div>
                <img src="{{ asset('image/announce.svg') }}" alt="">
                <span class="ml-2">{{ $announce->talk }}</span>
              </div>
              @if($index == 0)
              <span class="arrow d-block"></span>
              @endif
            </a>
          </li>
          @endforeach
        </ul>
        <div class="d-none">
          <span class="arrow active d-block"></span>
        </div>
      </div>
      <!-- トーク一覧 -->
      <div id="talks" class="scroll-bar-none @if(!$thread->announces->isEmpty()) announce-on @endif reply-on">
        @foreach($thread->talks as $index => $talk)
        @if($index == 0 || $before->sendDate() != $talk->sendDate())
        <!-- 日時 -->
        <div class="send-date">
          <span>{{ $talk->sendDate() }}</span>
        </div>
        @php $before = $talk; @endphp
        @endif

        @if($talk->deleted_at)
        <div class="talk-cancel">
          <span>メッセージの送信を取り消しました</span>
        </div>
        @elseif($talk->user_id == Auth::id())
        <div class="talk-area me shake-talk">
          <div>
            <!-- 時間と既読 -->
            <div class="mt-auto text-right mr-2">
              <p class="mb-0 talk-read-color font-10">既読</p>
              <p class="mb-0 font-10 text-buraun">13:05</p>
            </div>
            @if($talk->iamge)
            <!-- TODO -->
            <img src="{{ asset('storage/' . $talk->iamge) }}" alt="" class="">
            @else
            <!-- 自分のトーク -->
            <div class="talk">
              @if($talk->replyTalk)
              <!-- リプライ -->
              <div class="reply">
                <div class="d-flex">
                  <div class="mr-2 mt-1">
                    <img src="{{ asset($talk->replyTalk->user->image()) }}" alt="" class="profile-image @if($talk->replyTalk->user->image) active @endif reply-profile-image">
                  </div>
                  <div>
                    <span>{{ $talk->replyTalk->user->username }}</span>
                    @if($talk->replyTalk->image)
                    <p>画像</p>
                    @else
                    <p>{{ Str::limit(strstr(strip_tags($this->replyChat->talk, '<br>'), '<br>', true), 40) }}</p>
                    @endif
                  </div>
                </div>
              </div>
              <div>{!! nl2br(e($talk->talk)) !!}</div>
              @else
              <div class="h-100 d-flex align-items-center">
                <div>{!! nl2br(e($talk->talk)) !!}</div>
              </div>
              @endif
            </div>
            @endif
          </div>
        </div>
        @else
        <div class="talk-area you">
          <div>
            <!-- 相手のプロフィール画像 -->
            <div class="mr-3 mt-4">
              <a href="{{ route('user.show', Auth::user()->id) }}">
                <img src="{{ asset($talk->user->image()) }}" alt="" class="profile-image @if($talk->user->image) active @endif talk-profile-image">
              </a>
            </div>
            <div>
              <!-- 相手のユーザー名 -->
              <div class="ml-2 text-buraun">
                <span>{{ Auth::user()->username }}</span>
                <!-- <span>　</span> -->
              </div>
              <!-- 相手のトーク -->
              <div class="talk">
                @if($talk->replyTalk)
                <!-- リプライ -->
                <div class="reply">
                  <div class="d-flex">
                    <div class="mr-2 mt-1">
                      <img src="{{ asset($talk->replyTalk->user->image()) }}" alt="" class="profile-image @if($talk->replyTalk->user->image) active @endif reply-profile-image">
                    </div>
                    <div>
                      <span>{{ $talk->replyTalk->user->username }}</span>
                      @if($talk->replyTalk->image)
                      <p>画像</p>
                      @else
                      <p>{{ Str::limit(strstr(strip_tags($this->replyChat->talk, '<br>'), '<br>', true), 40) }}</p>
                      @endif
                    </div>
                  </div>
                </div>
                <div>{!! nl2br(e($talk->talk)) !!}</div>
                @else
                <div>
                  <div>{!! nl2br(e($talk->talk)) !!}</div>
                </div>
                @endif
              </div>
            </div>
            <!-- 受信時間 -->
            <div class="mt-auto ml-1 text-buraun">
              <span>13:05</span>
            </div>
          </div>
        </div>
        @endif
        @endforeach
      </div>
      <div id="reply-form">
        <div>
          <div class="mr-2 mt-1">
            <img src="{{ asset(Auth::user()->image()) }}" alt="" class="profile-image @if(Auth::user()->image) active @endif reply-profile-image">
          </div>
          <div class="w-100">
            <div class="d-flex justify-content-between">
              <div>宮田大夢</div>
              <div class="pr-2">
                <img src="{{ asset('image/x.svg') }}" width="10" height="10" alt="">
              </div>
            </div>
            <div>あいうえお</div>
          </div>
        </div>
      </div>
      <!-- 送信フォーム -->
      <form action="{{ route('talk.store') }}" method="post" class="talk-form">
        @csrf
        <textarea name="talk" class="form-control-original scroll-bar-none" placeholder="トークを入力"></textarea>
        <div>
          <div class="image-submit">
            <img src="{{ asset('image/clip.svg') }}" width="20" height="20" alt="画像" accept="image/*">
            <input type="file">
          </div>
          <div>
            <button type="submit">
              <input type="hidden" name="thread_id" value="{{ $thread->id }}">
              <img src="{{ asset('image/send-ok.svg') }}" alt="送信可">
              <!-- <img src="{{ asset('image/send-no.svg') }}" alt="送信不可"> -->
            </button>
          </div>
        </div>
      </form>
      <!-- スマホ用送信フォーム -->
      <form action="" class="talk-form-sm">
        <div class="mx-3">
          <img src="{{ asset('image/clip.svg') }}" width="20" height="20" alt="画像" accept="image/*">
          <input type="file">
        </div>
        <textarea name="talk" class="form-control-original rounded-pill scroll-bar-none"></textarea>
        <div class="mx-3">
          <!-- <img src="{{ asset('image/send-ok.svg') }}" alt="送信可"> -->
          <img src="{{ asset('image/send-no.svg') }}" alt="送信不可">
        </div>
      </form>
    </div>
  </div>
  <div class="container-box sub-container hidden">
    @include('layouts.sub_contents')
  </div>
  <div class="sub-container-under hidden" onclick="closeModal(this)"></div>
</div>

@endsection
