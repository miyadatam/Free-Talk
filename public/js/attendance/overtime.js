$(function(){
  // カレンダーの変更
  $(document).on('change', '.js-date-change', function(){
    var $this = $(this)
    // urlからtimesheet_date_idを取得している
    var url_split = location.href.split("/");
    var old_timesheet_date_id = url_split[url_split.length -1];

    var data = new Object();
    data.timesheet_date_id = old_timesheet_date_id
    data.date = $(this).val()

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/overtime/exist/confirm',
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = 'error'
      }
      var new_timesheet_date_id = res.timesheet_date_id
      if(new_timesheet_date_id){
        window.location = '/overtime/' + new_timesheet_date_id
      }else{
        var D = new Date($this.val())
        var y = D.getFullYear()
        var m = D.getMonth() + 1
        var d = D.getDate()

        var ymd = y + '/' + m + '/' + d

        $('.js-calendar-change-error').text(ymd + 'の打刻が存在しません')
        $this.val(res.date)
      }
    }).fail(function(){
      window.location = '/overtime/' + old_timesheet_date_id
    })
  })
  // 申請・編集ボタンのクリック
  $(document).on('click', '.js-overtime-request-button', function(){
    var $this = $(this)

    // 初期設定
    $('#is-attendance-leave').css("border", "#dee2e6 2px solid").next().addClass('d-none')
    $('#start-time').css("border", "#dee2e6 2px solid").parent().parent().next().addClass('d-none')
    $('#end-time').css("border", "#dee2e6 2px solid")
    $('[name="memo"]').css("border", "#dee2e6 2px solid").next().addClass('d-none')

    if($('.js-overtime-submit').attr('overtime_id') == $this.attr('overtime_id')){
      $('.js-form').toggleClass('d-none');
    }else{
      $('.js-form').removeClass('d-none');
    }

    if($this.text() == '編集'){
      $('.js-overtime-submit').val('更新').addClass('btn-success').attr('overtime_id', $this.attr('overtime_id'))
      // 区分表示処理
      $('#is-attendance-leave').find('option').each(function(index, elm){
        if($this.attr('is_early') == $(elm).val()){
          $(elm).prop('selected', true).parent().prop('disabled', true)
        }
      })
      // 開始時間表示処理
      $('#start-time').val($this.attr('start_time'))
      // 終了時間表示処理
      $('#end-time').val($this.attr('end_time'))
      // クライアント承認のボタンの処理
      $('[name="is_client_approve"]').each(function(index, elm){
        if($(elm).val() == $this.attr('is_client_approve')){
          $(elm).prop('checked', true)
        }else{
          $(elm).prop('checked', false)
        }
      })
      // 備考処理
      $('[name="memo"]').val($this.attr('memo'))

    }else{
      $('.js-overtime-submit').val('申請').removeClass('btn-success')
      // 区分表示処理
      $('#is-attendance-leave').prop('disabled', false)
      $('#is-attendance-leave').find('option').each(function(index, elm){
        if($(elm).val() == 100){
          $(elm).prop('selected', true)
        }else{
          $(elm).prop('selected', false)
        }
      })
      // 開始時間表示処理
      $('#start-time').val('')
      // 終了時間表示処理
      $('#end-time').val('')
      // クライアント承認のボタンの処理
      $('[name="is_client_approve"]').each(function(index, elm){
        if($(elm).val() == 0){
          $(elm).prop('checked', true)
        }else{
          $(elm).prop('checked', false)
        }
      })
      // 備考処理
      $('[name="memo"]').val('')
    }

  })
  // 残業・早出の修正申請削除ボタンクリック
  $(document).on('click', '.js-request-delete-button', function(){
    if(!confirm('申請を取り消しますか？')){
      return false
    }
  })
  // 区分をチェンジした時
  $(document).on('change', '#is-attendance-leave', function(){
    $(this).css("border", "#dee2e6 2px solid").next().addClass('d-none')
    if($(this).val() == 0){
      $('[name="memo"]').attr('placeholder', '残業の理由を入力してください')
    }else if($(this).val() == 1){
      $('[name="memo"]').attr('placeholder', '早出の理由を入力してください')
    }else{
      $('[name="memo"]').attr('placeholder', '')
    }
  })
  // 時間をチェンジした時
  $(document).on('change', '#start-time, #end-time', function(){
    $(this).css("border", "#dee2e6 2px solid").parent().parent().next().addClass('d-none').text('')
  })
  // 備考を入力した時
  $(document).on('keyup', '[name="memo"]', function(){
    $(this).css("border", "#dee2e6 2px solid").next().addClass('d-none')
  })
  // 申請・更新を押した時
  $(document).on('click', '.js-overtime-submit', function(){
    var $is_attendance_leave = $('#is-attendance-leave')
    var $start_time = $('#start-time')
    var $end_time = $('#end-time')
    var $is_client_approve = $('[name="is_client_approve"]')
    var $memo = $('[name="memo"]')

    var is_error = false

    if($(this).val() == '申請'){
      var confirm_message = '申請しますか？'
      $('.js-form').attr('action', '/overtime/' + $(this).attr('timesheet_date_id'))
      $('.js-method-input').attr('name', '')
    }else{
      var confirm_message = '更新しますか？'
      $('.js-form').attr('action', '/overtime/' + $(this).attr('overtime_id'))
      $('.js-method-input').attr('name', '_method')
    }
    // 区分
    if($is_attendance_leave.find('option:selected').val() != 0 && $is_attendance_leave.find('option:selected').val() != 1){
      $is_attendance_leave.css("border", "#E9546B 2px solid").next().removeClass('d-none')
      is_error = true
    }
    // 出勤時間のバリデーション
    if($start_time.val() == ''){
      $start_time.css("border", "#E9546B 2px solid").parent().parent().next().text('開始時間を入力してください').removeClass('d-none')
      is_error = true
    }

    // 退勤時間のバリデーション
    if($end_time.val() == ''){
      var $next = $end_time.parent().parent().next()
      $end_time.css("border", "#E9546B 2px solid")

      if($next.text() == ''){
        var error_message = '終了時間を入力してください'
      }else{
        var error_message = '開始時間・終了時間を入力してください'
      }
      $next.removeClass('d-none').text(error_message)
      is_error = true
    }

    // 備考バリデーション
    if($memo.val() == ''){
      $memo.css("border", "#E9546B 2px solid").next().removeClass('d-none')
      is_error = true
    }

    if(is_error){
      return false
    }


    if(!confirm(confirm_message)){
      return false
    }
  })
  // 承認・却下submit処理
  $(document).on('click', '.js-approve-button', function(){
    var confirm_message = $(this).attr('name') == 'is_ok' ? '承認しますか？' : '却下しますか？'

    if(!confirm(confirm_message)){
      return false
    }
  })
})
