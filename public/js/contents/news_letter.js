// カテゴリー選択
$('#news-letter-category-change').on('change', function () {
  var category_id = $('option:selected').data('category_id');
  var url = '/news_letter/index/' + category_id;
  window.location = url;
});

// 投稿に対してのいいね機能
$(function () {
  $('.news_letter_favorite_ignition').on('click', function () {
    news_letter_id = $(this).attr("news_letter_id");
    news_letter_favorite = $(this).attr("news_letter_favorite");
    click_button = $(this);

    // クリックすると1秒押せないようにする処理
    var $this = $(this)
    $this.css('pointer-events', 'none');
    setTimeout(function () {
      $this.css('pointer-events', '');
    }, 300);

    $.ajax({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      url: '/news_letter_favorite',
      type: 'GET',
      data: { 'news_letter_id': news_letter_id, 'news_letter_favorite': news_letter_favorite },
    })
      .done(function (data) {
        $('.news_letter_favorite_count' + news_letter_id).text(data[1]).change();

        if (data[0] == 0) {
          $(".news_letter_favorite_ignition").attr("news_letter_favorite", "1");
          $('.news_letter_favorite_ignition').children('span').removeClass('heart');
          $('.news_letter_favorite_ignition').children('span').addClass('heart on checked');
        }
        if (data[0] == 1) {
          $(".news_letter_favorite_ignition").attr("news_letter_favorite", "0");
          $('.news_letter_favorite_ignition').children('span').removeClass('heart on checked');
          $('.news_letter_favorite_ignition').children('span').addClass('heart');
        }
      })
      .fail(function (data) {
        console.log(data[0])
        alert('いいね処理失敗');
      });
  });
});

// 投稿のコメントに対してのいいね機能
$(function () {
  $('.news_letter_comment_favorite_ignition').on('click', function () {
    news_letter_comment_id = $(this).attr("news_letter_comment_id");
    news_letter_comment_favorite = $(this).attr("news_letter_comment_favorite");
    click_button = $(this);

    // クリックすると1秒押せないようにする処理
    var $this = $(this)
    $this.css('pointer-events', 'none');
    setTimeout(function () {
      $this.css('pointer-events', '');
    }, 300);

    $.ajax({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      url: '/news_letter_comment_favorite',
      type: 'GET',
      data: { 'news_letter_comment_id': news_letter_comment_id, 'news_letter_comment_favorite': news_letter_comment_favorite },
    })
      .done(function (data) {
        $('.news_letter_comment_favorite_count' + news_letter_comment_id).text(data[1]).change();

        if (data[0] == 0) {
          click_button.attr("news_letter_comment_favorite", "1");
        }
        if (data[0] == 1) {
          click_button.attr("news_letter_comment_favorite", "0");
        }
      })
      .fail(function (data) {
        console.log(data[0])
        alert('いいね処理失敗');
      });
  });
});

// 画像のプレビュー
$('#main_image_preview').on('change', function (e) {
  var reader = new FileReader();
  reader.onload = function (e) {
    $("#sample").attr('src', e.target.result);
  }
  reader.readAsDataURL(e.target.files[0]);
});

// 投稿を編集する時、最初から画像を中央に寄せる
$(function () {
  $('.ql-editor').find('img').addClass('d-block mx-auto');
});

// 多重送信対策
$(function () {
  $('form').submit(function () {
    $(this).find('input[type="submit"], button[type="submit"]').not('#not-disabled').prop('disabled', 'true');
  });
});

// quillオプション
var toolbarOptions = [
  [{ 'size': ['small', false, 'large', 'huge'] }],
  ['bold', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'script': 'super' }, { 'script': 'sub' }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }, { 'align': [] }],
  ['link', 'image', 'video', 'formula'],
  ['clean']
];

const editor = new Quill('#editor', {
  bounds: '#editor',
  modules: {
    toolbar: this.toolbarOptions,
  },
  theme: 'bubble',
});

// コンテンツに画像を表示
function selectLocalImage() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('name', 'image');
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (file.size < 2097152) {
      if (/^image\//.test(file.type)) {
        saveToServer(file);
      } else {
        alert('この拡張子ではファイルをアップロードできません。');
      }
    } else {
      alert('2MB以上の画像はアップロードできません');
    }
  };
}

function saveToServer(file) {
  var form_data = new FormData();
  form_data.append('image', file);
  $.ajax({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    url: '/admin/news_letter/image',
    type: 'POST',
    data: form_data,
    cache: false,
    contentType: false,
    processData: false,
  }).done(function (data) {
    var range = editor.getSelection();
    editor.insertEmbed(range, 'image', data);
    $('.ql-editor').find('img').addClass('d-block mx-auto');
  }).fail(function () {
    alert('2MB以上の画像はアップロードできません。');
  });
}

editor.getModule('toolbar').addHandler('image', () => {
  selectLocalImage();
});

// quillフォーム送信
document.contents_form.subbtn.addEventListener('click', function () {
  document.querySelector('input[name=contents]').value = document.querySelector('.ql-editor').innerHTML;
  document.contents_form.submit();
});
