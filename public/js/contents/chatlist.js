$(function(){

  /**********
  定義
  **********/
  // URL固定の部分
  var url = location.protocol + '//' + location.host + '/';
  const csrf_token = $('meta[name="csrf-token"]').attr('content');
  // OSの判断
  var os = window.navigator.userAgent.toLowerCase();
  var mac_os = os.indexOf("mac os x");
  var windows_os = os.indexOf("windows nt");
  // ユーザーid
  var url_split = location.href.split("/");
  var user_id = url_split[url_split.length-1];
  // 選択中のカテゴリー名
  var active_category_name = $('#category-select-box').children('.active').text();
  // 選択中のカテゴリーid
  var active_category_id = $('.chat-category.active').attr('data-chat-category-id');
  // 押されたキーコードを格納する変数
  var keycode = '';
  // broadcastのフォームのdisabled判定フラグ
  var is_disabled = true;

  /**********
  初期設定
  **********/
  // datepicker
  $.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    showButtonPanel: true,
    buttonImage: 'icon.jpg',
    buttonImageOnly: true,
    buttonText: "",
    showOn: "both",
    closeText: '閉じる',
    prevText: '前へ',
    nextText: '次へ',
    currentText: '今日',
    monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
    dayNamesShort: ['日曜','月曜','火曜','水曜','木曜','金曜','土曜'],
    dayNamesMin: ['日','月','火','水','木','金','土'],
    yearSuffix: '年',
    firstDay: 0
  });
  // datepicker作成
  $('#todo-deadline-calendar').datepicker();
  $('.ui-datepicker-buttonpane').append('<button type="button" id="datepicker-clear-button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">クリア</button>');
  $('.ui-datepicker-buttonpane').append('<button type="button" id="datepicker-close-button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">閉じる</button>');
  // 一斉送信のフォーム作成
  new Quill('#broadcast-editor', {
    modules: {
      syntax: true,
      toolbar: [
        ['bold', 'underline', 'strike'],
        [{'color': []}],
        ['blockquote', 'code-block'],
      ]
    },
    scrollingContainer: document.documentElement,
    theme: 'snow'
  });
  $('#broadcast-editor').prev('.ql-toolbar')
  .append('<button id="broadcast-chat-submit" class="btn chat-button" name="subbtn" disabled><img id="chat-submit-img" src="' + url + 'image/chat_disabled_submit.svg" alt="" /></button>');

  // カテゴリーの「すべて」をactiveにする
  $('#chat-category-all').addClass('active');

  /**********
  関数定義
  **********/
  // コンソール
  function c(str){
    console.log(str);
  }
  // モーダル初期化
  function modalInit(){
    $('#chat-category-name-change').attr('data-chat-category-id', '');
    $('#chat-category-thread-add').attr('data-chat-category-id', '');
    $('#chat-category-delete').attr('data-chat-category-id', '');
    $('#chat-category-thread-search').attr('data-chat-category-id', '');
    $('#chat-category-edit').hide();
    $('#chat-category-sort-box').hide();
    $('#chat-category-thread').hide();
    $('#chat-category-create').hide();
    $('#chat-category-create-button').hide();
    $('#chat-setting').hide();
    $('#hide-thread').hide();
    $('#favorite-thread').hide();
    $('#group-create').hide();
    $('#group-edit').hide();
    $('#group-delete').hide();

    // カテゴリー編集中の時
    if($('#chat-category-input').length){
      $('#chat-category-input').parent().text($('#chat-category-input').val());
      $('#chat-category-input').remove();
    }
  }
  // グループのモーダルの初期化
  function groupModalInit(){
    $('#group-area').hide();
    $('#group-name-input').val('');
    $('#group-user-search').val('');
    $('#group-image').attr('src', url + 'image/group_default.svg');
    $('#group-image-input').val('');
    $('#group-text-count').text('0');
    $('#selected-user-list').children().remove();
    $('.select-user').each(function(index, elm){
      $(elm).removeClass('selected').find('.select-button').attr('src', url + 'image/todo_chat.svg');
    })
  }
  // グループ画像処理
  function groupImage(group_image){
    if (group_image){
      return url + 'storage/' + group_image;
    }else{
      return url + 'image/group_default.svg';
    }
  }
  // グループ作成・更新のときにユーザーを追加したときのhtml作成
  function selectedUserRender($this){
    var render = '<li id="selected-user-' + $this.attr('data-user-id') + '" class="selected-user" data-user-id="' + $this.attr('data-user-id') + '">';
    render += '<div>';
    render += '<a href="'+ url + 'user/' + $this.attr('data-user-id') + '" target="_blank" rel="noopener noreferrer">';
    render += '<img src="' + $this.attr('data-profile-image') + '" alt="" width="20" width="20">';
    render += '</a>';
    render += '<span>' + $this.attr('data-user-name') + '</span>';
    render += '</div>';
    render += '<span>✖</span>';
    render += '</li>';

    return render;
  }
  // スレッドリスト取得
  function getThreadList(){
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/thread_list',
      type: 'POST',
      data: {
        chat_category_id: $('.chat-category.active').attr('data-chat-category-id'),
        search_name: $('#search_name').val()
      }
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      // 作成されたhtmlをrender
      $('#chat-list').children('p, table').remove();
      $('#chat-list').append(res.thread_list_render);
      var num = 0;
      $('.read-num').each(function(index, elm){
        num += parseInt($(elm).text());
      });
      if(num > 0){
        $('.unread-total').text(num);
      }
    });
  }
  // 一斉送信のdisabledの処理のまとめ
  function broadcastDisable(){
    var is_disabled = true;
    // ユーザーが一人以上選択されているか or ToDoがある上でToDo名が入力されているか
    if($('.broadcast-user-list.selected').length != 0){
      // ToDoじゃない or (ToDoがある&ToDo名が入力されているか)
      if(!$('#todo-toggle').prop('checked') || ($('#todo-toggle').prop('checked') && $('#todo-name-input').val().length != 0)){
        $('#broadcast-editor > .ql-editor').children().each(function(index, elm){
          // メッセージが入力されているか
          if($.trim($(elm).text()) !== ''){
            is_disabled = false;
            return false;
          }
        });
      }
    }
    $('#broadcast-chat-submit').prop('disabled', is_disabled);
    if(is_disabled){
      $('#broadcast-chat-submit').children('img').attr('src', '/image/chat_disabled_submit.svg');
    }else{
      $('#broadcast-chat-submit').children('img').attr('src', '/image/chat_submit.svg');
    }
  }

  /**********
  実行処理
  **********/

  // 下記のボタンを押したときにモーダルを隠す動きをストップさせる
  $(document).on('click', '#chat-category-create, #chat-category-thread, #chat-category-sort-box, #chat-category-input', function(){
    return false;
  });
  // 画面をクリックしたときにすべてのモーダルを隠す
  $(document).on('click', function(){
    modalInit();
  });
  // チャット検索
  $(document).on('keyup', '#search_name', function(){
    // 選択されているカテゴリーid
    var category_id = $('#category-select-box').children('.active').attr('data-chat-category-id');
    var search_name = $(this).val();
    if(search_name != ''){
      $('.chat-list-thread').each(function(index, elm){
        if($(elm).attr('data-thread-name').indexOf(search_name) != -1 || $(elm).attr('data-thread-name-kana').indexOf(search_name) != -1){
          $(elm).show();
        }else{
          $(elm).hide();
        }
      });
    }else{
      $('.chat-list-thread').show();
    }
  });

  /**********
  一斉送信
  **********/

  // formのモーダル表示
  $(document).on('click', '#broadcast-open-button', function(){
    $('#broadcast-modal').modal('show');
    $('.modal-body.form').show();
    $('.modal-body.confirm').hide();
    $('.modal-footer').hide();
  });
  // 指定のキーコードを押したときにフォームのオプションをクリックする
  $(document).on('keydown', function(e){
    // 18 ・・・option, Altタグ 67 ・・・ 「c」

    // 引用タグ(event.metaKey = commandキー)
    if(mac_os !== -1 && event.metaKey && event.shiftKey && e.keyCode === 57 || windows_os !== -1 && event.ctrlKey && event.shiftKey && e.keyCode === 57){
      $('#broadcast-editor').prev().find('.ql-blockquote').trigger('click');
      keycode = '';
      return false;
    }
    // コードブロック
    if(mac_os !== -1 && event.metaKey && event.shiftKey && (keycode === 18 && e.keyCode === 67 || keycode === 67 && e.keyCode === 18) || windows_os !== -1 && event.ctrlKey && event.shiftKey && (keycode === 18 && e.keyCode === 67 || keycode === 67 && e.keyCode === 18)){
      $('#broadcast-editor').prev().find('.ql-code-block').trigger('click');
      keycode = '';
      return false;
    }
    if(e.keyCode === 18 || e.keyCode === 67){
      keycode = e.keyCode;
    }
  });
  // 一斉送信のユーザー検索
  $(document).on('keyup', '#broadcast-user-input', function(){
    var search_name = $(this).val();
    $('.broadcast-user-list').each(function(index, elm){
      if(search_name != ''){
        // 名前・かなが含まれていたとき
        if($(elm).attr('data-user-name').indexOf(search_name) != -1 || $(elm).attr('data-user-name-kana').indexOf(search_name) != -1){
          $(elm).removeClass('search');
        }else{
          $(elm).addClass('search');
        }
      }else{
        $(elm).removeClass('search');
      }
    });
  });
  var check_roles = [];
  var check_charge_ids = [];
  var check_teacher_ids = [];
  // 権限・担当・全選択クリックでの制限
  $(document).on('change', '.role, .charge, .teacher', function(){
    var $this = $(this);
    if($this.hasClass('role')){
      if($this.prop("checked")){
        check_roles.push($this.val());
      }else{
        check_roles = check_roles.filter(function(role){
          return role !== $this.val();
        });
      }
    }else if($this.hasClass('charge')){
      if($this.prop("checked")){
        check_charge_ids.push($this.val());
      }else{
        check_charge_ids = check_charge_ids.filter(function(charge_id){
          return charge_id !== $this.val();
        });
      }
    }else if($this.hasClass('teacher')){
      if($this.prop("checked")){
        check_teacher_ids.push($this.val());
      }else{
        check_teacher_ids = check_teacher_ids.filter(function(charge_id){
          return charge_id !== $this.val();
        });
      }
    }

    if(check_roles.length == 0 && check_charge_ids.length == 0 && check_teacher_ids.length == 0){
      $('.broadcast-user-list').removeClass('limit');
    }else{
      $('.broadcast-user-list').each(function(index, elm){
        // 権限の精査
        if($.inArray($(elm).attr('data-role'), check_roles) != -1 || $.inArray($(elm).attr('data-charge-id'), check_charge_ids) != -1 || $.inArray($(elm).attr('data-teacher-id'), check_teacher_ids) != -1){
          $(elm).removeClass('limit');
        }else{
          $(elm).addClass('limit');
        }
      });
    }
  });
  // ユーザーをクリックしたとき
  $(document).on('click', '.broadcast-user-list, .broadcast-user-list a', function(){
    // 画像を押したかどうか
    if(!$(this).attr('href')){
      // 既に選択されていたかどうか
      if($(this).hasClass('selected')){
        $(this).removeClass('selected');
        $(this).find('.broadcast-select-image').attr('src', url + 'image/todo_chat.svg');
      }else{
        $(this).addClass('selected');
        $(this).find('.broadcast-select-image').attr('src', url + 'image/done_chat.svg');
      }

      // disabled処理
      broadcastDisable();
    }
  });
  // 全選択をクリックしたとき
  $(document).on('click', '#all', function(){
    if($(this).prop('checked')){
      $(this).prev('span').text('全解除');
      $('.broadcast-user-list').each(function(index, elm){
        // チェックつける精査
        if(!$(elm).hasClass('search') && !$(elm).hasClass('limit')){
          $(this).addClass('selected');
          $(this).find('.broadcast-select-image').attr('src', url + 'image/done_chat.svg');
        }
      });
    }else{
      $(this).prev('span').text('全選択');
      $('.broadcast-user-list').each(function(index, elm){
        $(this).removeClass('selected');
        $(this).find('.broadcast-select-image').attr('src', url + 'image/todo_chat.svg');
      });

    }
  });
  // todoにチェックを入れたとき
  $(document).on('change', '#todo-toggle', function(e){
    if($(this).prop('checked')){
      $(this).prev('label').text('ToDo解除');
      $('#broadcast-confirm-todo').show();
      $('.deadline').attr('data-deadline', '期限なし');
      // calendar表示
      $('#todo-display-toggle').show();
      $('.deadline').show();
    }else{
      $(this).prev('label').text('ToDo');
      $('#broadcast-confirm-todo').hide();
      $('.deadline').attr('class', 'deadline').attr('data-deadline', '期限なし').text('期限なし');
      $('#todo-name').text('');
      $('#todo-name-input').val('');
      // カレンダー非表示
      $('#todo-display-toggle').hide();
      $('.deadline').hide();
    }
    broadcastDisable();
  });
  // カレンダーボタンを押したとき
  $(document).on('click', '#todo-calendar-button', function(e){
    // datepicker作成
    $('#todo-deadline-calendar').css({ top: e.clientY + 20 + 'px' });
    $('#todo-deadline-calendar').css({ left: e.clientX - 20 + 'px' });
    $('#todo-deadline-calendar').show();
  });
  // カレンダーに日付を入れたとき
  $(document).on('DOMSubtreeModified propertychange', '#todo-deadline-calendar', function(e){
    var year = $('.ui-datepicker-current-day').attr('data-year');
    var month = parseInt($('.ui-datepicker-current-day').attr('data-month')) + 1;
    var day = $('.ui-state-active').text();
    var deadline_date = year + '-' + month + '-' + day;
    var now = new Date;

    if(year != undefined){
      // 色を初期化
      $('.deadline').attr('class', 'deadline');
      // data属性に格納
      $('.deadline').attr('data-deadline', deadline_date);
      // 今年かどうか
      if(year == now.getFullYear()){
        $('.deadline').text(month + '月' + day + '日');
        // 今月かどうか
        if(month == now.getMonth() + 1){
          if(day == now.getDate()){
            // 今日かどうか
            $('.deadline').text('今日').addClass('text-success');
          }else if(day == now.getDate()+1){
            $('.deadline').text('明日').addClass('text-success');
          }else if(day == now.getDate()-1){
            $('.deadline').text('昨日').addClass('text-danger');
          }else if(day < now.getDate()){
            // 昨日より前かどうか
            $('.deadline').addClass('text-danger');
          }
        }else if(month < now.getMonth() + 1){
          $('.deadline').addClass('text-danger');
        }else{
          $('.deadline').text(year + '年' + month + '月' + day + '日');
          if(year < now.getFullYear()){
            $('.deadline').addClass('text-danger');
          }
        }
      }
    }

    if(!$('#datepicker-clear-button').length){
      $('.ui-datepicker-buttonpane').append('<button type="button" id="datepicker-clear-button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">クリア</button>');
      $('.ui-datepicker-buttonpane').append('<button type="button" id="datepicker-close-button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">閉じる</button>');
    }
  });
  // カレンダー内のクリアを押したとき
  $(document).on('click', '#datepicker-clear-button', function(){
    $('.deadline').text('期限なし').attr('class', 'deadline').attr('data-deadline', '');
  });
  // カレンダー内の閉じるボタンを押したとき
  $(document).on('click', '#datepicker-close-button', function(){
    $('#todo-deadline-calendar').hide();
  });
  // ToDoの名前のkeyup
  $(document).on('keyup', '#todo-name-input', function(){
    $('#todo-name').text($(this).val());
    broadcastDisable();
  });
  // チャットを入力したときの処理
  $('#broadcast-editor > .ql-editor').on('DOMSubtreeModified propertychange', () => {
    // preタグの処理
    $('#broadcast-editor > .ql-editor').children('pre').each(function(index, elm){
      $(elm).css('color', 'rgb(29,28,29)')
      .css('background-color', 'rgb(248,248,248)')
      .css('border-color', 'rgb(221,221,221)');
    });
    // disabled処理
    is_disabled = broadcastDisable();
  });
  // 送信ボタンを押したときのモーダル表示処理
  $(document).on('click', '#broadcast-chat-submit', function(){
    if(!is_disabled){
      $('.modal-body.form').hide();
      $('.modal-body.confirm').show();
      $('.modal-footer').show();

      // 最後のindex番号を割り出す
      var total_index = $('.broadcast-user-list').children().length;
      var user_total = 0;
      var html = '';
      $('.broadcast-user-list').each(function(index, elm){
        if($(elm).hasClass('selected')){
          user_total++;
          if(user_total % 8 == 1){
            html += '<li>';
          }
          html += '<span data-user-id="' + $(elm).attr('data-user-id') + '">' + $(elm).find('.user-name').text() + '</span>';
          if(user_total % 8 == 0 || (total_index == index && user_total % 8 != 0)){
            html += '</li>';
          }

        }
      });
      // ユーザーのリスト作成
      $('#broadcast-confirm-user ul').empty().append(html);
      // ユーザーの合計表示
      $('#send-user-total').text('計' + user_total + '人');
      // メッセージを移行させている
      $('#broadcast-confirm-message').empty().append($('#broadcast-editor > .ql-editor').children());
    }
  });
  // 戻るボタンを押したとき
  $(document).on('click', '#broadcast-confirm-return', function(){
    $('#broadcast-editor > .ql-editor').empty().append($('#broadcast-confirm-message').children());
    $('.modal-body.form').show();
    $('.modal-body.confirm').hide();
    $('.modal-footer').hide();
  });
  // 送信処理
  $(document).on('click', '#broadcast-confirm-submit', function(){
    // ユーザーids
    var user_ids = [];
    $('#broadcast-confirm-user > ul').find('span').each(function(index, elm){
      user_ids.push($(elm).attr('data-user-id'));
    });
    // ToDo
    if($('#broadcast-confirm-todo').css('display') == 'none'){
      var todo_deadline = '';
      var todo_name = '';
    }else{
      var todo_deadline = $('#broadcast-confirm-todo').children('.deadline').attr('data-deadline');
      var todo_name = $('#todo-name').text();
    }

    var broadcast_message = '';
    $('#broadcast-confirm-message').children().each(function(index, elm){
      // リンクがあったら生成
      var tag = $(elm).html().replace(/(https?:\/\/[\x21-\x7e]+)/g, function(link) {
        return '<a href="' + link + '" target="_blank" style="color: #1d68a7">' + link + '</a>';
      });

      broadcast_message += $(elm).html(tag).prop('outerHTML');
    });

    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/broadcast',
      type: 'POST',
      data: {
        broadcast_message : broadcast_message,
        user_ids: user_ids,
        todo_deadline: todo_deadline,
        todo_name: todo_name
      }
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }else{
        // フラッシュメッセージ
        $('body').prepend('<div class="message flash_message">送信完了しました</div>');
        setTimeout(function() {
          $('.message.flash_message').fadeOut('slow');
        }, 3000);

        $('#broadcast-modal').modal('hide');
        $('.modal-body.form').hide();
        $('.modal-body.confirm').hide();
        $('.modal-footer').hide();
        $('.broadcast-select-image').each(function(index, elm){
          $(elm).attr('src', url + 'image/todo_chat.svg');
        });
        $('.deadline').text('期限なし');
        $('#todo-display-toggle').hide();
        $('#todo-name-input').val('');
        $('#todo-toggle').prop('checked', false);
        $('#all').prop('checked', false).prev().text('全選択');
        $('#broadcast-select-area').find('.thread-toggle-area').each(function(index, elm){
          $(elm).find('.arrow').css('transform', 'rotate(-45deg)');
          $(elm).removeClass('active').next('ul').hide();
        });
        // $('input.role').prop('checked', false);
        $('.role').each(function(index, elm){
          $(elm).prop('checked', false);
        });
      }
    });
  });

  /**********
  カテゴリーの処理
  **********/

  // カテゴリー隣移動
  $(document).on('keydown', function(e){
    // shift + ←
    if(event.shiftKey && e.keyCode === 37){
      if($('.chat-category.active').prev().length){
        $('.chat-category.active').prev().trigger('click');
      }
    }
    // shift + →
    if(event.shiftKey && e.keyCode === 39){
      if($('.chat-category.active').next().length){
        $('.chat-category.active').next().trigger('click');
      }
    }

  });
  // プラスのボタンを押してカテゴリー作成フォームを表示させる処理
  $(document).on('click', '#category-add-span', function(e){
    modalInit();
    $('#chat-category-create').css('top', e.clientY + 'px');
    $('#chat-category-create').css('left', e.clientX + 25 + 'px');
    $('#chat-category-create-button').css('top', e.clientY + $(window).height() * 0.10 + 5 + 'px');
    $('#chat-category-create-button').css('left', e.clientX + $(window).width() * (0.25 - 0.05) + 'px');
    $('#chat-category-create').show();
    $('#chat-category-create-button').show();
    $('#chat-category-create-input').focus();
    $('#chat-category-create-input').val('');
    $('#chat-category-create-input').next().text(0);
    keycode = '';
    return false;
  });
  // カテゴリーを押したときの処理
  $(document).on('click contextmenu', '.chat-category', function(e){
    modalInit();
    var $this = $(this);
    var category_id = $(this).attr('data-chat-category-id');
    if(!$(this).hasClass('active')){
      // active変更
      $('.chat-category.active').removeClass('active');
      $(this).addClass('active');
      // 検索を空にして初期状態にする
      $('#search_name').val('');
      // スレッド取得
      getThreadList();
    }
    // 右クリックされたときモーダル表示
    if(e.which == 3){
      $('#chat-setting').hide();
      $('#chat-category-edit').hide();
      $('#chat-category-sort').show();
      $('#chat-category-name-change').attr('data-chat-category-id', category_id).show();
      $('#chat-category-thread-add').attr('data-chat-category-id', category_id).show();
      $('#chat-category-delete').attr('data-chat-category-id', category_id).show();
      $('#chat-category-edit').css('top', e.clientY + 'px');
      $('#chat-category-edit').css('left', e.clientX + 'px');
      if(!$this.hasClass('sortable')){
        $('#chat-category-sort').hide();
        $('#chat-category-name-change').hide();
        $('#chat-category-thread-add').hide();
        $('#chat-category-delete').hide();
      }
      var count = 0;
      $('#chat-category-edit').find('li').each(function(index, elm){
        if($(elm).css('display') == 'list-item'){
          count++;
        }
      });
      $('#chat-category-edit').height(43 * count);
      $('#chat-category-edit').show();
      // カテゴリー追加のユーザーを取得
      if($this.hasClass('sortable')){
        $.ajax({
          headers: { 'X-CSRF-TOKEN': csrf_token },
          url: '/chat_category_thread/' + category_id,
          type: 'POST',
        }).done(function(res){
          if(res.error){
            window.location = '/error';
          }
          $('#chat-category-thread').children('ul').empty().append(res.render);
          $('#chat-category-thread-search').attr('data-chat-category-id', category_id);
        });
      }
    }


    return false;
  });
  //「カテゴリー追加」のボタンを押されたときの処理
  $(document).on('click', '#chat-category-thread-add', function(){
    var category_id = $(this).attr('data-chat-category-id');
    $('#chat-category-sort-box').hide();
    $('#chat-category-thread').hide();
    $('#chat-category-create').hide();
    $('#chat-category-create-button').hide();
    $('#chat-category-thread').css('top', $('#chat-category-edit').offset().top + 'px');
    $('#chat-category-thread').css('left', $('#chat-category-edit').offset().left + $(window).width() * 0.15 + 5 + 'px');
    $('#chat-category-thread').show();
    return false;
  });
  // カテゴリーにユーザーを追加・削除する処理
  $(document).on('click', '.chat-category-thread-select', function(){
    var $this = $(this);
    var chat_thread_id = $this.attr('data-thread-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/chat_category/toggle',
      type: 'POST',
      data: {
        chat_thread_id: chat_thread_id,
        chat_category_id: $('#category-select-box').children('.active').attr('data-chat-category-id')
      },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }

      if(res.flg){
        var src = $this.children('img').attr('src', url + 'image/is_check.png');
      }else{
        var src = $this.children('img').attr('src', url + 'image/is_not_check.png');
      }
      getThreadList();
    });
    return false;
  });
  // カテゴリーでのユーザー検索
  $(document).on('keyup', '#chat-category-thread-search', function(){
    var search_name = $(this).val();
    $('#chat-category-thread').find('li').each(function(index, elm){
      if(search_name != ''){
        // 名前・かなが含まれていたとき
        if($(elm).attr('data-thread-name').indexOf(search_name) != -1 || $(elm).attr('data-thread-name-kana').indexOf(search_name) != -1){
          $(elm).show();
        }else{
          $(elm).hide();
        }
      }else{
        $(elm).show();
      }
    });
  });
  //「カテゴリー入れ替え」のボタンを押したとき
  $(document).on('click', '#chat-category-sort', function(){
    $('#chat-category-thread').hide();
    $('#chat-category-create').hide();
    $('#chat-category-create-button').hide();
    $('#chat-category-sort-box').css('top', $('#chat-category-edit').offset().top + 'px');
    $('#chat-category-sort-box').css('left', $('#chat-category-edit').offset().left + $(window).width() * 0.15 + 5 + 'px');
    $('#chat-category-sort-box').css('width', $('#chat-category-sort-box').css('width'));
    $('#chat-category-sort-box').show();

    return false;
  });
  // カテゴリーのソートの処理
  $('#chat-category-sort-box ul').sortable({
    axis: 'X',
    cursor: "move",
    update: function(){
      var category_ids = [];
      $.each($(this).sortable('toArray'), function(index, category_id){
        category_ids.push(category_id);
      });
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/chat_category/sort',
        type: 'POST',
        data: { category_ids: category_ids },
      }).done(function(res){
        if(res.error){
          window.location = '/error';
        }else{
          // activeなカテゴリーid
          var category_id = $('#category-select-box').children('li.active').attr('data-chat-category-id');
          // rendering
          $('#category-select-box').empty().append(res.category_render);
          // 押したカテゴリーをactiveにする
          $('#chat-category-' + category_id).addClass('active');
        }
      });
    }
  });
  // カテゴリー名変更」のボタンを押されたときの処理
  $(document).on('click', '#chat-category-name-change', function(){
    let category_id = $(this).attr('data-chat-category-id');
    let $category = $('#chat-category-' + category_id);
    let category_name = $category.text();
    $category.after('<li class="p-3 chat-category sortable active" id="chat-category-input-' + category_id + '" data-chat-category-id="' + category_id + '"><input id="chat-category-input" type="text" data-chat-category-id="' + category_id + '" maxlength="20" autocomplete="off"></li>');
    $category.remove();
    $('#chat-category-edit').hide();
    $('#chat-category-sort-box').hide();
    $('#chat-category-thread').hide();
    $('#chat-category-create').hide();
    $('#chat-category-create-button').hide();
    $('#chat-category-input').val(category_name);
    $('#chat-category-input').focus(function(){
      $(this).select();
      return false;
    });
    $('#chat-category-input').trigger('focus');

    // 初期化の処理
    $('#chat-category-name-change').attr('data-chat-category-id', '');
    $('#chat-category-thread-add').attr('data-chat-category-id', '');
    $('#chat-category-delete').attr('data-chat-category-id', '');
    keycode = '';
    return false;
  });
  // カテゴリー名変更の処理
  $(document).on('blur', '#chat-category-input', function(e){
    var category_id = $(this).attr('data-chat-category-id');
    var category_name = $(this).val();
    // 文字数が0より大きいとき
    if(category_name.length > 0){
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/chat_category/' + category_id,
        type: 'POST',
        data: { _method: "PATCH", category_name: category_name },
      }).done(function(res){
        if(res.error){
          window.location = '/error';
        }
        $('#sortable-' + category_id).text(category_name);
        $('#chat-category-input-' + category_id).after('<li class="p-3 chat-category sortable active" id="chat-category-' + category_id + '" data-chat-category-id=' + category_id + '>' + category_name + '</li>');
        $('#chat-category-input-' + category_id).remove();
      });
    }
  });
  // カテゴリーのinput
  $(document).on('keyup', '#chat-category-input', function(e){
    // エンターが２回連続で押されたとき
    if(keycode == 13 && e.keyCode == 13){
      var category_id = $(this).attr('data-chat-category-id');
      var category_name = $(this).val();

      if(category_name.length > 0){
        $.ajax({
          headers: { 'X-CSRF-TOKEN': csrf_token },
          url: '/chat_category/' + category_id,
          type: 'POST',
          data: { _method: "PATCH", category_name: category_name },
        }).done(function(res){
          if(res.error){
            window.location = '/error';
          }

          $('#sortable-' + category_id).text(category_name);
          $('#chat-category-input-' + category_id).after('<li class="p-3 chat-category sortable active" id="chat-category-' + category_id + '" data-chat-category-id=' + category_id + '>' + category_name + '</li>');
          $('#chat-category-input-' + category_id).remove();
        });
      }
      keycode = '';
      return false;
    }
    keycode = e.keyCode;
  });
  //「カテゴリー作成」のボタンを押されたときの処理
  $(document).on('click', '#chat-category-add', function(){
    $('#chat-category-sort-box').hide();
    $('#chat-category-thread').hide();
    $('#chat-category-create').hide();
    $('#chat-category-create-button').hide();
    $('#chat-category-create').css('top', $('#chat-category-edit').offset().top + 'px');
    $('#chat-category-create').css('left', $('#chat-category-edit').offset().left + $(window).width() * 0.15 + 5 + 'px');
    $('#chat-category-create-button').css('top', $('#chat-category-edit').offset().top + $(window).height() * 0.10 + 5 + 'px');
    $('#chat-category-create-button').css('left', $('#chat-category-edit').offset().left + $(window).width() * (0.10 + 0.25 - 0.05) - 8 + 'px');
    $('#chat-category-create').show();
    $('#chat-category-create-button').show();
    $('#chat-category-create-input').focus();
    $('#chat-category-create-input').val('');
    $('#chat-category-create-input').next().text(0);
    keycode = '';
    return false;
  });
  // カテゴリー作成inputのkeyupのcountと追加のボタンのクリックの処理
  $('#chat-category-create-input').on('keyup', function(e){
    if(0 <= $(this).val().length){
      if($(this).val().length <= 10){
        $(this).next().text($(this).val().length);
      }
      $('#chat-category-create-button').prop('disabled', false);
      if(e.keyCode == 13 && keycode == 13){
        $('#chat-category-create-button').trigger("click");
        keycode = '';
      }
    }
    if($(this).val().length == 0){
      $('#chat-category-create-button').prop('disabled', true);
    }
    keycode = e.keyCode;
  });
  // 新規カテゴリー作成の処理
  $('#chat-category-create-button').on('click', function(){
    if(confirm('カテゴリーを追加しますか?')){
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/chat_category',
        type: 'POST',
        data: { category_name: $('#chat-category-create-input').val() },
      }).done(function(res){
        if(res.error){
          window.location = '/error';
        }
        window.location.reload();
      });
    }
    return false;
  });
  // ｢カテゴリー削除」のボタンを押されたときの処理
  $(document).on('click', '#chat-category-delete', function(){
    $('#chat-category-sort-box').hide();
    $('#chat-category-thread').hide();
    $('#chat-category-create').hide();
    $('#chat-category-create-button').hide();
    if(confirm('カテゴリーを削除しますか？')){
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/chat_category/' + $(this).data('chat-category-id'),
        type: 'POST',
        data: { _method: "DELETE" },
      }).done(function(){
        window.location.reload();
      });
    }
    return false;
  });
  // ユーザーを右クリックしたとき
  $(document).on('click contextmenu', '.thread', function(e){
    var chat_thread_id = $(this).attr('data-chat-thread-id');
    var contact_user_id = $(this).attr('data-user-id');
    // 右クリックしたとき
    if(e.which != 3){
      if(!chat_thread_id){
        $('#thread-create-form-' + contact_user_id).trigger('click');
      }else{
        window.open('/chat/' + chat_thread_id + '/' + user_id, '_blank')
      }
    }else{
      modalInit();
      // お気に入り登録解除ボタン
      if($(this).hasClass('favorite')){
        $('#favorite-thread').text('お気に入り解除');
      }else{
        $('#favorite-thread').text('お気に入りに追加');
      }
      // グループのスレッドかどうか
      if($(this).hasClass('group')){
        $('#favorite-thread').attr('data-chat-thread-id', chat_thread_id).attr('data-user-id', '').show();
        $('#group-edit').attr('data-chat-thread-id', chat_thread_id).show();
        $('#group-delete').attr('data-chat-thread-id', chat_thread_id).show();
      }else{
        $('#favorite-thread').attr('data-user-id', contact_user_id).attr('data-chat-thread-id', '').show();
      }
      // チャットリストかどうか→非表示ボタンtoggle
      if($(this).hasClass('chat-list-thread')){
        $('#hide-thread').attr('data-chat-thread-id', chat_thread_id).show();
      }

      $('#chat-setting').css('top', e.clientY + 'px');
      $('#chat-setting').css('left', e.clientX + 'px');
      $('#chat-setting').show();
      return false;
    }
  });
  // 非表示を押したとき
  $(document).on('click', '#hide-thread', function(){
    var chat_thread_id = $(this).attr('data-chat-thread-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/thread/hide',
      type: 'POST',
      data: { chat_thread_id: chat_thread_id }
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }

      $('#chat-list-thread-' + chat_thread_id).fadeOut('slow').queue(function() {
        this.remove();
        if($('.chat-list-thread').length == 0){
          $('#chat-list').children().empty().append('<p class="empty">チャットを送ってみよう！</p>');
        }
        if(res.unread_total != 0){
          $('.unread-total').text(res.unread_total);
        }else{
          $('.unread-total').text('');
        }
      });
    });
  });
  // お気に入りを登録・解除処理
  $(document).on('click', '#favorite-thread', function(){
    $this = $(this);
    // ユーザーのスレッド一覧を押したかどうか
    var data = { user_id: user_id };
    if($this.attr('data-user-id')){
      data['contact_user_id'] = $this.attr('data-user-id');
    }
    if($this.attr('data-chat-thread-id')){
      data['chat_thread_id'] = $this.attr('data-chat-thread-id');
    }
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/thread/favorite/toggle',
      type: 'POST',
      data: data
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }

      // 登録かどうか
      if(res.is_favorite){
        $('#favorite-thread-list').show().find('ul').append(res.render);
        // お気に入りの個数表示
        $('#favorite-thread-count').text('favorite ' + $('#favorite-thread-list').find('li').length);

      }else{
        // 解除したスレッドを削除する
        $('#favorite-thread-' + res.chat_thread_id).fadeOut('slow').queue(function() {
          this.remove();
          // お気に入りが一つもなかったら非表示にする
          if($('#favorite-thread-list').find('li').length == 0){
            $('#favorite-thread-list').removeClass('active').hide().find('.arrow').css('transform', 'rotate(-45deg)');
          }else{
            $('#favorite-thread-count').text('favorite ' + $('#favorite-thread-list').find('li').length);
          }
        });
      }

      if($this.attr('data-user-id')){
        $('.thread[data-user-id="' + $this.attr('data-user-id') + '"]').each(function(index, elm){
          if(res.is_favorite){
            $(elm).addClass('favorite');
          }else{
            $(elm).removeClass('favorite');
          }
        });
      }else{
        $('.thread[data-chat-thread-id="' + $this.attr('data-chat-thread-id') + '"]').each(function(index, elm){
          if(res.is_favorite){
            $(elm).addClass('favorite');
          }else{
            $(elm).removeClass('favorite');
          }
        });
      }
    });
  });
  // thread一覧を押したとき(favorite group user)→右クリックでgroup作成ボタン表示
  $(document).on('click contextmenu', '.thread-toggle-area', function(e){
    if(e.which == 3){
      modalInit();
      // グループで使うユーザーリスト取得
      if($(this).parent().attr('id') == 'group-thread-list'){
        $('#group-create').show();
        $('#chat-setting').css('top', e.clientY - 10 + 'px');
        $('#chat-setting').css('left', e.clientX + 25 + 'px');
        $('#chat-setting').show();
      }
    }else{
      // 矢印を反転させる
      if($(this).hasClass('active')){
        $(this).find('.arrow').css('transform', 'rotate(-45deg)');
        $(this).removeClass('active');
        $(this).next('ul').hide();
      }else{
        $(this).find('.arrow').css('transform', 'rotate(135deg)');
        $(this).addClass('active');
        $(this).next('ul').show();
      }
    }
    return false;
  });
  // threadのあいまい検索
  $(document).on('keyup', '#thread-user-search', function(){
    var search_name = $(this).val();
    // お気に入りのあいまい検索
    var count = 0;
    $('#favorite-thread-list ul').children('li').each(function(index, elm){
      if(search_name != ''){
        // 名前・かなが含まれていたとき
        if($(elm).attr('data-thread-name').indexOf(search_name) != -1 || $(elm).attr('data-thread-name-kana').indexOf(search_name) != -1){
          $(elm).show();
          count++;
        }else{
          $(elm).hide();
        }
      }else{
        $(elm).show();
        count++;
      }
    });
    $('#favorite-thread-count').text('favorite ' + count);

    // グループのあいまい検索
    var count = 0;
    $('#group-thread-list ul').children('li').each(function(index, elm){
      if(search_name != ''){
        // 名前・かなが含まれていたとき
        if($(elm).attr('data-thread-name').indexOf(search_name) != -1 || $(elm).attr('data-thread-name-kana').indexOf(search_name) != -1){
          $(elm).show();
          count++ ;
        }else{
          $(elm).hide();
        }
      }else{
        $(elm).show();
        count++ ;
      }
    });
    $('#group-thread-count').text('group ' + count);

    // ユーザーのあいまい検索
    var count = 0;
    $('#user-thread-list ul').children('li').each(function(index, elm){
      if(search_name != ''){
        // 名前・かなが含まれていたとき
        if($(elm).attr('data-thread-name').indexOf(search_name) != -1 || $(elm).attr('data-thread-name-kana').indexOf(search_name) != -1){
          count++;
          $(elm).show();
        }else{
          $(elm).hide();
        }
      }else{
        count++;
        $(elm).show();
      }
    });
    $('#user-thread-count').text('user ' + count);
  });
  // userのthreadへの遷移処理(aタグでpostのhrefを書いている)
  $(document).on('click', '.chat-transition-link', function(){
    $('#thread-create-form-' + $(this).attr('data-user-id')).submit();
    // return false;
  });

  /**********
  グループの処理
  **********/

  // グループ作成のボタンを押したとき
  $(document).on('click', '#group-create', function(){
    modalInit();
    groupModalInit();
    $('#group-form').attr('action', '/group');
    $('#group-submit').text('作成').prop('disabled', true).addClass('group-create-submit');
    $('#group-area').show();
    return false;
  });
  // グループの画像が入ったとき
  $(document).on('change', '#group-image-input', function(){
    var file_reader = new FileReader();
    file_reader.onload = function(){
      $('#group-image').attr('src', file_reader.result);
    }
    file_reader.readAsDataURL(this.files[0]);
  });
  // グループ名のkeyup
  $(document).on('keyup', '#group-name-input', function(){
    // 文字数カウント
    var text_count = $(this).val().length;
    if(0 <= text_count && text_count <= 20){
      $('#group-text-count').text(text_count);
    }
    // disabledの設定
    if(text_count == 0){
      $('#group-submit').attr('disabled', true);
    }else{
      $('#group-submit').attr('disabled', false);
    }

    // keycode = e.keyCode;
    return false;
  });
  // ユーザー名のあいまい検索
  $(document).on('keyup', '#group-user-search', function(){
    var search_name = $(this).val();
    $('#select-user-list').children('li').each(function(index, elm){
      // あいまい検索しているか
      if(search_name != ''){
        // 名前・かなが含まれていたとき
        if($(elm).attr('data-user-name').indexOf(search_name) != -1 || $(elm).attr('data-user-name-kana').indexOf(search_name) != -1){
          $(elm).show();
          // 一致しないとき
        }else{
          $(elm).hide();
        }
      }else{
        $(elm).show();
      }
    });
  });
  // ユーザーを押したときの処理
  $(document).on('click', '.select-user, .select-user a', function(){
    var $this = $(this);
    // 顔写真が押されたかどうか
    if(!$this.attr('href')){
      var user_id = $this.attr('data-user-id');
      // 選択されているかどうか
      if(!$this.hasClass('selected')){
        // 画像変更
        $this.find('.select-button').attr('src', url + 'image/done_chat.svg');
        // クラスの追加
        $this.addClass('selected');
        $('#selected-user-list').append(selectedUserRender($this));

      }else{
        // 画像変更
        $(this).find('.select-button').attr('src', url + 'image/todo_chat.svg');
        // グループに追加済みのユーザーを削除
        $('#selected-user-' + user_id).remove();
        // クラスの削除
        $(this).removeClass('selected');

      }
    }
  });
  // 追加したあとでバツを押したときの処理
  $(document).on('click', '.selected-user', function(){
    var select_button = $('#select-user-' + $(this).attr('data-user-id')).find('.select-button');
    var src = select_button.attr('src').replace('done_chat.svg', 'todo_chat.svg');
    // 選択されていないボタンに戻す
    select_button.attr('src', src);
    // 自分自身を削除
    $(this).remove();

    // 作成ボタンが押せるかどうか
    if($('#group-name-input').val().length == 0){
      $('#group-submit').attr('disabled', true);
    }else{
      $('#group-submit').attr('disabled', false);
    }
  });
  // キャンセルを押したとき
  $(document).on('click', '#group-cancel', function(){
    // 初期化
    groupModalInit();
  });
  // グループ作成・更新処理
  $(document).on('click', '#group-submit', function(){
    if($('#group-name-input').val().length != 0){
      // 作成・更新の判断
      if($(this).hasClass('group-create-submit')){
        var confirm_word = 'グループを作成しますか？';
      }else if($(this).hasClass('group-edit-submit')){
        var confirm_word = 'グループを更新しますか？';
        $('#group-form').append('<input id="group-input-patch" type="hidden" name="_method" value="PATCH" />');
        $('#group-form').append('<input id="group-input-user-id" type="hidden" name="user_id" value="' + user_id + '" />');
      }

      if(confirm(confirm_word)){
        // ユーザーidの配列を作成
        var user_ids = [];
        $('#selected-user-list').children().each(function(index,elm){
          user_ids.push($(elm).attr('data-user-id'));
        });
        // グループ名をinputに入れる
        $('#user-ids-input').val(user_ids);
        $('#group-form').submit();
      }else{
        $('#group-input-patch').remove();
        $('#group-input-user-id').remove();
        return false;
      }
    }
  });
  // グループ編集表示
  $(document).on('click', '#group-edit', function(){
    modalInit();
    groupModalInit();
    var chat_thread_id = $(this).attr('data-chat-thread-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/group/' + chat_thread_id,
      type: 'POST',
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      // 選択されているユーザーのチェックマークを変える
      $.each(res.group_users, function(index, user){
        // チェックマークを変えている
        $('#select-user-' + user.id).addClass('selected').find('.select-button').attr('src', url + 'image/done_chat.svg');
      });
      // redering
      $('#selected-user-list').empty().append(res.render);
      // formのactionの指定
      $('#group-form').attr('action', '/group/' + chat_thread_id);
      // 写真を格納
      $('#group-image').attr('src', groupImage(res.chat_thread.group_image));
      // グループ名
      $('#group-name-input').val(res.chat_thread.group_name)
      // 文字数
      $('#group-text-count').text(res.chat_thread.group_name.length);
      $('#group-submit').text('更新').prop('disabled', false).addClass('group-edit-submit');
      $('#group-area').show();
    });
    return false;
  });
  // グループ退会処理
  $(document).on('click', '#group-delete', function(){
    var chat_thread_id = $(this).attr('data-chat-thread-id');
    if(confirm('本当にグループを退会しますか？')){
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/group/' + chat_thread_id,
        type: 'POST',
        data: { _method: "DELETE" }
      }).done(function(res){
        if(res.error){
          window.location = '/error';
        }else{
          window.location.reload();
        }
      });
    }
  });
  // 5秒ごとにチャット一覧を読み込む
  setInterval(function(){
    if(document.hasFocus()){
      getThreadList();
    }
  }, 10000);
});
