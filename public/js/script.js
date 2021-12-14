// const { min } = require("lodash");

// フラッシュメッセージのフェードアウト
window.setTimeout(function () {
  var $flash_message = $(".flash_message");

  if ($flash_message != null) {
    $flash_message.fadeOut(3000);
  }
}, 1000);

// 確認confirm
function checkSubmit(word) {
  return confirm(word);
}

// 面談一覧の年チェンジ処理
$('#js-interview-year-change').on('change', function () {
  var user_id = $(this).data('user_id');
  var date = new Date($(this).val());
  var year = date.getFullYear();

  var url = '/admin/interviews/' + user_id + '/' + year;
  window.location = url;
});

// ユーザー詳細の月チェンジ処理
$('#js-user-month-chenge').on('input', function () {
  var user_id = $(this).data('user-id');
  var date = new Date($(this).val());
  var year = date.getFullYear();
  var month = ('00' + (date.getMonth() + 1)).slice(-2); // +1しないと１つ前の月になってしまう

  var url = '/admin/user/' + user_id + '/' + year + '/' + month;
  window.location = url;
});

// 月報一覧月チェンジ処理
$('#js-month-report-index-chenge').on('input', function () {
  var user_id = $(this).data('user-id');
  var date = new Date($(this).val());
  var year = date.getFullYear();
  var month = ('00' + (date.getMonth() + 1)).slice(-2); // +1しないと１つ前の月になってしまう

  var url = '/month_reports/' + user_id + '/' + year + '/' + month;
  window.location = url;
});

// 月報詳細月チェンジ処理
$('#js-month-report-chenge').on('input', function () {
  var user_id = $(this).data('user-id');
  var date = new Date($(this).val());
  var year = date.getFullYear();
  var month = ('00' + (date.getMonth() + 1)).slice(-2); // +1しないと１つ前の月になってしまう
  var url = '/month_report/' + user_id + '/' + year + '/' + month;
  window.location = url;
});

// ユーザー検索カレンダー
$('#hire_at_from').on('change', function () {
  document.getElementById('hire_at_to').min = $(this).val();
});
$('.not_charge_person').on('click', function () {
  var elm = $('.charge_person_ids')
  $(this).prop("checked") ? elm.prop('disabled', true) : elm.prop('disabled', false);
});

$('.teacher_ids').on('click', function () {
  var elm = $('.not_teacher_person')
  $(this).prop("checked") ? elm.prop('disabled', true) : elm.prop('disabled', false);
});
$('.not_teacher_person').on('click', function () {
  var elm = $('.teacher_ids')
  $(this).prop("checked") ? elm.prop('disabled', true) : elm.prop('disabled', false);
});
$('.start_curriculum').on('click', function () {
  var elm = $('.not_start_curriculum')
  $(this).prop("checked") ? elm.prop('disabled', true) : elm.prop('disabled', false);
});
$('.not_start_curriculum').on('click', function () {
  var elm = $('.start_curriculum')
  $(this).prop("checked") ? elm.prop('disabled', true) : elm.prop('disabled', false);
});

// 担当人事・担当講師の開始日update
$('.js-charge-started_at').on('change', function () {
  var id = $(this).data('id');
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/admin/user_charge_person/' + id,
    type: 'POST',
    data: $('#js-charge-started_at-' + id).serialize(),
  }).done(function () {
    window.location.reload();
  });
});

// 担当人事・担当講師の終了日update
$('.js-charge-ended_at').on('change', function () {
  var id = $(this).data('id');
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/admin/user_charge_person/' + id,
    type: 'POST',
    data: $('#js-charge-ended_at-' + id).serialize(),
  }).done(function () {
    window.location.reload();
  });
});

// 退職日update
$('.js-deleted_at').on('change', function () {
  var id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/admin/update_deleted/' + id,
    type: 'POST',
    data: $('#js-deleted_at-' + id).serialize(),
  });
});

// チェックボックスの処理
$('.charge_person_ids').on('click', function () {
  var elm = $('.not_charge_person')
  $(this).prop("checked") ? elm.prop('disabled', true) : elm.prop('disabled', false);
});

/********************
スクール管理
********************/

// スクール管理 月チェンジ処理
$('#js-progress-month-chenge').on('input', function () {
  var date = new Date($(this).val());
  var year = date.getFullYear();
  var month = ('00' + (date.getMonth() + 1)).slice(-2); // +1しないと１つ前の月になってしまう

  var url = '/admin/progress/' + year + '/' + month;
  window.location = url;
});

