$(function(){
  // クライアント名検索
  $(document).on('keyup', '.js-client-search', function(){
    var search_name = $(this).val()
    var total_client_num = 0
    $('.js-client-name').each(function(index, elm){
      // 一致しないユーザーがいたら非表示 いなかったら合計人数を+1する
      if($(elm).text().indexOf(search_name) == -1){
        $(elm).parent().parent().parent().hide()
      }else{
        $(elm).parent().parent().parent().show()
        total_client_num++
      }
    })
    $('.js-total-client-num').text(total_client_num)
  })
  // クライアント追加を押した時の処理
  $(document).on('click', '.js-client-add-button', function(){
    // エラーメッセージを空にして透明にする
    $('.js-error-message').css('opacity', 0).text('　')
    // クライアント名入力inputの中身を空にする
    if(!$('.js-client-edit-form').hasClass('d-none')){
      $('.js-client-name-input').val('')
      $('.js-client-edit-form').addClass('d-none')
      $('.js-client-create-form').removeClass('d-none')
    }else{
      $('.js-client-create-form').toggleClass('d-none')
    }
  })
  // 編集のボタンを押した時の処理
  $(document).on('click', '.js-client-edit-button', function(){
    // エラーメッセージを空にして透明にする
    $('.js-error-message').css('opacity', 0).text('　')
    $('.js-client-create-form').addClass('d-none')
    // クライアント名
    var client_name = $(this).parent().siblings(':first-child').find('a').text()

    if($(this).attr('client_id') == $('.js-client-edit-form').find('.js-client-submit').attr('client_id')){
      if($('.js-client-edit-form').hasClass('d-none')){
        $('.js-client-name-input').val(client_name)
        $('.js-client-edit-form').removeClass('d-none')
      }else{
        $('.js-client-name-input').val('')
        $('.js-client-edit-form').addClass('d-none')
      }
    }else{
      // クライアント名をinputに入れる
      $('.js-client-name-input').val(client_name)
      // フォーム表示
      $('.js-client-edit-form').removeClass('d-none')
    }
    $('.js-client-edit-form').find('.js-client-submit').attr('client_id', $(this).attr('client_id'))
  })
  // クライアントの追加 or 更新のsubmitを押した時
  $(document).on('click', '.js-client-submit', function(){
    $('.js-error-message').text('　')
    // 追加なのか更新なのか
    if($(this).val() == '追加'){
      // createかどうかのフラグ
      var url = '/admin/client'
      var data = new Object()
      data.client_name = $('.js-client-create-form').find('.js-client-name-input').val()
      var confirm_text = '追加しますか？'
    }else{
      var url = '/admin/client/' + $(this).attr('client_id')
      var data = new Object();
      data.client_name = $('.js-client-edit-form').find('.js-client-name-input').val()
      data._method = 'PATCH'
      var confirm_text = '更新しますか？'
    }
    var error_message = ''
    if(data.client_name == ''){
      error_message = '入力必須です'
    }else if(data.client_name.length >= 255){
      error_message = '255文字以内で入力してください'
    }
    // エラーがある時
    if(error_message != ''){
      $('.js-error-message').css('opacity', 1).text(error_message)
      return false
    }
    // エラーがない時
    if(!confirm(confirm_text)){
      return false
    }
    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: url,
      type: 'POST',
      data
    }).done(function(res){
      if(res.error_message){
        $('.js-error-message').css('opacity', 1).text(res.error_message)
        return false
      }
      if(res.client){
        var client = res.client
        $('.js-client-name').each(function(index, elm){
          if($(elm).attr('client_id') == client.id){
            $(elm).text(client.name)
            return false
          }
        })
      }
      // 編集formを非表示
      $('.js-client-edit-form').addClass('d-none')
      // 追加formを表示しinputの中身を
      $('.js-client-create-form').removeClass('d-none').find('.js-client-name-input').val('')
      // 追加の時html生成しクライアント数を一つ増やす
      if(res.render){
        var client_num = Number($('.js-total-client-num').text()) + 1;
        $('.js-client-list').prepend(res.render)
        $('.js-total-client-num').text(client_num)
      }
      // クライアント検索のinput表示
      $('.js-client-search').removeClass('d-none')
      $('.js-client-search').val('')
    }).fail(function(){
      window.location = '/error'
    });
  })
  // 削除の確認modal
  $(document).on('click', '.js-delete-button', function(){
    if(!confirm('削除しますか？')){
      return false
    }
    $('.js-delete-form').submit()
  })
})
