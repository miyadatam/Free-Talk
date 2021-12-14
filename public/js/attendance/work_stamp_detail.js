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
        window.location = '/work_stamp/' + new_timesheet_date_id
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
      window.location = '/shift/' + old_timesheet_date_id
    })
  })
  // 打刻修正・編集ボタンのクリック
  $(document).on('click', '.js-edit-request-button', function(){
    var $this = $(this)
    var $form = $('.js-work-stamp-edit-form')
    // 初期化
    $form.find('[name=is_commute]').css("border", "#dee2e6 2px solid").next().addClass('d-none')
    $form.find('[name=exception]').css("border", "#dee2e6 2px solid").next().addClass('d-none')
    $form.find('[name=attendance_time]').css("border", "#dee2e6 2px solid").parent().addClass('d-none').next().addClass('d-none')
    $form.find('[name=reason_delay_image]').parent().addClass('d-none')
    $form.find('[name=reason_delay_image]').css("border", "#dee2e6 2px solid").parent().next().addClass('d-none')
    $form.find('[name=memo]').css("border", "#dee2e6 2px solid").next().addClass('d-none')

    if($this.text() == '編集'){
      var is_commute = $this.attr('is_commute')

      // work_stam_idを渡す
      $('.js-work-stamp-edit-button').attr('work_stamp_id', $(this).attr('work_stamp_id'))

      if($('.js-work-stamp-edit-button').hasClass('btn-success')){
        $form.toggleClass('d-none');
      }else{
        $form.removeClass('d-none');
      }

      // 項目のoption変更
      $('#reson-item').find('option').each(function(index, elm){
        if($(elm).val() === '1'){
          if(is_commute == 1){
            $(elm).text('遅刻')
          }else{
            $(elm).text('早退')
          }
        }else if(index === 3){
          if(is_commute == 1){
            $(elm).show().val(2).text('遅延のため')
          }else{
            $(elm).hide().val('').text('')
          }
        }
      })
      // 出勤 or 退勤のselectタグの処理
      $form.find('[name=is_commute]').prop('disabled', true).find('option').each(function(index, elm){
        if($(elm).val() == is_commute){
          $(elm).prop('selected', true)
        }
      })
      // 項目のセット
      $form.find('[name=exception]').prop('disabled', false).find('option').each(function(index, elm){
        if($(elm).val() == $this.attr('exception')){
          $(elm).prop('selected', true)
        }
      })
      // 時間のセット
      if($this.attr('attendance_time') != ''){
        $form.find('[name=attendance_time]').val($this.attr('attendance_time')).parent().removeClass('d-none')
      }
      if($this.attr('exception') == 2){
        $form.find('[name=reason_delay_image]').parent().removeClass('d-none')
      }
      // 備考のセット
      $form.find('[name=memo]').val($this.attr('memo'))

      // submitのボタン変更
      $('.js-work-stamp-edit-button').addClass('btn-success').val('更新')
    }else{
      // timesheet_date_idを渡す
      $('.js-work-stamp-edit-button').attr('timesheet_date_id', $(this).attr('timesheet_date_id'))

      if(!$('.js-work-stamp-edit-button').hasClass('btn-success')){
        $form.toggleClass('d-none');
      }else{
        $form.removeClass('d-none');
      }
      $form.find('[name=is_commute]').prop('disabled', false).find('option:selected').prop('selected', false)
      $form.find('[name=exception]').prop('disabled', true).find('option:selected').prop('selected', false)
      $form.find('[name=attendance_time]').val('').parent().addClass('d-none')
      $form.find('[name=reason_delay_image]').val('').parent().addClass('d-none')
      $form.find('[name=memo]').val('')
      $('.js-work-stamp-edit-button').removeClass('btn-success').val('申請')
    }

  })
  // 区分によって項目の表示を変更
  $(document).on('change', '#is-attendance-leave', function(){
    var is_commute = $(this).find('option:selected').val()
    // 区分のリセット
    $(this).css("border", "#dee2e6 2px solid")
    $('.js-is-attendance-leave-error').addClass('d-none')
    // 項目のリセット
    $('#reson-item').css("border", "#dee2e6 2px solid").parent().removeClass('d-none')
    $('.js-reason-item-error').addClass('d-none')
    // 出退勤の時間リセット & 非表示
    $('#work-stamp-time').val('').parent().addClass('d-none')
    $('.js-work-stamp-time-error').addClass('d-none')
    // 遅延証明書リセット & 非表示
    $('#reson-delay').val('').parent().addClass('d-none')
    $('.js-reson-delay-error').addClass('d-none')
    // 備考リセット
    $('.js-memo').css("border", "#dee2e6 2px solid").val('')
    $('.js-memo-error').addClass('d-none')

    $('#reson-item').find('option').each(function(index, elm){
      if(index == 0){
        $(elm).prop('selected', true)
        return false
      }
    })

    if(is_commute == ''){
      $('#reson-item').attr('disabled', true)
      return false
    }else{
      $('#reson-item').attr('disabled', false)
    }

    $('#reson-item').find('option').each(function(index, elm){
      if($(elm).val() === '1'){
        if(is_commute == 1){
          $(elm).text('遅刻')
        }else{
          $(elm).text('早退')
        }
      }else if(index === 3){
        if(is_commute == 1){
          $(elm).show().val(2).text('遅延のため')
        }else{
          $(elm).hide().val('').text('')
        }
      }
    })
  })
  // 項目を変更した時の表示非表示
  $(document).on('change', '#reson-item', function(){
    $(this).css("border", "#dee2e6 2px solid")
    $('.js-reason-item-error').addClass('d-none')

    // 出退勤の時間リセット & 非表示
    $('#work-stamp-time').css("border", "#dee2e6 2px solid").val('').parent().addClass('d-none')
    $('.js-work-stamp-time-error').addClass('d-none')

    // 遅延証明書リセット & 非表示
    $('#reson-delay').val('').parent().addClass('d-none')
    $('.js-reson-delay-error').addClass('d-none')
    // 備考リセット
    $('.js-memo').css("border", "#dee2e6 2px solid").val('')
    $('.js-memo-error').addClass('d-none')
    // 条件分岐
    console.log($(this).find('option:selected').text())
    if($(this).find('option:selected').text() == '遅刻'){
      $('#work-stamp-time').prev().text('出勤時間').parent().removeClass('d-none')
    }else if($(this).find('option:selected').text() == '早退'){
      $('#work-stamp-time').prev().text('退勤時間').parent().removeClass('d-none')
    }else if($(this).find('option:selected').text() == '遅延のため'){
      $('#reson-delay').parent().removeClass('d-none')
      $('#reson-delay').parent().parent().prev().find('label').removeClass('d-none').find('span').text('出勤時間')
    }
  })
  // 時間を変更した時の処理
  $(document).on('change', '#work-stamp-time', function(){
    $(this).css("border", "#dee2e6 2px solid").parent().next().addClass('d-none')
  })
  // 画像を変更した時の処理
  $(document).on('change', '#reson-delay', function(){
    $(this).css("border", "#dee2e6 2px solid").parent().next().addClass('d-none')
  })
  // 備考をkyeupした時の処理
  $(document).on('keyup', '.js-memo', function(){
    $(this).css("border", "#dee2e6 2px solid").next().addClass('d-none')
  })
  // 申請・更新submit処理
  $(document).on('click', '.js-work-stamp-edit-button', function(){
    var $attendance_leave = $('#is-attendance-leave')
    var $reson_item = $('#reson-item')
    var $work_stamp_time = $('#work-stamp-time')
    var $reson_delay = $('#reson-delay')
    var $memo = $('.js-memo')

    if($(this).val() == '申請'){
      var confirm_message = '申請しますか？'
      $('.js-input-method').attr('name', '')
      $('.js-work-stamp-edit-form').attr('action', '/work_stamp/edit/request/' + $(this).attr('timesheet_date_id'))
    }else{
      var confirm_message = '更新しますか？'
      $('.js-input-method').attr('name', '_method')
      $('.js-work-stamp-edit-form').attr('action', '/work_stamp/edit/request/' + $(this).attr('work_stamp_id'))
    }
    // 出勤・退勤を選択しているかどうか
    if(jQuery.inArray($attendance_leave.find('option:selected').val(), ['0', '1']) == -1){
      $attendance_leave.css("border", "#E9546B 2px solid")
      $('.js-is-attendance-leave-error').removeClass('d-none')
      var error_flg = true
    }else{
      $attendance_leave.css("border", "#dee2e6 2px solid")
      $('.js-is-attendance-leave-error').addClass('d-none')
    }

    // 項目が選択されているかどうか
    if(jQuery.inArray($reson_item.find('option:selected').val(), ['0', '1', '2']) == -1){
      $reson_item.css("border", "#E9546B 2px solid")
      $('.js-reason-item-error').removeClass('d-none')
      var error_flg = true
    }else{
      $reson_item.css("border", "#dee2e6 2px solid")
      $('.js-reason-item-error').addClass('d-none')
    }

    // 時間が空かどうか
    if(!$work_stamp_time.parent().hasClass('d-none') && $work_stamp_time.val() == ''){
      $work_stamp_time.css("border", "#E9546B 2px solid")
      $('.js-work-stamp-time-error').removeClass('d-none')
      var error_flg = true
    }else{
      $work_stamp_time.css("border", "#dee2e6 2px solid")
      $('.js-work-stamp-time-error').addClass('d-none')
    }

    // 画像が空かどうか
    if($(this).val() == '申請' && !$reson_delay.parent().hasClass('d-none') && $reson_delay.val().length == 0){
      $reson_delay.css("border", "#E9546B 2px solid")
      $('.js-reson-delay-error').removeClass('d-none')
      var error_flg = true
    }else{
      $reson_delay.css("border", "#dee2e6 2px solid")
      $('.js-reson-delay-error').addClass('d-none')
    }

    // 遅刻・早退・欠勤の時に備考が空かどうか
    if($memo.val() == '' && ($reson_item.find('option:selected').val() == 1 || $attendance_leave.find('option:selected').val() == 2)){
      $memo.css("border", "#E9546B 2px solid")
      // 出勤 or 退勤
      if($attendance_leave.find('option:selected').val() == 1){
        $('.js-memo-error').text('遅刻理由を入力してください').removeClass('d-none')
      }else{
        $('.js-memo-error').text('早退理由を入力してください').removeClass('d-none')
      }
      var error_flg = true
    }else{
      $memo.css("border", "#dee2e6 2px solid")
      $('.js-memo-error').addClass('d-none')
    }

    if(error_flg){
      return false
    }

    if(!confirm(confirm_message)){
      return false
    }
  })
  // 承認・却下submit処理
  $(document).on('click', '.js-work-stamp-approve-button', function(){
    var confirm_message = $(this).attr('name') == 'is_ok' ? '承認しますか？' : '却下しますか？'

    if(!confirm(confirm_message)){
      return false
    }
  })
  // 削除confirm処理
  $(document).on('click', '.js-shift-edit-request-delete-button', function(){
    if(!confirm('削除しますか？')){
      return false
    }
  })
})