// 集計しないユーザーのチェックボックスtoggle
$('.js-remove-user-change').change(function () {
  var progress_id = $(this).data('id');
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/admin/progress/toggle_delete',
    type: 'POST',
    data: $('#js-remove-user-change-' + progress_id).serialize(),
  }).done(function (res) {
    var elm = $('#js-remain-user-num');
    var user_num = res.check ? parseInt(elm.text()) - 1 : parseInt(elm.text()) + 1;
    elm.text(user_num);
  });
});

/********************
スクール予約画面
********************/

// スクール枠数セット 月取得
$('#js-school-part-chenge').on('input', function () {
  var date = new Date($(this).val());
  var year = date.getFullYear();
  var month = ('00' + (date.getMonth() + 1)).slice(-2); // +1しないと１つ前の月になってしまう

  var school_place = $('input:radio[name="school_place"]:checked').val();

  var url = '/admin/school_part/' + year + '/' + month + '/' + school_place;
  window.location = url;
});

// リモート、本社チェンジ
$('input:radio[name="school_place"]').on('input', function () {
  var school_place = $(this).val();

  var val = $('#js-school-part-chenge').val();
  var date = new Date(val);
  var year = date.getFullYear();
  var month = ('00' + (date.getMonth() + 1)).slice(-2); // +1しないと１つ前の月になってしまう
  var url = '/admin/school_part/' + year + '/' + month + '/' + school_place;

  window.location = url;
});

/********************
スクール予約確認画面 ajax
********************/

// 講師選択
$('.js-teacher-change').change(function () {
  var item_id = $(this).data('id');
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/admin/school_reserve',
    type: 'POST',
    data: $('#js-teacher-change-' + item_id).serialize(),
  }).done(function (res) {
    if (res.error) {
      window.location.reload();
    }
  }).fail(function () {
  });
});

// 出席結果選択
$('.js-school-result-change').change(function () {
  var item_id = $(this).data('id');
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/admin/school_reserve',
    type: 'POST',
    data: $('#js-school-result-change-' + item_id).serialize(),
  }).done(function (res) {
    if (res.error) {
      window.location.reload();
    }
  });
});

// コメント入力選択
$('.js-comment-chenge').blur(function () {
  $this = $(this);
  var item_id = $this.data('id');
  var length = $this.val().length;

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/admin/school_reserve',
    type: 'POST',
    data: $('#js-comment-change-' + item_id).serialize(),
  }).done(function (res) {
    var comment_error = document.getElementById('comment-error');

    if (res.error) {
      if (length > 255) {
        comment_error.innerText = 'コメントは255文字以内で入力してください';
      } else {
        window.location.reload();
      }
    } else {
      comment_error.innerText = '';
    }
  });
});
// コメント表示
$('.js-comment-chenge').on('click keyup', function(){
  $('#js-comment').text($(this).val());
});
// エンターキーの無効
$('.js-comment-chenge').keydown(function (e) {
  if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
    return false;
  } else {
    return true;
  }
});

/********************
スキルマップシート ajax
********************/
// コミットスタート
$('.js-skill-commit-start').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/skillmapsheet',
    type: 'POST',
    data: $('#js-commit-start-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }

    var element = document.getElementById('skill-commit-end-' + item_id);
    if (res.commit_start == null) {
      element.disabled = true;
    } else {
      element.disabled = false;
      element.min = res.commit_start;
    }
  });
});

// コミットエンド
$('.js-skill-commit-end').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/skillmapsheet',
    type: 'POST',
    data: $('#js-commit-end-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    var element = document.getElementById('skill-commit-start-' + item_id);
    if (res.commit_end == null) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  });
});

// リザルトスタート
$('.js-skill-result-start').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/skillmapsheet',
    type: 'POST',
    data: $('#js-result-start-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    var element = document.getElementById('skill-result-end-' + item_id);
    if (res.result_start == null) {
      element.disabled = true;
    } else {
      element.disabled = false;
      element.min = res.result_start;
    }
  });
});

