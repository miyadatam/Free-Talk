$(function(){
  // ユーザー名検索
  $(document).on('keyup', '.js-user-name-search', function(){
    var search_name = $(this).val()
    var total_user_num = 0
    $('.js-user-name').each(function(index, elm){
      // 一致しないユーザーがいたら非表示 いなかったら合計人数を+1する
      if($(elm).attr('user_name').indexOf(search_name) == -1 && $(elm).attr('user_name_kana').indexOf(search_name) == -1){
        $(elm).parent().parent().hide()
      }else{
        $(elm).parent().parent().show()
        total_user_num++
      }
    })
    $('.js-total-user-num').text(total_user_num)
  })
  // カレンダー変更した時
  $(document).on('change', '.js-select-month', function(){
    var client_id = $('.js-client-change').find('option:selected').attr('client_id')
    var date = new Date($(this).val());
    var year = date.getFullYear();
    var month = ('00' + (date.getMonth() + 1)).slice(-2);

    window.location = '/admin/client/' + client_id + '/' + year + '/' + month
  })

  // クライアントを変更した時
  $(document).on('change', '.js-client-change', function(){
    var client_id = $(this).find('option:selected').attr('client_id')
    var year = $('.js-select-month').attr('year')
    var month = $('.js-select-month').attr('month')

    window.location = '/admin/client/' + client_id + '/' + year + '/' + month
  })
  // 備考クリック
  $(document).on('click', '.js-client-memo', function(){
    $('.js-client-memo-input').removeClass('d-none').attr({
      'user_id': $(this).attr('user_id'), 'timesheet_id': $(this).attr('timesheet_id'), 'name': $(this).attr('name')
    })
    .val($(this).val())
  })
  // 備考入力処理
  $(document).on('keyup', '.js-client-memo, .js-client-memo-input', function(){
    var $this = $(this)
    $('.js-client-memo-input').val($this.val())

    $('.js-client-memo').each(function(index, elm){
      if($this.attr('user_id') == $(elm).attr('user_id')){
        $(elm).val($this.val())
      }
    })
  })
  // 備考hover
  $('.js-memo-hover').hover(function(){
    if(!$(':focus').hasClass('js-client-memo-input') && !$(':focus').hasClass('js-client-memo')){
      $('.js-client-memo-input').addClass('d-none')
      $('.js-hover-show').css('opacity', 1).text($(this).text())
    }
  }, function(){
    if(!$(':focus').hasClass('js-client-memo-input') && !$(':focus').hasClass('js-client-memo')){
      $('.js-hover-show').css('opacity', 0).text('　')
    }
  })
  // 備考登録処理
  $(document).on('blur', '.js-client-memo, .js-client-memo-input', function(){
    var data = new Object()
    data[$(this).attr('name')] = $(this).val()
    data.timesheet_id = $(this).attr('timesheet_id')

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/admin/client/memo',
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        console.log(1)
        // window.location = '/error'
      }
    }).fail(function(){
      console.log(2)
      // window.location = '/error'
    })
  })
})
