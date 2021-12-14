$(function(){
  // カレンダーのチェンジ
  $(document).on('change', '.js-change-calendar', function(){
    var D = new Date($(this).val())
    var y = D.getFullYear()
    var m =  D.getMonth() + 1
    m = ("0" + m).slice(-2)

    window.location = '/admin/un_workstamps/' + y + '/' + m
  })
  // 詳細検索表示
  $(document).on('click', '.js-detail-toggle', function(){
    if($(this).next().is(':hidden')){
      $(this).next().fadeIn(500)
    }else{
      $(this).next().fadeOut(500)
    }
  })
  // 未出勤の備考クリック
  $(document).on('click', '.js-start-memo', function(){
    $('.js-end-memo-input').addClass('d-none')
    $('.js-start-memo-input').removeClass('d-none').attr({
      'timesheet_date_id': $(this).attr('timesheet_date_id'), 'is_attend': $(this).attr('is_attend')
    }).val($(this).val())
  })
  // 未退勤の備考クリック
  $(document).on('click', '.js-end-memo', function(){
    $('.js-start-memo-input').addClass('d-none')
    $('.js-end-memo-input').removeClass('d-none').attr({
      'timesheet_date_id': $(this).attr('timesheet_date_id'), 'is_attend': $(this).attr('is_attend')
    }).val($(this).val())
  })
  // 未出勤備考入力
  $(document).on('keyup', '.js-start-memo-input, .js-start-memo', function(){
    var $this = $(this)

    $('.js-start-memo-input').val($this.val())
    $('.js-start-memo').each(function(index, elm){
      if($this.attr('timesheet_date_id') == $(elm).attr('timesheet_date_id')){
        $(elm).val($this.val())
      }
    })
  })
  // 未退勤備考入力
  $(document).on('keyup', '.js-end-memo-input, .js-end-memo', function(){
    var $this = $(this)
    $('.js-end-memo-input').val($this.val())
    $('.js-end-memo').each(function(index, elm){
      if($this.attr('user_id') == $(elm).attr('user_id')){
        $(elm).val($this.val())
      }
    })
  })
  // 連絡済みのチェックボックス押した時の処理
  $(document).on('change', '[name="timesheet_date_id"]', function(){
    var $this = $(this)
    var data = new Object()
    data.timesheet_date_id = $this.val()
    data.is_attend = $this.attr('is_attend')
    data.is_check = $this.is(':checked') ? 1 : 0

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/admin/un_work_stamp/contact/toggle',
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = 'error'
      }
      // チェックが入ったら自分の名前を入れる
      if($this.is(':checked')){
        $this.next().text(res.contact_username)
      }else{
        $this.next().text('')
      }
    }).fail(function(){
      window.location = 'error'
    })
  })
  // 未出勤備考登録
  $(document).on('blur', '[name="memo"]', function(){
    var data = new Object()
    data.timesheet_date_id = $(this).attr('timesheet_date_id')
    data.is_attend = $(this).attr('is_attend')
    data.memo = $(this).val()

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/admin/un_work_stamp/memo',
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        // window.location = 'error'
        console.log(1)
      }
    }).fail(function(){
      // window.location = 'error'
      console.log(2)
    })
  })
})
