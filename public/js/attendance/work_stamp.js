$(function(){
  var y = new Date().getFullYear()
  var m = new Date().getMonth() + 1
  var d = new Date().getDate()
  var ymd = y + '/' + m + '/' + d

  var commute_time = new Date(ymd + ' ' + $('.js-commute-time').text())
  var leave_time = new Date(ymd + ' ' + $('.js-leave-time').text())

  // 出勤時間の1分後
  var add_minute_commute_time = commute_time
  add_minute_commute_time.setMinutes(add_minute_commute_time.getMinutes() + 1)
  $('.js-new-commute-time').attr('min', add_minute_commute_time.getHours() + ':' + ("0" + add_minute_commute_time.getMinutes()).slice(-2))

  // 退勤時間の1分前
  var reduce_minute_leave_time = leave_time;
  reduce_minute_leave_time.setMinutes(reduce_minute_leave_time.getMinutes() - 1)
  $('.js-new-leave-time').attr('max', reduce_minute_leave_time.getHours() + ':' + ("0" + reduce_minute_leave_time.getMinutes()).slice(-2))

  // 項目によって表示を変更
  $(document).on('change', '.js-readon-change', function(){
    var $work_stamp_time = $('#work-stamp-time')
    var $reson_delay = $('#reson-delay')
    var $js_reason = $('.js-reason')

    // 初期化
    $work_stamp_time.css("border", "#dee2e6 2px solid").parent().addClass('d-none').next().text('')
    $reson_delay.css("border", "#dee2e6 2px solid").parent().addClass('d-none').next().text('')
    $js_reason.css("border", "#dee2e6 2px solid").next().text('')

    if($(this).find('option:selected').text() == '遅刻'){
      $work_stamp_time.parent().removeClass('d-none')
    }else if($(this).find('option:selected').text() == '早退'){
      $work_stamp_time.parent().removeClass('d-none')
    }else if($(this).find('option:selected').text() == '遅延のため'){
      $work_stamp_time.parent().removeClass('d-none')
      $reson_delay.parent().removeClass('d-none')
    }

  })
  // 出勤時間を変更した時
  $(document).on('change', '.js-new-commute-time', function(){
    $(this).css("border", "#dee2e6 2px solid").parent().next().text('')
    var new_time = new Date(ymd + ' ' + $(this).val())

    if(new_time < add_minute_commute_time){
      var time = add_minute_commute_time.getHours() + ':' + ("0" + add_minute_commute_time.getMinutes()).slice(-2)
      $(this).val('').parent().next().text(time + 'より後の時間で入力してください')
    }else if(reduce_minute_leave_time < new_time){
      var time = reduce_minute_leave_time.getHours() + ':' + ("0" + reduce_minute_leave_time.getMinutes()).slice(-2)
      $(this).val('').parent().next().text(time + 'より前の時間で入力してください')
    }else{
      $(this).parent().next().text('')
    }
  })
  // 退勤時間を変更した時
  $(document).on('change', '.js-new-leave-time', function(){
    $(this).css("border", "#dee2e6 2px solid")
    var new_time = new Date(ymd + ' ' + $(this).val())

    if(new_time < add_minute_commute_time){
      var time = add_minute_commute_time.getHours() + ':' + ("0" + add_minute_commute_time.getMinutes()).slice(-2)
      $(this).val('').parent().next().text(time + 'より後の時間で入力してください')
    }else if(reduce_minute_leave_time < new_time){
      var time = reduce_minute_leave_time.getHours() + ':' + ("0" + reduce_minute_leave_time.getMinutes()).slice(-2)
      $(this).val('').parent().next().text(time + 'より前の時間で入力してください')
    }else{
      $(this).parent().next().text('')
    }
  })
  // 時・分・秒が一桁のときに0を付ける
  function timeChange(stringTime){
    if(stringTime.length == 1){
      return '0' + stringTime
    }else{
      return stringTime
    }
  }
  // 現在の時間を更新
  setInterval(function(){
    var D = new Date()
    var y = D.getFullYear()
    var m = D.getMonth()+1
    var d = D.getDate()
    var ymd = y + '/' + m + '/' + d

    // 出勤時間
    var commute_time = new Date(ymd + ' ' + $('.js-commute-time').text())

    var h = timeChange(D.getHours().toString())
    var m = timeChange(D.getMinutes().toString())
    var s = timeChange(D.getSeconds().toString())

    var now = h + ':' + m + ':' + s

    $('.js-current-time').text(now)
  }, 1000);
  // 理由を入力
  $(document).on('keyup', '.js-reason', function(){
    $(this).css("border", "#dee2e6 2px solid").next().text('')
  })
  // 出勤・退勤の打刻を押した時
  $(document).on('click', '.js-work-stamp-button', function(){
    var $optin_selected = $('.js-readon-change option:selected')
    var $work_stamp_time = $('#work-stamp-time')
    var $reson_delay = $('#reson-delay')
    var $js_reason = $('.js-reason')

    // 初期化
    $work_stamp_time.css("border", "#dee2e6 2px solid").parent().next().text('')
    $js_reason.css("border", "#dee2e6 2px solid").parent().next().text('')

    if($(this).text() == '出勤'){
      // 遅刻を選択している時
      if($optin_selected.val() == 1){
        // 出勤時間がない場合
        if($work_stamp_time.val() == ''){
          $work_stamp_time.css("border", "#E9546B 2px solid").parent().next().text('出勤時間を入力してください')
        }
        // 理由を入力していない場合
        if($js_reason.val() == ''){
          $js_reason.css("border", "#E9546B 2px solid").next().text('遅刻理由を記入してください')
        }
        if($work_stamp_time.val() == '' || $js_reason.val() == ''){
          return false
        }
      }
      // 遅延の時
      if($optin_selected.val() == 2){
        // 出勤時間がない場合
        if($work_stamp_time.val() == ''){
          $work_stamp_time.css("border", "#E9546B 2px solid").parent().next().text('出勤時間を入力してください')
        }
        // 遅延証明書がない時
        if($reson_delay.val().length == 0){
          $reson_delay.css("border", "#E9546B 2px solid").parent().next().text('遅延証明書を添付してください')
          return false
        }
      }
      var confirm_message = '出勤しますか？'
    }else if($(this).text() == '退勤'){
      if($optin_selected.val() == 1){
        // 退勤時間がない場合
        if($work_stamp_time.val() == ''){
          $work_stamp_time.css("border", "#E9546B 2px solid").parent().next().text('退勤時間を入力してください')
        }
        // 理由を入力していない場合
        if($js_reason.val() == ''){
          $js_reason.css("border", "#E9546B 2px solid").next().text('早退理由を記入してください')
        }

        if($work_stamp_time.val() == '' || $js_reason.val() == ''){
          return false
        }
      }
      var confirm_message = '退勤しますか？'
    }else{
      window.location = '/error'
    }

    if(!confirm(confirm_message)){
      return false
    }
  })
})
