@extends('layouts.app')

@section('title', 'トーク')

@section('main')

<div id="app" class="content-area">
  <h2 class="font-weight-bold">トーク</h2>
  <talk-index :categories="{{ json_encode(Auth::user()->categories) }}" :current_category="{{ $current_category }}"></talk-index>
  <div class="container-box sub-container hidden">
    @include('layouts.sub_contents')
  </div>
  <div class="sub-container-under hidden" onclick="closeModal(this)"></div>
</div>

<script>
$('.js-category-name-edit').click(function(){
  selectDomElm(this)
})

// 参考サイトhttps://konyu.hatenablog.com/entry/2015/04/05/235432
function selectDomElm(obj){
  // Rangeオブジェクトの取得
  var range = document.createRange()
  // 範囲の指定
  range.selectNodeContents(obj)

  // Selectionオブジェクトを返す。ユーザが選択した範囲が格納されている
  var selection = window.getSelection()
  // 選択をすべてクリア
  selection.removeAllRanges()
  // 新規の範囲を選択に指定
  selection.addRange(range)
}
</script>

@endsection