// リザルトエンド
$('.js-skill-result-end').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/skillmapsheet',
    type: 'POST',
    data: $('#js-result-end-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    var commit = document.getElementById('skill-result-start-' + item_id);
    var evaluation = document.getElementById('skill-user-evaluation-' + item_id);

    if (res.result_end == null) {
      commit.disabled = false;
      evaluation.disabled = true;

      //講師評価
      $('#skill-teacher-evaluation-' + item_id + ' .result-end-off').show();
      $('#skill-teacher-evaluation-' + item_id + ' .result-end-on').hide();

    } else {
      commit.disabled = true;
      evaluation.disabled = false;
      //講師評価
      $('#skill-teacher-evaluation-' + item_id + ' .result-end-on').show();
      $('#skill-teacher-evaluation-' + item_id + ' .result-end-off').hide();
    }
  });
});

// 自己評価
$('.js-user-evaluation').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/skillmapsheet',
    type: 'POST',
    data: $('#js-user-evaluation-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    $('#js-user-evaluate-date').text(res.date).change();

    var element = document.getElementById('skill-result-end-' + item_id);
    if (res.user_evaluation == null) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  });
});

// 講師評価
$('.js-teacher-evaluation').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/skillmapsheet',
    type: 'POST',
    data: $('#js-teacher-evaluation-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    $('#js-total-score').text(res.totalScore).change();
    $('#js-teacher-evaluate-date').text(res.date).change();

    var element = document.getElementById('skill-result-end-' + item_id);
    if (res.teacher_evaluation == null) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
    if (res.teacher_evaluation == '3') {
      $('#' + item_id).addClass("bg-secondary");
    } else {
      $('#' + item_id).removeClass("bg-secondary");
    }
  });
});

// レポートチェック
$('.js-report').click(function () {
  var report_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/report',
    type: 'POST',
    data: $('#js-report-form-' + report_id).serialize(),
  })

});

// カリキュラム開始日
$('.js-started-at').change(function () {
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/skillmapsheet',
    type: 'POST',
    data: $('#js-started-at').serialize(),
  })
  .done(function () {
    window.location.reload();
  });
});

// カリキュラム終了日
$('.js-ended-at').change(function () {
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/skillmapsheet',
    type: 'POST',
    data: $('#js-ended-at').serialize(),
  })
  .done(function () {
    window.location.reload();
  });
});

// アドミンカリキュラム切替
$('#js-admin-curriculum-skill-change').on('input', function () {
  var curriculum = $(this).val();
  var url = '/admin/skillmapsheet_item/' + curriculum;
  window.location = url;
});

// カリキュラムリストプルダウン
$('.js-curriculum-skill-list').on('input', function () {
  var curriculum = $(this).val();
  var url = '/admin/skillmapsheet_item/create/' + curriculum;
  window.location = url;
});

// 言語リストプルダウン
$('.js-language-list').on('input', function () {
  var curriculum = $('.js-curriculum-skill-list').val();
  var language = $(this).val();
  var url = '/admin/skillmapsheet_item/create/' + curriculum + '/' + language;
  window.location = url;
});

// レポートリストプルダウン
$('.js-report-curriculum-list').on('input', function () {
  var curriculum = $(this).val();
  var url = '/admin/report_item/create/' + curriculum;
  window.location = url;
});

/********************
ガントチャート　ajax
********************/
// コミットスタート
$('.js-gantt-commit-start').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/ganttchart',
    type: 'POST',
    data: $('#js-commit-start-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    var element = document.getElementById('gantt-commit-end-' + item_id);
    if (res.commit_start == null) {
      element.disabled = true;
    } else {
      element.disabled = false;
      element.min = res.commit_start;
    }
  })
  .fail(function () {
  });
});

// コミットエンド
$('.js-gantt-commit-end').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/ganttchart',
    type: 'POST',
    data: $('#js-commit-end-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    var element = document.getElementById('gantt-commit-start-' + item_id);
    if (res.commit_end == null) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  })
  .fail(function () {
  });
});

// リザルトスタート
$('.js-gantt-result-start').change(function () {
  var item_id = $(this).data('id');

  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/ganttchart',
    type: 'POST',
    data: $('#js-result-start-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    var element = document.getElementById('gantt-result-end-' + item_id);
    if (res.result_start == null) {
      element.disabled = true;
    } else {
      element.disabled = false;
      element.min = res.result_start;
    }
  })
  .fail(function () {
  });
});

