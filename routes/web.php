<?php
/* Auth関連 */
Route::group(['middleware' => ['guest']], function(){
  Route::namespace('Auth')->group(function(){
    // 登録画面
    Route::get('/register', 'RegisterController@form')->name('register.form');
    // 登録確認画面
    Route::post('/register/confirm', 'RegisterController@confrim')->name('register.confirm');
    // 登録処理
    Route::post('/register', 'RegisterController@register')->name('register');
    // ログイン画面
    Route::get('/login', 'LoginController@form')->name('login.form');
    // ログイン処理
    Route::post('/login', 'LoginController@login')->name('login');
  });
  // 該当しないURLが入力された時にログイン画面にリダイレクト
  Route::fallback(function(){
    return redirect()->route('login.form');
  });
});

Route::group(['middleware' => ['auth']], function(){
  Route::get('/error', 'ErrorsController');
  // ログアウト
  Route::get('/logout', 'Auth\LoginController@logout')->name('logout');
  // ホーム
  Route::get('/home', 'HomeController')->name('home');
  // post
  Route::resource('post', 'PostsController', ['only' => ['store', 'destroy']]);
  Route::post('toggle/post/favorite/{post}', 'FavoritesController@togglePostFavorite');
  // talk
  Route::resource('/talk', 'TalksController', ['except' => ['index']]);
  Route::get('/talks/{category_id?}', 'TalksController@index')->name('talk.index');
  Route::post('/toggle/announce/{talk}', 'AnnouncesController@toggleAnnounce')->name('toggle.announce');
  // thread
  Route::post('/thread/{you}', 'ThreadsController@store')->name('thread.store');
  Route::post('/group', 'ThreadsController@groupStore')->name('group.store');
  Route::patch('/group', 'ThreadsController@groupUpdate')->name('group.update');
  Route::post('/thread/hide/{thread}', 'ThreadUsersController@threadHide')->name('thread.hide');
  // category
  Route::resource('/category', 'CategoriesController', ['only' => ['store', 'update', 'destroy']]);
  // friend
  Route::get('/friends/{user}', 'FriendsController@index')->name('friend.index');
  Route::post('/toggle/friend/{you}', 'FriendsController@toggleFriend')->name('toggle.friend');
  Route::post('/toggle/friend/favorite/{friend}', 'FriendsController@toggleFriendFavorite')->name('toggle.friend.favorite');
  // user
  Route::get('/users', 'UsersController@index')->name('user.index');
  Route::post('/ajax/users', 'UsersController@getUsers');
  Route::patch('/user/update', 'UsersController@update')->name('user.update');
  // ※※※※※※※※※※一番下に置く※※※※※※※※※※
  Route::get('/{user_id}/{is_favorite?}', 'UsersController@show')->name('user.show');

  // 該当しないURLが入力された時にマイページにリダイレクト
  Route::fallback(function(){
    return redirect()->route('user.show', Auth::id());
  });

});
