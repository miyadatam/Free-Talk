// スレッド画面のjs処理
$(function(){
  /**********
  定義
  **********/
  // urlの#以降を''にする
  location.hash='';
  // 送信フォーム作成
  const create_editor = quillEditor('#editor', false);
  const csrf_token = $('meta[name="csrf-token"]').attr('content');
  // URL固定の部分
  var url = location.protocol + '//' + location.host + '/';
  // 今の日付
  var now = new Date();
  // スレッドの高さ
  var offset_top = $('#offset').height();
  // 送信できるかのフラグ
  var is_disabled = true;
  // OSの判断
  var os = window.navigator.userAgent.toLowerCase();
  var mac_os = os.indexOf("mac os x");
  var windows_os = os.indexOf("windows nt");
  var iphone_os = os.indexOf("iphone");
  var ipad_os = os.indexOf("ipad");
  var android_os = os.indexOf("android");
  var url_split = location.href.split("/");
  // スレッドid
  var chat_thread_id = url_split[url_split.length -2];
  // ユーザーid
  var user_id = url_split[url_split.length -1].replace('#', '');
  // 既読をつけないid
  var not_ids = [];
  // 変更前のメッセージ
  var old_message = '';
  // 変更後のメッセージ
  var new_message = '';
  // Todoの期限のの日付を格納しておく変数
  var currnet_deadline = '';
  // keyCodeを格納しておく変数
  var keycode = '';
  // 画像の送信処理で使う
  var input = '';

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

  /**********
  初期設定
  **********/

  // チャット画面の高さの設定
  // 参考
  // https://zenn.dev/tak_dcxi/articles/2ac77656aa94c2cd40bf
  // const setFillHeight = () => {
  //   const vh = window.innerHeight * 0.01;
  //   document.documentElement.style.setProperty('--vh', `${vh}px`);
  // }
  //
  // let vw = window.innerWidth;
  //
  // window.addEventListener('resize', () => {
  //   if (vw === window.innerWidth) {
  //     // 画面の横幅にサイズ変動がないので処理を終える
  //     return;
  //   }
  //
  //   // 画面の横幅のサイズ変動があった時のみ高さを再計算する
  //   vw = window.innerWidth;
  //   setFillHeight();
  // });
  //
  // // 初期化
  // setFillHeight();

  // 投稿formの高さ設定
  $('#editor').on('DOMSubtreeModified propertychange', () => {
    // pタグとblockquoteの高さ
    var p_blockquote_height = 0;
    $('#editor > .ql-editor').children('p, blockquote').each(function(index, elm){
      p_blockquote_height += $(elm).height();
    });
    // preタグの高さを設定
    var pre_height = 0;
    $('#editor > .ql-editor').children('pre').each(function(index, elm){
      $(elm).css('color', 'rgb(29,28,29)')
      .css('background-color', 'rgb(248,248,248)')
      .css('border-color', 'rgb(221,221,221)');
      // 22はborder-box
      pre_height += $(elm).height() + 22;
    });
    // preタグの高さ + pタグ、blockquoteタグの高さ + padding Y(24)
    var after_height = p_blockquote_height + pre_height + 24;
    // フォームの高さ
    if(after_height <= 295){
      // フォームの高さの初期値
      $('#editor').height(42);
      $('#editor').height(after_height);
      $('#offset').height(offset_top - after_height + 40);
    }

    return false;
  });
  // #が残っている可能性があるので切り取る
  history.replaceState('','', user_id);
  // 開いたときに編集中のチャットがあれば表示させる
  $.ajax({
    headers: { 'X-CSRF-TOKEN': csrf_token },
    url: '/ansent_message',
    type: 'POST',
    data: { chat_thread_id: chat_thread_id }
  }).done(function(res){
    if(res.error){
      window.location = '/error';
    }

    if(res.ansent_message){
      $('#editor > .ql-editor').empty().append(res.ansent_message);
    }
    caret('#editor > .ql-editor');

  });
  // 未送信のチャット作成
  draftCreate();
  // 開いたときに既読をつける
  readOn();
  // 開いたときに未読の数を出す
  unreadTotal();
  // 送信フォームのbuttonタグをセット
  $('#editor').prev('.ql-toolbar').append('<button id="chat-submit" class="btn chat-button" disabled><img id="chat-submit-img" alt="" /></button>');
  $('#chat-submit').attr('src', url + 'image/chat_disabled_submit.svg');
  // placeholderの設定
  if(iphone_os !== -1 || ipad_os !== -1 || android_os !== -1){
    $('#os_submit').text('');
  }else if(windows_os !== -1){
    $('#os_submit').text('ctrl + Enter');
  }else if(mac_os !== -1){
    $('#os_submit').text('command ⌘ + Enter');
  }
  // 開いたときに一番下のトークに飛ぶように
  $('#offset').scrollTop($('#offset').get(0).scrollHeight);
  // datepicker作成
  $('#todo-deadline-calendar').datepicker();
  /**********
  関数定義
  **********/

  function c(str){
    console.log(str);
  }
  // quillEditor作成
  function quillEditor(selector, is_edit){
    // 編集モードかどうか
    if(is_edit){
      return new Quill(selector, {
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
    }else{
      return new Quill(selector, {
        modules: {
          syntax: true,
          toolbar: [
            ['bold', 'underline', 'strike'],
            [{'color': []}],
            ['blockquote', 'code-block'],
            ['image'],
          ]
        },
        scrollingContainer: document.documentElement,
        theme: 'snow'
      });
    }

  }
  // チャットの下書き登録処理
  function draftCreate(){
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/chat/draft',
      type: 'POST',
      data: {
        chat_thread_id: chat_thread_id,
        message: document.querySelector('#editor > .ql-editor').innerHTML
      },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
    });
  }
  // チャット送信処理
  function chatCreate(){
    var message = '';
    $('#editor > .ql-editor').children().each(function(index, elm){
      // リンクがあったら生成
      var tag = $(elm).html().replace(/(https?:\/\/[\x21-\x7e]+)/g, function(link) {
        return '<a href="' + link + '" target="_blank" style="color: #1d68a7">' + link + '</a>';
      });
      message += $(elm).html(tag).prop('outerHTML');
    });
    var data = new Object();
    data.chat_thread_id = chat_thread_id;
    data.message = message;
    if(!$('#reply-area').is(':hidden')){
      data.reply_chat_id = $('#reply-area').attr('data-chat-id');
    }

    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/chat/store',
      type: 'POST',
      data,
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      $('#reply-area').hide();
      $('#editor > .ql-editor').children().remove();
      $('.empty.message').hide();
      // 追加して一番下までスクロール
      $('#offset').append(res.render).animate({ scrollTop: $('#offset').get(0).scrollHeight });
    });
  }
  // チャット更新処理
  function chatUpdate(chat_id, message){
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/chat/' + chat_id,
      type: 'POST',
      data: { _method: "PATCH", message: message },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
    })
  }
  // チャット送信取消
  function chatDelete(chat_id){
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/chat/' + chat_id,
      type: 'POST',
      data: { _method: "DELETE" },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      $('#announce-' + chat_id).fadeOut('slow').queue(function() {
        this.remove();
        if($('.announce-chat').length == 0){
          $('#announce-area').hide();
        }else if($('.announce-chat').length == 1){
          $('#announce-area').children('ul').removeClass('active');
          $('.announce-chat:first').show().removeClass('erase-announce');
          $('#announce-arrow').hide();
        }else{
          $('.announce-chat:first').removeClass('erase-announce');
          $('#announce-arrow').show();
        }
      });
      $('#todo-' + chat_id).fadeOut('slow').queue(function() {
        this.remove();
      });
      $('#message-box-' + chat_id).after(res.render).remove();
      $('.reply-chat').each(function(index, elm){
        if($(elm).attr('data-chat-id') == chat_id){
          $(elm).attr('data-chat-id', '').text('元のメッセージが削除されています');
        }
      });
    });
  }
  // 指定したid以外のチャットの既読をつける
  function readOn(){
    $('.chat-read').each(function(index, elm){
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/readon',
        type: 'POST',
        data: { chat_thread_id: chat_thread_id, not_ids: not_ids },
      }).done(function(res){
        if(res.error){
          window.location = '/error';
        }
      });
      return false;
    })
  }
  // 未読の数
  function unreadTotal(){
    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/unreadtotal',
      type: 'POST',
    }).done(function(res){
      if(res.unread_total != 0){
        $('.unread-total').text(res.unread_total);
      }else{
        $('.unread-total').text('');
      }
    });
  }
  // チャットの変更があれば更新
  function changeChat(){
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/change/chat',
      type: 'POST',
      data: { chat_thread_id: chat_thread_id }
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      $.each(res.renders, function(chat_id, render){
        if($('.empty.message').length){
          $('.empty.message').remove();
        }
        // チャットの更新のとき
        if($('#message-box-' + chat_id).length){
          $('#message-box-' + chat_id).after(render).remove();
          // 「send-date」クラスを持っている→deleteされた
          if($('#message-box-' + chat_id).hasClass('send-date')){
            // ToDo削除
            $('#todo-' + chat_id).fadeOut('slow').queue(function() {
              this.remove();
            });
            // アナウンス削除
            $('#announce-' + chat_id).fadeOut('slow').queue(function() {
              this.remove();
              if($('.announce-chat').length == 0){
                $('#announce-area').hide();
              }else if($('.announce-chat').length == 1){
                $('#announce-area').children('ul').removeClass('active');
                $('.announce-chat:first').show().removeClass('erase-announce');
                $('#announce-arrow').hide();
              }else{
                $('.announce-chat:first').removeClass('erase-announce');
                $('#announce-arrow').show();
              }
            });
          }
          // チャット新規
        }else{
          $('#offset').append(render);
          if($('#offset').offset().top + $('#offset').height() < $('.message:last').offset().top + $('.message:last').height()){
            $('#is-new-chat').animate( { opacity: '1',}, { duration: 1000 } );
          }
        }
      });
    });
  }
  // モーダル初期化
  function modalInit(){
    $('#chat-todo-user').hide();
    $('#chat-todo-name-create').hide();
    $('#chat-todo-name-create').val('');
    $('#chat-todo-name-create').next().text('登録');
    $('#chat-todo-create-button').prop('disabled', true).hide();
    $('#chat-reply').attr('data-chat-id', '').text('').hide();
    $('#chat-todo').attr('data-chat-id', '').text('').hide();
    $('#chat-announce').attr('data-chat-id', '').text('').hide();
    $('#chat-readoff').attr('data-chat-id', '').text('').hide();
    $('#chat-edit').attr('data-chat-id', '').text('').hide();
    $('#chat-delete').attr('data-chat-id', '').text('').hide();
    $('#chat-todo-name-input').val('').next().text('0');
    $('#chat-todo-manager').attr('data-chat-id', '').text('').hide();
    $('#chat-todo-manager-select').attr('data-chat-id', '').text('').hide();
  }
  // caretの設定
  function caret(selector){
    // caretの設定 参考サイト↓
    // https://www.sukerou.com/2018/08/javascriptcontenteditable.html
    const editor = document.querySelector(selector);
    const selection = window.getSelection()
    const range = document.createRange()
    const length = editor.children.length;
    range.setStart(editor, length)
    range.setEnd(editor, length)
    selection.removeAllRanges()
    selection.addRange(range)
  }
  // アニメーションをしたときに該当のクラスを外す
  $(document).on('animationend', function (event) {
    $(event.target).removeClass('shake_btn');
  });

  /**********
  実行処理
  **********/
  // モーダルのinputをクリックすると消えてしまうのでそれを止める
  $(document).on('click', '#chat-todo-name-input, #todo-manageer-search, #thread-user-search, #thread-manager-search, .manager, .not-manager', function(){
    return false;
  });
  // 画面をクリックしたときにすべてのモーダルを隠す
  $(document).on('click', function(){
    $('#chat-setting').hide();
    modalInit();
  });
  // モーダル表示(︙ボタン)
  $(document).on('click', '.chat-modal-button', function(e){
    modalInit();
    var chat_id = $(this).attr('data-chat-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/chat',
      type: 'POST',
      data: { chat_id: chat_id }
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      // リプライ機能
      $('#chat-reply').attr('data-chat-id', chat_id).text('リプライ').show();
      // ToDo設定
      if(res.chat.user_id == user_id && res.chat.message){
        if(res.chat.chat_todo){
          $('#chat-todo').text('ToDo解除');
        }else{
          $('#chat-todo').text('ToDo');
        }
        $('#chat-todo').attr('data-chat-id', chat_id).show();
      }
      // アナウンス設定
      if(res.chat.message){
        if(res.chat.chat_announces.length != 0){
          $('#chat-announce').text('アナウンス解除');
        }else{
          $('#chat-announce').text('アナウンス');
        }
        $('#chat-announce').attr('data-chat-id', chat_id).show();
      }
      // 未読設定
      if(res.chat.user_id != user_id && res.chat.chat_reads.length != 0){
        $('#chat-readoff').attr('data-chat-id', chat_id).text('既読解除').show();
      }
      // 編集の設定
      if(res.chat.message && res.chat.user_id == user_id && res.chat.user.admin_role != 100){
        $('#chat-edit').attr('data-chat-id', chat_id).text('編集').show();
      }
      // 削除の設定
      if(res.chat.user_id == user_id && res.chat.user.admin_role != 100 || res.chat.user_id == user_id && res.chat.image){
        $('#chat-delete').attr('data-chat-id', chat_id).text('送信取消').show();
      }
    });

    $('#chat-setting').css({ top: e.clientY - 15 + 'px' });
    $('#chat-setting').css({ left: e.clientX + 15 + 'px' });
    $('#chat-setting').show();

    return false;
  });
  // 「新規投稿があります↓」を削除するイベント
  $('#offset').scroll(function(){
    var $this = $(this);
    if(!$('#is-new-chat').is(':hidden')){
      // 指定の高さになったら削除する
      if($this.offset().top + $this.height() > $('.message:last').offset().top + $('.message:last').height()){
        $('#is-new-chat').animate( { opacity: '0',}, { duration: 1000 } )
      }
    }
  });
  /**********
  ToDo関連
  **********/
  // Todoをクリックしたとき
  $(document).on('click contextmenu', '.todo-chat', function(e){
    var chat_id = $(this).attr('data-chat-id');
    $('#chat-setting').hide();
    $('#chat-todo-user').hide();
    // 右クリックしたとき
    if(e.which == 3){
      modalInit();
      // TODOの担当者を取得
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/todo/managers',
        type: 'POST',
        data: { chat_id: chat_id },
      }).done(function(res){
        if(res.error){
          window.location = '/error';
        }
        $('#chat-todo-user').find('.manager').remove();
        $('#chat-todo-user').find('ul').append(res.render);
      });
      if($(this).attr('data-chat-user-id') == user_id){
        $('#chat-todo').attr('data-chat-id', chat_id);
        $('#chat-todo').text('ToDo解除');
        $('#chat-todo').show();
      }
      $('#chat-todo-manager').attr('data-chat-id', chat_id);
      $('#chat-todo-manager').text('ToDo担当者');
      $('#chat-todo-manager').show();
      $('#chat-todo-manager-select').attr('data-chat-id', chat_id);
      $('#chat-todo-manager-select').text('ToDo割り当て');
      $('#chat-todo-manager-select').show();
      $('#chat-setting').css({ top: e.clientY - 15 + 'px' });
      $('#chat-setting').css({ left: e.clientX + 15 + 'px' });
      $('#chat-setting').show();
      return false;
    }else{
      $('#message-box-' + $(this).attr('data-chat-id')).addClass("shake_btn");
    }
  });
  //「担当者」をクリックしたとき
  $(document).on('click', '#chat-todo-manager', function(e){
    var chat_id = $(this).attr('data-chat-id');

    $('#chat-todo-user').find('.manager').show();
    $('#chat-todo-user').find('.not-manager').hide();
    $('#chat-todo-user').children('input').attr('id', 'todo-manageer-search').attr('data-chat-id', chat_id);
    $('#chat-todo-user').css({ top: $('#chat-setting').offset().top + 'px' });
    $('#chat-todo-user').css({ left: $('#chat-setting').offset().left + 'px' });
    $('#chat-setting').hide();
    $('#chat-todo-user').show();
    return false;
  });
  // 担当者のあいまい検索
  $(document).on('keyup', '#todo-manageer-search', function(){
    var search_name = $(this).val();
    $('#chat-todo-user').find('.manager').each(function(index, elm){
      if(search_name != ''){
        // 名前・かなが含まれていたとき
        if($(elm).attr('data-user-name').indexOf(search_name) != -1 || $(elm).attr('data-user-name-kana').indexOf(search_name) != -1){
          $(elm).show();
        }else{
          $(elm).hide();
        }
      }else{
        $(elm).show();
      }
    });
  });
  //「担当者を割り当て」をクリックしたとき
  $(document).on('click', '#chat-todo-manager-select', function(){
    var chat_id = $(this).attr('data-chat-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/todo/user_ids',
      type: 'POST',
      data: { chat_id: chat_id },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      // todoの担当者のとき画像を変更する
      $('#chat-todo-user').find('.chat-todo-user-select').each(function(index, elm){
        if($.inArray(Number($(elm).attr('data-user-id')), res.todo_list_user_ids) != -1){
          $(elm).children('img').attr('src', url + 'image/is_check.png');
        }else{
          $(elm).children('img').attr('src', url + 'image/is_not_check.png');
        }
        // チャットidをもたせる
        $(elm).attr('data-chat-id', chat_id);
      });
    });
    $('#chat-todo-user').find('.manager').hide();
    $('#chat-todo-user').find('.not-manager').show();
    $('#chat-todo-user').children('input').attr('id', 'thread-manager-search').attr('data-chat-id', chat_id);
    $('#chat-todo-user').css({ top: $('#chat-setting').offset().top + 'px' });
    $('#chat-todo-user').css({ left: $('#chat-setting').offset().left + 'px' });
    $('#chat-setting').hide();
    $('#chat-todo-user').show();
    return false;
  });
  // ｢担当者割り当て」のあいまい検索
  $(document).on('keyup', '#thread-manager-search', function(){
    var search_name = $(this).val();
    $('#chat-todo-user').find('.not-manager').each(function(index, elm){
      if(search_name != ''){
        // 名前・かなが含まれていたとき
        if($(elm).attr('data-user-name').indexOf(search_name) != -1 || $(elm).attr('data-user-name-kana').indexOf(search_name) != -1){
          $(elm).show();
        }else{
          $(elm).hide();
        }
      }else{
        $(elm).show();
      }
    });
  });
  // 担当者追加・解除処理
  $(document).on('click', '.chat-todo-user-select', function(){
    $this = $(this);
    var chat_id = $this.attr('data-chat-id');
    var manager_id = $this.attr('data-user-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/todo/manager/toggle',
      type: 'POST',
      data: { manager_id: manager_id, chat_id: chat_id },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      // 担当者を追加したとき
      if(res.register_flg){
        $this.children('img').attr('src', url + 'image/is_check.png');
      }else{
        $this.children('img').attr('src', url + 'image/is_not_check.png');
      }
      $('#todo-' + chat_id).after(res.render).remove();
    });
    return false;
  });
  // Todoのボタン
  $(document).on('click', '#chat-todo', function(){
    var chat_id = $(this).attr('data-chat-id');
    // ToDoのボタンを押したとき
    if($(this).text() == 'ToDo'){
      // 位置を指定
      $('#chat-todo-name-create').css('top', $('#chat-setting').offset().top + 'px');
      $('#chat-todo-name-create').css('left', $('#chat-setting').offset().left + $(window).width() * 0.12 + 5 + 'px');
      $('#chat-todo-create-button').css('top', $('#chat-setting').offset().top + $('#chat-todo-name-create').height() + 5 + 'px');
      $('#chat-todo-create-button').css('left', $('#chat-setting').offset().left + $('#chat-setting').width() +  $('#chat-todo-name-create').width() - $(window).width() * 0.06 + 10 + 'px');
      $('#chat-todo-name-create').show();
      $('#chat-todo-create-button').show();
      $('#chat-todo-name-create').focus();
      $('#chat-todo-create-button').attr('data-chat-id', chat_id);
      // キーコード変数を初期化
      keycode = '';
      return false;
    }else if($(this).text() == 'ToDo解除'){
      if(confirm('Todo解除しますか？')){
        $.ajax({
          headers: { 'X-CSRF-TOKEN': csrf_token },
          url: '/todo/delete',
          type: 'POST',
          data: { chat_id: chat_id },
        }).done(function(res){
          if(res.error){
            window.location = '/error';
          }
          $(this).text('ToDo');
          $('.todo-image-' + chat_id).hide();
          $('#todo-' + chat_id).fadeOut('slow').queue(function() {
            this.remove();
            // ToDoを登録してみよう！を消す
            if(!$('#todo-list').find('tr').length){
              $('#todo-list tbody').append('<tr><th>ToDoを登録してみよう！</th></tr>');
            }
          });
          $('#chat-setting').hide();
        });
      }
    }
  });
  // Todo登録の処理
  $(document).on('click', '#chat-todo-create-button', function(){
    var chat_id = $(this).attr('data-chat-id');
    if(confirm('ToDo登録しますか？')){
      var todo_name = $('#chat-todo-name-input').val();
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/todo/register',
        type: 'POST',
        data: { chat_id: chat_id, todo_name: todo_name },
      }).done(function(res){
        if(res.error){
          window.location = '/error';
        }
        $('#chat-todo').text('ToDo解除');
        $('#chat-todo-name-create').hide();
        $('#chat-todo-create-button').hide();
        // ToDoを登録してみよう！を消す
        if($('#todo-list').find('th').length){
          $('#todo-list').find('tr').remove();
        }
        $('.todo-image-' + chat_id).show();

        $('#todo-list > tbody').append(res.render);
      });
    }
  });
  // Todoの文字数カウント
  $(document).on('keyup', '#chat-todo-name-input', function(e){
    if(0 <= $(this).val().length){
      if($(this).val().length <= 10){
        $(this).next().text($(this).val().length);
      }
      $('#chat-todo-create-button').prop('disabled', false);
      if(e.keyCode == 13 && keycode == 13){
        $('#chat-todo-create-button').trigger("click");
        keycode = '';
      }
    }
    if($(this).val().length == 0){
      $('#chat-todo-create-button').prop('disabled', true);
    }
    keycode = e.keyCode;
  });
  // ユーザーのマイページに飛ばす処理
  $(document).on('click', '.user-show-link', function(){
    window.location = $this.attr('href');
  });
  // Todo完了・未完了処理
  $(document).on('click', '.todo-image', function(){
    var $this = $(this);
    var chat_id = $this.attr('data-chat-id');
    var manager_id = $this.attr('data-user-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/todo/complete/toggle',
      type: 'POST',
      data: { chat_id: chat_id, manager_id: manager_id },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      // 完了のとき
      if(res.is_complete){
        $('#todo-image-' + manager_id).attr('src', url + 'image/done_chat.svg');
        $('#todo-manager-' + manager_id).addClass('done');
      }else{
        $('#todo-image-' + manager_id).attr('src', url + 'image/todo_chat.svg');
        $('#todo-manager-' + manager_id).removeClass('done');
      }
      $('#todo-' + chat_id).after(res.render).remove();
    });
    return false;
  });
  // todoの期限のマークのボタンを押したとき
  $(document).on('click', '.todo-deadline-img', function(e){
    $('#todo-deadline-calendar').attr('data-chat-id', $(this).attr('data-chat-id'));
    $('#todo-deadline-calendar').show();
    $('#todo-deadline-calendar').css({ top: e.clientY + 20 + 'px' });
    $('#todo-deadline-calendar').css({ left: e.clientX - 20 + 'px' });
    currnet_deadline = $(this).attr('data-deadline');
    $('#todo-deadline-calendar').datepicker('setDate', currnet_deadline);
    if(!$('#datepicker-clear-button').length){
      $('.ui-datepicker-buttonpane').append('<button type="button" id="datepicker-clear-button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">クリア</button>');
      $('.ui-datepicker-buttonpane').append('<button type="button" id="datepicker-close-button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">閉じる</button>');
    }
  });
  // todoの期限登録処理
  $(document).on('DOMSubtreeModified propertychange', '#todo-deadline-calendar', function(e){
    var chat_id = $('#todo-deadline-calendar').attr('data-chat-id');
    var year = $('.ui-datepicker-current-day').attr('data-year');
    var month = parseInt($('.ui-datepicker-current-day').attr('data-month')) + 1;
    var day = $('.ui-state-active').text();
    var deadline_date = year + '-' + month + '-' + day;
    // 月チェンジするとyearがundefinedになるため
    if(year != undefined && currnet_deadline != '' && currnet_deadline != deadline_date){
      currnet_deadline = deadline_date;
      $.ajax({
        headers: { 'X-CSRF-TOKEN': csrf_token },
        url: '/todo/deadline/change',
        type: 'POST',
        data: { chat_id: chat_id, deadline_date: deadline_date },
      }).done(function(res){
        if(res.error){
          window.location = '/error';
        }
        $('#todo-' + chat_id).after(res.render).remove();
      });
      if(!$('#datepicker-clear-button').length){
        $('.ui-datepicker-buttonpane').append('<button type="button" id="datepicker-clear-button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">クリア</button>');
        $('.ui-datepicker-buttonpane').append('<button type="button" id="datepicker-close-button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all">閉じる</button>');
      }
    }
  });
  // カレンダー内のクリアを押したとき
  $(document).on('click', '#datepicker-clear-button', function(){
    var chat_id = $('#todo-deadline-calendar').attr('data-chat-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/todo/deadline/change',
      type: 'POST',
      data: { chat_id: chat_id, deadline_date: ''},
    }).done(function(){
      $('#todo-deadline-img-' + chat_id).attr('data-deadline', '');
      $('#todo-deadline-' + chat_id).text('期限なし').attr('class', 'todo-deadline');
    });
  });
  // カレンダー内の閉じるボタンを押したとき
  $(document).on('click', '#datepicker-close-button', function(){
    $('#todo-deadline-calendar').hide();
  });

  /**********
  アナウンス関連
  **********/
  // アナウンス表示
  $(document).on('click', '#announce-arrow', function(){
    $('#announce-area').children('ul').toggleClass('active');
    if($('#announce-area').children('ul').attr('class') == 'active'){
      $('.erase-announce').show();
      $(this).css('transform', 'rotate(135deg)');
    }else{
      $('.erase-announce').hide();
      $(this).css('transform', 'rotate(-45deg)');
    }

  });
  // アナウンスtoggle処理
  $(document).on('click', '#chat-announce', function(){
    $('#chat-todo-name-create').hide();
    $('#chat-todo-create-button').hide();
    var chat_id = $(this).attr('data-chat-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/announce/toggle',
      type: 'POST',
      data: { chat_id: chat_id },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      if(res.is_announce){
        $('#announce-area > ul').append(res.render);
        $('#announce-area').show();

        if($('#announce-area').children('ul').attr('class') == 'active'){
          $('.erase-announce').show();
        }else{
          $('.erase-announce').hide();
        }
        // 矢印の表示
        if($('.announce-chat').length == 1){
          $('#announce-arrow').hide();
        }else{
          $('#announce-arrow').show();
        }
        $(this).text('アナウンス解除');
      }else{
        // ゆっくり削除
        $('#announce-' + chat_id).fadeOut('slow').queue(function() {
          this.remove();
          if($('.announce-chat').length == 0){
            $('#announce-area').hide();
          }else if($('.announce-chat').length == 1){
            $('#announce-area').children('ul').removeClass('active');
            $('.announce-chat:first').show().removeClass('erase-announce');
            $('#announce-arrow').hide();
          }else{
            $('.announce-chat:first').removeClass('erase-announce');
            $('#announce-arrow').show();
          }
        });
        $(this).text('アナウンス');
      }
    });
    $('#chat-setting').hide();
  });
  // アナウンスのチャットを押したときの処理
  $(document).on('click contextmenu', '.announce-chat', function(e){
    var chat_id = $(this).attr('data-chat-id');
    if(e.which == 3){
      $('#chat-announce').attr('data-chat-id', chat_id);
      $('#chat-announce').text('アナウンス解除');
      $('#chat-todo').hide();
      $('#chat-readoff').hide();
      $('#chat-edit').hide();
      $('#chat-delete').hide();
      $('#chat-announce').show();
      $('#chat-setting').css({ top: e.clientY - 15 + 'px' });
      $('#chat-setting').css({ left: e.clientX + 40 + 'px' });
      $('#chat-setting').show();
      return false;
    }else{
      $('#message-box-' + $(this).attr('data-chat-id')).addClass("shake_btn");
    }
  });

  /**********
  その他
  **********/
  // モーダルのリプライをクリックしたとき
  $(document).on('click', '#chat-reply', function(){
    // リプライの名前設定
    var name = $('#message-box-' + $(this).attr('data-chat-id')).attr('data-user-name');
    $('#reply-user-name').text(name);
    // メッセージか画像か
    if(!$('#chat-message-' + $(this).attr('data-chat-id')).children('a').length){
      var message = $('#chat-message-' + $(this).attr('data-chat-id')).children(':first').text();
      // 20文字以上のとき
      if(message.length > 25){
        message = message.substr(0, 25) + '...';
      }
      $('#reply-message').text(message);
    }else{
      $('#reply-message').text('画像');
      $('#reply-message').text();
    }

    $('#is-new-chat').hide();
    $('#reply-area').attr('data-chat-id', $(this).attr('data-chat-id')).show();
  });
  // リプライを押したときに該当のチャットに遷移
  $(document).on('click', '#reply-area, .reply-chat', function(){
    location.href = '#message-box-' + $(this).attr('data-chat-id');
    $('#message-box-' + $(this).attr('data-chat-id')).addClass("shake_btn");
  });
  // リプライの✖を押したとき
  $(document).on('click', '#reply-cancel', function(){
    $('#reply-area').hide();
    $('#is-new-chat').show();
    return false;
  });
  // 既読解除処理
  $(document).on('click', '#chat-readoff', function(){
    // 最初に消す処理
    $('#chat-todo-name-create').hide();
    $('#chat-todo-create-button').hide();

    var chat_id = $(this).attr('data-chat-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/readoff',
      type: 'POST',
      data: { chat_id: chat_id },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
    });
    not_ids.push(chat_id);
    $('#chat-read-' + chat_id).text('');
    $('#chat-setting').hide();
  });

  /**********
  編集関連
  **********/

  // 編集のボタンを押したとき
  $(document).on('click', '#chat-edit', function(){
    // 最初に消す
    $('#chat-todo-name-create').hide();
    $('#chat-todo-create-button').hide();
    var chat_id = $(this).attr('data-chat-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': csrf_token },
      url: '/chat/message',
      type: 'POST',
      data: { chat_id: chat_id }
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      if($('#message-edit-area').length){
        $('#message-edit-cansel-button').trigger('click');
      }
      // quillEditorを作成
      var $message_box = $('#message-box-' + chat_id);
      $message_box.children('.message-area').hide();
      $message_box.append(res.render);
      quillEditor('#message-edit', true);
      $('#message-edit > .ql-editor').empty().append(res.message);
      // 最後から二番目の番号
      $second_last = $('.message').length - 1;
      if($('.message:last').attr('id') == 'message-box-' + chat_id){
        $('#offset').scrollTop($('#offset').get(0).scrollHeight);
      }
      caret('#message-edit > .ql-editor');
    });
  });
  // 編集キャンセルのボタンを押した時
  $(document).on('click', '#message-edit-cansel-button', function(){
    var chat_id = $(this).attr('data-chat-id');
    $('#message-edit-area').remove();
    $('#message-box-' + chat_id).children('.message-area').show();
    caret('#editor > .ql-editor');
  });
  // 変更保存するのボタンを押した時の更新処理
  $(document).on('click', '#message-edit-update-button', function(){
    var chat_id = $(this).attr('data-chat-id');
    var message = '';
    $('#message-edit > .ql-editor').children().each(function(index, elm){
      if(!$(elm).children('a').length){
        // リンクがあったら生成
        var tag = $(elm).html().replace(/(https?:\/\/[\x21-\x7e]+)/g, function(link) {
          return '<a href="' + link + '" target="_blank" style="color: #1d68a7">' + link + '</a>';
        });

        message += $(elm).html(tag).prop('outerHTML');
      }else{
        message += $(elm).html();
      }
    });
    // チャットの中身が空かどうかでupdateかどうか判断
    var is_update = false;
    $('#message-edit > .ql-editor').children().each(function(index, elm){
      if($.trim($(elm).text()) !== ''){
        is_update = true;
        return false;
      }
    });
    if(is_update){
      chatUpdate(chat_id, message);
      $('#message-edit-area').remove();
      $('#chat-message-' + chat_id).empty().append(message);
      $('#message-box-' + chat_id).children('.message-area').show();
    }else{
      if(confirm('削除しますか？')){
        $('#message-edit-area').remove();
        chatDelete(chat_id);
      }else{
        return false;
      }
    }
  });
  // 編集の中身変更
  $(document).on('DOMSubtreeModified propertychange', '#message-edit',() => {
    $('#message-edit').on('DOMSubtreeModified propertychange', () => {
      // pタグとblockquoteの高さ
      var p_blockquote_height = 0;
      $('#message-edit > .ql-editor').children('p, blockquote').each(function(index, elm){
        p_blockquote_height += $(elm).height();
      });
      // preタグの高さを設定
      var pre_height = 0;
      $('#message-edit > .ql-editor').children('pre').each(function(index, elm){
        $(elm).css('color', 'rgb(29,28,29)')
        .css('background-color', 'rgb(248,248,248)')
        .css('border-color', 'rgb(221,221,221)');
        // 22はborder-box
        pre_height += $(elm).height() + 22;
      });
      // preタグの高さ + pタグ、blockquoteタグの高さ + padding Y(24)
      var after_height = p_blockquote_height + pre_height + 24;
      // フォームの高さ
      if(after_height <= 295){
        // フォームの高さの初期値
        $('#message-edit').height(42);
        $('#message-edit').height(after_height);
      }

      return false;
    });
  });

  // 送信取消
  $(document).on('click', '#chat-delete', function(){
    $('#chat-todo-name-create').hide();
    $('#chat-todo-create-button').hide();
    if(confirm('送信取り消ししますか？')){
      var chat_id = $(this).attr('data-chat-id');
      chatDelete(chat_id);
    }
  });

  /**********
  送信処理
  **********/
  // 投稿フォームを入力したときの処理
  $('#editor > .ql-editor').on('DOMSubtreeModified propertychange', () => {
    new_message = document.querySelector('#editor > .ql-editor').innerHTML;

    $('#editor > .ql-editor').children().each(function(index, elm){
      if($.trim($(elm).text()) !== ''){
        is_disabled = false;
        return false;
      }else{
        is_disabled = true;
      }
    });
    $('#chat-submit').attr('disabled', is_disabled);
    if(is_disabled){
      $('#chat-submit').children('img').attr('src', '/image/chat_disabled_submit.svg');
      $('#editor > .ql-editor').children(':first').empty().text('\u200B');
    }else{
      $('#chat-submit').children('img').attr('src', '/image/chat_submit.svg');
    }
  });
  // 指定のキーコードを押したときにフォームのオプションをクリックする
  $(document).on('keydown', function(e){
    // 引用タグ(event.metaKey = commandキー)
    if(mac_os !== -1 && event.metaKey && event.shiftKey && e.keyCode === 57 || windows_os !== -1 && event.ctrlKey && event.shiftKey && e.keyCode === 57){
      if($('#message-edit-area').length){
        $('#message-edit').prev().find('.ql-blockquote').trigger('click');
      }else{
        $('#editor').prev().find('.ql-blockquote').trigger('click');
      }
      keycode = '';
      return false;
    }
    // コードブロック
    if(mac_os !== -1 && event.metaKey && event.shiftKey && (keycode === 18 && e.keyCode === 67 || keycode === 67 && e.keyCode === 18) || windows_os !== -1 && event.ctrlKey && event.shiftKey && (keycode === 18 && e.keyCode === 67 || keycode === 67 && e.keyCode === 18)){
      if($('#message-edit-area').length){
        $('#message-edit').prev().find('.ql-code-block').trigger('click');
      }else{
        $('#editor').prev().find('.ql-code-block').trigger('click');
      }
      keycode = '';
      return false;
    }
    if(e.keyCode === 18 || e.keyCode === 67){
      keycode = e.keyCode;
    }
  });
  // 送信ボタンを押したときにチャット投稿
  $(document).on('click', '#chat-submit', function(){
    $('#editor > .ql-editor').children().each(function(index, elm){
      if($.trim($(elm).text()) !== '' && $.trim($(elm).text()) !== '\u200B'){
        chatCreate();
        return false;
      }
    });
  });
  // 送信用のキーを押したときにチャット投稿
  $(document).on('keydown', function(e){
    if(mac_os !== -1 && event.metaKey && e.keyCode === 13 || windows_os !== -1 && event.ctrlKey && e.keyCode === 13){
      if($('#message-edit-area').length){
        $('#message-edit-update-button').trigger('click');
      }else{
        $('#chat-submit').trigger('click');
      }
    }
  });
  // 画像の送信処理
  // https://qiita.com/Sub_Tanabe/items/9a57ba1b550ff5fc664b
  create_editor.getModule('toolbar').addHandler('image', () => {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'image');
    input.setAttribute('id', 'input-image');
    input.click();

    input.onchange = () => {
      if(confirm('本当に画像を送信しますか？')){
        const file = input.files[0];
        // file type is only image.
        if(/^image\//.test(file.type)){
          var form_data = new FormData();
          // formに画像を入れ込む
          form_data.append('image', file);
          form_data.append('chat_thread_id', chat_thread_id);

          $.ajax({
            headers: { 'X-CSRF-TOKEN': csrf_token },
            url: '/chat/image',
            type: 'POST',
            data: form_data,
            cache: false,
            contentType: false,
            processData: false,
          }).done(function(res){
            if(res.error){
              window.location = '/error';
            }
            // チャットを作成
            $('#offset').append(res.render).animate({ scrollTop: $('#offset').get(0).scrollHeight });
          });
        }else{
          window.location = '/error';
        }
      }
    };
  });
  // 秒ごとに読み込む
  setInterval(function(){
    if (document.hasFocus()){
      changeChat();
      readOn();
      unreadTotal();
    }
  }, 10000);
  setInterval(function(){
    if(document.hasFocus()){
      if(old_message != new_message){
        draftCreate();
        old_message = new_message;
      }
    }
  }, 1000);
});