// リザルトエンド
$('.js-gantt-result-end').change(function () {
  var item_id = $(this).data('id');
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/ganttchart',
    type: 'POST',
    data: $('#js-result-end-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if (res.error) {
      window.location.reload();
    }
    var element = document.getElementById('gantt-result-start-' + item_id);
    var is_ended = document.getElementById('gantt-is-ended-' + item_id);
    if (res.result_end == null) {
      element.disabled = false;
      is_ended.disabled = true;
    } else {
      element.disabled = true;
      is_ended.disabled = false;
    }
  })
});

// 終了チェック
$('.js-is-ended').on('click', function () {
  var item_id = $(this).children("input").data('id');
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/ganttchart',
    type: 'POST',
    data: $('#js-is-ended-form-' + item_id).serialize(),
  })
  .done(function (res) {
    if(res.error){
      window.location = '/error';
    }
    $('#js-rank').text(res.rank + "位").change();
    $('#js-progress').text(res.progress + "%").change();
    $('#js-final-task-evaluate-date').text(res.date).change();

    var element = document.getElementById('gantt-result-end-' + item_id);
    if (res.is_ended == 0) {
      element.disabled = false;
      $('#' + item_id).removeClass("bg-secondary");
    } else {
      element.disabled = true;
      $('#' + item_id).addClass("bg-secondary");
    }
  })
});

// アドミンカリキュラム切替
$('#js-admin-curriculum-gantt-change').on('input', function () {
  var curriculum = $(this).val();
  var url = '/admin/ganttchart_item/' + curriculum;
  window.location = url;
});

// 最終課題開始日
$('.js-gantt-started-at').change(function () {
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/ganttchart',
    type: 'POST',
    data: $('#js-gantt-started-at').serialize(),
  })
  .done(function () {
    window.location.reload();
  });
});

// 最終課題終了日
$('.js-gantt-ended-at').change(function () {
  $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    url: '/ganttchart',
    type: 'POST',
    data: $('#js-gantt-ended-at').serialize(),
  })
  .done(function () {
    window.location.reload();
  });
});

// カリキュラムリストプルダウン
$('.js-curriculum-gantt-list').on('input', function () {
  var curriculum = $(this).val();
  var url = '/admin/ganttchart_item/create/' + curriculum;
  window.location = url;
});

// タスクリストプルダウン
$('.js-task-list').on('input', function () {
  var curriculum = $('.js-curriculum-gantt-list').val();
  var task = $(this).val();
  var url = '/admin/ganttchart_item/create/' + curriculum + '/' + task;
  window.location = url;
});

// タイトル削除
function checkDeleteTitle() {
  return confirm("削除しますか？タイトルを削除すると、関連する項目も全て削除されます。");
}

/********************
お知らせ
********************/
function changeDisabled() {

  var radio_2 = document.getElementById("radio-2");
  var info_day = document.getElementById("info_day");
  var info_hour = document.getElementById("info_hour");
  var info_minute = document.getElementById("info_minute");

  if (radio_2.checked) {
    info_day.disabled = false;
    info_hour.disabled = false;
    info_minute.disabled = false;
  } else {
    info_day.value = "";
    info_hour.value = "";
    info_minute.value = "";
    info_hour.disabled = true;
    info_day.disabled = true;
    info_minute.disabled = true;
  }
  window.onload = changeDisabled;
}

// お知らせいいね
$(function () {
  $('.information_favorite_ignition').on('click', function () {
    information_id = $(this).attr("information_id");
    information_favorite = $(this).attr("information_favorite");
    click_button = $(this);

    // // クリックすると1秒押せないようにする処理
    var $this = $(this)
    $this.css('pointer-events', 'none');
    setTimeout(function () {
      $this.css('pointer-events', '');
    }, 300);

    $.ajax({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      url: '/information_favorite',
      type: 'GET',
      data: { 'information_id': information_id, 'information_favorite': information_favorite },
    })
    .done(function (data) {
      $('.information_favorite_count' + information_id).text(data[1]).change();

      if (data[0] == 0) {
        click_button.attr("information_favorite", "1");
        click_button.children().attr('src', '/image/favorite_black_24dp.svg');
      }
      if (data[0] == 1) {
        click_button.attr("information_favorite", "0");
        click_button.children().attr('src', '/image/favorite_border_black_24dp.svg');
      }
    })
    .fail(function (data) {
      alert('いいね処理失敗');
    });
  });
});


// モーダルウィンドウ
$(window).on('load', function () {
  $('#myModal').modal('show');
});

