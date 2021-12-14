$(function(){
  // 承認待ちの人数
  var total_approve_pendding = $('.js-approve-pending').length

  $('.js-total-user-num').text(total_approve_pendding)

  if(total_approve_pendding > 0){
    $('#approve-form').removeClass('d-none')
  }else{
    $('#approve-form').addClass('d-none')
  }
  // 一斉送信のボタンのdisabled
  $(document).on('change', '[name="shift_ids[]"]', function(){
    if($('[name="shift_ids[]"]:checked').length > 0){
      $('.js-submit').prop('disabled', false)
    }else{
      $('.js-submit').prop('disabled', true)
    }
  })
  // カレンダーのチェンジ
  $(document).on('change', '.js-change-calendar', function(){
    var D = new Date($(this).val())
    var y = D.getFullYear()
    var m =  D.getMonth() + 1
    m = ("0" + m).slice(-2)

    window.location = '/admin/shift/edit/list/' + y + '/' + m
  })
  // 詳細検索表示
  $(document).on('click', '.js-detail-toggle', function(){
    if($(this).next().is(':hidden')){
      $(this).next().fadeIn(500)
    }else{
      $(this).next().fadeOut(500)
    }
  })
  // // ユーザー名詳細検索
  // $(document).on('keyup', '.js-username-search', function(){
  //   var search_name = $(this).val()
  //   $('.js-user-name').each(function(index, elm){
  //     // 一致しないユーザーがいたら非表示 いなかったら合計人数を+1する
  //     if($(elm).attr('user_name').indexOf(search_name) == -1 && $(elm).attr('user_name_kana').indexOf(search_name) == -1){
  //       $(elm).parent().parent().hide()
  //     }else{
  //       $(elm).parent().parent().show()
  //     }
  //   })
  // })
  // 備考hoverした時の処理
  $('.js-hover-text').hover(function(){
    if($(this).find('div').text() != ''){
      $('.js-hover-show').css('opacity', 1).text($(this).find('div').text())
    }
  }, function(){
    $('.js-hover-show').css('opacity', 0).text('&8203')
  })
  // 一括承認confirm
  $(document).on('click', '.js-submit', function(){
    if(!confirm('一括で承認してよろしいですか？')){
      return false
    }
  })
})
