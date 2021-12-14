$(function(){
  // 詳細検索表示
  $(document).on('click', '.js-detail-toggle', function(){
    if($(this).parent().next().is(':hidden')){
      $(this).parent().next().fadeIn(500)
    }else{
      $(this).parent().next().fadeOut(500)
    }
  })
  // // ユーザー名詳細検索
  // $(document).on('keyup', '.js-username-search', function(){
  //   var search_name = $(this).val()
  //   var total_user_num = 0;
  //   $('.js-user-name').each(function(index, elm){
  //     // 一致しないユーザーがいたら非表示 いなかったら合計人数を+1する
  //     if($(elm).attr('user_name').indexOf(search_name) == -1 && $(elm).attr('user_name_kana').indexOf(search_name) == -1){
  //       $(elm).parent().parent().hide()
  //     }else{
  //       $(elm).parent().parent().show()
  //       total_user_num++;
  //     }
  //   })
  //   $('.js-total-user-num').text(total_user_num)
  // })
  // 備考・メモをクリックした時
  $(document).on('click', '.js-memo', function(e){
    $('.js-hover-show').text('').css('opacity', 0)
    $('.js-memo-input').removeClass('d-none')
    .val($(this).val()).attr('user_id', $(this).attr('user_id'))
  })
  // // inputに入力した時
  // $(document).on('keyup', '.js-memo, .js-memo-input', function(){
  //   var $this = $(this)
  //   $('.js-memo-input').val($this.val())
  //   $('.js-memo').each(function(index, elm){
  //     if($this.attr('user_id') == $(elm).attr('user_id')){
  //       $(elm).val($this.val())
  //       return false
  //     }
  //   })
  // })
  // 備考hoverした時の処理
  $('.js-hover-text').hover(function(){
    if(!$(':focus').hasClass('js-memo-input') && !$(':focus').hasClass('js-memo')){
      if($(this).find('div').text() != ''){
        $('.js-memo-input').addClass('d-none')
        $('.js-hover-show').css('opacity', 1).text($(this).find('div').text())
      }
    }
  }, function(){
    if(!$(':focus').hasClass('js-memo-input') && !$(':focus').hasClass('js-memo')){
      $('.js-hover-show').css('opacity', 0).text('&8203')
    }
  })
  // シフト期限更新処理
  $(document).on('change', '.js-shift-deadline, .js-timesheet-deadline', function(){
    var data = new Object()
    data._method = "PATCH"
    data.deadline = $(this).val()
    // シフトの期限の更新 or タイムシートの期限更新
    if($(this).hasClass('js-shift-deadline')){
      var url = '/admin/shift/deadline/' + $(this).attr('timesheet_list_id')
    }else{
      var url = '/admin/timesheet/deadline/' + $(this).attr('timesheet_list_id')
    }
    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: url,
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = '/error'
      }
    }).fail(function(){
      window.location = '/error'
    })
  })
  // // 登録処理
  // $(document).on('blur', '.js-memo, .js-memo-input', function(){
  //   // TODO
  //   $('.js-memo-input').addClass('d-none').attr('user_id', '')
  // })
  // クライアント登録
  $(document).on('change', '#client-id', function(){
    var data = new Object();
    data.client_id = $(this).val()
    data.timesheet_list_id = $(this).attr('timesheet_list_id')
    data.user_id = $(this).attr('user_id')

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/admin/client/register',
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = '/error'
      }
    }).fail(function(){
      window.location = '/error'
    })
  })
  // 月報確認・稼働確認・交通費確認 登録処理
  $(document).on('change', '#month-report-confirm, #work-confirm, #traffic-price-confirm', function(){
    if($(this).val() != 0 && $(this).val() != 1){
      // window.location = 'error'
      console.log($(this).val())
      debugger
    }

    var data = new Object()
    data[$(this).attr('name')] = $(this).val()
    data.timesheet_list_id = $(this).attr('timesheet_list_id')
    data.user_id = $(this).attr('user_id')

    console.log(data)

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/admin/confirm/collection/register',
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = '/error'
      }
    }).fail(function(){
      window.location = '/error'
    })
  })
})