// スクールキャンセルモーダル
$('.cansel-comment-button').on('click', function () {
  $('#cansel-comment-form-modal').modal('show');
  $('#required').text('');
  $('#cansel-school-date').val($(this).data('school-date'));
});

// 送信処理
$('#cansel-submit').on('click', function () {
  if ($('#cansel-comment-input').val() == '') {
    $('#required').text('入力必須です。');
    return false;
  }

  if (!confirm('キャンセルしますか？')) {
    return false;
  }
});

// 多重送信対策
// $(function () {
//   $('form').submit(function () {
//     $(this).find('input[type="submit"], button[type="submit"]').not('#not-disabled').prop('disabled', 'true');
//   });
// });

/********************
textarea
********************/
// /textareaの要素を取得
// let textarea = document.getElementById('textarea');
//textareaのデフォルトの要素の高さを取得

//textareaのinputイベント
$('.textarea').on('input', (evt) => {
  let target = evt.target;
  //textareaの要素の高さを設定
  target.style.height = '60px';
  //textareaの高さに入力内容の高さを設定
  target.style.height = target.scrollHeight + 'px';
});

//textareaのreadyイベント
$(document).on('ready', () => {
  $('.textarea').each(function (index, element) {
    //textareaの高さに入力内容の高さを設定
    element.style.height = element.scrollHeight + 'px';
  });
});

var url_split = location.href.split("/");

if(url_split[url_split.length -3] !== 'chat'){
  // 期限のカレンダーボタンを削除
  $('.todo-deadline-img').remove();
}
// マイページのTodo完了・未完了処理
$(document).on('click', '.todo-image', function(){
  if(url_split[url_split.length -3] !== 'chat'){
    var $this = $(this);
    var chat_id = $this.attr('data-chat-id');
    var manager_id = $this.attr('data-user-id');
    $.ajax({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
      url: '/todo/complete/toggle',
      type: 'POST',
      data: { chat_id: chat_id, manager_id: manager_id },
    }).done(function(res){
      if(res.error){
        window.location = '/error';
      }
      // 完了のとき
      var url = location.protocol + '//' + location.host + '/';
      if(res.is_complete){
        $('#todo-image-' + manager_id).attr('src', url + 'image/done_chat.svg');
        $('#todo-manager-' + manager_id).addClass('done');
      }else{
        $('#todo-image-' + manager_id).attr('src', url + 'image/todo_chat.svg');
        $('#todo-manager-' + manager_id).removeClass('done');
      }
      $('#todo-' + chat_id).after(res.render).remove();
      $('.todo-deadline-img').remove();
    });
    return false;
  }
});
// 未読の数の読み込み
// setInterval(function(){
//   if(document.hasFocus()){
//     $.ajax({
//       headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
//       url: '/unreadtotal',
//       type: 'POST',
//     }).done(function(res){
//       if(res.unread_total != 0){
//         $('.unread-total').text(res.unread_total);
//       }else{
//         $('.unread-total').text('');
//       }
//     });
//   }
// }, 20000);

// heart anime
$(function () {
  $('.favorite').on('click', function () {
    $(this).toggleClass('on');
  });
});

$(function () {
  $('.hidden-link').hover(
    function () {
      $(this).parent().parent().find('.forum-card-title').addClass('on');
      //マウスカーソルが重なった時の処理
    },
    function () {
      $(this).parent().parent().find('.forum-card-title').removeClass('on');
      //マウスカーソルが離れた時の処理
    }
  );
  $('.hidden-link').hover(
    function () {
      $(this).parent().parent().closest('.forum-card, .user-list-card').addClass('on');
      //マウスカーソルが重なった時の処理
    },
    function () {
      $(this).parent().parent().closest('.forum-card, .user-list-card').removeClass('on');
      //マウスカーソルが離れた時の処理
    }
  );
});

// textarea auto resize
$(function () {
  $('textarea.auto-resize')
  .on('change keyup keydown paste cut', function () {
    if ($(this).outerHeight() > this.scrollHeight) {
      $(this).height(1)
    }
    while ($(this).outerHeight() < this.scrollHeight) {
      $(this).height($(this).height() + 1)
    }
  });
});

$(function () {
  let i = 1
  let id = "collapse-comment_return"
  $('.collapse_return').attr("id", _ => id + i++);
});

$(function () {
  let u = 1
  let href = "#collapse-comment_return"
  $('.collapse_btn_return').attr("href", _ => href + u++);
});
