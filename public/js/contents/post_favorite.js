// 投稿のコメントに対してのいいねの処理
$(function ()
{
	$('.post_favorite_ignition').on('click', function ()
	{
		post_id = $(this).attr("post_id");
		post_favorite = $(this).attr("post_favorite");
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
			url: '/post_favorite',
			type: 'GET',
			data: { 'post_id': post_id, 'post_favorite': post_favorite },
		})
		.done(function (data)
		{
			$('.post_favorite_count' + post_id).text(data[1]).change();

			if ( data[0] == 0 )
			{
				click_button.attr("post_favorite", "1");
				click_button.children().attr('src', '/image/favorite_black_24dp.svg');
			}
			if ( data[0] == 1 )
			{
				click_button.attr("post_favorite", "0");
				click_button.children().attr('src', '/image/favorite_border_black_24dp.svg');
			}
		})
		.fail(function (data)
		{
			alert('いいね処理失敗');
		});
	});
});

// 投稿のコメントに対してのいいねの処理
$(function ()
{
	$('.comment_favorite_ignition').on('click', function ()
	{
		post_comment_id = $(this).attr("post_comment_id");
		post_comment_favorite = $(this).attr("post_comment_favorite");
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
			url: '/post_comment_favorite',
			type: 'GET',
			data: { 'post_comment_id': post_comment_id, 'post_comment_favorite': post_comment_favorite },
		})
		.done(function (data)
		{
			$('.post_comment_favorite_count' + post_comment_id).text(data[1]).change();

			if ( data[0] == 0 )
			{
				click_button.attr("post_comment_favorite", "1");
				click_button.children().attr('src', '/image/favorite_black_24dp.svg');
			}
			if ( data[0] == 1 )
			{
				click_button.attr("post_comment_favorite", "0");
				click_button.children().attr('src', '/image/favorite_border_black_24dp.svg');
			}
		})
		.fail(function (data)
		{
			alert('いいね処理失敗');
		});
	});
});
