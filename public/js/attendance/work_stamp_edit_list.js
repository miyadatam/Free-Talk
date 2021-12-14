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
  $(document).on('change', '[name="work_stamp_ids[]"]', function(){
    if($('[name="work_stamp_ids[]"]:checked').length > 0){
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

    window.location = '/admin/workstamp/edit/list/' + y + '/' + m
  })
  $(document).on('click', '.js-detail-toggle', function(){
    if($(this).next().is(':hidden')){
      $(this).next().fadeIn(500)
    }else{
      $(this).next().fadeOut(500)
    }
  })
  // 備考の表示
  $('.js-memo-hover').hover(function(){
    $('.js-hover-show').css('opacity', 1).text($(this).text())
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
