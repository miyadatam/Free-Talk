$(function(){
  // 交通費変更の理由が記載されていなかったら備考のborderの色とplaceholderを変更する(自分の時 = input)
  $('[name="charge_traffic_price"]').each(function(index, elm){
    var timesheet_date_id = $(elm).parent().parent().attr('timesheet_date_id')
    var $daily_memo = $(elm).parent().next().find('.js-daily-memo')
    if($(elm).val() != '' && $(elm).attr('origin_price') != $(elm).val() && $daily_memo.val() == ''){
      $daily_memo.attr('placeholder', '交通費の変更理由を記載してください').css("border", "#E9546B 2px solid")
    }else{
      $daily_memo.attr('placeholder', '').css("border", "#dee2e6 2px solid")
    }
  })
  // 交通費変更の理由が記載されていなかったら備考のborderの色を変更する(自分以外の時 = div)
  $('.charge-traffic-price').each(function(index, elm){
    var $daily_memo_area = $(elm).parent().parent().next()
    if($(elm).text() != $(elm).attr('origin_price') && $daily_memo_area.find('div').text() == ''){
      $daily_memo_area.css("border", "#E9546B 2px solid")
    }else{
      $daily_memo_area.css("border", "#dee2e6 2px solid")
    }
  })
  // 欠勤理由が入力されているか
  $('.is_absence').each(function(index, elm){
    var $daily_memo_area = $(elm).parent().next().next().next().next()
    // 本人のとき(input)
    if($daily_memo_area.children('input').val() == ''){
      $daily_memo_area.children('input').css("border", "#E9546B 2px solid").attr('placeholder', '欠勤の理由を入力してください')
    }else{
      $daily_memo_area.children('input').css("border", "#dee2e6 2px solid").attr('placeholder', '')
    }

    // 本人以外の時(div)
    if($daily_memo_area.children('div').length != 0 && $daily_memo_area.children('div').text() == ''){
      $daily_memo_area.css("border", "#E9546B 2px solid")
    }else{
      $daily_memo_area.css("border", "#dee2e6 1px solid")
    }

  })
  // 月チェンジ
  $(document).on('change', '.js-change-month', function(){
    if($(this).val() != ''){
      var d = new Date($(this).val())
    }else{
      var d = new Date()
    }
    var year = d.getFullYear()
    var month = ('0' + (d.getMonth() + 1)).slice(-2)
    window.location = '/timesheet/' + $(this).attr('user_id') + '/' + year + '/' + month
  })
  // シフト承認・タイムシート承認(人事)・タイムシート承認(管理)の更新処理
  $(document).on('change', '.js-change-update', function(){
    var data = new Object();
    data._method = "PATCH"
    data[$(this).attr('name')] = $(this).val()
    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/timesheet/' + $('.js-timesheet-id').val(),
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = 'error';
      }
      location.reload()
    }).fail(function(){
      window.location = '/error'
    })
  })
  // 自宅最寄り駅・稼働先最寄り駅・備考・管理メモ文字数バリデーション
  $(document).on('keyup', '.js-blur-update', function(){
    var error_class_name = $(this).attr('error_class')
    // borderを初期化
    $(this).css("border", "#dee2e6 2px solid")
    $('.' + error_class_name).text('')
    if($(this).val().length > 500){
      $('.' + error_class_name).text('500文字以内で入力してください')
      $(this).css("border", "#E9546B 2px solid")
    }
  })
  // 自宅最寄り駅・稼働先最寄り駅・備考・管理メモ更新処理
  $(document).on('blur', '.js-blur-update', function(){
    if($(this).val().length < 500){
      // 交通ルートの管理メモかどうか
      if($(this).attr('root_num')){
        url = '/manage_memo/update/' + $(this).attr('traffic_root_id')
      }else{
        url = '/timesheet/' + $('.js-timesheet-id').val()
      }
      var data = new Object();
      data._method = "PATCH"
      data[$(this).attr('name')] = $(this).val()

      $.ajax({
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        url: url,
        type: 'POST',
        data
      }).done(function(res){
        if(res.error){
          window.location = 'error';
        }
      })
      .fail(function(){
        window.location = '/error'
      })
    }
  })
  // 定期・チャージの交通ルートをchangeした時の処理
  $(document).on('change', '[name="total_commuter_pass"], [name="total_train_price"]', function(){
    if($(this).val() >= 0){
      var data = new Object();
      data._method = "PATCH"
      data[$(this).attr('name')] = $(this).val()
      $.ajax({
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        url: '/timesheet/' + $('.js-timesheet-id').val(),
        type: 'POST',
        data
      }).done(function(res){
        if(res.error){
          window.location = 'error'
        }

        // チャージと定期の合計を出力
        $('.js-all-train-price').text(res.all_train_price + '円')

      }).fail(function(){
        window.location = 'error'
      })
    }
  })
  // input, textareaクリックした時の処理
  $(document).on('click', 'input, textarea', function(){
    if(!$(this).hasClass('js-traffic-root-input')){
      $('.js-traffic-root-input').addClass('d-none')
    }
    if(!$(this).hasClass('js-commuter-pass-input')){
      $('.js-commuter-pass-input').addClass('d-none')
    }
  })
  // 交通ルート・定期表示非表示
  $(document).on('click', '.js-hide-button', function(){
    $(this).next().next().toggleClass('d-none')
    // 交通ルート or 定期の時
    if($(this).attr('is-traffic-root')){
      $(this).parent().next().toggleClass('d-none')
    }
  });

  // ↓↓↓↓↓交通ルート↓↓↓↓↓
  // 交通ルート登録form表示非表示
  $(document).on('click', '.js-traffic-add-button', function(){
    // エラーメッセージを全角のスペースにする
    $('.js-traffic-root-error-message').text('　')
    // 交通ルート番号
    var total_traffic_root = Number($('.js-traffic-root-tr').length) + 1
    $('.js-traffic-root-form').find('.js-traffic-root-num').text('ルート' + total_traffic_root)
    // ルートfrom
    $('.js-traffic-root-form').find('.js-traffic-root-from').val('')
    // ルートto
    $('.js-traffic-root-form').find('.js-traffic-root-to').val('')
    // 交通費
    $('.js-traffic-root-form').find('.js-traffic-root-price').val('')
    // 備考
    $('.js-traffic-root-form').find('.js-traffic-root-memo').val('')

    if(!$('.js-traffic-root-form').find('.js-traffic-root-submit').hasClass('btn-success')){
      $('.js-traffic-root-form').toggleClass('d-none')
    }
    // submitボタン
    $('.js-traffic-root-form').find('.js-traffic-root-submit').removeClass('btn-success').val('追加')
  });
  // 交通ルート編集ボタンを押した時
  $(document).on('click', '.js-traffic-edit-button', function(){
    // 交通ルートIDをsubmitボタンに渡す
    $('.js-traffic-root-submit').attr('traffic_root_id', $(this).attr('traffic_root_id'))
    $('.js-traffic-root-form').removeClass('d-none')
    // 交通ルート番号
    $('.js-traffic-root-form').find('.js-traffic-root-num').text($(this).parent().siblings('.js-root-num').text())
    // ルートfrom
    $('.js-traffic-root-form').find('.js-traffic-root-from').val($(this).parent().siblings('.js-traffic-root').attr('from'))
    // ルートto
    $('.js-traffic-root-form').find('.js-traffic-root-to').val($(this).parent().siblings('.js-traffic-root').attr('to'))
    // 交通費
    $('.js-traffic-root-form').find('.js-traffic-root-price').val(Number($(this).parent().siblings('.js-traffic-price').find('span').text()))
    // 備考
    $('.js-traffic-root-form').find('.js-traffic-root-memo').val($(this).parent().siblings('.js-traffic-user-memo').children().text())
    // submitボタン
    $('.js-traffic-root-form').find('.js-traffic-root-submit').addClass('btn-success').val('更新')
  })
  // 交通ルート登録・更新 confirm
  $(document).on('click', '.js-traffic-root-submit', function(){
    if($(this).val() == '追加'){
      var confirm_message = '追加しますか？'
      var action = '/traffic_root'
      // hiddenのmethodの中身を空にする
      $('.js-traffic-root-method').attr('name', '').val('')
    }else{
      var confirm_message = '更新しますか？'
      var action = '/traffic_root/' + $(this).attr('traffic_root_id')
      // hiddenのmethodの中身をセットする
      $('.js-traffic-root-method').attr('name', '_method').val('PATCH')
    }
    // actionセット
    $('.js-traffic-root-form').attr('action', action)
    // バリデーション
    if($('.js-traffic-root-from').val() == ''){
      if($('.js-traffic-root-to').val() == ''){
        $('.js-traffic-root-error-message').text('fromとtoは入力必須です')
      }else{
        $('.js-traffic-root-error-message').text('fromは入力必須です')
      }
      return false
    }
    // toのみ空かどうか
    if($('.js-traffic-root-to').val() == ''){
      $('.js-traffic-root-error-message').text('toは入力必須です')
      return false
    }
    // 500文字制約
    if($('.js-traffic-root-from').val().length > 500 || $('.js-traffic-root-to').val().length > 500 || $(this).parent().prev().find('.js-traffic-root-memo').val().length > 500){
      $('.js-traffic-root-error-message').text('fromとtoと備考は500文字以内で入力してください')
      return false
    }
    if($('.js-traffic-root-price').val() <= 0){
      $('.js-traffic-root-error-message').text('交通費を正しく入力してください')
      return false
    }
    // 確認モーダル
    if(!confirm(confirm_message)){
      return false
    }
  })
  // 交通ルート・定期 削除confirm
  $(document).on('click', '.js-traffic-root-delete', function(){
    if(!confirm('削除しますか？')){
      return false
    }
  })
  // 交通ルートの備考, 管理メモをクリック
  $(document).on('click', '.js-traffic-root-memo', function(){
    $('.js-traffic-root-input').attr('root_num', $(this).attr('root_num')).attr('traffic_root_id', $(this).attr('traffic_root_id'))
    .removeClass('d-none').val($(this).val())
  })
  // 交通ルートの備考input入力
  $(document).on('keyup', '.js-traffic-root-memo, .js-traffic-root-input', function(){
    var $this = $(this)
    $('.js-traffic-root-input').val($this.val())
    $('.js-traffic-root-memo').each(function(index, elm){
      if($(elm).attr('root_num') == $this.attr('root_num')){
        $(elm).val($this.val())
      }
    })
  })

  // ↓↓↓↓↓定期↓↓↓↓↓
  // 定期登録form表示非表示
  $(document).on('click', '.js-commuter-pass-add-button', function(){
    // エラーメッセージを全角のスペースにする
    $('.js-commuter-pass-error-message').text('　')
    // 開始日のmaxを初期化
    $('.js-commuter-pass-period-start').attr('max', '')
    // 終了日のminを初期化
    $('.js-commuter-pass-period-end').attr('min', '')
    // 交通ルート番号
    var total_traffic_root = Number($('.js-commuter-pass-tr').length) + 1
    $('.js-commuter-pass-form').find('.js-commuter-pass-num').text('定期' + total_traffic_root)
    // ルートfrom
    $('.js-commuter-pass-form').find('.js-commuter-pass-from').val('')
    // ルートto
    $('.js-commuter-pass-form').find('.js-commuter-pass-to').val('')
    // 期間開始日
    $('.js-commuter-pass-form').find('.js-commuter-pass-period-start').val('')
    // 期間終了日
    $('.js-commuter-pass-form').find('.js-commuter-pass-period-end').val('')
    // 交通費
    $('.js-commuter-pass-form').find('.js-commuter-pass-price').val('')
    // 備考
    $('.js-commuter-pass-form').find('.js-commuter-pass-memo').val('')
    if(!$('.js-commuter-pass-form').find('.js-commuter-pass-submit').hasClass('btn-success')){
      $('.js-commuter-pass-form').toggleClass('d-none')
    }
    // submitボタン
    $('.js-commuter-pass-form').find('.js-commuter-pass-submit').removeClass('btn-success').val('追加')
  });
  // 定期の編集ボタンを押した時
  $(document).on('click', '.js-commuter-pass-edit', function(){
    // 交通ルートIDをsubmitボタンに渡す
    $('.js-commuter-pass-submit').attr('traffic_root_id', $(this).attr('traffic_root_id'))
    $('.js-commuter-pass-form').removeClass('d-none')
    // 開始日のmaxを初期化
    $('.js-commuter-pass-period-start').attr('max', '')
    // 終了日のminを初期化
    $('.js-commuter-pass-period-end').attr('min', '')
    // 定期の番号設定
    $('.js-commuter-pass-form').find('.js-commuter-pass-num').text($(this).parent().siblings('.js-commuter-pass-num').text())
    // from設定
    $('.js-commuter-pass-form').find('.js-commuter-pass-from').val($(this).parent().siblings('.js-commuter-pass-root').attr('from'))
    // to設定
    $('.js-commuter-pass-form').find('.js-commuter-pass-to').val($(this).parent().siblings('.js-commuter-pass-root').attr('to'))
    // 定期代設定
    $('.js-commuter-pass-form').find('.js-commuter-pass-price').val(Number($(this).parent().siblings('.js-commuter-pass-price').find('span').text()))
    // 開始日設定
    $('.js-commuter-pass-form').find('.js-commuter-pass-period-start').val($(this).parent().siblings('.js-commuter-pass-period').attr('from')).attr('max', $(this).parent().siblings('.js-commuter-pass-period').attr('to'))
    // 終了日設定
    $('.js-commuter-pass-form').find('.js-commuter-pass-period-end').val($(this).parent().siblings('.js-commuter-pass-period').attr('to')).attr('min', $(this).parent().siblings('.js-commuter-pass-period').attr('from'))
    // 備考設定
    $('.js-commuter-pass-form').find('.js-commuter-pass-memo').val($(this).parent().siblings('.js-commuter-pass-user-memo').children().text())
    // submitのボタン設定
    $('.js-commuter-pass-form').find('.js-commuter-pass-submit').addClass('btn-success').val('更新')
  })
  // 定期の開始日を変更した時
  $(document).on('change', '.js-commuter-pass-period-start', function(){
    var date = new Date($(this).val())
    // 一ヶ月後
    date.setMonth(date.getMonth() + 1);
    // 一日前
    date.setDate(date.getDate() - 1);
    var year = date.getFullYear()
    var month = ('0' + (date.getMonth() + 1)).slice(-2)
    var day = ('0' + date.getDate()).slice(-2)
    var d = year + '-' + month + '-' + day
    // 終了日のminを初期化
    $('.js-commuter-pass-period-end').attr('min', $(this).val()).val(d)
  })
  // 定期の終了日を変更した時
  $(document).on('change', '.js-commuter-pass-period-end', function(){
    var date = new Date($(this).val())
    // 一ヶ月前
    date.setMonth(date.getMonth() - 1);
    // 一日後
    date.setDate(date.getDate() + 1);
    var year = date.getFullYear()
    var month = ('0' + (date.getMonth() + 1)).slice(-2)
    var day = ('0' + date.getDate()).slice(-2)
    var d = year + '-' + month + '-' + day

    // 開始日のmaxを初期化
    $('.js-commuter-pass-period-start').attr('max', $(this).val()).val(d)
  })
  // 定期登録・更新confirm
  $(document).on('click', '.js-commuter-pass-submit', function(){
    if($(this).val() == '追加'){
      var confirm_message = '追加しますか？'
      var action = '/commuter_pass'
      // hiddenのmethodの中身を空にする
      $('.js-commuter-pass-method').attr('name', '').val('')
    }else{
      var confirm_message = '更新しますか？'
      var action = '/commuter_pass/' + $(this).attr('traffic_root_id')
      // hiddenのmethodの中身をセットする
      $('.js-commuter-pass-method').attr('name', '_method').val('PATCH')
    }
    // actionセット
    // fromとto
    $('.js-commuter-pass-form').attr('action', action)
    // バリデーション
    if($('.js-commuter-pass-from').val() == ''){
      if($('.js-commuter-pass-to').val() == ''){
        $('.js-commuter-pass-error-message').text('fromとtoは入力必須です')
      }else{
        $('.js-commuter-pass-error-message').text('fromは入力必須です')
      }
      return false
    }
    // toのみ空かどうか
    if($('.js-commuter-pass-to').val() == ''){
      $('.js-commuter-pass-error-message').text('toは入力必須です')
      return false
    }

    // 開始日と終了日
    if($('.js-commuter-pass-period-start').val() == ''){
      if($('.js-commuter-pass-period-end').val() == ''){
        $('.js-commuter-pass-error-message').text('開始日と終了日は入力必須です')
      }else{
        $('.js-commuter-pass-error-message').text('開始日は入力必須です')
      }
      return false
    }

    // 終了日のみ空かどうか
    if($('.js-commuter-pass-period-end').val() == ''){
      $('.js-commuter-pass-error-message').text('終了日は入力必須です')
      return false
    }
    // 500文字制約
    if($('.js-commuter-pass-from').val().length > 500 || $('.js-commuter-pass-to').val().length > 500 || $(this).parent().prev().find('.js-commuter-pass-memo').val().length > 500){
      $('.js-traffic-root-error-message').text('fromとtoと備考は500文字以内で入力してください')
      return false
    }
    // 定期代
    if($('.js-commuter-pass-form').find('.js-commuter-pass-price').val() <= 0){
      $('.js-commuter-pass-error-message').text('定期代を正しく入力してください')
      return false
    }
    // 画像の有無(登録のときのみ)
    if($('.js-commuter-pass-form').find('.js-commuter-pass-image').val().length == 0 && $(this).val() == '追加'){
      $('.js-commuter-pass-error-message').text('定期画像をアップロードしてください')
      return false;
    }
    // 確認モーダル
    if(!confirm(confirm_message)){
      $('[name="commuter_pass_period_end"]').prop('disabled', false)
      return false
    }
  })
  // 定期の備考, 管理メモをクリック
  $(document).on('click', '.js-commuter-pass-memo', function(){
    $('.js-commuter-pass-input').attr('root_num', $(this).attr('root_num'))
    .removeClass('d-none').val($(this).val())
  })
  // 定期の備考input入力
  $(document).on('keyup', '.js-commuter-pass-memo, .js-commuter-pass-input', function(){
    var $this = $(this)
    $('.js-commuter-pass-input').val($this.val())

    $('.js-commuter-pass-memo').each(function(index, elm){
      if($(elm).attr('root_num') == $this.attr('root_num')){
        $(elm).val($this.val())
      }
    })
  })

  // 交通費値段変更した時
  $(document).on('change', '.js-traffic-price', function(){
    var total_price = 0
    $('.js-traffic-price').each(function(index, elm){
      total_price += Number($(elm).val())
    })
    $('.js-total-traffic-price').text(total_price + '円')
  })

  // ↓↓↓↓↓シフト・タイムシート↓↓↓↓↓
  // 稼働時間の算出
  function getWorkTime(from, to, break_time){

    var Y = new Date().getFullYear()
    var M = new Date().getMonth()+1
    var D = new Date().getDate()

    var ymd = Y + "/" + M + "/" + D + "/"

    var fromTime = new Date(ymd + " " + from).getTime()
    var toTime = new Date(ymd + ' ' + to).getTime()
    if(fromTime > toTime){
      D = new Date().getDate()+1
      var ymd = Y + "/" + M + "/" + D + "/"
      toTime = new Date(ymd + " " + to).getTime()
    }
    var Ms = Math.abs( fromTime - toTime );


    var h = ''
    var m = ''

    h = Ms / 3600000
    m = (Ms - h * 3600000) / 6000

    var break_time = Number(break_time)

    return Math.round((h + m - break_time) * 100) / 100
  }
  // 稼働合計時間算出
  function setTotalWorkTime(){
    var total_work_time = 0
    $('.js-work-time').each(function(index, elm){
      total_work_time += Number($(elm).text())
    })
    $('.js-shift-total-work-time').text(total_work_time)
  }
  // 稼働時間が8時間未満の日数算出→代入
  function setTotalLessThanEightHoursDay(){
    var total_less_than_eight_hours_day = 0
    $('.js-work-time').each(function(index, elm){
      if($(elm).text() != ''){
        var work_time = Number($(elm).text())
        if(work_time < 8){
          total_less_than_eight_hours_day++
        }
      }
    })

    $('.js-total-less-than-eight-hours-day').text(total_less_than_eight_hours_day)
  }
  // シフト区分チェンジ
  $(document).on('change', '.js-shift-item', function(){
    var $this = $(this)
    // シフトの時間初期化
    $this.parent().next().find('.js-shift-commute-time').prop('disabled', true).val('')
    $this.parent().next().next().find('.js-shift-leave-time').prop('disabled', true).val('')
    $this.parent().next().next().next().find('[name="timesheet_break_times[]"]').prop('disabled', true)
    .find('option:first').prop('selected', true)

    // 備考のplaceholder初期化
    $this.parent().next().next().next().next().next().find('.js-daily-memo').attr('placeholder', '')
    // 稼働時間初期化
    $this.parent().next().next().next().next().find('.js-work-time').text('').next().text('')
    // border初期化
    $this.parent().next().find('.js-shift-commute-time').removeClass('js-shift-error-item').css("border", "#dee2e6 2px solid")
    $this.parent().next().next().find('.js-shift-leave-time').removeClass('js-shift-error-item').css("border", "#dee2e6 2px solid")
    $this.parent().next().next().next().next().next().find('.js-daily-memo-input').removeClass('js-shift-error-item').css("border", "#dee2e6 2px solid")
    $this.css("border", "#dee2e6 2px solid")

    // 稼働を選択した時 → 出退勤時間必須 ・ 出退勤の時間を自動補完
    if($this.find('option:selected').val() == 0){
      // 出勤時間を自動補完
      var from = ''
      $('.js-shift-commute-time').each(function(index, elm){
        if($(elm).val() != ''){
          from = $(elm).val()
          $this.parent().next().find('.js-shift-commute-time').val(from).prop('disabled', false)
          return false
        }
      })
      // 退勤時間を自動補完
      var to = ''
      $('.js-shift-leave-time').each(function(index, elm){
        if($(elm).val() != ''){
          to = $(elm).val()
          $this.parent().next().next().find('.js-shift-leave-time').val(to).prop('disabled', false)
          return false
        }
      })
      // 休憩時間自動補完
      var break_time = 0
      $('[name="timesheet_break_times[]"]').find('option:selected').each(function(index, elm){
        if($(elm).val() > 0){
          break_time = $(elm).val()
          $this.parent().next().next().next().find('[name="timesheet_break_times[]"]').find('option').each(function(index, elm){
            if($(elm).val() == break_time){
              $(elm).prop('selected', true)
            }
          })

        }
      })


      // fromが空のとき
      if($this.parent().next().find('.js-shift-commute-time').val() == ''){
        $this.parent().next().find('.js-shift-commute-time').attr('disabled', false).addClass('js-shift-error-item').css("border", "#E9546B 2px solid")
      }
      // toが空のとき
      if($this.parent().next().next().find('.js-shift-leave-time').val() == ''){
        $this.parent().next().next().find('.js-shift-leave-time').attr('disabled', false).addClass('js-shift-error-item').css("border", "#E9546B 2px solid")
      }
      // 稼働時間表示 fromもtoも空じゃない時
      if(from != '' && to != ''){
        var work_time = getWorkTime(from, to, break_time)
        $(this).parent().next().next().next().next().find('.js-work-time').text(work_time).next().text('時間')
      }

      // 休憩時間のdisabled処理
      $this.parent().next().next().next().find('[name="timesheet_break_times[]"]').attr('disabled', false)

    // 有給、その他を選択した時 → 備考必須
    }else if($this.find('option:selected').val() == 2 || $this.find('option:selected').val() == 6){
      $this.parent().next().next().next().next().next().find('.js-daily-memo').attr('placeholder', '')
      if($this.parent().next().next().next().next().next().find('.js-daily-memo').val() == ''){
        if($this.find('option:selected').val() == 2){
          $this.parent().next().next().next().next().next().find('.js-daily-memo').attr('placeholder', '有給の理由を記載してください')
        }else{
          $this.parent().next().next().next().next().next().find('.js-daily-memo').attr('placeholder', 'その他の理由を記載してください')
        }
        $this.parent().next().next().next().next().next().find('.js-daily-memo').addClass('js-shift-error-item').css("border", "#E9546B 2px solid")
      }
    }
    // 合計稼働日数
    var total_work_day = 0
    // 合計公休日数
    var total_holiday = 0
    // 合計有給日数
    var total_paid_holiday = 0
    // 合計未定日数
    var total_unsettle_day = 0
    $('.js-shift-item option:selected').each(function(index, elm){
      if($(elm).val() == 0){
        total_work_day++
      }else if($(elm).val() == 1){
        total_holiday++
      }else if($(elm).val() == 2){
        total_paid_holiday++
      }else if($(elm).val() == 3){
        total_unsettle_day++
      }
    })
    $('.js-total-work-day').text(total_work_day)
    $('.js-total-holiday').text(total_holiday)
    $('.js-total-paid-holiday').text(total_paid_holiday)
    $('.js-total-unsettle-day').text(total_unsettle_day)

    // 稼働合計時間
    setTotalWorkTime()
    // 8時間未満合計日数
    setTotalLessThanEightHoursDay()
  })
  // シフト出勤時間変更
  $(document).on('change', '.js-shift-commute-time', function(){
    // 稼働時間初期化
    $(this).parent().next().next().next().find('.js-work-time').text('').next().text('')
    var from = $(this).val()
    var to = $(this).parent().next().find('.js-shift-leave-time').val()
    var break_time = $(this).parent().next().next().find('[name="timesheet_break_times[]"]').find('option:selected').val()
    // borderの色を直す
    if(from == ''){
      $(this).addClass('js-shift-error-item').css("border", "#E9546B 2px solid")
    }else{
      $(this).removeClass('js-shift-error-item').css("border", "#dee2e6 2px solid")
      // 稼働時間計算
      if(to != ''){
        var work_time = getWorkTime(from, to, break_time)
        var total_work_time = Number($('.js-shift-total-work-time').text())
        $('.js-shift-total-work-time').text(total_work_time + work_time)
        $(this).parent().next().next().next().find('.js-work-time').text(work_time).next().text('時間')

        // 稼働合計時間
        setTotalWorkTime()
        // 8時間未満合計日数
        setTotalLessThanEightHoursDay()
      }
    }


  })
  // シフト退勤時間変更
  $(document).on('change', '.js-shift-leave-time', function(){
    // 稼働時間初期化
    $(this).parent().next().find('.js-work-time').text('').next().text('')
    var from = $(this).parent().prev().find('.js-shift-commute-time').val()
    var to = $(this).val()
    var break_time = $(this).parent().next().find('[name="timesheet_break_times[]"]').find('option:selected').val()
    // borderの色を直す
    if(to == ''){
      $(this).addClass('js-shift-error-item').css("border", "#E9546B 2px solid")
    }else{
      $(this).removeClass('js-shift-error-item').css("border", "#dee2e6 2px solid")
      // 稼働時間計算
      if(from != ''){
        var work_time = getWorkTime(from, to, break_time)
        var total_work_time = Number($('.js-shift-total-work-time').text())
        $('.js-shift-total-work-time').text(total_work_time + work_time)
        $(this).parent().next().next().find('.js-work-time').text(work_time).next().text('時間')

          // 稼働合計時間
        setTotalWorkTime()
        // 8時間未満合計日数
        setTotalLessThanEightHoursDay()
      }
    }

  })
  // 休憩時間変更
  $(document).on('change', '[name="timesheet_break_times[]"]', function(){
    var from = $(this).parent().prev().prev().find('.js-shift-commute-time').val()
    var to = $(this).parent().prev().find('.js-shift-leave-time').val()
    var break_time = $(this).find('option:selected').val()

    if(from != '' && to != ''){
      var work_time = getWorkTime(from, to, break_time)
      var total_work_time = Number($('.js-shift-total-work-time').text())

      $('.js-shift-total-work-time').text(total_work_time + work_time)
      $(this).parent().next().find('.js-work-time').text(work_time).next().text('時間')

        // 稼働合計時間
      setTotalWorkTime()
      // 8時間未満合計日数
      setTotalLessThanEightHoursDay()
    }
  })
  // シフト登録・更新confirm
  $(document).on('click', '.js-shift-submit-button', function(){
    // 入力不備がある項目のborderを赤くする
    $('.js-shift-item').each(function(index, elm){
      if(jQuery.inArray($(elm).find('option:selected').val(), ['0', '1', '2', '3', '4', '5', '6']) == -1){
        $(elm).css("border", "#E9546B 2px solid").addClass('js-shift-error-item')
      }else{
        $(elm).css("border", "#dee2e6 2px solid").removeClass('js-shift-error-item')
      }
    })
    if($('.js-shift-error-item').length > 0){
      $('.js-shift-error').text('入力不備があります').removeClass('d-none')
      return false
    }

    // 備考がのエラー
    $('.js-daily-memo').each(function(index, elm){
      if($(elm).val().length > 500){
        $('.js-shift-error').text('備考は500文字以内で入力してください').removeClass('d-none')
        return false
      }
    })

    var shift_memo_area = $('.js-shift-memo')
    if(shift_memo_area.val() == ''){
      // 未定の合計数
      var total_unsettle_day = Number($('.js-total-unsettle-day').text())
      if(total_unsettle_day > 0){
        shift_memo_area.css("border", "#E9546B 2px solid")
        $('.js-shift-error').text('未定のシフトがいつ頃出るか備考に入力してください').removeClass('d-none')
        return false
      }
      // 合計稼働時間
      var total_work_time = Number($('.js-shift-total-work-time').text())
      if(total_work_time < 173){
        shift_memo_area.css("border", "#E9546B 2px solid")
        $('.js-shift-error').text('稼働時間173時間未満の理由を備考に入力してください').removeClass('d-none')
        return false
      }
      // 合計稼働日数
      var total_work_day = Number($('.js-total-work-day').text())
      if(total_work_day < 22){
        shift_memo_area.css("border", "#E9546B 2px solid")
        $('.js-shift-error').text('稼働日数22日未満の理由を備考に入力してください').removeClass('d-none')
        return false
      }
      // 稼働時間8時間未満の日数
      var total_less_than_eight_hours_day = Number($('.js-total-less-than-eight-hours-day').text())
      if(total_less_than_eight_hours_day > 0){
        shift_memo_area.css("border", "#E9546B 2px solid")
        $('.js-shift-error').text('稼働時間が8未満の日がある理由を備考に入力してください').removeClass('d-none')
        return false
      }
    }

    if($(this).val() == '登録'){
      var confirm_message = '追加しますか？'
    }else{
      var confirm_message = '更新しますか？'
    }

    if(!confirm(confirm_message)){
      return false
    }
  })
  // 休憩を変えた時の処理
  $(document).on('change', '[name="timesheet_break_time"]', function(){
    var timesheet_date_id = $(this).parent().parent().attr('timesheet_date_id')
    var data = new Object()
    data._method = 'PATCH'
    data.timesheet_break_time = $(this).val()

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/timesheet_date/' + timesheet_date_id,
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = '/error'
      }
      location.reload()
    }).fail(function(){
      window.location = '/error'
    })
  })
  // 交通ルート変えた時の処理
  $(document).on('change', '[name="traffic_root_id"]', function(){
    var timesheet_date_id = $(this).parent().parent().attr('timesheet_date_id')
    var price = $(this).find('option:selected').attr('origin_price')
    $(this).parent().next().find('[name="charge_traffic_price"]').val(price).attr('origin_price', price)
    $(this).parent().next().next().find('.js-daily-memo').attr('placeholder', '').css("border", "#dee2e6 2px solid")

    var data = new Object()
    data._method = 'PATCH'
    data.traffic_root_id = $(this).val()
    data.charge_traffic_price = price

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/timesheet_date/' + timesheet_date_id,
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = '/error'
      }
      location.reload()
    }).fail(function(){
      window.location = '/error'
    })
  })
  // 交通費を変更した時
  $(document).on('change', '[name="charge_traffic_price"]', function(){
    var timesheet_date_id = $(this).parent().parent().attr('timesheet_date_id')
    var $daily_memo = $(this).parent().next().find('.js-daily-memo')
    if($(this).attr('origin_price') != $(this).val() && $(this).val() != 0 && $daily_memo.val() == ''){
      $daily_memo.attr('placeholder', '交通費の変更理由を記載してください').css("border", "#E9546B 2px solid")
    }else{
      $daily_memo.attr('placeholder', '').css("border", "#dee2e6 2px solid")
    }
    var data = new Object()
    data._method = 'PATCH'
    data.charge_traffic_price = $(this).val()

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/timesheet_date/' + timesheet_date_id,
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = 'error'
      }
      if(res.total_train_price){
        $('.js-charge-traffic-price').text(res.total_train_price + '円')
        $('.js-all-train-price').text(res.all_train_price + '円')
      }

    }).fail(function(){
      window.location = 'error'
    })
  })
  // dailyの備考クリック
  $(document).on('click', '.js-daily-memo', function(){
    $('.js-another-daily-memo').addClass('d-none');
    $(this).parent().parent().prev().removeClass('d-none').find('.js-daily-memo-input').val($(this).val()).attr('placeholder', $(this).attr('placeholder'));
  })
  // dailyの備考入力
  $(document).on('keyup', '.js-daily-memo-input', function(){
    var $this = $(this)
    var day = $this.attr('day')
    var index = 0
    // border初期化
    $(this).css("border", "#dee2e6 2px solid")
    if($(this).parent().prev().prev().prev().prev().find('.js-shift-item').find('option:selected').val() == 2 || $(this).parent().prev().prev().prev().prev().find('.js-shift-item').find('option:selected').val() == 5){
      if($(this).val() == ''){
        $(this).addClass('js-shift-error-item').css("border", "#E9546B 2px solid")
      }
    }

    // シフトの有給を選択しているかどうか判定
    var is_pay_holiday = false
    $('.js-shift-item').each(function(index, elm){
      if($(elm).attr('day') == day){
        if($(elm).find('option:selected').val() == 2 || $(elm).find('option:selected').val() == 5){
          is_pay_holiday = true
        }
      }
    })
    $('.js-daily-memo-input').each(function(index, elm){
      if($(elm).attr('day') == day){
        // 有給が選択されている時
        if(is_pay_holiday && $this.val() == '' && $(elm).hasClass('js-daily-memo') || $this.val().length > 500){
          $(elm).addClass('js-shift-error-item').val($this.val()).css("border", "#E9546B 2px solid")
        }else{
          $(elm).removeClass('js-shift-error-item').val($this.val()).css("border", "#dee2e6 2px solid")
        }
      }
    })

    // 通勤ルート・交通費のエラーの処理
    var $traffic_price_input = $(this).parent().prev().prev().find('[name="charge_traffic_price"]')
    if($traffic_price_input.attr('origin_price') != $traffic_price_input.val() && $(this).val() == ''){
      $(this).css("border", "#E9546B 2px solid")
    }
  })
  // タイムシートの備考登録処理
  $(document).on('blur', '.js-timesheet-memo-input', function(){
    var data = new Object();
    data._method = 'PATCH'
    data.memo = $(this).val()

    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/timesheet_date/' + $(this).attr('timesheet_date_id'),
      type: 'POST',
      data
    }).done(function(res){
      if(res.error){
        window.location = 'error'
      }
    }).fail(function(){
      window.location = 'error'
    })


  })
  //textareaの初期のサイズ処理
  $(document).on('ready', '.textarea', (elm) => {
    elm.style.height = elm.scrollHeight + 'px';
  });
  // テキストエリアの入力時のサイズ処理
  $(document).on('input', '.textarea', (evt) => {
    let target = evt.target;
    //textareaの要素の高さを設定
    target.style.height = '60px';
    //textareaの高さに入力内容の高さを設定
    target.style.height = target.scrollHeight + 'px';
  });
})
