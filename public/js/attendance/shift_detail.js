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
      url: '/shift/exist/confirm',
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = 'error'
      }
      var new_timesheet_date_id = res.timesheet_date_id
      if(new_timesheet_date_id){
        window.location = '/shift/' + new_timesheet_date_id
      }else{
        var D = new Date($this.val())
        var y = D.getFullYear()
        var m = D.getMonth() + 1
        var d = D.getDate()

        var ymd = y + '/' + m + '/' + d

        $('.js-calendar-change-error').text(ymd + 'のシフトは存在しません')
        $this.val(res.date)
      }
    }).fail(function(){
      window.location = '/shift/' + old_timesheet_date_id
    })
  })
  // シフト修正ボタンのクリック
  $(document).on('click', '.js-edit-request-button', function(){
    $('.js-shift-edit-request-form').toggleClass('d-none')

  })
  // シフトの修正申請削除ボタンクリック
  $(document).on('click', '.js-shift-edit-request-delete-button', function(){
    if(!confirm('申請を取り消しますか？')){
      return false
    }
  })
  // selectを変更
  $(document).on('change', '.js-new-shift-item', function(){
    // border初期化
    $(this).css("border", "#dee2e6 2px solid")
    // 稼働を選択した時
    if($(this).find('option:selected').val() == 0){
      $(this).parent().next().removeClass('d-none')
    }else{
      $('#attend-time').val('')
      $('#leave-time').val('')
      $(this).parent().next().addClass('d-none')
      if($(this).find('option:selected').val() == 100){
        $(this).css("border", "#E9546B 2px solid")
      }
    }
  })
  // 出退勤時間変更した時
  $(document).on('change', '#attend-time, #leave-time', function(){
    // border色変更
    if($(this).val() == ''){
      $(this).css("border", "#E9546B 2px solid")
    }else{
      $(this).css("border", "#dee2e6 2px solid")
    }
  })
  // 備考を入力した時
  $(document).on('keyup', '.js-shift-edit-memo', function(){
    // border色変更
    if($(this).val() == ''){
      $(this).css("border", "#E9546B 2px solid")
    }else{
      $(this).css("border", "#dee2e6 2px solid")
    }
  })
  // 修正のsubmitを押した時の処理
  $(document).on('click', '.js-shift-edit-form', function(){
    var $new_shift_item = $('.js-new-shift-item')
    var $attend_time  = $('#attend-time')
    var $leave_time  = $('#leave-time')
    // border初期化
    $new_shift_item.css("border", "#dee2e6 2px solid")
    $attend_time.css("border", "#dee2e6 2px solid")
    $leave_time.css("border", "#dee2e6 2px solid")

    var select_option = $new_shift_item.find('option:selected').val()

    if(select_option == 100){
      $('.js-new-shift-item').css("border", "#E9546B 2px solid")
      $('.js-shift-error').text('項目を選択してください')
      return false
    // 稼働を選択した時
    }else if(select_option == 0){
      if($attend_time.val() == '' || $leave_time.val() == ''){
        if($attend_time.val() ==''){
          $attend_time.css("border", "#E9546B 2px solid")
        }
        if($leave_time.val() == ''){
          $leave_time.css("border", "#E9546B 2px solid")
        }

        $('.js-shift-error').text('出退勤時間は入力必須です')
        return false
      }
    }
    var $shift_edit_memo = $('.js-shift-edit-memo')
    if($shift_edit_memo.val() == ''){
      $shift_edit_memo.css("border", "#E9546B 2px solid")
      $('.js-shift-error').text('備考は入力必須です')
      return false
    }

    if($(this).val() == '申請'){
      var confirm_message = '申請しますか？'
    }else{
      var confirm_message = '申請を更新しますか？'
    }
    if(!confirm(confirm_message)){
      return false
    }
  })
  // 承認・却下のボタンを押した時
  $(document).on('click', '.js-approve-button', function (){
    var confirm_message = $(this).attr('name') == 'is_ok' ? '承認しますか？' : '却下しますか？'

    if(!confirm(confirm_message)){
      return false
    }
  })

})
